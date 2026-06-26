# Interfluo

> AI co-pilot for residential conveyancing fee-earners. Drop in the contract pack, get out the enquiries and the first draft of the Report on Title.

---

## 1. Overview

### The problem

A UK residential conveyancing fee-earner spends **4–8 hours per matter** on three high-cognitive tasks:

1. Reading the contract pack, property forms, and search results.
2. Drafting the **enquiries** to raise with the seller's solicitor.
3. Drafting the **Report on Title** for the buyer client.

The rest of the transaction is workflow ops (chasing, sending, signing). The above three tasks are where the firm's margin is leaking.

**Hard data on the pain (England & Wales):**
- Average residential conveyancing transaction now takes **~17 weeks**, with sales pushing **23 weeks** — up from a historical 8–12 weeks (Carbon Law Partners, 2025).
- Local authority searches alone take **3–5 weeks** in busy regions (GOV.UK Land Registry guidance).
- UK government has named conveyancing throughput a national growth blocker.
- ~**5,500 firms** in England & Wales handle ~**1M residential transactions/year**.

### The wedge product

**One screen, one verb:** *"Draft my enquiries and Report on Title from this pack."*

**Inputs** (drag-drop PDFs, or forward via email-in):
- Contract pack: draft contract, TR1, title register, title plan
- Property forms: TA6 (Property Information), TA10 (Fittings & Contents), TA7 (Leasehold), and the lease itself if applicable
- Search results: LLC1/CON29 (local authority), drainage & water, environmental, plus specialist searches
- Mortgage offer (optional)

**Outputs** (within 30–60 seconds):
1. **Ranked list of enquiries** with one-line rationale and a citation back to the source document and page. Fee-earner ticks the ones to send; the system formats them into the firm's house template.
2. **First draft of the Report on Title** in the firm's template, with every assertion footnoted to its source.

**Out of scope** (deliberately):
- AML / source-of-funds (covered by Thirdfort, Armalytix, Lawyer Checker)
- Case management (LEAP, Actionstep, OSPREY, ALB — we integrate, we don't replace)
- Completion ledger / SDLT filing / Land Registry submission

### Target user

- **Primary buyer**: Conveyancing partner or COLP at a 5–30 fee-earner residential firm.
- **Primary user**: Fee-earner / licensed conveyancer doing the matter.
- **Sales motion**: Per-firm pilot on real matters → adoption → seat or per-matter contract.

### Pricing

- **£40–60 per matter** in the firm's billing cycle.
- A firm charges the client £800–£1,500 per matter; £50 to recover 4 hours of fee-earner time is the easiest maths in legal tech.
- Optional firm-wide subscription tier (£500–£2,000/month) once volume justifies.
- Stay away from per-seat — solicitor headcount is small; **transaction count is the actual volume driver**.

### Why now

- LLM long-context reasoning over PDF stacks is finally accurate enough to be trusted as a "junior associate" output (with human review).
- UK conveyancing has measurably degraded since 2020 — every firm feels it, no firm has the tech team to fix it themselves.
- The current AI-for-law wave is overwhelmingly enterprise litigation / commercial M&A (Harvey, Hebbia). Residential conveyancing is structurally underserved by VC-backed players. Orbital Witness is the only meaningful UK adjacent player, and they sit at the title-review layer, not end-to-end.

### Brand

**Interfluo** — Latin for "to flow between". Captures the role we play: the connective tissue between buyer, seller, lender, and solicitor. Sounds like established legal infrastructure, not a chatbot.

---

## 2. Architecture

End-to-end pipeline. Five layers; each layer is independently scalable.

```
┌───────────────────────────────────────────────────────────────────┐
│  1. INGEST                                                        │
│  - Drag-drop PDF upload (web)                                     │
│  - Email-in (unique per-matter address)                           │
│  - Case management webhooks (LEAP, Actionstep — phase 2)          │
│  - Document classifier: TR1 vs TA6 vs CON29 vs lease vs …         │
│  - OCR fallback for scanned docs                                  │
└───────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────────────┐
│  2. EXTRACTION                                                    │
│  - Per-doc-type structured extractors                             │
│  - Schema-enforced LLM output (Claude with structured outputs)    │
│  - Coordinate tracking: every fact retains page + bbox            │
│  - Persist to per-matter Postgres record + S3 source              │
└───────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────────────┐
│  3. ANALYSIS                                                      │
│  - Enquiry generator (RAG over enquiry pattern corpus)            │
│  - Title risk identifier (covenants, easements, flying freehold)  │
│  - Search-result analyser (cross-refs CON29 answers to risks)     │
│  - Lease analyser (ground rent, term, forfeiture, service charge) │
│  - Lender-handbook compliance check (UK Finance / CML)            │
└───────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────────────┐
│  4. GENERATION                                                    │
│  - Enquiries draft in firm template                               │
│  - Report on Title draft in firm template                         │
│  - Every assertion footnoted with source citation                 │
│  - Per-firm template engine (Mustache + style rules)              │
└───────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────────────┐
│  5. REVIEW & EXPORT                                               │
│  - Side-by-side UI: source doc + AI output, hover-to-cite         │
│  - Accept / reject / edit per enquiry                             │
│  - Inline edit on Report on Title                                 │
│  - Audit log of all human edits (COLP/COFA defensible)            │
│  - Export: .docx (firm-styled), PDF, email, case-mgmt push        │
└───────────────────────────────────────────────────────────────────┘
```

### Model strategy

- **Reasoning + drafting**: Anthropic Claude Sonnet (default) and Opus (complex leasehold / commercial). Best long-context document reasoning available, and the structured-output mode keeps extraction reliable.
- **OCR**: Azure Document Intelligence as primary (best on dense legal docs), AWS Textract fallback. Native PDF text extraction first; OCR only on scans.
- **Embeddings**: Voyage or Cohere for the enquiry-pattern corpus and per-firm precedent retrieval.
- **No fine-tuning at MVP.** Win on prompt engineering + retrieval + structured outputs first. Reserve fine-tunes for year-2 specialisation (e.g. lease analysis, lender certificates).

### Citation & grounding

Non-negotiable: every line in the Report on Title and every enquiry maps back to a specific page in a specific source document. This is the single feature that converts solicitor scepticism to trust — and what makes the output PI-insurance-defensible.

Implementation: extraction layer stores `{fact, source_doc_id, page, bbox}` for every datapoint. Generation layer references these IDs by token, and a post-processor expands them into footnote markup.

---

## 3. Infrastructure

### Hosting & region

- **Primary**: AWS `eu-west-2` (London).
- Some enterprise firms will require UK-only data residency. London region satisfies SRA expectations and GDPR.
- **No US region** until first US-market expansion (years out).

### Compute

- **API + workers**: containerised on AWS ECS Fargate (no servers to patch).
- **Async document processing**: SQS-backed worker pool; jobs scale on queue depth.
- **No self-hosted GPUs.** All inference via Anthropic / Azure APIs.

### Storage

| Data | Store | Notes |
|---|---|---|
| Raw PDFs | S3 (SSE-KMS, per-firm prefix) | Lifecycle: archive to Glacier after 7 years |
| Matter metadata, extracted facts, audit log | RDS Postgres (Multi-AZ) | Read replicas as volume scales |
| Vector embeddings | pgvector on the same Postgres | Migrate to Pinecone / Weaviate when corpus >10M chunks |
| Firm templates | S3 + Postgres index | Versioned per firm |

### Auth & access

- **Auth0 or Clerk** for user auth.
- **SAML SSO** for firms above 10 seats (table stakes for legal buyers).
- **Per-firm tenancy**: every query, every doc, every model call is scoped to a `firm_id`. No cross-firm data leakage by construction.

### Security & compliance

- **Encryption**: at rest (KMS, per-firm KEK), in transit (TLS 1.3).
- **No client data trains models.** Anthropic API zero-retention mode; explicit DPA with every customer firm.
- **Audit log**: every read, write, edit, export — immutable, queryable per matter.
- **Right-to-delete**: matter-level data deletion within 30 days of request (GDPR Art. 17).
- **Compliance roadmap**:
  - **Year 1**: Cyber Essentials Plus (UK gov baseline; cheap, recognised).
  - **Year 1–2**: ISO 27001 (required for any enterprise / top-50 firm deal).
  - **Year 2**: SOC 2 Type II (for international expansion).

### Integrations (phased)

- **Phase 1 (MVP)**: PDF in, .docx out. No integrations.
- **Phase 2**: LEAP (largest UK conveyancing case management market share), then Actionstep.
- **Phase 3**: OSPREY, ALB, Clio. Outlook / Gmail email-in for the seller-pack workflow.
- **Phase 4**: Lender APIs (UK Finance / CML standard certificate format).

---

## 4. Scalability

### Unit economics

| Item | Cost per matter |
|---|---|
| LLM tokens (Claude, RAG, generation) | £0.50 – £2.00 |
| OCR (only on scans) | £0.00 – £0.30 |
| Infra (compute + storage amortised) | £0.10 |
| **Total cost** | **~£1 – £3** |
| **Sell price** | **£40 – £60** |
| **Gross margin** | **>95%** |

### Volume projections

| Stage | Firms | Matters/firm/mo | Matters/mo | MRR @ £50/matter |
|---|---|---|---|---|
| Year 1 pilot | 10 | 20 | 200 | £10k |
| Year 1 end | 50 | 25 | 1,250 | £62.5k |
| Year 2 | 250 | 25 | 6,250 | £312k |
| Year 3 (10% UK market) | 550 | 25 | 13,750 | £687k (£8.2M ARR) |
| Year 4 (UK + IE + AU/NZ + commercial tier) | 1,200+ | — | 35,000+ | £25M+ ARR |

These are bottom-up estimates from England & Wales transaction volumes; commercial conveyancing carries a 5–10× ticket multiplier.

### Technical scalability

- **Stateless API** + queue-driven workers → scales horizontally without architectural change up to ~10k concurrent matters.
- **Postgres** with read replicas comfortably handles the metadata layer to >100k matters/month.
- **Model API** is the actual bottleneck, not infra. Mitigations:
  - Aggressive **prompt caching** on the static parts (firm template, enquiry patterns, lender handbook context).
  - **Sonnet for default, Opus only for leasehold / commercial**, gated automatically.
  - **Batch mode** for non-urgent generation (overnight Report on Title drafts at 50% of API price).

### Geographic & vertical scaling

| Phase | Market | Why it works |
|---|---|---|
| 1 | UK residential (E&W) | Largest, most data, most pain |
| 2 | Lender certificates | Same engine, different output, same buyers |
| 3 | Scotland, NI, ROI | Shared legal lineage, ~20% template work |
| 4 | AU / NZ | Torrens system overlaps; same workflow shape |
| 5 | UK commercial conveyancing | 5–10× ACV, natural enterprise tier |
| 6 | Probate / property litigation adjacencies | Same firms, same docs, new use cases |

### The compounding moat

These get harder to dislodge as volume scales:

1. **Document corpus**. After 50k matters processed, the system has seen every weird covenant, every unusual search flag, every drafting trap. New entrants start from zero on edge-case recall.
2. **Firm-template library**. Every onboarded firm contributes a Report-on-Title template that's tuned, audited, and passes COLP/COFA review. The template fit becomes its own switching cost.
3. **Case management integrations**. Each integration is multi-month engineering plus partnership work. Year 2 we own LEAP and Actionstep; year 3 we own the long tail.
4. **Lender handbook fluency**. When Interfluo-generated Certificates of Title clear lenders without queries, we become default plumbing for the lender side too.
5. **Compliance posture**. ISO 27001 + UK-only data residency + per-firm tenancy is a 12–18 month investment that's invisible until a competitor tries to win an enterprise pilot without it.

---

## 5. Build path

| Phase | Duration | What ships |
|---|---|---|
| MVP | 4–8 weeks | PDF in, Word out. No integrations, no SSO. 3 friendly-firm pilots for free. |
| v1 | 3–4 months | SSO, firm templates, audit trail, redaction, billing. Convert pilots to paid. |
| v2 | 6–9 months | LEAP + Actionstep integration. Leasehold module. Cyber Essentials Plus. |
| v3 | 12 months | Lender certificate output. Commercial conveyancing pilot. ISO 27001 in flight. |
| v4 | 18–24 months | ROI / Scotland / AU launch. SOC 2 Type II. Commercial tier GA. |

---

## 6. Risks and how we de-risk them

| Risk | Mitigation |
|---|---|
| Solicitor distrust of AI output | Every assertion footnoted to source page; human in loop by design; PI-insurance-defensible audit trail |
| Hallucination on a legal fact | Structured extraction with schema enforcement; generation only over extracted facts, not free-form |
| Regulatory shift (SRA, Lender's Handbook) | Compliance roadmap; we are a tool, not the regulated entity (the solicitor is) |
| Data breach in a confidential matter | Per-firm KEK encryption; zero-retention model APIs; no training on client data; ISO 27001 |
| Incumbent case-mgmt system bundles its own AI | We integrate before they catch up; we win on doc reasoning depth they cannot match as a side feature |
| Orbital Witness or similar moves end-to-end | Their wedge is title review; ours is full pack → enquiries + Report. Race is to firm trust and integration depth |
