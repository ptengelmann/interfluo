import { generateCon29 } from '../generators/con29';
import { generateDraftContract } from '../generators/draft-contract';
import { generateDrainageSearch } from '../generators/drainage-search';
import { generateTa6 } from '../generators/ta6';
import { generateTa10 } from '../generators/ta10';
import { generateTitleRegister } from '../generators/title-register';
import type { ScenarioBundle } from './index';

/**
 * Freehold where building regs completion certificate is GENUINELY missing.
 *
 * Purpose: separate a real missing-cert issue from the speculative pattern
 * the model has previously emitted ("if the works were carried out, then a
 * cert would be needed"). Here the works are CONFIRMED done and the seller
 * explicitly states the certificate is not available.
 *
 * Documents establish positively:
 *   - planning permission granted (CON29 + TA6)
 *   - works completed in 2020 (TA6 confirms)
 *   - no completion certificate produced (TA6 + absence in CON29 list)
 *
 * Expected: PLANNING_BUILDING_REGS_MISSING emitted at MEDIUM (per taxonomy
 * default; commonly resolved by retrospective regularisation or indemnity).
 * No HIGH escalation unless lender position is known to require otherwise.
 */
export async function freeholdMissingBuildingRegsCert(): Promise<ScenarioBundle> {
  const propertyAddress = '8 Acacia Drive, Cheltenham GL52 3HF';
  const sellerName = 'Caroline and James Bennett';
  const buyerName = 'Olusegun Adeyemi';
  const titleNumber = 'GR306541';

  const titleRegister = await generateTitleRegister({
    titleNumber,
    tenure: 'Freehold',
    propertyAddress,
    registeredProprietor: sellerName,
    proprietorAddress: propertyAddress,
    pricePaid: '£298,000 on 4 February 2015',
    rights: [],
    restrictions: [],
    charges: ['REGISTERED CHARGE dated 4 February 2015 in favour of Santander UK plc.'],
    notices: [],
  });

  const ta6 = await generateTa6({
    propertyAddress,
    sellerName,
    boundaryOwnership:
      'The fence to the left is owned and maintained by the seller. The fence to the right is owned and maintained by the neighbour at 10 Acacia Drive.',
    disputes: 'No disputes or complaints.',
    alterationsDescription:
      'A single-storey rear extension was constructed in 2020, extending the kitchen into the rear garden. Works were carried out by a local builder and completed on or about 14 August 2020.',
    alterationsPlanningPermission:
      'Planning permission ref. 19/00742/FH was granted by Cheltenham Borough Council on 11 December 2019.',
    alterationsBuildingRegs:
      'The seller engaged a local builder but the building regulations completion certificate cannot be located. The seller does not believe a final certificate was issued; the builder issued an invoice marked "all works complete to current regs" but no completion certificate from building control or an approved inspector is available.',
    drainageMains: 'Yes - the property is connected to mains foul and surface water drainage.',
    occupiersOver17: [],
    flooding: 'No.',
    knotweed: 'No.',
    insurance: 'No claims in the last three years.',
    guarantees: [
      'FENSA certificate dated 12 May 2016 in respect of replacement double-glazed windows in the front elevation.',
    ],
    rightsOfWay: 'None.',
    parking: 'Driveway parking for two vehicles.',
  });

  const ta10 = await generateTa10({
    propertyAddress,
    sellerName,
    items: [
      { item: 'Fitted kitchen', status: 'Included' },
      { item: 'Integrated oven and hob', status: 'Included' },
      { item: 'Integrated dishwasher', status: 'Included' },
      { item: 'Bathroom suite', status: 'Included' },
      { item: 'Carpets throughout', status: 'Included' },
      { item: 'Curtains and blinds', status: 'Included' },
    ],
  });

  const con29 = await generateCon29({
    propertyAddress,
    localAuthority: 'Cheltenham Borough Council',
    planningPermissions: [
      'Planning permission ref. 19/00742/FH granted 11 December 2019 for single-storey rear extension. Conditions discharged: standard timescale and materials conditions.',
    ],
    planningEnforcement:
      'No enforcement notices, stop notices, or breach of condition notices recorded.',
    buildingRegsCertificates: [
      'Building Regulations completion certificate dated 22 May 2016 in respect of replacement windows (FENSA route). No further building regulations completion certificates recorded for this property.',
    ],
    listedBuilding: 'No - the property is not listed.',
    conservationArea: 'No - the property is not within a conservation area.',
    tpoTrees: 'None affecting the property.',
    roadAdoption: 'Acacia Drive is a public highway maintainable at public expense.',
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
    sellerSolicitor: 'Wickham Heath LLP',
    buyerName,
    buyerSolicitor: 'Interfluo Test LLP',
    propertyAddress,
    titleNumber,
    purchasePrice: '£412,500',
    depositPercentage: '10%',
    titleGuarantee: 'Full title guarantee',
    vacantPossession: true,
    specifiedIncumbrances: [
      'The matters contained in the registers of title under title number GR306541 as at the date of this contract.',
    ],
    specialConditions: [
      'Completion shall take place 21 days after exchange of contracts unless otherwise agreed in writing.',
    ],
  });

  return {
    name: 'freehold-missing-building-regs-cert',
    description:
      'Freehold where a 2020 rear extension was unquestionably built (TA6 confirms, CON29 records the planning permission) but the building regulations completion certificate is genuinely missing (TA6 says cannot be located, CON29 records no further certificates beyond the 2016 windows). Tests that PLANNING_BUILDING_REGS_MISSING is emitted on positively-supported facts, not on speculation.',
    expectedFindings: [
      'Building regulations completion certificate for the 2020 rear extension is missing. Request retrospective regularisation, or defective title indemnity policy acceptable to the lender.',
      'Routine confirmation that the Santander charge will be redeemed on completion with DS1 to follow.',
      'No CRITICAL flags. PLANNING_BUILDING_REGS_MISSING expected at MEDIUM (taxonomy default).',
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
