# Current state of the SSLS foundation shell

> **Superseded as the canonical current-state record.** WP-006 produced
> `docs/wp-006/SSLS-FND-001-current-state-ssot-v0.1-CANDIDATE.md`, which is bound to a specific
> commit and is now the single source of truth for current state. This file is preserved for
> continuity and describes the shell in narrative form only. Recorded as STL-005.

Authority class: current-state record. Machine-verified only. No human,
independent, legal, security, accessibility, or district review has occurred.


## Boundary now in force

Founder and developer operator only. No personal data. All records are
synthetic. No product-facing AI. Future architecture is modelled and gated, and
carries no implementation authority.

## What is implemented

- Prompt 001 — Foundation and authority shell: authority classes declared
  independently of implementation status, seven foundation layers, governance
  spine, and the operator shell.
- Prompt 002 — Enterprise capability architecture v0.1: 12-domain taxonomy,
  129 candidate capabilities, maturity stages S0 to S5, trigger gates, and
  builder/validator independence rules.
- Prompt 003 — Shared enterprise objects, context, work and evidence v0.1:
  32 object types across 7 families, eight independent state axes, version-bound
  evidence, and the purpose-bound context assembly contract.
- Prompt 004 — Value streams and operating workflow v0.1: 18 priority value
  streams, stages, handoffs, gates, refusal records, and prohibited metrics.
- Prompt 005 — Command centers and workspace experience v0.1: nine workspace
  definitions, six global utilities, and the nine-step projection engine.
- Brand visual system and experience template architecture v0.1.

## Single source of truth

Workspaces are defined once, in the canonical workspace register. The future
architecture page derives its gated view from that register and holds no records
of its own.

## Program status

- Governing program: **SSLS-BPP-001 v2.0**, ratified by DEC-007.
- **WP-000 — Exposure Containment and Credential Remediation: executed and OWNER CLOSED**
  by DEC-008 (2026-08-17). Owner closure on the executor evidence package, not a technical,
  security, privacy, legal, or compliance certification.
- Residual external-copy uncertainty is **accepted** by DEC-009 for the current private,
  founder-only, zero-real-PII phase. It is bounded, not resolved.
- **WP-006 — Current-State SSOT and Repository Provenance: executed and CLOSED BY OWNER**
  by DEC-014 (2026-08-19), following DEC-010, which adopts the current Lovable-managed
  repository as the go-forward software source of truth. Historical repository and bootstrap
  artifacts remain historical governance and evidence lineage.
- **WP-037 — Evidence and Verification Pipeline: EXECUTED AND REMEDIATED — OWNER CLOSURE DECISION REQUIRED.**
  The pipeline is implemented and reproduced (`bun run evidence:run`: 15 records, fail=0,
  review-required=2, not-completed=1, baseline CURRENT).
  **DEC-015 is preserved as the accepted HOLD disposition.** **DEC-016 (accepted 2026-08-19)**
  authorized triage and bounded remediation only, and supersedes DEC-015 solely as current
  remediation authority. Under it the five high-severity advisories reported by EV-021
  (brace-expansion 1.1.16 and 5.0.8, js-yaml 4.3.0, nanoid 3.3.16) were triaged (EV-022) and
  remediated by minimum-necessary pinning to brace-expansion 5.0.9, js-yaml 4.3.1, and nanoid 3.3.18
  (EV-023). The post-remediation rescan completed with HTTP 200 over 560 resolved versions across
  526 packages and **0 matched advisories** (EV-024); regression verification recorded typecheck
  clean, 254/254 tests, a successful build, and lint debt reduced from 683 to 677 problems (EV-025).
  `EV-VULN` is preserved verbatim as a failed attempt (`bun audit`, HTTP 404) and is not a clean
  result. The vulnerability exit criterion now reconciles to **PASS on completed evidence**;
  FND-015 is **REMEDIATED**.
- **WP-037 is CLOSED BY OWNER** under **DEC-017 (accepted 2026-08-19)**. The closure carries forward
  unchanged limitations: FND-012 OPEN / NOT VERIFIED, FND-014 OPEN / ADVISORY, `bun audit` still
  unable to complete in this environment, and vulnerability evidence that is automated,
  point-in-time, and not independent security validation. **WP-038 — Regulatory, Standards &
  Obligation Baseline is NEXT ELIGIBLE** and authorized for generation and execution only.
  DEC-017 does not close Gate A, does not authorize later work packages, and creates no security,
  privacy, accessibility, compliance, certification, district-readiness, or independent-validation
  claim. The published surface remains **PUBLIC PROTOTYPE**.
- DEC-011 (program register text) and DEC-013 (gate lineage) remain **open**, both routed to WP-008.
  Neither is resolved by WP-006 closure. DEC-012 is now **accepted** (see the WP-038 entry below);
  it names an internal accessibility target and does not declare which ULW-AS-001 revision is
  effective, so FND-010 stays open.

- Finding dispositions after WP-037: **FND-011 resolved** for pipeline-produced evidence (legacy
  hand-bound documents still drift); **FND-013 resolved for machine-derived baseline facts**, with
  narrative semantic accuracy still human-governed; **FND-012 remains open and NOT VERIFIED** —
  a CI workflow existing in the repository is not branch-protection enforcement; **FND-014 remains
  open and advisory** — repository-wide lint does not pass (677 problems, no new debt from this work),
  while WP-037 files report zero problems; **FND-015 REMEDIATED** — the five dependency advisories
  are absent from the post-remediation rescan.
- **WP-038 — Regulatory, Standards and Obligation Baseline: CLOSED BY OWNER** under **DEC-018
  (accepted 2026-08-19)**. The canonical registers under `data/governance/` hold 43 primary-source
  external authorities, 34 interpreted obligations, 6 conflicts, 5 stale references, 6 data-trigger
  classes, and 16 gaps, projected into `docs/wp-038/` and covered by executing register-integrity
  tests. Registered as EV-026 (authority register), EV-027 (register integrity tests), and EV-028
  (data-collection inspection: no personal-data collection path, one first-party sidebar cookie).
  Closure creates no compliance, legal, certification, procurement, district-approval, or
  independent-review claim; obligation interpretation is AI-assisted and executor-recorded.
  **DEC-012 is ACCEPTED (2026-08-19)**: WCAG 2.2 Level AA is the current internal SSLS accessibility
  design and validation target for new and actively governed implementation, superseding older
  internal references to WCAG 2.1 Level AA. It establishes no WCAG 2.2 conformance, ADA, Section 504
  or 508 compliance, ACR/VPAT result, procurement acceptance, district approval, or certification,
  and independent accessibility validation remains required at the applicable later gate. Where a
  verified external obligation requires a different or more specific standard, that obligation
  controls. **FND-016 is PARTIALLY RESOLVED** — the absence of a named target is closed by DEC-012,
  while ULW-AS-001 v1.3's own unbound text, criterion-level mapping to WCAG 2.2, coverage against
  ADA Title II's WCAG 2.1 AA reference, and independent validation remain unresolved. **FND-017**
  (BEFORE LIVE PII gate may fire after the first binding Massachusetts obligation) and **FND-018**
  (CycloneDX named without a specification version) remain **open**. **FND-010** remains open and
  conflicted: DEC-012 does not declare which ULW-AS-001 revision is effective.
  **WP-007 — Historical Requirement Conformance Recovery is NEXT ELIGIBLE**, subject to verification
  that no later accepted decision supersedes the Build Program sequence. WP-039 is not authorized by
  numerical order. Gate A remains open.

- **FND-019 (REPAIRED, this cycle):** the WP-037 minimum-necessary pin (EV-023) forced
  brace-expansion 5.0.9 on all consumers and broke ESLint through minimatch 3.1.5
  (`TypeError: expand is not a function`), so the lint check could not execute. The flat override
  was removed; semver now resolves 1.1.18 and 5.0.9 side by side, both advisory-free, and lint
  executes again at **686 problems (672 errors, 14 warnings)** — FND-014 remains open and advisory.
  Recorded as EV-029.
- **WP-007 — Historical Requirement Conformance Recovery: IN PROGRESS, cycles 1 and 2 targets MET.**
  Entered under DEC-018 with Gate A open. Two entry defects were repaired first: the stale
  `docs/wp-038/HANDOFF_TO_WP-039.md` locator was renamed to `docs/wp-038/HANDOFF_TO_WP-007.md`
  with active references updated (EV-030, documentation lineage STL-006), and FND-016's structured
  resolution state was corrected to `partial` to match the owner disposition already recorded in
  its text. Cycle 1 established a canonical historical-source universe: schema
  `data/historical/HISTORICAL_SOURCE_SCHEMA.json` v1.0.0, register
  `data/historical/historical-sources.json` with 22 classified sources, invariant tests in
  `src/test/historical-sources.test.ts`, and a projection under `docs/wp-007/` (EV-031). Three
  sources are `NOT-ACCESSIBLE-TO-EXECUTOR` — the WP-006-named prior repository and bootstrap
  artifacts, the owner-supplied Drive folder, and legacy application code — and carry no version,
  no content claim, and `UNKNOWN` recovery relevance. No historical source is promoted, no
  gate or work package is closed, and WP-039 is neither created nor implied. Cycle 2 added the
  canonical historical-requirement schema `data/historical/HISTORICAL_REQUIREMENT_SCHEMA.json`
  v1.0.0 and register `data/historical/historical-requirements.json`: 14 candidate requirements,
  HREQ-001..HREQ-014, extracted from exactly one named HIGH-relevance reachable source, HS-011
  (`docs/ACCESSIBILITY_ACCEPTANCE.md`), each with an exact line locator, verbatim original wording
  held separate from a normalized summary, `HISTORICAL-EVIDENCE` authority inherited without
  promotion, a requirement family, the modality as worded, extraction confidence and ambiguity.
  The owner-preferred August 5, 2026 clean-room v0.2 source is not reachable through any governed
  repository mechanism, so it was not opened, inferred, or simulated; the rationale is recorded in
  `docs/wp-007/CYCLE2_SOURCE_SELECTION.md`. Every candidate remains
  `CANDIDATE-PRE-DISPOSITION` and `NOT-ASSESSED`; no owner disposition and no conformance state is
  assigned (EV-032). See `docs/wp-007/ENTRY_SPECIFICATION.md`, `docs/wp-007/CHECKPOINT-001.md` and
  `docs/wp-007/CHECKPOINT-002.md`.
- **WP-007 cycle 3 — v0.3.0 governed package integration and synchronization.** The
  owner-supplied SSLS 2.0 v0.3.0 reference package is registered as **PKG-002** in the canonical
  register `data/packages/governed-packages.json` under schema `GOVERNED_PACKAGE_SCHEMA.json`
  v1.0.0, classified **SYNCHRONIZED-REFERENCE / NONCANONICAL**. Both digests declared in
  `SSLS_2.0_v0.3.0_SHA256_2026-08-19.txt` were recomputed and matched exactly; the manifest
  declares no digest for itself. The package contains exactly three files; the DOCX and ZIP named
  by the earlier, historical v0.2.0 manifest were not supplied and are registered as NOT-SUPPLIED
  under predecessor package PKG-001 with no size, no digest and no repository locator. No binary
  is retained in the repository, so each artifact carries a governed external locator only.
  Reconciliation against the canonical registers is recorded in `docs/packages/DRIFT_REGISTER.md`;
  no repository value was adopted from the package summary. Registered as EV-033 (integrity and
  provenance) and EV-034 (reconciliation). Registration promotes nothing, closes no finding and no
  work package, and WP-039 is not authorized.
- Public deployment classification: **PUBLIC PROTOTYPE** (EV-020). Publication is not release
  authority.
- Gate A is not closed. No database enabled. No release authority. No independent validation.
  No production, district, or compliance claims.


## Verification recorded

- Vitest: 324 tests passing across 14 files, covering registered routes, detail
  routes, unrecorded identifiers, authority discipline, gate discipline,
  prohibited metrics, search authorization order, declared-binding freshness,
  evidence schema, applicability, expiry, reuse, the verification gate, and governed-package
  integrity, provenance, and non-promotion.
  Production build succeeds.
- Accessibility: see `docs/ACCESSIBILITY_EVIDENCE.md`. Automated only.



## Not established

Release, public claim, human validation, and any blended readiness figure. None
of these exist and none may be inferred from the tests passing.

## Command Center and Action Center synchronization (2026-08-19)

The Command Center (`/`) and the Action Center (`/actions`) project the post–WP-007
Cycle 3 state from canonical structured registers only:

- `src/fixtures/program.ts` (shape in `src/domain/program-state.ts`) carries gate state,
  active work package, latest checkpoint, pending owner disposition, checkpoint-bound
  verification statements, explicitly unauthorized stages, and the publication boundary.
  Each field names the record it reports.
- `data/packages/governed-packages.json` and `data/packages/package-drift.json` carry the
  governed package and its four unresolved drift rows. `docs/packages/DRIFT_REGISTER.md`
  is now generated from the latter rather than hand-maintained.
- The pending owner obligation is carried once, on FND-020 in the findings register, and
  is surfaced first in the Action Center by the recorded owner priority directive printed
  beside it.

Recorded as EV-035. The synchronization changed no governed state: Gate A remains open,
WP-007 remains active, the Cycle 3 disposition remains pending, every drift row remains
unresolved, PKG-002 remains a noncanonical synchronized reference, and Cycle 4 and WP-039
remain unauthorized.
