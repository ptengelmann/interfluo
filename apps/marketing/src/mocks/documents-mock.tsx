interface DocRow {
  filename: string;
  type: string;
  pages: number;
  status?: 'classifying' | 'done';
}

const ROWS: DocRow[] = [
  { filename: '01-title-register.pdf', type: 'Title Register', pages: 4, status: 'done' },
  { filename: '02-lease.pdf', type: 'Lease', pages: 5, status: 'done' },
  { filename: '03-ta6-property-information.pdf', type: 'TA6 Property Information', pages: 5, status: 'done' },
  { filename: '04-ta7-leasehold-information.pdf', type: 'TA7 Leasehold Information', pages: 3, status: 'done' },
  { filename: '05-ta10-fittings-and-contents.pdf', type: 'TA10 Fittings & Contents', pages: 2, status: 'done' },
  { filename: '06-con29-local-authority.pdf', type: 'CON29 Local Authority', pages: 3, status: 'done' },
  { filename: '07-drainage-and-water-search.pdf', type: 'Drainage & Water Search', pages: 2, status: 'classifying' },
];

export function DocumentsMock() {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-[0_1px_2px_rgba(30,28,24,.06)]">
      <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-muted">Documents · uploaded</p>
        <span className="text-[12px] text-ink-soft">7 of 9 · 2 classifying</span>
      </div>
      <ul className="divide-y divide-line">
        {ROWS.map((d) => (
          <li key={d.filename} className="flex items-center gap-3.5 px-5 py-3">
            <div className="grid size-8 place-items-center rounded-md bg-paper-dim text-ink-soft text-[12px]">
              {d.status === 'classifying' ? (
                <span className="inline-block size-3 animate-spin rounded-full border-2 border-muted border-t-transparent" />
              ) : '✓'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-[13.5px] text-ink">{d.filename}</p>
              <p className="text-[11.5px] text-muted">{d.pages} pages · {d.status === 'classifying' ? 'classifying…' : 'classified at 99%'}</p>
            </div>
            <span
              className={
                d.status === 'classifying'
                  ? 'rounded-full bg-paper-dim px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted'
                  : 'rounded-full bg-accent-tint px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent-dark'
              }
            >
              {d.type}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
