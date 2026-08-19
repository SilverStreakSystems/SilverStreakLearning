# WP-037 — Final Verification, Evidence Registration, Closure Disposition

Executor-only work package. No owner decision is self-accepted, no WP-038 execution, no product features.

## Confirmed current state (read before planning)

- HEAD is now `e54714c4deb10aad7c45fbff6c973876f704cab3`, tree `be0ce68…`. The reported run commit `1f7c51e` is no longer HEAD.
- `evidence/records/` holds 14 records (EV-BUILD, EV-TEST, EV-TYPECHECK, EV-LINT, EV-CONFIG, EV-DEPS, EV-SBOM, EV-LICENSE, EV-VULN, EV-SECRET, EV-PII, EV-PROVENANCE, EV-ROUTES, EV-SSOT-GUARD).
- `evidence/baseline.json` was generated at `1f7c51e` with `working_tree_dirty: true`; it records 10 test files, 213 source files, 31 route modules, and the ten input-set hashes.
- `EV-VULN` is `not-completed` (external feed unavailable) and must be preserved byte-for-byte.
- `src/test/evidence-pipeline.test.ts` contains 37 test cases.
- `src/fixtures/registers.ts` currently ends its evidence chain at EV-018; **EV-019 is unused**.
- `docs/wp-037/` has 15 documents; there is currently no evidence index, exit-criteria matrix, final evidence report, closure recommendation, publication boundary, or WP-038 handoff document.
- A frozen WP-037 exit-criteria list has not been located in `docs/wp-037/`; the reconciliation must first search the recorded WP-037 authorization source and, if no pre-registered wording exists, record that as a limitation rather than inventing criteria.

## Execution sequence

1. **Recover truth and entry authority.** Re-read HEAD, tree hash, decision register (DEC-007, DEC-010, DEC-014), findings FND-011…FND-014, and the Claims Register. If entry authority is not established, stop and return `BLOCKED — WP-037 CLOSURE AUTHORITY NOT ESTABLISHED`.
2. **Re-execute checks at current HEAD:** `bun run test`, production build, `bun run lint` (full repository, then WP-037-changed files separately), `bun run evidence:verify`. Report the actual numbers, not the reported ones.
3. **Input-aware applicability.** Run the WP-037 applicability engine for the `1f7c51e` run against current input sets and record one of CURRENT / STALE / EXPIRED / SUPERSEDED / INAPPLICABLE / UNKNOWN per record with the reason. Documentation-only drift must not be reported as stale.
4. **Register EV-019** in `src/fixtures/registers.ts` and as a committed record, permanently bound to the producing run (`1f7c51e`), never rebound to HEAD. Includes method, input hashes, environment, timestamp, test/build/pipeline/baseline results, artifact hashes, expiry, reproduction command, supports, does_not_support, `independent = false`.
5. **Vulnerability retry.** Attempt one fresh `bun audit --json`. Preserve the existing `EV-VULN` record unchanged; any new result becomes a separate record. Classify the frozen criterion under Case 1 (execution required) or Case 2 (completed result required) using actual recorded wording; improvise no exception.
6. **Finding dispositions.** FND-011 → RESOLVED or MATERIALLY NARROWED with evidence; FND-013 → RESOLVED FOR MACHINE-DERIVED BASELINE FACTS, narrative accuracy human-governed; FND-012 stays open (CI file existence is not branch protection); FND-014 stays open/advisory with new-vs-legacy lint split.
7. **Deliverable verification.** Mark each of the 19 named WP-037 deliverables IMPLEMENTED / PARTIAL / MISSING / NOT VERIFIED, citing source file plus test or evidence record. Same for the 37 pipeline test cases mapped to the named control families.
8. **Reproduce the pipeline once** (`bun run evidence:run` then `evidence:verify`) and record regeneration, manifest validation, hash validation, and reproduced applicability states; treat feed-dependent scan output as expected variance.
9. **Publication boundary.** Inspect the published surface, classify it (expected maximum: PUBLIC PROTOTYPE), and confirm no production/compliance/certification/validation implications. Record a deployment evidence record (next ID after EV-019) supporting reachability and observed labeling only.
10. **Claims Register delta.** Add the pipeline wording only if fully evidenced; preserve all existing prohibitions.
11. **Closure disposition.** Return exactly one of PROMOTE TO OWNER CLOSURE / HOLD / BLOCK / REVISE / TERMINATE, and prepare (not accept) the next DEC ID as the proposed owner closure decision.

## Documents to create or update

Create in `docs/wp-037/`: `EVIDENCE_INDEX.md`, `EXIT_CRITERIA_MATRIX.md`, `FINAL_EVIDENCE_REPORT.md`, `CLOSURE_RECOMMENDATION.md`, `PUBLICATION_BOUNDARY.md`, `HANDOFF_TO_WP-038.md`.
Update: `docs/wp-037/FINDING_DISPOSITIONS.md`, `docs/CURRENT_STATE.md`, the Claims Register document, and `src/fixtures/registers.ts` (EV-019, deployment evidence, finding dispositions, proposed decision in Proposed state). No duplicate sources of truth; no rewriting of immutable historical records.

## Technical notes

- Register additions go through the existing typed fixture arrays in `src/fixtures/registers.ts`; existing entries are appended to, never edited.
- Evidence records follow the schema enforced by `scripts/evidence/schema.mjs`; applicability comes from `scripts/evidence/applicability.mjs` and input sets from `scripts/evidence/inputs.mjs`.
- Any new register entries need matching assertions in the existing test suites so `bun run test` still reflects register truth.

## Final report

Sections A–AA exactly as specified, ending with the terminal status: `WP-037 EXECUTOR-COMPLETE — OWNER DISPOSITION REQUIRED` unless a criterion is unresolved, in which case `WP-037 HOLD — EXIT CRITERION UNRESOLVED`.
