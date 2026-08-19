# WP-037 → WP-038 Handoff

Next package: **WP-038 — Regulatory, Standards & Obligation Baseline.** **NOT AUTHORIZED and NOT
STARTED.** DEC-015 (accepted 2026-08-19) records WP-037 as HOLD; this handoff becomes effective only
on a future recorded owner closure of WP-037.

## Carried forward

| Item | State |
| --- | --- |
| Authorized software SSOT | This Lovable-managed repository, adopted by DEC-010 |
| Evidence schema | `scripts/evidence/schema.mjs`, schema version 1.0.0 |
| Evidence type policy | 18 declared types in `scripts/evidence/inputs.mjs` with per-type input sets and reuse flags |
| Expiry rules | `scripts/evidence/expiry.mjs`; feed-dependent evidence is time-bounded |
| Applicability rules | `scripts/evidence/applicability.mjs`; six states, UNKNOWN never collapsed |
| Current baseline | `evidence/baseline.json`, regenerated per run |
| Current evidence index | `evidence/index.json` and `docs/wp-037/EVIDENCE_INDEX.md` |
| Current evidence bundle | `evidence/` — 14 records, artifacts, archived producing run at `evidence/runs/1f7c51e/` |
| Claims Register | CLM-001 … CLM-012, including the new CLM-008 permitted wording and CLM-009 … CLM-012 prohibitions |
| Public deployment boundary | PUBLIC PROTOTYPE; publication is not release authority |

## Open items inherited by WP-038

- **DEC-011** — open; routed to WP-008 if unresolved sooner.
- **DEC-012** — open; due no later than WP-041.
- **DEC-013** — open; routed to WP-008.
- **DEC-015** — ACCEPTED BY OWNER as a HOLD disposition. Not a waiver and not a closure.
- **FND-012** — open. Branch-protection enforcement is not verified and may not be claimed.
- **FND-014** — open / advisory. Repository-wide lint does not pass; WP-037 files report zero problems.
- **Vulnerability criterion** — NOT COMPLETED. `bun audit` returns HTTP 404 (EV-VULN, preserved
  verbatim). The bounded recovery scan (EV-021 / `EV-VULN-RECOVERY`) completed and reported five
  unremediated high-severity advisories: brace-expansion 1.1.16 and 5.0.8, js-yaml 4.3.0,
  nanoid 3.3.16. WP-038 must not treat the dependency set as clean or as triaged.

## Dispositioned, with residuals

- **FND-011** — resolved for pipeline-produced evidence. Legacy hand-bound WP-006 documents remain
  subject to declaration drift and are not rebound.
- **FND-013** — resolved for machine-derived baseline facts. Narrative semantic accuracy remains
  human-governed.

## Prohibitions that travel with the handoff

No regulatory obligation identified in WP-038 may be recorded as met, satisfied, or complied with on
the basis of this evidence pipeline. The pipeline evidences execution and applicability only.
