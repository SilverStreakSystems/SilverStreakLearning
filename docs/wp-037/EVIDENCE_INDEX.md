# WP-037 Evidence Index

Authority class: current summary. Executor-produced, self-verified, `independent = false` throughout.

## Governed register evidence

| ID | Title | State | Binding |
| --- | --- | --- | --- |
| EV-019 | WP-037 pipeline implementation — producing run | Confirmed | Permanently bound to commit `1f7c51e`; archived at `evidence/runs/1f7c51e/` |
| EV-020 | Public deployment reachability observation | Confirmed | Single HTTPS fetch of the published surface |
| EV-018 | Predecessor owner-authorization pass | Confirmed | Commit `c1f0601` (WP-006 lineage) |

## Pipeline-produced execution records (`evidence/records/`)

| Record | Type | Result at the producing run |
| --- | --- | --- |
| EV-BUILD | BUILD | pass |
| EV-TEST | TEST | pass — 254/254 across 10 files |
| EV-TYPECHECK | TYPECHECK | pass |
| EV-LINT | LINT | review-required — repository lint debt (FND-014) |
| EV-CONFIG | CONFIGURATION | pass; `branch_protection` recorded as NOT VERIFIED |
| EV-DEPS | DEPENDENCY_INVENTORY | pass |
| EV-SBOM | SBOM | pass — CycloneDX JSON |
| EV-LICENSE | LICENSE_SCAN | pass — inventory only, no legal opinion |
| EV-VULN | VULNERABILITY_SCAN | **not-completed** — external advisory feed unavailable |
| EV-SECRET | SECRET_SCAN | pass — digests and locations only, never matched values |
| EV-PII | PII_BOUNDARY_SCAN | pass — synthetic-data boundary |
| EV-PROVENANCE | SOURCE_PROVENANCE | pass |
| EV-ROUTES | ROUTE_INVENTORY | pass |
| EV-SSOT-GUARD | SSOT_BINDING | review-required — predecessor guard exits 1 |

## Derived layer

- `evidence/baseline.json` — regenerated per run from ten declared input sets; never hand-edited.
- `evidence/index.json` — machine index of records and artifact hashes.
- `evidence/artifacts/` — build, test, SBOM, license, boundary, and provenance artifacts, each hashed in its record.

## Immutability

Records are bound to the commit and input hashes at which they executed. They are superseded, never
rewritten. `EV-VULN` is preserved exactly as produced, including its NOT COMPLETED result.
