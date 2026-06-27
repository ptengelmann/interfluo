'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardBody } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import { useApi } from '@/lib/api';
import { formatDateTime } from '@/lib/format';
import type { AuditEvent, AuditEventType } from '@interfluo/core';
import { useCallback, useEffect, useState } from 'react';

const EVENT_LABEL: Record<AuditEventType, string> = {
  'matter.created': 'Matter created',
  'matter.updated': 'Matter details updated',
  'matter.deleted': 'Matter deleted',
  'document.uploaded': 'Document uploaded',
  'document.reclassified': 'Document reclassified',
  'document.deleted': 'Document removed',
  'pipeline.started': 'Pipeline started',
  'pipeline.completed': 'Pipeline completed',
  'pipeline.failed': 'Pipeline failed',
  'enquiry.accepted': 'Enquiry accepted',
  'enquiry.rejected': 'Enquiry rejected',
  'enquiry.suggested': 'Enquiry reset to suggested',
  'enquiry.edited': 'Enquiry edited',
  'enquiry.reverted': 'Enquiry reverted to drafted text',
  'export.enquiries': 'Enquiries exported (.docx)',
  'export.report': 'Report on Title exported (.docx)',
  'firm_template.uploaded': 'Firm template uploaded',
  'firm_template.deleted': 'Firm template deleted',
};

const EVENT_TONE: Record<AuditEventType, 'neutral' | 'accent' | 'danger' | 'muted'> = {
  'matter.created': 'accent',
  'matter.updated': 'neutral',
  'matter.deleted': 'danger',
  'document.uploaded': 'accent',
  'document.reclassified': 'neutral',
  'document.deleted': 'danger',
  'pipeline.started': 'neutral',
  'pipeline.completed': 'accent',
  'pipeline.failed': 'danger',
  'enquiry.accepted': 'accent',
  'enquiry.rejected': 'muted',
  'enquiry.suggested': 'muted',
  'enquiry.edited': 'neutral',
  'enquiry.reverted': 'muted',
  'export.enquiries': 'accent',
  'export.report': 'accent',
  'firm_template.uploaded': 'accent',
  'firm_template.deleted': 'muted',
};

function summarise(event: AuditEvent): string | null {
  const p = event.payload ?? {};
  switch (event.eventType) {
    case 'matter.created':
      return [p.reference, p.propertyAddress].filter(Boolean).join(' — ') || null;
    case 'matter.updated': {
      const changes = (p.changes as Record<string, unknown> | undefined) ?? {};
      const keys = Object.keys(changes);
      return keys.length > 0 ? `Changed: ${keys.join(', ')}` : null;
    }
    case 'document.uploaded':
      return `${p.filename} → classified as ${p.documentType} (${Math.round(((p.classificationConfidence as number) ?? 0) * 100)}%)`;
    case 'document.reclassified':
      return `${p.filename}: ${p.from} → ${p.to}`;
    case 'document.deleted':
      return `${p.filename} (${p.documentType})`;
    case 'enquiry.accepted':
    case 'enquiry.rejected':
    case 'enquiry.suggested':
      return (p.originalQuestion as string | undefined)?.slice(0, 140) ?? null;
    case 'enquiry.edited':
      return (p.editedQuestion as string | undefined)?.slice(0, 140) ?? null;
    case 'export.enquiries':
    case 'export.report':
      return p.filename ? `${p.filename}` : null;
    case 'firm_template.uploaded':
      return `${p.kind}: ${p.filename}`;
    case 'pipeline.failed':
      return (p.error as string | undefined) ?? null;
    default:
      return null;
  }
}

export function AuditPanel({ matterId }: { matterId: string }) {
  const api = useApi();
  const [events, setEvents] = useState<AuditEvent[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await api.listAuditEvents(matterId);
      setEvents(res.events);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load audit events');
    }
  }, [api, matterId]);

  useEffect(() => {
    load();
  }, [load]);

  if (error) {
    return (
      <Card className="border-danger/30 bg-[#f8eeec]">
        <CardBody>
          <p className="text-[14px] text-danger">{error}</p>
        </CardBody>
      </Card>
    );
  }

  if (!events) {
    return (
      <div className="flex items-center gap-3 text-[14px] text-ink-soft">
        <Spinner /> Loading activity…
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <EmptyState
        title="No activity yet"
        description="Audit entries are written when matters, documents, enquiries, exports and pipeline runs change. They're append-only and immutable."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardBody className="text-[13.5px] text-ink-soft">
          <p>
            Every state-changing action on this matter is recorded here. Entries are append-only —
            the firm's record of who did what and when. Useful for COLP / COFA defensibility and any
            post-matter file review.
          </p>
        </CardBody>
      </Card>

      <ol className="flex flex-col gap-2">
        {events.map((e) => {
          const summary = summarise(e);
          return (
            <li key={e.id}>
              <Card>
                <CardBody className="flex items-start gap-4">
                  <div className="flex flex-col items-start gap-1.5 min-w-[200px]">
                    <Badge tone={EVENT_TONE[e.eventType]}>{EVENT_LABEL[e.eventType]}</Badge>
                    <span className="text-[12.5px] text-muted">{formatDateTime(e.createdAt)}</span>
                  </div>
                  <div className="flex-1 min-w-0 text-[13.5px] text-ink-soft">
                    {summary && <p className="leading-relaxed">{summary}</p>}
                    <p className="mt-1 font-mono text-[11.5px] text-muted">by {e.userId}</p>
                  </div>
                </CardBody>
              </Card>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
