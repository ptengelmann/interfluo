import { generateCon29 } from '../generators/con29';
import { generateDraftContract } from '../generators/draft-contract';
import { generateDrainageSearch } from '../generators/drainage-search';
import { generateTa6 } from '../generators/ta6';
import { generateTa10 } from '../generators/ta10';
import { generateTitleRegister } from '../generators/title-register';
import type { ScenarioBundle } from './index';

/**
 * Adversarial freehold scenario seeded with three named issues that
 * exercise codes not covered by the existing scenarios:
 *
 *   1. Active planning enforcement notice in CON29  -> PLANNING_BREACH_ENFORCEMENT
 *      (severity default: critical)
 *   2. Adult partner residing at the property but not listed on TA6
 *      as an occupier (cross-referenced in the draft contract address
 *      and the seller's recent correspondence)  -> OCCUPIER_TENANCY_UNDISCLOSED
 *      (severity default: critical - vacant possession at risk)
 *   3. TA6 declares mains drainage but the drainage search reports
 *      private septic tank with no maintenance evidence
 *        -> SEARCH_DRAINAGE_DISCREPANCY (medium)
 *
 * Plus deliberate noise the pipeline should NOT escalate:
 *   - routine seller's mortgage to be redeemed on completion
 *   - FENSA / NICEIC certificates in the pack already
 *   - permitted development summer house
 */
export async function freeholdEnforcementAndUndisclosedOccupier(): Promise<ScenarioBundle> {
  const propertyAddress = '18 Highfield Road, Bristol BS6 7TG';
  const sellerName = 'Marcus Greene';
  const buyerName = 'Aisha Rahman';
  const titleNumber = 'AVN414829';
  const partnerName = 'Eleanor Whitfield';

  const titleRegister = await generateTitleRegister({
    titleNumber,
    tenure: 'Freehold',
    propertyAddress,
    registeredProprietor: sellerName,
    proprietorAddress: propertyAddress,
    pricePaid: '£312,000 on 7 March 2018',
    rights: [
      'Right of way on foot and with vehicles over the shared driveway shown coloured brown.',
    ],
    restrictions: [],
    charges: ['REGISTERED CHARGE dated 7 March 2018 in favour of NATIONWIDE BUILDING SOCIETY.'],
    notices: [],
  });

  const ta6 = await generateTa6({
    propertyAddress,
    sellerName,
    boundaryOwnership:
      'The fence on the left is owned and maintained by the seller. The fence on the right is owned and maintained by the neighbour at 20 Highfield Road.',
    disputes: 'No disputes or complaints.',
    alterationsDescription:
      'A timber summer house was installed in the rear garden in 2021. No structural alterations to the house itself.',
    alterationsPlanningPermission:
      'Planning permission not required (the summer house is below the permitted development threshold).',
    alterationsBuildingRegs: 'Building Regulations not applicable.',
    drainageMains: 'Yes - the property is connected to mains foul and surface water drainage.',
    // Deliberately omitting Eleanor Whitfield - she is mentioned elsewhere
    // in the pack (draft contract correspondence, mortgage cover letter)
    // but the seller has not disclosed her as an occupier on the TA6.
    occupiersOver17: [],
    flooding: 'No.',
    knotweed: 'No.',
    insurance: 'No claims in the last three years.',
    guarantees: [
      'FENSA certificate dated 18 April 2019 in respect of replacement double-glazed windows throughout.',
      'NICEIC electrical installation certificate dated 22 June 2020.',
    ],
    rightsOfWay: 'Shared driveway with 20 Highfield Road.',
    parking: 'Off-street parking on the shared driveway.',
  });

  const ta10 = await generateTa10({
    propertyAddress,
    sellerName,
    items: [
      { item: 'Fitted kitchen - units, worktops, sink, taps', status: 'Included' },
      { item: 'Integrated dishwasher', status: 'Included' },
      { item: 'Free-standing fridge / freezer', status: 'Included' },
      { item: 'Bathroom suite', status: 'Included' },
      { item: 'Carpets throughout', status: 'Included' },
      { item: 'Curtains and blinds', status: 'Included' },
      { item: 'Summer house', status: 'Included' },
    ],
  });

  // Planted issue 1: active planning enforcement notice.
  // Planted issue 3: discrepancy will be revealed against the drainage search below.
  const con29 = await generateCon29({
    propertyAddress,
    localAuthority: 'Bristol City Council',
    planningPermissions: [
      'Planning permission ref. 21/03847/F granted 14 November 2021 for single-storey rear extension. Conditions attached: works to commence within three years.',
    ],
    planningEnforcement:
      'Enforcement Notice ref. EN/2024/0192 dated 5 February 2024 served by Bristol City Council in respect of unauthorised conversion of integral garage to habitable accommodation contrary to condition 4 of planning permission 21/03847/F. The Notice requires the unauthorised use to cease and reinstatement of the garage within 6 months. The Notice remains in force.',
    buildingRegsCertificates: [
      'Building Regulations completion certificate dated 12 July 2019 in respect of replacement windows (FENSA route).',
    ],
    listedBuilding: 'No - the property is not listed.',
    conservationArea: 'No - the property is not within a conservation area.',
    tpoTrees: 'None affecting the property.',
    roadAdoption: 'Highfield Road is a public highway maintainable at public expense.',
    publicRightsOfWay: 'None.',
    contaminatedLandNotice: 'No.',
    cpoNotices: 'None.',
  });

  // Planted issue 3: drainage search contradicts the TA6 mains claim.
  const drainage = await generateDrainageSearch({
    propertyAddress,
    waterCompany: 'Wessex Water Services Limited',
    foulConnectedToMains:
      'No - the property is not recorded as connected to the public foul sewer. The records indicate a private foul drainage arrangement (septic tank or package treatment plant) for which no maintenance records are held by the undertaker.',
    surfaceConnectedToMains:
      'Yes - the property is recorded as connected to the public surface water sewer.',
    publicSewerWithinBoundary: 'No public sewer is recorded within the boundary of the property.',
    waterMainWithinBoundary: 'No water main is recorded within the boundary of the property.',
    buildOverAgreementRequired: 'No build-over agreement is required.',
  });

  // Planted issue 2: draft contract correspondence references Eleanor
  // Whitfield as a co-resident at the property in the seller's solicitor's
  // covering note (planted in the specifiedIncumbrances narrative). The
  // model should pick this up and raise the occupier consent / vacant
  // possession question.
  const draftContract = await generateDraftContract({
    sellerName,
    sellerSolicitor: 'Trembath & Pugh LLP',
    buyerName,
    buyerSolicitor: 'Interfluo Test LLP',
    propertyAddress,
    titleNumber,
    purchasePrice: '£395,000',
    depositPercentage: '10%',
    titleGuarantee: 'Full title guarantee',
    vacantPossession: true,
    specifiedIncumbrances: [
      'The matters contained in the registers of title under title number AVN414829 as at the date of this contract.',
      `Personal occupation by the seller Marcus Greene and his partner ${partnerName}, who currently reside at the property. The seller confirms vacant possession will be given on completion.`,
    ],
    specialConditions: [
      'Completion shall take place 28 days after exchange of contracts unless otherwise agreed in writing.',
    ],
  });

  return {
    name: 'freehold-enforcement-and-undisclosed-occupier',
    description:
      "An adversarial freehold scenario testing three named codes: active planning enforcement on an unauthorised garage conversion; an undisclosed adult occupier (the seller's partner is mentioned in the contract correspondence but not the TA6); and a drainage discrepancy where the TA6 declares mains but the drainage search reports private. Routine items (FENSA, NICEIC, permitted-development summer house, seller's mortgage redemption) should not be escalated.",
    expectedFindings: [
      'Active planning enforcement notice EN/2024/0192 requiring reinstatement of the garage within 6 months - critical, do not advise exchange until resolved.',
      `Adult co-occupier ${partnerName} disclosed in the draft contract correspondence but not on the TA6 - occupier consent / vacant possession question must be put to the seller's solicitor.`,
      'Drainage discrepancy: TA6 declares mains but the CON29DW shows the property is on a private septic tank with no maintenance records - request maintenance evidence and consider indemnity / retention.',
      'Routine Nationwide mortgage to be redeemed on completion - informational, not a risk.',
      'FENSA + NICEIC certificates already in the pack - confirmatory enquiry only.',
      'Permitted-development summer house - note in Report, not an enquiry.',
    ],
    files: [
      { filename: '01-title-register.pdf', buffer: titleRegister },
      { filename: '02-ta6-property-information.pdf', buffer: ta6 },
      { filename: '03-ta10-fittings-and-contents.pdf', buffer: ta10 },
      { filename: '04-con29-local-authority.pdf', buffer: con29 },
      { filename: '05-drainage-and-water-search.pdf', buffer: drainage },
      { filename: '06-draft-contract.pdf', buffer: draftContract },
    ],
  };
}
