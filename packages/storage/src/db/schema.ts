import { sql } from 'drizzle-orm';
import {
  bigint,
  integer,
  jsonb,
  pgTable,
  real,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const matters = pgTable('matters', {
  id: text('id').primaryKey(),
  firmId: text('firm_id').notNull(),
  reference: text('reference').notNull(),
  propertyAddress: text('property_address'),
  buyerName: text('buyer_name'),
  sellerName: text('seller_name'),
  tenure: text('tenure').notNull(),
  status: text('status').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
    .notNull()
    .default(sql`now()`),
});

export const documents = pgTable('documents', {
  id: text('id').primaryKey(),
  matterId: text('matter_id')
    .notNull()
    .references(() => matters.id, { onDelete: 'cascade' }),
  filename: text('filename').notNull(),
  documentType: text('document_type').notNull(),
  classificationConfidence: real('classification_confidence').notNull(),
  pageCount: integer('page_count').notNull(),
  sizeBytes: bigint('size_bytes', { mode: 'number' }).notNull(),
  uploadedAt: timestamp('uploaded_at', { withTimezone: true, mode: 'string' })
    .notNull()
    .default(sql`now()`),
  storageKey: text('storage_key').notNull(),
  extractionMethod: text('extraction_method').notNull().default('text'),
});

export const extractedFacts = pgTable('extracted_facts', {
  id: text('id').primaryKey(),
  matterId: text('matter_id')
    .notNull()
    .references(() => matters.id, { onDelete: 'cascade' }),
  documentId: text('document_id')
    .notNull()
    .references(() => documents.id, { onDelete: 'cascade' }),
  category: text('category').notNull(),
  key: text('key').notNull(),
  value: jsonb('value'),
  citation: jsonb('citation').notNull(),
  extractedAt: timestamp('extracted_at', { withTimezone: true, mode: 'string' })
    .notNull()
    .default(sql`now()`),
});

export const riskFlags = pgTable('risk_flags', {
  id: text('id').primaryKey(),
  matterId: text('matter_id')
    .notNull()
    .references(() => matters.id, { onDelete: 'cascade' }),
  severity: text('severity').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  citations: jsonb('citations').notNull(),
  suggestedEnquiryIds: jsonb('suggested_enquiry_ids').notNull(),
});

export const enquiries = pgTable('enquiries', {
  id: text('id').primaryKey(),
  matterId: text('matter_id')
    .notNull()
    .references(() => matters.id, { onDelete: 'cascade' }),
  category: text('category').notNull(),
  question: text('question').notNull(),
  rationale: text('rationale').notNull(),
  priority: integer('priority').notNull(),
  citations: jsonb('citations').notNull(),
  status: text('status').notNull(),
  editedQuestion: text('edited_question'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .notNull()
    .default(sql`now()`),
});

export const reports = pgTable('reports', {
  matterId: text('matter_id')
    .primaryKey()
    .references(() => matters.id, { onDelete: 'cascade' }),
  id: text('id').notNull(),
  summary: text('summary').notNull(),
  sections: jsonb('sections').notNull(),
  generatedAt: timestamp('generated_at', { withTimezone: true, mode: 'string' })
    .notNull()
    .default(sql`now()`),
  modelVersion: text('model_version').notNull(),
});

export const pipelineStatus = pgTable('pipeline_status', {
  matterId: text('matter_id')
    .primaryKey()
    .references(() => matters.id, { onDelete: 'cascade' }),
  status: text('status').notNull(),
  stage: text('stage').notNull(),
  progress: integer('progress').notNull(),
  message: text('message').notNull(),
  startedAt: timestamp('started_at', { withTimezone: true, mode: 'string' }),
  completedAt: timestamp('completed_at', { withTimezone: true, mode: 'string' }),
  error: text('error'),
});

export const firmTemplates = pgTable('firm_templates', {
  id: text('id').primaryKey(),
  firmId: text('firm_id').notNull(),
  kind: text('kind').notNull(),
  filename: text('filename').notNull(),
  storageKey: text('storage_key').notNull(),
  sizeBytes: bigint('size_bytes', { mode: 'number' }).notNull(),
  uploadedAt: timestamp('uploaded_at', { withTimezone: true, mode: 'string' })
    .notNull()
    .default(sql`now()`),
});

export type DbMatter = typeof matters.$inferSelect;
export type DbDocument = typeof documents.$inferSelect;
export type DbFact = typeof extractedFacts.$inferSelect;
export type DbRisk = typeof riskFlags.$inferSelect;
export type DbEnquiry = typeof enquiries.$inferSelect;
export type DbReport = typeof reports.$inferSelect;
export type DbPipelineStatus = typeof pipelineStatus.$inferSelect;
export type DbFirmTemplate = typeof firmTemplates.$inferSelect;
