import { PilotForm } from '@/components/pilot-form';

export const metadata = {
  title: 'Request a pilot · Interfluo',
  description: 'Run your first conveyancing matter through Interfluo at no cost.',
};

export default function PilotPage() {
  return (
    <article className="mx-auto max-w-[1180px] px-6 py-20 lg:px-10">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Pilot</p>
        <h1 className="mt-5 text-[clamp(38px,5.4vw,68px)] font-semibold leading-[1.04] tracking-[-0.02em] text-ink">
          Three matters, end-to-end, at no cost.
        </h1>
        <p className="mt-6 text-[16.5px] leading-[1.55] text-ink-soft">
          Tell us about your firm. We reply within one working day, schedule a thirty-minute setup call, and provision your workspace. You upload your first real pack on the call with one of our team alongside you.
        </p>
      </div>

      <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
        <aside className="flex flex-col gap-10">
          <Block num="01" label="What happens next">
            We email within one working day to book a thirty-minute setup call. We provision your firm in Interfluo, walk you through the workspace, and let you upload your first real pack on the call.
          </Block>
          <Block num="02" label="What we need from you">
            One real conveyancing matter and a fee-earner willing to spend thirty minutes reviewing the output with us on the line. That&rsquo;s it.
          </Block>
          <Block num="03" label="Cost">
            Zero for the first three matters. £40–60 per matter after that, or a firm subscription if volume justifies it. No per-seat fee, ever.
          </Block>
          <Block num="04" label="Data">
            UK-resident, zero-retention by contract. No training on your data. Right-to-delete on request.
          </Block>
        </aside>
        <div className="rounded-xl border border-line bg-surface p-8 shadow-[0_1px_2px_rgba(30,28,24,.06)]">
          <PilotForm />
        </div>
      </div>
    </article>
  );
}

function Block({
  num,
  label,
  children,
}: {
  num: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline gap-3">
        <span className="text-[14px] font-semibold tabular-nums text-accent">{num}</span>
        <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-muted">{label}</p>
      </div>
      <p className="mt-3 text-[14.5px] leading-[1.7] text-ink-soft">{children}</p>
    </div>
  );
}
