import { freeholdEnforcementAndUndisclosedOccupier } from './freehold-enforcement-and-undisclosed-occupier';
import { freeholdHouseClean } from './freehold-house-clean';
import { freeholdHouseEdgeCases } from './freehold-house-edge-cases';
import type { Scenario } from './index';
import { leaseholdFlatWithIssues } from './leasehold-flat-with-issues';

export const scenarios: Record<string, Scenario> = {
  'leasehold-flat-with-issues': leaseholdFlatWithIssues,
  'freehold-house-clean': freeholdHouseClean,
  'freehold-house-edge-cases': freeholdHouseEdgeCases,
  'freehold-enforcement-and-undisclosed-occupier': freeholdEnforcementAndUndisclosedOccupier,
};
