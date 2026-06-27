export const metadata = { title: 'Terms · Interfluo' };

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-[820px] px-6 py-20 lg:px-10">
      <p className="eyebrow">Terms</p>
      <h1 className="mt-5 text-[clamp(36px,5vw,56px)] font-semibold leading-[1.05] tracking-[-0.02em] text-ink">
        Drafting infrastructure, not legal advice.
      </h1>
      <p className="mt-6 max-w-2xl italic text-muted text-[14px]">
        Formal terms will be agreed in writing with each pilot firm before any matter data is uploaded. Substantive terms summarised below.
      </p>

      <div className="mt-12 divide-y divide-line border-y border-line">
        <Sec title="Nature of the service">
          Interfluo is drafting infrastructure for UK residential conveyancing. It is not legal advice and does not replace the professional judgement of the supervising fee-earner. The fee-earner remains the responsible professional under the SRA Code of Conduct for any work product they adopt.
        </Sec>
        <Sec title="Acceptable use">
          For use by SRA-regulated firms (or equivalent regulator) in the ordinary course of conveyancing practice. No upload of data subject to legal privilege you do not control. No use for purposes outside conveyancing without prior written agreement.
        </Sec>
        <Sec title="Liability">
          Liability is limited to direct damages capped at fees paid in the preceding twelve months. Interfluo&rsquo;s output is reviewed and adopted (or rejected) by the fee-earner. The audit log records this. Indirect, consequential, and reputational damages are excluded to the maximum extent permitted by law.
        </Sec>
        <Sec title="Contact">
          Contract queries:{' '}
          <a className="font-semibold text-accent-dark hover:underline" href="mailto:legal@interfluo.co">
            legal@interfluo.co
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
