export const metadata = {
  title: 'Privacy — Interfluo',
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-[820px] px-6 sm:px-10">
      <div className="grid grid-cols-3 items-center border-b border-line py-3 text-[11.5px] uppercase tracking-[0.18em] text-muted">
        <span className="text-left">§ Privacy</span>
        <span className="text-center font-display italic normal-case tracking-normal text-[14px] text-ink">
          Draft notice
        </span>
        <span className="text-right">Pending counsel review</span>
      </div>

      <section className="pt-20 pb-16 sm:pt-28">
        <h1 className="font-display text-[clamp(40px,5.2vw,68px)] leading-[1.04] tracking-tight text-ink">
          What we hold, where it lives, how to delete it.
        </h1>
        <p className="mt-8 max-w-2xl italic text-muted text-[14px]">
          A formal privacy notice will be issued before any pilot firm uploads matter data. This page summarises the commitments we already build around.
        </p>
      </section>

      <Sec title="What we process">
        Personal data of fee-earners (name, work email, Clerk user identifier) and the contents of matter documents uploaded by the firm. Interfluo is the data processor; the firm is the data controller for matter data.
      </Sec>
      <Sec title="Where it lives">
        Application database and blob storage in AWS London (eu-west-2). Anthropic API calls run in zero-retention mode under a Data Processing Addendum — no training on customer data; no retention beyond the request lifecycle.
      </Sec>
      <Sec title="Right to delete">
        Matter-level data deletion within thirty days of a written request. Audit-log entries retained for the lesser of six years or the regulatory retention period in your jurisdiction, then purged.
      </Sec>
      <Sec title="Contact">
        Data queries:{' '}
        <a className="border-b border-accent text-ink hover:text-accent" href="mailto:privacy@interfluo.co">
          privacy@interfluo.co
        </a>
        .
      </Sec>
    </article>
  );
}

function Sec({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-3 border-t border-line py-10 md:grid-cols-[200px_1fr] md:gap-10">
      <h2 className="font-display italic text-[22px] leading-tight text-ink">{title}</h2>
      <p className="text-[15.5px] leading-[1.7] text-ink-soft">{children}</p>
    </section>
  );
}
