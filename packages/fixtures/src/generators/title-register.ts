import { type Block, buildPdf } from '../pdf/builder';

export interface TitleRegisterInput {
  titleNumber: string;
  tenure: 'Freehold' | 'Leasehold';
  propertyAddress: string;
  registeredProprietor: string;
  proprietorAddress: string;
  pricePaid: string | null;
  restrictions?: string[];
  charges?: string[];
  notices?: string[];
  rights?: string[];
  parentFreeholdTitle?: string;
  leaseDetails?: { dated: string; term: string };
}

export async function generateTitleRegister(input: TitleRegisterInput): Promise<Buffer> {
  const today = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const blocks: Block[] = [
    { kind: 'h1', text: 'HM LAND REGISTRY' },
    { kind: 'p', text: `Official copy of register of title — issued ${today}` },
    {
      kind: 'p',
      text: 'This official copy shows the entries on the register of title on the day and at the time shown above. It is admissible in evidence to the same extent as the original (Land Registration Act 2002, s.67).',
    },
    { kind: 'rule' },
    { kind: 'kv', key: 'Title Number', value: input.titleNumber },
    { kind: 'kv', key: 'Edition Date', value: today },
    { kind: 'page-break' },

    { kind: 'h2', text: 'A: PROPERTY REGISTER' },
    {
      kind: 'p',
      text: `This register describes the land and estate comprised in the title. ${input.tenure.toUpperCase()}.`,
    },
    {
      kind: 'p',
      text: `1. (${today.split(' ').slice(1).join(' ')}) The ${input.tenure.toLowerCase()} land shown edged with red on the plan of the above title filed at the Registry being ${input.propertyAddress}.`,
    },
  ];

  if (input.tenure === 'Leasehold' && input.leaseDetails && input.parentFreeholdTitle) {
    blocks.push({
      kind: 'p',
      text: `2. Short particulars of the lease(s) under which the land is held:\n   Date: ${input.leaseDetails.dated}\n   Term: ${input.leaseDetails.term}\n   Parties: (1) the freehold proprietor (2) the original lessee.`,
    });
    blocks.push({
      kind: 'p',
      text: `3. The Lessor's title is registered under title number ${input.parentFreeholdTitle}.`,
    });
  }

  if (input.rights && input.rights.length > 0) {
    blocks.push({ kind: 'h3', text: 'Rights granted' });
    for (const r of input.rights) blocks.push({ kind: 'bullet', text: r });
  }

  blocks.push({ kind: 'page-break' });

  blocks.push({ kind: 'h2', text: 'B: PROPRIETORSHIP REGISTER' });
  blocks.push({
    kind: 'p',
    text: 'This register specifies the class of title and identifies the owner. It contains any entries that affect the right of disposal.',
  });
  blocks.push({ kind: 'h3', text: 'Title absolute' });
  blocks.push({
    kind: 'p',
    text: `1. (${today.split(' ').slice(1).join(' ')}) PROPRIETOR: ${input.registeredProprietor.toUpperCase()} of ${input.proprietorAddress}.`,
  });
  if (input.pricePaid) {
    blocks.push({
      kind: 'p',
      text: `2. The price stated to have been paid on the above transfer was ${input.pricePaid}.`,
    });
  }
  if (input.restrictions && input.restrictions.length > 0) {
    let n = input.pricePaid ? 3 : 2;
    for (const r of input.restrictions) {
      blocks.push({
        kind: 'p',
        text: `${n}. RESTRICTION: ${r}`,
      });
      n += 1;
    }
  }

  blocks.push({ kind: 'page-break' });

  blocks.push({ kind: 'h2', text: 'C: CHARGES REGISTER' });
  blocks.push({
    kind: 'p',
    text: 'This register contains any charges and other matters that affect the land.',
  });
  let chargeN = 1;
  if (input.charges && input.charges.length > 0) {
    for (const c of input.charges) {
      blocks.push({ kind: 'p', text: `${chargeN}. ${c}` });
      chargeN += 1;
    }
  } else {
    blocks.push({ kind: 'p', text: '1. None.' });
  }
  if (input.notices && input.notices.length > 0) {
    blocks.push({ kind: 'h3', text: 'Notices and other entries' });
    for (const n of input.notices) {
      blocks.push({ kind: 'p', text: `${chargeN}. NOTICE: ${n}` });
      chargeN += 1;
    }
  }

  blocks.push({ kind: 'rule' });
  blocks.push({
    kind: 'p',
    text: 'END OF REGISTER. NOTE: A date in square brackets is the date of first registration of the entry.',
  });

  return buildPdf(
    { title: `Title register ${input.titleNumber}`, subject: 'HM Land Registry official copy' },
    blocks,
  );
}
