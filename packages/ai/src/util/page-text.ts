export interface PageChunk {
  pageNumber: number;
  text: string;
}

export function formatPagesForPrompt(pages: PageChunk[], maxCharsPerPage = 6000): string {
  return pages
    .map((p) => {
      const text = p.text.length > maxCharsPerPage
        ? `${p.text.slice(0, maxCharsPerPage)}\n[... page truncated]`
        : p.text;
      return `<page n="${p.pageNumber}">\n${text}\n</page>`;
    })
    .join('\n\n');
}

export function totalChars(pages: PageChunk[]): number {
  return pages.reduce((sum, p) => sum + p.text.length, 0);
}

export function takeFirstN(pages: PageChunk[], n: number): PageChunk[] {
  return pages.slice(0, n);
}
