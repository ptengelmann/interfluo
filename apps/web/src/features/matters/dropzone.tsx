'use client';

import { IconUpload } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { type DragEvent, useCallback, useRef, useState } from 'react';

export function Dropzone({
  onFilesAdded,
  disabled,
}: {
  onFilesAdded: (files: File[]) => void;
  disabled?: boolean;
}) {
  const [over, setOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handle = useCallback(
    (incoming: FileList | File[]) => {
      const list = Array.from(incoming).filter(
        (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'),
      );
      if (list.length > 0) onFilesAdded(list);
    },
    [onFilesAdded],
  );

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setOver(false);
    if (disabled) return;
    if (e.dataTransfer.files) handle(e.dataTransfer.files);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={onDrop}
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-dashed bg-paper-dim/30 px-8 py-14 text-center transition-colors',
        over ? 'border-accent bg-accent-tint' : 'border-line-strong',
        disabled && 'opacity-50',
      )}
    >
      <IconUpload width={26} height={26} className="text-muted" />
      <p className="font-display mt-4 text-[22px] text-ink">Drop the contract pack here</p>
      <p className="mt-1.5 text-[13.5px] text-ink-soft">
        PDFs only · contract, TR1, title register, TA6 / TA7 / TA10, lease, searches
      </p>
      <Button
        variant="secondary"
        size="sm"
        className="mt-5"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
      >
        Browse files
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files) handle(e.target.files);
          e.target.value = '';
        }}
      />
    </div>
  );
}
