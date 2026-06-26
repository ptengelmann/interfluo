'use client';

import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export function Input({ label, hint, error, className, id, ...rest }: InputProps) {
  const inputId = id ?? rest.name ?? Math.random().toString(36).slice(2);
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={inputId} className="label">
          {label}
        </label>
      )}
      <input
        id={inputId}
        {...rest}
        className={cn(
          'h-11 rounded-md border border-line bg-surface px-3.5 text-[14px] text-ink placeholder:text-muted/70',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-transparent',
          'transition-shadow',
          error && 'border-danger focus-visible:ring-danger',
          className,
        )}
      />
      {(hint || error) && (
        <p className={cn('text-[13px]', error ? 'text-danger' : 'text-muted')}>{error || hint}</p>
      )}
    </div>
  );
}
