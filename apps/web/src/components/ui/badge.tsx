import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Tone = 'neutral' | 'ink' | 'accent' | 'success' | 'warn' | 'danger' | 'muted';

const toneClasses: Record<Tone, string> = {
  neutral: 'bg-paper-dim text-ink-soft border-line',
  ink: 'bg-ink text-on-ink border-ink',
  accent: 'bg-accent-tint text-accent-dark border-accent/20',
  success: 'bg-accent-tint text-accent-dark border-accent/20',
  warn: 'bg-paper-dim text-ink-soft border-line-strong',
  danger: 'bg-[#f3e4e1] text-danger border-danger/30',
  muted: 'bg-transparent text-muted border-line',
};

export function Badge({
  tone = 'neutral',
  className,
  children,
  ...rest
}: { tone?: Tone; children: ReactNode } & HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      {...rest}
      className={cn(
        'inline-flex items-center gap-1 rounded-pill border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] leading-none',
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
