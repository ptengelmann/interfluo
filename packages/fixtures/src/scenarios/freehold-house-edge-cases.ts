import { generateCon29 } from '../generators/con29';
import { generateDraftContract } from '../generators/draft-contract';
import { generateDrainageSearch } from '../generators/drainage-search';
import { generateTa10 } from '../generators/ta10';
import { generateTa6 } from '../generators/ta6';
import { generateTitleRegister } from '../generators/title-register';
import type { ScenarioBundle } from './index';

/**
 * Adversarial scenario. A freehold sale that LOOKS messy but most of the
 * "scary" items are routine or already resolved. Designed to stress-test
 * severity calibration: the failure mode here is OVER-flagging, not
 * under-flagging.
 *
 * Genuine material issues planted (model SHOULD raise these):
 *  - Adult occupier "John Wilson" undisclosed relationship + Occupier's
 *    Consent not yet obtained.
 *  - 2024 planning permission for rear extension granted, but TA6 says no
 *    works carried out — clarification needed (was it built?).
 *  - Kitchen rewired 2022, no NICEIC certificate, no Part P notification.
 *
 * Adversarial traps (model should NOT promote to critical/P1):
 *  - Halifax mortgage REDEEMED but DS1 not yet registered (looks scary
 *    but the redemption has happened — routine paperwork).
 *  - Boundary dispute from 2019, fully resolved by deed of variation in
 *    2020 (historical, not current).
 *  - Conservation area applies to *neighbour at no. 47*, not the subject
 *    property (no constraint on the deal).
 *  - 1923 covenant restricting use to "private dwellinghouse" — likely
 *    unenforceable; note in report, do not block.
 *  - Standard surface water drainage charge of £55/year (annual rate,
 *    routine cost).
 *  - Property is within 500m of registered common land (proximity only —
 *    common land doesn't burden the subject property).
 */
export async function freeholdHouseEdgeCases(): Promise<ScenarioBundle> {
  const propertyAddress = '49 Beechwood Avenue, Wilmslow, SK9 5RG';
  const sellerName = 'Christopher and Sarah Mitchell';
  const buyerName = 'Daniel Foster';
  const titleNumber = 'CH421887';

  const titleRegister = await generateTitleRegister({
    titleNumber,
    tenure: 'Freehold',
    propertyAddress,
    registeredProprietor: sellerName,
    proprietorAddress: propertyAddress,
    pricePaid: '£412,000 on 8 April 2019',
    rights: [
      'Right of way on foot over the footpath at the rear of the property as shown coloured blue on the title plan.',
    ],
    restrictions: [],
    charges: [
      'REGISTERED CHARGE dated 8 April 2019 in favour of HALIFAX, a division of Bank of Scotland plc. NOTE: Charge fully redeemed on 14 May 2026; Form DS1 issued by lender on 16 May 2026 and pending registration at HM Land Registry.',
      'CONVEYANCE dated 12 June 1923 between the Trustees of the Wilmslow Estate (1) and the original purchaser (2) contains the following restrictive covenant: "Not to use the said premises otherwise than as a private dwellinghouse for one family." NOTE: Many properties on Beechwood Avenue have since been used in breach (eg as guest houses) without enforcement; the practical enforceability of this covenant is doubtful.',
    ],
    notices: [],
  });

  const ta6 = await generateTa6({
    propertyAddress,
    sellerName,
    boundaryOwnership:
      'The fence on the left is owned and maintained by the seller. The fence on the right is owned and maintained by the neighbour at 51 Beechwood Avenue.',
    disputes:
      'A dispute arose in 2019 with the previous neighbour at 51 Beechwood Avenue regarding the precise line of the rear boundary. The matter was resolved amicably by a deed of variation dated 4 February 2020 (registered against both titles) which moved the boundary by approximately 30cm and was accepted by both parties. There are no current disputes or complaints.',
    alterationsDescription:
      'The kitchen was completely rewired in March 2022 by a local electrician (J. Patel of Wilmslow). No structural alterations or extensions have been carried out at the property.',
    alterationsPlanningPermission:
      'No planning permission was required for the kitchen rewire.',
    alterationsBuildingRegs:
      'The seller does not have a NICEIC certificate or Part P building regulations notification in respect of the 2022 rewire. The electrician advised it was not required for the works carried out.',
    drainageMains: 'Yes — the property is connected to mains foul and surface water drainage.',
    occupiersOver17: ['John Wilson'],
    flooding: 'No.',
    knotweed: 'No.',
    insurance: 'No claims in the last three years.',
    guarantees: [
      'FENSA certificate dated 19 September 2017 in respect of replacement double-glazed windows throughout the property.',
    ],
    rightsOfWay:
      'A footpath runs along the rear of the gardens of nos. 45-55 Beechwood Avenue. The property has the benefit of a right of way on foot over that footpath.',
    parking: 'Off-street parking on the front drive for two vehicles.',
    servicesNotes:
      'Gas, electricity, mains water, mains drainage and broadband all connected. Note the seller pays an annual surface water drainage charge of £55 to United Utilities.',
  });

  const ta10 = await generateTa10({
    propertyAddress,
    sellerName,
    items: [
      { item: 'Fitted kitchen — units, worktops, sink, taps', status: 'Included' },
      { item: 'Integrated dishwasher', status: 'Included' },
      { item: 'Range cooker (free-standing)', status: 'Included' },
      { item: 'Washing machine', status: 'Excluded' },
      { item: 'Bathroom suite', status: 'Included' },
      { item: 'Carpets throughout', status: 'Included' },
      { item: 'Curtains and blinds', status: 'Included' },
      { item: 'Garden shed', status: 'Included' },
      { item: 'Greenhouse', status: 'Included' },
      { item: 'TV aerial and satellite dish', status: 'Included' },
    ],
  });

  const con29 = await generateCon29({
    propertyAddress,
    localAuthority: 'Cheshire East Council',
    planningPermissions: [
      'Application reference 24/0918M dated 12 April 2024: planning permission GRANTED for a single-storey rear extension (8m x 4m), conditional on commencement within 3 years.',
    ],
    planningEnforcement: 'No enforcement notices, stop notices, or breach of condition notices recorded.',
    buildingRegsCertificates: [
      'Building Regulations completion certificate dated 22 October 2017 in respect of replacement windows (FENSA route).',
    ],
    listedBuilding: 'No — the property is not listed.',
    conservationArea:
      'No — the SUBJECT property is not within a conservation area. The neighbouring property at 47 Beechwood Avenue (and a number of other properties on the south side of the road) lies within the Beechwood Avenue Conservation Area, but this designation does NOT extend to or affect 49 Beechwood Avenue.',
    tpoTrees: 'No tree preservation orders affect the property.',
    roadAdoption: 'Beechwood Avenue is a public highway maintainable at public expense.',
    publicRightsOfWay:
      'A public right of way (footpath FP47) runs along the rear of the gardens of nos. 45-55. The path is recorded on the definitive map.',
    contaminatedLandNotice: 'No.',
    cpoNotices: 'None.',
  });

  const drainage = await generateDrainageSearch({
    propertyAddress,
    waterCompany: 'United Utilities Water Limited',
    foulConnectedToMains: 'Yes — the property is connected to the public foul sewer.',
    surfaceConnectedToMains:
      'Yes — the property is connected to the public surface water sewer. An annual surface water drainage charge of approximately £55 is payable by the property occupier as part of the water and sewerage account.',
    publicSewerWithinBoundary: 'No public sewer is recorded within the boundary of the property.',
    waterMainWithinBoundary: 'No water main is recorded within the boundary of the property.',
    buildOverAgreementRequired: 'No build-over agreement is required.',
    notes:
      'The property lies approximately 480 metres from the nearest registered common land (Wilmslow Common, registered under the Commons Act 2006). This common land does not burden the subject property but is noted for completeness.',
  });

  const draftContract = await generateDraftContract({
    sellerName,
    sellerSolicitor: 'Heaton & Wright LLP',
    buyerName,
    buyerSolicitor: 'Interfluo Test LLP',
    propertyAddress,
    titleNumber,
    purchasePrice: '£535,000',
    depositPercentage: '10%',
    titleGuarantee: 'Full title guarantee',
    vacantPossession: true,
    specifiedIncumbrances: [
      'The matters contained in the registers of title under title number CH421887 as at the date of this contract, including (without prejudice to the generality of the foregoing) the 1923 restrictive covenant and the deed of variation dated 4 February 2020 in relation to the rear boundary.',
    ],
    specialConditions: [
      'Completion shall take place 21 days after exchange of contracts unless otherwise agreed in writing.',
      'The Seller warrants that any adult occupiers of the Property will sign an occupier consent / waiver in such form as is reasonably required by the Buyer\'s solicitors prior to exchange of contracts.',
    ],
  });

  return {
    name: 'freehold-house-edge-cases',
    description:
      'Adversarial freehold scenario designed to stress-test severity calibration. Most "scary-looking" items are routine or already-resolved; three items are genuinely material and must be raised. Failure mode: over-flagging routine items as critical/P1, OR missing the three genuine concerns.',
    expectedFindings: [
      'P2 — Undisclosed adult occupier "John Wilson" listed on TA6 9.1 with no stated relationship to the seller. Occupier\'s consent / waiver of overriding interest must be obtained before exchange (the draft contract already anticipates this in Special Condition 2 — raise to confirm form and timing).',
      'P2 — Planning permission 24/0918M granted in 2024 for a rear extension, but TA6 declares no structural alterations. Clarify with the seller\'s solicitor whether the extension was built (and if so why TA6 was completed as it was), or whether the permission is unexercised and lapses in 2027.',
      'P3 — Kitchen rewire in March 2022 with no NICEIC certificate and no Part P notification. Raise an enquiry; an electrical indemnity policy may be appropriate.',
      'NOT material — Halifax mortgage was REDEEMED on 14 May 2026 and DS1 was issued by the lender on 16 May 2026. The entry remaining on the register is routine pending registration. Treat as informational only; do NOT flag as critical or P1.',
      'NOT material — The 2019 boundary dispute was resolved by deed of variation registered in 2020. Historical only. Note in the report; do NOT raise as a current dispute.',
      'NOT material — The Beechwood Avenue Conservation Area applies to the neighbour at no. 47 and the south side of the road; it does NOT cover 49 Beechwood Avenue. Mention in the report for completeness; do NOT treat as a constraint on the subject property.',
      'NOT material — The 1923 covenant restricting the property to use as "a private dwellinghouse" is likely unenforceable in practice (many neighbouring properties have been used in breach without enforcement). Note in the report; do NOT flag as critical.',
      'NOT material — The £55 annual surface water drainage charge is the standard United Utilities charge applicable to most properties on the network. Informational at most.',
      'NOT material — Proximity to Wilmslow Common (480m) is informational only; registered common land does not burden the subject property.',
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
