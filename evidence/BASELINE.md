# Current Baseline Manifest

GENERATED - DO NOT HAND EDIT. Regenerate with `bun run evidence:run`.

Layer B derived record. Authority class: candidate. Method: automated, executor-produced, not independent.

| Field | Value |
|---|---|
| Generated at | 2026-08-19T19:47:05.100Z |
| Commit | `c22abb620b622cc24c95cab3263ba518e2f43fe3` |
| Tree hash | `a501db335caeaf1fbfa6fd042e7d1f432e0112c5` |
| Working tree dirty | true |
| Input-set digest | `b0c63af422d8c2ef6d967a5a4cb0bfd695f609edde4694daed8021f93615a2fb` |
| Freshness | **CURRENT** |

## Repository

| Measure | Count |
|---|---|
| Root commit | `3190f7973cc6626912c8de24731514df0608a5d9` |
| Commits | 580 |
| Tracked files | 535 |
| Source files | 229 |
| Test files | 15 |
| Route modules | 31 |
| Documentation files | 201 |

## Derived state

| Subject | Recorded result |
|---|---|
| Build | Exit code 0. Duration 7607 ms. |
| Tests | Exit code 0. Test counts not parsed.  Duration 24412 ms. |
| Type check | Exit code 0. |
| Lint | 704 problems across 116 files: 690 errors, 14 warnings, 685 auto-fixable. |
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
