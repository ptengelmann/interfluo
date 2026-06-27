import { generateCon29 } from '../generators/con29';
import { generateDraftContract } from '../generators/draft-contract';
import { generateDrainageSearch } from '../generators/drainage-search';
import { generateTa6 } from '../generators/ta6';
import { generateTa10 } from '../generators/ta10';
import { generateTitleRegister } from '../generators/title-register';
import type { ScenarioBundle } from './index';

/**
 * Clean freehold with routine noise only.
 *
 * Purpose: ensure the model does not invent risks. Companion baseline to
 * freehold-house-clean, but adds a Form A trust restriction (jointly owned
 * property) and a registered mortgage. Both are routine - the restriction
 * is satisfied by appointing an additional trustee on the buyer side, the
 * mortgage is to be redeemed on completion.
 *
 * Expected output: no critical, no high. Mostly informational; routine
 * confirmatory enquiries only. Any escalation of the restriction or charge
 * as "material" is over-flagging.
 *
 * Expected codes (only one): TITLE_CHARGE_DISCHARGE_EVIDENCE.
 */
export async function freeholdCleanWithSatisfiedRestriction(): Promise<ScenarioBundle> {
  const propertyAddress = '32 Larkfield Avenue, Newcastle upon Tyne NE3 4PG';
  const sellerName = 'Helen Foster and Daniel Foster';
  const buyerName = 'Priya Shah';
  const titleNumber = 'TY427183';

  const titleRegister = await generateTitleRegister({
    titleNumber,
    tenure: 'Freehold',
    propertyAddress,
    registeredProprietor: sellerName,
    proprietorAddress: propertyAddress,
    pricePaid: '£268,000 on 14 May 2017',
    rights: ['Right of way on foot over the rear access path shown coloured brown.'],
    restrictions: [
      'RESTRICTION: No disposition by a sole proprietor of the registered estate (except a trust corporation) under which capital money arises is to be registered unless authorised by an order of the court. (Form A)',
    ],
    charges: ['REGISTERED CHARGE dated 14 May 2017 in favour of Lloyds Bank plc.'],
    notices: [],
  });

  const ta6 = await generateTa6({
    propertyAddress,
    sellerName,
    boundaryOwnership:
      'The fence to the left is owned and maintained by the seller. The fence to the right is owned and maintained by the neighbour at 34 Larkfield Avenue.',
    disputes: 'No disputes or complaints.',
    alterationsDescription: null,
    alterationsPlanningPermission: 'Not applicable - no alterations have been made.',
    alterationsBuildingRegs: 'Not applicable.',
    drainageMains: 'Yes - the property is connected to mains foul and surface water drainage.',
    occupiersOver17: [],
    flooding: 'No.',
    knotweed: 'No.',
    insurance: 'No claims in the last three years.',
    guarantees: [
      'FENSA certificate dated 3 March 2018 in respect of replacement windows throughout.',
    ],
    rightsOfWay: 'Rear access path shared with 30 and 34 Larkfield Avenue.',
    parking: 'Off-street parking on the front drive for one vehicle.',
  });

  const ta10 = await generateTa10({
    propertyAddress,
    sellerName,
    items: [
      { item: 'Fitted kitchen - units, worktops, sink, taps', status: 'Included' },
      { item: 'Integrated dishwasher', status: 'Included' },
      { item: 'Free-standing fridge / freezer', status: 'Excluded' },
      { item: 'Washing machine', status: 'Excluded' },
      { item: 'Bathroom suite', status: 'Included' },
      { item: 'Carpets throughout', status: 'Included' },
      { item: 'Curtains and blinds', status: 'Included' },
    ],
  });

  const con29 = await generateCon29({
    propertyAddress,
    localAuthority: 'Newcastle City Council',
    planningPermissions: [
      'No planning applications recorded against the property in the last 10 years.',
    ],
    planningEnforcement:
      'No enforcement notices, stop notices, or breach of condition notices recorded.',
    buildingRegsCertificates: [
      'Building Regulations completion certificate dated 9 April 2018 in respect of replacement windows (FENSA route).',
    ],
    listedBuilding: 'No - the property is not listed.',
    conservationArea: 'No - the property is not within a conservation area.',
    tpoTrees: 'None affecting the property.',
    roadAdoption: 'Larkfield Avenue is a public highway maintainable at public expense.',
    publicRightsOfWay: 'None.',
    contaminatedLandNotice: 'No.',
    cpoNotices: 'None.',
  });

  const drainage = await generateDrainageSearch({
    propertyAddress,
    waterCompany: 'Northumbrian Water Limited',
    foulConnectedToMains: 'Yes - the property is connected to the public foul sewer.',
    surfaceConnectedToMains: 'Yes - the property is connected to the public surface water sewer.',
    publicSewerWithinBoundary: 'No public sewer is recorded within the boundary of the property.',
    waterMainWithinBoundary: 'No water main is recorded within the boundary of the property.',
    buildOverAgreementRequired: 'No build-over agreement is required.',
  });

  const draftContract = await generateDraftContract({
    sellerName,
    sellerSolicitor: 'Hadrian & Foss LLP',
    buyerName,
    buyerSolicitor: 'Interfluo Test LLP',
    propertyAddress,
    titleNumber,
    purchasePrice: '£345,000',
    depositPercentage: '10%',
    titleGuarantee: 'Full title guarantee',
    vacantPossession: true,
    specifiedIncumbrances: [
      'The matters contained in the registers of title under title number TY427183 as at the date of this contract.',
    ],
    specialConditions: [
      'Completion shall take place 21 days after exchange of contracts unless otherwise agreed in writing.',
    ],
  });

  return {
    name: 'freehold-clean-with-satisfied-restriction',
    description:
      'Clean freehold sale of a Newcastle house. The title carries a Form A restriction (routine joint-ownership trust restriction, satisfied by appointing an additional trustee on the buyer side) and a Lloyds Bank charge (routine, to be redeemed on completion). Companion baseline to freehold-house-clean. Used to verify that the pipeline does not escalate routine title items as material risks.',
    expectedFindings: [
      'Routine confirmation that the Lloyds charge will be redeemed on completion with DS1 to follow.',
      'Note that the Form A restriction will be satisfied by appointment of an additional trustee for the buyer side.',
      'Routine confirmation that the FENSA certificate referred to in the TA6 will be handed over on completion.',
      'No material risks. No critical or high-severity flags should appear.',
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
