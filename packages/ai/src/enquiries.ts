import { randomUUID } from 'node:crypto';
import {
  ENQUIRY_CATEGORIES,
  type Citation,
  type Enquiry,
  type EnquiryCategory,
  type ExtractedFact,
  type RiskFlag,
} from '@interfluo/core';
import type { AiClient } from './client';
import { ENQUIRIES_SYSTEM, enquiriesUserPrompt } from './prompts/enquiries';
import { extractToolUse, truncate } from './util/json';
import { shortenFacts, shortenRisks } from './util/short-ids';

interface RawEnquiry {
  category: EnquiryCategory;
  question: string;
  rationale: string;
  priority: number;
  supportingFactIds: string[];
  supportingRiskIds: string[];
}

interface RawEnquiriesPayload {
  enquiries: RawEnquiry[];
}

const ENQUIRIES_TOOL = {
  name: 'record_enquiries',
  description: 'Record drafted enquiries with citations',
  input_schema: {
    type: 'object' as const,
    properties: {
      enquiries: {
        type: 'array' as const,
        items: {
          type: 'object' as const,
          properties: {
            category: { type: 'string' as const, enum: [...ENQUIRY_CATEGORIES] },
            question: {
              type: 'string' as const,
              description: 'The enquiry text as it will be sent',
            },
            rationale: {
              type: 'string' as const,
              description: 'Single sentence explaining why we are asking',
            },
            priority: {
              type: 'integer' as const,
              minimum: 1,
              maximum: 5,
              description: '1 = highest priority (deal critical), 5 = lowest',
            },
            supportingFactIds: {
              type: 'array' as const,
              items: { type: 'string' as const },
              description: 'Short fact ids like "F012" copied EXACTLY from the input.',
            },
            supportingRiskIds: {
              type: 'array' as const,
              items: { type: 'string' as const },
              description: 'Short risk ids like "R003" copied EXACTLY from the input.',
            },
          },
          required: [
            'category',
            'question',
            'rationale',
            'priority',
            'supportingFactIds',
            'supportingRiskIds',
          ],
        },
      },
    },
    required: ['enquiries'],
  },
};

export async function generateEnquiries(
  client: AiClient,
  matterId: string,
  propertyAddress: string | null,
  facts: ExtractedFact[],
  risks: RiskFlag[],
): Promise<Enquiry[]> {
  const factMap = shortenFacts(facts);
  const riskMap = shortenRisks(risks);

  const factsJson = truncate(JSON.stringify(factMap.summaries), 80_000);
  const risksJson = truncate(JSON.stringify(riskMap.summaries), 15_000);

  const response = await client.anthropic.messages.create({
    model: client.defaultModel,
    max_tokens: 8000,
    temperature: 0.2,
    system: ENQUIRIES_SYSTEM,
    tools: [ENQUIRIES_TOOL],
    tool_choice: { type: 'tool', name: 'record_enquiries' },
    messages: [{ role: 'user', content: enquiriesUserPrompt(propertyAddress, factsJson, risksJson) }],
  });

  const parsed = extractToolUse<RawEnquiriesPayload>(response, 'record_enquiries');
  const rawEnquiries = parsed?.enquiries ?? [];
  if (rawEnquiries.length === 0) return [];

  const now = new Date().toISOString();

  return rawEnquiries.map<Enquiry>((e) => {
    const factCitations: Citation[] = (e.supportingFactIds ?? [])
      .map((id) => factMap.byShort.get(id))
      .filter((f): f is ExtractedFact => Boolean(f))
      .map((f) => f.citation);
    const riskCitations: Citation[] = (e.supportingRiskIds ?? [])
      .map((id) => riskMap.byShort.get(id))
      .filter((r): r is RiskFlag => Boolean(r))
      .flatMap((r) => r.citations);
    const allCitations: Citation[] = [...factCitations, ...riskCitations];
    const seen = new Set<string>();
    const citations = allCitations.filter((c) => {
      const key = `${c.documentId}:${c.pageNumbers.join('-')}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return {
      id: randomUUID(),
      matterId,
      category: e.category,
      question: e.question,
      rationale: e.rationale,
      priority: e.priority,
      citations,
      status: 'suggested',
      editedQuestion: null,
      createdAt: now,
    };
  });
}
