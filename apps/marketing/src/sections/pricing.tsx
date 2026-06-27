import { IconArrowRight, IconCheck } from '@/components/icons';
import Link from 'next/link';

const TIERS = [
  {
    label: 'Pilot',
    price: 'Free',
    sub: 'first 3 matters · end-to-end',
    description:
      'Run your first three matters at no cost. The maths is obvious before any commitment.',
    features: [
      'White-glove onboarding',
      'Up to 3 matters at zero cost',
      'Full audit log per matter',
      'Direct line to the build team',
    ],
    cta: 'Request a pilot',
  },
  {
    label: 'Per matter',
    price: '£40–60',
    sub: 'per completed matter · monthly invoice',
    description: 'Paid per matter. Charge as a disbursement or absorb into fee. Your choice.',
    features: [
      'Unlimited fee-earners',
      'Unlimited firm templates',
      '.docx export · house style',
      'UK data residency',
    ],
    cta: 'Request a pilot',
    primary: true,
  },
  {
    label: 'Subscription',
    price: '£500–2,000',
    sub: 'per month · 50+ matters',
    description:
      'Predictable monthly cost replaces per-matter billing. Priority support and quarterly calibration review.',
    features: [
      'Everything in per-matter',
      'Priority support SLA',
      'Quarterly calibration review',
      'SSO & user provisioning',
    ],
    cta: 'Talk to us',
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="border-b border-line/60">
      <div className="mx-auto max-w-[1180px] px-6 py-24 sm:py-28 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Pricing</p>
          <h2 className="mt-5 text-[clamp(32px,4.4vw,52px)] font-semibold leading-[1.05] tracking-[-0.02em] text-ink">
            Per matter. The arithmetic does itself.
          </h2>
          <p className="mt-5 text-[16.5px] leading-[1.55] text-ink-soft">
            A firm charges the client £800–1,500 per matter. Recovering four hours of fee-earner
            time for £50 is the easiest spreadsheet in legal tech.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {TIERS.map((t) => (
            <div
              key={t.label}
              className={
                t.primary
                  ? 'flex flex-col rounded-xl border border-accent/35 bg-accent-tint/40 p-8 shadow-[0_22px_50px_-32px_rgba(30,28,24,.45)]'
                  : 'flex flex-col rounded-xl border border-line bg-surface p-8'
              }
            >
              <p className="eyebrow">{t.label}</p>
              <p className="mt-5 text-[44px] font-semibold leading-none tracking-tight text-ink tnum">
                {t.price}
              </p>
              <p className="mt-2 text-[12.5px] text-muted">{t.sub}</p>
              <p className="mt-6 text-[14px] leading-[1.6] text-ink-soft">{t.description}</p>
              <ul className="mt-6 flex flex-col gap-2.5">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[13.5px] text-ink-soft">
                    <IconCheck className="mt-0.5 shrink-0 text-accent" width={16} height={16} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/pilot"
                className={
                  t.primary
                    ? 'group mt-8 inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-accent pl-5 pr-1.5 text-[13.5px] font-semibold text-white transition-colors hover:bg-accent-dark'
                    : 'mt-8 inline-flex h-10 items-center justify-center rounded-full border border-line bg-surface px-5 text-[13.5px] font-semibold text-ink transition-colors hover:border-line-strong'
                }
              >
                {t.cta}
                {t.primary && (
                  <span className="grid size-7 place-items-center rounded-full bg-white/20 transition-transform duration-200 group-hover:translate-x-0.5">
                    <IconArrowRight width={12} height={12} />
                  </span>
                )}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
