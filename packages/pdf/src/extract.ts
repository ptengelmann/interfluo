import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import type { TextItem } from 'pdfjs-dist/types/src/display/api.js';

export interface PdfPage {
  pageNumber: number;
  text: string;
  width: number;
  height: number;
  wordCount: number;
}

export interface PdfExtractionResult {
  pageCount: number;
  pages: PdfPage[];
  totalCharacters: number;
  totalWords: number;
}

function isTextItem(item: unknown): item is TextItem {
  return typeof item === 'object' && item !== null && 'str' in item;
}

export async function extractPdfContent(buffer: Buffer | Uint8Array): Promise<PdfExtractionResult> {
  const data = buffer instanceof Buffer ? new Uint8Array(buffer) : buffer;

  const loadingTask = getDocument({
    data,
    isEvalSupported: false,
    useSystemFonts: true,
    disableFontFace: true,
    verbosity: 0,
  });

  const pdf = await loadingTask.promise;
  const pages: PdfPage[] = [];
  let totalCharacters = 0;
  let totalWords = 0;

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1 });
    const content = await page.getTextContent();

    let lastY: number | null = null;
    const lineBuffer: string[] = [];

    for (const item of content.items) {
      if (!isTextItem(item)) continue;
      const transform = item.transform;
      const y = transform[5];
      const text = item.str;

      if (lastY !== null && Math.abs((y ?? 0) - lastY) > 4) {
        lineBuffer.push('\n');
      } else if (lineBuffer.length > 0 && !lineBuffer[lineBuffer.length - 1]?.endsWith(' ')) {
        lineBuffer.push(' ');
      }

      lineBuffer.push(text);
      lastY = y ?? lastY;
    }

    const text = lineBuffer
      .join('')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    const wordCount = text.split(/\s+/).filter(Boolean).length;
    totalCharacters += text.length;
    totalWords += wordCount;

    pages.push({
      pageNumber,
      text,
      width: viewport.width,
      height: viewport.height,
      wordCount,
    });

    page.cleanup();
  }

  await pdf.cleanup();
  await pdf.destroy();

  return {
    pageCount: pdf.numPages,
    pages,
    totalCharacters,
    totalWords,
  };
}
