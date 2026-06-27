/**
 * Audit event payloads.
 *
 * The audit_events table stores `payload` as jsonb so callers can put
 * whatever context the event needs. This module defines a typed payload
 * for each event type so the stored shape is consistent across callsites
 * and queryable for review-intelligence analytics (which edits land per
 * issue code, which categories get rejected, how partner-style wording
 * differs from the AI draft, etc).
 *
 * The audit record is append-only. The original AI wording must always
 * be preserved alongside any fee-earner edit so the proprietary edit
 * corpus accumulates from the first pilot matter onwards.
 */

import type { ConveyancingIssueCode } from '../issues/index';

/** Common context carried on every enquiry-related audit event. */
export interface EnquiryAuditContext {
  /** The very first AI draft. Never changes for the life of the enquiry. */
  originalAiQuestion: string;
  /** Issue taxonomy code if the pipeline matched one at generation time. */
  issueCode?: ConveyancingIssueCode;
}

/** Recorded when status flips to `suggested` (initial generation) or back from rejected. */
export interface EnquirySuggestedPayload extends EnquiryAuditContext {
  previousStatus: string | null;
  newStatus: 'suggested';
}

/**
 * Recorded when the fee-earner edits the enquiry wording. Captures the
 * specific diff for this edit (from -> to), so the full chain of edits
 * is reconstructible across multiple changes.
 */
export interface EnquiryEditedPayload extends EnquiryAuditContext {
  /** The wording before this edit. Either the AI draft or the previous edited value. */
  from: string;
  /** The wording after this edit. */
  to: string;
  previousStatus: string | null;
  newStatus: string;
}

/** Recorded when the fee-earner reverts the enquiry to the AI draft. */
export interface EnquiryRevertedPayload extends EnquiryAuditContext {
  /** The wording immediately before the revert (so we can replay history). */
  revertedFrom: string;
  previousStatus: string | null;
  newStatus: string;
}

/** Recorded when the fee-earner accepts the enquiry. */
export interface EnquiryAcceptedPayload extends EnquiryAuditContext {
  /** The wording at the moment of acceptance. */
  acceptedWording: string;
  /** True if the fee-earner edited before accepting. Useful for edit-rate analytics. */
  hadEdits: boolean;
  previousStatus: string | null;
  newStatus: 'accepted';
}

/** Recorded when the fee-earner rejects the enquiry. */
export interface EnquiryRejectedPayload extends EnquiryAuditContext {
  /** Optional fee-earner reason for rejection. Free text. */
  reason?: string;
  /** The wording the fee-earner had at the moment of rejection (may or may not include their edits). */
  finalEditedWording: string | null;
  previousStatus: string | null;
  newStatus: 'rejected';
}

/** Recorded when a .docx is exported from the matter. */
export interface ExportArtifactPayload {
  filename: string;
  sizeBytes: number;
}

/**
 * Discriminated union of all known typed payloads. Callsites that build
 * payloads should construct one of these shapes; consumers querying the
 * audit table can narrow on `eventType` to get the corresponding payload.
 */
export type TypedAuditPayload =
  | EnquirySuggestedPayload
  | EnquiryEditedPayload
  | EnquiryRevertedPayload
  | EnquiryAcceptedPayload
  | EnquiryRejectedPayload
  | ExportArtifactPayload;
