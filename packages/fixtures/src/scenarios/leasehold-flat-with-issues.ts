import { generateCon29 } from '../generators/con29';
import { generateDraftContract } from '../generators/draft-contract';
import { generateDrainageSearch } from '../generators/drainage-search';
import { generateLease } from '../generators/lease';
import { generateMortgageOffer } from '../generators/mortgage-offer';
import { generateTa6 } from '../generators/ta6';
import { generateTa7 } from '../generators/ta7';
import { generateTa10 } from '../generators/ta10';
import { generateTitleRegister } from '../generators/title-register';
import type { ScenarioBundle } from './index';

export async function leaseholdFlatWithIssues(): Promise<ScenarioBundle> {
  const propertyAddress = 'Flat 3, 24 Wynyard Terrace, London SE17 3JL';
  const sellerName = 'Margaret Wells';
  const buyerName = 'Anita Patel';
  const titleNumber = 'TGL412903';
  const parentFreeholdTitle = 'NGL000123';

  const titleRegister = await generateTitleRegister({
    titleNumber,
    tenure: 'Leasehold',
    propertyAddress,
    registeredProprietor: sellerName,
    proprietorAddress: propertyAddress,
    pricePaid: '£295,000 on 14 March 2014',
    parentFreeholdTitle,
    leaseDetails: { dated: '1 January 1998', term: '99 years from 1 January 1998' },
    rights: [
      'Right of way on foot and with vehicles over the access road shown coloured brown on the title plan.',
      'Right of support and shelter from the remainder of the Building.',
    ],
    restrictions: [
      `No disposition by the proprietor of the registered estate is to be registered without a written consent signed by the proprietor for the time being of the freehold title ${parentFreeholdTitle}.`,
    ],
    charges: [
      'REGISTERED CHARGE dated 14 March 2014 in favour of NATIONWIDE BUILDING SOCIETY of Nationwide House, Pipers Way, Swindon SN38 1NW.',
    ],
    notices: [
      'AGREEMENT dated 12 June 1998 referred to above contains restrictive covenants by the Lessee. The said covenants bind the Property.',
    ],
  });

  const lease = await generateLease({
    propertyAddress,
    parentTitleNumber: parentFreeholdTitle,
    dateOfLease: '1 January 1998',
    termYears: 99,
    termStartDate: '1 January 1998',
    initialGroundRent: '£250 per annum',
    groundRentReviewClause:
      'The Ground Rent shall double on each 25th anniversary of the commencement of the term, with the first review having effect from 1 January 2023, the second from 1 January 2048, and the third from 1 January 2073. Any reviewed Ground Rent shall be payable from the relevant review date whether or not a demand has been issued.',
    serviceChargeMechanism:
      'The Lessee shall pay to the Lessor 12.5% (one-eighth) of the Service Costs incurred in any Service Charge Year. Service Charge demands shall include any sum the Lessor reasonably anticipates contributing to a sinking fund, but no sinking fund is presently in operation.',
    alterationsRestriction:
      '4.3 The Lessee shall not without the prior written consent of the Lessor (such consent not to be unreasonably withheld) make any structural alterations to or extensions of the Property, nor any alterations to the external appearance.',
    alienationRestriction:
      '4.4 The Lessee shall not without the prior written consent of the Lessor sublet the whole or any part of the Property for a term of less than six months. Short-term lettings via online platforms are expressly prohibited. Assignment of the whole of the Property is permitted upon notice to the Lessor and payment of a registration fee of £100 plus VAT.',
    petsClause:
      '4.5 The Lessee shall not keep any dog, cat, or other animal at the Property without the prior written consent of the Lessor, such consent not to be unreasonably withheld.',
    forfeitureClause:
      '7.1 If the Lessee fails to pay the rent or to perform any of the Lessee covenants, and such failure continues for 21 days after written notice, the Lessor may re-enter the Property and the term shall thereupon determine.',
  });

  const ta6 = await generateTa6({
    propertyAddress,
    sellerName,
    boundaryOwnership:
      'The seller believes the boundary on the left is the responsibility of the neighbour at Flat 2, but is not certain.',
    disputes:
      'There was a complaint from the leaseholder of Flat 4 in 2022 about noise from the kitchen extension works. The matter was resolved informally.',
    alterationsDescription:
      'A rear kitchen extension was constructed in 2019 to enlarge the kitchen by approximately 12 square metres.',
    alterationsPlanningPermission:
      'No planning permission was obtained — the builder advised that the works fell within permitted development.',
    alterationsBuildingRegs:
      'No Building Regulations approval was obtained. No completion certificate has been issued.',
    drainageMains: 'Yes — the property is connected to the mains foul drainage.',
    occupiersOver17: [],
    flooding: 'No.',
    knotweed: 'No.',
    insurance:
      'A claim was made in 2021 for water damage from a leak in the flat above. The claim was settled by the buildings insurer for approximately £4,200.',
    guarantees: [
      'NHBC certificate has long expired. No FENSA or electrical guarantees are available.',
    ],
    rightsOfWay: 'Right of way on foot over the access road shown on the title plan.',
    parking: 'Allocated parking bay number 3 in the residents car park.',
    servicesNotes: 'Gas, electricity, mains water and broadband all connected.',
  });

  const ta7 = await generateTa7({
    propertyAddress,
    sellerName,
    landlordName:
      'Wynyard Terrace Freehold Limited (registered office: 12 St James Square, London SW1Y 4LB).',
    managingAgent: 'Capstone Block Management Limited (telephone 020 7946 0210).',
    groundRent:
      '£500 per annum. (The lease provides for the ground rent to double on each 25th anniversary; the first review took effect on 1 January 2023, doubling the original £250.)',
    groundRentReview:
      'The lease provides for the ground rent to double on each 25th anniversary of the term commencement (1 January 1998). The next review is due on 1 January 2048.',
    serviceCharge:
      '£1,840 per annum for the current service charge year. Service charge for the prior year was £1,720.',
    serviceChargeArrears: 'None outstanding.',
    reserveFund: 'There is no reserve / sinking fund.',
    section20Notices:
      "A Section 20 consultation notice was issued by the managing agent on 4 April 2026 in respect of major roof works. The Lessor's preliminary estimate of the cost attributable to this flat is approximately £8,400. The consultation period is ongoing.",
    buildingsInsurance:
      'Buildings insurance is arranged by the Landlord; the premium is recharged through the service charge.',
    disputesWithLandlord:
      'There is a continuing dispute with the managing agent regarding the basis for service charge apportionment in 2024 (the seller disputes whether the cost of replacing entrance door entry phones should fall to the lessees).',
  });

  const ta10 = await generateTa10({
    propertyAddress,
    sellerName,
    items: [
      { item: 'Fitted kitchen — units, worktops, sink, taps', status: 'Included' },
      { item: 'Integrated dishwasher', status: 'Included' },
      { item: 'Free-standing fridge / freezer', status: 'Excluded' },
      { item: 'Washing machine', status: 'Included' },
      { item: 'Bathroom suite (bath, basin, WC)', status: 'Included' },
      {
        item: 'Curtains and curtain rails — living room',
        status: 'Excluded',
        notes: 'The seller wishes to take these.',
      },
      { item: 'Carpets throughout', status: 'Included' },
      { item: 'Light fittings (excluding chandelier in hallway)', status: 'Included' },
      {
        item: 'Hallway chandelier',
        status: 'For sale (extra)',
        notes: '£600 if buyer wishes to acquire.',
      },
      { item: 'Garden shed (in the allocated patio area)', status: 'None at property' },
      { item: 'Storage cupboard contents', status: 'None at property' },
      { item: 'TV aerial', status: 'Included' },
    ],
  });

  const con29 = await generateCon29({
    propertyAddress,
    localAuthority: 'London Borough of Southwark',
    planningPermissions: [
      'No planning permissions have been granted for this address in the last 10 years. (See enforcement section below.)',
    ],
    planningEnforcement:
      'A Planning Contravention Notice was served on 7 February 2025 under section 171C of the Town and Country Planning Act 1990, requiring information regarding a rear extension constructed in 2019. No formal enforcement notice has yet been issued. The matter is recorded as "under investigation".',
    buildingRegsCertificates: [],
    listedBuilding: 'No — the property is not listed.',
    conservationArea: 'No — the property is not within a designated conservation area.',
    tpoTrees: 'No tree preservation orders affect the property.',
    roadAdoption: 'Wynyard Terrace is a public highway maintainable at public expense.',
    publicRightsOfWay: 'None.',
    contaminatedLandNotice: 'The Council has not designated this property as contaminated land.',
    cpoNotices: 'None.',
  });

  const drainage = await generateDrainageSearch({
    propertyAddress,
    waterCompany: 'Thames Water Utilities Limited',
    foulConnectedToMains:
      'NO. The property is recorded as draining via a private foul sewer that ultimately connects to the public sewer beyond the boundary of the development. Maintenance of the private sewer is the responsibility of the lessees of the building.',
    surfaceConnectedToMains:
      'Yes — surface water from the property is recorded as draining to the public surface water sewer.',
    publicSewerWithinBoundary:
      'No public sewer is recorded within the boundary of the property. A private foul sewer runs beneath the rear courtyard.',
    waterMainWithinBoundary: 'No water main is recorded within the boundary of the property.',
    buildOverAgreementRequired:
      'A build-over agreement may have been required in respect of the 2019 rear kitchen extension which the records show crosses the line of the private foul sewer. No such agreement appears on file.',
    notes:
      "The discrepancy between the answer given by the seller at question 8.2 of the TA6 (mains foul drainage) and the position recorded here should be raised with the seller's solicitor for clarification.",
  });

  const mortgageOffer = await generateMortgageOffer({
    borrower: buyerName,
    propertyAddress,
    lender: 'Nationwide Building Society',
    offerReference: 'NW-MA-2026-44128',
    loanAmount: '£260,000',
    loanTerm: '30 years',
    interestRateType: '5-year fixed',
    initialPeriod: '5 years at 4.39%',
    valuationAmount: '£325,000',
    valuationDate: '14 May 2026',
    offerExpiryDate: '14 November 2026',
    specialConditions: [
      'A satisfactory indemnity policy is required in respect of the rear kitchen extension constructed in 2019 in the absence of planning permission, building regulations approval, and any necessary build-over agreement. The conveyancer must obtain and certify the policy prior to completion.',
      'The conveyancer must satisfy themselves that the unexpired term of the lease at completion exceeds 80 years. If the unexpired term is below 80 years, this offer is withdrawn.',
      "The conveyancer must confirm that the ground rent is not subject to onerous review provisions as defined in the UK Finance Mortgage Lenders' Handbook, Part 2 (Nationwide entries).",
      'The conveyancer must confirm written consent of the proprietor of title NGL000123 to the registration of the transfer, in compliance with the restriction on the Proprietorship Register of title TGL412903.',
    ],
  });

  const draftContract = await generateDraftContract({
    sellerName,
    sellerSolicitor: 'Halsbury & Co LLP',
    buyerName,
    buyerSolicitor: 'Interfluo Test LLP',
    propertyAddress,
    titleNumber,
    purchasePrice: '£325,000',
    depositPercentage: '10%',
    titleGuarantee: 'Full title guarantee',
    vacantPossession: true,
    specifiedIncumbrances: [
      'The matters contained in the registers of title under title number TGL412903 as at the date of this contract.',
      'The covenants, conditions, restrictions and other matters contained in the Lease dated 1 January 1998.',
    ],
    specialConditions: [
      'The Property is sold subject to and with the benefit of the Lease.',
      'The Seller does not warrant compliance with planning or building regulations in respect of the rear extension referred to in the TA6.',
      'Completion shall take place 28 days after exchange of contracts unless otherwise agreed in writing.',
    ],
  });

  return {
    name: 'leasehold-flat-with-issues',
    description:
      "A leasehold flat purchase in inner London with a coherent set of issues across title, lease, planning, drainage, and lender conditions. Designed to exercise the AI's ability to cross-reference facts across documents and produce material enquiries.",
    expectedFindings: [
      "Restriction on the title requires the freeholder's written consent for any disposition — the buyer's solicitor must obtain that consent before completion, and Nationwide's special condition 4 also requires it.",
      'The lease term commenced 1 January 1998 for 99 years, leaving roughly 71 years unexpired. This is below the 80-year mark required by Nationwide special condition 2 — the lease must be extended or the offer falls away.',
      "Ground rent doubles every 25 years (rose from £250 to £500 in 2023, will rise to £1,000 in 2048 and £2,000 in 2073). Lender will treat this as onerous under the UK Finance Mortgage Lenders' Handbook — Nationwide special condition 3 flags it directly.",
      'A rear kitchen extension was built in 2019 without planning permission or Building Regulations approval (TA6 4.2 and 4.3). A Planning Contravention Notice was served in February 2025 (CON29 part 4.1) — formal enforcement remains possible. Nationwide special condition 1 requires an indemnity policy.',
      "The drainage and water search records the property as draining via a private foul sewer, contradicting the seller's answer at TA6 question 8.2 that the property is on mains foul drainage. The discrepancy must be clarified.",
      'The 2019 extension crosses the line of a private foul sewer; no build-over agreement appears on file. This compounds the planning / building regs / indemnity issue.',
      'A Section 20 consultation has been issued for major roof works, with an estimated £8,400 contribution attributable to this flat. The seller should be asked to contribute or for a retention from the purchase price.',
      "No reserve / sinking fund exists for the building, increasing the buyer's exposure to lumpy future service charge demands.",
      'There is a continuing dispute with the managing agent over service charge apportionment in 2024 — disclosable and may bind the buyer.',
      "A water-damage insurance claim was paid in 2021 (~£4,200) — affects future premium / declarations and may need disclosure to the buyer's insurer.",
      'TA10 item "Hallway chandelier" is marked For sale (extra) at £600 — buyer should decide whether to acquire and a separate sale memorandum may be needed.',
    ],
    files: [
      { filename: '01-title-register.pdf', buffer: titleRegister },
      { filename: '02-lease.pdf', buffer: lease },
      { filename: '03-ta6-property-information.pdf', buffer: ta6 },
      { filename: '04-ta7-leasehold-information.pdf', buffer: ta7 },
      { filename: '05-ta10-fittings-and-contents.pdf', buffer: ta10 },
      { filename: '06-con29-local-authority.pdf', buffer: con29 },
      { filename: '07-drainage-and-water-search.pdf', buffer: drainage },
      { filename: '08-mortgage-offer.pdf', buffer: mortgageOffer },
      { filename: '09-draft-contract.pdf', buffer: draftContract },
    ],
  };
}
