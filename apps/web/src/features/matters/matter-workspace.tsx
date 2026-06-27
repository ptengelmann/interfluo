'use client';

import { IconArrowLeft } from '@/components/icons';
import { StatusBadge } from '@/components/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { ProgressBar } from '@/components/ui/progress-bar';
import { DocumentViewerDrawer } from '@/features/viewer/document-viewer-drawer';
import { ViewerProvider } from '@/features/viewer/viewer-context';
import { useApi } from '@/lib/api';
import { formatDateTime } from '@/lib/format';
import type { MatterDetail } from '@interfluo/core';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AuditPanel } from './audit-panel';
import { DocumentsPanel } from './documents-panel';
import { EditMatterDialog } from './edit-matter-dialog';
import { EnquiriesPanel } from './enquiries-panel';
import { MatterProvider } from './matter-context';
import { ReportPanel } from './report-panel';
import { RisksPanel } from './risks-panel';

type Tab = 'enquiries' | 'report' | 'risks' | 'documents' | 'activity';

const POLL_INTERVAL_MS = 2500;

const PROCESSING_STATUSES = new Set(['ingesting', 'extracting', 'analysing', 'generating']);

export function MatterWorkspace({ matterId }: { matterId: string }) {
  return (
    <MatterProvider matterId={matterId}>
      <ViewerProvider>
        <MatterWorkspaceInner matterId={matterId} />
        <DocumentViewerDrawer />
      </ViewerProvider>
    </MatterProvider>
  );
}

function MatterWorkspaceInner({ matterId }: { matterId: string }) {
  const router = useRouter();
  const api = useApi();
  const [detail, setDetail] = useState<MatterDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('enquiries');
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    try {
      const d = await api.getMatter(matterId);
      setDetail(d);
      setError(null);
      return d;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load matter');
      return null;
    }
  }, [api, matterId]);

  useEffect(() => {
    load();
  }, [load]);

  const isProcessing = useMemo(
    () => (detail ? PROCESSING_STATUSES.has(detail.matter.status) : false),
    [detail],
  );

  useEffect(() => {
    if (!isProcessing) {
      if (pollRef.current) clearTimeout(pollRef.current);
      return;
    }
    const tick = async () => {
      await load();
      pollRef.current = setTimeout(tick, POLL_INTERVAL_MS);
    };
    pollRef.current = setTimeout(tick, POLL_INTERVAL_MS);
    return () => {
      if (pollRef.current) clearTimeout(pollRef.current);
    };
  }, [isProcessing, load]);

  const rerun = async () => {
    setBusy(true);
    try {
      await api.processMatter(matterId);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start');
    } finally {
      setBusy(false);
    }
  };

  const doDelete = async () => {
    setDeleting(true);
    try {
      await api.deleteMatter(matterId);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete matter');
      setDeleting(false);
    }
  };

  if (error && !detail) {
    return (
      <Card className="border-danger/30 bg-[#f8eeec]">
        <CardBody>
          <p className="text-[14px] text-danger">Error loading matter: {error}</p>
        </CardBody>
      </Card>
    );
  }

  if (!detail) {
    return (
      <div className="flex items-center gap-3 text-[14px] text-ink-soft">
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        Loading matter…
      </div>
    );
  }

  const { matter, documents, enquiries, risks, report, pipeline } = detail;
  const docsChangedSinceRun =
    pipeline.completedAt &&
    documents.some((d) => new Date(d.uploadedAt) > new Date(pipeline.completedAt!));

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[12.5px] text-ink-soft hover:text-ink"
          >
            <IconArrowLeft /> Matters
          </Link>
          <h1 className="font-display mt-3 text-[40px] leading-[1.1] text-ink">
            {matter.reference}
          </h1>
          <p className="mt-1.5 text-[14.5px] text-ink-soft">
            {matter.propertyAddress ?? 'No address provided'}{' '}
            <span className="mx-1.5 text-line-strong">·</span> {matter.tenure}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={matter.status} />
          <Button variant="ghost" size="sm" onClick={load}>
            Refresh
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)}>
            Edit
          </Button>
          {documents.length > 0 && !isProcessing && (
            <Button size="sm" onClick={rerun} loading={busy}>
              {pipeline.completedAt ? 'Re-run pipeline' : 'Run pipeline'}
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setConfirmDelete(true)}
            className="text-danger hover:text-danger"
          >
            Delete matter
          </Button>
        </div>
      </div>

      {error && detail && (
        <Card className="border-danger/30 bg-[#f8eeec]">
          <CardBody>
            <p className="text-[13.5px] text-danger">{error}</p>
          </CardBody>
        </Card>
      )}

      {docsChangedSinceRun && !isProcessing && (
        <Card className="border-accent/30 bg-accent-tint">
          <CardBody className="flex items-center justify-between gap-4">
            <p className="text-[14px] text-accent-dark">
              New documents have been added since the last pipeline run. Re-run to incorporate them.
            </p>
            <Button size="sm" onClick={rerun} loading={busy}>
              Re-run pipeline
            </Button>
          </CardBody>
        </Card>
      )}

      {pipeline && (pipeline.status !== 'draft' || pipeline.progress > 0) && (
        <Card>
          <CardBody className="flex items-center gap-5">
            <div className="flex-1">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="label">
                  {pipeline.stage === 'done' ? 'Pipeline complete' : `Pipeline · ${pipeline.stage}`}
                </span>
                <span className="text-[12.5px] text-muted">
                  {pipeline.completedAt
                    ? formatDateTime(pipeline.completedAt)
                    : `${pipeline.progress}%`}
                </span>
              </div>
              <ProgressBar value={pipeline.progress} />
              <p className="mt-3 text-[14px] text-ink-soft">{pipeline.message}</p>
              {pipeline.error && <p className="mt-2 text-[13px] text-danger">{pipeline.error}</p>}
            </div>
          </CardBody>
        </Card>
      )}

      <div className="flex items-center gap-1 border-b border-line">
        <TabButton active={tab === 'enquiries'} onClick={() => setTab('enquiries')}>
          Enquiries
          <Badge tone="muted" className="ml-1.5">
            {enquiries.length}
          </Badge>
        </TabButton>
        <TabButton active={tab === 'report'} onClick={() => setTab('report')}>
          Report on Title
        </TabButton>
        <TabButton active={tab === 'risks'} onClick={() => setTab('risks')}>
          Risks
          <Badge tone="muted" className="ml-1.5">
            {risks.length}
          </Badge>
        </TabButton>
        <TabButton active={tab === 'documents'} onClick={() => setTab('documents')}>
          Documents
          <Badge tone="muted" className="ml-1.5">
            {documents.length}
          </Badge>
        </TabButton>
        <TabButton active={tab === 'activity'} onClick={() => setTab('activity')}>
          Activity
        </TabButton>
      </div>

      <div>
        {tab === 'enquiries' &&
          (enquiries.length === 0 ? (
            <EmptyState
              title={isProcessing ? 'Drafting enquiries…' : 'No enquiries yet'}
              description={
                isProcessing
                  ? 'The model is working through the pack. This usually takes 30–60 seconds.'
                  : documents.length === 0
                    ? 'Upload documents first, then run the pipeline.'
                    : 'Run the pipeline to draft enquiries from the uploaded pack.'
              }
              action={
                documents.length > 0 && !isProcessing ? (
                  <Button onClick={rerun} loading={busy}>
                    Run pipeline
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <EnquiriesPanel matterId={matterId} enquiries={enquiries} onUpdate={load} />
          ))}
        {tab === 'report' &&
          (report ? (
            <ReportPanel matterId={matterId} report={report} />
          ) : (
            <EmptyState
              title={isProcessing ? 'Drafting Report on Title…' : 'Report not yet generated'}
              description={
                isProcessing ? undefined : 'Run the pipeline once documents are uploaded.'
              }
            />
          ))}
        {tab === 'risks' && <RisksPanel risks={risks} />}
        {tab === 'documents' && (
          <DocumentsPanel matterId={matterId} documents={documents} onChanged={load} />
        )}
        {tab === 'activity' && <AuditPanel matterId={matterId} />}
      </div>

      <EditMatterDialog
        open={editOpen}
        matter={matter}
        onClose={() => setEditOpen(false)}
        onSaved={load}
      />

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this matter?"
        description="All uploaded documents, extracted facts, enquiries and the Report on Title will be removed. This cannot be undone."
        confirmLabel="Delete matter"
        destructive
        loading={deleting}
        onConfirm={doDelete}
        onCancel={() => !deleting && setConfirmDelete(false)}
      >
        <p className="rounded-md border border-line bg-paper-dim/40 px-3 py-2 font-mono text-[12.5px] text-ink">
          {matter.reference}
        </p>
      </ConfirmDialog>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? 'inline-flex items-center gap-2 border-b-2 border-ink px-4 py-3 text-[14px] font-semibold text-ink'
          : 'inline-flex items-center gap-2 border-b-2 border-transparent px-4 py-3 text-[14px] text-ink-soft hover:text-ink'
      }
    >
      {children}
    </button>
  );
}
