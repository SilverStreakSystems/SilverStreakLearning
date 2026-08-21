# Current Baseline Manifest

GENERATED - DO NOT HAND EDIT. Regenerate with `bun run evidence:run`.

Layer B derived record. Authority class: candidate. Method: automated, executor-produced, not independent.

| Field | Value |
|---|---|
| Generated at | 2026-08-21T17:12:59.149Z |
| Commit | `3fd78ea339297027822510e5c08af44e0c1e1ab8` |
| Tree hash | `2344720ef6075546bce91f54a3c913a36b19cb7d` |
| Working tree dirty | true |
| Input-set digest | `042ff6fc232f8b3dc68fe810a3c929f17112a8b0057b34914bc5ded140748248` |
| Freshness | **CURRENT** |

## Repository

| Measure | Count |
|---|---|
| Root commit | `3190f7973cc6626912c8de24731514df0608a5d9` |
| Commits | 892 |
| Tracked files | 653 |
| Source files | 259 |
| Test files | 35 |
| Route modules | 43 |
| Documentation files | 239 |

## Derived state

| Subject | Recorded result |
|---|---|
| Build | Exit code 0. Duration 8329 ms. |
| Tests | Exit code 0. Test counts not parsed.  Duration 47254 ms. |
| Type check | Exit code 0. |
| Lint | 0 problems across 0 files: 0 errors, 0 warnings, 0 auto-fixable. |
| Routes | 41 |
| SBOM components | 75 |
| Vulnerability scan | SCAN STATUS - NOT COMPLETED / EXTERNAL SOURCE UNAVAILABLE. |
| Licences requiring review | 0 |
| Secret scan candidates | 0 |
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
| EV-SECRET | SECRET_SCAN | pass | CURRENT |
| EV-PII | PII_BOUNDARY_SCAN | review-required | CURRENT |


## Boundaries

- No production data, no personal data, and no live integration is in scope.
- No result in this manifest constitutes certification, conformance, or release readiness.
- Workflow presence is not merge enforcement; branch protection is not verifiable from repository content (FND-012).
- Independence is declared. Every record here is executor-produced and not independent.
