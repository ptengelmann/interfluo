import Link from 'next/link';
import { Logo } from '@/brand/Logo';

export function NavBar() {
  return (
    <header className="sticky top-0 z-20 border-b border-line/50 bg-paper/85 backdrop-blur">
      <div className="mx-auto flex max-w-[1240px] items-center gap-8 px-6 py-3.5">
        <Link href="/" aria-label="Interfluo">
          <Logo size={26} />
        </Link>
        <nav className="ml-auto hidden items-center gap-1 text-[14px] sm:flex">
          <a
            href="#how-it-works"
            className="rounded-md px-3 py-1.5 text-ink-soft hover:text-ink transition-colors"
          >
            How it works
          </a>
          <a
            href="#trust"
            className="rounded-md px-3 py-1.5 text-ink-soft hover:text-ink transition-colors"
          >
            Trust
          </a>
          <a
            href="#pricing"
            className="rounded-md px-3 py-1.5 text-ink-soft hover:text-ink transition-colors"
          >
            Pricing
          </a>
          <a
            href="#faq"
            className="rounded-md px-3 py-1.5 text-ink-soft hover:text-ink transition-colors"
          >
            FAQ
          </a>
        </nav>
        <Link
          href="/pilot"
          className="rounded-md bg-accent px-4 py-2 text-[13.5px] font-semibold text-white hover:bg-accent-dark transition-colors"
        >
          Request a pilot
        </Link>
      </div>
    </header>
  );
}
