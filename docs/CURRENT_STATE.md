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
- DEC-011 (program register text), DEC-012 (effective accessibility standard revision), and
  DEC-013 (gate lineage) remain **open**, routed to WP-008, no later than WP-041, and WP-008
  respectively. None is resolved by WP-006 closure.
- Finding dispositions after WP-037: **FND-011 resolved** for pipeline-produced evidence (legacy
  hand-bound documents still drift); **FND-013 resolved for machine-derived baseline facts**, with
  narrative semantic accuracy still human-governed; **FND-012 remains open and NOT VERIFIED** —
  a CI workflow existing in the repository is not branch-protection enforcement; **FND-014 remains
  open and advisory** — repository-wide lint does not pass (677 problems, no new debt from this work),
  while WP-037 files report zero problems; **FND-015 REMEDIATED** — the five dependency advisories
  are absent from the post-remediation rescan.
- **WP-038 — Regulatory, Standards and Obligation Baseline: EXECUTOR-COMPLETE — OWNER CLOSURE
  DECISION REQUIRED.** The canonical registers under `data/governance/` hold 43 primary-source
  external authorities, 34 interpreted obligations, 6 conflicts, 5 stale references, 6 data-trigger
  classes, and 16 gaps, projected into `docs/wp-038/` and covered by 21 executing register-integrity
  tests. Registered as EV-026 (authority register), EV-027 (register integrity tests), and EV-028
  (data-collection inspection: no personal-data collection path, one first-party sidebar cookie).
  New findings **FND-016** (ULW-AS-001 v1.3 unbound to a WCAG version and level, routed to DEC-012),
  **FND-017** (BEFORE LIVE PII gate may fire after the first binding Massachusetts obligation), and
  **FND-018** (CycloneDX named without a specification version) are **open**. **DEC-018 is drafted
  and NOT ACCEPTED**: WP-038 is not closed, and no work package after it is authorized. Obligation
  interpretation is AI-assisted and executor-recorded. It is not legal advice, not independent
  review, and asserts no compliance with any obligation.
- Public deployment classification: **PUBLIC PROTOTYPE** (EV-020). Publication is not release
  authority.
- Gate A is not closed. No database enabled. No release authority. No independent validation.
  No production, district, or compliance claims.

## Verification recorded

- Vitest: 254 tests passing across 10 files, covering registered routes, detail
  routes, unrecorded identifiers, authority discipline, gate discipline,
  prohibited metrics, search authorization order, declared-binding freshness,
  evidence schema, applicability, expiry, reuse, and the verification gate.
  Production build succeeds.
- Accessibility: see `docs/ACCESSIBILITY_EVIDENCE.md`. Automated only.



## Not established

Release, public claim, human validation, and any blended readiness figure. None
of these exist and none may be inferred from the tests passing.
