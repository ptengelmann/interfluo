import { IconBriefcase, IconBuilding, IconScales, IconShield } from '@/components/icons';

const ROLES = [
  {
    icon: IconBuilding,
    title: 'Conveyancing partners',
    body: 'Visibility into every matter, every enquiry, every export. See where your fee-earners spend hours and where Interfluo saves them.',
  },
  {
    icon: IconScales,
    title: 'Fee-earners & licensed conveyancers',
    body: 'Cut four hours of drafting per matter to thirty minutes of review. The product fits behind one screen and one verb.',
  },
  {
    icon: IconShield,
    title: 'COLPs & COFAs',
    body: 'Append-only audit log, citation-grounded output, calibrated severity language. Defensible by construction under any SRA file inspection.',
  },
  {
    icon: IconBriefcase,
    title: 'In-house counsel',
    body: 'Same engine for high-volume residential and commercial matters at scale. UK data residency by default.',
  },
];

export function BuiltFor() {
  return (
    <section id="built-for" className="border-b border-line/60 bg-paper-dim/40">
      <div className="mx-auto max-w-[1180px] px-6 py-24 sm:py-28 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Built for the way your firm works</p>
          <h2 className="mt-5 text-[clamp(32px,4.4vw,52px)] font-semibold leading-[1.05] tracking-[-0.02em] text-ink">
            Trusted across the conveyancing practice.
          </h2>
          <p className="mt-5 text-[16.5px] leading-[1.55] text-ink-soft">
            From the partner signing off the file to the fee-earner doing the drafting to the COLP
            under audit. Each role gets what they actually need.
          </p>
        </div>

        <div className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:gap-x-16">
          {ROLES.map((r) => (
            <div key={r.title}>
              <r.icon className="text-accent" />
              <h3 className="mt-5 text-[20px] font-semibold tracking-tight text-ink">{r.title}</h3>
              <p className="mt-3 text-[14.5px] leading-[1.65] text-ink-soft">{r.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
