import { Hono, type Context } from 'hono';
import { zValidator } from '@hono/zod-validator';
import {
  createMatterInputSchema,
  updateDocumentInputSchema,
  updateEnquiryInputSchema,
  updateMatterInputSchema,
} from '@interfluo/core';
import type { AppContext } from '../context';
import { getAuth } from '../auth';
import { ApiError } from '../errors';
import {
  createMatter,
  deleteMatter,
  ensureMatterInFirm,
  getMatterDetail,
  listMatters,
  updateMatter,
} from '../services/matter-service';
import { ingestDocument } from '../services/document-service';
import { processMatter } from '../services/pipeline-service';
import { exportEnquiries, exportReport, type DocxArtifact } from '../services/export-service';

export function buildMattersRouter(ctx: AppContext) {
  const app = new Hono();

  app.get('/', async (c) => {
    const { firmId } = getAuth(c);
    const matters = await listMatters(ctx, firmId);
    return c.json({ matters });
  });

  app.post('/', zValidator('json', createMatterInputSchema), async (c) => {
    const { firmId } = getAuth(c);
    const input = c.req.valid('json');
    const matter = await createMatter(ctx, firmId, input);
    return c.json({ matter }, 201);
  });

  app.get('/:id', async (c) => {
    const { firmId } = getAuth(c);
    const detail = await getMatterDetail(ctx, firmId, c.req.param('id'));
    return c.json(detail);
  });

  app.patch('/:id', zValidator('json', updateMatterInputSchema), async (c) => {
    const { firmId } = getAuth(c);
    const id = c.req.param('id');
    const patch = c.req.valid('json');
    const matter = await updateMatter(ctx, firmId, id, patch);
    return c.json({ matter });
  });

  app.delete('/:id', async (c) => {
    const { firmId } = getAuth(c);
    const id = c.req.param('id');
    await ensureMatterInFirm(ctx, firmId, id);
    const docs = await ctx.repo.listDocuments(id);
    await deleteMatter(ctx, firmId, id);
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
      const { firmId } = getAuth(c);
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
      return c.json({ document: updated });
    },
  );

  app.delete('/:matterId/documents/:documentId', async (c) => {
    const { firmId } = getAuth(c);
    const matterId = c.req.param('matterId');
    await ensureMatterInFirm(ctx, firmId, matterId);
    const documentId = c.req.param('documentId');
    const doc = await ctx.repo.deleteDocument(documentId);
    if (!doc || doc.matterId !== matterId) {
      throw new ApiError('document_not_found', 'Document not found', 404);
    }
    try {
      await ctx.blobs.delete(doc.storageKey);
    } catch (err) {
      ctx.logger.warn({ err, storageKey: doc.storageKey }, 'Blob delete failed');
    }
    return c.body(null, 204);
  });

  app.post('/:id/documents', async (c) => {
    const { firmId } = getAuth(c);
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
    }

    return c.json({ documents }, 201);
  });

  app.post('/:id/process', async (c) => {
    const { firmId } = getAuth(c);
    const id = c.req.param('id');
    await ensureMatterInFirm(ctx, firmId, id);
    queueMicrotask(async () => {
      try {
        await processMatter(ctx, id);
      } catch (err) {
        ctx.logger.error({ err, matterId: id }, 'Background processing crashed');
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
      const { firmId } = getAuth(c);
      const matterId = c.req.param('matterId');
      await ensureMatterInFirm(ctx, firmId, matterId);
      const enquiryId = c.req.param('enquiryId');
      const patch = c.req.valid('json');
      const updated = await ctx.repo.updateEnquiry(enquiryId, patch);
      if (!updated || updated.matterId !== matterId) {
        throw new ApiError('enquiry_not_found', 'Enquiry not found', 404);
      }
      return c.json({ enquiry: updated });
    },
  );

  app.get('/:id/export/enquiries.docx', async (c) => {
    const { firmId } = getAuth(c);
    const id = c.req.param('id');
    await ensureMatterInFirm(ctx, firmId, id);
    const artifact = await exportEnquiries(ctx, id);
    return sendDocx(c, artifact);
  });

  app.get('/:id/export/report.docx', async (c) => {
    const { firmId } = getAuth(c);
    const id = c.req.param('id');
    await ensureMatterInFirm(ctx, firmId, id);
    const artifact = await exportReport(ctx, id);
    return sendDocx(c, artifact);
  });

  return app;
}

function sendDocx(c: Context, artifact: DocxArtifact) {
  const ascii = artifact.filename.replace(/[^\x20-\x7E]+/g, '_');
  const encoded = encodeURIComponent(artifact.filename);
  const bytes = new Uint8Array(artifact.buffer.byteLength);
  bytes.set(artifact.buffer);
  return c.body(bytes, 200, {
    'Content-Type':
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'Content-Disposition': `attachment; filename="${ascii}"; filename*=UTF-8''${encoded}`,
    'Content-Length': String(bytes.byteLength),
    'Cache-Control': 'no-store',
  });
}
