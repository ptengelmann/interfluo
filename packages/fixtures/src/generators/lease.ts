import { type Block, buildPdf } from '../pdf/builder';

export interface LeaseInput {
  propertyAddress: string;
  parentTitleNumber: string;
  dateOfLease: string;
  termYears: number;
  termStartDate: string;
  initialGroundRent: string;
  groundRentReviewClause: string;
  serviceChargeMechanism: string;
  alterationsRestriction: string;
  alienationRestriction: string;
  petsClause: string;
  forfeitureClause: string;
}

export async function generateLease(input: LeaseInput): Promise<Buffer> {
  const blocks: Block[] = [
    { kind: 'h1', text: 'LEASE' },
    { kind: 'p', text: `Dated ${input.dateOfLease}` },
    { kind: 'p', text: 'PARTIES' },
    { kind: 'p', text: '(1) The LESSOR: as named in the Particulars below.' },
    { kind: 'p', text: '(2) The LESSEE: as named in the Particulars below.' },
    { kind: 'rule' },
    { kind: 'h2', text: 'PARTICULARS' },
    { kind: 'kv', key: 'Property', value: input.propertyAddress },
    { kind: 'kv', key: 'Title number (Lessor)', value: input.parentTitleNumber },
    { kind: 'kv', key: 'Term', value: `${input.termYears} years from ${input.termStartDate}` },
    { kind: 'kv', key: 'Initial Ground Rent', value: input.initialGroundRent },
    { kind: 'page-break' },

    { kind: 'h2', text: '1. DEFINITIONS' },
    {
      kind: 'p',
      text: '"Building" means the block of which the Property forms part. "Common Parts" means the parts of the Building not let to any lessee. "Service Charge" has the meaning given in clause 5.',
    },

    { kind: 'h2', text: '2. DEMISE AND TERM' },
    {
      kind: 'p',
      text: `The Lessor demises the Property to the Lessee TO HOLD the same for a term of ${input.termYears} years from and including ${input.termStartDate} YIELDING AND PAYING during the term the rents reserved by clauses 3 and 5.`,
    },

    { kind: 'h2', text: '3. GROUND RENT' },
    {
      kind: 'p',
      text: `The Lessee shall pay to the Lessor the Initial Ground Rent of ${input.initialGroundRent} payable annually in advance on each Rent Payment Date.`,
    },
    { kind: 'p', text: input.groundRentReviewClause },

    { kind: 'page-break' },

    { kind: 'h2', text: '4. LESSEE COVENANTS' },
    { kind: 'h3', text: 'Maintenance and use' },
    {
      kind: 'p',
      text: '4.1 The Lessee shall keep the interior of the Property in good and substantial repair and condition.',
    },
    {
      kind: 'p',
      text: '4.2 The Lessee shall use the Property only as a single private residence in the occupation of one household.',
    },
    { kind: 'h3', text: 'Alterations' },
    { kind: 'p', text: input.alterationsRestriction },
    { kind: 'h3', text: 'Alienation (assignment, subletting, charging)' },
    { kind: 'p', text: input.alienationRestriction },
    { kind: 'h3', text: 'Pets' },
    { kind: 'p', text: input.petsClause },

    { kind: 'page-break' },

    { kind: 'h2', text: '5. SERVICE CHARGE' },
    { kind: 'p', text: input.serviceChargeMechanism },
    {
      kind: 'p',
      text: 'Service Charge demands shall be issued by the Lessor or its managing agent and shall be supported by certified accounts in accordance with the Landlord and Tenant Act 1985.',
    },

    { kind: 'h2', text: '6. LESSOR COVENANTS' },
    {
      kind: 'p',
      text: '6.1 The Lessor covenants to insure the Building against the Insured Risks for the full reinstatement value and to maintain the structure and Common Parts.',
    },
    {
      kind: 'p',
      text: '6.2 The Lessor covenants with the Lessee to enforce the covenants on the part of the lessees in every other Lease of a flat in the Building so as to ensure mutual benefit.',
    },

    { kind: 'page-break' },

    { kind: 'h2', text: '7. FORFEITURE' },
    { kind: 'p', text: input.forfeitureClause },

    { kind: 'h2', text: '8. NOTICES' },
    {
      kind: 'p',
      text: 'Any notice under this Lease shall be in writing and may be served by first-class post to the Lessor at the address given in the Particulars or to the Lessee at the Property.',
    },

    { kind: 'h2', text: '9. EXECUTED AS A DEED' },
    { kind: 'p', text: `Executed as a deed by the parties on ${input.dateOfLease}.` },
  ];

  return buildPdf({ title: 'Lease', subject: 'Residential leasehold demise' }, blocks);
}
