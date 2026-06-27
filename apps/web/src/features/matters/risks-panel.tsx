import type { RiskFlag } from '@interfluo/core';
import { Card, CardBody } from '@/components/ui/card';
import { CitationChip } from '@/components/citation-chip';
import { EmptyState } from '@/components/ui/empty-state';
import { SeverityBadge } from '@/components/severity-badge';

const SEVERITY_ORDER: Record<RiskFlag['severity'], number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
  informational: 4,
};

export function RisksPanel({ risks }: { risks: RiskFlag[] }) {
  if (risks.length === 0) {
    return (
      <EmptyState
        title="No risks identified"
        description="Either the pack is clean, or the pipeline hasn't run yet."
      />
    );
  }
  const sorted = [...risks].sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);
  return (
    <ul className="flex flex-col gap-3">
      {sorted.map((r) => (
        <li key={r.id}>
          <Card>
            <CardBody className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-4">
                <h4 className="text-[17px] font-semibold tracking-tight text-ink">{r.title}</h4>
                <SeverityBadge severity={r.severity} />
              </div>
              <p className="text-[14.5px] leading-relaxed text-ink-soft">{r.description}</p>
              {r.citations.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {r.citations.map((c, idx) => (
                    <CitationChip key={`${c.documentId}-${c.pageNumbers.join("_")}-${idx}`} citation={c} />
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </li>
      ))}
    </ul>
  );
}
