# WP-007 Cycle 8 — TTR-001 touch-target verification execution

Execute the already-defined TTR-001 v1.0.0 protocol against the current interface, capture target-level evidence, and record truthful governance results. No interface change, no remediation, no conformance claim.

## Entry state (verified before planning)

- HEAD is `b8e9630b1eb9a79d82df42d39467a739c1e0cbd5`, worktree clean.
- Test baseline confirmed: 405 passed across 19 files.
- `data/accessibility/touch-target-rule.json` carries `execution_state: NOT-RUN`.
- `DEC-022`, `EV-044`, `CHECKPOINT-010`, `TTA-001` return no matches anywhere in the repository — all free.
- `FND-024` exists and is open, carrying the unexecuted verification.
- `src/lib/route-registry.ts` is the canonical route list; parameterized routes exist as separate route files and will need representative fixture parameters.
- No browser-automation dependency is present in `package.json`.

## What gets built

### 1. Canonical audit artifact (single source of truth)
- `data/accessibility/TOUCH_TARGET_AUDIT_SCHEMA.json` — Draft 2020-12 schema, same conventions as the existing rule schema.
- `data/accessibility/touch-target-audit.json` — record `TTA-001`, written only by the runner. Holds audit identity, controlling decision `DEC-022`, TTR-001 version and digest, audited commit, environment metadata, route inventory, scenario inventory, per-target records, route-level outcomes (`AUDITED` / `BLOCKED` / `NOT-APPLICABLE`), all totals, limitations, non-claims, history, and a completion state of `COMPLETE` / `PARTIAL` / `BLOCKED` / `NOT-RUN`.
- `src/domain/touch-target-audit.ts` — types plus a pure invariant validator, mirroring `src/domain/touch-target.ts`.
- `src/lib/touch-target-audit-registry.ts` — loader, mirroring `touch-target-registry.ts` (tests and generator only; no route imports it).
- `scripts/gen-touch-target-audit-docs.ts` — deterministic Markdown projection to `docs/accessibility/TOUCH_TARGET_AUDIT.md`, plus a clearly-derived pointer section in `docs/ACCESSIBILITY_ACCEPTANCE.md`.

Raw measurement, derived classification, review state, finding linkage, and owner decision stay in separate fields.

### 2. Audit runner
- `scripts/accessibility/` — a Node runner plus a pure classification module (`classify.mjs`) covering the 44 default, the 24 floor, the compact-context rationale requirement, the exactly-one-exception rule, and the mechanical 24 px spacing-circle geometry. The classification and geometry modules are unit tested directly.
- Browser automation: Playwright is added as a **dev-only** dependency because no compatible browser automation exists in the repository. The runner serves the production build and drives Chromium at 320, 768, and 1366 CSS px, dsf 1, 100% zoom, fixed viewport height, one browser version for all routes.
- Target discovery uses the documented selector set from the prompt (anchors, buttons, inputs, select, textarea, summary, area, interactive ARIA roles, non-negative tabindex, contenteditable), visibility-filtered, deduplicated, scrolled into view.
- Locators resolve in the documented priority order; unstable ones are recorded as `UNSTABLE-LOCATOR` blocked, never patched into components.
- Scenarios: default rendered state for every registered route, representative synthetic params for detail routes, and the mobile-navigation open state at 320 px.
- Runner exits non-zero on schema-invalid output, missing routes, duplicate IDs, missing measurements, impossible classifications, unrecorded blocked routes, floor passes without rationale, exception passes without exactly one completed exception, mismatched totals, or projection drift — but **not** for legitimately recorded interface failures.

### 3. Judgment-based exceptions
No exception requiring human judgment is auto-passed. Machine facts are collected, the required determination is named, and reviewer state is left `PENDING-MANUAL-REVIEW`, which classifies as unresolved rather than passing.

### 4. Governance reconciliation (only after results exist)
- `DEC-022` ACCEPTED — authorizes this bounded audit only; explicitly excludes remediation, conformance, release, Cycle 9, WP-039, and WP-007 / Gate A closure.
- `EV-044` — the executed audit, its artifacts, validations, and limitations. It does not claim conformance.
- `CHECKPOINT-010` — WP-007 Cycle 8, at `docs/wp-007/CHECKPOINT-010.md`.
- `FND-024` — discharged only if the protocol genuinely ran and the artifact truthfully records the outcome; otherwise retained open with an updated, non-erasing note.
- New findings for real FAILs, blocked routes, unstable locators, and pending reviews — grouped by root cause, each listing affected audit-record IDs, with no remediation authority.
- `src/fixtures/program.ts` updated to CHECKPOINT-010 with the actual totals and a next owner action derived from the results, not pre-written.

### 5. Tests
`src/test/touch-target-audit.test.ts` (plus a runner-logic test file) covering every item in the prompt's test list: schema validation, ID uniqueness, full route coverage, fixture validity, deduplication, locator stability, each classification branch, rationale requirement and below-floor rejection, all five exception types, exactly-one-exception, spacing geometry, pending-review behaviour, blocked-route recording, raw/derived separation, total recomputation, two-way finding referential integrity, TTR-001 and HREQ non-mutation, EV-003 still NOT-RUN, no conformance or release claim, no interface source change, program-state reconciliation, deterministic generation, and runner failure/success behaviour. No existing test is weakened.

## Validation to run and report exactly

Entry reconciliation, identifier collision scan, clean-worktree and commit capture, production build, typecheck, route-registry validation, the browser audit at all three widths across all routes and scenarios, schema validation, focused tests, full suite with delta from 405/405 across 19 files, repository lint (FND-014 debt reported truthfully), zero lint errors in Cycle 8 files, dependency security check for the added dev dependency, evidence pipeline run and verify, generator rerun with no diff, cross-register contradiction scan, and a final diff-scope review proving no interface implementation changed.

## Stop conditions

Stop BLOCKED without partial authority mutation on TTR-001 drift, ambiguous identifiers, unestablishable route coverage, non-deterministic build or serve, browser measurement failure, inability to keep raw measurements separate, any need to modify the interface, a competing source of truth, evidence-generation failure, or irreconcilable results. Partial runs stay labelled partial.

## Terminal boundary

Rule audit is executed to the recorded extent only. No remediation, no HREQ-025 change, EV-003 stays NOT-RUN, WP-007 stays active, Gate A stays open, no Cycle 9 or WP-039 authorized, and no accessibility or conformance claim is made.
