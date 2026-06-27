import { IconCheck, IconMap, IconQuote, IconRecord } from '@/components/icons';

const POINTS = [
  {
    icon: IconQuote,
    title: 'Citation-grounded by construction',
    body: 'Every drafted line carries a verbatim quote and a page reference. If the model cannot ground a fact in the source text, the fact is dropped. Never hallucinated.',
  },
  {
    icon: IconCheck,
    title: 'Severity calibrated for conveyancing',
    body: 'A structured library of twenty-one conveyancing issue codes across seven categories, each with a calibrated severity default and named false-positive traps. Validated against six internal adversarial conveyancing benchmark scenarios with an average Matter Quality Score of 99 out of 100. "Critical" actually means deal-blocker.',
  },
  {
    icon: IconRecord,
    title: 'Audit log for COLP defensibility',
    body: 'Append-only record of every accept, edit, reject, and export per matter, with the original AI wording preserved alongside each fee-earner change. The supervising fee-earner remains the responsible professional, with the evidence trail to prove it.',
  },
  {
    icon: IconMap,
    title: 'UK-hosted, zero-retention',
    body: 'Production data resident in the United Kingdom. Model API in zero-retention mode under a DPA. No training on your data. Per-firm encryption keys in flight.',
  },
];

export function Trust() {
  return (
    <section id="trust" className="border-b border-line/60 bg-paper-dim/40">
      <div className="mx-auto max-w-[1180px] px-6 py-24 sm:py-28 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Trust</p>
          <h2 className="mt-5 text-[clamp(32px,4.4vw,52px)] font-semibold leading-[1.05] tracking-[-0.02em] text-ink">
            Defensible by construction.
          </h2>
          <p className="mt-5 text-[16.5px] leading-[1.55] text-ink-soft">
            The features your COLP cares about, built as foundations rather than marketing.
          </p>
        </div>

        <div className="mt-16 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
          {POINTS.map((p) => (
            <div key={p.title}>
              <p.icon className="text-accent" />
              <h3 className="mt-5 text-[17px] font-semibold tracking-tight text-ink">{p.title}</h3>
              <p className="mt-2 text-[14px] leading-[1.6] text-ink-soft">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
