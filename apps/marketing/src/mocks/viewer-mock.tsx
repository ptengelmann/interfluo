/**
 * Mock of the document viewer drawer with quote banner, cited-page pills, and a
 * stylised representation of a PDF page beneath. Demonstrates the citation
 * grounding feature without needing a real screenshot.
 */
export function ViewerMock() {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-[0_1px_2px_rgba(30,28,24,.06)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line bg-surface px-5 py-3.5">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-paper-dim px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
            Lease
          </span>
          <span className="text-[12px] text-muted">Source document</span>
        </div>
        <span className="text-ink-soft text-[14px]">×</span>
      </div>

      {/* Page nav */}
      <div className="flex items-center justify-between border-b border-line px-5 py-2.5 text-[12.5px]">
        <div className="flex items-center gap-1.5">
          <span className="text-ink-soft">←</span>
          <span className="font-mono text-ink-soft">1 / 5</span>
          <span className="text-ink-soft">→</span>
          <div className="ml-3 flex items-center gap-1 border-l border-line pl-3">
            <span className="text-[10.5px] uppercase tracking-[0.14em] text-muted">Cited:</span>
            <span className="rounded-sm bg-accent px-2 py-0.5 text-[11px] font-semibold text-white">
              1
            </span>
            <span className="rounded-sm border border-line bg-surface px-2 py-0.5 text-[11px] text-ink-soft">
              2
            </span>
          </div>
        </div>
        <span className="text-[12px] text-muted">125%</span>
      </div>

      {/* Quote banner */}
      <div className="border-b border-line bg-accent-tint/60 px-5 py-3.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-dark">
          Cited on pp. 1, 2
        </p>
        <p className="mt-1 text-[13px] italic leading-snug text-ink">
          "The Lease was granted on 1 January 1998 for a term of 99 years … the Ground Rent shall
          double on each 25th anniversary of the commencement of the term."
        </p>
      </div>

      {/* Stylised PDF page */}
      <div className="bg-paper-dim/40 p-5">
        <div className="mx-auto aspect-[3/4] max-w-[260px] rounded-md border border-line bg-white p-4 shadow-[0_1px_2px_rgba(30,28,24,.04)]">
          <div className="space-y-1.5">
            <div className="h-2 w-1/3 rounded bg-ink-soft/80" />
            <div className="h-1 w-2/3 rounded bg-line-strong/60" />
          </div>
          <div className="mt-5 space-y-1">
            <div className="h-1 w-full rounded bg-line-strong/40" />
            <div className="h-1 w-[95%] rounded bg-line-strong/40" />
            <div className="h-1 w-[92%] rounded bg-line-strong/40" />
            <div className="h-1 w-[88%] rounded bg-line-strong/40" />
          </div>
          <div className="mt-4 rounded-sm bg-accent/15 px-1.5 py-1 space-y-1">
            <div className="h-1 w-[90%] rounded bg-accent/40" />
            <div className="h-1 w-[80%] rounded bg-accent/40" />
            <div className="h-1 w-[72%] rounded bg-accent/40" />
          </div>
          <div className="mt-4 space-y-1">
            <div className="h-1 w-full rounded bg-line-strong/40" />
            <div className="h-1 w-[60%] rounded bg-line-strong/40" />
          </div>
        </div>
      </div>
    </div>
  );
}
