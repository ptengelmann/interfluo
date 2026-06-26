import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      className={cn(
        'rounded-lg border border-line bg-surface shadow-[var(--shadow-card)]',
        className,
      )}
    />
  );
}

export function CardHeader({
  title,
  description,
  action,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4 border-b border-line px-6 py-5',
        className,
      )}
    >
      <div className="min-w-0">
        <h3 className="text-[18px] font-semibold tracking-tight text-ink leading-tight">{title}</h3>
        {description && <p className="mt-1.5 text-[14px] text-ink-soft">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function CardBody({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div {...rest} className={cn('p-6', className)} />;
}

export function CardFooter({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      className={cn(
        'flex items-center justify-between gap-3 border-t border-line bg-paper/50 px-6 py-4',
        className,
      )}
    />
  );
}
