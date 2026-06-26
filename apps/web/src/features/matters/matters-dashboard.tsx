'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import type { Matter } from '@interfluo/core';
import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import { StatusBadge } from '@/components/status-badge';
import { IconArrowRight } from '@/components/icons';
import { useApi } from '@/lib/api';
import { formatDateTime } from '@/lib/format';

export function MattersDashboard() {
  const api = useApi();
  const [matters, setMatters] = useState<Matter[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await api.listMatters();
      setMatters(res.matters);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load matters');
    } finally {
      setRefreshing(false);
    }
  }, [api]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
        <div className="max-w-2xl">
          <span className="label">Workspace</span>
          <h1 className="font-display mt-2 text-[44px] leading-[1.05] text-ink">Matters</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
            Upload the contract pack, property forms and searches. The model returns ranked
            enquiries and a first-draft Report on Title — every assertion footnoted to its source
            page.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={load} loading={refreshing}>
            Refresh
          </Button>
          <Link href="/matters/new">
            <Button>New matter</Button>
          </Link>
        </div>
      </header>

      {error && (
        <Card className="border-danger/30 bg-[#f8eeec]">
          <CardBody>
            <p className="text-[14px] text-danger">
              Couldn't reach the API ({error}). Is the API service running on{' '}
              <span className="font-mono">
                {process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'}
              </span>
              ?
            </p>
          </CardBody>
        </Card>
      )}

      {!matters && !error && (
        <div className="flex items-center gap-3 text-[14px] text-ink-soft">
          <Spinner /> Loading matters…
        </div>
      )}

      {matters && matters.length === 0 && (
        <EmptyState
          title="No matters yet"
          description="Create a matter and drop in the contract pack to see the pipeline run."
          action={
            <Link href="/matters/new">
              <Button>New matter</Button>
            </Link>
          }
        />
      )}

      {matters && matters.length > 0 && (
        <div className="grid gap-3">
          {matters.map((m) => (
            <Link key={m.id} href={`/matters/${m.id}`} className="group">
              <Card className="transition-all hover:border-line-strong hover:shadow-[var(--shadow-raised)]">
                <CardBody className="flex items-center gap-6">
                  <span
                    className="font-display italic text-[34px] text-ink leading-none"
                    style={{ letterSpacing: '-0.02em' }}
                  >
                    if
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3">
                      <h3 className="text-[17px] font-semibold tracking-tight text-ink truncate">
                        {m.reference}
                      </h3>
                      <StatusBadge status={m.status} />
                    </div>
                    <p className="mt-1 text-[14px] text-ink-soft truncate">
                      {m.propertyAddress ?? 'No address provided'}
                    </p>
                  </div>
                  <div className="hidden text-right text-[12.5px] text-muted sm:block">
                    <p className="label">Created</p>
                    <p className="mt-1">{formatDateTime(m.createdAt)}</p>
                  </div>
                  <IconArrowRight className="text-muted group-hover:text-ink transition-colors" />
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
