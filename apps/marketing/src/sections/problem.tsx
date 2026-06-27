export function Problem() {
  return (
    <section className="border-y border-line bg-paper-dim/40">
      <div className="mx-auto max-w-[1240px] px-6 py-20 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div>
            <p className="label">The problem</p>
            <h2 className="font-display mt-4 text-[clamp(32px,4vw,52px)] leading-[1.05] text-ink">
              Where the margin leaks
            </h2>
          </div>
          <div className="flex flex-col gap-6 text-[16px] leading-[1.65] text-ink-soft">
            <p>
              A UK residential conveyancing fee-earner spends <strong className="text-ink">4–8 hours per matter</strong> on three high-cognitive tasks: reading the pack, drafting enquiries to the seller's solicitor, drafting the Report on Title for the buyer. The rest is workflow ops.
            </p>
            <p>
              Average transaction time has crept to <strong className="text-ink">~17 weeks</strong>, with sales pushing 23 — up from a historical 8–12. Across <strong className="text-ink">~5,500 firms</strong> and <strong className="text-ink">~1M residential transactions a year</strong>, the same drafting work is being repeated by hand at every desk.
            </p>
            <p>
              Interfluo automates the drafting. The fee-earner reads, reviews, adopts. A four-hour drafting session becomes a thirty-minute review.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
