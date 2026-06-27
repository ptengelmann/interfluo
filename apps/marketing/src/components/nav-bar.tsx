import Link from 'next/link';
import { Logo } from '@/brand/Logo';

export function NavBar() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-[1180px] items-center px-6 py-5 sm:px-10">
        <Link href="/" aria-label="Interfluo home">
          <Logo size={22} />
        </Link>
        <Link
          href="/pilot"
          className="ml-auto inline-flex items-baseline gap-2 text-[13.5px] tracking-tight text-ink hover:text-accent transition-colors"
        >
          <span className="smallcaps text-muted text-[11px]">Pilot</span>
          <span className="text-ink-soft">·</span>
          <span>Request access&nbsp;→</span>
        </Link>
      </div>
    </header>
  );
}
