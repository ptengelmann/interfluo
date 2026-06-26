import Anthropic from '@anthropic-ai/sdk';

export interface AiClientConfig {
  apiKey: string;
  defaultModel?: string;
  reasoningModel?: string;
  maxRetries?: number;
}

export interface AiClient {
  anthropic: Anthropic;
  defaultModel: string;
  reasoningModel: string;
}

export function createAiClient(config: AiClientConfig): AiClient {
  if (!config.apiKey) {
    throw new Error('ANTHROPIC_API_KEY is required to create an AI client');
  }
  const anthropic = new Anthropic({
    apiKey: config.apiKey,
    maxRetries: config.maxRetries ?? 2,
  });
  return {
    anthropic,
    defaultModel: config.defaultModel ?? 'claude-sonnet-4-6',
    reasoningModel: config.reasoningModel ?? 'claude-opus-4-7',
  };
}
