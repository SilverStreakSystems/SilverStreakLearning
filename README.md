# SSLS 2.0 — Founder Operator Shell

Public synthetic prototype for Silver Streak Learning Systems (SSLS). Every
record in the interface is synthetic. The application holds no personal data,
no district data, no production data, no AI features, no backend, no
authentication, and no external integrations.

Governance canon lives in `docs/`. The canonical program state is
`docs/CURRENT_STATE.md`, which is generated — never hand edited — from the
inputs declared in `data/current-state/current-state-inputs.json`.

## Prerequisites and pinned versions

| Tool                                | Version                          | Where it is declared                                                                                             |
| ----------------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Bun (package manager and runtime)   | `1.3.3`                          | `packageManager` in `package.json`, `engines.bun`, `.bun-version`, and every workflow's `oven-sh/setup-bun` step |
| Node (used by the evidence scripts) | `>= 22`                          | `engines.node`                                                                                                   |
| TypeScript                          | lockfile-resolved dev dependency | `devDependencies.typescript`; `bun run typecheck` runs `tsc --noEmit`                                            |

Install exactly what the lockfile declares:

```sh
bun install --frozen-lockfile
bun run dev
```

No global tooling is required. `typecheck` does not depend on any globally
installed or transitively available compiler.

## Repository structure

| Path              | Contents                                                                                                                    |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `src/domain/`     | Domain models and derivation logic (authority, layers, capabilities, objects, value streams, workspaces, program state)     |
| `src/fixtures/`   | Synthetic fixture data, including the governance registers                                                                  |
| `src/routes/`     | TanStack Start file routes                                                                                                  |
| `src/components/` | Application shell, brand system, governance views                                                                           |
| `src/test/`       | Vitest suites                                                                                                               |
| `data/`           | Controlling governance data: registers, historical packages, obligations, program checkpoints, current-state input manifest |
| `docs/`           | Governance canon and generated documentation                                                                                |
| `scripts/`        | Governed generators (`gen-*.ts`), the evidence pipeline, and the dormant accessibility audit                                |
| `evidence/`       | Committed evidence records, artefacts, and derived baseline                                                                 |

## Controlling versus derived state

Controlling state is authored: `data/`, `src/fixtures/`, and the hand-written
documents in `docs/`. Derived state is generated from it: `docs/CURRENT_STATE.md`,
the current-state fingerprint, every generated document under `docs/`, and the
`evidence/` tree.

Derived state is never edited by hand. Editing it is drift, and the
generated-artefact check fails on it.

### The no-parallel-truth-plane rule

There is exactly one controlling source per concept. Program posture is derived
from the registers by `src/domain/program-state-derivation.ts`; it is not
maintained as a second hand-kept status object. Do not introduce a fixture, a
document, or a constant that restates a fact already carried elsewhere — restate
by derivation, never by copy.

## Quality commands

| Command                       | What it does                                                                                                                                                                                                     | Expected result                  |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| `bun run verify`              | the full read-only gate: lint, typecheck, tests, build, current-state check, generated-artefact check, committed-evidence verification, and the committed-evidence output-safety guard in non-writing check mode | all pass, and no file is created |
| `bun run verify:ci`           | `verify` plus the ephemeral evidence pass (generation, verification, output-safety guard)                                                                                                                        | all pass                         |
| `bun run lint`                | ESLint with Prettier, `--max-warnings 0`                                                                                                                                                                         | 0 errors, 0 warnings             |
| `bun run lint:fix`            | applies the mechanical fixes                                                                                                                                                                                     | rewrites formatting only         |
| `bun run typecheck`           | `tsc --noEmit`                                                                                                                                                                                                   | 0 errors                         |
| `bun run test`                | Vitest, whole suite                                                                                                                                                                                              | all tests pass                   |
| `bun run build`               | production build                                                                                                                                                                                                 | succeeds                         |
| `bun run check:current-state` | re-derives the projection and compares fingerprints                                                                                                                                                              | no diff                          |
| `bun run check:generated`     | runs every governed generator and fails on any tree diff                                                                                                                                                         | no diff                          |
| `bun run gen:all`             | runs every governed generator and keeps the result                                                                                                                                                               | updates generated artefacts      |
| `bun run gen:current-state`   | regenerates `docs/CURRENT_STATE.md` only                                                                                                                                                                         | writes the projection            |

`verify` is read-only: every step of it, including the output-safety guard
(`--check` mode), leaves no new file and no tracked-tree diff behind. It does
not run evidence _generation_, because generation writes artefacts into the
committed `evidence/` tree. `verify:ci` is the
complete set: it adds `evidence:ephemeral`, which generates a full current-run
evidence set into a temporary path, verifies it there, and runs the
output-safety guard over it, writing nothing into the repository.

Warnings are not tolerated. A warning is either fixed or converted into a
recorded, dispositioned finding — it is never left to accumulate.

## Generated-artefact update and check workflow

1. Change the controlling source (`data/`, `src/fixtures/`, or a generator).
2. Run `bun run gen:all`.
3. Commit the regenerated artefacts with the source change.
4. `bun run check:generated` re-runs every generator and fails if the tree
   moves, which is how a stale generated document is caught.

## Evidence generation versus committed-evidence verification

| Command                                | Writes                                              | Purpose                                                                                                     |
| -------------------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `bun run evidence:run`                 | `evidence/` (or `$SSLS_EVIDENCE_DIR`)               | executes the declared checks and writes Layer A records plus the Layer B baseline                           |
| `bun run evidence:verify`              | nothing                                             | evaluates whether the committed evidence set is still applicable to the current input sets                  |
| `bun run evidence:ephemeral`           | a temporary directory only                          | CI-safe generation + verification + output-safety guard                                                     |
| `bun run evidence:output-safety`       | `reports/evidence-output-safety.json` (git-ignored) | report mode: scans an evidence tree for credential- and personal-data-shaped content and retains the result |
| `bun run evidence:output-safety:check` | nothing                                             | check mode (`--check`): the identical fail-closed scan of the committed evidence tree, with no report file  |

Applicability is decided by declared input-set hashes, not by comparing commit
strings. Generated outputs (`evidence/`, `dist/`, `docs/CURRENT_STATE.md`, the
current-state fingerprint) are excluded from every input set, so writing
evidence cannot invalidate the evidence just written.

Because those outputs are outside the input hash, leak checking for them is a
separate, post-generation step: the output-safety guard. It runs after
generation, over the scanned tree only, excludes its own result file (written
either outside that tree or, when the tree is retained for CI upload, at
`reports/output-safety.json` inside it and excluded from its own scan), and
fails closed when prohibited material is found, the tree is empty or
unreadable, or the scan cannot complete. Both the committed evidence tree and
each newly generated set are scanned: `verify` and both CI workflows run the
guard over the committed tree, and `evidence:ephemeral` runs it over the
generated one. Pattern scanning does not prove the
absence of every secret or item of personal data; a clean result means no match
by these patterns over that scope.

Verification passing is not certification, conformance, or release readiness.

## Continuous integration

| Workflow                                  | Runs                                                                                                                                                           |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.github/workflows/quality-gate.yml`      | the complete gate on pull requests and pushes to `main`                                                                                                        |
| `.github/workflows/evidence-pipeline.yml` | committed-evidence verification, committed-evidence output-safety, ephemeral generation, and artefact upload (the uploaded tree contains its own guard result) |
| `.github/workflows/current-state.yml`     | the current-state projection check                                                                                                                             |

All three install from the frozen lockfile with the pinned Bun version, use
least-privilege `contents: read` permissions, concurrency groups, and bounded
timeouts, and use no `continue-on-error` on required checks.

The presence of these workflows is not merge enforcement. Branch protection is
configured outside the repository and is recorded as FND-012. A green run shows
these checks passed at that commit; it does not show that merging is blocked
when they fail.

## Dormant tooling

`scripts/accessibility/audit.mjs` (`bun run audit:touch-targets`) implements the
TTR-001 touch-target protocol from WP-007 Cycle 8. It is dormant. The audit was
deferred by owner decision DEC-022 and its aborted execution is recorded as
ATTEMPT-001.

**TTR-001 is NOT-RUN.** No touch-target conformance evidence exists, and none is
claimed. FND-024 records that verification gap.

## Status boundaries

- Public synthetic prototype. Not a product, not released, not certified.
- No real personal data of any kind. All fixture data is synthetic.
- Deployment is not release: the interface is published so it can be inspected,
  which confers no approval, conformance, or release status.
- Accessibility conformance is not claimed. WCAG 2.2 AA is a recorded target
  (DEC-012), not an achieved state.

## Current limitations

- No backend, database, authentication, or AI features.
- Governance surfaces are fixture-derived and reset on reload. The Product Alpha
  001 product surface persists its synthetic data in browser-local storage only:
  there is no server backup, sharing, or synchronization, and clearing browser
  storage loses that data unless it was exported first.
- Touch-target conformance unverified (TTR-001 NOT-RUN, FND-024).
- Evidence coverage is pattern-bound and self-produced, not independent.

## Product Alpha 001 — current increment

**Product Alpha 001 is implemented as a bounded technical proof** (authorized by
`DEC-023`, recorded as `CHECKPOINT-010`, evidenced by `EV-046`). A
founder/operator-only synthetic learner evidence-to-action vertical slice:
synthetic learner list → learner detail → goal → support/action →
observation/evidence → result → timeline → deterministic LLR-001 next-step
projection.

Persistence is browser-local behind a repository interface, with
seed/reset/export/import. There is no server backup, no sharing, and no
synchronization; clearing browser storage loses the data unless it was exported.

Explicitly out of scope and unauthorized: authentication, tenant model, cloud
database, backend, RLS, AI, real PII, district integrations, analytics,
conformance claim, release claim. Backend and authentication are a later
architecture decision, taken only after the workflow is proven.

The implementation is a technical proof only. It is **not released, not
validated, and not certified**: mechanics were tested, usefulness was not. The
next defensible owner action is a bounded founder/operator walkthrough of the
loop with recorded usability findings, after which the owner decides between a
bounded revision and a separately authorized TTR-001 audit. No expansion beyond
this exact local synthetic proof is authorized.

## Built with

TanStack Start, React, TypeScript, Tailwind CSS, Vitest.
