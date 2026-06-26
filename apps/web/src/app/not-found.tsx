import Link from 'next/link';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <EmptyState
      title="Page not found"
      description="That URL doesn't match any of our routes."
      action={
        <Link href="/">
          <Button>Back to matters</Button>
        </Link>
      }
    />
  );
}
