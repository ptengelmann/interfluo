'use client';

import { useCallback, useState } from 'react';
import type { Document } from '@interfluo/core';
import { Badge } from '@/components/ui/badge';
import { Card, CardBody } from '@/components/ui/card';
import { DocumentTypePicker } from './document-type-picker';
import { IconFileText, IconX } from '@/components/icons';
import { Dropzone } from '@/features/matters/dropzone';
import { Spinner } from '@/components/ui/spinner';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useApi } from '@/lib/api';
import { formatBytes, formatDateTime, pluralise } from '@/lib/format';

interface UploadingItem {
  id: string;
  name: string;
}

export function DocumentsPanel({
  matterId,
  documents,
  onChanged,
}: {
  matterId: string;
  documents: Document[];
  onChanged: () => Promise<unknown>;
}) {
  const api = useApi();
  const [uploading, setUploading] = useState<UploadingItem[]>([]);
  const [confirming, setConfirming] = useState<Document | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback(
    async (files: File[]) => {
      const items: UploadingItem[] = files.map((f) => ({
        id: `${f.name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: f.name,
      }));
      setUploading((prev) => [...prev, ...items]);
      setError(null);

      await Promise.all(
        items.map(async (it, idx) => {
          try {
            const file = files[idx];
            if (!file) return;
            await api.uploadDocuments(matterId, [file]);
          } catch (err) {
            setError(err instanceof Error ? err.message : `Failed to upload ${it.name}`);
          } finally {
            setUploading((prev) => prev.filter((p) => p.id !== it.id));
          }
        }),
      );
      await onChanged();
    },
    [api, matterId, onChanged],
  );

  const confirmDelete = async () => {
    if (!confirming) return;
    setDeleting(true);
    try {
      await api.deleteDocument(matterId, confirming.id);
      setConfirming(null);
      await onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <Dropzone onFilesAdded={handleFiles} />

      {uploading.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {uploading.map((it) => (
            <li
              key={it.id}
              className="flex items-center gap-3 rounded-md border border-line bg-surface px-3.5 py-2.5"
            >
              <Spinner className="text-muted" />
              <span className="flex-1 truncate text-[14px] text-ink">{it.name}</span>
              <span className="text-[12.5px] text-muted">Uploading and classifying…</span>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <Card className="border-danger/30 bg-[#f8eeec]">
          <CardBody>
            <p className="text-[13.5px] text-danger">{error}</p>
          </CardBody>
        </Card>
      )}

      {documents.length === 0 && uploading.length === 0 ? (
        <Card>
          <CardBody>
            <p className="text-[14px] text-muted">No documents yet. Drop PDFs above.</p>
          </CardBody>
        </Card>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {documents.map((d) => (
            <li key={d.id}>
              <Card>
                <CardBody className="flex items-center gap-4">
                  <div className="grid size-10 place-items-center rounded-md bg-paper-dim text-ink-soft">
                    <IconFileText />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-[14.5px] font-medium text-ink">{d.filename}</p>
                    <p className="text-[12.5px] text-muted">
                      {pluralise(d.pageCount, 'page')} · {formatBytes(d.sizeBytes)} · uploaded{' '}
                      {formatDateTime(d.uploadedAt)} · classified at{' '}
                      {(d.classificationConfidence * 100).toFixed(0)}%
                      {d.extractionMethod === 'ocr' && ' · text recovered by vision OCR'}
                    </p>
                  </div>
                  {d.extractionMethod === 'ocr' && (
                    <Badge tone="accent" title="Text recovered from a scanned PDF using vision OCR">
                      OCR
                    </Badge>
                  )}
                  <DocumentTypePicker
                    matterId={matterId}
                    documentId={d.id}
                    currentType={d.documentType}
                    onChanged={onChanged}
                  />
                  <button
                    type="button"
                    onClick={() => setConfirming(d)}
                    aria-label={`Remove ${d.filename}`}
                    className="rounded-md p-1.5 text-muted hover:bg-paper-dim hover:text-danger transition-colors"
                  >
                    <IconX />
                  </button>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={confirming !== null}
        title="Remove this document?"
        description="The PDF will be deleted from storage. Re-run the pipeline to update enquiries and the Report on Title."
        confirmLabel="Remove document"
        destructive
        loading={deleting}
        onConfirm={confirmDelete}
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
