import Link from 'next/link';
import { Logo } from '@/brand/Logo';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-paper-dim/60">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-10 px-6 py-12 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-4 md:max-w-sm">
          <Logo size={28} />
          <p className="text-[13.5px] leading-relaxed text-ink-soft">
            Drafting infrastructure for UK residential conveyancing. Citation-grounded, audit-logged, built for fee-earners and the partners who supervise them.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-12 text-[14px] sm:grid-cols-3">
          <div className="flex flex-col gap-2">
            <span className="label mb-1">Product</span>
            <a href="#how-it-works" className="text-ink-soft hover:text-ink">How it works</a>
            <a href="#trust" className="text-ink-soft hover:text-ink">Trust</a>
            <a href="#pricing" className="text-ink-soft hover:text-ink">Pricing</a>
            <Link href="/pilot" className="text-ink-soft hover:text-ink">Request a pilot</Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="label mb-1">Company</span>
            <a href="mailto:hello@interfluo.co" className="text-ink-soft hover:text-ink">Contact</a>
            <Link href="/privacy" className="text-ink-soft hover:text-ink">Privacy</Link>
            <Link href="/terms" className="text-ink-soft hover:text-ink">Terms</Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="label mb-1">For your firm</span>
            <span className="text-ink-soft">UK data residency</span>
            <span className="text-ink-soft">Cyber Essentials Plus (Y1)</span>
            <span className="text-ink-soft">ISO 27001 (Y2)</span>
          </div>
        </div>
      </div>
      <div className="border-t border-line/60">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-6 py-5 text-[12px] text-muted">
          <span>© {year} Interfluo Ltd. AI output requires human review by the supervising fee-earner.</span>
          <span>v0.1</span>
        </div>
      </div>
    </footer>
  );
}
