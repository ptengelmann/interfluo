import type { ExtractedFact, RiskFlag } from '@interfluo/core';

export interface ShortIdMap<T> {
  byShort: Map<string, T>;
  byOriginal: Map<string, string>;
  summaries: ({ id: string } & Record<string, unknown>)[];
}

export function shortenFacts(facts: ExtractedFact[]): ShortIdMap<ExtractedFact> {
  const byShort = new Map<string, ExtractedFact>();
  const byOriginal = new Map<string, string>();
  const summaries: ({ id: string } & Record<string, unknown>)[] = [];

  facts.forEach((f, i) => {
    const shortId = `F${String(i + 1).padStart(3, '0')}`;
    byShort.set(shortId, f);
    byOriginal.set(f.id, shortId);
    summaries.push({
      id: shortId,
      doc: f.citation.documentType,
      page: f.citation.pageNumber,
      category: f.category,
      key: f.key,
      value: f.value,
    });
  });

  return { byShort, byOriginal, summaries };
}

export function shortenRisks(risks: RiskFlag[]): ShortIdMap<RiskFlag> {
  const byShort = new Map<string, RiskFlag>();
  const byOriginal = new Map<string, string>();
  const summaries: ({ id: string } & Record<string, unknown>)[] = [];

  risks.forEach((r, i) => {
    const shortId = `R${String(i + 1).padStart(3, '0')}`;
    byShort.set(shortId, r);
    byOriginal.set(r.id, shortId);
    summaries.push({
      id: shortId,
      severity: r.severity,
      title: r.title,
      description: r.description,
    });
  });

  return { byShort, byOriginal, summaries };
}
