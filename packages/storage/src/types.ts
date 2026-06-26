import type {
  Document,
  Enquiry,
  ExtractedFact,
  FirmTemplate,
  FirmTemplateKind,
  Matter,
  MatterPipelineStatus,
  ReportOnTitle,
  RiskFlag,
} from '@interfluo/core';

export interface MatterRepository {
  createMatter(matter: Matter): Promise<Matter>;
  getMatter(id: string): Promise<Matter | null>;
  listMatters(firmId: string): Promise<Matter[]>;
  updateMatter(id: string, patch: Partial<Matter>): Promise<Matter | null>;
  deleteMatter(id: string): Promise<boolean>;

  addDocument(doc: Document): Promise<Document>;
  listDocuments(matterId: string): Promise<Document[]>;
  getDocument(documentId: string): Promise<Document | null>;
  updateDocument(documentId: string, patch: Partial<Document>): Promise<Document | null>;
  deleteDocument(documentId: string): Promise<Document | null>;

  clearDerivedData(matterId: string): Promise<void>;

  addFacts(facts: ExtractedFact[]): Promise<void>;
  listFacts(matterId: string): Promise<ExtractedFact[]>;

  addRisks(risks: RiskFlag[]): Promise<void>;
  listRisks(matterId: string): Promise<RiskFlag[]>;

  addEnquiries(enquiries: Enquiry[]): Promise<void>;
  listEnquiries(matterId: string): Promise<Enquiry[]>;
  updateEnquiry(id: string, patch: Partial<Enquiry>): Promise<Enquiry | null>;

  saveReport(report: ReportOnTitle): Promise<ReportOnTitle>;
  getReport(matterId: string): Promise<ReportOnTitle | null>;

  setPipelineStatus(status: MatterPipelineStatus): Promise<void>;
  getPipelineStatus(matterId: string): Promise<MatterPipelineStatus | null>;

  listFirmTemplates(firmId: string): Promise<FirmTemplate[]>;
  getFirmTemplate(firmId: string, kind: FirmTemplateKind): Promise<FirmTemplate | null>;
  upsertFirmTemplate(template: FirmTemplate): Promise<FirmTemplate>;
  deleteFirmTemplate(firmId: string, kind: FirmTemplateKind): Promise<FirmTemplate | null>;
}

export interface BlobStore {
  put(key: string, data: Buffer | Uint8Array, contentType: string): Promise<void>;
  get(key: string): Promise<Buffer | null>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
}
