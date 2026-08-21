# Role-First Technology Decision Architecture

A bounded architecture, registry, and planning increment. It registers the two supplied artifacts as governed future-state inputs, normalizes them into one machine-readable register, formalizes the seven-option decision process as a versioned schema, and builds a restrained founder-facing planning surface over it. It activates no role, no integration, no AI, and no backend.

## Entry state (verified before planning)

- HEAD `3b11b09` "Fixed product loop defects", clean tree, on the connected branch.
- **[C]** The prior increment (Product Alpha operator walkthrough + remediation) **completed and is committed**: `docs/product-alpha-001/WALKTHROUGH-001.md`, three remediations, four regressions, `bun run verify` PASSED at `b3d5d3b`, 633 tests / 31 files. It is not queued, not plan-only, not blocked. Nothing is stacked over unfinished work.
- **[C]** Gate A OPEN, WP-007 ACTIVE, DEC-023 controlling, `FND-024` (TTR-001 NOT-RUN) and `EV-003` remain open deferred debt. No accepted decision exists after DEC-023.
- Full-suite re-run, register ID scan, and `verify` will be re-run at implementation entry before any write.

## Source reconciliation already performed on the uploads

Recomputed from the workbook itself, not copied from the summary:

- **[C]** 20 sheets (Summary, Decision Process, 18 group sheets A–R); 18 columns per group sheet, matching the 18 declared fields.
- **[C]** 279 workflow rows; AI necessity Optional 94 / Unnecessary 115 / Helpful 38 / Prohibited 32 / **Required 0**; Risk High 102 / Moderate 138 / Low 39. Every published total reconciles.
- **[C]** Distinct role labels summed per group = **212**, matching the declared inventory group by group. Globally distinct labels = **211**, because one label legitimately appears in two groups. The register will carry both figures with that explanation; neither is silently "corrected".
- **[C]** SHA-256 of the workbook recorded; the summary Markdown is registered alongside it.
- **[U]** The uploaded binary lives on a read-only mount, not in the repository. Per-sheet and per-row digests will be recorded so the normalized register stays independently checkable without re-reading the binary. Re-extraction later requires the owner to re-supply the file — recorded as a stated limitation, not hidden.

## What gets built

**1. Bounded authority.** One owner decision record (next free `DEC-0xx`) authorizing exactly: source registration, the normalized register, the decision-process schema, derived docs, the planning routes, the Product Alpha technology-fit proof, and the tests. It explicitly refuses role activation, portals, Google/Apps Script execution, AI, production data/auth/tenancy, adoption of the L1–L10 scale, and any cycle, release, or conformance conclusion.

**2. Governed source registration.** The workbook and the summary registered as future-state, non-canonical inputs with digests, byte sizes, versions, dates, and external locators, following the existing governed-package conventions.

**3. Decision-process schema (versioned).** `TDP-001 v1.0.0`: the seven options, their considerations, and the seven-step precedence — human process first, SSLS fourth, AI fifth, abstention a valid success. Includes the hard AI invariants (never required by availability; deterministic preferred for predictable outputs; the enumerated consequential determinations are AI-prohibited; named human approver required; AI language distinguishable from authoritative fact).

**4. One truth plane.** A single normalized register (`data/technology-decisions/…`) holding all 279 rows: the 18 source fields preserved verbatim, plus governed metadata alongside them (stable ID, group, provenance and locator, authority/interpretation/review status, derived option IDs, deterministic-fit, sensitive-data and consequence class, record-authority/relational/longitudinal need, cross-role scope, permission complexity, audit requirement, AI-boundary class, required approver, unresolved questions, drift). Derived metadata is produced mechanically by the evaluator and labelled as derived; a supplied recommendation is **never** overwritten — disagreement is recorded as drift needing review. No second copy of these rows exists anywhere in the codebase.

**5. Deterministic evaluator.** Pure, total, explainable: answers in, minimum-effective option set out, with the answers that produced it and the precedence step that decided it. Supports Option 7, allows human override only with a recorded rationale, preserves uncertainty, and authorizes nothing.

**6. Planning surface** at `/technology-decisions` (overview, register with filter/search, workflow detail, evaluator, comparison view), plus `/technology-decisions/$workflowId`. No blended readiness score, no maturity score. Every page visibly separates FUTURE-STATE WORKFLOW ANALYSIS from CURRENT IMPLEMENTED PRODUCT AUTHORITY.

**7. Provisional maturity boundary.** L1–L10 preserved as source analysis only, always shown with its provisional warning, never used for readiness, promotion, or ordering, and never implying L10 is better. Carried as an explicit open owner decision (approve / replace / retire).

**8. Product Alpha proof.** Each of the eleven named loop steps evaluated independently against the process, with a written reason for why it belongs — or does not belong — in SSLS. Option 4 is not presumed. LLR-001 stays classified as deterministic rules, explicitly not AI.

## Documentation and records

`docs/technology-decisions/`: `DECISION_PROCESS.md`, `SOURCE_RECONCILIATION.md`, `ROLE_COVERAGE.md`, `PRODUCT_ALPHA_ASSESSMENT.md`, `PROVISIONAL_MATURITY_BOUNDARY.md`, `ACCEPTANCE.md` — all generated from the register by a `scripts/gen-*.ts` generator wired into the existing generated-artefact check, so a stale doc fails the build. Plus the owner decision record, one evidence record, and a checkpoint **only if every acceptance criterion passes**.

## Tests

New focused suites covering: recomputed counts and totals (279 / 18 groups / 212+211 roles / option, AI, risk distributions), field preservation for every row, unique IDs, resolving source locators, AI-Required stays zero, maturity never drives authority or ordering, future roles never render as active runtime roles, Option 7 selectable, SSLS not the default outcome, deterministic precedence over AI for predictable outputs, consequential rows always naming a human approver, prohibited boundaries visible, LLR-001 deterministic, supplied recommendations never silently accepted, drift surfaced, filters/search/detail/comparison/evaluator behaviour, keyboard operation, narrow-screen reflow, status never color-only, and a boundary test asserting no connector, AI, database, or role expansion was introduced. All existing tests keep passing, unchanged and unskipped.

## Interface and performance constraints

Existing design system only. Progressive disclosure; readable tables at desktop widths that become cards at narrow widths; no page-level horizontal overflow at 320 px; keyboard-operable filters and evaluator; visible focus; semantic headings, landmarks, tables, and status regions; text or icon plus text for risk and AI class, never color alone; 44×44 default with the TTR-001 24×24 floor applied as an implementation contract; plain language with abbreviations expanded; reduced-motion respected. The register is a large data file, so the route loads it split from the main bundle, filtering is memoized over a prebuilt index, and no charting or table dependency is added.

## Verification

`lint` at zero warnings, `typecheck`, focused suites, full suite, production build, generated-document check, current-state projection check, `verify`, `evidence:run`, `evidence:verify`, and a cross-register duplicate-identifier and contradiction scan. No weakened invariant, no skipped test, no broad timeout increase, no deployment.

## Explicit non-goals

No future role activated; no accounts or portals; no real district, staff, student, family, vendor, or clinical data; no Google Workspace or Apps Script connection or execution; no production database, authentication, tenancy, or RLS; no AI provider, model, prompt runtime, or generative UI; no simulated stakeholder approval; no adoption of the L1–L10 scale; no TTR-001 audit execution; no Cycle 9, WP-039, release, or conformance conclusion.

## Sequencing

1. Entry verification and identifier scan.
2. Owner decision, source registration, decision-process schema.
3. Extraction and normalization into the register, with the reconciliation report.
4. Domain model, registry reader, validation, evaluator.
5. Generators and documentation.
6. Routes and components.
7. Product Alpha assessment.
8. Tests, then full validation, evidence, and — only if everything passes — the checkpoint.

If any step surfaces a contradiction in repository truth, the increment stops and reports the blocking state rather than writing over it.
