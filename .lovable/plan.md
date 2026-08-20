# Product Alpha 001 — operator walkthrough, defect repair, and bounded optimization

## Entry state (verified this turn)

- [C] HEAD `2e82574e48e100f09638d24c961ade78bbc96c4e`, clean tree — matches the expected platform HEAD.
- [C] Identifiers `DEC-024`, `EV-047`, `CHECKPOINT-011`, and `FND-025+` are unoccupied in `src/fixtures/registers.ts` and `data/program/checkpoints.json`. No collision.
- [C] Product Alpha surface: `src/routes/learners.index.tsx`, `src/routes/learners.$learnerId.tsx` (1,509 lines), `src/components/learning-loop/*`, `src/lib/learning-loop/*`, `src/domain/learning-loop/*`, plus the shared shell `src/components/app-shell.tsx`.
- [U] The claimed baseline (629 tests / 30 files, zero lint warnings, clean build, verification passing) is asserted but not re-observed. Re-running `bun run verify` is step 1 of execution; if it disagrees, work stops and the difference is reported before any change.

## Scope

Bounded to the Product Alpha 001 routes and only the shared shell elements they depend on. Explicitly excluded: Cycle 9, WP-039, whole-interface TTR-001 execution, any conformance or regulatory conclusion, release or deployment, backend/auth/database/RLS/integrations/analytics/payments, real data of any kind, consequential AI or eligibility logic, and any simulated stakeholder participation. No gate, work package, or finding is closed.

## Execution

### 1. Preflight (read-only)

Read the controller document, `docs/CURRENT_STATE.md`, `CHECKPOINT-010.md`, `FOUNDER_WALKTHROUGH_PROTOCOL.md`, `ENTRY_SPECIFICATION.md`, DEC-023/EV-046, the findings/obligations/package registers, TTR-001 acceptance docs, and the route inventory. Run `bun run verify` and record the observed result as the entry baseline. Report any divergence from the stated baseline instead of overwriting it.

### 2. Record bounded authority — DEC-024

Add `DEC-024` to `src/fixtures/registers.ts` authorizing exactly: the operator walkthrough, correction of walkthrough-demonstrated defects, bounded UI/UX/accessibility/reliability/performance work inside Product Alpha routes and their shell dependencies, feature-scoped verification of modified controls, and creation of a future stakeholder-review packet. The decision text carries the exclusion list above verbatim in substance.

### 3. Execute the walkthrough (before any optimization)

Drive the real app with Playwright against the local dev server, synthetic seed data only, at 320 / 768 / 1366 CSS px, plus a keyboard-only pass. Tasks follow the existing protocol: entry from the primary surface, queue → learner → goal comprehension, observation, validation-failure draft/focus behaviour, support action, completion, follow-up, review, timeline, LLR-001 rationale traceability, reload persistence, export/import, invalid and stale import fail-closed, two-tab revision conflict, reset/seed.

Each observation is recorded with route, viewport, repro steps, severity, evidence, expected vs actual, and disposition in a new executed record `docs/product-alpha-001/WALKTHROUGH-001.md`. Screenshots and console/axe output are captured as walkthrough artefacts. This is engineering observation, never labelled stakeholder validation.

### 4. Baselines before changes

Capture and record, per route and viewport: golden-path completion, dead ends, validation/recovery behaviour, overflow/clipping, keyboard and focus order, accessible names/landmarks/headings/status/error association, changed-control target sizes, axe results, route render/interaction timing, Lighthouse lab metrics if a trustworthy run is available, and initial JS / route chunk sizes from the production build. Any tool that cannot run is recorded `NOT-RUN` with the reason — no invented scores.

### 5. Up to three evidence-driven optimization passes

Each pass: measure → pick the highest-impact verified problems → smallest coherent correction → focused tests → re-measure → keep only if it improves the target without weakening another acceptance area. Priority order: data loss / wrong state / silent conflict / misleading recommendation, then blocked or inaccessible operation, then unclear next action and weak feedback, then responsive defects, then performance, then visual consistency.

Anticipated (not pre-committed) work, subject to what the walkthrough actually shows:

- splitting `learners.$learnerId.tsx` into focused view modules if its size is shown to drive render or maintainability problems;
- clarifying the next-step rationale and its evidence citations in plain, strengths-based language;
- moving source/timestamp/correction/status detail behind progressive disclosure so the educator task is visually dominant;
- tightening loading / empty / success / validation / storage-error / conflict / recovery states and duplicate-submission prevention;
- responsive and target-size corrections at 320 px.

No new dashboards, analytics, gamification, decorative animation, domain modules, or dependencies without a demonstrated need.

### 6. Acceptance scoring

Score the eleven heuristics (task clarity, workflow efficiency, cognitive load, error prevention, error recovery, status visibility, trust and traceability, inclusive language, responsive usability, visual consistency, instructional usefulness) 1–5 before and after, each with written evidence. Target ≥4 everywhere with no unresolved critical or major defect. Labelled explicitly as engineering heuristic scores.

### 7. Accessibility (feature-scoped)

Axe scan with zero critical/serious violations on Product Alpha routes and changed shell components; 100% keyboard completion; no trap; predictable order; visible focus; focus placement on navigation and restoration after drawer/dialog/recoverable error; programmatic label/description/error association; non-spammy live regions; landmarks and heading hierarchy; reflow and reduced motion; contrast on changed tokens; 44×44 SHOULD with a 24×24 MUST floor and documented spacing exceptions for changed controls; verified at all three widths. Recorded as implementation verification, not TTR-001 and not WCAG conformance.

### 8. Performance

Measure first. Targets on Product Alpha routes: Lighthouse mobile ≥90, desktop ≥95, automated accessibility 100 (stated as non-conformance-proof), best practices ≥95, LCP <2.5 s, CLS <0.1, TBT <200 ms, no unjustified route-bundle regression, no network dependency for the local synthetic loop, no repeated expensive derivation on ordinary state changes. Unavailable tooling is recorded `NOT-RUN`. No SEO optimization of the workspace; the not-released posture is preserved.

### 9. Alignment matrix

`docs/product-alpha-001/ALIGNMENT_MATRIX.md` — one row per lens (general education, EL/ELD, special education and 504, MTSS, administration, student/family access, accessibility, privacy/security/data governance, interoperability) with current support, observed gap, in-scope or not, future need, authoritative source, and the prohibited interpretation. External sources are cited as inputs only, never as product truth. No approval, certification, or compliance claim of any kind.

### 10. Stakeholder-review packet

`docs/product-alpha-001/STAKEHOLDER_REVIEW_PACKET.md` — task scripts and role-specific questions for the ten named roles, every role marked `NOT-YET-REVIEWED`. No simulated participation or approval.

### 11. Records and verification

Findings for verified defects (`FND-025+`) with traceable dispositions; evidence record `EV-047` covering the work actually performed; `CHECKPOINT-011` and `docs/product-alpha-001/CHECKPOINT-011.md` only if every acceptance requirement passes, with an explicit `closed_nothing` section. Register versions bumped where the schema requires.

Before checkpointing: `bun run lint`, `bun run typecheck`, `bun run test`, `bun run build`, `bun run check:current-state`, `bun run verify`, then the evidence run and verification commands. Zero lint warnings, zero type errors, no reduction in passing test count, no weakened or skipped invariant tests, no broad timeout increases, no stale generated docs, no duplicate or contradictory identifiers.

## Technical notes

- Walkthrough automation lives under `/tmp/browser/`; nothing is added to the repository except the recorded findings and artefact summaries.
- Register edits stay inside the existing `src/fixtures/registers.ts` SSOT; `docs/CURRENT_STATE.md` and other generated docs are refreshed only via `bun run gen:all` / `bun run gen:current-state`.
- Any component split preserves existing exported contracts so the 30 existing test files keep passing unchanged.
- Nothing is published or deployed.

## Final report

Entry state and HEAD, decision and scope, tasks executed, findings with severity and disposition, before/after UI-UX scorecard, before/after accessibility, before/after performance, alignment summary, exact file changes, exact commands and results, evidence and checkpoint identifiers, remaining risks and NOT-RUN items, and the recommended next owner decision — closing with the required explicit boundary statements.
