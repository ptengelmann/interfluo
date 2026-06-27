export const metadata = {
  title: 'Privacy — Interfluo',
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-[760px] px-6 py-20 text-[15px] leading-[1.7] text-ink-soft">
      <p className="label">Privacy</p>
      <h1 className="font-display mt-4 text-[42px] leading-tight text-ink">
        Privacy notice (draft).
      </h1>
      <p className="mt-6 italic text-muted">
        This is a placeholder pending formal counsel review. The points below summarise the data-handling commitments Interfluo is built around.
      </p>

      <h2 className="font-display mt-12 text-[24px] text-ink">What we process</h2>
      <p className="mt-3">
        Personal data of the firms' fee-earners (name, work email, Clerk user id), and the contents of conveyancing matter documents uploaded by the firm. Interfluo is the data processor; the firm is the data controller for matter data.
      </p>

      <h2 className="font-display mt-10 text-[24px] text-ink">Where it lives</h2>
      <p className="mt-3">
        Application database and blob storage hosted in AWS London (eu-west-2). Anthropic API calls use zero-retention mode under a Data Processing Addendum — no training on customer data, no retention beyond the request lifecycle.
      </p>

      <h2 className="font-display mt-10 text-[24px] text-ink">Right to delete</h2>
      <p className="mt-3">
        Matter-level data deletion within 30 days of written request. Audit-log entries are retained for the lesser of 6 years or the regulatory retention period applicable to your jurisdiction, after which they are purged.
      </p>

      <h2 className="font-display mt-10 text-[24px] text-ink">Contact</h2>
      <p className="mt-3">
        Data queries: <a className="text-accent-dark underline" href="mailto:privacy@interfluo.co">privacy@interfluo.co</a>.
      </p>
    </article>
  );
}
