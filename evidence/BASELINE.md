# Current Baseline Manifest

GENERATED - DO NOT HAND EDIT. Regenerate with `bun run evidence:run`.

Layer B derived record. Authority class: candidate. Method: automated, executor-produced, not independent.

| Field              | Value                                                              |
| ------------------ | ------------------------------------------------------------------ |
| Generated at       | 2026-08-21T13:50:34.218Z                                           |
| Commit             | `0771b8a6bd48852071c7fc698369140687e14af5`                         |
| Tree hash          | `d52d396f706f5923ba6644da0c316c9ebec992e2`                         |
| Working tree dirty | true                                                               |
| Input-set digest   | `ac5ee5da93074db65cf993545f76359880d5d654945adddd701045954f45b7a8` |
| Freshness          | **CURRENT**                                                        |

## Repository

| Measure             | Count                                      |
| ------------------- | ------------------------------------------ |
| Root commit         | `53ac085881fd9cb994f00945d3f7b55b61ab5662` |
| Commits             | 331                                        |
| Tracked files       | 629                                        |
| Source files        | 256                                        |
| Test files          | 34                                         |
| Route modules       | 43                                         |
| Documentation files | 223                                        |

## Derived state

| Subject                       | Recorded result                                                                      |
| ----------------------------- | ------------------------------------------------------------------------------------ |
| Build                         | Exit code 0. Duration 6171 ms.                                                       |
| Tests                         | Exit code 0. 709 tests passed of 709. 34 test files. Duration 39859 ms.              |
| Type check                    | Exit code 0.                                                                         |
| Lint                          | 0 problems across 0 files: 0 errors, 0 warnings, 0 auto-fixable.                     |
| Routes                        | 41                                                                                   |
| SBOM components               | 75                                                                                   |
| Vulnerability scan            | Scan completed. 0 advisories: {"critical":0,"high":0,"moderate":0,"low":0,"info":0}. |
| Licences requiring review     | 0                                                                                    |
| Secret scan candidates        | 0                                                                                    |
| Personal-data scan candidates | 1                                                                                    |
| Backend                       | No database or backend is configured in the tracked tree.                            |

## Cited evidence and applicability

| Evidence         | Type                 | Result          | Applicability |
| ---------------- | -------------------- | --------------- | ------------- |
| EV-BUILD         | BUILD                | pass            | CURRENT       |
| EV-TEST          | TEST                 | pass            | CURRENT       |
| EV-TYPECHECK     | TYPECHECK            | pass            | CURRENT       |
| EV-LINT          | LINT                 | pass            | CURRENT       |
| EV-ROUTES        | ROUTE_INVENTORY      | pass            | CURRENT       |
| EV-PROVENANCE    | SOURCE_PROVENANCE    | pass            | CURRENT       |
| EV-CONFIG        | CONFIGURATION        | pass            | CURRENT       |
| EV-SSOT-GUARD    | SSOT_BINDING         | pass            | CURRENT       |
| EV-DEPS          | DEPENDENCY_INVENTORY | pass            | CURRENT       |
| EV-SBOM          | SBOM                 | pass            | CURRENT       |
| EV-VULN          | VULNERABILITY_SCAN   | pass            | CURRENT       |
| EV-VULN-RECOVERY | VULNERABILITY_SCAN   | pass            | CURRENT       |
| EV-LICENSE       | LICENSE_SCAN         | pass            | CURRENT       |
| EV-SECRET        | SECRET_SCAN          | pass            | CURRENT       |
| EV-PII           | PII_BOUNDARY_SCAN    | review-required | CURRENT       |

## Boundaries

- No production data, no personal data, and no live integration is in scope.
- No result in this manifest constitutes certification, conformance, or release readiness.
- Workflow presence is not merge enforcement; branch protection is not verifiable from repository content (FND-012).
- Independence is declared. Every record here is executor-produced and not independent.
