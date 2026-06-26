import { Hono } from 'hono';
import { firmTemplateKindSchema } from '@interfluo/core';
import type { AppContext } from '../context';
import { getAuth } from '../auth';
import { ApiError } from '../errors';
import {
  deleteTemplate,
  listTemplates,
  uploadTemplate,
} from '../services/firm-template-service';

export function buildFirmTemplatesRouter(ctx: AppContext) {
  const app = new Hono();

  app.get('/', async (c) => {
    const { firmId } = getAuth(c);
    const templates = await listTemplates(ctx, firmId);
    return c.json({ templates });
  });

  app.post('/', async (c) => {
    const { firmId } = getAuth(c);
    const form = await c.req.formData();
    const file = form.get('file');
    const rawKind = form.get('kind');
    if (!file || typeof file === 'string') {
      throw new ApiError('no_file', 'Upload a .docx file under "file"', 400);
    }
    const kindResult = firmTemplateKindSchema.safeParse(rawKind);
    if (!kindResult.success) {
      throw new ApiError('invalid_kind', 'kind must be "report" or "enquiries"', 422);
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const template = await uploadTemplate(ctx, firmId, kindResult.data, file.name, buffer);
    return c.json({ template }, 201);
  });

  app.delete('/:kind', async (c) => {
    const { firmId } = getAuth(c);
    const kindResult = firmTemplateKindSchema.safeParse(c.req.param('kind'));
    if (!kindResult.success) {
      throw new ApiError('invalid_kind', 'kind must be "report" or "enquiries"', 422);
    }
    await deleteTemplate(ctx, firmId, kindResult.data);
    return c.body(null, 204);
  });

  return app;
}
