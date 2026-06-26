# Interfluo — Overview

> AI co-pilot for UK residential conveyancing fee-earners. One screen, one verb: *"draft my enquiries and Report on Title from this pack."*

This document is the single source of truth for what Interfluo is, how it's built, and how it runs. It complements `README.md` (which is the business pitch) and `CLAUDE.md` (which is the brand bible).

---

## 1. Product

### The wedge

A UK residential conveyancing fee-earner spends 4–8 hours per matter on three high-cognitive tasks:

1. Reading the contract pack, property forms, and search results.
2. Drafting **enquiries** to raise with the seller's solicitor.
3. Drafting the **Report on Title** for the buyer client.

Interfluo automates 2 and 3. The fee-earner uploads the pack, the model produces a ranked list of enquiries and a first-draft Report on Title with every assertion cited back to its source page. The fee-earner accepts, edits, rejects, and exports in 30–60 minutes of *review* — not 4–6 hours of *drafting*.

### Target user

- **Primary buyer:** conveyancing partner or COLP at a 5–30 fee-earner residential firm.
- **Primary user:** fee-earner / licensed conveyancer doing the matter.
- **Sales motion:** per-firm pilot on real matters → adoption → per-matter contract (£40–60/matter).

### Out of scope (deliberately)

- AML / source-of-funds (covered by Thirdfort, Armalytix).
- Case management (LEAP, Actionstep — Interfluo integrates, doesn't replace).
- Completion ledger / SDLT filing / Land Registry submission.

---

## 2. Architecture

### High-level

```
┌──────────────────────────────────────────────────────────────────────┐
│  apps/web — Next.js 15, UI only                                      │
│  Pure client components. All data via SDK → API. No business logic.  │
└──────────────────────────────────────────────────────────────────────┘
                              │  HTTPS + Bearer token
                              ▼
┌──────────────────────────────────────────────────────────────────────┐
│  apps/api — Hono on Node                                             │
│  Clerk JWT verification → firm-scoped CRUD + AI pipeline orchestration│
└──────────────────────────────────────────────────────────────────────┘
       │              │              │                  │
       ▼              ▼              ▼                  ▼
   Postgres      Local FS      Anthropic API        Clerk API
   (Neon)        (blobs)       (Claude Sonnet 4.6)  (auth, orgs)
```

### Five-stage AI pipeline

```
1. INGEST       PDF upload → pdfjs text extraction (per-page).
                Low text density (< 60 chars/page) → fall back to
                Claude vision OCR via Anthropic PDF document input.

2. EXTRACTION   Per-doc-type structured extraction via Claude tool use.
                Every fact carries {documentId, pageNumber, quote}.

3. ANALYSIS     Risk identification (severity-graded) from the full
                fact set. Strict severity ladder applied via prompt.

4. GENERATION   Enquiries drafted (priority-graded). Report on Title
                drafted in fixed section structure. Both grounded by
                short-id citations mapped back to facts.

5. REVIEW       Side-by-side UI: source PDF viewer + AI output, citation
                chip jumps to cited page with quote banner. Accept,
                reject, edit per enquiry. Export to .docx (firm template
                or house style).
```

### Monorepo layout

```
interfluo/
├── apps/
│   ├── api/                       Hono API service (Node ESM, tsx runtime)
│   └── web/                       Next.js 15 frontend (App Router, RSC)
├── packages/
│   ├── core/                      Domain types + Zod schemas (the contract)
│   ├── pdf/                       PDF text extraction (pdfjs-dist legacy build)
│   ├── ai/                        Anthropic SDK wrappers + prompts + pipeline
│   ├── storage/                   MatterRepository interface + Postgres/memory adapters
│   ├── sdk/                       Typed REST client used by the frontend
│   ├── fixtures/                  PDF generators + benchmark + scorer
│   └── tsconfig/                  Shared TypeScript configs
├── docs/                          (none — README/OVERVIEW/CLAUDE at root)
├── package.json                   pnpm workspace root
├── pnpm-workspace.yaml
├── turbo.json                     Turborepo pipeline
├── biome.json                     Biome formatter + linter
└── tsconfig.base.json             Strict TypeScript base config
```

**No backend code in the frontend.** This is a hard architectural rule:

- `apps/web` is pure UI. It uses Clerk's React SDK, calls `apps/api` via the typed SDK, and has no server actions doing business logic.
- All AI calls, all DB queries, all blob writes happen in `apps/api`.
- The contract between them is the Zod schemas in `packages/core`.

---

## 3. Data model

### Domain types (`@interfluo/core`)

| Type | Purpose |
|---|---|
| `Matter` | A single conveyancing transaction. Scoped to a `firmId`. |
| `Document` | A PDF uploaded against a matter. Has `documentType` (classified) and `extractionMethod` (`text` or `ocr`). |
| `ExtractedFact` | A single fact pulled from a document, with a verbatim `Citation`. |
| `Citation` | `{documentId, documentName, documentType, pageNumber, quote}` — the grounding primitive. |
| `RiskFlag` | A material issue identified across the fact set. Severity: `critical`/`high`/`medium`/`low`/`informational`. |
| `Enquiry` | A drafted question to send to the seller's solicitor. Priority 1–5. Status: `suggested`/`accepted`/`rejected`/`edited`. |
| `ReportOnTitle` | The buyer-facing report. Summary + fixed sections + per-section citations. |
| `MatterPipelineStatus` | Live state for the polling UI during a pipeline run. |
| `FirmTemplate` | An uploaded `.docx` template (kind = `report` or `enquiries`) used by the export engine. |

### Database (Postgres via Drizzle ORM)

Eight tables, all firm-scoped where applicable:

- `matters` (firm-scoped, `firmId` = Clerk org id)
- `documents` (FK matters, on delete cascade)
- `extracted_facts` (FK matters + documents)
- `risk_flags` (FK matters)
- `enquiries` (FK matters)
- `reports` (1:1 with matter, PK = matterId)
- `pipeline_status` (1:1 with matter, PK = matterId)
- `firm_templates` (firm-scoped, one row per `kind`)

JSONB columns for `extracted_facts.value`, `extracted_facts.citation`, `risk_flags.citations`, `enquiries.citations`, `reports.sections`. Timestamps are normalised to ISO 8601 on read for frontend consistency.

Migrations are managed by drizzle-kit (`pnpm --filter @interfluo/storage db:generate` to author, `db:migrate` to apply).

### API surface (`/v1/*`, Clerk-protected)

| Method | Path | Purpose |
|---|---|---|
| GET | `/v1/matters` | List firm's matters |
| POST | `/v1/matters` | Create matter |
| GET | `/v1/matters/:id` | Full detail (matter + documents + facts + risks + enquiries + report + pipeline) |
| PATCH | `/v1/matters/:id` | Edit metadata |
| DELETE | `/v1/matters/:id` | Delete matter + all docs + blobs |
| POST | `/v1/matters/:id/documents` | Multipart PDF upload (1+ files); ingests + classifies |
| PATCH | `/v1/matters/:m/documents/:d` | Reclassify document |
| DELETE | `/v1/matters/:m/documents/:d` | Remove document + blob |
| GET | `/v1/matters/:m/documents/:d/pdf` | Stream the PDF (for the viewer drawer) |
| POST | `/v1/matters/:id/process` | Kick off pipeline run (returns 202 immediately) |
| GET | `/v1/matters/:id/pipeline` | Poll pipeline status |
| PATCH | `/v1/matters/:m/enquiries/:e` | Accept / reject / edit enquiry |
| GET | `/v1/matters/:id/export/enquiries.docx` | Word export |
| GET | `/v1/matters/:id/export/report.docx` | Word export (firm template if uploaded, else house style) |
| GET | `/v1/firm-templates` | List firm's templates |
| POST | `/v1/firm-templates` | Upload `.docx` template |
| DELETE | `/v1/firm-templates/:kind` | Delete template |

Public:

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | Liveness probe |

---

## 4. AI pipeline

### Model strategy

- **Default**: `claude-sonnet-4-6` for classification, extraction, analysis, enquiries, report, OCR.
- **Reasoning fallback**: `claude-opus-4-7` configurable for complex leasehold / commercial matters (not yet auto-triggered).
- **No fine-tuning at MVP** — entirely prompt engineering + structured outputs (tool use) + retrieval-free context.

### Stage-by-stage

#### Classification (`packages/ai/src/classify.ts`)
- Takes the first 3 pages of a PDF (truncated).
- One-shot tool call with `classify_document` enum over the 17 document types.
- Returns `{documentType, confidence, reasoning}`.
- Benchmarked at 99% confidence on text-PDF fixtures across all types.

#### Extraction (`packages/ai/src/extract.ts`)
- Per-document-type guided extraction. Each `DocumentType` has a `factsToFind` checklist baked into the prompt (e.g. for `lease`: term, ground rent review, service charge, alterations restriction, forfeiture).
- Tool: `record_facts` with `{category, key, value, pageNumber, quote}` per fact.
- Post-validator rejects facts with placeholder quotes (`<UNKNOWN>`, `[redacted]`, `N/A`, etc.) and facts whose quote doesn't appear in the cited page's text.

#### Analysis (`packages/ai/src/analyse.ts`)
- Receives all facts (cross-document).
- Tool: `record_risks` with severity ladder applied STRICTLY:
  - `critical` = deal-blocker, advise client not to proceed
  - `high` = must resolve before exchange
  - `medium` = significant matter, often remediable by undertaking/indemnity
  - `low` = note to client
  - `informational` = routine items (mortgage discharge, notice of assignment)
- Anti-pattern table in the prompt explicitly enumerates routine items that are NOT to be promoted.

#### Enquiries (`packages/ai/src/enquiries.ts`)
- Receives all facts and identified risks.
- Tool: `record_enquiries` with priority 1–5 (P1 = deal-critical, P5 = note-only).
- Categorised into 14 enquiry categories (title, boundaries, covenants, easements, planning, building regulations, environmental, utilities, leasehold, searches, fixtures, occupiers, disputes, other).

#### Report on Title (`packages/ai/src/report.ts`)
- Receives all facts, risks, enquiries.
- Tool: `record_report` with summary + fixed 10-section structure (Property, Title and Tenure, Restrictions/Covenants/Easements, Planning, Searches, Services, Lease Terms [leasehold only], Mortgage [if applicable], Risks and Outstanding Enquiries, Recommended Next Steps).

#### OCR fallback (`packages/ai/src/ocr.ts`)
- Triggered when pdfjs text extraction returns < 60 chars/page on average.
- Sends the PDF directly to Anthropic via the `document` content block (PDF document input, available since Oct 2024).
- Single tool call (`record_pages`) transcribes every page in order.
- Limits: 32 MB / 100 pages per Anthropic constraints.
- Cost: ~$0.005/page (Sonnet 4.6 PDF input pricing).

### Citation grounding

Non-negotiable: every line in the Report on Title and every enquiry maps back to a specific page in a specific source document. Implementation:

1. Extraction stores `{fact, documentId, pageNumber, verbatim_quote}` per fact.
2. Subsequent stages (analyse, enquiries, report) receive **short fact IDs** (`F001`, `F002`, …, `R001`, `R002`) instead of UUIDs. LLMs reliably copy short tokens; they hallucinate UUIDs.
3. Tool inputs require `supportingFactIds: ["F012", "F045"]` arrays.
4. On return, we map short IDs back to full UUIDs and resolve citations through to the Citation chip in the UI.

### Severity & priority calibration

The single biggest prompt-quality lever. The prompts contain **strict anti-pattern tables** with concrete examples of what NOT to flag as `critical` or `P1` (e.g. existing seller's mortgage to be redeemed = `informational` / `P3`, not `critical`). Two benchmark runs on a clean control scenario confirm zero `critical` and zero `P1` flags on routine items.

---

## 5. Infrastructure

### Current dev state

| Concern | Today | Production target (per `README.md`) |
|---|---|---|
| **Hosting** | Local dev (Mac/Linux) | AWS `eu-west-2` (London) — UK data residency for SRA compliance |
| **API runtime** | `tsx watch` on Node 24 | ECS Fargate containers; queue-driven workers (SQS) |
| **Web hosting** | `next dev` | Vercel or Fargate behind ALB |
| **Database** | Neon Postgres (eu-west-2 pooler) | RDS Postgres Multi-AZ |
| **Blob storage** | Local filesystem (`.data/blobs`) | S3 (SSE-KMS, per-firm prefix; Glacier after 7 years) |
| **Auth** | Clerk (Organizations as firms) | Clerk → swap to WorkOS when SAML SSO becomes table-stakes |
| **AI provider** | Anthropic API (zero-retention mode) | Same — DPA per firm |
| **OCR** | Anthropic PDF document input (Claude vision) | Add Azure Document Intelligence as production-grade fallback for very large packs |
| **Search/embeddings** | None yet | pgvector on same Postgres for enquiry-pattern corpus (year 2) |

### Tenancy

- Every API request resolves `userId` + `firmId` from the Clerk JWT (`org_id` claim, configured via a session-token template in the Clerk dashboard).
- `firmId` = Clerk organization id. Every matter row, every blob path, every template carries it.
- `firm_default` is gone — orphaned legacy rows exist in dev but are invisible to current org members.
- Cross-firm access is impossible by construction: every service helper calls `ensureMatterInFirm(ctx, firmId, id)` before touching downstream data.

### Security posture (current vs roadmap)

**Today (dev):**
- TLS everywhere in front of Clerk and Anthropic; local API is HTTP for dev only.
- Bearer token on every `/v1/*` request, verified server-side via `@clerk/backend`'s `verifyToken`.
- Per-firm scoping enforced at the service layer, not just route layer.
- Secrets in `.env.local` (gitignored).
- Hono `secureHeaders()` middleware on all routes.
- CORS restricted to `WEB_ORIGIN`.

**Year-1 production targets** (per README §3):
- Cyber Essentials Plus
- Anthropic zero-retention DPA in place per firm
- KMS encryption at rest with per-firm KEK
- Audit log: every read, write, edit, export — immutable, queryable per matter
- Right-to-delete: matter-level data deletion within 30 days (GDPR Art. 17)

**Year-2:** ISO 27001. **Year-2/3:** SOC 2 Type II.

### Cost model

Per matter (~9 PDFs, ~200 extracted facts):

| Component | Cost |
|---|---|
| Classification (9 × Sonnet calls) | ~£0.02 |
| Extraction (9 × Sonnet calls) | ~£0.30 |
| Analysis (1 × Sonnet call, ~200 facts) | ~£0.10 |
| Enquiries (1 × Sonnet call) | ~£0.15 |
| Report (1 × Sonnet call) | ~£0.20 |
| OCR (only if scanned, ~10 pages × £0.04) | £0.00 – £0.40 |
| Infra + blob + DB amortised | ~£0.10 |
| **Total cost per matter** | **£0.87 – £1.27** |
| **Sell price** | **£40 – £60** |
| **Gross margin** | **>97%** |

---

## 6. Brand

The brand bible lives in `CLAUDE.md`; this section is the operational summary.

### Feeling

Interfluo reads as **established legal infrastructure, not a chatbot.** Quiet, precise, citation-grounded. Pick the calmer and more restrained option. UK English everywhere.

### Logo

Typographic — no illustrated symbol.

- **Mark:** lowercase `if`, **Instrument Serif italic**, `letter-spacing: -0.02em`, Ink.
- **Wordmark:** `Interfluo`, **Hanken Grotesk 600**, `letter-spacing: -0.015em`, Ink.
- **Lockup:** mark + 1px hairline divider + wordmark, vertically centred.
- Implementation: `apps/web/src/brand/Logo.tsx`, `<Logo />`, `<Logo variant="mark" />`, etc.
- Static SVGs at `apps/web/public/{favicon,logo-mark,logo-lockup}.svg`.

### Colour

Monochrome by default — Ink on warm Paper. **One** accent (Conveyance Green) for primary actions/links/confirmations.

| Token | Hex | Role |
|---|---|---|
| `--ink` | `#17181C` | Primary text, the mark, dark surfaces |
| `--ink-soft` | `#4A4842` | Secondary text |
| `--muted` | `#736F64` | Tertiary text, citations |
| `--paper` | `#F5F1E9` | Primary background (warm) |
| `--paper-dim` | `#ECE7DC` | App chrome behind cards |
| `--surface` | `#FFFFFF` | Cards, inputs |
| `--line` | `#E2DCCF` | Borders, dividers |
| `--line-strong` | `#C9C2B2` | Stronger borders, dashed dropzones |
| `--accent` | `#2E5C46` | Conveyance Green — primary buttons, links, active |
| `--accent-dark` | `#234A38` | Hover / pressed |
| `--accent-tint` | `#E7EFE9` | Positive surfaces |
| `--danger` | `#B23B2E` | Errors, destructive only |

### Typography

Two families, no exceptions.

- **Instrument Serif** (400 / 400 italic) — display headlines, the mark. Large & sparse only.
- **Hanken Grotesk** (400/500/600/700) — everything else.

### Components

The design system is hand-rolled (no shadcn CLI) in `apps/web/src/components/ui/`:

- `Button` — primary (Conveyance Green) / secondary / ghost / danger
- `Input` with label, hint, error
- `Card`, `CardHeader`, `CardBody`, `CardFooter`
- `Badge` (neutral / ink / accent / success / warn / danger / muted)
- `Spinner`, `ProgressBar`, `EmptyState`, `ConfirmDialog`
- `CitationChip` — quiet by default, hover-tooltip reveals quote, click opens viewer drawer
- `DocumentTypePicker` — inline reclassification dropdown

Tailwind v4 with `@theme` block in `src/styles/globals.css` exposes the brand tokens as utility classes (`bg-accent`, `text-ink-soft`, etc.).

### Voice

Precise, calm, grounded — infrastructure a 30-year conveyancing partner trusts. Always cite the source document and page. Confident, never overclaiming. No emojis. No US spelling. No hype copy.

---

## 7. Testing & validation

### Synthetic fixtures (`@interfluo/fixtures`)

A workspace package that generates realistic conveyancing PDFs with planted issues, then runs the full pipeline against them and scores the output.

**Scenarios:**

- `leasehold-flat-with-issues` — 9 PDFs (title register, lease, TA6, TA7, TA10, CON29, drainage search, mortgage offer, draft contract). Planted issues span title restriction, lease term <80yrs, doubling ground rent, unauthorised extension + planning enforcement, TA6/drainage discrepancy, Section 20 major works, service charge dispute, insurance claim, etc.
- `freehold-house-clean` — 6 PDFs, intentionally clean. Hallucination control.

**Commands:**

```bash
pnpm --filter @interfluo/fixtures generate leasehold-flat-with-issues
pnpm --filter @interfluo/fixtures bench leasehold-flat-with-issues
pnpm --filter @interfluo/fixtures score /tmp/bench-output.txt leasehold-flat-with-issues
```

Each scenario writes an `EXPECTED-FINDINGS.md` next to the PDFs — the yard-stick for evaluating output.

**Current benchmark results** (4 independent runs total, post severity calibration):

| Scenario | Run | Hit rate | Critical | High | P1 | Hallucinations |
|---|---|---|---|---|---|---|
| Leasehold | A | 11 / 11 | 1 | 4 | 5 | 0 |
| Leasehold | B | 11 / 11 | 1 | 3 | 4 | 0 |
| Freehold | A | 5 / 5 | 0 | 0 | 0 | 0 |
| Freehold | B | 5 / 5 | 0 | 0 | 0 | 0 |

Severity calibration is correct: the single `critical` flag on the leasehold scenario is the unexpired-term issue (genuinely deal-blocking per the mortgage offer's special condition).

---

## 8. How to run locally

### Prerequisites

- Node 20+
- pnpm 11+
- An Anthropic API key
- A Clerk application with **Organizations enabled** + "Force users to have an active organization" + a session-token template that includes `org_id`
- A Postgres connection string (Neon free-tier works perfectly)

### Setup

```bash
git clone <repo>
cd interfluo
pnpm install                # also runs postinstall to copy the pdfjs worker
cp .env.example .env.local  # then edit:
```

`.env.local`:

```
ANTHROPIC_API_KEY=sk-ant-...
DATABASE_URL=postgresql://...?sslmode=require
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

### Apply database migrations

```bash
pnpm --filter @interfluo/storage db:migrate
```

### Boot both services

```bash
# Terminal A — API on :4000
pnpm --filter @interfluo/api dev

# Terminal B — Web on :3000
pnpm --filter @interfluo/web dev
```

Visit http://localhost:3000, sign up, create a firm (organisation), drop in PDFs, run the pipeline.

### Run the benchmark

```bash
pnpm --filter @interfluo/fixtures generate leasehold-flat-with-issues
pnpm --filter @interfluo/fixtures bench leasehold-flat-with-issues > out.txt
pnpm --filter @interfluo/fixtures score out.txt leasehold-flat-with-issues
```

### Typecheck the whole monorepo

```bash
for p in core storage sdk api ai pdf fixtures web; do
  pnpm --filter @interfluo/$p typecheck
done
```

---

## 9. Roadmap

### Shipped (MVP complete)

- ✅ Monorepo (pnpm + Turborepo, Biome, strict TS, 8 packages, 2 apps)
- ✅ Auth (Clerk with Organizations as firms, JWT verification on API)
- ✅ Persistence (Neon Postgres via Drizzle, migrations, blob store)
- ✅ Five-stage AI pipeline (classify → extract → analyse → enquiries → report)
- ✅ Source-citation grounding (every assertion → document + page + quote)
- ✅ OCR fallback (Claude vision for scanned PDFs)
- ✅ Severity / priority calibration (validated by benchmark)
- ✅ Document viewer drawer (PDF render + cited-page jump + quote banner)
- ✅ Enquiries panel (accept/reject/edit, inline editor, filter)
- ✅ Report on Title view
- ✅ Export to .docx (firm template engine OR house style)
- ✅ Edit matter metadata
- ✅ Manual classification override
- ✅ Add documents to existing matter
- ✅ Delete document / delete matter
- ✅ Firm-template engine (docxtemplater)
- ✅ Test fixtures + benchmark + auto-scorer (regression-defensible)

### Next (polish before pilot)

1. **Show to a real conveyancer.** Highest-leverage validation.
2. **Onboarding polish** — collect SRA number, firm name, postcode during sign-up; brand the Clerk invite emails.
3. **Branded Clerk emails** (current emails are default Clerk style).
4. **Invite teammates** — wire Clerk's invite flow into a UI.

### Year-1

5. Cyber Essentials Plus accreditation.
6. ISO 27001 in flight.
7. LEAP integration (largest UK conveyancing case management).
8. Actionstep integration.
9. Audit log surface (every read/write/edit/export per matter).
10. Right-to-delete UX (GDPR Art. 17 compliance flow).
11. Email-in (forward seller pack to unique per-matter address).

### Year-2

12. Lender certificate output (UK Finance / CML standard format).
13. Commercial conveyancing pilot.
14. Leasehold specialist module (lease analysis as its own pipeline stage).
15. Scotland / NI / ROI expansion (~20% template work).

---

## 10. Key files (cheat-sheet)

| Looking for… | File |
|---|---|
| Domain types | `packages/core/src/types/index.ts` |
| Zod schemas | `packages/core/src/schemas/index.ts` |
| AI prompts | `packages/ai/src/prompts/*.ts` |
| AI pipeline orchestration | `packages/ai/src/pipeline.ts` |
| Anthropic client setup | `packages/ai/src/client.ts` |
| OCR | `packages/ai/src/ocr.ts` |
| Postgres schema | `packages/storage/src/db/schema.ts` |
| Postgres adapter | `packages/storage/src/adapters/postgres.ts` |
| API entry | `apps/api/src/index.ts` |
| API config + env | `apps/api/src/config.ts` |
| API auth middleware | `apps/api/src/auth.ts` |
| API routes (matters) | `apps/api/src/routes/matters.ts` |
| API routes (templates) | `apps/api/src/routes/firm-templates.ts` |
| Export service | `apps/api/src/services/export-service.ts` |
| Web routes | `apps/web/src/app/**/page.tsx` |
| Web SDK client | `apps/web/src/lib/api.ts` (the `useApi` hook) |
| Brand tokens | `apps/web/src/brand/tokens.css` |
| Logo | `apps/web/src/brand/Logo.tsx` |
| App shell | `apps/web/src/components/layout/shell.tsx` |
| Matter workspace | `apps/web/src/features/matters/matter-workspace.tsx` |
| Citation chip | `apps/web/src/components/citation-chip.tsx` |
| Viewer drawer | `apps/web/src/features/viewer/document-viewer-drawer.tsx` |
| Fixture generators | `packages/fixtures/src/generators/*.ts` |
| Benchmark | `packages/fixtures/src/bench.ts` |
| Scorer | `packages/fixtures/src/score.ts` |

---

*This document tracks the actual state of the build. If something here disagrees with the code, the code wins — update this doc.*
