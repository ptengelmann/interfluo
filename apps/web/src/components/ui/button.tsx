'use client';

import { cn } from '@/lib/cn';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-accent text-white hover:bg-accent-dark active:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed',
  secondary:
    'bg-surface text-ink border border-line hover:border-line-strong hover:bg-paper-dim/60',
  ghost: 'bg-transparent text-ink-soft hover:text-ink hover:bg-paper-dim/60',
  danger: 'bg-danger text-white hover:opacity-90 disabled:opacity-50',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-9 px-4 text-[13px] gap-1.5',
  md: 'h-11 px-5 text-[14px] gap-2',
  lg: 'h-12 px-[30px] text-[15px] gap-2.5',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  iconLeft,
  iconRight,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={rest.type ?? 'button'}
      {...rest}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center rounded-md font-sans font-semibold tracking-tight',
        'transition-colors duration-150 select-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {loading ? (
        <span className="inline-block size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        iconLeft
      )}
      {children}
      {!loading && iconRight}
    </button>
  );
}
