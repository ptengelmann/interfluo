export const metadata = { title: 'Privacy · Interfluo' };

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-[820px] px-6 py-20 lg:px-10">
      <p className="eyebrow">Privacy notice</p>
      <h1 className="mt-5 text-[clamp(36px,5vw,56px)] font-semibold leading-[1.05] tracking-[-0.02em] text-ink">
        What we hold, where it lives, how to delete it.
      </h1>
      <p className="mt-6 max-w-2xl italic text-muted text-[14px]">
        A formal privacy notice will be issued before any pilot firm uploads matter data. This page summarises the commitments we already build around.
      </p>

      <div className="mt-12 divide-y divide-line border-y border-line">
        <Sec title="What we process">
          Personal data of fee-earners (name, work email, Clerk user identifier) and the contents of matter documents uploaded by the firm. Interfluo is the data processor; the firm is the data controller for matter data.
        </Sec>
        <Sec title="Where it lives">
          Application database and blob storage in AWS London (eu-west-2). Anthropic API calls run in zero-retention mode under a Data Processing Addendum. No training on customer data; no retention beyond the request lifecycle.
        </Sec>
        <Sec title="Right to delete">
          Matter-level data deletion within thirty days of written request. Audit-log entries retained for the lesser of six years or the regulatory retention period in your jurisdiction, then purged.
        </Sec>
        <Sec title="Contact">
          Data queries:{' '}
          <a className="font-semibold text-accent-dark hover:underline" href="mailto:privacy@interfluo.co">
            privacy@interfluo.co
          </a>
          .
        </Sec>
      </div>
    </article>
  );
}

function Sec({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-3 py-8 md:grid-cols-[220px_1fr] md:gap-10">
      <h2 className="text-[16px] font-semibold tracking-tight text-ink">{title}</h2>
      <p className="text-[14.5px] leading-[1.7] text-ink-soft">{children}</p>
    </section>
  );
}
