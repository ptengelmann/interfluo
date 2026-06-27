'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Logo } from '@/brand/Logo';
import { IconArrowRight } from './icons';

const NAV_LINKS = [
  { href: '/#features', label: 'Features' },
  { href: '/#built-for', label: 'Built for' },
  { href: '/#trust', label: 'Trust' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/#faq', label: 'FAQ' },
];

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="sticky top-0 z-50 px-4 pt-3 sm:pt-4">
      <header
        className={
          'mx-auto flex max-w-[1120px] items-center gap-2 rounded-full border px-2 py-1.5 backdrop-blur-xl transition-all duration-300 sm:gap-3 sm:py-2 ' +
          (scrolled
            ? 'border-line bg-paper/90 shadow-[0_10px_28px_-14px_rgba(30,28,24,0.22)]'
            : 'border-line/60 bg-paper/70 shadow-none')
        }
      >
        <Link
          href="/"
          aria-label="Interfluo home"
          className="ml-2 inline-flex items-center transition-opacity hover:opacity-80"
        >
          <Logo size={22} />
        </Link>

        <span
          aria-hidden
          className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-paper-dim/70 px-2.5 py-1 text-[10.5px] font-medium text-ink-soft"
        >
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-50" />
            <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
          </span>
          Pilot programme open
        </span>

        <nav className="ml-auto hidden lg:flex items-center gap-0.5">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative inline-flex h-8 items-center rounded-full px-3 text-[13.5px] font-medium text-ink-soft transition-colors hover:text-ink"
            >
              <span className="relative">
                {l.label}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -bottom-0.5 left-0 right-0 h-px origin-left scale-x-0 bg-ink transition-transform duration-300 ease-out group-hover:scale-x-100"
                />
              </span>
            </a>
          ))}
        </nav>

        <span
          aria-hidden
          className="ml-auto hidden lg:block lg:ml-2 h-5 w-px bg-line-strong/60"
        />

        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <a
            href="http://localhost:3000"
            className="hidden sm:inline-flex h-8 items-center rounded-full px-3 text-[13px] font-medium text-ink-soft transition-colors hover:bg-paper-dim hover:text-ink"
          >
            Sign in
          </a>
          <Link
            href="/pilot"
            className="group inline-flex h-8 items-center gap-1.5 rounded-full bg-ink pl-4 pr-1.5 text-[13px] font-semibold text-paper transition-colors hover:bg-ink-soft"
          >
            Request a pilot
            <span className="grid size-5 place-items-center rounded-full bg-paper/15 transition-transform duration-200 group-hover:translate-x-0.5">
              <IconArrowRight width={10} height={10} />
            </span>
          </Link>
        </div>
      </header>
    </div>
  );
}
