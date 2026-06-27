import { generateCon29 } from '../generators/con29';
import { generateDraftContract } from '../generators/draft-contract';
import { generateDrainageSearch } from '../generators/drainage-search';
import { generateTa6 } from '../generators/ta6';
import { generateTa10 } from '../generators/ta10';
import { generateTitleRegister } from '../generators/title-register';
import type { ScenarioBundle } from './index';

/**
 * Freehold with a historical boundary dispute that was formally resolved.
 *
 * Purpose: test over-flag suppression. The TA6 discloses, for completeness,
 * a 2018 boundary disagreement with a neighbour that was settled by a
 * written boundary agreement in 2019. There is no current dispute.
 *
 * Expected output: the boundary point should be raised in the report at
 * informational severity (or as a P3-P4 enquiry seeking a copy of the
 * boundary agreement), NOT as HIGH/CRITICAL. The BOUNDARY_DISPUTE_UNRESOLVED
 * code should NOT be emitted because the dispute is resolved.
 *
 * Expected codes (only one): TITLE_CHARGE_DISCHARGE_EVIDENCE.
 */
export async function freeholdResolvedBoundaryDispute(): Promise<ScenarioBundle> {
  const propertyAddress = '14 Cavendish Crescent, Nottingham NG7 1AB';
  const sellerName = 'Margaret and Peter Holland';
  const buyerName = 'Thomas Reid';
  const titleNumber = 'NT194872';

  const titleRegister = await generateTitleRegister({
    titleNumber,
    tenure: 'Freehold',
    propertyAddress,
    registeredProprietor: sellerName,
    proprietorAddress: propertyAddress,
    pricePaid: '£195,000 on 11 August 2012',
    rights: [],
    restrictions: [],
    charges: ['REGISTERED CHARGE dated 11 August 2012 in favour of Nationwide Building Society.'],
    notices: [],
  });

  const ta6 = await generateTa6({
    propertyAddress,
    sellerName,
    boundaryOwnership:
      'The fence to the left is owned and maintained by the seller. The fence to the right is owned and maintained by the neighbour at 16 Cavendish Crescent (subject to the boundary agreement referred to in question 2).',
    disputes:
      'There was a boundary disagreement in 2018 with the previous owner of 16 Cavendish Crescent concerning the position of the rear-right corner of the fence. This was formally resolved by a written boundary agreement dated 14 March 2019 between Margaret and Peter Holland and Mr and Mrs Atkinson (then owners of No. 16). The boundary agreement was registered against both titles (the seller will provide a copy). There has been no further disagreement and the position is settled.',
    alterationsDescription: null,
    alterationsPlanningPermission: 'Not applicable.',
    alterationsBuildingRegs: 'Not applicable.',
    drainageMains: 'Yes - the property is connected to mains foul and surface water drainage.',
    occupiersOver17: [],
    flooding: 'No.',
    knotweed: 'No.',
    insurance: 'No claims in the last three years.',
    guarantees: [],
    rightsOfWay: 'None.',
    parking: 'On-street parking only (permit zone).',
  });

  const ta10 = await generateTa10({
    propertyAddress,
    sellerName,
    items: [
      { item: 'Fitted kitchen', status: 'Included' },
      { item: 'Integrated dishwasher', status: 'Included' },
      { item: 'Bathroom suite', status: 'Included' },
      { item: 'Carpets throughout', status: 'Included' },
      { item: 'Curtains and blinds', status: 'Excluded' },
    ],
  });

  const con29 = await generateCon29({
    propertyAddress,
    localAuthority: 'Nottingham City Council',
    planningPermissions: [
      'No planning applications recorded against the property in the last 10 years.',
    ],
    planningEnforcement: 'No enforcement notices recorded.',
    buildingRegsCertificates: [],
    listedBuilding: 'No.',
    conservationArea: 'No.',
    tpoTrees: 'None affecting the property.',
    roadAdoption: 'Cavendish Crescent is a public highway maintainable at public expense.',
    publicRightsOfWay: 'None.',
    contaminatedLandNotice: 'No.',
    cpoNotices: 'None.',
  });

  const drainage = await generateDrainageSearch({
    propertyAddress,
    waterCompany: 'Severn Trent Water',
    foulConnectedToMains: 'Yes - the property is connected to the public foul sewer.',
    surfaceConnectedToMains: 'Yes - the property is connected to the public surface water sewer.',
    publicSewerWithinBoundary: 'No public sewer is recorded within the boundary of the property.',
    waterMainWithinBoundary: 'No water main is recorded within the boundary of the property.',
    buildOverAgreementRequired: 'No build-over agreement is required.',
  });

  const draftContract = await generateDraftContract({
    sellerName,
    sellerSolicitor: 'Bromley & Co',
    buyerName,
    buyerSolicitor: 'Interfluo Test LLP',
    propertyAddress,
    titleNumber,
    purchasePrice: '£268,500',
    depositPercentage: '10%',
    titleGuarantee: 'Full title guarantee',
    vacantPossession: true,
    specifiedIncumbrances: [
      'The matters contained in the registers of title under title number NT194872 as at the date of this contract.',
      'The boundary agreement dated 14 March 2019 between the seller and Mr and Mrs Atkinson concerning the rear-right boundary feature with 16 Cavendish Crescent.',
    ],
    specialConditions: [
      'Completion shall take place 28 days after exchange of contracts unless otherwise agreed in writing.',
    ],
  });

  return {
    name: 'freehold-resolved-boundary-dispute',
    description:
      'Freehold pack where the TA6 candidly discloses a 2018 boundary disagreement that was formally settled by a 2019 boundary agreement. Tests over-flag suppression: a resolved historical dispute is NOT BOUNDARY_DISPUTE_UNRESOLVED. The pipeline should request a copy of the boundary agreement (low-priority enquiry) but should not escalate the resolved matter as HIGH/CRITICAL.',
    expectedFindings: [
      'Request a copy of the 2019 boundary agreement so it can be reviewed and noted in the Report on Title.',
      'Routine confirmation that the Nationwide charge will be redeemed on completion with DS1 to follow.',
      'No material risks. No BOUNDARY_DISPUTE_UNRESOLVED flag. No HIGH/CRITICAL escalation of the resolved boundary point.',
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
