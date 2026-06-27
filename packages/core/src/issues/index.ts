/**
 * Conveyancing Issue Taxonomy
 *
 * A proprietary, named library of UK residential conveyancing issues. Every
 * RiskFlag and Enquiry should, where confidently identifiable, reference a
 * code from this taxonomy. Free-text remains supported for novel cases.
 *
 * Each entry encodes:
 *   - default severity (per the calibration doctrine)
 *   - default priority (1 highest, 5 lowest)
 *   - false-positive traps the model must avoid (anti-pattern guard)
 *   - required supporting facts so claims are grounded
 *   - a default enquiry template the model can adapt
 *   - default report-on-title language for the assertion
 *
 * The taxonomy is intentionally narrower than the general space of legal
 * issues. Growth is driven by real pilot matter packs, not by speculation.
 */

export type IssueCategory =
  | 'title'
  | 'leasehold'
  | 'planning'
  | 'searches'
  | 'occupiers'
  | 'disclosure'
  | 'disputes'
  | 'other';

export type IssueSeverity = 'critical' | 'high' | 'medium' | 'low' | 'informational';

export type IssuePriority = 1 | 2 | 3 | 4 | 5;

export type ConveyancingIssueCode =
  | 'TITLE_RESTRICTION_CONSENT'
  | 'TITLE_CHARGE_DISCHARGE_EVIDENCE'
  | 'TITLE_DEFECTIVE_INDEMNITY_REQUIRED'
  | 'TITLE_OVERRIDING_INTERESTS'
  | 'LEASE_SHORT_TERM'
  | 'LEASE_GROUND_RENT_ESCALATION'
  | 'LEASE_ALTERATIONS_CONSENT'
  | 'LEASE_SECTION_20_MAJOR_WORKS'
  | 'LEASE_SERVICE_CHARGE_DISPUTE'
  | 'PLANNING_TA6_SEARCH_DISCREPANCY'
  | 'PLANNING_BUILDING_REGS_MISSING'
  | 'PLANNING_BREACH_ENFORCEMENT'
  | 'SEARCH_DRAINAGE_DISCREPANCY'
  | 'SEARCH_FLOOD_RISK'
  | 'SEARCH_CONTAMINATED_LAND'
  | 'OCCUPIER_CONSENT_MISSING'
  | 'OCCUPIER_TENANCY_UNDISCLOSED'
  | 'SELLER_DISCLOSURE_INCONSISTENCY'
  | 'BOUNDARY_DISPUTE_UNRESOLVED'
  | 'INSURANCE_CLAIM_DISCLOSED'
  | 'MORTGAGE_OFFER_EXPIRY_RISK';

export interface ConveyancingIssue {
  code: ConveyancingIssueCode;
  label: string;
  category: IssueCategory;
  defaultSeverity: IssueSeverity;
  defaultPriority: IssuePriority;
  description: string;
  whyItMatters: string;
  requiredSupportingFacts: string[];
  falsePositiveTraps: string[];
  defaultEnquiryTemplate: string;
  defaultReportLanguage: string;
}

export const CONVEYANCING_ISSUES: Record<ConveyancingIssueCode, ConveyancingIssue> = {
  /* ───────────────────────── Title ───────────────────────── */

  TITLE_RESTRICTION_CONSENT: {
    code: 'TITLE_RESTRICTION_CONSENT',
    label: 'Restriction requires consent before disposition',
    category: 'title',
    defaultSeverity: 'high',
    defaultPriority: 2,
    description:
      'A restriction on the title register requires the consent of a named party before any disposition can be registered.',
    whyItMatters:
      'Without the required consent, Land Registry will not register the transfer. The buyer cannot rely on registered title against third parties.',
    requiredSupportingFacts: [
      'restriction entry on the title register (entry number)',
      'identity of the party whose consent is required',
    ],
    falsePositiveTraps: [
      'Standard Form A restrictions on jointly owned property are routine and only require an additional trustee on the buyer side. Do not escalate.',
      'Restrictions in favour of a chargee being redeemed on completion are removed alongside the discharge. Treat as informational.',
    ],
    defaultEnquiryTemplate:
      'Please provide a copy of the consent of [consenting party] to the proposed disposition, or confirm the basis on which the restriction at entry [N] will be complied with prior to completion.',
    defaultReportLanguage:
      "The title register contains a restriction at entry [N] requiring the consent of [party] before any disposition can be registered. We have raised an enquiry with the seller's solicitor and will report further once a response is received.",
  },

  TITLE_CHARGE_DISCHARGE_EVIDENCE: {
    code: 'TITLE_CHARGE_DISCHARGE_EVIDENCE',
    label: 'Evidence of charge discharge on completion',
    category: 'title',
    defaultSeverity: 'informational',
    defaultPriority: 5,
    description:
      'The title register discloses a registered charge. Evidence of discharge (DS1 or equivalent e-DS1 notification) will be required on or before completion.',
    whyItMatters:
      "Without evidence of discharge, the buyer cannot take the property free of the seller's mortgage and the new charge cannot take first priority.",
    requiredSupportingFacts: ['registered charge in the proprietorship or charges register'],
    falsePositiveTraps: [
      "A seller's mortgage being redeemed from the sale proceeds is routine. Do not flag as critical; this is standard completion housekeeping.",
      'Charges already shown as discharged in the register are not outstanding. Read the entry carefully.',
    ],
    defaultEnquiryTemplate:
      'Please confirm that the registered charge dated [date] in favour of [lender] will be redeemed on completion and that the DS1 (or equivalent e-DS1 confirmation) will be provided.',
    defaultReportLanguage:
      "A registered charge in favour of [lender] is shown on the title. The seller's solicitor has confirmed this will be redeemed on completion with evidence of discharge to follow.",
  },

  TITLE_DEFECTIVE_INDEMNITY_REQUIRED: {
    code: 'TITLE_DEFECTIVE_INDEMNITY_REQUIRED',
    label: 'Defective title indemnity insurance required',
    category: 'title',
    defaultSeverity: 'medium',
    defaultPriority: 3,
    description:
      'A title defect has been identified for which the customary remedy is defective title indemnity insurance rather than rectification.',
    whyItMatters:
      'Indemnity must be in place before exchange. Some lenders impose additional conditions on policy wording, retroactive periods, or cover limits.',
    requiredSupportingFacts: [
      'identified title defect (covenant breach, missing rights, etc.)',
      "lender's position on indemnity (where the lender is known)",
    ],
    falsePositiveTraps: [
      'An indemnity policy already in place and assignable to the buyer typically resolves the matter; do not raise a new enquiry without checking.',
    ],
    defaultEnquiryTemplate:
      'Please confirm whether a defective title indemnity policy is in place in respect of [defect]. If yes, please provide a copy and confirmation that the cover is assignable to the buyer and lender.',
    defaultReportLanguage:
      'A defective title indemnity policy is to be put in place in respect of [defect]. We will review the proposed policy wording on receipt.',
  },

  TITLE_OVERRIDING_INTERESTS: {
    code: 'TITLE_OVERRIDING_INTERESTS',
    label: 'Possible overriding interests',
    category: 'title',
    defaultSeverity: 'high',
    defaultPriority: 2,
    description:
      'Replies disclose, or the documents suggest, the existence of interests that may override registered title (eg occupation rights, rights of way not on the register, prescriptive easements).',
    whyItMatters:
      'Overriding interests bind a buyer despite not appearing on the register and can materially affect use and value.',
    requiredSupportingFacts: ['disclosed interest', 'document/page where disclosed'],
    falsePositiveTraps: [
      'Sole-owner occupation by the seller is not an overriding interest. Do not raise enquiries on this basis alone.',
    ],
    defaultEnquiryTemplate:
      'Please provide full details of [disclosed interest], including any documentary evidence and confirmation of whether the buyer will take subject to or free of the interest on completion.',
    defaultReportLanguage:
      'The replies indicate [interest]. We have raised an enquiry to clarify the basis on which the buyer will take the property.',
  },

  /* ───────────────────────── Leasehold ───────────────────────── */

  LEASE_SHORT_TERM: {
    code: 'LEASE_SHORT_TERM',
    label: 'Unexpired lease term below lender minimum',
    category: 'leasehold',
    defaultSeverity: 'high',
    defaultPriority: 2,
    description:
      "The unexpired lease term at completion is at or below the buyer's lender's minimum (commonly 70 years above the mortgage term).",
    whyItMatters:
      'Mortgage offers are typically withdrawn or renegotiated where the unexpired term is insufficient. A lease extension may be required pre-completion.',
    requiredSupportingFacts: [
      'lease commencement date',
      'lease term',
      'lender minimum unexpired term (where known)',
    ],
    falsePositiveTraps: [
      "Leases comfortably above the lender's threshold do not need flagging at this severity. Confirm the lender's specific requirement.",
    ],
    defaultEnquiryTemplate:
      'The unexpired lease term at completion is [N] years. Please confirm whether the seller has taken any steps to extend the lease under the Leasehold Reform, Housing and Urban Development Act 1993, or is willing to do so prior to completion.',
    defaultReportLanguage:
      "The unexpired term of the lease at completion is [N] years. This is [above/below/at] your lender's minimum requirement and may require a lease extension before completion.",
  },

  LEASE_GROUND_RENT_ESCALATION: {
    code: 'LEASE_GROUND_RENT_ESCALATION',
    label: 'Onerous ground rent escalation',
    category: 'leasehold',
    defaultSeverity: 'high',
    defaultPriority: 2,
    description:
      'The lease provides for ground rent that doubles, multiplies, or escalates by reference to RPI or similar more frequently than every 25 years.',
    whyItMatters:
      'Major lenders refuse to lend on leases with doubling ground rent clauses. Beyond a certain level the rent may also engage the assured shorthold tenancy regime under the Housing Act 1988.',
    requiredSupportingFacts: ['ground rent clause', 'escalation mechanism and review dates'],
    falsePositiveTraps: [
      'Fixed nominal ground rents (eg a peppercorn or a fixed £150 per annum) do not engage this rule.',
      'A single uplift far in the future (eg one review at year 50) is not an escalation pattern.',
    ],
    defaultEnquiryTemplate:
      "The ground rent provisions at clause [X] include [escalation mechanism]. Please confirm whether the seller has obtained any deed of variation, lender consent, or indemnity in respect of the lender's ground rent policy.",
    defaultReportLanguage:
      "The lease contains a ground rent escalation clause at clause [X] which may be onerous for the purposes of your lender's requirements. We have raised an enquiry and will revert on receipt of a response.",
  },

  LEASE_ALTERATIONS_CONSENT: {
    code: 'LEASE_ALTERATIONS_CONSENT',
    label: 'Alterations without licence to alter',
    category: 'leasehold',
    defaultSeverity: 'medium',
    defaultPriority: 3,
    description:
      'Alterations to the demised premises appear to have been carried out without a recorded licence to alter from the landlord.',
    whyItMatters:
      'Unconsented alterations remain a breach of covenant and a continuing liability of the buyer as successor in title. Retrospective licence or indemnity will usually be required.',
    requiredSupportingFacts: ['disclosed alterations', 'absence of licence in pack'],
    falsePositiveTraps: [
      'Internal cosmetic alterations may fall outside the consent provisions of the lease. Check the lease wording before flagging.',
    ],
    defaultEnquiryTemplate:
      "Please provide a copy of the landlord's licence to alter in respect of [alteration]. If a licence is not available, please confirm the basis on which the buyer may rely on the alterations following completion (eg retrospective consent or indemnity).",
    defaultReportLanguage:
      "Alterations to the property have been carried out without a recorded licence to alter. We have raised an enquiry and will report further on receipt of the landlord's response or proposed indemnity.",
  },

  LEASE_SECTION_20_MAJOR_WORKS: {
    code: 'LEASE_SECTION_20_MAJOR_WORKS',
    label: 'Pending Section 20 major works',
    category: 'leasehold',
    defaultSeverity: 'high',
    defaultPriority: 2,
    description:
      'A Section 20 notice under the Landlord and Tenant Act 1985 has been served or is anticipated, foreshadowing a service-charge contribution towards major works.',
    whyItMatters:
      'The buyer will become liable for the works charge as successor in title unless a retention is agreed at completion.',
    requiredSupportingFacts: [
      'Section 20 notice',
      'estimated cost of works',
      'consultation status',
    ],
    falsePositiveTraps: [
      'A historic Section 20 process that has already concluded with the charge collected is not a buyer liability and should not be raised.',
    ],
    defaultEnquiryTemplate:
      "Please provide a copy of any Section 20 notice served in the last 18 months and any further documents indicating the expected cost. Please also confirm whether the seller will agree to a retention from the completion monies in respect of the buyer's share.",
    defaultReportLanguage:
      'A Section 20 consultation has been served in respect of [works] with an estimated cost of [£]. We have raised an enquiry regarding a retention from the completion monies.',
  },

  LEASE_SERVICE_CHARGE_DISPUTE: {
    code: 'LEASE_SERVICE_CHARGE_DISPUTE',
    label: 'Service charge dispute or arrears',
    category: 'leasehold',
    defaultSeverity: 'medium',
    defaultPriority: 3,
    description:
      'Replies or accounts disclose a current service charge dispute, arrears, or a query that remains unresolved.',
    whyItMatters:
      "Outstanding service charge liabilities pass to the buyer as successor in title; a dispute may also affect the management company's ability to provide a clean LPE1.",
    requiredSupportingFacts: ['disclosed dispute or arrears', 'amounts outstanding'],
    falsePositiveTraps: [
      'A disclosed dispute already settled in writing with no outstanding balance is not a live issue. Read replies carefully.',
    ],
    defaultEnquiryTemplate:
      'Please provide full details of the disclosed service-charge [dispute/arrears], including correspondence and confirmation of how this will be resolved on or before completion.',
    defaultReportLanguage:
      'The replies disclose a service charge [dispute/arrears] of [£]. We have raised an enquiry seeking confirmation of how this will be discharged on or before completion.',
  },

  /* ───────────────────────── Planning ───────────────────────── */

  PLANNING_TA6_SEARCH_DISCREPANCY: {
    code: 'PLANNING_TA6_SEARCH_DISCREPANCY',
    label: 'TA6 contradicts CON29 / planning search',
    category: 'planning',
    defaultSeverity: 'high',
    defaultPriority: 2,
    description:
      "A statement in the seller's TA6 Property Information Form is contradicted by an entry in the CON29 or planning search results.",
    whyItMatters:
      "A factual contradiction must be reconciled before the buyer can rely on either statement. The TA6 is the seller's warranty; the search is the council's record.",
    requiredSupportingFacts: [
      'specific TA6 question and answer',
      'specific CON29 / planning entry',
    ],
    falsePositiveTraps: [
      'Search results dated before a development began will naturally lag a TA6 disclosure; check dates before flagging.',
    ],
    defaultEnquiryTemplate:
      "The seller's reply at TA6 question [N] states [statement]. The CON29 / planning search at entry [E] discloses [entry]. Please reconcile this discrepancy and provide any supporting documentation.",
    defaultReportLanguage:
      "There is a discrepancy between the seller's TA6 reply and the CON29 / planning search. We have raised an enquiry and will report further once it is reconciled.",
  },

  PLANNING_BUILDING_REGS_MISSING: {
    code: 'PLANNING_BUILDING_REGS_MISSING',
    label: 'Building regulations approval missing for works',
    category: 'planning',
    defaultSeverity: 'medium',
    defaultPriority: 3,
    description:
      'Works requiring building regulations approval have been carried out without a recorded completion certificate.',
    whyItMatters:
      'The local authority retains enforcement powers; lenders commonly require a certificate, an indemnity policy, or a regularisation certificate.',
    requiredSupportingFacts: ['works in question', 'date carried out', 'absence of certificate'],
    falsePositiveTraps: [
      'Works pre-dating the relevant regulations are outside the regime. Check the date carefully.',
      'Like-for-like internal works often fall outside the regime.',
    ],
    defaultEnquiryTemplate:
      'Please provide a copy of the building regulations completion certificate in respect of [works]. If a certificate is not available, please confirm whether the seller intends to procure a regularisation certificate or indemnity policy.',
    defaultReportLanguage:
      "A building regulations completion certificate for [works] is not included in the pack. We have raised an enquiry and will revert on the seller's proposed resolution.",
  },

  PLANNING_BREACH_ENFORCEMENT: {
    code: 'PLANNING_BREACH_ENFORCEMENT',
    label: 'Active planning enforcement or breach',
    category: 'planning',
    defaultSeverity: 'critical',
    defaultPriority: 1,
    description:
      'A planning enforcement notice, stop notice, or active breach investigation affects the property.',
    whyItMatters:
      'Enforcement action binds successors in title. Completion in the face of active enforcement exposes the buyer to remedy works at their cost.',
    requiredSupportingFacts: ['enforcement notice', 'date of issue', 'current status'],
    falsePositiveTraps: [
      'A historic enforcement matter shown as resolved or withdrawn on the search is not active and should not be flagged at this severity.',
    ],
    defaultEnquiryTemplate:
      'The planning search discloses [enforcement matter]. Please provide a copy of any notice, full details of the current status, and the steps the seller has taken or will take to resolve the matter prior to completion.',
    defaultReportLanguage:
      'The planning search discloses an active enforcement matter affecting the property. We have raised an urgent enquiry and would not advise exchange until this is fully resolved.',
  },

  /* ───────────────────────── Searches ───────────────────────── */

  SEARCH_DRAINAGE_DISCREPANCY: {
    code: 'SEARCH_DRAINAGE_DISCREPANCY',
    label: 'Drainage and water search discrepancy',
    category: 'searches',
    defaultSeverity: 'medium',
    defaultPriority: 3,
    description:
      'The CON29DW drainage and water search discloses that the property is not connected to mains drainage or water in the manner represented elsewhere in the pack.',
    whyItMatters:
      'Private drainage arrangements (septic tank, cesspool, package treatment plant) carry maintenance, regulatory, and disposal obligations the buyer must take subject to.',
    requiredSupportingFacts: [
      'CON29DW entry',
      'contradictory statement in TA6 or elsewhere (if any)',
    ],
    falsePositiveTraps: [
      'A property correctly disclosed as on private drainage with full maintenance information already provided does not need additional enquiries; do not double-raise.',
    ],
    defaultEnquiryTemplate:
      'The drainage and water search indicates [entry]. Please confirm the actual drainage and water arrangements, and provide any maintenance records, septic tank logs, or General Binding Rules compliance evidence.',
    defaultReportLanguage:
      'The CON29DW drainage and water search discloses [position]. We have raised an enquiry to confirm the arrangements and obtain the maintenance documentation.',
  },

  SEARCH_FLOOD_RISK: {
    code: 'SEARCH_FLOOD_RISK',
    label: 'Material flood risk disclosed',
    category: 'searches',
    defaultSeverity: 'high',
    defaultPriority: 2,
    description:
      'A flood risk assessment or environmental search discloses a material risk of river, surface-water, or coastal flooding affecting the property.',
    whyItMatters:
      'Material flood risk affects insurability, lender appetite (some lenders require Flood Re eligibility), and resale.',
    requiredSupportingFacts: ['flood risk score or category', 'source of report'],
    falsePositiveTraps: [
      'A low or very low residual risk score with no historical flooding is not a material risk and should not be escalated as high.',
    ],
    defaultEnquiryTemplate:
      'The environmental search discloses [risk]. Please confirm whether the property has flooded in the last 10 years, whether insurance has been declined or loaded, and provide a copy of any flood resilience measures in place.',
    defaultReportLanguage:
      'The environmental search discloses [flood risk]. We have asked the seller for the flooding history and insurance position, and would recommend you obtain a buildings insurance quote prior to exchange.',
  },

  SEARCH_CONTAMINATED_LAND: {
    code: 'SEARCH_CONTAMINATED_LAND',
    label: 'Contaminated land concern in search',
    category: 'searches',
    defaultSeverity: 'high',
    defaultPriority: 2,
    description:
      'The environmental or CON29 search discloses a contaminated land concern that has not been resolved or otherwise discounted.',
    whyItMatters:
      'A determination under Part 2A of the Environmental Protection Act 1990 carries remediation liability that can attach to subsequent owners.',
    requiredSupportingFacts: ['search entry', 'past land use'],
    falsePositiveTraps: [
      'A search result marked "no further action required" or returning a "passed" assessment from an environmental data provider is not a live concern.',
    ],
    defaultEnquiryTemplate:
      'The environmental search discloses [concern]. Please provide any environmental reports, remediation evidence, or correspondence with the local authority demonstrating that no further action will be required against the property.',
    defaultReportLanguage:
      'The environmental search discloses a possible contaminated land concern. We have raised an enquiry and would not advise exchange until the position is clear.',
  },

  /* ───────────────────────── Occupiers ───────────────────────── */

  OCCUPIER_CONSENT_MISSING: {
    code: 'OCCUPIER_CONSENT_MISSING',
    label: 'Adult occupier consent / waiver form missing',
    category: 'occupiers',
    defaultSeverity: 'high',
    defaultPriority: 2,
    description:
      "An adult occupier (other than the seller) is acknowledged in the pack but no signed occupier's consent form waiving any interest is on file. The seller still intends to deliver vacant possession on completion; the issue is the missing lender form, not the existence of the occupier.",
    whyItMatters:
      "Most lenders require all adult occupiers to sign a consent waiving any rights they may have against the lender's charge. Without this, the lender will not release funds even if vacant possession is otherwise being given.",
    requiredSupportingFacts: [
      'identity of the adult occupier',
      'evidence the occupier is acknowledged (TA6 occupier section, contract, correspondence)',
      'absence of a signed consent form in the pack',
    ],
    falsePositiveTraps: [
      'Children under 17 are not "adult occupiers" for this purpose.',
      'A signed consent already in the pack but mislabelled may exist; check carefully.',
      'Use OCCUPIER_TENANCY_UNDISCLOSED instead if the seller has not acknowledged the occupier at all (the issue is non-disclosure, not a missing form).',
    ],
    defaultEnquiryTemplate:
      "The pack discloses [occupier] as residing at the property. Please provide a signed occupier's consent form executed by [occupier] in favour of the buyer's lender.",
    defaultReportLanguage:
      "[Occupier] is shown as residing at the property. We have requested a signed occupier's consent form; this is a lender requirement and must be received before completion.",
  },

  OCCUPIER_TENANCY_UNDISCLOSED: {
    code: 'OCCUPIER_TENANCY_UNDISCLOSED',
    label: 'Undisclosed tenancy or occupation putting vacant possession at risk',
    category: 'occupiers',
    defaultSeverity: 'critical',
    defaultPriority: 1,
    description:
      "An occupational right exists that the seller has NOT acknowledged anywhere in the pack, and the documents do not establish that vacant possession can be given. The issue is the seller's non-disclosure of an occupation that could defeat completion, not the absence of a consent form.",
    whyItMatters:
      'A buyer expecting vacant possession cannot complete against an occupied property whose occupier has not been identified. The transaction structure (price, lender requirements, post-completion plans) all assume vacant possession, and an undisclosed occupier may have an overriding interest binding on the buyer.',
    requiredSupportingFacts: [
      'evidence of a tenancy, licence, or right of occupation',
      'absence of any acknowledgement of that occupier in the seller-completed documents',
    ],
    falsePositiveTraps: [
      'A family-member occupier who has been acknowledged in the pack is not "undisclosed" - use OCCUPIER_CONSENT_MISSING if the issue is just a missing consent form.',
      'A confirmed occupier who will leave on completion and whose consent has been signed is not an undisclosed tenancy.',
      'Where the contract states vacant possession will be given and the only gap is a missing form, prefer OCCUPIER_CONSENT_MISSING.',
    ],
    defaultEnquiryTemplate:
      'Please clarify the basis on which [occupier] resides at the property, why this occupation was not disclosed on the TA6, and provide written confirmation that vacant possession will be given on completion.',
    defaultReportLanguage:
      'There is a question over whether the seller will be able to deliver vacant possession on completion. We have raised an urgent enquiry and would not advise exchange until this is fully resolved.',
  },

  /* ───────────────────────── Disclosure ───────────────────────── */

  SELLER_DISCLOSURE_INCONSISTENCY: {
    code: 'SELLER_DISCLOSURE_INCONSISTENCY',
    label: 'Seller disclosure inconsistent with source documents',
    category: 'disclosure',
    defaultSeverity: 'high',
    defaultPriority: 1,
    description:
      "A statement in the seller's property information form (TA6 / TA7 / TA10) is materially inconsistent with an official search result, title document, contract paper, or other source document in the pack. The inconsistency goes beyond an incomplete answer; the seller's positive statement is contradicted by the record.",
    whyItMatters:
      'Inconsistent seller disclosure undermines reliance on the replies, affects pre-contract enquiries and buyer advice, can engage misrepresentation under the Misrepresentation Act 1967, and may need to be reported to the lender. The supervising fee-earner must consider whether the seller can still give full title guarantee.',
    requiredSupportingFacts: [
      'the specific seller statement (form, question, exact wording)',
      'the source document that contradicts it (with quote and page)',
    ],
    falsePositiveTraps: [
      'Do not emit where the official record merely provides additional routine detail not asked about in the seller form.',
      'Do not emit where the seller form answer is incomplete but not actively contradicted.',
      'Do not emit where the inconsistency relates only to a resolved historical matter with no current material impact.',
      'Prefer this code over PLANNING_TA6_SEARCH_DISCREPANCY when the issue is the disclosure inconsistency itself rather than the underlying planning concern (raise both codes if both are at stake).',
    ],
    defaultEnquiryTemplate:
      "The seller's reply at [form, question] states [statement]. The [source document] discloses [contradictory entry]. Please explain the discrepancy, confirm whether the seller was aware of the contradicting fact at the date of the form, and confirm whether the form will be amended.",
    defaultReportLanguage:
      "The seller's [form] reply on [topic] is inconsistent with the [source document]. We have raised an enquiry seeking the seller's explanation, and would not advise exchange until the inconsistency is resolved.",
  },

  /* ───────────────────────── Disputes ───────────────────────── */

  BOUNDARY_DISPUTE_UNRESOLVED: {
    code: 'BOUNDARY_DISPUTE_UNRESOLVED',
    label: 'Active or unresolved boundary dispute',
    category: 'disputes',
    defaultSeverity: 'high',
    defaultPriority: 2,
    description:
      'TA6 replies or correspondence disclose a boundary disagreement with a neighbour that has not been formally resolved.',
    whyItMatters:
      'An active dispute affects use, value, and insurability. A buyer takes the dispute on as successor in title.',
    requiredSupportingFacts: [
      'TA6 disclosure',
      'nature of dispute',
      'correspondence with neighbour or local authority',
    ],
    falsePositiveTraps: [
      'A historic dispute formally concluded with a signed boundary agreement is not "unresolved". Read replies carefully.',
    ],
    defaultEnquiryTemplate:
      'The TA6 discloses a boundary disagreement with [neighbour]. Please provide all correspondence, any boundary agreement, and confirmation of the current status of the matter.',
    defaultReportLanguage:
      'The seller has disclosed a boundary disagreement with [neighbour]. We have raised an enquiry and will report further on receipt of the supporting documentation.',
  },

  INSURANCE_CLAIM_DISCLOSED: {
    code: 'INSURANCE_CLAIM_DISCLOSED',
    label: 'Recent buildings insurance claim disclosed',
    category: 'disputes',
    defaultSeverity: 'medium',
    defaultPriority: 3,
    description:
      'A material buildings insurance claim has been made in the last few years, raising questions about future insurability or unresolved damage.',
    whyItMatters:
      "A prior claim can affect the buyer's premium, terms, or insurability altogether - relevant to lender requirements.",
    requiredSupportingFacts: ['nature of claim', 'date', 'remediation status'],
    falsePositiveTraps: [
      'A small, fully remediated claim disclosed for completeness need not be raised at this severity.',
    ],
    defaultEnquiryTemplate:
      'The TA6 discloses an insurance claim in respect of [event] dated [date]. Please provide details of the claim, the works carried out, and any continuing condition on the policy.',
    defaultReportLanguage:
      'The seller has disclosed a buildings insurance claim in respect of [event]. We have requested further details and would recommend the buyer obtain a fresh buildings insurance quote.',
  },

  /* ───────────────────────── Other ───────────────────────── */

  MORTGAGE_OFFER_EXPIRY_RISK: {
    code: 'MORTGAGE_OFFER_EXPIRY_RISK',
    label: 'Mortgage offer expiry close to anticipated completion',
    category: 'other',
    defaultSeverity: 'medium',
    defaultPriority: 3,
    description:
      "The buyer's mortgage offer expires within the window in which exchange and completion are realistically achievable.",
    whyItMatters:
      "An expired offer requires re-application, which can change the rate, the product, and the lender's appetite.",
    requiredSupportingFacts: ['mortgage offer expiry date', 'anticipated completion date'],
    falsePositiveTraps: [
      'Offers with comfortable headroom over the realistic completion timetable do not need flagging.',
    ],
    defaultEnquiryTemplate:
      "Your mortgage offer is dated [date] and expires on [expiry]. Please confirm the lender's position on a short extension if completion runs close to the expiry date.",
    defaultReportLanguage:
      'Your mortgage offer expires on [date]. We will keep the timetable under review and revert if an extension request becomes necessary.',
  },
};

/** All issue codes, useful for building enums, dropdowns, or schema validators. */
export const CONVEYANCING_ISSUE_CODES: readonly ConveyancingIssueCode[] = Object.keys(
  CONVEYANCING_ISSUES,
) as ConveyancingIssueCode[];

/** Lookup by category, used by UI filters and analytics. */
export function issuesByCategory(category: IssueCategory): ConveyancingIssue[] {
  return Object.values(CONVEYANCING_ISSUES).filter((i) => i.category === category);
}

/** Lookup an issue by code, with a typed undefined fallback for unknown inputs. */
export function getIssue(code: string | null | undefined): ConveyancingIssue | undefined {
  if (!code) return undefined;
  return (CONVEYANCING_ISSUES as Record<string, ConveyancingIssue>)[code];
}

/** Count of distinct categories present in the taxonomy, for marketing copy that must reflect truth. */
export const CONVEYANCING_ISSUE_CATEGORY_COUNT: number = new Set(
  Object.values(CONVEYANCING_ISSUES).map((i) => i.category),
).size;

/**
 * Build a compact, prompt-ready summary of the taxonomy grouped by category.
 * Used by the analyse and enquiries prompts so the model knows which codes
 * exist, their calibrated default severity, and a one-line description.
 *
 * Token cost is roughly 20 lines x ~90 chars = ~500 tokens, cheap compared
 * to the value of routing free-text drafting into a named code.
 */
export function buildTaxonomyPromptSection(): string {
  const orderedCategories: IssueCategory[] = [
    'title',
    'leasehold',
    'planning',
    'searches',
    'occupiers',
    'disclosure',
    'disputes',
    'other',
  ];

  const sections = orderedCategories
    .map((category) => {
      const items = issuesByCategory(category);
      if (items.length === 0) return null;
      const heading = category.charAt(0).toUpperCase() + category.slice(1);
      const rows = items
        .map((i) => `- ${i.code} (${i.defaultSeverity}) - ${i.description}`)
        .join('\n');
      return `${heading}:\n${rows}`;
    })
    .filter((s): s is string => s !== null);

  return [
    '# Conveyancing Issue Taxonomy',
    '',
    'When the issue you are recording clearly maps to one of the codes below, set issueCode to that code. Each code carries a calibrated default severity (shown in brackets) tuned to UK conveyancing reality. Use the defaults as your baseline; depart from them only when the facts clearly warrant it.',
    '',
    'Leave issueCode undefined when the issue is genuinely novel and does not fit any code. The taxonomy is intentionally narrow; do not force a fit.',
    '',
    ...sections,
  ].join('\n\n');
}
