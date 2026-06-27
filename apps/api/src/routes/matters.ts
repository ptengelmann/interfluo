import { zValidator } from '@hono/zod-validator';
import {
  createMatterInputSchema,
  updateDocumentInputSchema,
  updateEnquiryInputSchema,
  updateMatterInputSchema,
} from '@interfluo/core';
import { type Context, Hono } from 'hono';
import { getAuth } from '../auth';
import type { AppContext } from '../context';
import { ApiError } from '../errors';
import { recordAudit } from '../services/audit-service';
import { ingestDocument } from '../services/document-service';
import { type DocxArtifact, exportEnquiries, exportReport } from '../services/export-service';
import {
  createMatter,
  deleteMatter,
  ensureMatterInFirm,
  getMatterDetail,
  listMatters,
  updateMatter,
} from '../services/matter-service';
import { processMatter } from '../services/pipeline-service';

export function buildMattersRouter(ctx: AppContext) {
  const app = new Hono();

  app.get('/', async (c) => {
    const { firmId } = getAuth(c);
    const matters = await listMatters(ctx, firmId);
    return c.json({ matters });
  });

  app.post('/', zValidator('json', createMatterInputSchema), async (c) => {
    const { firmId, userId } = getAuth(c);
    const input = c.req.valid('json');
    const matter = await createMatter(ctx, firmId, input);
    await recordAudit(ctx, {
      firmId,
      userId,
      eventType: 'matter.created',
      matterId: matter.id,
      targetType: 'matter',
      targetId: matter.id,
      payload: {
        reference: matter.reference,
        propertyAddress: matter.propertyAddress,
        tenure: matter.tenure,
      },
    });
    return c.json({ matter }, 201);
  });

  app.get('/:id', async (c) => {
    const { firmId } = getAuth(c);
    const detail = await getMatterDetail(ctx, firmId, c.req.param('id'));
    return c.json(detail);
  });

  app.patch('/:id', zValidator('json', updateMatterInputSchema), async (c) => {
    const { firmId, userId } = getAuth(c);
    const id = c.req.param('id');
    const patch = c.req.valid('json');
    const matter = await updateMatter(ctx, firmId, id, patch);
    await recordAudit(ctx, {
      firmId,
      userId,
      eventType: 'matter.updated',
      matterId: id,
      targetType: 'matter',
      targetId: id,
      payload: { changes: patch },
    });
    return c.json({ matter });
  });

  app.delete('/:id', async (c) => {
    const { firmId, userId } = getAuth(c);
    const id = c.req.param('id');
    const matter = await ensureMatterInFirm(ctx, firmId, id);
    const docs = await ctx.repo.listDocuments(id);
    await deleteMatter(ctx, firmId, id);
    await recordAudit(ctx, {
      firmId,
      userId,
      eventType: 'matter.deleted',
      matterId: null,
      targetType: 'matter',
      targetId: id,
      payload: { reference: matter.reference, documentCount: docs.length },
    });
    for (const d of docs) {
      try {
        await ctx.blobs.delete(d.storageKey);
      } catch (err) {
        ctx.logger.warn(
          { err, storageKey: d.storageKey },
          'Blob delete failed during matter delete',
        );
      }
    }
    return c.body(null, 204);
  });

  app.patch(
    '/:matterId/documents/:documentId',
    zValidator('json', updateDocumentInputSchema),
    async (c) => {
      const { firmId, userId } = getAuth(c);
      const matterId = c.req.param('matterId');
      await ensureMatterInFirm(ctx, firmId, matterId);
      const documentId = c.req.param('documentId');
      const existing = await ctx.repo.getDocument(documentId);
      if (!existing || existing.matterId !== matterId) {
        throw new ApiError('document_not_found', 'Document not found', 404);
      }
      const patch = c.req.valid('json');
      const updated = await ctx.repo.updateDocument(documentId, patch);
      if (!updated) throw new ApiError('document_not_found', 'Document not found', 404);
      if (patch.documentType && patch.documentType !== existing.documentType) {
        await recordAudit(ctx, {
          firmId,
          userId,
          eventType: 'document.reclassified',
          matterId,
          targetType: 'document',
          targetId: documentId,
          payload: {
            filename: existing.filename,
            from: existing.documentType,
            to: patch.documentType,
          },
        });
      }
      return c.json({ document: updated });
    },
  );

  app.delete('/:matterId/documents/:documentId', async (c) => {
    const { firmId, userId } = getAuth(c);
    const matterId = c.req.param('matterId');
    await ensureMatterInFirm(ctx, firmId, matterId);
    const documentId = c.req.param('documentId');
    const doc = await ctx.repo.deleteDocument(documentId);
    if (!doc || doc.matterId !== matterId) {
      throw new ApiError('document_not_found', 'Document not found', 404);
    }
    await recordAudit(ctx, {
      firmId,
      userId,
      eventType: 'document.deleted',
      matterId,
      targetType: 'document',
      targetId: documentId,
      payload: { filename: doc.filename, documentType: doc.documentType },
    });
    try {
      await ctx.blobs.delete(doc.storageKey);
    } catch (err) {
      ctx.logger.warn({ err, storageKey: doc.storageKey }, 'Blob delete failed');
    }
    return c.body(null, 204);
  });

  app.post('/:id/documents', async (c) => {
    const { firmId, userId } = getAuth(c);
    const id = c.req.param('id');
    await ensureMatterInFirm(ctx, firmId, id);

    const form = await c.req.formData();
    const files = form.getAll('files');
    if (files.length === 0) {
      throw new ApiError('no_files', 'Upload at least one file under "files"', 400);
    }

    const documents = [];
    for (const file of files) {
      if (typeof file === 'string') continue;
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        throw new ApiError('not_pdf', `Only PDFs are supported (got ${file.name})`, 422);
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      const { document } = await ingestDocument(ctx, id, file.name, buffer);
      documents.push(document);
      await recordAudit(ctx, {
        firmId,
        userId,
        eventType: 'document.uploaded',
        matterId: id,
        targetType: 'document',
        targetId: document.id,
        payload: {
          filename: document.filename,
          documentType: document.documentType,
          classificationConfidence: document.classificationConfidence,
          pageCount: document.pageCount,
          sizeBytes: document.sizeBytes,
          extractionMethod: document.extractionMethod,
        },
      });
    }

    return c.json({ documents }, 201);
  });

  app.post('/:id/process', async (c) => {
    const { firmId, userId } = getAuth(c);
    const id = c.req.param('id');
    await ensureMatterInFirm(ctx, firmId, id);
    await recordAudit(ctx, {
      firmId,
      userId,
      eventType: 'pipeline.started',
      matterId: id,
      targetType: 'matter',
      targetId: id,
    });
    queueMicrotask(async () => {
      try {
        await processMatter(ctx, id);
        await recordAudit(ctx, {
          firmId,
          userId,
          eventType: 'pipeline.completed',
          matterId: id,
          targetType: 'matter',
          targetId: id,
        });
      } catch (err) {
        ctx.logger.error({ err, matterId: id }, 'Background processing crashed');
        await recordAudit(ctx, {
          firmId,
          userId,
          eventType: 'pipeline.failed',
          matterId: id,
          targetType: 'matter',
          targetId: id,
          payload: { error: err instanceof Error ? err.message : 'Unknown error' },
        });
      }
    });
    return c.json({ ok: true, matterId: id, started: true }, 202);
  });

  app.get('/:matterId/documents/:documentId/pdf', async (c) => {
    const { firmId } = getAuth(c);
    const matterId = c.req.param('matterId');
    await ensureMatterInFirm(ctx, firmId, matterId);
    const documentId = c.req.param('documentId');
    const doc = await ctx.repo.getDocument(documentId);
    if (!doc || doc.matterId !== matterId) {
      throw new ApiError('document_not_found', 'Document not found', 404);
    }
    const buffer = await ctx.blobs.get(doc.storageKey);
    if (!buffer) {
      throw new ApiError('blob_missing', 'Underlying file is missing from storage', 410);
    }
    const bytes = new Uint8Array(buffer.byteLength);
    bytes.set(buffer);
    const ascii = doc.filename.replace(/[^\x20-\x7E]+/g, '_');
    const encoded = encodeURIComponent(doc.filename);
    return c.body(bytes, 200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${ascii}"; filename*=UTF-8''${encoded}`,
      'Content-Length': String(bytes.byteLength),
      'Cache-Control': 'private, max-age=300',
      'X-Document-Type': doc.documentType,
      'X-Page-Count': String(doc.pageCount),
    });
  });

  app.get('/:id/pipeline', async (c) => {
    const { firmId } = getAuth(c);
    const id = c.req.param('id');
    await ensureMatterInFirm(ctx, firmId, id);
    const status = await ctx.repo.getPipelineStatus(id);
    if (!status) throw new ApiError('matter_not_found', 'Matter not found', 404);
    return c.json(status);
  });

  app.patch(
    '/:matterId/enquiries/:enquiryId',
    zValidator('json', updateEnquiryInputSchema),
    async (c) => {
      const { firmId, userId } = getAuth(c);
      const matterId = c.req.param('matterId');
      await ensureMatterInFirm(ctx, firmId, matterId);
      const enquiryId = c.req.param('enquiryId');
      const patch = c.req.valid('json');
      const previous = await ctx.repo
        .listEnquiries(matterId)
        .then((all) => all.find((e) => e.id === enquiryId));
      const updated = await ctx.repo.updateEnquiry(enquiryId, patch);
      if (!updated || updated.matterId !== matterId) {
        throw new ApiError('enquiry_not_found', 'Enquiry not found', 404);
      }
      const auditEventType = pickEnquiryEventType(previous?.status, updated.status, patch);
      if (auditEventType) {
        await recordAudit(ctx, {
          firmId,
          userId,
          eventType: auditEventType,
          matterId,
          targetType: 'enquiry',
          targetId: enquiryId,
          payload: {
            previousStatus: previous?.status ?? null,
            newStatus: updated.status,
            editedQuestion: updated.editedQuestion,
            originalQuestion: previous?.question,
          },
        });
      }
      return c.json({ enquiry: updated });
    },
  );

  app.get('/:id/audit', async (c) => {
    const { firmId } = getAuth(c);
    const id = c.req.param('id');
    await ensureMatterInFirm(ctx, firmId, id);
    const events = await ctx.repo.listAuditEvents({ firmId, matterId: id, limit: 500 });
    return c.json({ events });
  });

  app.get('/:id/export/enquiries.docx', async (c) => {
    const { firmId, userId } = getAuth(c);
    const id = c.req.param('id');
    await ensureMatterInFirm(ctx, firmId, id);
    const artifact = await exportEnquiries(ctx, id);
    await recordAudit(ctx, {
      firmId,
      userId,
      eventType: 'export.enquiries',
      matterId: id,
      targetType: 'matter',
      targetId: id,
      payload: { filename: artifact.filename, sizeBytes: artifact.buffer.length },
    });
    return sendDocx(c, artifact);
  });

  app.get('/:id/export/report.docx', async (c) => {
    const { firmId, userId } = getAuth(c);
    const id = c.req.param('id');
    await ensureMatterInFirm(ctx, firmId, id);
    const artifact = await exportReport(ctx, id);
    await recordAudit(ctx, {
      firmId,
      userId,
      eventType: 'export.report',
      matterId: id,
      targetType: 'matter',
      targetId: id,
      payload: { filename: artifact.filename, sizeBytes: artifact.buffer.length },
    });
    return sendDocx(c, artifact);
  });

  return app;
}

function pickEnquiryEventType(
  previousStatus: string | undefined,
  newStatus: string,
  patch: { editedQuestion?: string | null | undefined; status?: string | undefined },
):
  | 'enquiry.accepted'
  | 'enquiry.rejected'
  | 'enquiry.suggested'
  | 'enquiry.edited'
  | 'enquiry.reverted'
  | null {
  if (patch.editedQuestion !== undefined) {
    if (patch.editedQuestion === null) return 'enquiry.reverted';
    return 'enquiry.edited';
  }
  if (patch.status === undefined || newStatus === previousStatus) return null;
  if (newStatus === 'accepted') return 'enquiry.accepted';
  if (newStatus === 'rejected') return 'enquiry.rejected';
  if (newStatus === 'suggested') return 'enquiry.suggested';
  if (newStatus === 'edited') return 'enquiry.edited';
  return null;
}

function sendDocx(c: Context, artifact: DocxArtifact) {
  const ascii = artifact.filename.replace(/[^\x20-\x7E]+/g, '_');
  const encoded = encodeURIComponent(artifact.filename);
  const bytes = new Uint8Array(artifact.buffer.byteLength);
  bytes.set(artifact.buffer);
  return c.body(bytes, 200, {
    'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'Content-Disposition': `attachment; filename="${ascii}"; filename*=UTF-8''${encoded}`,
    'Content-Length': String(bytes.byteLength),
    'Cache-Control': 'no-store',
  });
}
