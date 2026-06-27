import { z } from 'zod';
import { DOCUMENT_TYPES, ENQUIRY_CATEGORIES, MATTER_STATUSES, RISK_SEVERITIES } from '../constants';

export const documentTypeSchema = z.enum(DOCUMENT_TYPES);
export const riskSeveritySchema = z.enum(RISK_SEVERITIES);
export const enquiryCategorySchema = z.enum(ENQUIRY_CATEGORIES);
export const matterStatusSchema = z.enum(MATTER_STATUSES);

export const tenureSchema = z.enum(['freehold', 'leasehold', 'unknown']);

export const citationSchema = z.object({
  documentId: z.string(),
  documentName: z.string(),
  documentType: documentTypeSchema,
  pageNumber: z.number().int().positive(),
  quote: z.string().min(1).max(800),
});

export const matterSchema = z.object({
  id: z.string(),
  firmId: z.string(),
  reference: z.string(),
  propertyAddress: z.string().nullable(),
  buyerName: z.string().nullable(),
  sellerName: z.string().nullable(),
  tenure: tenureSchema,
  status: matterStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const documentSchema = z.object({
  id: z.string(),
  matterId: z.string(),
  filename: z.string(),
  documentType: documentTypeSchema,
  classificationConfidence: z.number().min(0).max(1),
  pageCount: z.number().int().nonnegative(),
  sizeBytes: z.number().int().nonnegative(),
  uploadedAt: z.string(),
  storageKey: z.string(),
  extractionMethod: z.enum(['text', 'ocr']),
});

export const extractedFactSchema = z.object({
  id: z.string(),
  matterId: z.string(),
  documentId: z.string(),
  category: z.string(),
  key: z.string(),
  value: z.union([z.string(), z.number(), z.boolean(), z.null()]),
  citation: citationSchema,
  extractedAt: z.string(),
});

export const riskFlagSchema = z.object({
  id: z.string(),
  matterId: z.string(),
  severity: riskSeveritySchema,
  title: z.string(),
  description: z.string(),
  citations: z.array(citationSchema),
  suggestedEnquiryIds: z.array(z.string()),
});

export const enquirySchema = z.object({
  id: z.string(),
  matterId: z.string(),
  category: enquiryCategorySchema,
  question: z.string().min(1),
  rationale: z.string().min(1),
  priority: z.number().int().min(1).max(5),
  citations: z.array(citationSchema),
  status: z.enum(['suggested', 'accepted', 'rejected', 'edited']),
  editedQuestion: z.string().nullable(),
  createdAt: z.string(),
});

export const reportSectionSchema: z.ZodType<{
  heading: string;
  body: string;
  citations: z.infer<typeof citationSchema>[];
  subsections?: unknown[];
}> = z.lazy(() =>
  z.object({
    heading: z.string(),
    body: z.string(),
    citations: z.array(citationSchema),
    subsections: z.array(reportSectionSchema).optional(),
  }),
);

export const reportOnTitleSchema = z.object({
  id: z.string(),
  matterId: z.string(),
  summary: z.string(),
  sections: z.array(reportSectionSchema),
  generatedAt: z.string(),
  modelVersion: z.string(),
});

export const createMatterInputSchema = z.object({
  reference: z.string().min(1).max(120),
  propertyAddress: z.string().max(500).optional(),
  buyerName: z.string().max(200).optional(),
  sellerName: z.string().max(200).optional(),
  tenure: tenureSchema.optional(),
});

export type CreateMatterInput = z.infer<typeof createMatterInputSchema>;

export const updateMatterInputSchema = z.object({
  reference: z.string().min(1).max(120).optional(),
  propertyAddress: z.string().max(500).nullable().optional(),
  buyerName: z.string().max(200).nullable().optional(),
  sellerName: z.string().max(200).nullable().optional(),
  tenure: tenureSchema.optional(),
});

export type UpdateMatterInput = z.infer<typeof updateMatterInputSchema>;

export const updateEnquiryInputSchema = z.object({
  status: z.enum(['suggested', 'accepted', 'rejected', 'edited']).optional(),
  editedQuestion: z.string().nullable().optional(),
});

export type UpdateEnquiryInput = z.infer<typeof updateEnquiryInputSchema>;

export const updateDocumentInputSchema = z.object({
  documentType: documentTypeSchema.optional(),
});

export type UpdateDocumentInput = z.infer<typeof updateDocumentInputSchema>;

export const firmTemplateKindSchema = z.enum(['report', 'enquiries']);

export const firmTemplateSchema = z.object({
  id: z.string(),
  firmId: z.string(),
  kind: firmTemplateKindSchema,
  filename: z.string(),
  storageKey: z.string(),
  sizeBytes: z.number().int().nonnegative(),
  uploadedAt: z.string(),
});

export const matterDetailSchema = z.object({
  matter: matterSchema,
  documents: z.array(documentSchema),
  facts: z.array(extractedFactSchema),
  risks: z.array(riskFlagSchema),
  enquiries: z.array(enquirySchema),
  report: reportOnTitleSchema.nullable(),
  pipeline: z.object({
    matterId: z.string(),
    status: matterStatusSchema,
    stage: z.enum(['idle', 'ingest', 'extraction', 'analysis', 'generation', 'done']),
    progress: z.number().min(0).max(100),
    message: z.string(),
    startedAt: z.string().nullable(),
    completedAt: z.string().nullable(),
    error: z.string().nullable(),
  }),
});
