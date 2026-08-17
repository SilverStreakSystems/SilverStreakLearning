# SSLS 2.0 — Foundation & Authority Shell (Builds 001–002)

Private founder/developer operator shell. No personal data, no production data,
no AI features, no external integrations. Every record in the interface is
synthetic and visibly marked.

## Documents

| Document | Purpose |
| --- | --- |
| `CURRENT_STATE.md` | What is built, what is only declared, what is refused. |
| `FOUNDATION_AUTHORITY_MAP.md` | Layers L0–L7 and how authority is declared. |
| `CAPABILITY_REGISTRY_SCHEMA.md` | Retired capability schema; points to the current model. |
| `capability-architecture/OVERVIEW.md` | Enterprise Capability Architecture v0.1 scope and limits. |
| `capability-architecture/OBJECT_MODEL.md` | `EnterpriseCapability` field groups and locked rules. |
| `capability-architecture/DOMAIN_TAXONOMY.md` | Twelve candidate domains and placement rules. |
| `capability-architecture/NORMALIZATION_PASS.md` | Synonyms, duplicates, roles, processes, modules. |
| `capability-architecture/MATURITY_AND_STAGES.md` | S0–S5 stages and declared maturity levels. |
| `capability-architecture/TRIGGER_GATES.md` | Thresholds that must not be crossed, and why. |
| `capability-architecture/INDEPENDENCE_RULES.md` | Builder / validator separation. |
| `capability-architecture/DELIVERABLE_TYPES.md` | The sixteen deliverable types. |
| `capability-architecture/DEPENDENCY_MODEL.md` | Relationship kinds and why the graph is tabular. |
| `capability-architecture/COVERAGE_AND_CONSOLIDATION.md` | How a capability may be held today. |
| `capability-architecture/NORTH_STAR_TRACE.md` | Ability to evidence to human. |
| `capability-architecture/COMMAND_VIEW.md` | The `/capabilities` views, filters, and a11y commitments. |
| `capability-architecture/REFUSED_CLAIMS.md` | Statements deliberately withheld. |
| `capability-architecture/OPEN_QUESTIONS.md` | Known gaps in the architecture. |
| `capability-architecture/CHANGE_CONTROL.md` | How records may change, and what never changes authority. |
| `TRACEABILITY_MODEL.md` | Governance Spine and Enterprise Outcome chain. |
| `ACCESSIBILITY_ACCEPTANCE.md` | ULW-AS-001 v1.3 acceptance and verification state. |
| `FUTURE_ARCHITECTURE_BOUNDARY.md` | Gated target-state workspaces. |
| `FINDINGS.md` | Findings register in text form. |

## Increment documentation

- `docs/capability-architecture/` — enterprise capability architecture v0.1.
- `docs/shared-object/` — shared object, context, work and evidence architecture v0.1.
- `docs/value-streams/` — enterprise value streams and operating workflow architecture v0.1,
  including one generated document per priority stream.

## Code map

- `src/domain/` — authority, layers, artifacts, capabilities, traceability,
  registers, future workspaces. TypeScript is the schema source of truth.
- `src/fixtures/` — synthetic seed records, each flagged `synthetic: true`.
- `src/components/governance/` — state chips, authority badges, synthetic
  markers, gated panels, page and registry primitives.
- `src/lib/route-registry.ts` — single source of truth for routes, labels and
  page headings; navigation and tests both read it.
- `src/routes/` — the ten shell views plus capability detail pages.
- `src/lib/capability-queries.ts` — filtering and grouping; computes counts, never scores.
- `src/test/` — automated shell, governance and accessibility tests.

## Commands

```
bun run dev     # local shell
bun run test    # automated tests
bun run lint    # lint
```
