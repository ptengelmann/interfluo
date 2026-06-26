import { randomUUID } from 'node:crypto';
import type { Document, PageContent } from '@interfluo/core';
import { classifyDocument, ocrPdf } from '@interfluo/ai';
import { extractPdfContent } from '@interfluo/pdf';
import type { AppContext } from '../context';
import { ApiError } from '../errors';

export interface IngestedDocument {
  document: Document;
  pages: PageContent[];
}

// If average chars per page is below this, the PDF is most likely scanned
// (no text layer) and we fall back to vision OCR.
const OCR_TRIGGER_AVG_CHARS_PER_PAGE = 60;

export async function ingestDocument(
  ctx: AppContext,
  matterId: string,
  filename: string,
  buffer: Buffer,
): Promise<IngestedDocument> {
  const matter = await ctx.repo.getMatter(matterId);
  if (!matter) throw new ApiError('matter_not_found', 'Matter not found', 404);

  const documentId = `doc_${randomUUID()}`;
  const storageKey = `${matter.firmId}/${matterId}/${documentId}.pdf`;

  ctx.logger.info({ matterId, documentId, filename, size: buffer.length }, 'Ingesting PDF');

  await ctx.blobs.put(storageKey, buffer, 'application/pdf');

  let extraction: Awaited<ReturnType<typeof extractPdfContent>>;
  try {
    extraction = await extractPdfContent(buffer);
  } catch (err) {
    ctx.logger.error({ err, filename }, 'PDF extraction failed');
    throw new ApiError('pdf_parse_failed', `Failed to parse PDF: ${(err as Error).message}`, 422);
  }

  let pages: PageContent[] = extraction.pages.map((p) => ({
    pageNumber: p.pageNumber,
    text: p.text,
    width: p.width,
    height: p.height,
  }));

  let extractionMethod: 'text' | 'ocr' = 'text';
  const averageChars =
    pages.length > 0 ? extraction.totalCharacters / pages.length : 0;

  if (averageChars < OCR_TRIGGER_AVG_CHARS_PER_PAGE && pages.length > 0) {
    ctx.logger.info(
      { documentId, filename, averageChars, pageCount: pages.length },
      'Low text density — falling back to vision OCR',
    );
    try {
      const dimensions = pages.map((p) => ({
        pageNumber: p.pageNumber,
        width: p.width,
        height: p.height,
      }));
      pages = await ocrPdf(ctx.ai, buffer, dimensions);
      extractionMethod = 'ocr';
      const ocrChars = pages.reduce((s, p) => s + p.text.length, 0);
      ctx.logger.info(
        { documentId, filename, ocrChars, pageCount: pages.length },
        'OCR complete',
      );
    } catch (err) {
      ctx.logger.error({ err, documentId, filename }, 'OCR failed — using empty text');
      // Keep the (effectively empty) text-layer pages; downstream extraction
      // will simply produce 0 facts for this doc.
    }
  }

  const classification = await classifyDocument(ctx.ai, pages);
  ctx.logger.info(
    {
      documentId,
      filename,
      type: classification.documentType,
      confidence: classification.confidence,
      extractionMethod,
    },
    'Classified document',
  );

  const document: Document = {
    id: documentId,
    matterId,
    filename,
    documentType: classification.documentType,
    classificationConfidence: classification.confidence,
    pageCount: extraction.pageCount,
    sizeBytes: buffer.length,
    uploadedAt: new Date().toISOString(),
    storageKey,
    extractionMethod,
  };

  await ctx.repo.addDocument(document);

  return { document, pages };
}
