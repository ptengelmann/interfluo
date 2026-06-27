import { randomUUID } from 'node:crypto';
import { classifyDocument, ocrPdf } from '@interfluo/ai';
import type { Document, PageContent } from '@interfluo/core';
import { extractPdfContent } from '@interfluo/pdf';
import type { AppContext } from '../context';
import { ApiError } from '../errors';

export interface IngestedDocument {
  document: Document;
  pages: PageContent[];
}

// Per-page threshold — a page below this is treated as scanned / no text layer.
// Picking a low number favours over-triggering OCR (cost ~$0.005/page) over
// silently missing critical pages buried in a mixed-mode pack.
const OCR_PAGE_CHAR_THRESHOLD = 60;

interface OcrDecision {
  shouldOcr: boolean;
  reason: 'all_pages_dense' | 'low_density_pages_detected';
  lowDensityPages: { pageNumber: number; chars: number }[];
}

function decideOcr(pages: PageContent[]): OcrDecision {
  const lowDensityPages = pages
    .filter((p) => p.text.length < OCR_PAGE_CHAR_THRESHOLD)
    .map((p) => ({ pageNumber: p.pageNumber, chars: p.text.length }));
  return {
    shouldOcr: lowDensityPages.length > 0,
    reason: lowDensityPages.length > 0 ? 'low_density_pages_detected' : 'all_pages_dense',
    lowDensityPages,
  };
}

export async function ingestDocument(
  ctx: AppContext,
  matterId: string,
  filename: string,
  buffer: Buffer,
): Promise<IngestedDocument> {
  const matter = await ctx.repo.getMatter(matterId);
  if (!matter) throw new ApiError('matter_not_found', 'Matter not found', 404);

  const documentId = `doc_${randomUUID()}`;
  const storageKey = `${matter.firmId}/${matterId}/${documentId}.pdf`;

  ctx.logger.info({ matterId, documentId, filename, size: buffer.length }, 'Ingesting PDF');

  await ctx.blobs.put(storageKey, buffer, 'application/pdf');

  let extraction: Awaited<ReturnType<typeof extractPdfContent>>;
  try {
    extraction = await extractPdfContent(buffer);
  } catch (err) {
    ctx.logger.error({ err, filename }, 'PDF extraction failed');
    throw new ApiError('pdf_parse_failed', `Failed to parse PDF: ${(err as Error).message}`, 422);
  }

  let pages: PageContent[] = extraction.pages.map((p) => ({
    pageNumber: p.pageNumber,
    text: p.text,
    width: p.width,
    height: p.height,
  }));

  let extractionMethod: 'text' | 'ocr' = 'text';
  const decision =
    pages.length > 0
      ? decideOcr(pages)
      : { shouldOcr: false, reason: 'all_pages_dense' as const, lowDensityPages: [] };

  if (decision.shouldOcr) {
    ctx.logger.info(
      {
        documentId,
        filename,
        pageCount: pages.length,
        lowDensityCount: decision.lowDensityPages.length,
        lowDensityPages: decision.lowDensityPages,
        averageChars: pages.length > 0 ? extraction.totalCharacters / pages.length : 0,
      },
      'Low-density pages detected — running vision OCR on the document',
    );
    try {
      const dimensions = pages.map((p) => ({
        pageNumber: p.pageNumber,
        width: p.width,
        height: p.height,
      }));
      const ocrPages = await ocrPdf(ctx.ai, buffer, dimensions);
      // Prefer the OCR text on pages that originally had low density; keep the
      // existing text-layer content on pages that already had good text (it's
      // usually more accurate than vision OCR for native digital text).
      const lowPages = new Set(decision.lowDensityPages.map((p) => p.pageNumber));
      const ocrByPage = new Map(ocrPages.map((p) => [p.pageNumber, p]));
      pages = pages.map((p) => {
        if (!lowPages.has(p.pageNumber)) return p;
        const ocr = ocrByPage.get(p.pageNumber);
        return ocr && ocr.text.length > p.text.length ? ocr : p;
      });
      extractionMethod = 'ocr';
      const ocrCharGains = decision.lowDensityPages.reduce((s, lp) => {
        const ocrText = ocrByPage.get(lp.pageNumber)?.text ?? '';
        return s + Math.max(0, ocrText.length - lp.chars);
      }, 0);
      ctx.logger.info(
        {
          documentId,
          filename,
          pagesEnhanced: decision.lowDensityPages.length,
          charsRecovered: ocrCharGains,
        },
        'OCR complete',
      );
    } catch (err) {
      ctx.logger.error({ err, documentId, filename }, 'OCR failed — using existing text');
      // Keep whatever text we had; downstream extraction may still produce
      // useful results from the readable pages.
    }
  }

  const classification = await classifyDocument(ctx.ai, pages);
  ctx.logger.info(
    {
      documentId,
      filename,
      type: classification.documentType,
      confidence: classification.confidence,
      extractionMethod,
    },
    'Classified document',
  );

  const document: Document = {
    id: documentId,
    matterId,
    filename,
    documentType: classification.documentType,
    classificationConfidence: classification.confidence,
    pageCount: extraction.pageCount,
    sizeBytes: buffer.length,
    uploadedAt: new Date().toISOString(),
    storageKey,
    extractionMethod,
  };

  await ctx.repo.addDocument(document);

  return { document, pages };
}
