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
