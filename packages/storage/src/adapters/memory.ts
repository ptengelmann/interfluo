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
import type { MatterRepository } from '../types';

export function createInMemoryRepository(): MatterRepository {
  const matters = new Map<string, Matter>();
  const documents = new Map<string, Document>();
  const facts = new Map<string, ExtractedFact[]>();
  const risks = new Map<string, RiskFlag[]>();
  const enquiries = new Map<string, Enquiry>();
  const enquiryByMatter = new Map<string, Set<string>>();
  const reports = new Map<string, ReportOnTitle>();
  const pipelines = new Map<string, MatterPipelineStatus>();
  const firmTemplates = new Map<string, FirmTemplate>(); // key: firmId:kind

  const indexEnquiry = (e: Enquiry) => {
    let set = enquiryByMatter.get(e.matterId);
    if (!set) {
      set = new Set();
      enquiryByMatter.set(e.matterId, set);
    }
    set.add(e.id);
  };

  return {
    async createMatter(m) {
      matters.set(m.id, m);
      return m;
    },
    async getMatter(id) {
      return matters.get(id) ?? null;
    },
    async listMatters(firmId) {
      return [...matters.values()]
        .filter((m) => m.firmId === firmId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },
    async updateMatter(id, patch) {
      const current = matters.get(id);
      if (!current) return null;
      const next: Matter = { ...current, ...patch, updatedAt: new Date().toISOString() };
      matters.set(id, next);
      return next;
    },
    async deleteMatter(id) {
      const existed = matters.delete(id);
      facts.delete(id);
      risks.delete(id);
      reports.delete(id);
      pipelines.delete(id);
      const enquiryIds = enquiryByMatter.get(id);
      if (enquiryIds) {
        for (const eid of enquiryIds) enquiries.delete(eid);
        enquiryByMatter.delete(id);
      }
      for (const [docId, d] of documents) {
        if (d.matterId === id) documents.delete(docId);
      }
      return existed;
    },

    async addDocument(doc) {
      documents.set(doc.id, doc);
      return doc;
    },
    async listDocuments(matterId) {
      return [...documents.values()]
        .filter((d) => d.matterId === matterId)
        .sort((a, b) => a.uploadedAt.localeCompare(b.uploadedAt));
    },
    async getDocument(id) {
      return documents.get(id) ?? null;
    },
    async updateDocument(id, patch) {
      const current = documents.get(id);
      if (!current) return null;
      const next: Document = { ...current, ...patch };
      documents.set(id, next);
      return next;
    },
    async deleteDocument(id) {
      const existing = documents.get(id);
      if (!existing) return null;
      documents.delete(id);
      const factList = facts.get(existing.matterId);
      if (factList) {
        facts.set(
          existing.matterId,
          factList.filter((f) => f.documentId !== id),
        );
      }
      return existing;
    },

    async clearDerivedData(matterId) {
      facts.delete(matterId);
      risks.delete(matterId);
      reports.delete(matterId);
      const enquiryIds = enquiryByMatter.get(matterId);
      if (enquiryIds) {
        for (const eid of enquiryIds) enquiries.delete(eid);
        enquiryByMatter.delete(matterId);
      }
    },

    async addFacts(items) {
      for (const f of items) {
        const list = facts.get(f.matterId) ?? [];
        list.push(f);
        facts.set(f.matterId, list);
      }
    },
    async listFacts(matterId) {
      return facts.get(matterId) ?? [];
    },

    async addRisks(items) {
      for (const r of items) {
        const list = risks.get(r.matterId) ?? [];
        list.push(r);
        risks.set(r.matterId, list);
      }
    },
    async listRisks(matterId) {
      return risks.get(matterId) ?? [];
    },

    async addEnquiries(items) {
      for (const e of items) {
        enquiries.set(e.id, e);
        indexEnquiry(e);
      }
    },
    async listEnquiries(matterId) {
      const ids = enquiryByMatter.get(matterId);
      if (!ids) return [];
      return [...ids]
        .map((id) => enquiries.get(id))
        .filter((e): e is Enquiry => Boolean(e))
        .sort((a, b) => a.priority - b.priority || a.createdAt.localeCompare(b.createdAt));
    },
    async updateEnquiry(id, patch) {
      const current = enquiries.get(id);
      if (!current) return null;
      const next: Enquiry = { ...current, ...patch };
      enquiries.set(id, next);
      return next;
    },

    async saveReport(report) {
      reports.set(report.matterId, report);
      return report;
    },
    async getReport(matterId) {
      return reports.get(matterId) ?? null;
    },

    async setPipelineStatus(status) {
      pipelines.set(status.matterId, status);
    },
    async getPipelineStatus(matterId) {
      return pipelines.get(matterId) ?? null;
    },

    async listFirmTemplates(firmId) {
      return [...firmTemplates.values()].filter((t) => t.firmId === firmId);
    },
    async getFirmTemplate(firmId, kind) {
      return firmTemplates.get(`${firmId}:${kind}`) ?? null;
    },
    async upsertFirmTemplate(template) {
      firmTemplates.set(`${template.firmId}:${template.kind}`, template);
      return template;
    },
    async deleteFirmTemplate(firmId, kind) {
      const key = `${firmId}:${kind}`;
      const existing = firmTemplates.get(key);
      if (!existing) return null;
      firmTemplates.delete(key);
      return existing;
    },
  };
}
