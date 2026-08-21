# Role Technology Decision Drift Calibration and Founder Disposition

## Entry state observed (read-only, this turn)

- HEAD `698542f` "Registered TDP decision routes", clean tree.
- `data/technology-decisions/` holds the four canonical artifacts (sources, decision-process, workflow-decisions, product-alpha-assessment); domain layer and nine planning routes are present, so the Role-First Technology Decision Architecture is in place.
- Register: **279 workflows**, **18 role groups**.
- Drift buckets computed from the live registry: `differs` **139**, `agrees` 62, `derived-narrower` 21, `derived-broader` 28, `derived-unresolved` 29. The 139 figure in the request corresponds to the `differs` bucket only; 217 records are non-identical overall. The plan treats the 139 `differs` records as the calibration population and reports the other 78 as adjacent context, not as classified records.
- Deciding step for non-agreeing records: STEP-APPLICATION 111, STEP-DETERMINISTIC 43, STEP-HYBRID 34, abstain 29.
- Next free identifiers: decision **DEC-024**, evidence **EV-047**, finding **FND-025**, checkpoint **CHECKPOINT-011**.
- Not yet verified this turn: test count (651/32) and `verify:ci` — both are re-run as step 0 of implementation, and any contradiction stops the increment before writing.

## What this increment does

1. **Entry gate.** Re-run `bun run verify:ci`, confirm test/file counts and the 106 AI-prohibited workflows, confirm no identifier collision. Stop and report on any material contradiction.

2. **Record DEC-024** — the narrowest authority: validate drift generation, classify the 139 disagreements, sample, correct only demonstrated evaluator defects, improve the drift-review surface, and record owner dispositions. Explicit exclusions written into the decision record: no evaluator acceptance, no blanket rejection of supplied recommendations, no workflow activation, no Workspace/Apps Script execution, no AI implementation, no backend/auth/role expansion, no real data, no stakeholder approval, no maturity adoption, no Cycle 9 / WP-039 / release / conformance.

3. **Validate the drift mechanism before judging any record.** Targeted tests over `readSuppliedOptions`, `classifyWorkflow`, `assessDrift`, and the memoized registry proving: verbatim preservation of `recommended_solution`; derived sets drawn only from TDP-001 option IDs; correct option-number parsing including multi-option and prose forms; order-insensitive comparison; missing/ambiguous source values yielding `uncertain` rather than a guess; abstention (`derived-unresolved`) held distinct from disagreement; consistent prohibited-AI application; no maturity field reachable from evaluator input; memoization keyed to register content so stale analysis cannot be served. Every defect found gets a regression test first, then a fix.

4. **Classify all 139 records** into the eleven primary causes, with optional secondary causes, in a new canonical file `data/technology-decisions/drift-classifications.json` (no second workflow or drift register — it references existing `workflow_id`s). Classification is derived mechanically where the evidence is mechanical (e.g. subset relations, abstention, prohibited-AI conflicts) and marked `INSUFFICIENT-EVIDENCE` / unresolved where it is not. Each record carries its traceable basis: the source fields read, the answers derived, the precedence step, and the comparison outcome.

5. **Risk-weighted deterministic sample** (seedless, sorted by explicit key so it is reproducible) covering every drift category, all 18 role groups, all risk tiers, every option present, all four AI postures, record-authority/longitudinal cases, cross-role, student- and family-facing, and each program area — plus *every* high-risk AI-boundary disagreement without exception. Written to `docs/technology-decisions/DRIFT-SAMPLE-001.md` with, per record: source wording, supplied recommendation, evaluator result, answers and deciding step, primary/secondary cause, evidence, potential defect, recommended disposition, confidence, unresolved question.

6. **Dispositions.** Only the eight allowed values. Recorded in the same classification file with rationale and confidence. Batch dispositions are permitted only on identical rule + evidence pattern + risk boundary + rationale and must enumerate member workflow IDs; a single exception dissolves the batch.

7. **Evaluator corrections — only on demonstrated defect.** For each: prior rule text preserved in governance history inside `decision-process.json` history plus the decision record, failing workflow examples cited, regression test added with the fix, all 279 workflows re-evaluated, changed outputs reported, safety invariants re-proved (TDP-INV-01..08, notably the AI-prohibition path). No rule changes to lower the drift count.

8. **Founder review surface.** New route `/technology-decisions/drift` (registered in `src/lib/route-registry.ts` under the existing governance group), reusing `src/components/technology-decisions/parts.tsx`: summary by root cause; risk and role-group filters; source-vs-derived comparison; evaluator rationale; evidence and unresolved questions; single-record and evidence-identical batch disposition; review progress persisted through the existing local-storage repository pattern; undo before finalize; export of the disposition report. Explicit separation of analysis / owner decision / implementation authority. No dashboards, scores, gamification, decorative charts, or approval theater. Keyboard operable, 320/768/1366 verified, no color-only meaning, TTR-001 touch-target contract honored for changed controls.

9. **Outputs.** `docs/technology-decisions/DRIFT-CALIBRATION-001.md` (generated), `docs/technology-decisions/FOUNDER_DISPOSITION_PROTOCOL.md`, the sample report, documented evaluator defects, focused regression tests in `src/test/technology-decisions-drift.test.tsx`, `EV-047` in `src/fixtures/registers.ts` describing only work actually performed, regenerated `docs/CURRENT_STATE.md`, and `CHECKPOINT-011` only if every acceptance criterion passes.

10. **Verification.** Frozen install, lint at zero warnings, typecheck, focused suites, full suite (no reduction from the entry count), production build, generator no-diff, evidence verification, `bun run verify:ci`.

## Technical notes

- Classification and sampling logic lives in `src/domain/technology-decisions/drift.ts` as pure functions with a Zod-parsed classification schema, so the generated report, the tests, and the UI all read one derivation.
- `assessDrift` moves out of `src/lib/technology-decision-registry.ts` into the domain module so it is unit-testable independently of the memoized register; the registry keeps only composition and caching.
- Memoization is changed from an unconditional `??=` cache to one invalidated by register identity, so a corrected evaluator cannot serve stale analysis within a process.
- Owner dispositions are stored as data in the truth plane, not as code branches; nothing in the disposition path writes to the workflow register or alters `recommended_solution`.

## Final report

The closing report returns entry/exit HEAD, decision and authority, drift-mechanism validation, counts by cause, sampling method and sampled IDs, dispositions and unresolved cases, defects found, rules changed with justification, before/after drift counts (with the explicit caveat that reduction is not success), UI changes, accessibility/responsive verification, exact files changed, exact commands and results, evidence and checkpoint identifiers, remaining risks, and the recommended next owner decision — ending with DRIFT CALIBRATION COMPLETE or BLOCKED and the required standing disclaimers.
