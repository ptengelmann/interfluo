import { Logo } from '@/brand/Logo';
import { OrganizationSwitcher, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { OrgGuard } from './org-guard';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="sticky top-0 z-20 bg-ink">
        <div className="mx-auto flex max-w-[1320px] items-center gap-6 px-6 py-3">
          <Link href="/" aria-label="Interfluo">
            <Logo tone="paper" size={28} />
          </Link>

          <SignedIn>
            <nav className="hidden items-center gap-1 text-[14px] sm:flex">
              <Link
                href="/"
                className="rounded-md px-3 py-1.5 text-on-ink-soft hover:bg-white/5 hover:text-on-ink transition-colors"
              >
                Matters
              </Link>
              <Link
                href="/settings/templates"
                className="rounded-md px-3 py-1.5 text-on-ink-soft hover:bg-white/5 hover:text-on-ink transition-colors"
              >
                Templates
              </Link>
            </nav>
          </SignedIn>

          <div className="ml-auto flex items-center gap-3">
            <SignedIn>
              <OrganizationSwitcher
                hidePersonal
                appearance={{
                  elements: {
                    organizationSwitcherTrigger:
                      'rounded-md bg-white/5 px-3 py-1.5 text-on-ink hover:bg-white/10 transition-colors',
                    organizationSwitcherTriggerIcon: 'text-on-ink',
                    organizationPreviewTextContainer__organizationSwitcherTrigger: 'text-on-ink',
                    organizationPreviewMainIdentifier__organizationSwitcherTrigger:
                      'text-on-ink font-medium',
                  },
                }}
              />
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: 'size-8',
                  },
                }}
              />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="rounded-md bg-accent px-4 py-1.5 text-[13.5px] font-semibold text-white hover:bg-accent-dark transition-colors"
                >
                  Sign in
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1320px] flex-1 px-6 py-10">
        <SignedIn>
          <OrgGuard>{children}</OrgGuard>
        </SignedIn>
        <SignedOut>{children}</SignedOut>
      </main>
      <footer className="mt-12 border-t border-line py-6">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-4 px-6 text-[12.5px] text-muted">
          <span>Interfluo · AI output requires human review by the supervising fee-earner.</span>
          <span>v0.1.0</span>
        </div>
      </footer>
    </div>
  );
}
