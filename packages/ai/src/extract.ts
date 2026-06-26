import { randomUUID } from 'node:crypto';
import type { Document, ExtractedFact, PageContent } from '@interfluo/core';
import type { AiClient } from './client';
import { EXTRACT_SYSTEM, extractUserPrompt } from './prompts/extract';
import { extractToolUse } from './util/json';
import { formatPagesForPrompt } from './util/page-text';

interface RawFact {
  category: string;
  key: string;
  value: string | number | boolean | null;
  pageNumber: number;
  quote: string;
}

interface RawFactsPayload {
  facts: RawFact[];
}

const EXTRACT_TOOL = {
  name: 'record_facts',
  description: 'Record extracted facts with citations',
  input_schema: {
    type: 'object' as const,
    properties: {
      facts: {
        type: 'array' as const,
        items: {
          type: 'object' as const,
          properties: {
            category: {
              type: 'string' as const,
              description: 'Grouping category, e.g. "title", "leasehold", "drainage"',
            },
            key: {
              type: 'string' as const,
              description: 'Snake_case identifier for the fact',
            },
            value: {
              description: 'String, number, boolean, or null',
            },
            pageNumber: {
              type: 'integer' as const,
              minimum: 1,
              description: 'Page number where the fact was found',
            },
            quote: {
              type: 'string' as const,
              minLength: 10,
              maxLength: 400,
              description:
                'Verbatim quote copied EXACTLY from the page text. Never a placeholder like <UNKNOWN>, [redacted], "N/A", or an ellipsis.',
            },
          },
          required: ['category', 'key', 'value', 'pageNumber', 'quote'],
        },
      },
    },
    required: ['facts'],
  },
};

export async function extractFacts(
  client: AiClient,
  document: Document,
  pages: PageContent[],
): Promise<ExtractedFact[]> {
  if (pages.length === 0) return [];
  const pagesText = formatPagesForPrompt(pages, 5500);
  const response = await client.anthropic.messages.create({
    model: client.defaultModel,
    max_tokens: 4096,
    temperature: 0,
    system: EXTRACT_SYSTEM,
    tools: [EXTRACT_TOOL],
    tool_choice: { type: 'tool', name: 'record_facts' },
    messages: [
      {
        role: 'user',
        content: extractUserPrompt(document.documentType, document.filename, pagesText),
      },
    ],
  });

  const parsed = extractToolUse<RawFactsPayload>(response, 'record_facts');
  if (!parsed) return [];

  const now = new Date().toISOString();
  return parsed.facts
    .filter((f) => f.pageNumber > 0 && f.pageNumber <= pages.length)
    .filter((f) => isUsableQuote(f.quote, pages[f.pageNumber - 1]?.text ?? ''))
    .map<ExtractedFact>((f) => ({
      id: randomUUID(),
      matterId: document.matterId,
      documentId: document.id,
      category: f.category,
      key: f.key,
      value: f.value,
      citation: {
        documentId: document.id,
        documentName: document.filename,
        documentType: document.documentType,
        pageNumber: f.pageNumber,
        quote: f.quote,
      },
      extractedAt: now,
    }));
}

const PLACEHOLDER_QUOTE = /^\s*(<[A-Z_ ]+>|\[[^\]]+\]|n\/?a|tbc|tbd|see (the )?document|unknown|not (?:stated|provided|specified|applicable|available)|\.{3,}|—+|-+)\s*$/i;

const normaliseForCompare = (s: string): string =>
  s.toLowerCase().replace(/\s+/g, ' ').replace(/[^a-z0-9 ]/g, '').trim();

function isUsableQuote(quote: string, pageText: string): boolean {
  if (!quote) return false;
  const trimmed = quote.trim();
  if (trimmed.length < 10) return false;
  if (PLACEHOLDER_QUOTE.test(trimmed)) return false;
  if (!pageText) return true;
  const haystack = normaliseForCompare(pageText);
  const needle = normaliseForCompare(trimmed);
  if (needle.length < 10) return false;
  if (haystack.includes(needle)) return true;
  // Allow partial verbatim match — at least the first 60 chars of the quote.
  if (needle.length > 60 && haystack.includes(needle.slice(0, 60))) return true;
  return false;
}
