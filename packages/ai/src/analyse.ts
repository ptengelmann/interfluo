import { randomUUID } from 'node:crypto';
import { RISK_SEVERITIES, type ExtractedFact, type RiskFlag, type RiskSeverity } from '@interfluo/core';
import type { AiClient } from './client';
import { ANALYSE_SYSTEM, analyseUserPrompt } from './prompts/analyse';
import { extractToolUse, truncate } from './util/json';

interface RawRisk {
  severity: RiskSeverity;
  title: string;
  description: string;
  supportingFactIds: string[];
}

interface RawRisksPayload {
  risks: RawRisk[];
}

const ANALYSE_TOOL = {
  name: 'record_risks',
  description: 'Record identified risks and citations',
  input_schema: {
    type: 'object' as const,
    properties: {
      risks: {
        type: 'array' as const,
        items: {
          type: 'object' as const,
          properties: {
            severity: { type: 'string' as const, enum: [...RISK_SEVERITIES] },
            title: { type: 'string' as const, description: 'Short risk title (max 120 chars)' },
            description: {
              type: 'string' as const,
              description: 'One-paragraph description of the risk and its consequence',
            },
            supportingFactIds: {
              type: 'array' as const,
              items: { type: 'string' as const },
              description: 'fact ids from the input that evidence this risk',
            },
          },
          required: ['severity', 'title', 'description', 'supportingFactIds'],
        },
      },
    },
    required: ['risks'],
  },
};

export async function analyseRisks(
  client: AiClient,
  matterId: string,
  propertyAddress: string | null,
  facts: ExtractedFact[],
): Promise<RiskFlag[]> {
  if (facts.length === 0) return [];
  const factsSummary = facts.map((f) => ({
    id: f.id,
    documentType: f.citation.documentType,
    category: f.category,
    key: f.key,
    value: f.value,
    page: f.citation.pageNumber,
  }));
  const factsJson = truncate(JSON.stringify(factsSummary), 90_000);

  const response = await client.anthropic.messages.create({
    model: client.defaultModel,
    max_tokens: 4096,
    temperature: 0,
    system: ANALYSE_SYSTEM,
    tools: [ANALYSE_TOOL],
    tool_choice: { type: 'tool', name: 'record_risks' },
    messages: [{ role: 'user', content: analyseUserPrompt(propertyAddress, factsJson) }],
  });

  const parsed = extractToolUse<RawRisksPayload>(response, 'record_risks');
  const rawRisks = parsed?.risks ?? [];
  if (rawRisks.length === 0) return [];

  const factsById = new Map(facts.map((f) => [f.id, f]));

  return rawRisks.map<RiskFlag>((r) => {
    const citations = (r.supportingFactIds ?? [])
      .map((id) => factsById.get(id))
      .filter((f): f is ExtractedFact => Boolean(f))
      .map((f) => f.citation);
    return {
      id: randomUUID(),
      matterId,
      severity: r.severity,
      title: (r.title ?? '').slice(0, 120),
      description: r.description ?? '',
      citations,
      suggestedEnquiryIds: [],
    };
  });
}
