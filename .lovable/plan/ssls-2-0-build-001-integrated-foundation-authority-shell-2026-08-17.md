# SSLS 2.0 — Build 001: Integrated Foundation & Authority Shell

Build a private, founder-only governance workspace that makes project truth, authority, evidence, and the next defensible action visible. No backend, no AI, no district data — synthetic fixtures only, clearly labeled.

## Scope of this pass

In: the 10-section application shell, the foundation domain models, synthetic seed data, reusable authority/status/evidence components, accessibility contract, tests, and the required markdown governance documents.

Out (explicitly not built): Lovable Cloud/database, authentication, AI of any kind, the nine-workspace enterprise operating model as working software, any live integrations, any readiness percentage or blended score.

## Routes

| Route                  | Purpose                                                                                                                                        |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `/` Command Center     | Independent readiness axes, blockers, decisions required, next defensible action                                                               |
| `/foundation-map`      | L0–L7 layer stack (visual + table), artifacts per layer with authority state                                                                   |
| `/authority`           | Authority ledger: artifact, version, authority class, implementation authority, evidence basis, supersession, conflicts, promotion requirement |
| `/capabilities`        | Candidate Enterprise Capability Registry (list + detail)                                                                                       |
| `/traceability`        | Governance Spine and Enterprise Outcome chain as two parallel views                                                                            |
| `/findings`            | Findings register incl. the L0–L7 naming/count governance finding                                                                              |
| `/evidence`            | Evidence register with Not Run / Unknown / Stale states                                                                                        |
| `/decisions`           | Decisions register: accepted, pending, required                                                                                                |
| `/future-architecture` | Nine target-state workspaces, each gated: TARGET-STATE CANDIDATE / NOT CURRENT IMPLEMENTATION AUTHORITY                                        |
| `/boundaries`          | Settings / Boundaries: the authorized posture, No-PII banner, refused claims                                                                   |

A persistent app shell provides skip link, semantic landmarks, sidebar nav (drawer on mobile), and a global synthetic-data + No-PII boundary banner.

## Domain model (TypeScript, `src/domain/`)

- `authority.ts` — the 8 authority classes, maturity, lifecycle stage (Vision → Public Claim), evidence states (Confirmed, Partial, Unknown, Not Run, Blocked, Refused, N/A, Stale, Conflicted). All as discriminated unions with display metadata, so no state collapses to "Incomplete".
- `artifact.ts` — Foundation Registry record with every listed field (ID, version, owner, authority class, supersedes/superseded by, conflicts, unresolved questions, promotion requirements, etc.).
- `layer.ts` — L0–L7 definitions with declared status.
- `capability.ts` — capability record with all 18 listed fields.
- `traceability.ts` — Governance Spine nodes and the enterprise outcome chain as related, non-competing views.
- `finding.ts`, `evidence.ts`, `decision.ts`, `future-workspace.ts`.

Authority class is a stored field on the record; it is never computed from implementation status, file location, or test results. A single `deriveDisplayState` helper handles presentation only.

## Fixtures (`src/fixtures/`)

Synthetic seeds, every record flagged `synthetic: true` and rendered with a visible "Synthetic" marker: ULW-AS-001 v1.3 as an adopted L1 standard, L0 doctrine as candidate, the ~17 candidate capabilities, a handful of decisions/findings/evidence rows, and the traceability sample chain.

## Reusable components (`src/components/governance/`)

`AuthorityBadge`, `StatusChip`, `EvidenceStateChip`, `GatedPanel`, `SyntheticMarker`, `RegistryTable`, `RecordDetailPanel`, `ReadinessAxis`. Every status uses icon + text + shape, never color alone.

## Accessibility (ULW-AS-001 v1.3 as acceptance contract)

Semantic landmarks, exactly one H1 per route, skip link, keyboard-operable nav, dual-color visible focus ring, 44×44 minimum targets, 320px reflow, 200% zoom resilience, wrapping instead of truncation, plain-language copy, no unexplained abbreviations, reduced-motion support. No conformance claim is made.

## Visual direction

Deep navy structural surfaces, restrained blue/cyan/green/yellow signal accents used only for state, Poppins display / Plus Jakarta Sans UI, tokenized in `src/styles.css`. Table- and ledger-led layout, no hero, no gradients as decoration, no gamification.

## Tests

Add Vitest + Testing Library. Cover: each route renders; skip link works; one H1 per route; keyboard nav; authority state independent of implementation status; candidate records never render as approved; future workspaces render gated; No-PII boundary visible; no blended readiness score in the DOM; each distinct state renders distinctly; status not color-only; text does not truncate; reduced-motion honored; fixtures marked synthetic; release/public claims render as Refused.

## Documents

`README.md` (implementation), `CURRENT_STATE.md`, `FOUNDATION_AUTHORITY_MAP.md`, `CAPABILITY_REGISTRY_SCHEMA.md`, `TRACEABILITY_MODEL.md`, `ACCESSIBILITY_ACCEPTANCE.md`, `FUTURE_ARCHITECTURE_BOUNDARY.md`, `FINDINGS.md` under `docs/`.

## Terminal status for this pass

IMPLEMENTED FOUNDATION SHELL — GOVERNED PROOF SCOPE
