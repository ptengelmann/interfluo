import { randomUUID } from 'node:crypto';
import type {
  CreateMatterInput,
  Matter,
  MatterDetail,
  UpdateMatterInput,
} from '@interfluo/core';
import type { AppContext } from '../context';
import { ApiError } from '../errors';

export async function createMatter(
  ctx: AppContext,
  firmId: string,
  input: CreateMatterInput,
): Promise<Matter> {
  const now = new Date().toISOString();
  const matter: Matter = {
    id: `mat_${randomUUID()}`,
    firmId,
    reference: input.reference,
    propertyAddress: input.propertyAddress ?? null,
    buyerName: input.buyerName ?? null,
    sellerName: input.sellerName ?? null,
    tenure: input.tenure ?? 'unknown',
    status: 'draft',
    createdAt: now,
    updatedAt: now,
  };
  await ctx.repo.createMatter(matter);
  await ctx.repo.setPipelineStatus({
    matterId: matter.id,
    status: 'draft',
    stage: 'idle',
    progress: 0,
    message: 'Matter created. Upload documents to begin.',
    startedAt: null,
    completedAt: null,
    error: null,
  });
  return matter;
}

export async function listMatters(ctx: AppContext, firmId: string): Promise<Matter[]> {
  return ctx.repo.listMatters(firmId);
}

async function loadMatterScoped(ctx: AppContext, firmId: string, id: string): Promise<Matter> {
  const matter = await ctx.repo.getMatter(id);
  if (!matter || matter.firmId !== firmId) {
    throw new ApiError('matter_not_found', 'Matter not found', 404);
  }
  return matter;
}

export async function getMatterDetail(
  ctx: AppContext,
  firmId: string,
  id: string,
): Promise<MatterDetail> {
  const matter = await loadMatterScoped(ctx, firmId, id);
  const [documents, facts, risks, enquiries, report, pipeline] = await Promise.all([
    ctx.repo.listDocuments(id),
    ctx.repo.listFacts(id),
    ctx.repo.listRisks(id),
    ctx.repo.listEnquiries(id),
    ctx.repo.getReport(id),
    ctx.repo.getPipelineStatus(id),
  ]);
  return {
    matter,
    documents,
    facts,
    risks,
    enquiries,
    report,
    pipeline: pipeline ?? {
      matterId: id,
      status: matter.status,
      stage: 'idle',
      progress: 0,
      message: '',
      startedAt: null,
      completedAt: null,
      error: null,
    },
  };
}

export async function updateMatter(
  ctx: AppContext,
  firmId: string,
  id: string,
  patch: UpdateMatterInput,
): Promise<Matter> {
  await loadMatterScoped(ctx, firmId, id);
  const updates: Partial<Matter> = {};
  if (patch.reference !== undefined) updates.reference = patch.reference;
  if (patch.propertyAddress !== undefined) updates.propertyAddress = patch.propertyAddress;
  if (patch.buyerName !== undefined) updates.buyerName = patch.buyerName;
  if (patch.sellerName !== undefined) updates.sellerName = patch.sellerName;
  if (patch.tenure !== undefined) updates.tenure = patch.tenure;
  const updated = await ctx.repo.updateMatter(id, updates);
  if (!updated) throw new ApiError('matter_not_found', 'Matter not found', 404);
  return updated;
}

export async function deleteMatter(ctx: AppContext, firmId: string, id: string): Promise<void> {
  await loadMatterScoped(ctx, firmId, id);
  await ctx.repo.deleteMatter(id);
}

export async function ensureMatterInFirm(
  ctx: AppContext,
  firmId: string,
  id: string,
): Promise<Matter> {
  return loadMatterScoped(ctx, firmId, id);
}
