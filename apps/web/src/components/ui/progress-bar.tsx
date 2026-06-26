import { cn } from '@/lib/cn';

export function ProgressBar({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={cn('h-1.5 w-full overflow-hidden rounded-pill bg-paper-dim', className)}>
      <div
        className="h-full bg-accent transition-all duration-300 ease-out"
        style={{ width: `${v}%` }}
      />
    </div>
  );
}
