# SSOT Binding Guard

Authority class: current summary. Evidence method: automated, executor-run. Not independent.

## Rule enforced

A merge is blocked when any bound document declares a commit other than the repository HEAD under
review. The guard checks declaration freshness only. It does not approve, validate, release, or
confer authority on anything, and it does not verify that the bound figures are accurate.

## Bound documents

| Document | Declaration form read by the guard |
|---|---|
| `SSLS-FND-001-current-state-ssot-v0.1-CANDIDATE.md` | `- **Bound to commit:** \`<sha>\`` |
| `PROVENANCE_REPORT.md` | `\| HEAD commit \| \`<sha>\` \|` |
| `BUILD_MANIFEST.md` | "All values inspected at commit `<sha>`" |
| `TEST_BUILD_STATUS.md` | "Bound to commit `<sha>`" |

## Mechanism

| Component | Path |
|---|---|
| Pure comparison logic | `scripts/ssot-binding.mjs` |
| Executable check | `scripts/check-ssot-binding.mjs` |
| Local command | `bun run check:ssot-binding` |
| CI workflow | `.github/workflows/ssot-binding.yml` |
| Unit tests | `src/test/ssot-binding.test.ts` (7 cases) |

Commit resolution order: `--head=<sha>`, then `SSOT_HEAD_SHA`, then `git rev-parse HEAD`. On a pull
request the workflow sets `SSOT_HEAD_SHA` to the pull-request head SHA, not the synthetic merge
commit. Exit code 1 on mismatch, missing declaration, or unreadable document.

To make the check blocking, mark "SSOT declared binding matches HEAD" as a required status check on
the protected branch. That is a repository-settings action outside this project.

## Limitation

The guard cannot detect a document that declares the correct commit while carrying figures captured
at an earlier one. Only re-executing build and test evidence at the commit under review establishes
that, and no automated check substitutes for it.

## Register linkage

| Record | Meaning |
|---|---|
| EV-013 | Superseded binding at `70c1f89` — historical evidence, state stale |
| EV-014 | Current binding at `6aa254e` — current summary, state confirmed |
| EV-015 | This guard — current summary, state confirmed |
