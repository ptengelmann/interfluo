import { PilotForm } from '@/components/pilot-form';

export const metadata = {
  title: 'Request a pilot — Interfluo',
  description: 'Run your first conveyancing matter through Interfluo at no cost.',
};

export default function PilotPage() {
  return (
    <section className="mx-auto max-w-[920px] px-6 py-20">
      <p className="label">Request a pilot</p>
      <h1 className="font-display mt-4 text-[clamp(36px,5vw,64px)] leading-[1.05] text-ink">
        Three matters, at no cost.
      </h1>
      <p className="mt-5 max-w-2xl text-[17px] leading-[1.6] text-ink-soft">
        Tell us about your firm and we'll get back to you within one working day. Pilots run on real matters, on a UK-hosted environment, with one of our team on the call when you upload the first pack.
      </p>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <aside className="flex flex-col gap-8 text-[14.5px] text-ink-soft">
          <Block label="What happens next">
            We email you within one working day to schedule a 30-minute setup call. On that call we provision your firm in Interfluo, walk you through the workspace, and let you upload your first real pack.
          </Block>
          <Block label="What we need from you">
            One real conveyancing matter — pack of PDFs ready to upload — and a fee-earner willing to spend 30 minutes reviewing the output with us on the line.
          </Block>
          <Block label="Cost">
            Zero, up to and including three matters. After that, £40–60 per matter or a firm subscription if volume justifies it.
          </Block>
          <Block label="Data">
            Hosted in AWS London (eu-west-2). Anthropic zero-retention API. No training on your data. Right-to-delete on request.
          </Block>
        </aside>
        <PilotForm />
      </div>
    </section>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-l-2 border-accent pl-5">
      <p className="label">{label}</p>
      <p className="mt-2 leading-relaxed">{children}</p>
    </div>
  );
}
