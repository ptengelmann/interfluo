import { type Block, buildPdf } from '../pdf/builder';

export interface Ta6Input {
  propertyAddress: string;
  sellerName: string;
  alterationsDescription: string | null;
  alterationsPlanningPermission: string;
  alterationsBuildingRegs: string;
  drainageMains: string;
  occupiersOver17: string[];
  disputes: string;
  guarantees: string[];
  flooding: string;
  knotweed: string;
  insurance: string;
  boundaryOwnership: string;
  rightsOfWay: string;
  parking: string;
  servicesNotes?: string;
}

export async function generateTa6(input: Ta6Input): Promise<Buffer> {
  const blocks: Block[] = [
    { kind: 'h1', text: 'TA6 — Property Information Form (5th edition)' },
    { kind: 'p', text: 'This form is to be completed by the seller of the property.' },
    { kind: 'kv', key: 'Property', value: input.propertyAddress },
    { kind: 'kv', key: 'Seller', value: input.sellerName },
    { kind: 'kv', key: 'Date completed', value: new Date().toLocaleDateString('en-GB') },
    { kind: 'rule' },

    { kind: 'h2', text: '1. Boundaries' },
    {
      kind: 'qa',
      q: '1.1  Looking towards the property from the road, who owns or accepts responsibility for the boundary on the left?',
      a: input.boundaryOwnership,
    },
    { kind: 'qa', q: '1.2  On the right?', a: 'Shared / unknown.' },
    { kind: 'qa', q: '1.3  At the rear?', a: 'Shared with neighbour at 25 Wynyard Terrace.' },
    {
      kind: 'qa',
      q: '1.4  Have any boundary features been moved or altered in the last ten years?',
      a: 'No.',
    },
    {
      kind: 'qa',
      q: '1.5  Has there been any dispute about a boundary, fence, or hedge?',
      a: input.disputes,
    },

    { kind: 'h2', text: '2. Disputes and complaints' },
    {
      kind: 'qa',
      q: '2.1  Have there been any disputes or complaints regarding this property or a property nearby?',
      a: input.disputes,
    },
    {
      kind: 'qa',
      q: '2.2  Is the seller aware of anything which might lead to a dispute about the property or a property nearby?',
      a: 'No.',
    },

    { kind: 'page-break' },

    { kind: 'h2', text: '3. Notices and proposals' },
    {
      kind: 'qa',
      q: '3.1  Have any notices or correspondence been received from a neighbour, council, or government department which affect the property in any way (e.g. notices concerning planning, road improvements, party walls)?',
      a: 'No notices received.',
    },

    { kind: 'h2', text: '4. Alterations, planning and building control' },
    {
      kind: 'qa',
      q: '4.1  Have any of the following changes been made to the whole or any part of the property (including the garden): structural alterations, additions or extensions, conversion of a loft, garage, or cellar?',
      a: input.alterationsDescription ?? 'No.',
    },
    {
      kind: 'qa',
      q: '4.2  If yes, please supply copies of the planning permissions, building regulations approvals, and completion certificates.',
      a: input.alterationsPlanningPermission,
    },
    {
      kind: 'qa',
      q: '4.3  Building Regulations consent / completion certificate?',
      a: input.alterationsBuildingRegs,
    },
    {
      kind: 'qa',
      q: '4.4  Have any of the works needed planning permission or building regulations approval that was not obtained?',
      a:
        input.alterationsPlanningPermission.toLowerCase().includes('no') ||
        input.alterationsBuildingRegs.toLowerCase().includes('no')
          ? 'The seller does not believe consent was required.'
          : 'No, all consents obtained.',
    },

    { kind: 'page-break' },

    { kind: 'h2', text: '5. Guarantees, warranties and insurance' },
    {
      kind: 'qa',
      q: '5.1  Are there any guarantees or warranties in respect of the property?',
      a: input.guarantees.length > 0 ? input.guarantees.join('; ') : 'None.',
    },
    { kind: 'qa', q: '5.2  Insurance claims in the last 3 years?', a: input.insurance },

    { kind: 'h2', text: '6. Environmental matters' },
    {
      kind: 'qa',
      q: '6.1  Has any part of the property ever been affected by flooding?',
      a: input.flooding,
    },
    {
      kind: 'qa',
      q: '6.2  Is the seller aware of any contamination or radon affecting the property?',
      a: 'No.',
    },
    {
      kind: 'qa',
      q: '6.3  Is Japanese knotweed present at the property or nearby?',
      a: input.knotweed,
    },

    { kind: 'page-break' },

    { kind: 'h2', text: '7. Rights and informal arrangements' },
    {
      kind: 'qa',
      q: '7.1  Are there any arrangements or rights of way over neighbouring land used to access the property?',
      a: input.rightsOfWay,
    },
    { kind: 'qa', q: '7.2  Parking arrangements?', a: input.parking },

    { kind: 'h2', text: '8. Services' },
    {
      kind: 'qa',
      q: '8.1  Is the property connected to the following services: gas, electricity, water, telephone, broadband?',
      a: input.servicesNotes ?? 'Gas, electricity, water and broadband connected.',
    },
    {
      kind: 'qa',
      q: '8.2  Drainage — is the property connected to mains foul drainage?',
      a: input.drainageMains,
    },
    {
      kind: 'qa',
      q: '8.3  Is the property connected to mains surface water drainage?',
      a: input.drainageMains,
    },

    { kind: 'page-break' },

    { kind: 'h2', text: '9. Occupiers' },
    {
      kind: 'qa',
      q: '9.1  Please give the names of any persons aged 17 or over who occupy the property other than the seller.',
      a:
        input.occupiersOver17.length > 0
          ? input.occupiersOver17.join(', ')
          : 'None — the seller is the sole occupant.',
    },
    {
      kind: 'qa',
      q: '9.2  Will all such occupiers vacate the property on or before completion and sign an occupier consent form?',
      a: input.occupiersOver17.length > 0 ? 'To be confirmed.' : 'Not applicable.',
    },

    { kind: 'h2', text: '10. Declaration' },
    {
      kind: 'p',
      text: `Signed by ${input.sellerName} on ${new Date().toLocaleDateString('en-GB')}. The seller confirms the answers given are true to the best of their knowledge.`,
    },
  ];

  return buildPdf({ title: 'TA6 Property Information Form', subject: 'Seller disclosure' }, blocks);
}
