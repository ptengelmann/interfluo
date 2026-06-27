import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] bg-[radial-gradient(circle_at_30%_0%,rgba(46,92,70,0.08),transparent_60%),radial-gradient(circle_at_85%_0%,rgba(135,106,68,0.05),transparent_50%)]"
      />
      <div className="mx-auto max-w-[1240px] px-6 pt-20 pb-24 sm:pt-28 sm:pb-32">
        <div className="max-w-3xl">
          <p className="label">AI co-pilot for residential conveyancing</p>
          <h1 className="font-display mt-5 text-[clamp(44px,7vw,84px)] leading-[1.02] tracking-tight text-ink">
            Drop in the pack.
            <br />
            Get the <em className="not-italic text-accent">enquiries</em> and the{' '}
            <em className="not-italic text-accent">Report on Title</em>.
          </h1>
          <p className="mt-8 max-w-2xl text-[18px] leading-[1.55] text-ink-soft">
            Interfluo reads the contract pack, property forms and searches in 30–60 seconds. Every assertion is footnoted to its source page. The fee-earner reviews — not drafts.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/pilot"
              className="inline-flex h-12 items-center justify-center rounded-md bg-accent px-7 text-[15px] font-semibold text-white hover:bg-accent-dark transition-colors"
            >
              Request a pilot
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex h-12 items-center justify-center rounded-md border border-line bg-surface px-7 text-[15px] font-semibold text-ink hover:border-line-strong transition-colors"
            >
              How it works
            </a>
          </div>
          <p className="mt-6 text-[13px] text-muted">
            For UK residential conveyancing firms (England & Wales). £40–60 per matter. No per-seat fees.
          </p>
        </div>

        <div className="mt-20 grid gap-3 sm:grid-cols-3">
          <Stat value="4–8 hrs" label="Saved per matter (drafting → review)" />
          <Stat value="100%" label="Of assertions cited back to source pages" />
          <Stat value="~30s" label="Typical pipeline run on a clean pack" />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border border-line bg-surface px-6 py-5">
      <p className="font-display text-[36px] leading-none text-ink">{value}</p>
      <p className="mt-2 text-[13.5px] text-ink-soft">{label}</p>
    </div>
  );
}
