'use client';

import { useCurrentMatterId } from '@/features/matters/matter-context';
import { useViewer } from '@/features/viewer/viewer-context';
import { cn } from '@/lib/cn';
import type { Citation } from '@interfluo/core';
import { DOCUMENT_TYPE_LABELS, formatPages } from '@interfluo/core';
import { useState } from 'react';

export function CitationChip({ citation }: { citation: Citation }) {
  const [hover, setHover] = useState(false);
  const matterId = useCurrentMatterId();
  const { open: openViewer } = useViewer();
  const label = `${DOCUMENT_TYPE_LABELS[citation.documentType]} · ${formatPages(citation.pageNumbers)}`;
  const canOpen = Boolean(matterId);

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        disabled={!canOpen}
        onClick={() => {
          if (matterId) openViewer({ matterId, citation });
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        title={canOpen ? 'Open source document' : undefined}
        className={cn(
          'group/cite inline-flex items-center gap-1.5 rounded-sm border-l-2 border-line bg-transparent px-2 py-0.5 text-[12.5px] text-muted',
          'hover:text-ink hover:border-accent focus-visible:text-ink focus-visible:border-accent',
          'transition-colors',
          canOpen ? 'cursor-pointer' : 'cursor-default',
        )}
      >
        <svg
          width="11"
          height="13"
          viewBox="0 0 11 13"
          fill="none"
          aria-hidden="true"
          className="opacity-70"
        >
          <path
            d="M1 1.5A1 1 0 0 1 2 .5h4.5L10 4v7.5a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-10z"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
          <path d="M6.5.5v3.5a.5.5 0 0 0 .5.5h3" stroke="currentColor" strokeWidth="1" />
        </svg>
        {label}
        {canOpen && (
          <span
            aria-hidden="true"
            className="ml-0.5 -translate-x-0.5 text-[12px] opacity-0 transition-all group-hover/cite:translate-x-0 group-hover/cite:opacity-70"
          >
            →
          </span>
        )}
      </button>
      {hover && (
        <span
          role="tooltip"
          className="pointer-events-none absolute left-0 top-full z-30 mt-2 w-80 max-w-xs rounded-md border border-line bg-surface p-3 text-left font-sans text-[13px] leading-relaxed text-ink-soft shadow-[var(--shadow-raised)]"
        >
          <span className="label mb-1.5 block">{citation.documentName}</span>
          <span className="block italic">"{citation.quote}"</span>
          {canOpen && (
            <span className="mt-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-dark">
              Click to open source
            </span>
          )}
        </span>
      )}
    </span>
  );
}
