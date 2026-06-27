import type {
  DOCUMENT_TYPES,
  RISK_SEVERITIES,
  ENQUIRY_CATEGORIES,
  MATTER_STATUSES,
} from '../constants';

export type DocumentType = (typeof DOCUMENT_TYPES)[number];
export type RiskSeverity = (typeof RISK_SEVERITIES)[number];
export type EnquiryCategory = (typeof ENQUIRY_CATEGORIES)[number];
export type MatterStatus = (typeof MATTER_STATUSES)[number];

export interface Matter {
  id: string;
  firmId: string;
  reference: string;
  propertyAddress: string | null;
  buyerName: string | null;
  sellerName: string | null;
  tenure: 'freehold' | 'leasehold' | 'unknown';
  status: MatterStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  matterId: string;
  filename: string;
  documentType: DocumentType;
  classificationConfidence: number;
  pageCount: number;
  sizeBytes: number;
  uploadedAt: string;
  storageKey: string;
  extractionMethod: 'text' | 'ocr';
}

export interface PageContent {
  pageNumber: number;
  text: string;
  width: number;
  height: number;
}

export interface Citation {
  documentId: string;
  documentName: string;
  documentType: DocumentType;
  /**
   * Pages the cited material appears on. A single integer for most
   * citations; multiple ascending integers when a clause spans pages
   * (eg a covenant that starts on page 14 and continues on page 15).
   */
  pageNumbers: number[];
  quote: string;
}

/** Display helper — returns the first cited page (used when jumping to a single page). */
export function primaryPage(citation: Citation): number {
  return citation.pageNumbers[0] ?? 1;
}

/** Display helper — "p. 5", "pp. 14–15", "pp. 14, 18, 22" depending on shape. */
export function formatPages(pageNumbers: number[]): string {
  if (pageNumbers.length === 0) return '';
  if (pageNumbers.length === 1) return `p. ${pageNumbers[0]}`;
  const sorted = [...pageNumbers].sort((a, b) => a - b);
  const isContiguousRange = sorted.every(
    (n, i) => i === 0 || n === (sorted[i - 1] ?? n) + 1,
  );
  if (isContiguousRange) return `pp. ${sorted[0]}–${sorted[sorted.length - 1]}`;
  return `pp. ${sorted.join(', ')}`;
}

export interface ExtractedFact {
  id: string;
  matterId: string;
  documentId: string;
  category: string;
  key: string;
  value: string | number | boolean | null;
  citation: Citation;
  extractedAt: string;
}

export interface RiskFlag {
  id: string;
  matterId: string;
  severity: RiskSeverity;
  title: string;
  description: string;
  citations: Citation[];
  suggestedEnquiryIds: string[];
}

export interface Enquiry {
  id: string;
  matterId: string;
  category: EnquiryCategory;
  question: string;
  rationale: string;
  priority: number;
  citations: Citation[];
  status: 'suggested' | 'accepted' | 'rejected' | 'edited';
  editedQuestion: string | null;
  createdAt: string;
}

export interface ReportSection {
  heading: string;
  body: string;
  citations: Citation[];
  subsections?: ReportSection[];
}

export interface ReportOnTitle {
  id: string;
  matterId: string;
  summary: string;
  sections: ReportSection[];
  generatedAt: string;
  modelVersion: string;
}

export interface MatterPipelineStatus {
  matterId: string;
  status: MatterStatus;
  stage: 'idle' | 'ingest' | 'extraction' | 'analysis' | 'generation' | 'done';
  progress: number;
  message: string;
  startedAt: string | null;
  completedAt: string | null;
  error: string | null;
}

export interface MatterDetail {
  matter: Matter;
  documents: Document[];
  facts: ExtractedFact[];
  risks: RiskFlag[];
  enquiries: Enquiry[];
  report: ReportOnTitle | null;
  pipeline: MatterPipelineStatus;
}

export type FirmTemplateKind = 'report' | 'enquiries';

export interface FirmTemplate {
  id: string;
  firmId: string;
  kind: FirmTemplateKind;
  filename: string;
  storageKey: string;
  sizeBytes: number;
  uploadedAt: string;
}

export type AuditEventType =
  | 'matter.created'
  | 'matter.updated'
  | 'matter.deleted'
  | 'document.uploaded'
  | 'document.reclassified'
  | 'document.deleted'
  | 'pipeline.started'
  | 'pipeline.completed'
  | 'pipeline.failed'
  | 'enquiry.accepted'
  | 'enquiry.rejected'
  | 'enquiry.suggested'
  | 'enquiry.edited'
  | 'enquiry.reverted'
  | 'export.enquiries'
  | 'export.report'
  | 'firm_template.uploaded'
  | 'firm_template.deleted';

export interface AuditEvent {
  id: string;
  firmId: string;
  matterId: string | null;
  userId: string;
  eventType: AuditEventType;
  targetType: string | null;
  targetId: string | null;
  payload: Record<string, unknown> | null;
  createdAt: string;
}

export type ApiError = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: ApiError };
