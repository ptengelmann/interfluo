'use client';

import { DocumentTypeLabel } from '@/components/document-type-label';
import { IconArrowLeft, IconCheck, IconX } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Dropzone } from '@/features/matters/dropzone';
import { useApi } from '@/lib/api';
import { formatBytes, pluralise } from '@/lib/format';
import type { Document, Matter } from '@interfluo/core';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

type Step = 'details' | 'upload';

interface UploadItem {
  id: string;
  file: File;
  status: 'uploading' | 'done' | 'error';
  document?: Document;
  error?: string;
}

export function NewMatterWizard() {
  const router = useRouter();
  const api = useApi();
  const [step, setStep] = useState<Step>('details');
  const [creating, setCreating] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [reference, setReference] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [tenure, setTenure] = useState<'freehold' | 'leasehold' | 'unknown'>('unknown');

  const [matter, setMatter] = useState<Matter | null>(null);
  const [items, setItems] = useState<UploadItem[]>([]);

  const createMatter = async () => {
    if (!reference.trim()) {
      setError('A matter reference is required.');
      return;
    }
    setError(null);
    setCreating(true);
    try {
      const res = await api.createMatter({
        reference: reference.trim(),
        propertyAddress: propertyAddress.trim() || undefined,
        buyerName: buyerName.trim() || undefined,
        sellerName: sellerName.trim() || undefined,
        tenure,
      });
      setMatter(res.matter);
      setStep('upload');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create matter');
    } finally {
      setCreating(false);
    }
  };

  const uploadOne = useCallback(
    async (matterId: string, file: File, tempId: string) => {
      try {
        const res = await api.uploadDocuments(matterId, [file]);
        const doc = res.documents[0];
        setItems((prev) =>
          prev.map((it) =>
            it.id === tempId
              ? doc
                ? { ...it, status: 'done', document: doc }
                : { ...it, status: 'error', error: 'No document returned' }
              : it,
          ),
        );
      } catch (err) {
        setItems((prev) =>
          prev.map((it) =>
            it.id === tempId
              ? {
                  ...it,
                  status: 'error',
                  error: err instanceof Error ? err.message : 'Upload failed',
                }
              : it,
          ),
        );
      }
    },
    [api],
  );

  const onFilesDropped = useCallback(
    (files: File[]) => {
      if (!matter || files.length === 0) return;
      const newItems: UploadItem[] = files.map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        status: 'uploading',
      }));
      setItems((prev) => [...prev, ...newItems]);
      for (const it of newItems) {
        void uploadOne(matter.id, it.file, it.id);
      }
    },
    [matter, uploadOne],
  );

  const retry = (it: UploadItem) => {
    if (!matter) return;
    setItems((prev) =>
      prev.map((p) => (p.id === it.id ? { ...p, status: 'uploading', error: undefined } : p)),
    );
    void uploadOne(matter.id, it.file, it.id);
  };

  const remove = (it: UploadItem) => {
    setItems((prev) => prev.filter((p) => p.id !== it.id));
  };

  const startProcessing = async () => {
    if (!matter) return;
    setProcessing(true);
    try {
      await api.processMatter(matter.id);
      router.push(`/matters/${matter.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start processing');
      setProcessing(false);
    }
  };

  const uploadedCount = items.filter((i) => i.status === 'done').length;
  const uploadingCount = items.filter((i) => i.status === 'uploading').length;

  return (
    <div className="mx-auto flex max-w-[720px] flex-col gap-8">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[13px] text-ink-soft hover:text-ink"
        >
          <IconArrowLeft /> Back to matters
        </Link>
        <Steps step={step} />
      </div>

      {step === 'details' && (
        <Card>
          <CardHeader
            title="New matter"
            description="A reference for the transaction. Everything else is optional."
          />
          <CardBody className="flex flex-col gap-5">
            <Input
              label="Matter reference"
              placeholder="MAT-2026-0142 — 12 Wynyard Terrace"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              autoFocus
              required
            />
            <Input
              label="Property address"
              placeholder="12 Wynyard Terrace, London SE17 3JL"
              value={propertyAddress}
              onChange={(e) => setPropertyAddress(e.target.value)}
            />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Input
                label="Buyer"
                placeholder="Anita Patel"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
              />
              <Input
                label="Seller"
                placeholder="John Whitaker"
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="label">Tenure</span>
              <div className="inline-flex rounded-md border border-line bg-surface p-1 text-[13px]">
                {(['freehold', 'leasehold', 'unknown'] as const).map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setTenure(t)}
                    className={
                      tenure === t
                        ? 'rounded-sm bg-ink px-4 py-2 font-semibold text-on-ink'
                        : 'rounded-sm px-4 py-2 text-ink-soft hover:text-ink'
                    }
                  >
                    {t[0]?.toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            {error && <p className="text-[13px] text-danger">{error}</p>}
          </CardBody>
          <CardFooter>
            <span className="text-[12.5px] text-muted">You can edit any of this later.</span>
            <Button onClick={createMatter} loading={creating}>
              Continue
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 'upload' && matter && (
        <Card>
          <CardHeader
            title="Upload the contract pack"
            description="Draft contract, TR1, title register, TA6 / TA7 / TA10, the lease (if leasehold), and the searches. Files upload and classify automatically as you add them."
            action={<Badge tone="muted">{matter.reference}</Badge>}
          />
          <CardBody className="flex flex-col gap-5">
            <Dropzone onFilesAdded={onFilesDropped} disabled={processing} />

            {items.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="label">
                  {uploadedCount} of {items.length} classified
                  {uploadingCount > 0 && ` · ${uploadingCount} uploading`}
                </span>
                <ul className="divide-y divide-line rounded-md border border-line bg-paper-dim/40">
                  {items.map((it) => (
                    <li key={it.id} className="flex items-center gap-3 px-4 py-3">
                      {it.status === 'uploading' && <Spinner className="text-muted" />}
                      {it.status === 'done' && <IconCheck className="text-accent" />}
                      {it.status === 'error' && <IconX className="text-danger" />}
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-[14px] text-ink">{it.file.name}</p>
                        <p className="text-[12.5px] text-muted">
                          {it.status === 'uploading' && 'Uploading and classifying…'}
                          {it.status === 'done' && it.document && (
                            <>
                              {pluralise(it.document.pageCount, 'page')} ·{' '}
                              {formatBytes(it.document.sizeBytes)} · classified at{' '}
                              {(it.document.classificationConfidence * 100).toFixed(0)}%
                            </>
                          )}
                          {it.status === 'error' && (
                            <span className="text-danger">{it.error ?? 'Upload failed'}</span>
                          )}
                        </p>
                      </div>
                      {it.status === 'done' && it.document && (
                        <DocumentTypeLabel type={it.document.documentType} />
                      )}
                      {it.status === 'error' && (
                        <>
                          <Button size="sm" variant="ghost" onClick={() => retry(it)}>
                            Retry
                          </Button>
                          <button
                            type="button"
                            aria-label="Remove"
                            onClick={() => remove(it)}
                            className="rounded p-1 text-muted hover:text-danger"
                          >
                            <IconX />
                          </button>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {error && <p className="text-[13px] text-danger">{error}</p>}
          </CardBody>
          <CardFooter>
            <Link href="/" className="text-[13px] text-ink-soft hover:text-ink">
              Cancel
            </Link>
            <Button
              onClick={startProcessing}
              disabled={uploadedCount === 0 || uploadingCount > 0}
              loading={processing}
              title={
                uploadedCount === 0
                  ? 'Upload at least one document first'
                  : uploadingCount > 0
                    ? 'Wait for uploads to finish'
                    : undefined
              }
            >
              Run pipeline ({uploadedCount})
            </Button>
          </CardFooter>
        </Card>
      )}

      {processing && (
        <p className="inline-flex items-center justify-center gap-2 text-center text-[13px] text-ink-soft">
          <Spinner /> Starting the pipeline…
        </p>
      )}
    </div>
  );
}

function Steps({ step }: { step: Step }) {
  const order: Step[] = ['details', 'upload'];
  const i = order.indexOf(step);
  return (
    <div className="flex items-center gap-2 text-[12px] text-muted">
      {order.map((s, idx) => (
        <span key={s} className="flex items-center gap-2">
          <span
            className={
              idx <= i
                ? 'inline-flex h-6 w-6 items-center justify-center rounded-pill bg-ink text-[11px] font-semibold text-on-ink'
                : 'inline-flex h-6 w-6 items-center justify-center rounded-pill border border-line text-[11px] text-muted'
            }
          >
            {idx + 1}
          </span>
          <span className={idx <= i ? 'font-semibold text-ink' : ''}>
            {s === 'details' ? 'Details' : 'Upload'}
          </span>
          {idx < order.length - 1 && <span className="h-px w-8 bg-line" />}
        </span>
      ))}
    </div>
  );
}
