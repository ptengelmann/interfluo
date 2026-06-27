import type { RiskSeverity } from '@interfluo/core';
import { Badge } from './ui/badge';

const MAP: Record<RiskSeverity, { tone: 'danger' | 'warn' | 'neutral' | 'muted'; label: string }> =
  {
    critical: { tone: 'danger', label: 'Critical' },
    high: { tone: 'danger', label: 'High' },
    medium: { tone: 'warn', label: 'Medium' },
    low: { tone: 'neutral', label: 'Low' },
    informational: { tone: 'muted', label: 'Info' },
  };

export function SeverityBadge({ severity }: { severity: RiskSeverity }) {
  const { tone, label } = MAP[severity];
  return <Badge tone={tone}>{label}</Badge>;
}

export function PriorityBadge({ priority }: { priority: number }) {
  const tone: 'danger' | 'warn' | 'neutral' | 'muted' =
    priority === 1 ? 'danger' : priority === 2 ? 'warn' : priority === 3 ? 'neutral' : 'muted';
  return <Badge tone={tone}>P{priority}</Badge>;
}
