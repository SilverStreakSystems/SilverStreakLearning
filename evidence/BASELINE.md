# Current Baseline Manifest

GENERATED - DO NOT HAND EDIT. Regenerate with `bun run evidence:run`.

Layer B derived record. Authority class: candidate. Method: automated, executor-produced, not independent.

| Field | Value |
|---|---|
| Generated at | 2026-08-19T05:12:19.466Z |
| Commit | `835cc6ea666538ba24495272e4bc02b2b18dc2f2` |
| Tree hash | `74b7c64a3e2a5c7a04a4035fee084a2815216f58` |
| Working tree dirty | true |
| Input-set digest | `9f2c021b8bdbb047cb2cfb45d33bd31821d5ddfa15e9c8ab2450e32a89e31eae` |
| Freshness | **CURRENT** |

## Repository

| Measure | Count |
|---|---|
| Root commit | `3190f7973cc6626912c8de24731514df0608a5d9` |
| Commits | 408 |
| Tracked files | 448 |
| Source files | 213 |
| Test files | 10 |
| Route modules | 31 |
| Documentation files | 152 |

## Derived state

| Subject | Recorded result |
|---|---|
| Build | Exit code 0. Duration 6790 ms. |
| Tests | Exit code 0. Test counts not parsed.  Duration 17647 ms. |
| Type check | Exit code 0. |
| Lint | 677 problems across 103 files: 663 errors, 14 warnings, 658 auto-fixable. |
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
| EV-LICENSE | LICENSE_SCAN | pass | CURRENT |
| EV-SECRET | SECRET_SCAN | pass | CURRENT |
| EV-PII | PII_BOUNDARY_SCAN | pass | CURRENT |


## Boundaries

- No production data, no personal data, and no live integration is in scope.
- No result in this manifest constitutes certification, conformance, or release readiness.
- Workflow presence is not merge enforcement; branch protection is not verifiable from repository content (FND-012).
- Independence is declared. Every record here is executor-produced and not independent.
