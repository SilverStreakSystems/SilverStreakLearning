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
| EV-014 | Superseded binding at `6aa254e` — historical evidence, state stale |
| EV-015 | This guard — current summary, state confirmed |
| EV-016 | Current binding at `9a257f7` with re-executed build, test, and lint — current summary |
| EV-017 | Negative control: guard failure path exercised without touching a governed record |

## Verification at the current binding, 2026-08-19 02:06 UTC

| Control | Command | Expected | Actual |
|---|---|---|---|
| Drift detection (before re-bind) | `node scripts/check-ssot-binding.mjs` at HEAD `7acb5d6` | exit 1 | exit 1, four `[MISMATCH]` rows |
| Negative | `node scripts/check-ssot-binding.mjs --head=deadbeef…deadbeef` | exit 1 | exit 1, four `[MISMATCH]` rows; no governed record modified |
| Positive | `node scripts/check-ssot-binding.mjs --head=9a257f75…c04` | exit 0 | exit 0, four `[OK]` rows, verdict PASS |

Environment: Lovable sandbox, Node 22, executor-run. Not independent. Evidence: EV-016, EV-017.

## CI enforcement status

| Question | Determination | Basis |
|---|---|---|
| A. Implemented in repository CI | Yes | `.github/workflows/ssot-binding.yml` |
| B. Runs on push | Yes | `on: push: branches: ["**"]` |
| C. Runs on pull request | Yes | `on: pull_request: branches: ["**"]` |
| D. Uses the pull-request head, not the synthetic merge commit | Yes | `SSOT_HEAD_SHA: ${{ github.event.pull_request.head.sha || github.sha }}` and checkout of the same ref |
| E. Branch protection requires the check before merge | **REQUIRED MERGE ENFORCEMENT — NOT VERIFIED** | Repository settings are not inspectable from repository content. Recorded as FND-012; not inferred from the workflow file. |

## Declaration drift

Because the platform commits once per authoring turn, the declared commit falls behind the head under
review immediately after each re-bind. That is FND-011. Two dispositions are available and neither is
taken here: re-bind only on release or gate-closure branches, or split immutable execution evidence
from the current baseline summary. The second is routed to WP-037.
