'use client';

import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <Card>
      <CardBody className="flex flex-col gap-3">
        <p className="font-display text-lg font-semibold text-ink-900">Something went wrong</p>
        <p className="font-mono text-xs text-danger-600">{error.message}</p>
        <div>
          <Button onClick={reset} size="sm">
            Try again
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
