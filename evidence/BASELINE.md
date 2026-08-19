# Current Baseline Manifest

GENERATED - DO NOT HAND EDIT. Regenerate with `bun run evidence:run`.

Layer B derived record. Authority class: candidate. Method: automated, executor-produced, not independent.

| Field | Value |
|---|---|
| Generated at | 2026-08-19T14:52:14.838Z |
| Commit | `ca018bafba8da87fe8b77eb1972f1ff7f0339392` |
| Tree hash | `7e74ce4bbba9d9a242a285165e4922cc8024498e` |
| Working tree dirty | true |
| Input-set digest | `551d247261299378ddbce9907ae8fa928faaa00c2eec137e2194865c882769aa` |
| Freshness | **CURRENT** |

## Repository

| Measure | Count |
|---|---|
| Root commit | `3190f7973cc6626912c8de24731514df0608a5d9` |
| Commits | 486 |
| Tracked files | 502 |
| Source files | 219 |
| Test files | 12 |
| Route modules | 31 |
| Documentation files | 188 |

## Derived state

| Subject | Recorded result |
|---|---|
| Build | Exit code 0. Duration 6661 ms. |
| Tests | Exit code 0. Test counts not parsed.  Duration 17826 ms. |
| Type check | Exit code 0. |
| Lint | 692 problems across 109 files: 678 errors, 14 warnings, 673 auto-fixable. |
| Routes | 29 |
| SBOM components | 74 |
| Vulnerability scan | SCAN STATUS - NOT COMPLETED / EXTERNAL SOURCE UNAVAILABLE. |
| Licences requiring review | 0 |
| Secret scan candidates | 0 |
| Personal-data scan candidates | 0 |
| Backend | No database or backend is configured in the tracked tree. |

## Cited evidence and applicability

| Evidence | Type | Result | Applicability |
|---|---|---|---|
| EV-BUILD | BUILD | pass | CURRENT |
| EV-TEST | TEST | pass | CURRENT |
| EV-TYPECHECK | TYPECHECK | pass | CURRENT |
| EV-LINT | LINT | review-required | CURRENT |
| EV-ROUTES | ROUTE_INVENTORY | pass | CURRENT |
| EV-PROVENANCE | SOURCE_PROVENANCE | pass | CURRENT |
| EV-CONFIG | CONFIGURATION | pass | CURRENT |
| EV-SSOT-GUARD | SSOT_BINDING | review-required | CURRENT |
| EV-DEPS | DEPENDENCY_INVENTORY | pass | CURRENT |
| EV-SBOM | SBOM | pass | CURRENT |
| EV-VULN | VULNERABILITY_SCAN | not-completed | CURRENT |
| EV-VULN-RECOVERY | VULNERABILITY_SCAN | pass | CURRENT |
| EV-LICENSE | LICENSE_SCAN | pass | CURRENT |
| EV-SECRET | SECRET_SCAN | pass | CURRENT |
| EV-PII | PII_BOUNDARY_SCAN | pass | CURRENT |


## Boundaries

- No production data, no personal data, and no live integration is in scope.
- No result in this manifest constitutes certification, conformance, or release readiness.
- Workflow presence is not merge enforcement; branch protection is not verifiable from repository content (FND-012).
- Independence is declared. Every record here is executor-produced and not independent.
