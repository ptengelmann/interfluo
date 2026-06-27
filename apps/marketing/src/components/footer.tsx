import Link from 'next/link';
import { Logo } from '@/brand/Logo';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-[1180px] px-6 py-16 sm:px-10">
        <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-5 md:max-w-md">
            <Logo size={26} />
            <p className="font-display italic text-[18px] leading-snug text-ink-soft">
              Latin <em>interfluo</em> — to flow between. Drafting infrastructure for residential conveyancing.
            </p>
          </div>
          <nav className="flex flex-wrap items-end gap-x-8 gap-y-2 text-[14px] text-ink-soft">
            <Link href="/pilot" className="hover:text-ink">Pilot</Link>
            <a href="mailto:hello@interfluo.co" className="hover:text-ink">Contact</a>
            <Link href="/privacy" className="hover:text-ink">Privacy</Link>
            <Link href="/terms" className="hover:text-ink">Terms</Link>
          </nav>
        </div>
        <span className="hairline mt-12" />
        <div className="mt-6 flex flex-col gap-2 text-[12.5px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} Interfluo Ltd · England &amp; Wales</span>
          <span className="font-display italic">
            "The fee-earner is the responsible professional. We help them draft, not advise."
          </span>
        </div>
      </div>
    </footer>
  );
}
