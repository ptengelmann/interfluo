import type {
  AuditEvent,
  CreateMatterInput,
  Document,
  Enquiry,
  FirmTemplate,
  FirmTemplateKind,
  Matter,
  MatterDetail,
  MatterPipelineStatus,
  UpdateDocumentInput,
  UpdateEnquiryInput,
  UpdateMatterInput,
} from '@interfluo/core';

export interface InterfluoClientOptions {
  baseUrl: string;
  fetch?: typeof fetch;
}

export class RequestError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'RequestError';
  }
}

interface ApiErrorBody {
  error: { code: string; message: string; details?: Record<string, unknown> };
}

async function handle<T>(res: Response): Promise<T> {
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  const json: unknown = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const body = json as ApiErrorBody;
    throw new RequestError(
      res.status,
      body?.error?.code ?? 'unknown',
      body?.error?.message ?? res.statusText,
      body?.error?.details,
    );
  }
  return json as T;
}

export function createInterfluoClient(opts: InterfluoClientOptions) {
  const baseUrl = opts.baseUrl.replace(/\/$/, '');
  const fetchFn: typeof fetch = opts.fetch ?? globalThis.fetch.bind(globalThis);

  const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
    const res = await fetchFn(`${baseUrl}${path}`, init);
    return handle<T>(res);
  };

  return {
    health: () => request<{ status: string; service: string }>('/health'),

    listMatters: () => request<{ matters: Matter[] }>('/v1/matters'),

    createMatter: (input: CreateMatterInput) =>
      request<{ matter: Matter }>('/v1/matters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      }),

    getMatter: (id: string) => request<MatterDetail>(`/v1/matters/${id}`),

    updateMatter: (id: string, patch: UpdateMatterInput) =>
      request<{ matter: Matter }>(`/v1/matters/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      }),

    deleteMatter: (id: string) => request<void>(`/v1/matters/${id}`, { method: 'DELETE' }),

    updateDocument: (matterId: string, documentId: string, patch: UpdateDocumentInput) =>
      request<{ document: Document }>(`/v1/matters/${matterId}/documents/${documentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      }),

    deleteDocument: (matterId: string, documentId: string) =>
      request<void>(`/v1/matters/${matterId}/documents/${documentId}`, { method: 'DELETE' }),

    uploadDocuments: (id: string, files: File[]) => {
      const form = new FormData();
      for (const file of files) form.append('files', file);
      return request<{ documents: Document[] }>(`/v1/matters/${id}/documents`, {
        method: 'POST',
        body: form,
      });
    },

    processMatter: (id: string) =>
      request<{ ok: true; matterId: string; started: boolean }>(`/v1/matters/${id}/process`, {
        method: 'POST',
      }),

    getPipeline: (id: string) => request<MatterPipelineStatus>(`/v1/matters/${id}/pipeline`),

    updateEnquiry: (matterId: string, enquiryId: string, patch: UpdateEnquiryInput) =>
      request<{ enquiry: Enquiry }>(`/v1/matters/${matterId}/enquiries/${enquiryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      }),

    listFirmTemplates: () =>
      request<{ templates: FirmTemplate[] }>('/v1/firm-templates'),

    uploadFirmTemplate: (kind: FirmTemplateKind, file: File) => {
      const form = new FormData();
      form.append('kind', kind);
      form.append('file', file);
      return request<{ template: FirmTemplate }>('/v1/firm-templates', {
        method: 'POST',
        body: form,
      });
    },

    deleteFirmTemplate: (kind: FirmTemplateKind) =>
      request<void>(`/v1/firm-templates/${kind}`, { method: 'DELETE' }),

    listAuditEvents: (matterId: string) =>
      request<{ events: AuditEvent[] }>(`/v1/matters/${matterId}/audit`),
  };
}

export type InterfluoClient = ReturnType<typeof createInterfluoClient>;
