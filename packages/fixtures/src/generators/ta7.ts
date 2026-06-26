import { buildPdf, type Block } from '../pdf/builder';

export interface Ta7Input {
  propertyAddress: string;
  sellerName: string;
  landlordName: string;
  managingAgent: string;
  groundRent: string;
  groundRentReview: string;
  serviceCharge: string;
  serviceChargeArrears: string;
  reserveFund: string;
  section20Notices: string;
  buildingsInsurance: string;
  disputesWithLandlord: string;
}

export async function generateTa7(input: Ta7Input): Promise<Buffer> {
  const blocks: Block[] = [
    { kind: 'h1', text: 'TA7 — Leasehold Information Form (3rd edition)' },
    { kind: 'p', text: 'To be completed by the seller of a leasehold property.' },
    { kind: 'kv', key: 'Property', value: input.propertyAddress },
    { kind: 'kv', key: 'Seller', value: input.sellerName },
    { kind: 'rule' },

    { kind: 'h2', text: '1. The Landlord and managing agent' },
    { kind: 'qa', q: '1.1  Who is the landlord?', a: input.landlordName },
    { kind: 'qa', q: '1.2  Who is the managing agent?', a: input.managingAgent },
    { kind: 'qa', q: '1.3  Is there a recognised tenants association?', a: 'No.' },

    { kind: 'h2', text: '2. Ground rent' },
    { kind: 'qa', q: '2.1  What is the current ground rent payable?', a: input.groundRent },
    { kind: 'qa', q: '2.2  Are there any review provisions?', a: input.groundRentReview },
    { kind: 'qa', q: '2.3  Is ground rent paid up to date?', a: 'Yes, paid up to the most recent demand.' },

    { kind: 'page-break' },

    { kind: 'h2', text: '3. Service charge' },
    { kind: 'qa', q: '3.1  What is the current annual service charge?', a: input.serviceCharge },
    { kind: 'qa', q: '3.2  Are there any service charge arrears?', a: input.serviceChargeArrears },
    { kind: 'qa', q: '3.3  Is there a reserve / sinking fund?', a: input.reserveFund },

    { kind: 'h2', text: '4. Major works and Section 20 consultations' },
    {
      kind: 'qa',
      q: '4.1  Have you received any notice of major works requiring consultation under Section 20 of the Landlord and Tenant Act 1985?',
      a: input.section20Notices,
    },
    {
      kind: 'qa',
      q: '4.2  Are any further charges anticipated in the next 12 months?',
      a: 'See 4.1 above.',
    },

    { kind: 'page-break' },

    { kind: 'h2', text: '5. Buildings insurance' },
    { kind: 'qa', q: '5.1  Is the building insured by the landlord or the lessee?', a: input.buildingsInsurance },
    { kind: 'qa', q: '5.2  Have there been any claims in the last 3 years?', a: 'None.' },

    { kind: 'h2', text: '6. Disputes' },
    {
      kind: 'qa',
      q: '6.1  Are there any disputes between the seller and the landlord, managing agent, or other lessees in the block?',
      a: input.disputesWithLandlord,
    },

    { kind: 'h2', text: '7. Declaration' },
    {
      kind: 'p',
      text: `Signed by ${input.sellerName}. The seller confirms that the answers are correct to the best of their knowledge.`,
    },
  ];

  return buildPdf({ title: 'TA7 Leasehold Information Form', subject: 'Leasehold disclosure' }, blocks);
}
