import { Logo } from '@/brand/Logo';
import Link from 'next/link';

const NAV_GROUPS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: 'Product',
    links: [
      { href: '/#features', label: 'Features' },
      { href: '/#built-for', label: 'Built for' },
      { href: '/#trust', label: 'Trust' },
      { href: '/#pricing', label: 'Pricing' },
      { href: '/#faq', label: 'FAQ' },
    ],
  },
  {
    title: 'Firm',
    links: [
      { href: '/pilot', label: 'Request a pilot' },
      { href: 'mailto:hello@interfluo.co', label: 'Talk to a partner' },
      { href: 'mailto:hello@interfluo.co', label: 'Book a walkthrough' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy notice' },
      { href: '/terms', label: 'Terms of service' },
      { href: 'mailto:privacy@interfluo.co', label: 'Data subject requests' },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-ink text-on-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(to_right,transparent,rgba(245,241,233,0.12),transparent)]"
      />

      <div className="mx-auto max-w-[1180px] px-6 pt-20 pb-10 sm:px-10">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-6">
            <Logo size={28} tone="paper" />
            <p className="max-w-xs text-[14px] leading-[1.6] text-on-ink-soft">
              Latin <em className="font-display not-italic">interfluo</em>, to flow between.
              Drafting infrastructure for UK residential conveyancing fee-earners.
            </p>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-on-ink">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent-on-dark opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-accent-on-dark" />
              </span>
              All systems operational
            </span>
          </div>

          {NAV_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-on-ink-soft">
                {group.title}
              </p>
              <ul className="mt-5 flex flex-col gap-3">
                {group.links.map((l) => {
                  const isInternal = l.href.startsWith('/') && !l.href.startsWith('/#');
                  return (
                    <li key={`${group.title}-${l.label}`}>
                      {isInternal ? (
                        <Link
                          href={l.href}
                          className="text-[13.5px] text-on-ink transition-colors hover:text-white"
                        >
                          {l.label}
                        </Link>
                      ) : (
                        <a
                          href={l.href}
                          className="text-[13.5px] text-on-ink transition-colors hover:text-white"
                        >
                          {l.label}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div
          aria-hidden
          className="relative mt-20 select-none overflow-hidden text-center"
          style={{ height: 'clamp(80px, 18vw, 200px)' }}
        >
          <span
            className="font-display italic leading-none tracking-[-0.04em]"
            style={{
              fontSize: 'clamp(110px, 22vw, 260px)',
              color: 'rgba(245, 241, 233, 0.05)',
              letterSpacing: '-0.04em',
              display: 'inline-block',
              transform: 'translateY(-4%)',
            }}
          >
            Interfluo
          </span>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-on-ink-soft">
            <span>&copy; {year} Interfluo Ltd</span>
            <Dot />
            <span>Registered in England &amp; Wales</span>
            <Dot />
            <span>ICO registered</span>
            <Dot />
            <span>UK-resident infrastructure</span>
          </div>
          <p className="font-display italic text-[13px] text-on-ink-soft sm:text-right">
            &ldquo;The fee-earner is the responsible professional. We help them draft.&rdquo;
          </p>
        </div>

        <p className="mt-6 text-[11px] leading-[1.6] text-on-ink-soft">
          Set in Hanken Grotesk and Instrument Serif. UK English throughout. Interfluo is drafting
          infrastructure for a regulated professional and is not a source of legal advice.
        </p>
      </div>
    </footer>
  );
}

function Dot() {
  return <span className="hidden text-on-ink-soft/40 sm:inline">&middot;</span>;
}
