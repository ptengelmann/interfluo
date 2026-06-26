import type { ReportOnTitle } from '@interfluo/core';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { CitationChip } from '@/components/citation-chip';
import { ReportExport } from '@/features/matters/export-actions';
import { formatDateTime } from '@/lib/format';

export function ReportPanel({
  matterId,
  report,
}: {
  matterId: string;
  report: ReportOnTitle;
}) {
  return (
    <Card>
      <CardHeader
        title="Report on Title — draft"
        description={`Drafted ${formatDateTime(report.generatedAt)} · ${report.modelVersion}`}
        action={<ReportExport matterId={matterId} report={report} />}
      />
      <CardBody className="flex flex-col gap-8">
        <section className="border-l-2 border-accent pl-5">
          <span className="label">Executive summary</span>
          <p className="font-display mt-3 text-[20px] leading-[1.45] text-ink">
            {report.summary}
          </p>
        </section>

        <article className="flex flex-col gap-7">
          {report.sections.map((s, i) => (
            <section key={`${s.heading}-${i}`}>
              <h2 className="text-[18px] font-semibold tracking-tight text-ink">{s.heading}</h2>
              <p className="mt-2 text-[15px] leading-[1.7] text-ink-soft whitespace-pre-wrap">
                {s.body}
              </p>
              {s.citations.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {s.citations.map((c, idx) => (
                    <CitationChip key={`${c.documentId}-${c.pageNumber}-${idx}`} citation={c} />
                  ))}
                </div>
              )}
            </section>
          ))}
        </article>

        <p className="rounded-md border border-line bg-paper-dim/60 px-4 py-3 text-[12.5px] text-muted">
          AI-drafted document. Every line must be reviewed by the supervising fee-earner before
          being sent to a client or another party.
        </p>
      </CardBody>
    </Card>
  );
}
