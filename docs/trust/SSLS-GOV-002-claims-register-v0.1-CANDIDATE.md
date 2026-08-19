# SSLS-GOV-002 — Claims Register v0.1 CANDIDATE

Governs what SSLS may state, to whom, and on what evidence. No claim outside this register
may be made in product copy, documentation, decks, proposals, or public material (R-08).

## Permitted claims

| claim_id | Exact permitted wording | Audience | Evidence | Authority |
| --- | --- | --- | --- | --- |
| CLM-P-001 | "SSLS currently operates under a zero-real-PII development boundary. Exposure-remediation evidence is maintained separately and does not establish legal, security, or privacy certification." | Internal | SSLS-TRUST-001; WP-000 scan evidence | Executor-recorded; owner disposition pending |
| CLM-P-002 | "A secret scan and a deterministic pattern sweep were executed against the current source tree and the repository's commit history on 2026-08-17, and returned no findings." | Internal | WP-000-scan-evidence, Scans 1–5 | Executor-recorded (automated, not independent) |
| CLM-P-003 | "The project has no backend, database, storage, or third-party connection configured." | Internal | WP-000 credential rotation log, inventory scope | Executor-recorded |
| CLM-P-004 | "Registry, workspace, and capability content in the shell is synthetic." | Internal | Fixture `synthetic` flags; Scan 6 | Executor-recorded |
| CLM-P-005 | "An automated repository check verifies that designated current-state documents declare the commit under review." | Internal | EV-015, EV-016, EV-017; `docs/wp-006/SSOT_BINDING_GUARD.md` | Executor-recorded (automated, not independent) |

## Prohibited claims

None of the following may be stated in any form, including hedged or implied form.

| claim_id | Prohibited claim | Why prohibited |
| --- | --- | --- |
| CLM-X-001 | FERPA compliant | No qualified review, no covered data, no agreement |
| CLM-X-002 | COPPA compliant | Same |
| CLM-X-003 | Fully secure | Unprovable proposition |
| CLM-X-004 | Production secure | No production environment, no security review |
| CLM-X-005 | District-ready | No pilot, no executed agreement |
| CLM-X-006 | Production-ready | No release evidence |
| CLM-X-007 | Independently validated | All verification to date is executor-run (R-11) |
| CLM-X-008 | Accessibility certified | Internal axe-core evidence only |
| CLM-X-009 | WCAG compliant | Automated checks are not conformance |
| CLM-X-010 | Security certified | No certifying body involved |
| CLM-X-011 | No breach occurred | Access logs unavailable; not determinable |
| CLM-X-012 | All exposed data was inaccessible | No exposure identified, but inaccessibility is unprovable |
| CLM-X-013 | All third-party copies were removed | EXP-003 is UNKNOWN |
| CLM-X-014 | Privacy compliant / breach cleared / production safe | Reserved terminology, unsupported |
| CLM-X-015 | SSOT freshness is guaranteed | The check compares a declared commit string; it cannot establish that any figure inside a document is current (FND-013) |
| CLM-X-016 | Merge protection is active | Branch-protection settings are not inspectable from repository content (FND-012) |
| CLM-X-017 | Evidence is always current | Evidence is bound to the commit at which it was produced and goes stale on the next commit (FND-011) |
| CLM-X-018 | CI proves governance compliance | A workflow executes a check; it confers no authority, approval, or conformance |
| CLM-X-019 | Repository provenance is independently validated | All provenance evidence is executor-produced self-inspection (R-11) |

## Rules

- A claim moves from prohibited to permitted only by owner decision citing direct current evidence for that exact proposition.
- Automated test results never promote a claim (R-07, R-11).
- Wording is exact. Paraphrase that strengthens a claim is a new claim.
