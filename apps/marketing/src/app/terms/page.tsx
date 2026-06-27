export const metadata = {
  title: 'Terms — Interfluo',
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-[760px] px-6 py-20 text-[15px] leading-[1.7] text-ink-soft">
      <p className="label">Terms</p>
      <h1 className="font-display mt-4 text-[42px] leading-tight text-ink">
        Terms of use (draft).
      </h1>
      <p className="mt-6 italic text-muted">
        Placeholder pending formal counsel review. Substantive terms will be agreed in writing with each pilot firm before any matter data is uploaded.
      </p>

      <h2 className="font-display mt-12 text-[24px] text-ink">Nature of the service</h2>
      <p className="mt-3">
        Interfluo is drafting infrastructure for UK residential conveyancing. It is not legal advice and does not replace the professional judgement of the supervising fee-earner. The fee-earner remains the responsible professional under the SRA Code of Conduct for the work product they adopt.
      </p>

      <h2 className="font-display mt-10 text-[24px] text-ink">Acceptable use</h2>
      <p className="mt-3">
        For use by SRA-regulated firms (or equivalent jurisdictional regulator) in the ordinary course of conveyancing practice. No upload of data subject to legal privilege you do not control. No use for purposes outside conveyancing without prior written agreement.
      </p>

      <h2 className="font-display mt-10 text-[24px] text-ink">Liability</h2>
      <p className="mt-3">
        Liability is limited to direct damages capped at fees paid in the preceding 12 months. Interfluo's output is reviewed and adopted (or rejected) by the fee-earner — the audit log records this. Indirect, consequential, and reputational damages are excluded to the maximum extent permitted by law.
      </p>

      <h2 className="font-display mt-10 text-[24px] text-ink">Contact</h2>
      <p className="mt-3">
        Contract queries: <a className="text-accent-dark underline" href="mailto:legal@interfluo.co">legal@interfluo.co</a>.
      </p>
    </article>
  );
}
