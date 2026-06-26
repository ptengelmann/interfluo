import { buildPdf, type Block } from '../pdf/builder';

export interface MortgageOfferInput {
  borrower: string;
  propertyAddress: string;
  lender: string;
  offerReference: string;
  loanAmount: string;
  loanTerm: string;
  interestRateType: string;
  initialPeriod: string;
  valuationAmount: string;
  valuationDate: string;
  offerExpiryDate: string;
  specialConditions: string[];
}

export async function generateMortgageOffer(input: MortgageOfferInput): Promise<Buffer> {
  const blocks: Block[] = [
    { kind: 'h1', text: `${input.lender} — Mortgage Offer` },
    { kind: 'p', text: `Offer reference ${input.offerReference}` },
    { kind: 'rule' },

    { kind: 'h2', text: '1. Borrower and property' },
    { kind: 'kv', key: 'Borrower', value: input.borrower },
    { kind: 'kv', key: 'Property', value: input.propertyAddress },

    { kind: 'h2', text: '2. Loan terms' },
    { kind: 'kv', key: 'Loan amount', value: input.loanAmount },
    { kind: 'kv', key: 'Loan term', value: input.loanTerm },
    { kind: 'kv', key: 'Rate type', value: input.interestRateType },
    { kind: 'kv', key: 'Initial period', value: input.initialPeriod },
    { kind: 'kv', key: 'Offer expires', value: input.offerExpiryDate },

    { kind: 'h2', text: '3. Valuation' },
    { kind: 'kv', key: 'Valuation amount', value: input.valuationAmount },
    { kind: 'kv', key: 'Valuation date', value: input.valuationDate },

    { kind: 'page-break' },

    { kind: 'h2', text: '4. Special Conditions' },
    {
      kind: 'p',
      text: 'The following special conditions must be satisfied before completion. The conveyancer must confirm satisfaction in writing.',
    },
  ];

  input.specialConditions.forEach((c, i) => {
    blocks.push({ kind: 'h3', text: `Special Condition ${i + 1}` });
    blocks.push({ kind: 'p', text: c });
  });

  blocks.push({ kind: 'rule' });
  blocks.push({
    kind: 'p',
    text: 'This offer is made subject to the UK Finance Mortgage Lenders\' Handbook in force at the date of completion.',
  });

  return buildPdf({ title: 'Mortgage Offer', subject: 'Mortgage offer' }, blocks);
}
