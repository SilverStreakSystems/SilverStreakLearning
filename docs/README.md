# SSLS 2.0 — Foundation & Authority Shell (Build 001)

Private founder/developer operator shell. No personal data, no production data,
no AI features, no external integrations. Every record in the interface is
synthetic and visibly marked.

## Documents

| Document | Purpose |
| --- | --- |
| `CURRENT_STATE.md` | What is built, what is only declared, what is refused. |
| `FOUNDATION_AUTHORITY_MAP.md` | Layers L0–L7 and how authority is declared. |
| `CAPABILITY_REGISTRY_SCHEMA.md` | Candidate capability record schema. |
| `TRACEABILITY_MODEL.md` | Governance Spine and Enterprise Outcome chain. |
| `ACCESSIBILITY_ACCEPTANCE.md` | ULW-AS-001 v1.3 acceptance and verification state. |
| `FUTURE_ARCHITECTURE_BOUNDARY.md` | Gated target-state workspaces. |
| `FINDINGS.md` | Findings register in text form. |

## Code map

- `src/domain/` — authority, layers, artifacts, capabilities, traceability,
  registers, future workspaces. TypeScript is the schema source of truth.
- `src/fixtures/` — synthetic seed records, each flagged `synthetic: true`.
- `src/components/governance/` — state chips, authority badges, synthetic
  markers, gated panels, page and registry primitives.
- `src/lib/route-registry.ts` — single source of truth for routes, labels and
  page headings; navigation and tests both read it.
- `src/routes/` — the ten shell views.
- `src/test/` — automated shell, governance and accessibility tests.

## Commands

```
bun run dev     # local shell
bun run test    # automated tests
bun run lint    # lint
```
