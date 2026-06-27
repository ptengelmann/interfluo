# Contributing to Interfluo

Interfluo is a closed-source commercial product in pilot. External
contributions are not accepted at this stage. This document records the
internal workflow so future collaborators can be onboarded quickly.

## Branch naming

| Prefix      | Purpose                                          |
| ----------- | ------------------------------------------------ |
| `feat/`     | New product capability                           |
| `fix/`      | Bug fix                                          |
| `chore/`    | Tooling, dependencies, repo housekeeping         |
| `docs/`     | Documentation only                               |
| `refactor/` | Internal restructure with no behaviour change    |
| `perf/`     | Performance improvement                          |
| `test/`     | Test additions or fixes                          |
| `redesign/` | Visible UI redesign with no behaviour change     |

Branches are created from `main` and target `main` via pull request. Direct
pushes to `main` are blocked.

## Commit messages

Conventional commits, scoped where useful.

    feat(citations): support multi-page citations end-to-end
    fix(ingest): per-page OCR detection for mixed-mode PDFs
    chore(repo): enable Dependabot security updates

Subject lines under 72 characters. Body wrapped at 72. Reference issues with
`closes #N` or `refs #N` in the body. UK English throughout.

## Pull requests

Every change ships through a PR with:

- A descriptive title that follows the commit convention
- A short summary of what changed and why
- A test plan (manual or automated) where the change affects behaviour
- CI passing on typecheck, lint, and build

Squash-merge is the default. Branches are auto-deleted after merge.

## Local development

```sh
pnpm install
pnpm dev          # runs all apps in parallel via Turborepo
pnpm typecheck    # all workspaces
pnpm check        # biome lint + format
pnpm build        # production build of all apps
```

## What to read first

- `OVERVIEW.md` - product, architecture, pipeline, current state
- `CLAUDE.md` - brand and UI spec; load before generating any visual
- `README.md` - the business pitch
- `SECURITY.md` - vulnerability reporting policy

## Definition of done for any feature

1. Typecheck, lint, and build pass locally and in CI.
2. UK English throughout; no emoji; no AI-as-personality copy.
3. Any AI-generated UI surface shows a citation (document + page).
4. Severity calibration respected: `critical` means deal-blocker only.
5. Audit log entries written for accept, edit, reject, and export actions.
6. Brand tokens used; never recoloured or restyled.
