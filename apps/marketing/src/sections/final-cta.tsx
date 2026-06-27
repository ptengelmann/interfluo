import Link from 'next/link';

export function FinalCta() {
  return (
    <section className="relative bg-ink text-on-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[400px] bg-[radial-gradient(circle_at_30%_0%,rgba(91,155,124,0.18),transparent_60%)]"
      />
      <div className="mx-auto max-w-[1240px] px-6 py-20 sm:py-28 relative">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-16">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-on-ink-soft">
              Run a pilot
            </p>
            <h2 className="font-display mt-5 text-[clamp(40px,5.5vw,72px)] leading-[1.02] text-on-ink">
              Your first pilot matter, end-to-end, free.
            </h2>
            <p className="mt-7 max-w-xl text-[17px] leading-[1.55] text-on-ink-soft">
              Three matters at no cost. You watch a fee-earner upload a real pack and review the output. We sit on the call. Convert when (and only when) the maths is obvious to your partners.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <Link
              href="/pilot"
              className="inline-flex h-12 items-center justify-center rounded-md bg-accent-on-dark px-7 text-[15px] font-semibold text-ink hover:bg-white transition-colors"
            >
              Request a pilot
            </Link>
            <a
              href="mailto:hello@interfluo.co"
              className="inline-flex h-12 items-center justify-center rounded-md border border-on-ink-line px-7 text-[15px] font-semibold text-on-ink hover:bg-white/5 transition-colors"
            >
              Or just email us
            </a>
            <p className="text-[12.5px] text-on-ink-soft">
              No demo deck needed. We'll mirror screens with one of your real matters and you can see the output before the call ends.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
