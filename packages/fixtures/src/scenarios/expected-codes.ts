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
  // The original 7 codes plus 4 added on 2026-06-28 once the taxonomy grew
  // to include them (and once the legacy scenario was re-benched and the
  // pipeline was observed correctly emitting them). The scenario itself was
  // not modified - the list was simply stale relative to the taxonomy.
  'leasehold-flat-with-issues': [
    'LEASE_SHORT_TERM',
    'LEASE_GROUND_RENT_ESCALATION',
    'LEASE_SECTION_20_MAJOR_WORKS',
    'LEASE_SERVICE_CHARGE_DISPUTE',
    'LEASE_ALTERATIONS_CONSENT',
    'TITLE_RESTRICTION_CONSENT',
    'TITLE_CHARGE_DISCHARGE_EVIDENCE',
    'PLANNING_BUILDING_REGS_MISSING',
    'SEARCH_DRAINAGE_DISCREPANCY',
    'SELLER_DISCLOSURE_INCONSISTENCY',
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

  // Three planted issues plus one routine:
  // - active enforcement notice on garage conversion (PLANNING_BREACH_ENFORCEMENT)
  // - seller's partner acknowledged in the draft contract but not on the TA6
  //   occupiers list (OCCUPIER_CONSENT_MISSING - the contract states vacant
  //   possession, so the issue is the missing consent form, not an undisclosed
  //   tenancy; the pipeline correctly picked this code after the taxonomy
  //   descriptions were sharpened)
  // - TA6 declares mains drainage but CON29DW shows private septic (medium)
  // - seller's TA6 declares "no notices" but CON29 shows enforcement notice
  //   (SELLER_DISCLOSURE_INCONSISTENCY - the cross-document misrepresentation)
  // - Nationwide mortgage to be redeemed on completion (informational)
  'freehold-enforcement-and-undisclosed-occupier': [
    'PLANNING_BREACH_ENFORCEMENT',
    'OCCUPIER_CONSENT_MISSING',
    'SEARCH_DRAINAGE_DISCREPANCY',
    'SELLER_DISCLOSURE_INCONSISTENCY',
    'TITLE_CHARGE_DISCHARGE_EVIDENCE',
  ],

  // Clean Newcastle freehold with a routine Form A restriction and a
  // Lloyds charge. Tests that the pipeline does not invent risks.
  'freehold-clean-with-satisfied-restriction': ['TITLE_CHARGE_DISCHARGE_EVIDENCE'],

  // Historical boundary dispute (2018) formally resolved (2019 boundary
  // agreement). Tests over-flag suppression: BOUNDARY_DISPUTE_UNRESOLVED
  // should NOT be emitted because the dispute is resolved.
  'freehold-resolved-boundary-dispute': ['TITLE_CHARGE_DISCHARGE_EVIDENCE'],

  // Single positively-supported planted issue: 2020 extension built, no
  // building regs certificate, seller confirms unable to locate it.
  // Tests PLANNING_BUILDING_REGS_MISSING on real facts (not speculation).
  'freehold-missing-building-regs-cert': [
    'PLANNING_BUILDING_REGS_MISSING',
    'TITLE_CHARGE_DISCHARGE_EVIDENCE',
  ],

  // Three planted disclosure issues:
  //   - TA6 says no flooding, drainage search records 2019 fluvial flood
  //   - TA6 says no insurance claims, CON29 records 2019 Aviva claim
  //   - Property in EA Flood Zone 3 (material flood risk)
  // Tests SELLER_DISCLOSURE_INCONSISTENCY outside planning + SEARCH_FLOOD_RISK
  // + INSURANCE_CLAIM_DISCLOSED.
  'freehold-disclosure-inconsistency-flooding': [
    'SELLER_DISCLOSURE_INCONSISTENCY',
    'SEARCH_FLOOD_RISK',
    'INSURANCE_CLAIM_DISCLOSED',
    'TITLE_CHARGE_DISCHARGE_EVIDENCE',
  ],

  // Four planted leasehold issues plus one routine. Tighter than
  // leasehold-flat-with-issues so attribution per code is unambiguous.
  'leasehold-short-lease-and-escalation': [
    'LEASE_SHORT_TERM',
    'LEASE_GROUND_RENT_ESCALATION',
    'LEASE_SERVICE_CHARGE_DISPUTE',
    'LEASE_SECTION_20_MAJOR_WORKS',
    'TITLE_CHARGE_DISCHARGE_EVIDENCE',
  ],
};
