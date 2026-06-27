import { generateCon29 } from '../generators/con29';
import { generateDraftContract } from '../generators/draft-contract';
import { generateDrainageSearch } from '../generators/drainage-search';
import { generateLease } from '../generators/lease';
import { generateTa6 } from '../generators/ta6';
import { generateTa7 } from '../generators/ta7';
import { generateTa10 } from '../generators/ta10';
import { generateTitleRegister } from '../generators/title-register';
import type { ScenarioBundle } from './index';

/**
 * Focused leasehold scenario: short lease (below most lender thresholds)
 * plus a doubling ground-rent clause and a pending Section 20 notice.
 *
 * Purpose: test leasehold taxonomy routing in a tighter pack than the
 * existing leasehold-flat-with-issues, which bundles many issues
 * together. Here the planted issues are limited so attribution per code
 * is unambiguous.
 *
 * Planted issues:
 *   - lease granted 1999 for 99 years -> ~72 years remaining at completion
 *     (below the common 80-year lender floor)
 *   - ground rent £400 doubling every 10 years
 *   - service charge in arrears (£3,200)
 *   - Section 20 notice served Jan 2026 for major roof works (estimated
 *     £6,800 contribution from this flat)
 *   - routine: parent freehold charge to be redeemed on completion
 *
 * Expected codes: LEASE_SHORT_TERM, LEASE_GROUND_RENT_ESCALATION,
 * LEASE_SERVICE_CHARGE_DISPUTE, LEASE_SECTION_20_MAJOR_WORKS,
 * TITLE_CHARGE_DISCHARGE_EVIDENCE.
 */
export async function leaseholdShortLeaseAndEscalation(): Promise<ScenarioBundle> {
  const propertyAddress = 'Flat 7, Marlborough Court, 22 Albany Road, Reading RG1 6RJ';
  const sellerName = 'Stephen Whittle';
  const buyerName = 'Ruth Daniels';
  const leaseholdTitleNumber = 'BRK382014';
  const parentFreeholdTitleNumber = 'BRK000147';
  const landlordName = 'Marlborough Court (Albany Road) Freehold Ltd';
  const managingAgent = 'Aspect Property Management Ltd';

  const titleRegister = await generateTitleRegister({
    titleNumber: leaseholdTitleNumber,
    tenure: 'Leasehold',
    propertyAddress,
    registeredProprietor: sellerName,
    proprietorAddress: propertyAddress,
    pricePaid: '£182,000 on 4 September 2014',
    parentFreeholdTitle: parentFreeholdTitleNumber,
    leaseDetails: {
      dated: '1 March 1999',
      term: '99 years from 1 January 1999',
    },
    rights: [
      'Right of way over the communal entrance and stairwells.',
      'Right of support and shelter from the building.',
    ],
    restrictions: [],
    charges: ['REGISTERED CHARGE dated 4 September 2014 in favour of Barclays Bank UK plc.'],
    notices: [],
  });

  const lease = await generateLease({
    propertyAddress,
    parentTitleNumber: parentFreeholdTitleNumber,
    dateOfLease: '1 March 1999',
    termYears: 99,
    termStartDate: '1 January 1999',
    initialGroundRent: '£400 per annum',
    groundRentReviewClause:
      'The ground rent shall double on each tenth anniversary of the term commencement date. For the avoidance of doubt: £400 from year 1; £800 from year 11; £1,600 from year 21; £3,200 from year 31; £6,400 from year 41; and so on for the duration of the term.',
    serviceChargeMechanism:
      'The lessee shall pay a fair proportion (currently 1/12th) of the costs and expenses of the lessor in maintaining the building, payable half-yearly in advance on 1 January and 1 July.',
    alterationsRestriction:
      'No structural alterations or additions without the prior written consent of the lessor (such consent not to be unreasonably withheld).',
    alienationRestriction:
      'No assignment of the lease without giving prior notice to the lessor and paying the registration fee.',
    petsClause: 'No pets without the prior written consent of the lessor.',
    forfeitureClause:
      'The lessor may re-enter and forfeit the lease in the event of unpaid rent or service charge that remains outstanding for more than 21 days after written demand.',
  });

  const ta6 = await generateTa6({
    propertyAddress,
    sellerName,
    boundaryOwnership: 'Internal flat - no external boundaries owned by the lessee.',
    disputes: 'No disputes or complaints.',
    alterationsDescription: null,
    alterationsPlanningPermission: 'Not applicable.',
    alterationsBuildingRegs: 'Not applicable.',
    drainageMains: 'Yes - the building is connected to mains foul and surface water drainage.',
    occupiersOver17: [],
    flooding: 'No.',
    knotweed: 'No.',
    insurance: 'No claims in the last three years (buildings insurance is arranged by the lessor).',
    guarantees: [],
    rightsOfWay: 'Communal entrance, stairwells, and bin store.',
    parking: 'One allocated parking space at the rear of the building (space ref. 7).',
  });

  const ta7 = await generateTa7({
    propertyAddress,
    sellerName,
    landlordName,
    managingAgent,
    groundRent:
      '£800 per annum at the current review (the term is in year 27 of 99 - the rent doubles every 10 years per the lease).',
    groundRentReview:
      'Next review on 1 January 2029 (year 31): ground rent will increase from £800 to £1,600 per annum.',
    serviceCharge:
      'Service charge invoiced half-yearly. Current half-year demand £1,150. Annual total approximately £2,300.',
    serviceChargeArrears:
      'The seller is currently in arrears of £3,200 owed to the managing agent in respect of service charges for 2024 and the first half of 2025. The seller is in correspondence with Aspect Property Management to agree a payment plan but no agreement is yet in place.',
    reserveFund: 'The building has a small reserve fund of approximately £4,500 in total.',
    section20Notices:
      'A Section 20 notice was served by the managing agent on 18 January 2026 in respect of proposed major roof works (estimated total cost £81,600 across the 12 flats). The estimated contribution from this flat is £6,800. The consultation period under the Landlord and Tenant Act 1985 is currently in progress; the works are anticipated to commence in summer 2026.',
    buildingsInsurance:
      'Buildings insurance is arranged by the lessor through Zurich Insurance plc. The current policy expires 31 March 2027.',
    disputesWithLandlord: 'None other than the service charge arrears referred to above.',
  });

  const ta10 = await generateTa10({
    propertyAddress,
    sellerName,
    items: [
      { item: 'Fitted kitchen', status: 'Included' },
      { item: 'Integrated dishwasher', status: 'Included' },
      { item: 'Free-standing washing machine', status: 'Excluded' },
      { item: 'Bathroom suite', status: 'Included' },
      { item: 'Carpets throughout', status: 'Included' },
      { item: 'Curtains and blinds', status: 'Included' },
    ],
  });

  const con29 = await generateCon29({
    propertyAddress,
    localAuthority: 'Reading Borough Council',
    planningPermissions: [
      'No planning applications recorded against the building in the last 10 years.',
    ],
    planningEnforcement: 'No enforcement notices recorded.',
    buildingRegsCertificates: [],
    listedBuilding: 'No.',
    conservationArea: 'No.',
    tpoTrees: 'None.',
    roadAdoption: 'Albany Road is a public highway maintainable at public expense.',
    publicRightsOfWay: 'None.',
    contaminatedLandNotice: 'No.',
    cpoNotices: 'None.',
  });

  const drainage = await generateDrainageSearch({
    propertyAddress,
    waterCompany: 'Thames Water Utilities Ltd',
    foulConnectedToMains: 'Yes - the building is connected to the public foul sewer.',
    surfaceConnectedToMains: 'Yes - the building is connected to the public surface water sewer.',
    publicSewerWithinBoundary:
      'A public sewer runs along the rear of the building footprint (recorded as adopted).',
    waterMainWithinBoundary: 'No water main is recorded within the boundary of the property.',
    buildOverAgreementRequired: 'No build-over agreement is required.',
  });

  const draftContract = await generateDraftContract({
    sellerName,
    sellerSolicitor: 'Whitcombe & Reed LLP',
    buyerName,
    buyerSolicitor: 'Interfluo Test LLP',
    propertyAddress,
    titleNumber: leaseholdTitleNumber,
    purchasePrice: '£238,000',
    depositPercentage: '10%',
    titleGuarantee: 'Full title guarantee',
    vacantPossession: true,
    specifiedIncumbrances: [
      'The matters contained in the registers of title under title number BRK382014 as at the date of this contract.',
      'The terms of the lease dated 1 March 1999 referred to in the registers.',
    ],
    specialConditions: [
      'Completion shall take place 28 days after exchange of contracts unless otherwise agreed in writing.',
    ],
  });

  return {
    name: 'leasehold-short-lease-and-escalation',
    description:
      'Focused leasehold scenario: 1999 lease with ~72 years remaining (below the 80-year lender floor), doubling ground rent (currently £800, halving the lender-acceptable population), £3,200 service charge arrears, and a Section 20 notice for major roof works (£6,800 estimated contribution). Tighter than leasehold-flat-with-issues - planted issues are limited so taxonomy attribution per code is unambiguous.',
    expectedFindings: [
      "Unexpired lease term at completion is approximately 72 years - below most lenders' minimum. Either request seller initiates a statutory extension under the 1993 Act or factor an extension into the timetable.",
      'Ground rent doubles every 10 years (currently £800, escalating to £1,600 in 2029, £3,200 in 2039). Major lenders refuse to lend on doubling ground rent without a deed of variation.',
      '£3,200 service charge arrears not yet resolved - request a retention from completion monies or undertaking to settle on completion.',
      'Section 20 major roof works notice served January 2026; estimated £6,800 contribution - request retention from completion monies or seller pre-payment.',
      'Routine confirmation that the Barclays charge will be redeemed on completion with DS1 to follow.',
    ],
    files: [
      { filename: '01-title-register.pdf', buffer: titleRegister },
      { filename: '02-lease.pdf', buffer: lease },
      { filename: '03-ta6-property-information.pdf', buffer: ta6 },
      { filename: '04-ta7-leasehold-information.pdf', buffer: ta7 },
      { filename: '05-ta10-fittings-and-contents.pdf', buffer: ta10 },
      { filename: '06-con29-local-authority.pdf', buffer: con29 },
      { filename: '07-drainage-and-water-search.pdf', buffer: drainage },
      { filename: '08-draft-contract.pdf', buffer: draftContract },
    ],
  };
}
