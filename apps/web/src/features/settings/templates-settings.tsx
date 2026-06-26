'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { FirmTemplate, FirmTemplateKind } from '@interfluo/core';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import { IconArrowLeft, IconFileText, IconX } from '@/components/icons';
import { useApi } from '@/lib/api';
import { formatBytes, formatDateTime } from '@/lib/format';

const KIND_LABELS: Record<FirmTemplateKind, string> = {
  report: 'Report on Title',
  enquiries: 'Enquiries (planned — not yet wired)',
};

const KIND_DESCRIPTIONS: Record<FirmTemplateKind, string> = {
  report:
    'Upload a Word (.docx) template with {{placeholders}}. On export, Interfluo merges the drafted report into your firm template instead of using the house style.',
  enquiries:
    'Reserved for a future release. Enquiries export currently uses the house style.',
};

const SUPPORTED_KINDS: FirmTemplateKind[] = ['report'];

export function TemplatesSettings() {
  const api = useApi();
  const [templates, setTemplates] = useState<FirmTemplate[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<FirmTemplate | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await api.listFirmTemplates();
      setTemplates(res.templates);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load templates');
    }
  }, [api]);

  useEffect(() => {
    load();
  }, [load]);

  const doDelete = async () => {
    if (!confirming) return;
    setDeleting(true);
    try {
      await api.deleteFirmTemplate(confirming.kind);
      setConfirming(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const byKind = new Map((templates ?? []).map((t) => [t.kind, t]));

  return (
    <div className="mx-auto flex max-w-[860px] flex-col gap-8">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[12.5px] text-ink-soft hover:text-ink"
        >
          <IconArrowLeft /> Back
        </Link>
        <span className="label mt-4 block">Firm settings</span>
        <h1 className="font-display mt-2 text-[36px] leading-[1.1] text-ink">
          Document templates
        </h1>
        <p className="mt-2 max-w-2xl text-[14.5px] text-ink-soft">
          Upload your firm's Word template for the Report on Title. Interfluo will merge each
          matter's drafted report into your template on export — your house typography, headers,
          letterhead, and footers are preserved.
        </p>
      </div>

      <Card>
        <CardHeader title="Available placeholders" />
        <CardBody className="text-[13.5px] text-ink-soft">
          <p className="mb-3">
            Insert these tokens anywhere in your <code>.docx</code> file. Loops use the same
            syntax — wrap the repeating block with the opening and closing markers.
          </p>
          <pre className="rounded-md border border-line bg-paper-dim/40 p-4 text-[12.5px] leading-relaxed text-ink overflow-x-auto">
{`{{matter.reference}}        {{matter.propertyAddress}}
{{matter.buyerName}}        {{matter.sellerName}}
{{matter.tenure}}           {{meta.draftedDate}}

{{report.summary}}          {{report.generatedAt}}

Loop over report sections:
{{#report.sections}}
  Heading: {{heading}}
  Body: {{body}}
  Sources: {{sources}}
{{/report.sections}}

Loop over accepted enquiries:
{{#enquiries}}
  {{number}}. [{{category}}] {{question}}
     Why: {{rationale}}
     Sources: {{sources}}
{{/enquiries}}`}
          </pre>
        </CardBody>
      </Card>

      {error && (
        <Card className="border-danger/30 bg-[#f8eeec]">
          <CardBody>
            <p className="text-[13.5px] text-danger">{error}</p>
          </CardBody>
        </Card>
      )}

      {!templates && !error && (
        <div className="flex items-center gap-3 text-[14px] text-ink-soft">
          <Spinner /> Loading templates…
        </div>
      )}

      {templates && (
        <div className="flex flex-col gap-4">
          {SUPPORTED_KINDS.map((kind) => {
            const current = byKind.get(kind);
            return (
              <TemplateRow
                key={kind}
                kind={kind}
                template={current}
                onUploaded={load}
                onRequestDelete={() => current && setConfirming(current)}
              />
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={confirming !== null}
        title="Remove this template?"
        description="Future exports will fall back to the Interfluo house style until you upload a new template."
        confirmLabel="Remove template"
        destructive
        loading={deleting}
        onConfirm={doDelete}
        onCancel={() => !deleting && setConfirming(null)}
      >
        {confirming && (
          <p className="rounded-md border border-line bg-paper-dim/40 px-3 py-2 font-mono text-[12.5px] text-ink">
            {confirming.filename}
          </p>
        )}
      </ConfirmDialog>
    </div>
  );
}

function TemplateRow({
  kind,
  template,
  onUploaded,
  onRequestDelete,
}: {
  kind: FirmTemplateKind;
  template: FirmTemplate | undefined;
  onUploaded: () => Promise<unknown>;
  onRequestDelete: () => void;
}) {
  const api = useApi();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      await api.uploadFirmTemplate(kind, file);
      await onUploaded();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader
        title={KIND_LABELS[kind]}
        description={KIND_DESCRIPTIONS[kind]}
        action={
          template ? (
            <button
              type="button"
              onClick={onRequestDelete}
              aria-label="Remove template"
              className="rounded-md p-1.5 text-muted hover:bg-paper-dim hover:text-danger"
            >
              <IconX />
            </button>
          ) : null
        }
      />
      <CardBody>
        {template ? (
          <div className="flex items-center gap-4 rounded-md border border-line bg-paper-dim/40 px-3.5 py-3">
            <div className="grid size-10 place-items-center rounded-md bg-surface text-ink-soft">
              <IconFileText />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-[14.5px] font-medium text-ink">{template.filename}</p>
              <p className="text-[12.5px] text-muted">
                {formatBytes(template.sizeBytes)} · uploaded {formatDateTime(template.uploadedAt)}
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              loading={uploading}
              onClick={() => inputRef.current?.click()}
            >
              Replace
            </Button>
          </div>
        ) : (
          <EmptyState
            title="No template uploaded"
            description={`Exports for the ${KIND_LABELS[kind].toLowerCase()} will use Interfluo's house style until you upload one.`}
            action={
              kind === 'report' ? (
                <Button onClick={() => inputRef.current?.click()} loading={uploading}>
                  Upload .docx
                </Button>
              ) : undefined
            }
          />
        )}
        {error && <p className="mt-3 text-[13px] text-danger">{error}</p>}
        <input
          ref={inputRef}
          type="file"
          accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = '';
            if (file) void handleUpload(file);
          }}
        />
      </CardBody>
    </Card>
  );
}
