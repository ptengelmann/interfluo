import { freeholdCleanWithSatisfiedRestriction } from './freehold-clean-with-satisfied-restriction';
import { freeholdDisclosureInconsistencyFlooding } from './freehold-disclosure-inconsistency-flooding';
import { freeholdEnforcementAndUndisclosedOccupier } from './freehold-enforcement-and-undisclosed-occupier';
import { freeholdHouseClean } from './freehold-house-clean';
import { freeholdHouseEdgeCases } from './freehold-house-edge-cases';
import { freeholdMissingBuildingRegsCert } from './freehold-missing-building-regs-cert';
import { freeholdResolvedBoundaryDispute } from './freehold-resolved-boundary-dispute';
import type { Scenario } from './index';
import { leaseholdFlatWithIssues } from './leasehold-flat-with-issues';
import { leaseholdShortLeaseAndEscalation } from './leasehold-short-lease-and-escalation';

export const scenarios: Record<string, Scenario> = {
  'leasehold-flat-with-issues': leaseholdFlatWithIssues,
  'leasehold-short-lease-and-escalation': leaseholdShortLeaseAndEscalation,
  'freehold-house-clean': freeholdHouseClean,
  'freehold-house-edge-cases': freeholdHouseEdgeCases,
  'freehold-enforcement-and-undisclosed-occupier': freeholdEnforcementAndUndisclosedOccupier,
  'freehold-clean-with-satisfied-restriction': freeholdCleanWithSatisfiedRestriction,
  'freehold-resolved-boundary-dispute': freeholdResolvedBoundaryDispute,
  'freehold-missing-building-regs-cert': freeholdMissingBuildingRegsCert,
  'freehold-disclosure-inconsistency-flooding': freeholdDisclosureInconsistencyFlooding,
};
