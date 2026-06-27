import { runPipeline } from '@interfluo/ai';
import type { MatterPipelineStatus, PageContent } from '@interfluo/core';
import { extractPdfContent } from '@interfluo/pdf';
import type { AppContext } from '../context';
import { ApiError } from '../errors';

async function setStatus(
  ctx: AppContext,
  matterId: string,
  patch: Partial<MatterPipelineStatus>,
): Promise<void> {
  const current = (await ctx.repo.getPipelineStatus(matterId)) ?? {
    matterId,
    status: 'draft',
    stage: 'idle',
    progress: 0,
    message: '',
    startedAt: null,
    completedAt: null,
    error: null,
  };
  await ctx.repo.setPipelineStatus({ ...current, ...patch });
}

export async function processMatter(ctx: AppContext, matterId: string): Promise<void> {
  const matter = await ctx.repo.getMatter(matterId);
  if (!matter) throw new ApiError('matter_not_found', 'Matter not found', 404);

  const documents = await ctx.repo.listDocuments(matterId);
  if (documents.length === 0) {
    throw new ApiError('no_documents', 'Cannot process: no documents uploaded', 400);
  }

  await ctx.repo.clearDerivedData(matterId);

  await setStatus(ctx, matterId, {
    status: 'extracting',
    stage: 'extraction',
    progress: 5,
    message: 'Re-reading PDFs',
    startedAt: new Date().toISOString(),
    completedAt: null,
    error: null,
  });
  await ctx.repo.updateMatter(matterId, { status: 'extracting' });

  const documentsWithPages: Array<{ document: (typeof documents)[number]; pages: PageContent[] }> =
    [];
  for (const doc of documents) {
    const buffer = await ctx.blobs.get(doc.storageKey);
    if (!buffer) {
      ctx.logger.warn({ documentId: doc.id }, 'Blob missing — skipping');
      continue;
    }
    const extraction = await extractPdfContent(buffer);
    documentsWithPages.push({
      document: doc,
      pages: extraction.pages.map((p) => ({
        pageNumber: p.pageNumber,
        text: p.text,
        width: p.width,
        height: p.height,
      })),
    });
  }

  try {
    const result = await runPipeline(ctx.ai, { matter, documentsWithPages }, async (event) => {
      const stageToStatus: Record<typeof event.stage, MatterPipelineStatus['status']> = {
        extraction: 'extracting',
        analysis: 'analysing',
        enquiries: 'generating',
        report: 'generating',
        done: 'ready_for_review',
      };
      await setStatus(ctx, matterId, {
        status: stageToStatus[event.stage],
        stage:
          event.stage === 'extraction'
            ? 'extraction'
            : event.stage === 'analysis'
              ? 'analysis'
              : event.stage === 'enquiries' || event.stage === 'report'
                ? 'generation'
                : 'done',
        progress: event.progress,
        message: event.message,
      });
    });

    await ctx.repo.addFacts(result.facts);
    await ctx.repo.addRisks(result.risks);
    await ctx.repo.addEnquiries(result.enquiries);
    await ctx.repo.saveReport(result.report);
    await ctx.repo.updateMatter(matterId, { status: 'ready_for_review' });
    await setStatus(ctx, matterId, {
      status: 'ready_for_review',
      stage: 'done',
      progress: 100,
      message: 'Complete',
      completedAt: new Date().toISOString(),
      error: null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown pipeline error';
    ctx.logger.error({ err, matterId }, 'Pipeline failed');
    await ctx.repo.updateMatter(matterId, { status: 'failed' });
    await setStatus(ctx, matterId, {
      status: 'failed',
      stage: 'done',
      progress: 100,
      message: 'Pipeline failed',
      completedAt: new Date().toISOString(),
      error: message,
    });
    throw err;
  }
}
