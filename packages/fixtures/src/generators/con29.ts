import { type Block, buildPdf } from '../pdf/builder';

export interface Con29Input {
  propertyAddress: string;
  localAuthority: string;
  planningPermissions: string[];
  planningEnforcement: string;
  buildingRegsCertificates: string[];
  listedBuilding: string;
  conservationArea: string;
  tpoTrees: string;
  roadAdoption: string;
  publicRightsOfWay: string;
  contaminatedLandNotice: string;
  cpoNotices: string;
}

export async function generateCon29(input: Con29Input): Promise<Buffer> {
  const blocks: Block[] = [
    { kind: 'h1', text: 'CON29 — Enquiries of the Local Authority' },
    { kind: 'kv', key: 'Property', value: input.propertyAddress },
    { kind: 'kv', key: 'Local Authority', value: input.localAuthority },
    { kind: 'kv', key: 'Date of search', value: new Date().toLocaleDateString('en-GB') },
    { kind: 'rule' },

    { kind: 'h2', text: '1. Planning and Building Decisions and Pending Applications' },
    {
      kind: 'qa',
      q: '1.1(a)  Planning permissions granted',
      a:
        input.planningPermissions.length > 0
          ? input.planningPermissions.join('\n')
          : 'None recorded against the property.',
    },
    { kind: 'qa', q: '1.1(b)  Listed building consent', a: input.listedBuilding },
    { kind: 'qa', q: '1.1(c)  Conservation area consent', a: input.conservationArea },
    {
      kind: 'qa',
      q: '1.1(d)  Building Regulations approvals',
      a:
        input.buildingRegsCertificates.length > 0
          ? input.buildingRegsCertificates.join('\n')
          : 'None recorded for this property in the last 10 years.',
    },
    {
      kind: 'qa',
      q: '1.1(e)  Building Regulations completion certificates',
      a: input.buildingRegsCertificates.length > 0 ? 'See above.' : 'None recorded.',
    },

    { kind: 'h2', text: '2. Planning Designations and Proposals' },
    { kind: 'qa', q: '2.1  Is the property in a conservation area?', a: input.conservationArea },
    {
      kind: 'qa',
      q: '2.2  Are any trees subject to a Tree Preservation Order?',
      a: input.tpoTrees,
    },

    { kind: 'page-break' },

    { kind: 'h2', text: '3. Roads' },
    {
      kind: 'qa',
      q: '3.1  Are the roads, footways, and footpaths abutting the property maintainable at public expense?',
      a: input.roadAdoption,
    },
    { kind: 'qa', q: '3.2  Public rights of way over the property?', a: input.publicRightsOfWay },

    { kind: 'h2', text: '4. Notices' },
    {
      kind: 'qa',
      q: '4.1  Has any of the following notices been served on the property: enforcement notice, stop notice, breach of condition notice?',
      a: input.planningEnforcement,
    },
    { kind: 'qa', q: '4.2  Compulsory purchase notices?', a: input.cpoNotices },

    { kind: 'h2', text: '5. Contaminated Land' },
    {
      kind: 'qa',
      q: '5.1  Has the property been identified by the Council as contaminated land under Part IIA of the Environmental Protection Act 1990?',
      a: input.contaminatedLandNotice,
    },

    { kind: 'rule' },
    {
      kind: 'p',
      text: 'NOTE: This search reflects the records of the local authority at the date stated. It does not warrant that the records are complete or that the matters disclosed are exhaustive.',
    },
  ];

  return buildPdf(
    { title: 'CON29 Local Authority Search', subject: 'Local authority search' },
    blocks,
  );
}
