import { and, asc, desc, eq } from 'drizzle-orm';
import type {
  AuditEvent,
  AuditEventType,
  Citation,
  Document,
  DocumentType,
  Enquiry,
  EnquiryCategory,
  ExtractedFact,
  FirmTemplate,
  FirmTemplateKind,
  Matter,
  MatterPipelineStatus,
  MatterStatus,
  ReportOnTitle,
  ReportSection,
  RiskFlag,
  RiskSeverity,
} from '@interfluo/core';
import type { MatterRepository } from '../types';
import { createDatabase, type Database } from '../db/client';
import {
  auditEvents as auditEventsTable,
  documents as documentsTable,
  enquiries as enquiriesTable,
  extractedFacts as factsTable,
  firmTemplates as firmTemplatesTable,
  matters as mattersTable,
  pipelineStatus as pipelineTable,
  reports as reportsTable,
  riskFlags as risksTable,
  type DbAuditEvent,
  type DbDocument,
  type DbEnquiry,
  type DbFact,
  type DbFirmTemplate,
  type DbMatter,
  type DbPipelineStatus,
  type DbReport,
  type DbRisk,
} from '../db/schema';

function iso(value: string | null): string | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toISOString();
}

function toMatter(row: DbMatter): Matter {
  return {
    id: row.id,
    firmId: row.firmId,
    reference: row.reference,
    propertyAddress: row.propertyAddress,
    buyerName: row.buyerName,
    sellerName: row.sellerName,
    tenure: row.tenure as Matter['tenure'],
    status: row.status as MatterStatus,
    createdAt: iso(row.createdAt) ?? row.createdAt,
    updatedAt: iso(row.updatedAt) ?? row.updatedAt,
  };
}

function toDocument(row: DbDocument): Document {
  return {
    id: row.id,
    matterId: row.matterId,
    filename: row.filename,
    documentType: row.documentType as DocumentType,
    classificationConfidence: row.classificationConfidence,
    pageCount: row.pageCount,
    sizeBytes: row.sizeBytes,
    uploadedAt: iso(row.uploadedAt) ?? row.uploadedAt,
    storageKey: row.storageKey,
    extractionMethod: (row.extractionMethod as 'text' | 'ocr' | undefined) ?? 'text',
  };
}

function toFact(row: DbFact): ExtractedFact {
  return {
    id: row.id,
    matterId: row.matterId,
    documentId: row.documentId,
    category: row.category,
    key: row.key,
    value: row.value as ExtractedFact['value'],
    citation: row.citation as Citation,
    extractedAt: iso(row.extractedAt) ?? row.extractedAt,
  };
}

function toRisk(row: DbRisk): RiskFlag {
  return {
    id: row.id,
    matterId: row.matterId,
    severity: row.severity as RiskSeverity,
    title: row.title,
    description: row.description,
    citations: row.citations as Citation[],
    suggestedEnquiryIds: row.suggestedEnquiryIds as string[],
  };
}

function toEnquiry(row: DbEnquiry): Enquiry {
  return {
    id: row.id,
    matterId: row.matterId,
    category: row.category as EnquiryCategory,
    question: row.question,
    rationale: row.rationale,
    priority: row.priority,
    citations: row.citations as Citation[],
    status: row.status as Enquiry['status'],
    editedQuestion: row.editedQuestion,
    createdAt: iso(row.createdAt) ?? row.createdAt,
  };
}

function toReport(row: DbReport): ReportOnTitle {
  return {
    id: row.id,
    matterId: row.matterId,
    summary: row.summary,
    sections: row.sections as ReportSection[],
    generatedAt: iso(row.generatedAt) ?? row.generatedAt,
    modelVersion: row.modelVersion,
  };
}

function toFirmTemplate(row: DbFirmTemplate): FirmTemplate {
  return {
    id: row.id,
    firmId: row.firmId,
    kind: row.kind as FirmTemplateKind,
    filename: row.filename,
    storageKey: row.storageKey,
    sizeBytes: row.sizeBytes,
    uploadedAt: iso(row.uploadedAt) ?? row.uploadedAt,
  };
}

function toAuditEvent(row: DbAuditEvent): AuditEvent {
  return {
    id: row.id,
    firmId: row.firmId,
    matterId: row.matterId,
    userId: row.userId,
    eventType: row.eventType as AuditEventType,
    targetType: row.targetType,
    targetId: row.targetId,
    payload: row.payload as Record<string, unknown> | null,
    createdAt: iso(row.createdAt) ?? row.createdAt,
  };
}

function toPipeline(row: DbPipelineStatus): MatterPipelineStatus {
  return {
    matterId: row.matterId,
    status: row.status as MatterStatus,
    stage: row.stage as MatterPipelineStatus['stage'],
    progress: row.progress,
    message: row.message,
    startedAt: iso(row.startedAt),
    completedAt: iso(row.completedAt),
    error: row.error,
  };
}

export interface PostgresRepositoryHandle {
  repo: MatterRepository;
  close: () => Promise<void>;
}

export function createPostgresRepository(connectionString: string): PostgresRepositoryHandle {
  const { db, sql } = createDatabase(connectionString);
  return {
    repo: makeRepository(db),
    close: async () => {
      await sql.end({ timeout: 5 });
    },
  };
}

function makeRepository(db: Database['db']): MatterRepository {
  return {
    async createMatter(m) {
      await db.insert(mattersTable).values({
        id: m.id,
        firmId: m.firmId,
        reference: m.reference,
        propertyAddress: m.propertyAddress,
        buyerName: m.buyerName,
        sellerName: m.sellerName,
        tenure: m.tenure,
        status: m.status,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
      });
      return m;
    },

    async getMatter(id) {
      const rows = await db.select().from(mattersTable).where(eq(mattersTable.id, id)).limit(1);
      const row = rows[0];
      return row ? toMatter(row) : null;
    },

    async listMatters(firmId) {
      const rows = await db
        .select()
        .from(mattersTable)
        .where(eq(mattersTable.firmId, firmId))
        .orderBy(desc(mattersTable.createdAt));
      return rows.map(toMatter);
    },

    async updateMatter(id, patch) {
      const updatedAt = new Date().toISOString();
      const update: Partial<DbMatter> = { updatedAt };
      if (patch.reference !== undefined) update.reference = patch.reference;
      if (patch.propertyAddress !== undefined) update.propertyAddress = patch.propertyAddress;
      if (patch.buyerName !== undefined) update.buyerName = patch.buyerName;
      if (patch.sellerName !== undefined) update.sellerName = patch.sellerName;
      if (patch.tenure !== undefined) update.tenure = patch.tenure;
      if (patch.status !== undefined) update.status = patch.status;
      const rows = await db
        .update(mattersTable)
        .set(update)
        .where(eq(mattersTable.id, id))
        .returning();
      const row = rows[0];
      return row ? toMatter(row) : null;
    },

    async deleteMatter(id) {
      const rows = await db.delete(mattersTable).where(eq(mattersTable.id, id)).returning();
      return rows.length > 0;
    },

    async addDocument(doc) {
      await db.insert(documentsTable).values({
        id: doc.id,
        matterId: doc.matterId,
        filename: doc.filename,
        documentType: doc.documentType,
        classificationConfidence: doc.classificationConfidence,
        pageCount: doc.pageCount,
        sizeBytes: doc.sizeBytes,
        uploadedAt: doc.uploadedAt,
        storageKey: doc.storageKey,
        extractionMethod: doc.extractionMethod,
      });
      return doc;
    },

    async listDocuments(matterId) {
      const rows = await db
        .select()
        .from(documentsTable)
        .where(eq(documentsTable.matterId, matterId))
        .orderBy(asc(documentsTable.uploadedAt));
      return rows.map(toDocument);
    },

    async getDocument(id) {
      const rows = await db.select().from(documentsTable).where(eq(documentsTable.id, id)).limit(1);
      const row = rows[0];
      return row ? toDocument(row) : null;
    },

    async updateDocument(id, patch) {
      const update: Partial<DbDocument> = {};
      if (patch.documentType !== undefined) update.documentType = patch.documentType;
      if (patch.filename !== undefined) update.filename = patch.filename;
      if (patch.classificationConfidence !== undefined)
        update.classificationConfidence = patch.classificationConfidence;
      if (patch.extractionMethod !== undefined) update.extractionMethod = patch.extractionMethod;
      if (Object.keys(update).length === 0) {
        const rows = await db
          .select()
          .from(documentsTable)
          .where(eq(documentsTable.id, id))
          .limit(1);
        const row = rows[0];
        return row ? toDocument(row) : null;
      }
      const rows = await db
        .update(documentsTable)
        .set(update)
        .where(eq(documentsTable.id, id))
        .returning();
      const row = rows[0];
      return row ? toDocument(row) : null;
    },

    async deleteDocument(id) {
      const rows = await db.delete(documentsTable).where(eq(documentsTable.id, id)).returning();
      const row = rows[0];
      return row ? toDocument(row) : null;
    },

    async clearDerivedData(matterId) {
      await db.delete(factsTable).where(eq(factsTable.matterId, matterId));
      await db.delete(risksTable).where(eq(risksTable.matterId, matterId));
      await db.delete(enquiriesTable).where(eq(enquiriesTable.matterId, matterId));
      await db.delete(reportsTable).where(eq(reportsTable.matterId, matterId));
    },

    async addFacts(items) {
      if (items.length === 0) return;
      await db.insert(factsTable).values(
        items.map((f) => ({
          id: f.id,
          matterId: f.matterId,
          documentId: f.documentId,
          category: f.category,
          key: f.key,
          value: f.value,
          citation: f.citation,
          extractedAt: f.extractedAt,
        })),
      );
    },

    async listFacts(matterId) {
      const rows = await db
        .select()
        .from(factsTable)
        .where(eq(factsTable.matterId, matterId))
        .orderBy(asc(factsTable.extractedAt));
      return rows.map(toFact);
    },

    async addRisks(items) {
      if (items.length === 0) return;
      await db.insert(risksTable).values(
        items.map((r) => ({
          id: r.id,
          matterId: r.matterId,
          severity: r.severity,
          title: r.title,
          description: r.description,
          citations: r.citations,
          suggestedEnquiryIds: r.suggestedEnquiryIds,
        })),
      );
    },

    async listRisks(matterId) {
      const rows = await db
        .select()
        .from(risksTable)
        .where(eq(risksTable.matterId, matterId));
      return rows.map(toRisk);
    },

    async addEnquiries(items) {
      if (items.length === 0) return;
      await db.insert(enquiriesTable).values(
        items.map((e) => ({
          id: e.id,
          matterId: e.matterId,
          category: e.category,
          question: e.question,
          rationale: e.rationale,
          priority: e.priority,
          citations: e.citations,
          status: e.status,
          editedQuestion: e.editedQuestion,
          createdAt: e.createdAt,
        })),
      );
    },

    async listEnquiries(matterId) {
      const rows = await db
        .select()
        .from(enquiriesTable)
        .where(eq(enquiriesTable.matterId, matterId))
        .orderBy(asc(enquiriesTable.priority), asc(enquiriesTable.createdAt));
      return rows.map(toEnquiry);
    },

    async updateEnquiry(id, patch) {
      const update: Partial<DbEnquiry> = {};
      if (patch.status !== undefined) update.status = patch.status;
      if (patch.editedQuestion !== undefined) update.editedQuestion = patch.editedQuestion;
      if (patch.question !== undefined) update.question = patch.question;
      if (patch.rationale !== undefined) update.rationale = patch.rationale;
      if (patch.priority !== undefined) update.priority = patch.priority;
      if (Object.keys(update).length === 0) {
        const rows = await db.select().from(enquiriesTable).where(eq(enquiriesTable.id, id)).limit(1);
        const row = rows[0];
        return row ? toEnquiry(row) : null;
      }
      const rows = await db
        .update(enquiriesTable)
        .set(update)
        .where(eq(enquiriesTable.id, id))
        .returning();
      const row = rows[0];
      return row ? toEnquiry(row) : null;
    },

    async saveReport(report) {
      await db
        .insert(reportsTable)
        .values({
          matterId: report.matterId,
          id: report.id,
          summary: report.summary,
          sections: report.sections,
          generatedAt: report.generatedAt,
          modelVersion: report.modelVersion,
        })
        .onConflictDoUpdate({
          target: reportsTable.matterId,
          set: {
            id: report.id,
            summary: report.summary,
            sections: report.sections,
            generatedAt: report.generatedAt,
            modelVersion: report.modelVersion,
          },
        });
      return report;
    },

    async getReport(matterId) {
      const rows = await db
        .select()
        .from(reportsTable)
        .where(eq(reportsTable.matterId, matterId))
        .limit(1);
      const row = rows[0];
      return row ? toReport(row) : null;
    },

    async setPipelineStatus(status) {
      await db
        .insert(pipelineTable)
        .values({
          matterId: status.matterId,
          status: status.status,
          stage: status.stage,
          progress: status.progress,
          message: status.message,
          startedAt: status.startedAt,
          completedAt: status.completedAt,
          error: status.error,
        })
        .onConflictDoUpdate({
          target: pipelineTable.matterId,
          set: {
            status: status.status,
            stage: status.stage,
            progress: status.progress,
            message: status.message,
            startedAt: status.startedAt,
            completedAt: status.completedAt,
            error: status.error,
          },
        });
    },

    async getPipelineStatus(matterId) {
      const rows = await db
        .select()
        .from(pipelineTable)
        .where(eq(pipelineTable.matterId, matterId))
        .limit(1);
      const row = rows[0];
      return row ? toPipeline(row) : null;
    },

    async listFirmTemplates(firmId) {
      const rows = await db
        .select()
        .from(firmTemplatesTable)
        .where(eq(firmTemplatesTable.firmId, firmId))
        .orderBy(asc(firmTemplatesTable.kind));
      return rows.map(toFirmTemplate);
    },

    async getFirmTemplate(firmId, kind) {
      const rows = await db
        .select()
        .from(firmTemplatesTable)
        .where(and(eq(firmTemplatesTable.firmId, firmId), eq(firmTemplatesTable.kind, kind)))
        .limit(1);
      const row = rows[0];
      return row ? toFirmTemplate(row) : null;
    },

    async upsertFirmTemplate(template) {
      const existing = await this.getFirmTemplate(template.firmId, template.kind);
      if (existing) {
        await db
          .delete(firmTemplatesTable)
          .where(
            and(
              eq(firmTemplatesTable.firmId, template.firmId),
              eq(firmTemplatesTable.kind, template.kind),
            ),
          );
      }
      await db.insert(firmTemplatesTable).values({
        id: template.id,
        firmId: template.firmId,
        kind: template.kind,
        filename: template.filename,
        storageKey: template.storageKey,
        sizeBytes: template.sizeBytes,
        uploadedAt: template.uploadedAt,
      });
      return template;
    },

    async deleteFirmTemplate(firmId, kind) {
      const rows = await db
        .delete(firmTemplatesTable)
        .where(and(eq(firmTemplatesTable.firmId, firmId), eq(firmTemplatesTable.kind, kind)))
        .returning();
      const row = rows[0];
      return row ? toFirmTemplate(row) : null;
    },

    async appendAuditEvent(event) {
      await db.insert(auditEventsTable).values({
        id: event.id,
        firmId: event.firmId,
        matterId: event.matterId,
        userId: event.userId,
        eventType: event.eventType,
        targetType: event.targetType,
        targetId: event.targetId,
        payload: event.payload,
        createdAt: event.createdAt,
      });
    },

    async listAuditEvents({ firmId, matterId, limit }) {
      const where = matterId
        ? and(eq(auditEventsTable.firmId, firmId), eq(auditEventsTable.matterId, matterId))
        : eq(auditEventsTable.firmId, firmId);
      const base = db
        .select()
        .from(auditEventsTable)
        .where(where)
        .orderBy(desc(auditEventsTable.createdAt));
      const rows = typeof limit === 'number' ? await base.limit(limit) : await base;
      return rows.map(toAuditEvent);
    },
  };
}

// silence unused-import warning if downstream needs it
export const _and = and;
