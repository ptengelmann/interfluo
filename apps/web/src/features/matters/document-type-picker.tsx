'use client';

import { useEffect, useRef, useState } from 'react';
import { DOCUMENT_TYPES, DOCUMENT_TYPE_LABELS, type DocumentType } from '@interfluo/core';
import { DocumentTypeLabel } from '@/components/document-type-label';
import { useApi } from '@/lib/api';

export function DocumentTypePicker({
  matterId,
  documentId,
  currentType,
  onChanged,
}: {
  matterId: string;
  documentId: string;
  currentType: DocumentType;
  onChanged: () => Promise<unknown>;
}) {
  const api = useApi();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState<DocumentType | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const handleSelect = async (next: DocumentType) => {
    if (next === currentType) {
      setOpen(false);
      return;
    }
    setSaving(next);
    try {
      await api.updateDocument(matterId, documentId, { documentType: next });
      await onChanged();
      setOpen(false);
    } finally {
      setSaving(null);
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title="Click to reclassify"
        className="cursor-pointer transition-opacity hover:opacity-80"
      >
        <DocumentTypeLabel type={currentType} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-30 mt-1.5 w-72 max-h-80 overflow-auto rounded-md border border-line bg-surface p-1.5 shadow-[var(--shadow-raised)]">
          <p className="px-2.5 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted">
            Reclassify as…
          </p>
          {DOCUMENT_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handleSelect(t)}
              disabled={saving !== null}
              className={
                t === currentType
                  ? 'flex w-full items-center justify-between gap-2 rounded-sm bg-accent-tint px-2.5 py-1.5 text-left text-[13px] font-medium text-accent-dark'
                  : 'flex w-full items-center justify-between gap-2 rounded-sm px-2.5 py-1.5 text-left text-[13px] text-ink-soft hover:bg-paper-dim hover:text-ink disabled:opacity-50'
              }
            >
              <span>{DOCUMENT_TYPE_LABELS[t]}</span>
              {saving === t && (
                <span className="inline-block size-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
              )}
              {t === currentType && saving === null && <span className="text-[10px]">●</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
