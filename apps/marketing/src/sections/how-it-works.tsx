const STEPS = [
  {
    n: '01',
    title: 'Drop in the pack',
    body:
      'Drag-drop the draft contract, TR1, title register, TA6 / TA7 / TA10, the lease (if leasehold), CON29, drainage and water search, environmental search, mortgage offer. Scanned PDFs are handled by vision OCR.',
    detail: 'Per-page text density check — any low-density page is recovered via Claude vision, the rest stays on native text extraction.',
  },
  {
    n: '02',
    title: 'Interfluo reads everything',
    body:
      'Five-stage pipeline: classify each document, extract structured facts with verbatim quotes, identify risks across the pack, draft ranked enquiries, write the Report on Title in a fixed 10-section structure.',
    detail: 'Every fact carries {document, page, quote}. Anti-pattern table keeps severity calibrated — "critical" means deal-blocker, not "this is a thing".',
  },
  {
    n: '03',
    title: 'You review and adopt',
    body:
      'Side-by-side: source PDF viewer + AI output. Click any citation chip to jump to the exact cited page with the quote highlighted. Accept, reject, or edit each enquiry. Export to your firm template.',
    detail: 'Every accept / reject / edit / export is recorded in an append-only audit log per matter — your record of professional review.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative">
      <div className="mx-auto max-w-[1240px] px-6 py-20 sm:py-28">
        <div className="max-w-2xl">
          <p className="label">How it works</p>
          <h2 className="font-display mt-4 text-[clamp(32px,4vw,52px)] leading-[1.05] text-ink">
            One screen. One verb.
          </h2>
          <p className="mt-5 text-[17px] leading-[1.6] text-ink-soft">
            Draft my enquiries and Report on Title from this pack. The whole product fits behind that sentence.
          </p>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-lg border border-line bg-line lg:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="flex flex-col gap-4 bg-surface p-8">
              <span className="font-display text-[20px] italic text-accent">{s.n}</span>
              <h3 className="text-[20px] font-semibold tracking-tight text-ink">{s.title}</h3>
              <p className="text-[14.5px] leading-relaxed text-ink-soft">{s.body}</p>
              <p className="mt-auto pt-4 text-[12.5px] leading-relaxed text-muted border-t border-line">
                {s.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
