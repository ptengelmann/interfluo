interface Entry {
  type: string;
  tone: 'accent' | 'neutral' | 'danger';
  summary: string;
  by: string;
  when: string;
}

const ENTRIES: Entry[] = [
  {
    type: 'Report on Title exported',
    tone: 'accent',
    summary: 'MAT-2026-0142 · Report on Title.docx',
    by: 'a.patel',
    when: 'Just now',
  },
  {
    type: 'Enquiry edited',
    tone: 'neutral',
    summary: 'Updated wording on ground rent enquiry (P1)',
    by: 'a.patel',
    when: '3 min ago',
  },
  {
    type: 'Enquiry accepted',
    tone: 'accent',
    summary: '"Please confirm the freeholder consent under restriction…"',
    by: 'a.patel',
    when: '5 min ago',
  },
  {
    type: 'Enquiry rejected',
    tone: 'neutral',
    summary: 'Boundary maintenance enquiry. Covered by deed.',
    by: 'a.patel',
    when: '8 min ago',
  },
  {
    type: 'Pipeline completed',
    tone: 'accent',
    summary: '19 enquiries · 7 risks · 10-section Report on Title',
    by: 'system',
    when: '12 min ago',
  },
  {
    type: 'Pipeline started',
    tone: 'neutral',
    summary: '9 documents · 197 facts extracted',
    by: 'a.patel',
    when: '13 min ago',
  },
];

export function ActivityMock() {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-[0_1px_2px_rgba(30,28,24,.06)]">
      <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-muted">
          Activity · append-only
        </p>
        <span className="text-[12px] text-ink-soft">MAT-2026-0142</span>
      </div>
      <ul className="divide-y divide-line">
        {ENTRIES.map((e, i) => (
          <li key={i} className="flex items-start gap-4 px-5 py-3.5">
            <div className="flex w-[200px] flex-col gap-1 shrink-0">
              <span
                className={
                  e.tone === 'accent'
                    ? 'inline-flex w-fit rounded-full bg-accent-tint px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent-dark'
                    : 'inline-flex w-fit rounded-full bg-paper-dim px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft'
                }
              >
                {e.type}
              </span>
              <span className="text-[11px] text-muted">{e.when}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-[13px] text-ink-soft">{e.summary}</p>
              <p className="mt-0.5 font-mono text-[10.5px] text-muted">by {e.by}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
