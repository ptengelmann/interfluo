import { IconArrowRight } from '@/components/icons';
import Link from 'next/link';

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-ink text-on-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[400px] bg-[radial-gradient(circle_at_50%_-20%,rgba(91,155,124,0.18),transparent_60%)]"
      />
      <div className="mx-auto max-w-[1180px] px-6 py-24 sm:py-32 lg:px-10 relative">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.18em] text-on-ink-soft">
            Run a pilot
          </p>
          <h2 className="mt-6 text-[clamp(36px,5vw,64px)] font-semibold leading-[1.05] tracking-[-0.02em] text-on-ink">
            Your first three matters cost nothing.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-[1.55] text-on-ink-soft">
            We provision your firm, walk you through the workspace, and sit on the call while a
            fee-earner uploads a real pack. Convert when (and only when) the maths is obvious to
            your partners.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <Link
              href="/pilot"
              className="group inline-flex h-10 items-center gap-1.5 rounded-full bg-accent-on-dark pl-5 pr-1.5 text-[13.5px] font-semibold text-ink transition-colors hover:bg-white"
            >
              Request a pilot
              <span className="grid size-7 place-items-center rounded-full bg-ink/15 transition-transform duration-200 group-hover:translate-x-0.5">
                <IconArrowRight width={12} height={12} />
              </span>
            </Link>
            <a
              href="mailto:hello@interfluo.co"
              className="inline-flex h-10 items-center rounded-full border border-on-ink/30 px-5 text-[13.5px] font-semibold text-on-ink transition-colors hover:bg-white/5"
            >
              hello@interfluo.co
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
