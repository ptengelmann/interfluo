export const metadata = {
  title: 'Terms — Interfluo',
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-[820px] px-6 sm:px-10">
      <div className="grid grid-cols-3 items-center border-b border-line py-3 text-[11.5px] uppercase tracking-[0.18em] text-muted">
        <span className="text-left">§ Terms</span>
        <span className="text-center font-display italic normal-case tracking-normal text-[14px] text-ink">
          Draft terms
        </span>
        <span className="text-right">Pending counsel review</span>
      </div>

      <section className="pt-20 pb-16 sm:pt-28">
        <h1 className="font-display text-[clamp(40px,5.2vw,68px)] leading-[1.04] tracking-tight text-ink">
          Drafting infrastructure, not legal advice.
        </h1>
        <p className="mt-8 max-w-2xl italic text-muted text-[14px]">
          Formal terms will be agreed in writing with each pilot firm before any matter data is uploaded. The summary below describes the substantive position.
        </p>
      </section>

      <Sec title="Nature of the service">
        Interfluo is drafting infrastructure for UK residential conveyancing. It is not legal advice and does not replace the professional judgement of the supervising fee-earner. The fee-earner remains the responsible professional under the SRA Code of Conduct for any work product they adopt.
      </Sec>
      <Sec title="Acceptable use">
        For use by SRA-regulated firms (or equivalent regulator) in the ordinary course of conveyancing practice. No upload of data subject to legal privilege you do not control. No use for purposes outside conveyancing without prior written agreement.
      </Sec>
      <Sec title="Liability">
        Liability is limited to direct damages capped at fees paid in the preceding twelve months. Interfluo&rsquo;s output is reviewed and adopted (or rejected) by the fee-earner — the audit log records this. Indirect, consequential, and reputational damages are excluded to the maximum extent permitted by law.
      </Sec>
      <Sec title="Contact">
        Contract queries:{' '}
        <a className="border-b border-accent text-ink hover:text-accent" href="mailto:legal@interfluo.co">
          legal@interfluo.co
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
