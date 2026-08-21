# WP-037 → WP-038 Handoff

Next package: **WP-038 — Regulatory, Standards & Obligation Baseline.** **NEXT ELIGIBLE and
AUTHORIZED for generation and execution.** DEC-017 (accepted 2026-08-19) closes WP-037 by owner and
authorizes WP-038 only. Gate A is not closed and no later work package is authorized.

## Carried forward

| Item                       | State                                                                                             |
| -------------------------- | ------------------------------------------------------------------------------------------------- |
| Authorized software SSOT   | This Lovable-managed repository, adopted by DEC-010                                               |
| Evidence schema            | `scripts/evidence/schema.mjs`, schema version 1.0.0                                               |
| Evidence type policy       | 18 declared types in `scripts/evidence/inputs.mjs` with per-type input sets and reuse flags       |
| Expiry rules               | `scripts/evidence/expiry.mjs`; feed-dependent evidence is time-bounded                            |
| Applicability rules        | `scripts/evidence/applicability.mjs`; six states, UNKNOWN never collapsed                         |
| Current baseline           | `evidence/baseline.json`, regenerated per run                                                     |
| Current evidence index     | `evidence/evidence-index.json` and `docs/wp-037/EVIDENCE_INDEX.md`                                |
| Current evidence bundle    | `evidence/` — 14 records, artifacts, archived producing run at `evidence/runs/1f7c51e/`           |
| Claims Register            | CLM-001 … CLM-012, including the new CLM-008 permitted wording and CLM-009 … CLM-012 prohibitions |
| Public deployment boundary | PUBLIC PROTOTYPE; publication is not release authority                                            |

## Open items inherited by WP-038

- **DEC-011** — open; routed to WP-008 if unresolved sooner.
- **DEC-012** — open; due no later than WP-041.
- **DEC-013** — open; routed to WP-008.
- **DEC-015** — ACCEPTED BY OWNER as a HOLD disposition, preserved intact as historical record.
- **DEC-016** — ACCEPTED BY OWNER. Triage and bounded remediation authority; superseded DEC-015 only
  as current remediation authority.
- **DEC-017** — ACCEPTED BY OWNER. WP-037 CLOSED BY OWNER; WP-038 authorized for generation and
  execution only. Creates no security, privacy, accessibility, compliance, certification,
  district-readiness, or independent-validation claim.
- **FND-012** — open. Branch-protection enforcement is not verified and may not be claimed.
- **FND-014** — open / advisory. Repository-wide lint does not pass; WP-037 files report zero problems.
- **Vulnerability criterion** — COMPLETED on recorded evidence. `bun audit` still returns HTTP 404
  (EV-VULN, preserved verbatim as a failed attempt). The five advisories reported by EV-021 were
  triaged (EV-022) and remediated (EV-023); the post-remediation scan matched no advisories in its
  recorded scope at that point in time (EV-024), with regression verification in EV-025. This is
  automated, point-in-time, single-source evidence and is not independent security validation.
- **FND-011** — resolved for pipeline-produced evidence. Legacy hand-bound WP-006 documents remain
  subject to declaration drift and are not rebound.
- **FND-013** — resolved for machine-derived baseline facts. Narrative semantic accuracy remains
  human-governed.

## Prohibitions that travel with the handoff

No regulatory obligation identified in WP-038 may be recorded as met, satisfied, or complied with on
the basis of this evidence pipeline. The pipeline evidences execution and applicability only.
