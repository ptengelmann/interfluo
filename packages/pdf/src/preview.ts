import { extractPdfContent } from './extract';

export async function renderFirstPagePreview(buffer: Buffer | Uint8Array): Promise<string> {
  const result = await extractPdfContent(buffer);
  const firstPage = result.pages[0];
  if (!firstPage) return '';
  return firstPage.text.slice(0, 1500);
}
