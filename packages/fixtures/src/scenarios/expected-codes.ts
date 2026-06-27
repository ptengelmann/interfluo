/**
 * Per-scenario expected issue codes.
 *
 * Each scenario in the bench is deliberately seeded with specific issues
 * that a competent conveyancer should raise. Where one of those issues
 * maps cleanly to a code in the conveyancing taxonomy, the code is
 * listed here. The scorer reads this map to assert that the pipeline
 * routes the seeded issues to the right codes (hit), and to flag any
 * codes the pipeline emits that were not seeded (potential
 * over-flagging or hallucination, depending on context).
 *
 * Not every seeded issue has a corresponding code yet - the taxonomy is
 * intentionally narrow. Seeded issues without a code are still tested
 * via the existing pattern-based SIGNALS in score.ts.
 */
import type { ConveyancingIssueCode } from '@interfluo/core';

export const EXPECTED_ISSUE_CODES: Record<string, ConveyancingIssueCode[]> = {
  'leasehold-flat-with-issues': [
    'LEASE_SHORT_TERM',
    'LEASE_GROUND_RENT_ESCALATION',
    'LEASE_SECTION_20_MAJOR_WORKS',
    'LEASE_SERVICE_CHARGE_DISPUTE',
    'TITLE_RESTRICTION_CONSENT',
    'PLANNING_BUILDING_REGS_MISSING',
    'INSURANCE_CLAIM_DISCLOSED',
  ],

  // Clean scenario - the only routine item is the seller's mortgage
  // discharge. Anything else emitted as a code is over-flagging.
  'freehold-house-clean': ['TITLE_CHARGE_DISCHARGE_EVIDENCE'],

  // Adversarial: the genuine issues that SHOULD be raised. Items not
  // listed here that the pipeline emits as codes need to be investigated
  // for over-flagging (see ADVERSARIAL_ANTIPATTERNS in score.ts).
  'freehold-house-edge-cases': [
    'OCCUPIER_CONSENT_MISSING',
    'PLANNING_BUILDING_REGS_MISSING',
    'TITLE_CHARGE_DISCHARGE_EVIDENCE',
  ],
};
