# Bench scenario baselines

Each entry records a scenario whose pipeline output has been validated as
acceptable. Changes to prompts, taxonomy, or pipeline code that cause a
baseline scenario to regress should be investigated before merging.

A baseline is **not** a claim that the product is "proven" overall - it
is a claim about a specific pack. Confidence at the product level
requires breadth (target: 20+ scenarios across the taxonomy with stable
metrics) and is the work tracked in the moat roadmap.

## Conventions

- Baselines are dated. They reflect the pipeline behaviour at that point
  in the calibration loop.
- A baseline can be **re-baselined** if a deliberate prompt or taxonomy
  change is expected to alter behaviour. Record the previous metrics
  alongside the new ones so the regression history stays auditable.
- Metrics are taken from the standard `pnpm --filter @interfluo/fixtures
  score` output.

## Frozen baselines

### `freehold-enforcement-and-undisclosed-occupier`

**Baseline as of 2026-06-27** (after PR #12 scorer fix + PR #13 calibration v2).

Three planted material issues plus routine noise. Tests
`PLANNING_BREACH_ENFORCEMENT`, `OCCUPIER_CONSENT_MISSING`,
`SEARCH_DRAINAGE_DISCREPANCY`, `SELLER_DISCLOSURE_INCONSISTENCY`,
`TITLE_CHARGE_DISCHARGE_EVIDENCE`.

Validated metrics:

```
Pattern-signal hit rate:    4 / 4 (100%)
Taxonomy code hit rate:     5 / 5 (100%)
Unexpected codes emitted:   1   (PLANNING_BUILDING_REGS_MISSING -
                                  defensible inference from enforcement
                                  notice referencing the permission)
Risks (C / H / M / L / I):  1 / 3 / 1 / 0 / 1
Enquiries (P1..P5):         3 / 2 / 4 / 1 / 0
Citations per risk:         1-2 (after analyse.ts dedup)
Over-flagging:              0 / 3   (was 3/4 reported in v1, scorer
                                      artefacts since removed)
```

Regression rules:

- Pattern-signal hit rate must remain 4/4.
- Taxonomy code hit rate must remain at least 4/5 (allow one routing
  drift, e.g. if the `PLANNING_TA6_SEARCH_DISCREPANCY` vs
  `SELLER_DISCLOSURE_INCONSISTENCY` split is re-tuned).
- No CRITICAL severity beyond the active enforcement notice.
- No P1 enquiry on Nationwide redemption, FENSA / NICEIC handover, or
  the permitted-development summer house.
- Top CRITICAL risk must have no more than 3 deduplicated citations.

If any of the above fail, treat as a regression. Investigate before
merging the change that caused it.

### `freehold-clean-with-satisfied-restriction`

**Baseline as of 2026-06-27** (first real API run).

Clean Newcastle freehold with a Form A trust restriction and a Lloyds
charge. No planted material issues; purpose is to confirm the pipeline
does not invent risks on routine packs.

Validated metrics:

```
Matter Quality Score:       97.0 / 100   (EXCELLENT)
Pattern-signal hit rate:    3 / 3 (100%)
Taxonomy code hit rate:     1 / 1 (100%)
Unexpected codes emitted:   1   (TITLE_RESTRICTION_CONSENT - the Form A
                                  restriction; model correctly placed it
                                  at LOW severity, so the code emission
                                  is observation not over-flagging)
Risks (C / H / M / L / I):  0 / 0 / 0 / 1 / 2
Enquiries (P1..P5):         0 / 0 / 6 / 2 / 0
Over-flagging:              0 / 3
```

Regression rules:

- No CRITICAL or HIGH severity risks.
- No P1 or P2 enquiries.
- The Form A restriction must not be escalated above LOW.

### `freehold-resolved-boundary-dispute`

**Baseline as of 2026-06-27** (first real API run).

Nottingham freehold where TA6 discloses a 2018 boundary disagreement
formally settled by a 2019 boundary agreement. Tests over-flag
suppression on resolved historical disputes.

Validated metrics:

```
Matter Quality Score:      100.0 / 100   (EXCELLENT)
Pattern-signal hit rate:    2 / 2 (100%)
Taxonomy code hit rate:     1 / 1 (100%)
Unexpected codes emitted:   0
Risks (C / H / M / L / I):  0 / 0 / 0 / 1 / 2
Enquiries (P1..P5):         0 / 0 / 4 / 2 / 0
Over-flagging:              0 / 2
```

Regression rules:

- BOUNDARY_DISPUTE_UNRESOLVED must NOT be emitted (the dispute is
  resolved).
- No CRITICAL or HIGH severity flag on the boundary point.
- Pipeline should request a copy of the boundary agreement (P3 or P4
  enquiry).

### `freehold-missing-building-regs-cert`

**Baseline as of 2026-06-27** (first real API run).

Cheltenham freehold where a 2020 rear extension was unquestionably built
(TA6 confirms) but the building regs completion certificate is genuinely
missing. Tests that PLANNING_BUILDING_REGS_MISSING fires on positive
evidence, not on the speculative pattern previously seen.

Validated metrics:

```
Matter Quality Score:      100.0 / 100   (EXCELLENT)
Pattern-signal hit rate:    3 / 3 (100%)
Taxonomy code hit rate:     2 / 2 (100%)   PLANNING_BUILDING_REGS_MISSING +
                                            TITLE_CHARGE_DISCHARGE_EVIDENCE
Unexpected codes emitted:   0
Risks (C / H / M / L / I):  0 / 0 / 1 / 0 / 1
Enquiries (P1..P5):         0 / 1 / 4 / 1 / 0
```

Regression rules:

- PLANNING_BUILDING_REGS_MISSING must be emitted on this pack.
- Severity should be MEDIUM (taxonomy default); HIGH only if lender
  position is explicitly known to require otherwise.

### `freehold-disclosure-inconsistency-flooding`

**Baseline as of 2026-06-27** (first real API run).

York riverside freehold where TA6 declares "no flooding" and "no
insurance claims", contradicted by drainage search (2019 fluvial flood,
0.4m ground-floor depth) and CON29 (2019 Aviva claim). Tests
SELLER_DISCLOSURE_INCONSISTENCY outside the planning context.

Validated metrics:

```
Matter Quality Score:      100.0 / 100   (EXCELLENT)
Pattern-signal hit rate:    4 / 4 (100%)
Taxonomy code hit rate:     4 / 4 (100%)   SELLER_DISCLOSURE_INCONSISTENCY,
                                            SEARCH_FLOOD_RISK,
                                            INSURANCE_CLAIM_DISCLOSED,
                                            TITLE_CHARGE_DISCHARGE_EVIDENCE
Unexpected codes emitted:   0
Risks (C / H / M / L / I):  0 / 1 / 2 / 2 / 1
Enquiries (P1..P5):         2 / 1 / 5 / 0 / 0
```

Regression rules:

- All four expected codes must be emitted.
- HIGH count should not inflate beyond the disclosure inconsistency.

### `leasehold-short-lease-and-escalation`

**Baseline as of 2026-06-27** (first real API run, after scorer regex
fix that allowed digits in code names).

Reading flat with a 1999 lease (~72 years remaining, below 80-year
lender floor), doubling ground rent, £3,200 service charge arrears, and
a January 2026 Section 20 notice for major roof works (£6,800 estimated
contribution). Tighter than leasehold-flat-with-issues so attribution
per code is unambiguous.

Validated metrics:

```
Matter Quality Score:      100.0 / 100   (EXCELLENT)
Pattern-signal hit rate:    5 / 5 (100%)
Taxonomy code hit rate:     5 / 5 (100%)   LEASE_SHORT_TERM,
                                            LEASE_GROUND_RENT_ESCALATION,
                                            LEASE_SERVICE_CHARGE_DISPUTE,
                                            LEASE_SECTION_20_MAJOR_WORKS,
                                            TITLE_CHARGE_DISCHARGE_EVIDENCE
Unexpected codes emitted:   0
Risks (C / H / M / L / I):  1 / 3 / 0 / 0 / 1
Enquiries (P1..P5):         2 / 3 / 8 / 0 / 0
```

Regression rules:

- All five expected codes must be emitted.
- The CRITICAL severity should be reserved for the deal-blocker
  combination (short lease + doubling ground rent affecting lender
  appetite).

### `leasehold-flat-with-issues`

**Baseline as of 2026-06-28** (first real API run since pre-taxonomy
era; expected-codes list refreshed in this run to reflect the four
taxonomy codes that did not exist when the scenario was originally
written).

Eleven planted issues across leasehold, planning, title, search, and
disclosure categories. The scenario covers more material ground than
any other in the corpus.

Validated metrics:

```
Matter Quality Score:       94.0 / 100   (EXCELLENT)
Pattern-signal hit rate:   11 / 11 (100%)
Taxonomy code hit rate:    11 / 11 (100%)
Unexpected codes emitted:   1   (PLANNING_BREACH_ENFORCEMENT - the model
                                  conflated the unauthorised kitchen
                                  extension with an active enforcement
                                  notice, which the pack does not show.
                                  Borderline; investigate if it recurs.)
Risks (C / H / M / L / I):  1 / 5 / 1 / 0 / 0
Enquiries (P1..P5):         4 / 5 / 8 / 1 / 0
Enquiry-noise penalty:      -3.0  (18 enquiries, above soft ceiling of 15)
```

Regression rules:

- All eleven expected codes must be emitted.
- No P1 enquiry on the routine mortgage redemption or service-of-notice
  fee to landlord.
- No new "PLANNING_BREACH_ENFORCEMENT" inflation when the CON29 does
  not record any enforcement notice.

### `freehold-house-clean`

**Baseline as of 2026-06-28** (first real API run).

The original clean control - no planted material issues.

Validated metrics:

```
Matter Quality Score:      100.0 / 100   (EXCELLENT)
Pattern-signal hit rate:    5 / 5 (100%)
Taxonomy code hit rate:     1 / 1 (100%)
Unexpected codes emitted:   0
Risks (C / H / M / L / I):  0 / 0 / 0 / 2 / 2
Enquiries (P1..P5):         0 / 0 / 7 / 1 / 0
```

Regression rules:

- No CRITICAL or HIGH severity risks.
- No P1 or P2 enquiries.
- No code emitted other than `TITLE_CHARGE_DISCHARGE_EVIDENCE`.

### `freehold-house-edge-cases`

**Baseline as of 2026-06-28** (first real API run since adversarial
antipatterns were tightened in PR #14).

Adversarial pack with six over-flag traps (Halifax redemption, 2019
boundary dispute since settled, conservation area covering only the
neighbour, 1923 covenant, standard £55 surface water charge, Wilmslow
Common proximity) plus three genuinely material items (adult occupier
John Wilson, 2024 planning permission for rear extension, kitchen
rewire 2022 without NICEIC).

Validated metrics:

```
Matter Quality Score:       97.0 / 100   (EXCELLENT)
Pattern-signal hit rate:    3 / 3 (100%)
Taxonomy code hit rate:     3 / 3 (100%)
Unexpected codes emitted:   1   (PLANNING_TA6_SEARCH_DISCREPANCY - the
                                  model picked up a cross-document
                                  contrast on the unexercised 2024
                                  permission. Borderline.)
Over-flagging:              0 / 6  (every adversarial trap correctly
                                     low-severity)
Risks (C / H / M / L / I):  0 / 1 / 2 / 2 / 1
Enquiries (P1..P5):         1 / 2 / 5 / 1 / 0
```

Regression rules:

- All three expected codes must be emitted.
- Over-flagging count must remain 0 / 6 (the adversarial test).
- John Wilson occupier and kitchen rewire are P1 / P2 ceiling.

## Summary across all 9 validated baselines (2026-06-28)

| Scenario | Score | Signal | Code | Unexpected |
|---|---|---|---|---|
| freehold-enforcement-and-undisclosed-occupier | 97.0 | 4/4 | 5/5 | 1 |
| freehold-clean-with-satisfied-restriction | 97.0 | 3/3 | 1/1 | 1 |
| freehold-resolved-boundary-dispute | 100.0 | 2/2 | 1/1 | 0 |
| freehold-missing-building-regs-cert | 100.0 | 3/3 | 2/2 | 0 |
| freehold-disclosure-inconsistency-flooding | 100.0 | 4/4 | 4/4 | 0 |
| leasehold-short-lease-and-escalation | 100.0 | 5/5 | 5/5 | 0 |
| leasehold-flat-with-issues | 94.0 | 11/11 | 11/11 | 1 |
| freehold-house-clean | 100.0 | 5/5 | 1/1 | 0 |
| freehold-house-edge-cases | 97.0 | 3/3 | 3/3 | 1 |

**Average: 98.3 / 100. Across the corpus: 40 / 40 pattern signals,
33 / 33 expected taxonomy codes, 0 / 8 over-flags on the 3 scenarios
that carry adversarial antipatterns.**

## Honest gaps in the corpus

- **17 of 21** taxonomy codes appear in at least one scenario's
  `EXPECTED_ISSUE_CODES` (was 13 before the `leasehold-flat-with-issues`
  list refresh added `LEASE_ALTERATIONS_CONSENT`,
  `TITLE_CHARGE_DISCHARGE_EVIDENCE` already counted,
  `SEARCH_DRAINAGE_DISCREPANCY` already counted,
  `SELLER_DISCLOSURE_INCONSISTENCY` already counted - net +1).
  The remaining **4** are uncovered:
  - `TITLE_OVERRIDING_INTERESTS`
  - `TITLE_DEFECTIVE_INDEMNITY_REQUIRED`
  - `SEARCH_CONTAMINATED_LAND`
  - `MORTGAGE_OFFER_EXPIRY_RISK`
  Plus two adjacent gaps:
  - `OCCUPIER_TENANCY_UNDISCLOSED` (taxonomy distinguishes this from
    `OCCUPIER_CONSENT_MISSING`; needs a scenario where the occupier is
    not acknowledged anywhere in the pack)
  - `BOUNDARY_DISPUTE_UNRESOLVED` (currently tested as a must-not-emit
    guard; needs a scenario that legitimately emits it)
  - `PLANNING_TA6_SEARCH_DISCREPANCY` (model emits it organically; no
    scenario explicitly expects it)
- Growth of the corpus should follow real pilot pack patterns, not
  speculative coverage. Per the GPT review, the strategic next step is
  one real conveyancer reviewing one real-looking pack, not more
  synthetic scenarios.
