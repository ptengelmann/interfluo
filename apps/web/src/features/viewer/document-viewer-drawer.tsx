'use client';

import { useAuth } from '@clerk/nextjs';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DOCUMENT_TYPE_LABELS, formatPages, primaryPage } from '@interfluo/core';
import { Badge } from '@/components/ui/badge';
import { IconArrowLeft, IconArrowRight, IconQuote, IconX } from '@/components/icons';
import { useViewer } from './viewer-context';
import { API_BASE_URL } from '@/lib/api';

const PdfRenderer = dynamic(
  () => import('./pdf-renderer').then((m) => m.PdfRenderer),
  { ssr: false },
);

const SCALE_OPTIONS = [
  { label: '75%', value: 0.75 },
  { label: '100%', value: 1.0 },
  { label: '125%', value: 1.25 },
  { label: '150%', value: 1.5 },
  { label: '200%', value: 2.0 },
];

export function DocumentViewerDrawer() {
  const { request, close } = useViewer();
  const { getToken } = useAuth();
  const [authHeader, setAuthHeader] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.25);
  const [pageCount, setPageCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!request) return;
    (async () => {
      const token = await getToken();
      if (cancelled) return;
      setAuthHeader(token ? `Bearer ${token}` : null);
    })();
    return () => {
      cancelled = true;
    };
  }, [request, getToken]);

  useEffect(() => {
    if (!request) {
      setPageNumber(1);
      setPageCount(null);
      return;
    }
    setPageNumber(primaryPage(request.citation));
  }, [request]);

  useEffect(() => {
    if (!request) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') setPageNumber((n) => (pageCount ? Math.min(n + 1, pageCount) : n + 1));
      if (e.key === 'ArrowLeft') setPageNumber((n) => Math.max(1, n - 1));
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [request, pageCount, close]);

  const onLoaded = useCallback(
    ({ pageCount: pc }: { pageCount: number; title: string | null }) => {
      setPageCount(pc);
    },
    [],
  );

  const pdfUrl = useMemo(() => {
    if (!request) return null;
    return `${API_BASE_URL}/v1/matters/${request.matterId}/documents/${request.citation.documentId}/pdf`;
  }, [request]);

  if (!request) return null;

  const { citation } = request;
  const showingPage = pageNumber;
  const totalPages = pageCount;
  const citedPages = citation.pageNumbers;
  const onCitedPage = citedPages.includes(showingPage);

  return (
    <div
      className="fixed inset-0 z-40 flex"
      role="dialog"
      aria-modal="true"
      aria-labelledby="viewer-title"
    >
      <button
        type="button"
        aria-label="Close source viewer"
        className="flex-1 bg-ink/40 backdrop-blur-[1px]"
        onClick={close}
      />
      <aside className="flex h-full w-full max-w-[58vw] min-w-[520px] flex-col border-l border-line bg-paper shadow-[var(--shadow-raised)]">
        <header className="flex items-start justify-between gap-4 border-b border-line bg-surface px-6 py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Badge tone="muted">{DOCUMENT_TYPE_LABELS[citation.documentType]}</Badge>
              <span className="text-[12px] text-muted">Source document</span>
            </div>
            <h2
              id="viewer-title"
              className="mt-1.5 truncate text-[16px] font-semibold tracking-tight text-ink"
              title={citation.documentName}
            >
              {citation.documentName}
            </h2>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={close}
              aria-label="Close (Esc)"
              className="rounded-md p-2 text-ink-soft hover:bg-paper-dim hover:text-ink"
            >
              <IconX />
            </button>
          </div>
        </header>

        <div className="flex items-center justify-between gap-4 border-b border-line bg-surface px-6 py-2.5 text-[13px]">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPageNumber((n) => Math.max(1, n - 1))}
              disabled={showingPage <= 1}
              aria-label="Previous page"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-ink-soft hover:bg-paper-dim hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <IconArrowLeft />
            </button>
            <span className="font-mono text-[12.5px] tabular-nums text-ink-soft">
              {showingPage}
              <span className="mx-1 text-muted">/</span>
              {totalPages ?? '…'}
            </span>
            <button
              type="button"
              onClick={() =>
                setPageNumber((n) => (totalPages ? Math.min(totalPages, n + 1) : n + 1))
              }
              disabled={totalPages !== null && showingPage >= totalPages}
              aria-label="Next page"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-ink-soft hover:bg-paper-dim hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <IconArrowRight />
            </button>
            {citedPages.length > 0 && (
              <div className="ml-3 flex items-center gap-1 border-l border-line pl-3">
                <span className="text-[11.5px] uppercase tracking-[0.14em] text-muted">
                  Cited:
                </span>
                {citedPages.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPageNumber(p)}
                    className={
                      p === showingPage
                        ? 'rounded-sm bg-accent px-2 py-0.5 text-[11.5px] font-semibold text-white'
                        : 'rounded-sm border border-line bg-surface px-2 py-0.5 text-[11.5px] text-ink-soft hover:border-accent hover:text-ink'
                    }
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="viewer-scale" className="text-[12px] text-muted">
              Zoom
            </label>
            <select
              id="viewer-scale"
              value={scale}
              onChange={(e) => setScale(Number.parseFloat(e.target.value))}
              className="h-8 rounded-md border border-line bg-surface px-2 text-[12.5px] text-ink"
            >
              {SCALE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="border-b border-line bg-accent-tint/60 px-6 py-3">
          <div className="flex items-start gap-3">
            <IconQuote className="mt-0.5 shrink-0 text-accent-dark" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-dark">
                Cited on {formatPages(citedPages)}
                {!onCitedPage && (
                  <span className="ml-2 text-muted">· currently viewing page {showingPage}</span>
                )}
              </p>
              <p className="mt-1 text-[14px] italic leading-relaxed text-ink">
                "{citation.quote}"
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          {pdfUrl && (
            <PdfRenderer
              url={pdfUrl}
              authHeader={authHeader}
              pageNumber={showingPage}
              scale={scale}
              onLoaded={onLoaded}
            />
          )}
        </div>
      </aside>
    </div>
  );
}
