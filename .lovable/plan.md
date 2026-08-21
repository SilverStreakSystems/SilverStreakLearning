# Drift Mechanism Calibration and Owner Review Preparation

Calibrate the technology-decision comparison mechanism across all 279 workflows, correct only demonstrated implementation defects, analyze all 217 non-identical outcomes, and prepare a non-authoritative founder-review packet. No founder dispositions are recorded.

## Entry state observed (read-only, this turn)

- [C] HEAD `698542f` "Registered TDP decision routes"; working tree clean.
- [C] Canonical artifacts present: `sources.json`, `decision-process.json`, `workflow-decisions.json`, `product-alpha-assessment.json`. Nine planning routes exist.
- [C] Register: 279 workflows, 18 role groups.
- [C] Live comparison buckets: agrees 62, differs 139, derived-narrower 21, derived-broader 28, derived-unresolved 29 — matching the plan's stated distribution. 217 non-identical, 188 comparable divergences, 29 abstentions.
- [C] Deciding steps across non-agreeing records: STEP-APPLICATION 111, STEP-DETERMINISTIC 43, STEP-HYBRID 34, abstain 29.
- [C] `analyzedWorkflows()` uses an unkeyed module-level `??=` cache — a defect candidate under section 5.4.
- [C] Next identifiers not yet in use: DEC-024, EV-047, FND-025, CHECKPOINT-011. Rechecked immediately before every write.
- [U] Test count 651/32, `verify:ci` status, `source_ai_necessity_prohibited = 32`, and `consequential_ai_guard_applied = 106` are not verified in plan mode. All four are confirmed in the entry gate before any write; a material contradiction stops the increment and is reported.

## Sequence

1. **Entry gate.** Inspect branch/HEAD/tree/routes/deps/generated-artifact controls; read applicable AGENTS.md, the build controller, `docs/CURRENT_STATE.md`, latest accepted decision and checkpoint, all active registers, TDP-001 and schemas, the workflow register and Product Alpha assessment. Run `bun run verify:ci`. Confirm counts, the two distinct AI metrics, identifier availability, and a duplicate-identifier/contradiction scan. Stop before writing on any contradiction.

2. **Authority.** Record DEC-024 with the authority scope and exclusions exactly as stated in the request. If repository conventions do not let the owner's execution instruction constitute authority, DEC-024 is recorded as *proposed* and the increment stops there.

3. **Parsing validation.** Add an explicit expression model (`SINGLE`, `UNORDERED-ALTERNATIVES`, `ORDERED-PREFERENCE`, `COMBINATION`, `HYBRID`, `UNPARSEABLE`) in a new `src/domain/technology-decisions/source-expression.ts`. Verbatim source text, parsed expression, diagnostics, parse status, and normalized option references are stored as separate fields; source wording is never replaced. "or" ≠ "then"; Option 6 is not reduced to {2,5}; negation and priority language are preserved; ambiguity fails into an unresolved evidence state. Every distinct source form in the register gets a documented parse outcome, enumerated by test.

4. **Comparison relations.** Replace the generic `differs` bucket with exactly one of `EXACT`, `DERIVED-PROPER-SUBSET`, `DERIVED-PROPER-SUPERSET`, `PARTIAL-OVERLAP`, `DISJOINT`, `SOURCE-UNPARSEABLE`, `DERIVED-ABSTAIN`. `assessDrift` moves out of `src/lib/technology-decision-registry.ts` into the domain layer so it is unit-testable independently of the register.

5. **Evaluator and safety validation.** Prove derived options come only from TDP option IDs; ambiguity abstains; OPT-7 stays reachable; SSLS is never the default; deterministic routes precede AI; maturity data is unreachable from evaluator input; supplied recommendations cannot influence rules; every consequential-person AI guard holds; all TDP invariants intact.

6. **Cache.** Remove the module-level cache unless profiling shows a meaningful benefit at 279 records. If retained, key it to a deterministic fingerprint (register digest, TDP version + digest, parser/evaluator version, classifier version, policy digest), with tests for invalidation on input change and invariance under source row reordering.

7. **Defect correction only.** Reproducible parser, comparison, cache, or evaluator-implementation defects only. Each: failing regression test first, smallest coherent fix, re-run all 279, report every changed output, re-prove invariants, regenerate dependents. Ambiguous contract → finding. Substantive policy issue → separate owner decision. TDP policy is not changed in this increment, and no rule is changed to reduce variance.

8. **Fingerprint freeze, then generate analysis.** After defects are closed, freeze the governing fingerprint and generate `data/technology-decisions/generated/drift-analysis.json` and `generated/drift-sample.json`, each carrying `authority_status: GENERATED-NONAUTHORITATIVE`, register digest, TDP ID/version/digest, parser/evaluator version, analysis-schema version, and generation fingerprint. Every record uses the orthogonal model (comparison, parsing, evaluator, decision drivers, evidence state, defect state, candidate causes) plus `proposed_resolution`, `proposal_basis`, `proposal_basis_fingerprint`, `owner_disposition: null`, `review_status: NOT-REVIEWED`, `owner_decision_id: null`. No numeric confidence score. Coverage: all 217 non-identical records, with the 29 abstentions kept as a separately visible unresolved-evidence queue, plus a deterministic negative-control sample drawn from the 62 agreements.

9. **Mandatory cohort.** 100% review of non-identical records that are high risk, consequential, AI-prohibited or AI-boundary conflicted, student- or family-facing, tied to eligibility/placement/grading/discipline/safety/employment/medical/legal/service/compliance, Product Alpha, or explicitly next-roadmap. Never batch-resolved.

10. **Representative sample.** From the remaining non-identical records, cap 36–48, selected by maximum marginal strata coverage with SHA-256 tie-breaking over (algorithm version, population fingerprint, workflow ID). Strata: role group, risk level, options present, source AI posture, record-authority and longitudinal needs, cross-role, and program area (gen ed, EL/ELD, SpEd/504, MTSS, administration, operations). Records algorithm version, population fingerprint, inclusion reasons, strata covered, sample size, and uncovered strata. Row order cannot affect selection.

11. **Proposals.** Only `RETAIN-SUPPLIED`, `ACCEPT-DERIVED`, `MERGE-OPTIONS`, `CORRECT-IMPLEMENTATION-DEFECT`, `NEEDS-EVIDENCE`, `OWNER-POLICY-DECISION`, `OUT-OF-SCOPE`, `NO-PROPOSAL` — labelled engineering proposals, never dispositions. Batches require an identical `proposal_basis_fingerprint` across every listed dimension, enumerate all member IDs, and are prohibited for high-risk, consequential, AI-prohibited, student/family-facing, ambiguous/missing/contradictory-evidence, policy-choice, and unresolved-question records.

12. **Documents.** Generated: `docs/technology-decisions/DRIFT-CALIBRATION-001.md`, `DRIFT-SAMPLE-001.md`, `FOUNDER-REVIEW-PACKET-001.md` — all derived from the fingerprint-bound analysis, failing the generated-artifact check when stale, marking facts/inferences/unresolved, and stating non-authority. Controlled prose: `FOUNDER_REVIEW_PROTOCOL.md`.

13. **Interface.** Extend the existing technology-decision views only — no new `/technology-decisions/drift` route, no mutation controls, no local-storage dispositions, no batch approval, no finalize, no scores, dashboards, or charts. Added: non-identical filter, comparison-relation filter, risk / role-group / safety-critical / Product-Alpha filters, source-vs-derived detail, evidence state, candidate causes, proposed resolution, and a persistent OWNER REVIEW PENDING status. Any export is noncanonical, marked REVIEW PROPOSAL — NOT AN OWNER DECISION, fingerprint-carrying, and fails verification when stale.

14. **Schemas.** Draft 2020-12 JSON Schemas for generated drift analysis and exported review proposals, following the existing canonical schema approach. Existing Zod may validate at runtime only where parity with the JSON Schema is tested. No new schema dependency, and no owner-disposition register with placeholder decisions.

15. **Tests.** Focused suites covering population integrity, parsing forms, evaluator/safety metrics (including 32 vs 106 kept distinct), derived-authority guarantees (generation cannot populate a disposition; regeneration cannot overwrite one; stale packets fail closed), fingerprinting and caching, sampling, batch-proposal constraints, and the interface behaviors. No existing test is weakened, skipped, or removed.

16. **Verification.** Frozen install, focused drift tests, lint, typecheck, test, build, generated-document no-diff, `check:current-state`, evidence run and verification, duplicate-identifier and contradiction scans, dependency/route-boundary scan, `verify:ci`. Feature-scoped accessibility checks (keyboard, focus, headings/landmarks, non-color status, contrast, targets, 200%/400% reflow, 320/768/1366, reduced motion) and measured performance, recording NOT-RUN with a reason where tooling is unavailable.

17. **Records.** FND-025 only if a distinct finding exists; EV-047 only after evidence exists and fits one record under current schema rules; CHECKPOINT-011 only if every acceptance criterion passes, scoped to mechanism validation, defect correction, analysis generation, mandatory review, sampling, and packet preparation — implying nothing about founder review, dispositions, adoption, or authorization. If blocked, an attempt or finding is recorded instead of a successful checkpoint.

Any change to a governing input after step 9 invalidates steps 10–15 and forces regeneration.

## Final report

Returns entry/exit HEAD, entry verification and contradictions, authority recorded, parser and comparison validation, final relation counts across 279, analysis counts across 217, defects found and corrected, safety-invariant results, mandatory cohort, sampling algorithm/size/IDs/coverage, negative controls, proposals and batches, confirmation that no owner disposition was recorded, UI changes, accessibility and responsive results, performance measurements or NOT-RUN reasons, exact files, exact commands and results, evidence/finding/checkpoint identifiers, remaining risks and open policy choices, and the recommended next owner decision — closing with the required status line and standing disclaimers.
