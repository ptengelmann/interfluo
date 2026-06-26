import type { MatterStatus } from '@interfluo/core';
import { Badge } from './ui/badge';

const MAP: Record<MatterStatus, { tone: 'neutral' | 'accent' | 'success' | 'danger' | 'muted'; label: string }> = {
  draft: { tone: 'muted', label: 'Draft' },
  ingesting: { tone: 'neutral', label: 'Ingesting' },
  extracting: { tone: 'neutral', label: 'Extracting' },
  analysing: { tone: 'neutral', label: 'Analysing' },
  generating: { tone: 'neutral', label: 'Drafting' },
  ready_for_review: { tone: 'accent', label: 'Ready for review' },
  completed: { tone: 'success', label: 'Completed' },
  failed: { tone: 'danger', label: 'Failed' },
};

export function StatusBadge({ status }: { status: MatterStatus }) {
  const { tone, label } = MAP[status];
  return <Badge tone={tone}>{label}</Badge>;
}
