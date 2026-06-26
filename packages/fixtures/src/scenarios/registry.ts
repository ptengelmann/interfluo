import type { Scenario } from './index';
import { leaseholdFlatWithIssues } from './leasehold-flat-with-issues';
import { freeholdHouseClean } from './freehold-house-clean';

export const scenarios: Record<string, Scenario> = {
  'leasehold-flat-with-issues': leaseholdFlatWithIssues,
  'freehold-house-clean': freeholdHouseClean,
};
