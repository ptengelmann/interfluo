import type Anthropic from '@anthropic-ai/sdk';

export function extractToolUse<T>(
  response: Anthropic.Messages.Message,
  toolName: string,
): T | null {
  for (const block of response.content) {
    if (block.type === 'tool_use' && block.name === toolName) {
      return block.input as T;
    }
  }
  return null;
}

export function extractText(response: Anthropic.Messages.Message): string {
  return response.content
    .filter((b): b is Anthropic.Messages.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('\n');
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}\n[... truncated ${text.length - max} characters]`;
}
