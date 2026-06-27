import { IconArrowRight } from '@/components/icons';
import { HeroDemo } from '@/mocks/hero-demo';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line/60">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px] bg-[radial-gradient(circle_at_50%_-15%,rgba(46,92,70,0.05),transparent_55%)]"
      />

      <div className="mx-auto max-w-[1180px] px-6 pt-24 pb-24 sm:pt-32 sm:pb-28 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">AI co-pilot for UK residential conveyancing</p>
          <h1 className="mt-7 text-[clamp(44px,6.6vw,80px)] font-semibold leading-[1.02] tracking-[-0.025em] text-ink">
            Draft your enquiries and Report on Title in 60 seconds.
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-[17px] leading-[1.55] text-ink-soft">
            Upload the contract pack. Interfluo drafts the enquiries to the seller&rsquo;s solicitor
            and the first Report on Title for your client. Every line is cited back to its source
            page. Your fee-earner reviews and adopts.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <Link
              href="/pilot"
              className="group inline-flex h-10 items-center gap-1.5 rounded-full bg-accent pl-5 pr-1.5 text-[13.5px] font-semibold text-white transition-colors hover:bg-accent-dark"
            >
              Request a pilot
              <span className="grid size-7 place-items-center rounded-full bg-white/20 transition-transform duration-200 group-hover:translate-x-0.5">
                <IconArrowRight width={12} height={12} />
              </span>
            </Link>
            <a
              href="#features"
              className="inline-flex h-10 items-center rounded-full px-4 text-[13.5px] font-medium text-ink-soft transition-colors hover:bg-paper-dim hover:text-ink"
            >
              See how it works
            </a>
          </div>
        </div>

        <div className="relative mt-20 mx-auto max-w-[920px]">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-8 -z-10 rounded-3xl bg-[radial-gradient(circle_at_50%_30%,rgba(30,28,24,0.08),transparent_70%)]"
          />
          <HeroDemo />
        </div>
      </div>
    </section>
  );
}
