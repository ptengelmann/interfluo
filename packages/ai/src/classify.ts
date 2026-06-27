import { DOCUMENT_TYPES, type DocumentType } from '@interfluo/core';
import type { AiClient } from './client';
import { CLASSIFY_SYSTEM, CLASSIFY_USER } from './prompts/classify';
import { extractToolUse } from './util/json';
import { type PageChunk, formatPagesForPrompt, takeFirstN } from './util/page-text';

export interface ClassificationResult {
  documentType: DocumentType;
  confidence: number;
  reasoning: string;
}

const CLASSIFY_TOOL = {
  name: 'classify_document',
  description: 'Record the document classification',
  input_schema: {
    type: 'object' as const,
    properties: {
      documentType: {
        type: 'string' as const,
        enum: [...DOCUMENT_TYPES],
        description: 'The document type',
      },
      confidence: {
        type: 'number' as const,
        minimum: 0,
        maximum: 1,
        description: 'Confidence in classification, 0..1',
      },
      reasoning: {
        type: 'string' as const,
        description: 'One sentence justifying the choice',
      },
    },
    required: ['documentType', 'confidence', 'reasoning'],
  },
};

export async function classifyDocument(
  client: AiClient,
  pages: PageChunk[],
): Promise<ClassificationResult> {
  const sample = takeFirstN(pages, 3);
  const pagesText = formatPagesForPrompt(sample, 3000);

  const response = await client.anthropic.messages.create({
    model: client.defaultModel,
    max_tokens: 512,
    temperature: 0,
    system: CLASSIFY_SYSTEM,
    tools: [CLASSIFY_TOOL],
    tool_choice: { type: 'tool', name: 'classify_document' },
    messages: [{ role: 'user', content: CLASSIFY_USER(pagesText) }],
  });

  const parsed = extractToolUse<ClassificationResult>(response, 'classify_document');
  if (!parsed) {
    return {
      documentType: 'unknown',
      confidence: 0,
      reasoning: 'Model did not return a classification.',
    };
  }
  return parsed;
}
