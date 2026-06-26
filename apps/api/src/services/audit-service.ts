import { randomUUID } from 'node:crypto';
import type { AuditEvent, AuditEventType } from '@interfluo/core';
import type { AppContext } from '../context';

export interface RecordAuditOpts {
  firmId: string;
  userId: string;
  eventType: AuditEventType;
  matterId?: string | null;
  targetType?: string | null;
  targetId?: string | null;
  payload?: Record<string, unknown> | null;
}

/**
 * Record an immutable audit event. Failures here MUST NOT break the
 * underlying user action — we log and swallow. The audit table is a
 * liability shield; missing a row is regrettable, but blocking an
 * accept/edit because the audit write timed out is worse.
 */
export async function recordAudit(ctx: AppContext, opts: RecordAuditOpts): Promise<void> {
  const event: AuditEvent = {
    id: `aud_${randomUUID()}`,
    firmId: opts.firmId,
    matterId: opts.matterId ?? null,
    userId: opts.userId,
    eventType: opts.eventType,
    targetType: opts.targetType ?? null,
    targetId: opts.targetId ?? null,
    payload: opts.payload ?? null,
    createdAt: new Date().toISOString(),
  };
  try {
    await ctx.repo.appendAuditEvent(event);
  } catch (err) {
    ctx.logger.error({ err, event }, 'Audit append failed');
  }
}
