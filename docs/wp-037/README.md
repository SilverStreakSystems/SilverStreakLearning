# WP-037 — Evidence & Verification Pipeline

Authority class: candidate. Method: automated, executor-produced, not independent.
Executed under SSLS-BPP-001 v2.0 (DEC-007). Eligible because WP-006 was closed by DEC-014.
Repository SSOT adopted by DEC-010.

This work package replaces hand-declared commit bindings with an executable pipeline that
collects evidence, records exactly what each result supports and cannot support, and decides
freshness from the inputs a result actually depended on.

## Documents

| Document | Purpose |
|---|---|
| `EVIDENCE_ARCHITECTURE.md` | The two record layers and why they are kept separate |
| `EVIDENCE_SCHEMA.md` | Layer A record schema, field by field |
| `INPUT_SETS.md` | Which inputs each evidence type depends on |
| `APPLICABILITY_MODEL.md` | The six applicability states and how each is decided |
| `EXPIRY_POLICY.md` | Validity windows and invalidation conditions, with rationale |
| `REUSE_CONTRACT.md` | The seven conditions for carrying a result forward |
| `PIPELINE_OPERATION.md` | How to run, verify, and read the output |
| `SUPPLY_CHAIN_EVIDENCE.md` | Dependency inventory, SBOM, vulnerability, and licence posture |
| `BOUNDARY_CONTROLS.md` | Secret and personal-data scanning, and their limits |
| `CI_INTEGRATION.md` | Workflow design, permissions, and the enforcement gap |
| `FINDING_DISPOSITIONS.md` | What WP-037 does to FND-011, FND-012, FND-013, FND-014 |
| `REFUSED_CLAIMS.md` | Statements this pipeline will not produce |
| `MIGRATION_FROM_WP-006.md` | Relationship to the predecessor binding guard |

## Boundaries

- No product feature, no database, no live integration, no AI feature, no personal data.
- No result here certifies anything, closes a gate, or establishes release readiness.
- Only a recorded owner decision closes a gate. The pipeline never self-closes one.
