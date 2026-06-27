import Link from 'next/link';

export function Pricing() {
  return (
    <section id="pricing" className="relative">
      <div className="mx-auto max-w-[1240px] px-6 py-20 sm:py-28">
        <div className="max-w-2xl">
          <p className="label">Pricing</p>
          <h2 className="font-display mt-4 text-[clamp(32px,4vw,52px)] leading-[1.05] text-ink">
            Per matter. The simple maths.
          </h2>
          <p className="mt-5 text-[17px] leading-[1.6] text-ink-soft">
            A firm charges the client £800–£1,500 per matter. Recovering four hours of fee-earner time for £50 is the easiest spreadsheet in legal tech. No per-seat fee — solicitor headcount is small, transaction count is the real volume driver.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          <PlanCard
            label="Pilot"
            price="Free"
            sub="3 matters, end-to-end"
            description="Run three real matters through Interfluo at no cost. You see the output before any commitment. We handle setup and support directly."
            cta="Request a pilot"
            href="/pilot"
            primary
            features={[
              'Up to 3 matters at zero cost',
              'White-glove onboarding',
              'Direct line to the build team',
              'Convert at any point during or after',
            ]}
          />
          <PlanCard
            label="Per matter"
            price="£40–60"
            sub="Billed in your normal cycle"
            description="Paid per matter completed. Bills appear on your monthly statement; charge as a disbursement or absorb into fee — your choice."
            cta="Request a pilot"
            href="/pilot"
            features={[
              'Unlimited fee-earners in your firm',
              'Unlimited document templates',
              'Full audit log per matter',
              'Word & PDF export',
              'UK data residency',
            ]}
          />
          <PlanCard
            label="Firm subscription"
            price="£500–2,000"
            sub="Per month, at volume"
            description="For firms running 50+ matters / month. Predictable monthly cost replaces per-matter billing. Includes priority support and quarterly calibration reviews."
            cta="Talk to us"
            href="/pilot"
            features={[
              'Everything in per-matter',
              'Priority support SLA',
              'Quarterly calibration review',
              'Bespoke template work',
              'SSO & user provisioning',
            ]}
          />
        </div>
      </div>
    </section>
  );
}

function PlanCard({
  label,
  price,
  sub,
  description,
  cta,
  href,
  features,
  primary = false,
}: {
  label: string;
  price: string;
  sub: string;
  description: string;
  cta: string;
  href: string;
  features: string[];
  primary?: boolean;
}) {
  return (
    <div
      className={
        primary
          ? 'flex flex-col gap-6 rounded-lg border border-accent/40 bg-accent-tint/40 p-8 shadow-[var(--shadow-raised)]'
          : 'flex flex-col gap-6 rounded-lg border border-line bg-surface p-8'
      }
    >
      <div>
        <p className="label">{label}</p>
        <p className="font-display mt-3 text-[44px] leading-none text-ink">{price}</p>
        <p className="mt-1 text-[12.5px] text-muted">{sub}</p>
      </div>
      <p className="text-[14px] leading-relaxed text-ink-soft">{description}</p>
      <ul className="flex flex-col gap-2 text-[13.5px] text-ink-soft">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <span aria-hidden className="mt-1 text-accent">✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className={
          primary
            ? 'mt-auto inline-flex h-11 items-center justify-center rounded-md bg-accent px-5 text-[14px] font-semibold text-white hover:bg-accent-dark transition-colors'
            : 'mt-auto inline-flex h-11 items-center justify-center rounded-md border border-line bg-surface px-5 text-[14px] font-semibold text-ink hover:border-line-strong transition-colors'
        }
      >
        {cta}
      </Link>
    </div>
  );
}
