import { randomUUID } from 'node:crypto';
import {
  CONVEYANCING_ISSUE_CODES,
  type ConveyancingIssueCode,
  type ExtractedFact,
  RISK_SEVERITIES,
  type RiskFlag,
  type RiskSeverity,
  getIssue,
} from '@interfluo/core';
import type { AiClient } from './client';
import { ANALYSE_SYSTEM, analyseUserPrompt } from './prompts/analyse';
import { extractToolUse, truncate } from './util/json';
import { shortenFacts } from './util/short-ids';

interface RawRisk {
  severity: RiskSeverity;
  title: string;
  description: string;
  supportingFactIds: string[];
  issueCode?: string;
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
              description:
                'Short fact ids (e.g. "F012", "F045") copied EXACTLY from the input. List 1-5 ids per risk.',
            },
            issueCode: {
              type: 'string' as const,
              enum: [...CONVEYANCING_ISSUE_CODES],
              description:
                'OPTIONAL. If the risk clearly maps to one of the conveyancing issue codes listed in the taxonomy section of the system prompt, set this. Omit for novel issues that do not fit any code.',
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

  const { byShort, summaries } = shortenFacts(facts);
  const factsJson = truncate(JSON.stringify(summaries), 90_000);

  const response = await client.anthropic.messages.create({
    model: client.defaultModel,
    max_tokens: 6000,
    temperature: 0,
    system: ANALYSE_SYSTEM,
    tools: [ANALYSE_TOOL],
    tool_choice: { type: 'tool', name: 'record_risks' },
    messages: [{ role: 'user', content: analyseUserPrompt(propertyAddress, factsJson) }],
  });

  const parsed = extractToolUse<RawRisksPayload>(response, 'record_risks');
  const rawRisks = parsed?.risks ?? [];
  if (rawRisks.length === 0) return [];

  return rawRisks.map<RiskFlag>((r) => {
    const citations = (r.supportingFactIds ?? [])
      .map((id) => byShort.get(id))
      .filter((f): f is ExtractedFact => Boolean(f))
      .map((f) => f.citation);
    const validatedIssueCode: ConveyancingIssueCode | undefined = getIssue(r.issueCode)?.code;
    return {
      id: randomUUID(),
      matterId,
      severity: r.severity,
      title: (r.title ?? '').slice(0, 120),
      description: r.description ?? '',
      citations,
      suggestedEnquiryIds: [],
      ...(validatedIssueCode ? { issueCode: validatedIssueCode } : {}),
    };
  });
}
