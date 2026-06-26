import { randomUUID } from 'node:crypto';
import type { FirmTemplate, FirmTemplateKind } from '@interfluo/core';
import type { AppContext } from '../context';
import { ApiError } from '../errors';

const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export async function listTemplates(ctx: AppContext, firmId: string): Promise<FirmTemplate[]> {
  return ctx.repo.listFirmTemplates(firmId);
}

export async function uploadTemplate(
  ctx: AppContext,
  firmId: string,
  kind: FirmTemplateKind,
  filename: string,
  buffer: Buffer,
): Promise<FirmTemplate> {
  if (!filename.toLowerCase().endsWith('.docx')) {
    throw new ApiError('not_docx', 'Only .docx templates are supported', 422);
  }
  const id = `tpl_${randomUUID()}`;
  const storageKey = `firm-templates/${firmId}/${kind}-${id}.docx`;
  await ctx.blobs.put(storageKey, buffer, DOCX_MIME);

  const existing = await ctx.repo.getFirmTemplate(firmId, kind);
  if (existing) {
    try {
      await ctx.blobs.delete(existing.storageKey);
    } catch (err) {
      ctx.logger.warn({ err, storageKey: existing.storageKey }, 'Old template blob delete failed');
    }
  }

  const template: FirmTemplate = {
    id,
    firmId,
    kind,
    filename,
    storageKey,
    sizeBytes: buffer.length,
    uploadedAt: new Date().toISOString(),
  };
  await ctx.repo.upsertFirmTemplate(template);
  ctx.logger.info({ firmId, kind, id, sizeBytes: buffer.length }, 'Uploaded firm template');
  return template;
}

export async function deleteTemplate(
  ctx: AppContext,
  firmId: string,
  kind: FirmTemplateKind,
): Promise<void> {
  const deleted = await ctx.repo.deleteFirmTemplate(firmId, kind);
  if (!deleted) {
    throw new ApiError('template_not_found', 'No template of that kind for this firm', 404);
  }
  try {
    await ctx.blobs.delete(deleted.storageKey);
  } catch (err) {
    ctx.logger.warn({ err, storageKey: deleted.storageKey }, 'Template blob delete failed');
  }
}

export async function loadTemplateBuffer(
  ctx: AppContext,
  firmId: string,
  kind: FirmTemplateKind,
): Promise<Buffer | null> {
  const template = await ctx.repo.getFirmTemplate(firmId, kind);
  if (!template) return null;
  return ctx.blobs.get(template.storageKey);
}
