import { randomUUID } from 'node:crypto';
import type {
  Citation,
  Enquiry,
  ExtractedFact,
  ReportOnTitle,
  ReportSection,
  RiskFlag,
} from '@interfluo/core';
import type { AiClient } from './client';
import { REPORT_SYSTEM, reportUserPrompt } from './prompts/report';
import { extractToolUse, truncate } from './util/json';
import { shortenFacts } from './util/short-ids';

interface RawSection {
  heading: string;
  body: string;
  supportingFactIds: string[];
}

interface RawReportPayload {
  summary: string;
  sections: RawSection[];
}

const REPORT_TOOL = {
  name: 'record_report',
  description: 'Record the drafted Report on Title',
  input_schema: {
    type: 'object' as const,
    properties: {
      summary: { type: 'string' as const, description: 'One-paragraph executive summary' },
      sections: {
        type: 'array' as const,
        items: {
          type: 'object' as const,
          properties: {
            heading: { type: 'string' as const },
            body: { type: 'string' as const },
            supportingFactIds: {
              type: 'array' as const,
              items: { type: 'string' as const },
              description: 'Short fact ids like "F012" copied EXACTLY from the input.',
            },
          },
          required: ['heading', 'body', 'supportingFactIds'],
        },
      },
    },
    required: ['summary', 'sections'],
  },
};

export async function generateReportOnTitle(
  client: AiClient,
  matterId: string,
  propertyAddress: string | null,
  buyerName: string | null,
  facts: ExtractedFact[],
  risks: RiskFlag[],
  enquiries: Enquiry[],
): Promise<ReportOnTitle> {
  const factMap = shortenFacts(facts);
  const risksSummary = risks.map((r) => ({
    severity: r.severity,
    title: r.title,
    description: r.description,
  }));
  const enquiriesSummary = enquiries.map((e) => ({
    priority: e.priority,
    category: e.category,
    question: e.question,
  }));

  const factsJson = truncate(JSON.stringify(factMap.summaries), 70_000);
  const risksJson = truncate(JSON.stringify(risksSummary), 15_000);
  const enquiriesJson = truncate(JSON.stringify(enquiriesSummary), 25_000);

  const response = await client.anthropic.messages.create({
    model: client.defaultModel,
    max_tokens: 12000,
    temperature: 0.2,
    system: REPORT_SYSTEM,
    tools: [REPORT_TOOL],
    tool_choice: { type: 'tool', name: 'record_report' },
    messages: [
      {
        role: 'user',
        content: reportUserPrompt(propertyAddress, buyerName, factsJson, risksJson, enquiriesJson),
      },
    ],
  });

  const parsed = extractToolUse<RawReportPayload>(response, 'record_report');
  if (!parsed) {
    return {
      id: randomUUID(),
      matterId,
      summary: 'Report generation failed — no output from the model.',
      sections: [],
      generatedAt: new Date().toISOString(),
      modelVersion: client.defaultModel,
    };
  }

  const sections: ReportSection[] = (parsed.sections ?? []).map((s) => {
    const citations: Citation[] = (s.supportingFactIds ?? [])
      .map((id) => factMap.byShort.get(id))
      .filter((f): f is ExtractedFact => Boolean(f))
      .map((f) => f.citation);
    return {
      heading: s.heading,
      body: s.body,
      citations,
    };
  });

  return {
    id: randomUUID(),
    matterId,
    summary: parsed.summary,
    sections,
    generatedAt: new Date().toISOString(),
    modelVersion: client.defaultModel,
  };
}
