'use client';

import { useEffect, useState } from 'react';
import type { Matter } from '@interfluo/core';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useApi } from '@/lib/api';

interface Props {
  open: boolean;
  matter: Matter;
  onClose: () => void;
  onSaved: () => Promise<unknown>;
}

export function EditMatterDialog({ open, matter, onClose, onSaved }: Props) {
  const api = useApi();
  const [reference, setReference] = useState(matter.reference);
  const [propertyAddress, setPropertyAddress] = useState(matter.propertyAddress ?? '');
  const [buyerName, setBuyerName] = useState(matter.buyerName ?? '');
  const [sellerName, setSellerName] = useState(matter.sellerName ?? '');
  const [tenure, setTenure] = useState<Matter['tenure']>(matter.tenure);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setReference(matter.reference);
    setPropertyAddress(matter.propertyAddress ?? '');
    setBuyerName(matter.buyerName ?? '');
    setSellerName(matter.sellerName ?? '');
    setTenure(matter.tenure);
    setError(null);
  }, [open, matter]);

  const handleSave = async () => {
    if (!reference.trim()) {
      setError('A matter reference is required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await api.updateMatter(matter.id, {
        reference: reference.trim(),
        propertyAddress: propertyAddress.trim() || null,
        buyerName: buyerName.trim() || null,
        sellerName: sellerName.trim() || null,
        tenure,
      });
      await onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ConfirmDialog
      open={open}
      title="Edit matter"
      description="Update the matter details. If you change the address or tenure after the pipeline has run, consider re-running so the model reasons from the corrected facts."
      confirmLabel="Save changes"
      cancelLabel="Cancel"
      loading={saving}
      onConfirm={handleSave}
      onCancel={() => !saving && onClose()}
    >
      <div className="flex flex-col gap-4">
        <Input
          label="Matter reference"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          required
        />
        <Input
          label="Property address"
          value={propertyAddress}
          onChange={(e) => setPropertyAddress(e.target.value)}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Buyer"
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
          />
          <Input
            label="Seller"
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
      </div>
    </ConfirmDialog>
  );
}
