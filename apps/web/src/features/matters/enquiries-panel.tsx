'use client';

import { CitationChip } from '@/components/citation-chip';
import { PriorityBadge } from '@/components/severity-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { EnquiriesExport } from '@/features/matters/export-actions';
import { useApi } from '@/lib/api';
import type { Enquiry, EnquiryCategory } from '@interfluo/core';
import { useMemo, useState } from 'react';

const CATEGORY_LABELS: Record<EnquiryCategory, string> = {
  title: 'Title',
  boundaries: 'Boundaries',
  covenants: 'Covenants',
  easements: 'Easements',
  planning: 'Planning',
  building_regulations: 'Building Regs',
  environmental: 'Environmental',
  utilities: 'Utilities',
  leasehold: 'Leasehold',
  searches: 'Searches',
  fixtures: 'Fixtures',
  occupiers: 'Occupiers',
  disputes: 'Disputes',
  other: 'Other',
};

type Filter = 'all' | 'accepted' | 'rejected' | 'pending';

export function EnquiriesPanel({
  matterId,
  enquiries,
  onUpdate,
}: {
  matterId: string;
  enquiries: Enquiry[];
  onUpdate: () => Promise<unknown>;
}) {
  const api = useApi();
  const [filter, setFilter] = useState<Filter>('all');
  const [pending, setPending] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  const counts = useMemo(
    () => ({
      all: enquiries.length,
      accepted: enquiries.filter((e) => e.status === 'accepted' || e.status === 'edited').length,
      rejected: enquiries.filter((e) => e.status === 'rejected').length,
      pending: enquiries.filter((e) => e.status === 'suggested').length,
    }),
    [enquiries],
  );

  const visible = useMemo(() => {
    if (filter === 'all') return enquiries;
    if (filter === 'accepted')
      return enquiries.filter((e) => e.status === 'accepted' || e.status === 'edited');
    if (filter === 'rejected') return enquiries.filter((e) => e.status === 'rejected');
    return enquiries.filter((e) => e.status === 'suggested');
  }, [filter, enquiries]);

  const setStatus = async (e: Enquiry, next: Enquiry['status']) => {
    setPending(e.id);
    try {
      await api.updateEnquiry(matterId, e.id, { status: next });
      await onUpdate();
    } finally {
      setPending(null);
    }
  };

  const startEdit = (e: Enquiry) => {
    setEditing(e.id);
    setDraft(e.editedQuestion ?? e.question);
  };

  const cancelEdit = () => {
    setEditing(null);
    setDraft('');
  };

  const saveEdit = async (e: Enquiry) => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    setPending(e.id);
    try {
      const original = e.question;
      const isUnchangedFromOriginal = trimmed === original;
      await api.updateEnquiry(matterId, e.id, {
        editedQuestion: isUnchangedFromOriginal ? null : trimmed,
        status: isUnchangedFromOriginal ? 'suggested' : 'edited',
      });
      await onUpdate();
      setEditing(null);
      setDraft('');
    } finally {
      setPending(null);
    }
  };

  const revert = async (e: Enquiry) => {
    setPending(e.id);
    try {
      await api.updateEnquiry(matterId, e.id, { editedQuestion: null, status: 'suggested' });
      await onUpdate();
    } finally {
      setPending(null);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          {(['all', 'pending', 'accepted', 'rejected'] as const).map((f) => (
            <button
              type="button"
              key={f}
              onClick={() => setFilter(f)}
              className={
                filter === f
                  ? 'inline-flex items-center gap-2 rounded-pill bg-ink px-4 py-1.5 text-[12.5px] font-semibold text-on-ink'
                  : 'inline-flex items-center gap-2 rounded-pill border border-line bg-surface px-4 py-1.5 text-[12.5px] text-ink-soft hover:border-line-strong'
              }
            >
              <span className="capitalize">{f}</span>
              <span className="opacity-60">{counts[f]}</span>
            </button>
          ))}
        </div>
        <EnquiriesExport matterId={matterId} enquiries={enquiries} />
      </div>

      <ul className="flex flex-col gap-3">
        {visible.map((e) => {
          const accepted = e.status === 'accepted' || e.status === 'edited';
          const rejected = e.status === 'rejected';
          const isEditing = editing === e.id;
          const displayText = e.editedQuestion ?? e.question;
          return (
            <li key={e.id}>
              <Card
                className={
                  accepted ? 'border-accent/30 bg-accent-tint/40' : rejected ? 'opacity-50' : ''
                }
              >
                <CardBody className="flex flex-col gap-3.5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <PriorityBadge priority={e.priority} />
                      <Badge tone="muted">{CATEGORY_LABELS[e.category]}</Badge>
                      {e.status === 'edited' && <Badge tone="accent">Edited</Badge>}
                    </div>
                    {!isEditing && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEdit(e)}
                          disabled={pending === e.id}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant={accepted ? 'primary' : 'secondary'}
                          loading={pending === e.id}
                          onClick={() => setStatus(e, accepted ? 'suggested' : 'accepted')}
                        >
                          {accepted ? 'Accepted' : 'Accept'}
                        </Button>
                        <Button
                          size="sm"
                          variant={rejected ? 'danger' : 'ghost'}
                          loading={pending === e.id}
                          onClick={() => setStatus(e, rejected ? 'suggested' : 'rejected')}
                        >
                          {rejected ? 'Rejected' : 'Reject'}
                        </Button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="flex flex-col gap-3">
                      <textarea
                        rows={Math.min(12, Math.max(4, Math.ceil(draft.length / 90)))}
                        value={draft}
                        onChange={(ev) => setDraft(ev.target.value)}
                        className="w-full resize-y rounded-md border border-line bg-surface px-3.5 py-3 text-[15px] leading-[1.65] text-ink focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      />
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[12.5px] text-muted">
                          Editing this enquiry will mark it as <Badge tone="accent">Edited</Badge>{' '}
                          and preserve the original draft.
                        </p>
                        <div className="flex items-center gap-2">
                          {e.editedQuestion && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => revert(e)}
                              loading={pending === e.id}
                            >
                              Revert to draft
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" onClick={cancelEdit}>
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => saveEdit(e)}
                            loading={pending === e.id}
                            disabled={!draft.trim()}
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => startEdit(e)}
                      className="w-full cursor-text rounded-md text-left text-[15.5px] leading-[1.65] text-ink hover:bg-paper-dim/40 px-2 -mx-2 py-1 transition-colors"
                      title="Click to edit"
                    >
                      {displayText}
                    </button>
                  )}

                  {!isEditing && e.editedQuestion && (
                    <details className="text-[12.5px] text-muted">
                      <summary className="cursor-pointer hover:text-ink-soft">
                        Show original draft
                      </summary>
                      <p className="mt-2 italic text-ink-soft">{e.question}</p>
                    </details>
                  )}

                  <p className="text-[13.5px] italic text-ink-soft">{e.rationale}</p>

                  {e.citations.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {e.citations.map((c, idx) => (
                        <CitationChip
                          key={`${c.documentId}-${c.pageNumbers.join('_')}-${idx}`}
                          citation={c}
                        />
                      ))}
                    </div>
                  )}
                </CardBody>
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
