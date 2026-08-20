# Current Baseline Manifest

GENERATED - DO NOT HAND EDIT. Regenerate with `bun run evidence:run`.

Layer B derived record. Authority class: candidate. Method: automated, executor-produced, not independent.

| Field | Value |
|---|---|
| Generated at | 2026-08-20T10:49:42.784Z |
| Commit | `245a3f86d626772bdf571413c9f5677cd2c76f66` |
| Tree hash | `e0526aff5b8dd1052319e030701523a714187df8` |
| Working tree dirty | true |
| Input-set digest | `2204919ed48b445ff70298509f5d23466ba760269745b962e30b19f4062d6342` |
| Freshness | **CURRENT** |

## Repository

| Measure | Count |
|---|---|
| Root commit | `3190f7973cc6626912c8de24731514df0608a5d9` |
| Commits | 679 |
| Tracked files | 541 |
| Source files | 198 |
| Test files | 19 |
| Route modules | 31 |
| Documentation files | 210 |

## Derived state

| Subject | Recorded result |
|---|---|
| Build | Exit code 0. Duration 7145 ms. |
| Tests | Exit code 0. Test counts not parsed.  Duration 23996 ms. |
| Type check | Exit code 0. |
| Lint | 0 problems across 0 files: 0 errors, 0 warnings, 0 auto-fixable. |
| Routes | 29 |
| SBOM components | 75 |
| Vulnerability scan | SCAN STATUS - NOT COMPLETED / EXTERNAL SOURCE UNAVAILABLE. |
| Licences requiring review | 0 |
| Secret scan candidates | 2 |
| Personal-data scan candidates | 1 |
| Backend | No database or backend is configured in the tracked tree. |

## Cited evidence and applicability

| Evidence | Type | Result | Applicability |
|---|---|---|---|
| EV-BUILD | BUILD | pass | CURRENT |
| EV-TEST | TEST | pass | CURRENT |
| EV-TYPECHECK | TYPECHECK | pass | CURRENT |
| EV-LINT | LINT | pass | CURRENT |
| EV-ROUTES | ROUTE_INVENTORY | pass | CURRENT |
| EV-PROVENANCE | SOURCE_PROVENANCE | pass | CURRENT |
| EV-CONFIG | CONFIGURATION | pass | CURRENT |
| EV-SSOT-GUARD | SSOT_BINDING | pass | CURRENT |
| EV-DEPS | DEPENDENCY_INVENTORY | pass | CURRENT |
| EV-SBOM | SBOM | pass | CURRENT |
| EV-VULN | VULNERABILITY_SCAN | not-completed | CURRENT |
| EV-VULN-RECOVERY | VULNERABILITY_SCAN | pass | CURRENT |
| EV-LICENSE | LICENSE_SCAN | pass | CURRENT |
| EV-SECRET | SECRET_SCAN | review-required | CURRENT |
| EV-PII | PII_BOUNDARY_SCAN | review-required | CURRENT |


## Boundaries

- No production data, no personal data, and no live integration is in scope.
- No result in this manifest constitutes certification, conformance, or release readiness.
- Workflow presence is not merge enforcement; branch protection is not verifiable from repository content (FND-012).
- Independence is declared. Every record here is executor-produced and not independent.
