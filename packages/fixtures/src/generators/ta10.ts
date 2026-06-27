import { type Block, buildPdf } from '../pdf/builder';

interface ItemStatus {
  item: string;
  status: 'Included' | 'Excluded' | 'For sale (extra)' | 'None at property';
  notes?: string;
}

export interface Ta10Input {
  propertyAddress: string;
  sellerName: string;
  items: ItemStatus[];
}

export async function generateTa10(input: Ta10Input): Promise<Buffer> {
  const blocks: Block[] = [
    { kind: 'h1', text: 'TA10 — Fittings and Contents Form (4th edition)' },
    { kind: 'p', text: 'List of items to be included in or excluded from the sale.' },
    { kind: 'kv', key: 'Property', value: input.propertyAddress },
    { kind: 'kv', key: 'Seller', value: input.sellerName },
    { kind: 'rule' },
    { kind: 'h2', text: 'Fittings, contents and items' },
    {
      kind: 'p',
      text: 'For each item the seller has marked the status as Included, Excluded, For sale at extra cost, or None at the property.',
    },
  ];

  for (const it of input.items) {
    blocks.push({
      kind: 'qa',
      q: it.item,
      a: it.notes ? `${it.status} — ${it.notes}` : it.status,
    });
  }

  blocks.push({ kind: 'rule' });
  blocks.push({
    kind: 'p',
    text: `Signed by ${input.sellerName}. Any items marked "For sale (extra)" are subject to separate agreement with the buyer.`,
  });

  return buildPdf({ title: 'TA10 Fittings and Contents Form', subject: 'Inventory' }, blocks);
}
