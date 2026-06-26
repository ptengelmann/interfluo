import type {
  Document,
  Enquiry,
  ExtractedFact,
  Matter,
  PageContent,
  ReportOnTitle,
  RiskFlag,
} from '@interfluo/core';
import type { AiClient } from './client';
import { analyseRisks } from './analyse';
import { extractFacts } from './extract';
import { generateEnquiries } from './enquiries';
import { generateReportOnTitle } from './report';

export interface PipelineInput {
  matter: Matter;
  documentsWithPages: Array<{ document: Document; pages: PageContent[] }>;
}

export interface PipelineResult {
  facts: ExtractedFact[];
  risks: RiskFlag[];
  enquiries: Enquiry[];
  report: ReportOnTitle;
}

export type PipelineStage =
  | 'extraction'
  | 'analysis'
  | 'enquiries'
  | 'report'
  | 'done';

export interface PipelineProgressEvent {
  stage: PipelineStage;
  message: string;
  progress: number;
}

export type ProgressCallback = (event: PipelineProgressEvent) => void;

export async function runPipeline(
  client: AiClient,
  input: PipelineInput,
  onProgress?: ProgressCallback,
): Promise<PipelineResult> {
  const { matter, documentsWithPages } = input;
  const emit = (event: PipelineProgressEvent) => onProgress?.(event);

  const facts: ExtractedFact[] = [];
  const n = documentsWithPages.length;

  for (let i = 0; i < n; i++) {
    const item = documentsWithPages[i];
    if (!item) continue;
    const { document, pages } = item;
    emit({
      stage: 'extraction',
      message: `Extracting ${document.filename}`,
      progress: Math.round((i / Math.max(n, 1)) * 40),
    });
    const docFacts = await extractFacts(client, document, pages);
    facts.push(...docFacts);
  }

  emit({ stage: 'analysis', message: 'Identifying risks', progress: 50 });
  const risks = await analyseRisks(client, matter.id, matter.propertyAddress, facts);

  emit({ stage: 'enquiries', message: 'Drafting enquiries', progress: 70 });
  const enquiries = await generateEnquiries(
    client,
    matter.id,
    matter.propertyAddress,
    facts,
    risks,
  );

  emit({ stage: 'report', message: 'Writing Report on Title', progress: 85 });
  const report = await generateReportOnTitle(
    client,
    matter.id,
    matter.propertyAddress,
    matter.buyerName,
    facts,
    risks,
    enquiries,
  );

  emit({ stage: 'done', message: 'Complete', progress: 100 });

  return { facts, risks, enquiries, report };
}
