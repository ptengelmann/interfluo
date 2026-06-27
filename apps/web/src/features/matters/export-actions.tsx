'use client';

import { useAuth } from '@clerk/nextjs';
import { useCallback, useState } from 'react';
import type { Enquiry, EnquiryCategory, ReportOnTitle } from '@interfluo/core';
import { DOCUMENT_TYPE_LABELS, formatPages } from '@interfluo/core';
import { Button } from '@/components/ui/button';
import { API_BASE_URL } from '@/lib/api';

const CATEGORY_LABELS: Record<EnquiryCategory, string> = {
  title: 'Title',
  boundaries: 'Boundaries',
  covenants: 'Covenants',
  easements: 'Easements',
  planning: 'Planning',
  building_regulations: 'Building Regulations',
  environmental: 'Environmental',
  utilities: 'Utilities',
  leasehold: 'Leasehold',
  searches: 'Searches',
  fixtures: 'Fixtures',
  occupiers: 'Occupiers',
  disputes: 'Disputes',
  other: 'Other',
};

function formatEnquiriesAsText(enquiries: Enquiry[]): string {
  const sendable = enquiries.filter((e) => e.status === 'accepted' || e.status === 'edited');
  if (sendable.length === 0) return '';

  const byCategory = new Map<EnquiryCategory, Enquiry[]>();
  for (const e of sendable) {
    const list = byCategory.get(e.category) ?? [];
    list.push(e);
    byCategory.set(e.category, list);
  }

  const lines: string[] = [];
  let counter = 0;
  for (const [category, list] of byCategory) {
    lines.push(CATEGORY_LABELS[category]);
    lines.push('');
    for (const e of list) {
      counter += 1;
      const question = e.editedQuestion ?? e.question;
      lines.push(`${counter}. ${question}`);
      if (e.citations.length > 0) {
        const sources = e.citations
          .map((c) => `${DOCUMENT_TYPE_LABELS[c.documentType]}, ${formatPages(c.pageNumbers)}`)
          .join('; ');
        lines.push(`   Sources: ${sources}`);
      }
      lines.push('');
    }
  }
  return lines.join('\n').trim();
}

function filenameFromHeader(header: string | null, fallback: string): string {
  if (!header) return fallback;
  const utf8Match = header.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1]);
    } catch {
      // fall through
    }
  }
  const asciiMatch = header.match(/filename="?([^";]+)"?/i);
  return asciiMatch?.[1] ?? fallback;
}

function useDownload() {
  const { getToken } = useAuth();
  return useCallback(
    async (path: string, fallbackName: string) => {
      const token = await getToken();
      const res = await fetch(`${API_BASE_URL}${path}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Download failed (${res.status})`);
      }
      const blob = await res.blob();
      const filename = filenameFromHeader(res.headers.get('Content-Disposition'), fallbackName);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    },
    [getToken],
  );
}

export function EnquiriesExport({
  matterId,
  enquiries,
}: {
  matterId: string;
  enquiries: Enquiry[];
}) {
  const download = useDownload();
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendableCount = enquiries.filter(
    (e) => e.status === 'accepted' || e.status === 'edited',
  ).length;

  const copy = useCallback(async () => {
    const text = formatEnquiriesAsText(enquiries);
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'absolute';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [enquiries]);

  const onDownload = useCallback(async () => {
    setDownloading(true);
    setError(null);
    try {
      await download(`/v1/matters/${matterId}/export/enquiries.docx`, 'Enquiries.docx');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed');
    } finally {
      setDownloading(false);
    }
  }, [download, matterId]);

  if (sendableCount === 0) {
    return (
      <p className="text-[12.5px] italic text-muted">Accept enquiries to enable export.</p>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {error && <span className="text-[12.5px] text-danger">{error}</span>}
      <Button size="sm" variant="ghost" onClick={copy}>
        {copied ? 'Copied' : `Copy ${sendableCount}`}
      </Button>
      <Button size="sm" variant="secondary" onClick={onDownload} loading={downloading}>
        Download .docx
      </Button>
    </div>
  );
}

export function ReportExport({
  matterId,
  report,
}: {
  matterId: string;
  report: ReportOnTitle | null;
}) {
  const download = useDownload();
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDownload = useCallback(async () => {
    setDownloading(true);
    setError(null);
    try {
      await download(`/v1/matters/${matterId}/export/report.docx`, 'Report on Title.docx');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed');
    } finally {
      setDownloading(false);
    }
  }, [download, matterId]);

  if (!report) return null;
  return (
    <div className="flex items-center gap-2">
      {error && <span className="text-[12.5px] text-danger">{error}</span>}
      <Button size="sm" variant="secondary" onClick={onDownload} loading={downloading}>
        Download .docx
      </Button>
    </div>
  );
}
