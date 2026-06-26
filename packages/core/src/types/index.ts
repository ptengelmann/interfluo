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
  pageNumber: number;
  quote: string;
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

export type ApiError = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: ApiError };
