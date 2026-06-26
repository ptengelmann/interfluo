import type { ReactNode } from 'react';

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-line-strong bg-surface/40 px-8 py-16 text-center">
      {icon && <div className="mb-4 text-muted">{icon}</div>}
      <h3 className="font-display text-2xl text-ink">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-[14px] leading-relaxed text-ink-soft">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
