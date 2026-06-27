const QA = [
  {
    q: 'Are you just another AI wrapper?',
    a: 'The language model is commodity. The calibration to UK conveyancing is not. Seventeen document-type extractors that drop any fact they cannot ground in a verbatim quote. A structured library of twenty-one conveyancing issue codes across seven categories, each with a calibrated severity default, named false-positive traps, and a default enquiry template that the pipeline can adapt. A benchmark scorer with a composite Matter Quality Score (signal detection, taxonomy routing, over-flagging, hallucination, enquiry density) that runs against every prompt or model change. The current corpus of six internal benchmark scenarios averages 99 out of 100; in that corpus, every planted issue was detected and there were zero over-flags of routine items. An append-only audit log that preserves the original AI wording alongside every fee-earner edit, built for SRA file inspection. An integration roadmap for LEAP and Actionstep. Wiring a model up takes a weekend; the conveyancing-specific work behind Interfluo does not.',
  },
  {
    q: 'Is this legal advice?',
    a: 'No. Interfluo is drafting infrastructure. The supervising fee-earner reviews every output, decides what to accept, and remains the responsible professional under the SRA Code of Conduct. We do not sign, send, or certify anything.',
  },
  {
    q: 'What about scanned PDFs?',
    a: 'A per-page text-density check identifies pages without an extractable text layer; those pages are recovered with vision OCR. Native text pages are left alone for accuracy. A scanned annexe buried in a mixed-mode pack is never silently missed.',
  },
  {
    q: 'Where does the data live?',
    a: 'Production data resident in the United Kingdom. The model API runs in zero-retention mode under a Data Processing Addendum, with no training on customer data. Per-firm encryption keys and Cyber Essentials Plus accreditation in flight for Year 1; ISO 27001 to follow in Year 2.',
  },
  {
    q: 'Does it integrate with my case management system?',
    a: 'PDFs in, .docx out today, no integration required. LEAP and Actionstep integrations follow in Phase 2. We integrate; we do not replace.',
  },
  {
    q: 'What happens if it misses something material?',
    a: 'The fee-earner is the responsible professional and reviews every output. The audit log records the order, timing, and identity of every accept and edit. If a fee-earner adopts a draft, that adoption is their professional act, with a defensible record of what was put in front of them.',
  },
  {
    q: 'Why "Interfluo"?',
    a: 'Latin: to flow between. The connective tissue between buyer, seller, lender, and solicitor. It is also a quiet refusal to sound like a chatbot.',
  },
];

export function Faq() {
  return (
    <section id="faq" className="relative border-b border-line/60 bg-paper">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(to_right,transparent,rgba(23,24,28,0.08),transparent)]"
      />

      <div className="mx-auto max-w-[1180px] px-6 py-24 sm:py-28 lg:px-10">
        <div className="grid gap-x-16 gap-y-12 md:grid-cols-[0.85fr_1.6fr]">
          <aside className="md:sticky md:top-28 md:self-start">
            <p className="eyebrow">Frequently asked</p>
            <h2 className="mt-5 text-[clamp(32px,4.2vw,48px)] font-semibold leading-[1.05] tracking-[-0.02em] text-ink">
              The questions a partner asks first.
            </h2>
            <p className="mt-6 max-w-sm text-[14.5px] leading-[1.65] text-ink-soft">
              Conveyancing partners evaluate carefully. Below are the answers we give on the first
              call, written down so you can read them before booking it.
            </p>
            <div className="mt-8 inline-flex items-center gap-2 text-[11.5px] uppercase tracking-[0.16em] text-muted">
              <span className="h-px w-8 bg-line-strong" />
              {QA.length} answers
            </div>
          </aside>

          <dl className="border-t border-line">
            {QA.map((item, i) => (
              <div
                key={item.q}
                className="group grid grid-cols-[44px_1fr] gap-x-5 border-b border-line py-9 transition-colors hover:bg-paper-dim/30 sm:grid-cols-[56px_1fr] sm:gap-x-7"
              >
                <span className="font-display italic text-[26px] leading-none tracking-[-0.02em] text-muted transition-colors group-hover:text-accent-dark">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <dt className="text-[17px] font-semibold leading-snug tracking-[-0.005em] text-ink">
                    {item.q}
                  </dt>
                  <dd className="mt-3.5 text-[14.5px] leading-[1.7] text-ink-soft">{item.a}</dd>
                </div>
              </div>
            ))}

            <p className="mt-10 text-[13px] text-muted">
              Anything missing?{' '}
              <a
                href="mailto:hello@interfluo.co"
                className="font-medium text-accent-dark underline-offset-4 hover:underline"
              >
                Email us
              </a>{' '}
              and we will add it.
            </p>
          </dl>
        </div>
      </div>
    </section>
  );
}
