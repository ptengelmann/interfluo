'use client';

import { useEffect, useRef, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';

interface PdfRendererProps {
  url: string;
  authHeader: string | null;
  pageNumber: number;
  scale: number;
  onLoaded?: (meta: { pageCount: number; title: string | null }) => void;
  onError?: (message: string) => void;
}

interface PdfDocLike {
  numPages: number;
  destroy: () => Promise<void>;
  cleanup: () => void;
  getPage: (n: number) => Promise<PdfPageLike>;
  getMetadata?: () => Promise<{ info?: { Title?: string } }>;
}

interface PdfPageLike {
  getViewport: (opts: { scale: number }) => { width: number; height: number };
  render: (opts: { canvasContext: CanvasRenderingContext2D; viewport: unknown }) => {
    promise: Promise<void>;
    cancel: () => void;
  };
  cleanup: () => void;
}

export function PdfRenderer({
  url,
  authHeader,
  pageNumber,
  scale,
  onLoaded,
  onError,
}: PdfRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const docRef = useRef<PdfDocLike | null>(null);
  const lastUrlRef = useRef<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageRendering, setPageRendering] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (lastUrlRef.current === url && docRef.current) return;

    setLoading(true);
    setErr(null);

    (async () => {
      try {
        const pdfjs = (await import('pdfjs-dist')) as unknown as {
          getDocument: (opts: Record<string, unknown>) => { promise: Promise<PdfDocLike> };
          GlobalWorkerOptions: { workerSrc: string };
        };
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
        const httpHeaders: Record<string, string> = {};
        if (authHeader) httpHeaders.Authorization = authHeader;

        const loadingTask = pdfjs.getDocument({
          url,
          httpHeaders,
          withCredentials: false,
          isEvalSupported: false,
          disableAutoFetch: false,
          disableStream: false,
        });
        const pdf = await loadingTask.promise;
        if (cancelled) {
          await pdf.destroy();
          return;
        }
        if (docRef.current) {
          await docRef.current.destroy().catch(() => {});
        }
        docRef.current = pdf;
        lastUrlRef.current = url;
        let title: string | null = null;
        try {
          const meta = await pdf.getMetadata?.();
          title = meta?.info?.Title ?? null;
        } catch {
          // ignore
        }
        onLoaded?.({ pageCount: pdf.numPages, title });
        setLoading(false);
      } catch (e) {
        if (cancelled) return;
        const message = e instanceof Error ? e.message : 'Failed to open PDF';
        setErr(message);
        onError?.(message);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [url, authHeader, onLoaded, onError]);

  useEffect(() => {
    const pdf = docRef.current;
    if (!pdf || loading) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cancelled = false;
    let renderTask: ReturnType<PdfPageLike['render']> | null = null;
    setPageRendering(true);

    (async () => {
      try {
        const safePage = Math.max(1, Math.min(pdf.numPages, pageNumber));
        const page = await pdf.getPage(safePage);
        if (cancelled) return;
        const viewport = page.getViewport({ scale });
        const ratio = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * ratio);
        canvas.height = Math.floor(viewport.height * ratio);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        renderTask = page.render({ canvasContext: ctx, viewport });
        await renderTask.promise;
        page.cleanup();
      } catch (e) {
        if (cancelled) return;
        const isCancellation =
          e instanceof Error && /cancelled|aborted/i.test(e.message);
        if (!isCancellation) {
          const message = e instanceof Error ? e.message : 'Failed to render page';
          setErr(message);
          onError?.(message);
        }
      } finally {
        if (!cancelled) setPageRendering(false);
      }
    })();

    return () => {
      cancelled = true;
      renderTask?.cancel();
    };
  }, [pageNumber, scale, loading, onError]);

  useEffect(() => {
    return () => {
      docRef.current?.destroy().catch(() => {});
      docRef.current = null;
      lastUrlRef.current = null;
    };
  }, []);

  if (err) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-8 text-center">
        <p className="font-display text-[20px] text-ink">Couldn't open this PDF</p>
        <p className="mt-2 max-w-md text-[13.5px] text-ink-soft">{err}</p>
      </div>
    );
  }

  return (
    <div className="relative flex h-full w-full justify-center overflow-auto bg-paper-dim/40 p-6">
      {(loading || pageRendering) && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-paper/40 backdrop-blur-[1px]">
          <Spinner className="text-muted" size={24} />
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="rounded-md border border-line bg-white shadow-[var(--shadow-card)]"
      />
    </div>
  );
}
