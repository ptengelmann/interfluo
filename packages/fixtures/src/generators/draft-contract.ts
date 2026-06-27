import { type Block, buildPdf } from '../pdf/builder';

export interface DraftContractInput {
  sellerName: string;
  sellerSolicitor: string;
  buyerName: string;
  buyerSolicitor: string;
  propertyAddress: string;
  titleNumber: string;
  purchasePrice: string;
  depositPercentage: string;
  titleGuarantee: 'Full title guarantee' | 'Limited title guarantee';
  vacantPossession: boolean;
  specifiedIncumbrances: string[];
  specialConditions: string[];
}

export async function generateDraftContract(input: DraftContractInput): Promise<Buffer> {
  const blocks: Block[] = [
    { kind: 'h1', text: 'DRAFT CONTRACT FOR SALE' },
    {
      kind: 'p',
      text: 'Incorporating the Standard Conditions of Sale (5th edition — 2018 revision).',
    },
    { kind: 'rule' },

    { kind: 'h2', text: 'PARTICULARS' },
    {
      kind: 'kv',
      key: 'Seller',
      value: `${input.sellerName} (acting through ${input.sellerSolicitor})`,
    },
    {
      kind: 'kv',
      key: 'Buyer',
      value: `${input.buyerName} (acting through ${input.buyerSolicitor})`,
    },
    { kind: 'kv', key: 'Property', value: input.propertyAddress },
    { kind: 'kv', key: 'Title number', value: input.titleNumber },
    { kind: 'kv', key: 'Purchase price', value: input.purchasePrice },
    { kind: 'kv', key: 'Deposit', value: `${input.depositPercentage} of the purchase price` },
    { kind: 'kv', key: 'Title guarantee', value: input.titleGuarantee },
    {
      kind: 'kv',
      key: 'Vacant possession',
      value: input.vacantPossession ? 'Yes' : 'No — subject to existing tenancies',
    },

    { kind: 'h2', text: 'SPECIFIED INCUMBRANCES' },
    ...(input.specifiedIncumbrances.length === 0
      ? [{ kind: 'p', text: 'None.' } as Block]
      : input.specifiedIncumbrances.map<Block>((i) => ({ kind: 'bullet', text: i }))),

    { kind: 'page-break' },

    { kind: 'h2', text: 'SPECIAL CONDITIONS' },
    ...(input.specialConditions.length === 0
      ? [{ kind: 'p', text: 'None.' } as Block]
      : input.specialConditions.map<Block>((c, i) => ({ kind: 'p', text: `${i + 1}. ${c}` }))),

    { kind: 'rule' },
    {
      kind: 'p',
      text: 'Where there is conflict between the Special Conditions and the Standard Conditions of Sale, the Special Conditions prevail.',
    },
  ];

  return buildPdf({ title: 'Draft Contract for Sale', subject: 'Draft contract' }, blocks);
}
