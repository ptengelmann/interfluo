import { generateCon29 } from '../generators/con29';
import { generateDraftContract } from '../generators/draft-contract';
import { generateDrainageSearch } from '../generators/drainage-search';
import { generateTa6 } from '../generators/ta6';
import { generateTa10 } from '../generators/ta10';
import { generateTitleRegister } from '../generators/title-register';
import type { ScenarioBundle } from './index';

/**
 * Freehold where the TA6 flatly contradicts the drainage / search record on
 * flooding history. Validates SELLER_DISCLOSURE_INCONSISTENCY outside the
 * planning context (the previous test of this code was the TA6/CON29
 * enforcement misrep).
 *
 * Planted issues:
 *   - TA6 declares no flooding ever, no insurance claims
 *   - Drainage search "notes" disclose a 2019 fluvial flood incident
 *     affecting the ground floor
 *   - CON29 contaminated-land field records a 2019 insurance claim in
 *     respect of the same incident
 *
 * Three distinct codes should fire:
 *   - SELLER_DISCLOSURE_INCONSISTENCY (cross-document misrep on flooding /
 *     insurance)
 *   - SEARCH_FLOOD_RISK (material flood risk disclosed in search)
 *   - INSURANCE_CLAIM_DISCLOSED (recent claim)
 *
 * Plus routine TITLE_CHARGE_DISCHARGE_EVIDENCE.
 */
export async function freeholdDisclosureInconsistencyFlooding(): Promise<ScenarioBundle> {
  const propertyAddress = '6 Riverside Walk, York YO1 6DR';
  const sellerName = 'Adrian Cole';
  const buyerName = 'Beatrice Owens';
  const titleNumber = 'NYK284901';

  const titleRegister = await generateTitleRegister({
    titleNumber,
    tenure: 'Freehold',
    propertyAddress,
    registeredProprietor: sellerName,
    proprietorAddress: propertyAddress,
    pricePaid: '£325,000 on 19 June 2016',
    rights: ['Right of way on foot over the riverside path shown coloured brown.'],
    restrictions: [],
    charges: ['REGISTERED CHARGE dated 19 June 2016 in favour of HSBC UK Bank plc.'],
    notices: [],
  });

  // Planted: TA6 declares no flooding and no insurance claims, contradicting
  // the drainage notes and CON29 entries below.
  const ta6 = await generateTa6({
    propertyAddress,
    sellerName,
    boundaryOwnership:
      'The fence to the left is owned and maintained by the seller. There is no fence to the right (the property abuts the riverside path).',
    disputes: 'No disputes or complaints.',
    alterationsDescription: null,
    alterationsPlanningPermission: 'Not applicable.',
    alterationsBuildingRegs: 'Not applicable.',
    drainageMains: 'Yes - the property is connected to mains foul and surface water drainage.',
    occupiersOver17: [],
    flooding: "No. The property has not flooded during the seller's ownership.",
    knotweed: 'No.',
    insurance: 'No claims in the last three years.',
    guarantees: [],
    rightsOfWay: 'Riverside path along the rear boundary.',
    parking: 'On-street parking only (permit zone).',
  });

  const ta10 = await generateTa10({
    propertyAddress,
    sellerName,
    items: [
      { item: 'Fitted kitchen', status: 'Included' },
      { item: 'Bathroom suite', status: 'Included' },
      { item: 'Carpets throughout', status: 'Included' },
      { item: 'Curtains and blinds', status: 'Included' },
    ],
  });

  // Planted contradiction #1: CON29 contaminated-land field carries the
  // record of a 2019 buildings-insurance claim arising from a flooding
  // incident (commonly recorded against the property in local authority
  // historical claims data).
  const con29 = await generateCon29({
    propertyAddress,
    localAuthority: 'City of York Council',
    planningPermissions: [
      'No planning applications recorded against the property in the last 10 years.',
    ],
    planningEnforcement: 'No enforcement notices recorded.',
    buildingRegsCertificates: [],
    listedBuilding: 'No - the property is not listed.',
    conservationArea:
      'No - the property is within the Riverside Conservation Area, but no specific consents are currently required for this property.',
    tpoTrees: 'None.',
    roadAdoption: 'Riverside Walk is a public highway maintainable at public expense.',
    publicRightsOfWay: 'Public footpath along the rear riverside boundary (PRoW ref. YK-12).',
    contaminatedLandNotice:
      'No determination under Part 2A. Local authority records note a buildings insurance claim made by the property occupier in February 2019 in respect of internal flood damage (claim ref. recorded by Aviva Insurance UK Ltd).',
    cpoNotices: 'None.',
  });

  // Planted contradiction #2: drainage search notes the historical fluvial
  // flood incident that the TA6 denies.
  const drainage = await generateDrainageSearch({
    propertyAddress,
    waterCompany: 'Yorkshire Water Services Limited',
    foulConnectedToMains: 'Yes - the property is connected to the public foul sewer.',
    surfaceConnectedToMains: 'Yes - the property is connected to the public surface water sewer.',
    publicSewerWithinBoundary: 'No public sewer is recorded within the boundary of the property.',
    waterMainWithinBoundary: 'No water main is recorded within the boundary of the property.',
    buildOverAgreementRequired: 'No build-over agreement is required.',
    notes:
      'Historical flooding: the property is recorded as having experienced one fluvial flood event on or about 11 February 2019 (flood depth circa 0.4m to the ground floor) arising from elevated river levels following storm Ciara. The property is located within Environment Agency Flood Zone 3 (high probability of river flooding).',
  });

  const draftContract = await generateDraftContract({
    sellerName,
    sellerSolicitor: 'Lendal & Stonegate LLP',
    buyerName,
    buyerSolicitor: 'Interfluo Test LLP',
    propertyAddress,
    titleNumber,
    purchasePrice: '£365,000',
    depositPercentage: '10%',
    titleGuarantee: 'Full title guarantee',
    vacantPossession: true,
    specifiedIncumbrances: [
      'The matters contained in the registers of title under title number NYK284901 as at the date of this contract.',
    ],
    specialConditions: [
      'Completion shall take place 28 days after exchange of contracts unless otherwise agreed in writing.',
    ],
  });

  return {
    name: 'freehold-disclosure-inconsistency-flooding',
    description:
      "York riverside freehold where the seller's TA6 declares no flooding and no insurance claims. The drainage search records a 2019 fluvial flood incident with 0.4m depth on the ground floor, and the CON29 contaminated-land field records a 2019 Aviva buildings insurance claim for internal flood damage. Tests SELLER_DISCLOSURE_INCONSISTENCY outside the planning context, alongside SEARCH_FLOOD_RISK and INSURANCE_CLAIM_DISCLOSED.",
    expectedFindings: [
      'TA6 declaration of "no flooding" contradicted by the drainage search (2019 fluvial flood, 0.4m depth). Cross-document disclosure inconsistency.',
      'TA6 declaration of "no insurance claims" contradicted by the CON29 contaminated-land field (Aviva 2019 claim for flood damage). Cross-document disclosure inconsistency.',
      'Material flood risk: property in Environment Agency Flood Zone 3 with a recorded fluvial event. Flood Re eligibility, lender appetite, and buyer insurance position must be checked before exchange.',
      'Routine confirmation that the HSBC charge will be redeemed on completion with DS1 to follow.',
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
