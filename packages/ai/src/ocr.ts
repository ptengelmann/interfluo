import type { PageContent } from '@interfluo/core';
import type { AiClient } from './client';
import { extractToolUse } from './util/json';

const OCR_SYSTEM = `You are an OCR engine for UK residential conveyancing documents.
Transcribe the visible text on each page of the PDF exactly as it appears.

Rules:
- Preserve numbering (1.1, 1.2, etc.), headings, table structure, and form-field labels with their answers.
- Do NOT summarise, paraphrase, or skip content.
- Do NOT explain or comment — output is transcription only.
- If a page is essentially blank (or contains only a header/footer), return an empty string for that page's text.
- If a section is handwritten and unreadable, transcribe what you can and mark unclear words with [illegible].
- Pages are 1-indexed.`;

const OCR_TOOL = {
  name: 'record_pages',
  description: 'Record the transcribed text for each page',
  input_schema: {
    type: 'object' as const,
    properties: {
      pages: {
        type: 'array' as const,
        items: {
          type: 'object' as const,
          properties: {
            pageNumber: { type: 'integer' as const, minimum: 1 },
            text: { type: 'string' as const },
          },
          required: ['pageNumber', 'text'],
        },
      },
    },
    required: ['pages'],
  },
};

interface RawOcrPayload {
  pages: { pageNumber: number; text: string }[];
}

export interface OcrPageDimension {
  pageNumber: number;
  width: number;
  height: number;
}

/**
 * OCR a PDF by passing it directly to Anthropic's PDF document input.
 * The model performs vision-based transcription on each page and returns
 * structured text per page.
 *
 * The PDF must be ≤ 32 MB and ≤ 100 pages (Anthropic limits).
 */
export async function ocrPdf(
  client: AiClient,
  pdfBuffer: Buffer,
  dimensions: OcrPageDimension[],
): Promise<PageContent[]> {
  if (pdfBuffer.length > 32 * 1024 * 1024) {
    throw new Error(`PDF exceeds 32 MB OCR limit (${pdfBuffer.length} bytes)`);
  }
  if (dimensions.length > 100) {
    throw new Error(`PDF exceeds 100-page OCR limit (${dimensions.length} pages)`);
  }

  const base64 = pdfBuffer.toString('base64');

  const response = await client.anthropic.messages.create({
    model: client.defaultModel,
    max_tokens: 16000,
    temperature: 0,
    system: OCR_SYSTEM,
    tools: [OCR_TOOL],
    tool_choice: { type: 'tool', name: 'record_pages' },
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'base64',
              media_type: 'application/pdf',
              data: base64,
            },
          },
          {
            type: 'text',
            text: `This PDF has ${dimensions.length} page${dimensions.length === 1 ? '' : 's'}. Transcribe every page. Call the record_pages tool with one entry per page in order (pageNumber 1..${dimensions.length}).`,
          },
        ],
      },
    ],
  });

  const parsed = extractToolUse<RawOcrPayload>(response, 'record_pages');
  const raw = parsed?.pages ?? [];
  const byPage = new Map(raw.map((p) => [p.pageNumber, p.text]));

  return dimensions.map<PageContent>((dim) => ({
    pageNumber: dim.pageNumber,
    text: byPage.get(dim.pageNumber) ?? '',
    width: dim.width,
    height: dim.height,
  }));
}
