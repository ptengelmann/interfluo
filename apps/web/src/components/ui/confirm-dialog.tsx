'use client';

import { useEffect, type ReactNode } from 'react';
import { Button } from './button';

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
  children,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onCancel();
    };
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
        onClick={() => !loading && onCancel()}
      />
      <div className="relative z-10 w-full max-w-[440px] rounded-lg border border-line bg-surface shadow-[var(--shadow-raised)]">
        <div className="border-b border-line px-6 py-5">
          <h3 id="confirm-title" className="text-[18px] font-semibold tracking-tight text-ink">
            {title}
          </h3>
          {description && <p className="mt-1.5 text-[14px] text-ink-soft">{description}</p>}
        </div>
        {children && <div className="px-6 py-5 text-[14px] text-ink-soft">{children}</div>}
        <div className="flex items-center justify-end gap-2 border-t border-line bg-paper/50 px-6 py-4">
          <Button variant="ghost" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={destructive ? 'danger' : 'primary'} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
