import { generateCon29 } from '../generators/con29';
import { generateDraftContract } from '../generators/draft-contract';
import { generateDrainageSearch } from '../generators/drainage-search';
import { generateTa6 } from '../generators/ta6';
import { generateTa10 } from '../generators/ta10';
import { generateTitleRegister } from '../generators/title-register';
import type { ScenarioBundle } from './index';

export async function freeholdHouseClean(): Promise<ScenarioBundle> {
  const propertyAddress = '47 Beechwood Avenue, Sheffield S11 9EE';
  const sellerName = 'Robert and Susan Clark';
  const buyerName = 'David Okafor';
  const titleNumber = 'SYK552014';

  const titleRegister = await generateTitleRegister({
    titleNumber,
    tenure: 'Freehold',
    propertyAddress,
    registeredProprietor: sellerName,
    proprietorAddress: propertyAddress,
    pricePaid: '£284,500 on 22 September 2016',
    rights: ['Right of way on foot over the front path shown coloured brown on the title plan.'],
    restrictions: [],
    charges: [
      'REGISTERED CHARGE dated 22 September 2016 in favour of HALIFAX, a division of Bank of Scotland plc.',
    ],
    notices: [],
  });

  const ta6 = await generateTa6({
    propertyAddress,
    sellerName,
    boundaryOwnership:
      'The fence on the left is owned and maintained by the seller. The fence on the right is owned and maintained by the neighbour at 45 Beechwood Avenue.',
    disputes: 'No disputes or complaints.',
    alterationsDescription:
      'A timber summer house was installed in the rear garden in 2020. No structural alterations to the house itself.',
    alterationsPlanningPermission:
      'Planning permission not required (the summer house is below the permitted development threshold).',
    alterationsBuildingRegs: 'Building Regulations not applicable.',
    drainageMains: 'Yes — the property is connected to mains foul and surface water drainage.',
    occupiersOver17: [],
    flooding: 'No.',
    knotweed: 'No.',
    insurance: 'No claims in the last three years.',
    guarantees: [
      'FENSA certificate dated 12 May 2018 in respect of replacement double-glazed windows throughout (excluding the conservatory).',
      'NICEIC electrical installation certificate dated 8 June 2019.',
    ],
    rightsOfWay: 'None.',
    parking: 'Off-street parking on the front drive for two vehicles.',
  });

  const ta10 = await generateTa10({
    propertyAddress,
    sellerName,
    items: [
      { item: 'Fitted kitchen — units, worktops, sink, taps', status: 'Included' },
      { item: 'Integrated dishwasher', status: 'Included' },
      { item: 'Free-standing fridge / freezer', status: 'Included' },
      { item: 'Washing machine', status: 'Excluded' },
      { item: 'Bathroom suite', status: 'Included' },
      { item: 'Carpets throughout', status: 'Included' },
      { item: 'Curtains and blinds', status: 'Included' },
      { item: 'Garden shed', status: 'Included' },
      { item: 'Summer house', status: 'Included' },
      { item: 'TV aerial and satellite dish', status: 'Included' },
    ],
  });

  const con29 = await generateCon29({
    propertyAddress,
    localAuthority: 'Sheffield City Council',
    planningPermissions: [
      'No planning applications recorded against the property in the last 10 years.',
    ],
    planningEnforcement:
      'No enforcement notices, stop notices, or breach of condition notices recorded.',
    buildingRegsCertificates: [
      'Building Regulations completion certificate dated 14 June 2018 in respect of replacement windows (FENSA route).',
    ],
    listedBuilding: 'No — the property is not listed.',
    conservationArea: 'No — the property is not within a conservation area.',
    tpoTrees:
      'A single mature oak tree at the front of 49 Beechwood Avenue (the neighbour) is subject to TPO/2003/0142.',
    roadAdoption: 'Beechwood Avenue is a public highway maintainable at public expense.',
    publicRightsOfWay: 'None.',
    contaminatedLandNotice: 'No.',
    cpoNotices: 'None.',
  });

  const drainage = await generateDrainageSearch({
    propertyAddress,
    waterCompany: 'Yorkshire Water Services Limited',
    foulConnectedToMains: 'Yes — the property is connected to the public foul sewer.',
    surfaceConnectedToMains: 'Yes — the property is connected to the public surface water sewer.',
    publicSewerWithinBoundary: 'No public sewer is recorded within the boundary of the property.',
    waterMainWithinBoundary: 'No water main is recorded within the boundary of the property.',
    buildOverAgreementRequired: 'No build-over agreement is required.',
  });

  const draftContract = await generateDraftContract({
    sellerName,
    sellerSolicitor: 'Penfold Solicitors',
    buyerName,
    buyerSolicitor: 'Interfluo Test LLP',
    propertyAddress,
    titleNumber,
    purchasePrice: '£365,000',
    depositPercentage: '10%',
    titleGuarantee: 'Full title guarantee',
    vacantPossession: true,
    specifiedIncumbrances: [
      'The matters contained in the registers of title under title number SYK552014 as at the date of this contract.',
    ],
    specialConditions: [
      'Completion shall take place 21 days after exchange of contracts unless otherwise agreed in writing.',
    ],
  });

  return {
    name: 'freehold-house-clean',
    description:
      'A straightforward freehold sale of a Sheffield house with no material issues. Used as a control — Interfluo should raise routine confirmatory enquiries and avoid hallucinating problems that do not exist.',
    expectedFindings: [
      'Standard confirmation that the FENSA / NICEIC certificates referred to in the TA6 will be handed over on completion.',
      'Confirmation that the summer house is included in the sale per TA10 and falls within permitted development.',
      'Routine confirmation of vacant possession on the contractual completion date.',
      "The TPO on the neighbour's tree at 49 Beechwood Avenue should be noted in the Report on Title but does not require an enquiry — it does not bind the property being purchased.",
      'No material risks should be flagged; the pack is intentionally clean.',
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
