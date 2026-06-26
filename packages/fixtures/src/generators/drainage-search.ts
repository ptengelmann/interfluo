import { buildPdf, type Block } from '../pdf/builder';

export interface DrainageInput {
  propertyAddress: string;
  waterCompany: string;
  foulConnectedToMains: string;
  surfaceConnectedToMains: string;
  publicSewerWithinBoundary: string;
  waterMainWithinBoundary: string;
  buildOverAgreementRequired: string;
  notes?: string;
}

export async function generateDrainageSearch(input: DrainageInput): Promise<Buffer> {
  const blocks: Block[] = [
    { kind: 'h1', text: 'CON29DW — Drainage and Water Enquiry' },
    { kind: 'kv', key: 'Property', value: input.propertyAddress },
    { kind: 'kv', key: 'Water company', value: input.waterCompany },
    { kind: 'kv', key: 'Date of search', value: new Date().toLocaleDateString('en-GB') },
    { kind: 'rule' },

    { kind: 'h2', text: '1. Foul water drainage' },
    {
      kind: 'qa',
      q: '1.1  Is the property connected to the public foul sewer?',
      a: input.foulConnectedToMains,
    },

    { kind: 'h2', text: '2. Surface water drainage' },
    {
      kind: 'qa',
      q: '2.1  Is the property connected to the public surface water sewer?',
      a: input.surfaceConnectedToMains,
    },

    { kind: 'h2', text: '3. Sewers within boundaries' },
    {
      kind: 'qa',
      q: '3.1  Does foul or surface water from the property drain to a public sewer?',
      a: input.foulConnectedToMains,
    },
    {
      kind: 'qa',
      q: '3.2  Are there any public sewers within the boundaries of the property?',
      a: input.publicSewerWithinBoundary,
    },
    {
      kind: 'qa',
      q: '3.3  Is a build-over agreement in place or required for any structure crossing a public sewer?',
      a: input.buildOverAgreementRequired,
    },

    { kind: 'page-break' },

    { kind: 'h2', text: '4. Water supply' },
    {
      kind: 'qa',
      q: '4.1  Is the property connected to the public water main?',
      a: 'Yes, the property is connected to the public water main maintained by the water company named above.',
    },
    {
      kind: 'qa',
      q: '4.2  Are there any water mains within the boundaries of the property?',
      a: input.waterMainWithinBoundary,
    },

    input.notes ? { kind: 'h2', text: '5. Additional notes' } : { kind: 'space', height: 0 },
    input.notes ? { kind: 'p', text: input.notes } : { kind: 'space', height: 0 },

    { kind: 'rule' },
    {
      kind: 'p',
      text: 'IMPORTANT: This report is based on the water and sewerage records held by the company on the date of issue. Practical connections at the property should be confirmed by inspection.',
    },
  ];

  return buildPdf({ title: 'CON29DW Drainage and Water Search', subject: 'Drainage and water search' }, blocks);
}
