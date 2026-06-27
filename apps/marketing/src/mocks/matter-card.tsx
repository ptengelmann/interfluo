/**
 * Faithful inline mock of the matter list card from the app, using the same
 * tokens, same typography. Not a screenshot. Used in the hero to
 * show what the product actually looks like.
 */
export function MatterCardMock() {
  return (
    <div className="rounded-xl border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(30,28,24,.06)]">
      <div className="flex items-center gap-5">
        <span
          className="font-display italic text-[34px] leading-none text-ink"
          style={{ letterSpacing: '-0.02em' }}
        >
          if
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3">
            <h3 className="text-[15px] font-semibold tracking-tight text-ink truncate">
              MAT-2026-0142 · Flat 3, 24 Wynyard Terrace
            </h3>
            <span className="rounded-full bg-accent-tint px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-dark">
              Ready for review
            </span>
          </div>
          <p className="mt-1 text-[13px] text-ink-soft truncate">
            London SE17 3JL · leasehold · 9 documents · 19 enquiries drafted
          </p>
        </div>
        <span className="text-ink-soft text-[18px]">→</span>
      </div>
    </div>
  );
}
