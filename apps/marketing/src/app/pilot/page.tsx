import { PilotForm } from '@/components/pilot-form';

export const metadata = {
  title: 'Pilot — Interfluo',
  description: 'Request access to run your first conveyancing matter through Interfluo.',
};

export default function PilotPage() {
  return (
    <article className="mx-auto max-w-[1180px] px-6 sm:px-10">
      <div className="grid grid-cols-3 items-center border-b border-line py-3 text-[11.5px] uppercase tracking-[0.18em] text-muted">
        <span className="text-left">§ Pilot</span>
        <span className="text-center font-display italic normal-case tracking-normal text-[14px] text-ink">
          Request access
        </span>
        <span className="text-right">Your first three matters</span>
      </div>

      <section className="pt-20 pb-24 sm:pt-28 sm:pb-32">
        <h1 className="font-display text-[clamp(40px,5.6vw,80px)] leading-[1.04] tracking-tight text-ink">
          Three matters, end-to-end, at no cost.
        </h1>
        <p className="mt-8 max-w-2xl text-[17px] leading-[1.65] text-ink-soft">
          Tell us about your firm. We reply within one working day, schedule a thirty-minute setup call, and provision your workspace. You upload your first real matter on the call, with one of our team alongside you.
        </p>
      </section>

      <section className="border-t border-line py-16 sm:py-24">
        <div className="grid gap-12 md:grid-cols-[1fr_1.3fr] md:gap-20">
          <aside className="flex flex-col gap-10">
            <Block num="01" label="What happens next">
              We email within one working day to book a thirty-minute setup call. We provision your firm in Interfluo, walk you through the workspace, and let you upload your first real pack on the call.
            </Block>
            <Block num="02" label="What we need from you">
              One real conveyancing matter and a fee-earner willing to spend thirty minutes reviewing the output with us on the line. That's it.
            </Block>
            <Block num="03" label="Cost">
              Zero, for the first three matters. After that, £40–60 per matter or a firm subscription if volume justifies it. No per-seat fee, ever.
            </Block>
            <Block num="04" label="Data">
              AWS London. Anthropic zero-retention DPA. Per-firm encryption keys. No training on your data. Right-to-delete on request.
            </Block>
          </aside>
          <PilotForm />
        </div>
      </section>
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
      <p className="font-display italic text-[16px] text-accent">§ {num}</p>
      <p className="mt-1 smallcaps text-[10.5px] text-muted">{label}</p>
      <p className="mt-4 text-[15px] leading-[1.7] text-ink-soft">{children}</p>
    </div>
  );
}
