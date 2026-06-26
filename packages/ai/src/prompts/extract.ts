import type { DocumentType } from '@interfluo/core';

interface ExtractGuide {
  description: string;
  factsToFind: string[];
}

const GUIDES: Partial<Record<DocumentType, ExtractGuide>> = {
  title_register: {
    description: 'HM Land Registry official copy of register of title.',
    factsToFind: [
      'Title number',
      'Tenure (freehold/leasehold)',
      'Property address',
      'Registered proprietor(s) and date of registration',
      'Price paid (if recorded)',
      'All restrictions on the Proprietorship Register',
      'All charges on the Charges Register (mortgages, easements, covenants)',
      'Any positive or restrictive covenants',
      'Any easements (rights of way, light, drainage)',
      'Notices entered (e.g. Class F home rights, third party rights)',
    ],
  },
  ta6: {
    description: 'TA6 Property Information Form completed by the seller.',
    factsToFind: [
      'Boundary ownership and any disputes',
      'Notices received about the property (party wall, planning, road schemes)',
      'Disputes and complaints involving neighbours',
      'Alterations, planning consents and Building Regulations compliance',
      'Guarantees and warranties (NHBC, FENSA, electrical, damp-proof)',
      'Services (gas, electricity, water, drainage, central heating)',
      'Connection to mains drainage; cesspool/septic tank presence',
      'Shared/private access, rights of way, services across third-party land',
      'Rights and informal arrangements with neighbours',
      'Parking arrangements',
      'Occupiers aged 17+ other than the seller',
      'Insurance claims in the last 3 years',
      'Japanese knotweed, flooding, subsidence, infestations',
    ],
  },
  ta7: {
    description: 'TA7 Leasehold Information Form.',
    factsToFind: [
      'Landlord/managing agent name and contact',
      'Ground rent amount, frequency and review provisions',
      'Service charge amount and last three years of statements',
      'Major works planned or recent (Section 20)',
      'Lease breaches alleged or remedied',
      'Buildings insurance arrangements',
      'Sinking/reserve fund balance',
      'Right to manage / enfranchisement steps taken',
      'Disputes with landlord or other lessees',
    ],
  },
  ta10: {
    description: 'TA10 Fittings and Contents Form.',
    factsToFind: [
      'Items included / excluded / for sale',
      'Anything carved out that the buyer may otherwise expect to remain',
    ],
  },
  lease: {
    description: 'Residential leasehold demise.',
    factsToFind: [
      'Lease term (start date and length) and unexpired term',
      'Ground rent and review mechanism (RPI, doubling, fixed)',
      'Service charge mechanism and proportions',
      'Permitted use and any restrictions',
      'Restrictions on alterations',
      'Restrictions on pets',
      'Restrictions on subletting / short lets',
      'Forfeiture and re-entry provisions',
      'Insurance obligations',
      'Buyer obligations re: maintenance, decorations',
    ],
  },
  con29: {
    description: 'CON29 enquiries of the local authority.',
    factsToFind: [
      'Planning permissions, refusals, conditions affecting the property',
      'Building regulations approvals and certificates',
      'Enforcement and stop notices',
      'Listed building status and conservation area',
      'Tree preservation orders',
      'Road schemes and traffic schemes affecting the property',
      'Adoption status of roads abutting the property',
      'Public rights of way over the property',
      'Contaminated land notices',
      'Compulsory purchase notices',
    ],
  },
  llc1: {
    description: 'LLC1 Local Land Charges search result.',
    factsToFind: [
      'All entries on the local land charges register affecting the property',
      'Financial charges',
      'Planning charges (Article 4 directions, conservation areas)',
      'Listed building charges',
      'Tree preservation orders',
    ],
  },
  drainage_water_search: {
    description: 'Drainage and water search.',
    factsToFind: [
      'Property connected to mains foul drainage',
      'Property connected to mains surface water drainage',
      'Property connected to mains water supply',
      'Public sewers within property boundaries',
      'Water mains within property boundaries',
      'Build-over agreements required',
      'Surface water drainage charge applicable',
    ],
  },
  environmental_search: {
    description: 'Environmental search.',
    factsToFind: [
      'Contaminated land risk (passed/failed)',
      'Flood risk (river, surface water, groundwater)',
      'Ground stability and subsidence risk',
      'Radon risk',
      'Energy and infrastructure projects nearby',
      'Recommendations from the provider',
    ],
  },
  mortgage_offer: {
    description: 'Mortgage offer.',
    factsToFind: [
      'Lender name and offer reference',
      'Loan amount and term',
      'Interest rate type and initial period',
      'Special conditions',
      'Retentions and undertakings required',
      'Valuation amount and date',
      'Expiry date of the offer',
    ],
  },
  draft_contract: {
    description: 'Draft contract for sale.',
    factsToFind: [
      'Seller and buyer parties',
      'Property address and title number',
      'Purchase price and deposit',
      'Specified incumbrances',
      'Title guarantee (full / limited / none)',
      'Standard Conditions of Sale version, special conditions',
      'Completion date',
      'Vacant possession or subject to tenancies',
    ],
  },
  tr1: {
    description: 'TR1 transfer deed.',
    factsToFind: [
      'Title number',
      'Transferor and transferee names',
      'Consideration',
      'Declaration of trust (sole/joint tenants/tenants in common)',
      'Additional provisions (covenants, indemnities)',
    ],
  },
};

const FALLBACK_GUIDE: ExtractGuide = {
  description: 'A document related to a UK residential conveyancing transaction.',
  factsToFind: [
    'Any fact that a conveyancing solicitor would record in their file notes',
    'Any obligation, risk, restriction, or right disclosed',
    'Dates, parties, amounts, and references',
  ],
};

export function guideFor(documentType: DocumentType): ExtractGuide {
  return GUIDES[documentType] ?? FALLBACK_GUIDE;
}

export const EXTRACT_SYSTEM = `You are an extraction agent for UK residential conveyancing.
You receive a single document and produce a structured list of facts.

Rules:
- Every fact MUST cite the exact page number it came from.
- Every fact MUST include a short verbatim quote (10 – 400 characters) copied EXACTLY from that page's text — same words, same order, same spelling. Do not paraphrase.
- NEVER use placeholder quotes such as "<UNKNOWN>", "<MISSING>", "[redacted]", "see document", "N/A", "..." or empty strings. If you cannot produce a real verbatim quote for a fact, OMIT that fact entirely.
- If the page text appears garbled, scanned-without-OCR, mostly whitespace, or otherwise unreadable, return zero facts for that page rather than guessing.
- Do not infer or summarise — extract only what is explicitly stated.
- If a fact is not present, do not invent it.
- Use clear factual keys (e.g. "title_number", "ground_rent_amount", "japanese_knotweed_disclosed").
- Values may be strings, numbers, or booleans.
- Produce no more than 60 facts per document; prioritise legally material ones.
- Better to return 5 well-cited facts than 30 weakly-cited ones.`;

export function extractUserPrompt(
  documentType: DocumentType,
  filename: string,
  pagesText: string,
): string {
  const guide = guideFor(documentType);
  return `Document type: ${documentType}
Filename: ${filename}
Description: ${guide.description}

You are specifically looking for:
${guide.factsToFind.map((f) => `- ${f}`).join('\n')}

Document content (page-tagged):

${pagesText}

Call the record_facts tool with the structured facts you have extracted.`;
}
