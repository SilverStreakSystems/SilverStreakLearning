# End-to-End Audit and 3.0 Canon Construction

## What this is

A full-repository expert audit across ten lenses, followed by the one construction the audit's findings lawfully permit: wiring the twelve SSLS 3.0 foundation documents into the governed truth plane so they stop being loose markdown.

## Reading of "construct"

Two readings exist. Only one is lawful today:

- **Build the SSLS 3.0 product** — refused. 3.0 scope is default-deny and every prerequisite is an open owner decision (OD-05-1 scope, OD-11-1 repository, OD-06-4 first slice). Nothing may be built.
- **Construct the governance plane around the 3.0 canon** — authorized. It adds no scope, selects no technology, and closes no gate. This is what the plan does.

## Confirmed problems the audit already surfaced

Verified by reading the repository, not assumed:

1. **The 3.0 canon is outside the truth plane.** `docs/ssls-3.0/*.md` (12 files, ~239 docs total in `docs/`) is referenced by no file in `data/`, `src/`, or `scripts/`. It is not in the current-state input manifest, has no schema, no generator, no test, and no app surface. Every other governed concept in this repository has all five.
2. **The external-corpus record now contradicts reality.** `data/external-corpora/ssls-3.0-foundation.json` records the 3.0 package as observed in *connected storage*, `location_class: "connected-storage"`, non-controlling. Twelve of those items now live in this repository. The observation is stale about where the material is, though its non-authority position remains correct.
3. **Repository identity is contradictory.** `CLAUDE.md` and `README.md` describe an SSLS 2.0 prototype; the owner has declared this repository the home of SSLS 3.0. No artifact states how the two planes coexist.
4. **Registers 08–10 are reconstructions.** All ten decisions are `RECONSTRUCTED`, all 24 requirements are `DRAFT`, zero claims authorized, and the open-decision count does not reconcile (48 enumerated vs 28 stated in file 04). These are correctly labeled but nothing enforces that labeling.

## Audit lenses

Each lens produces findings with IDs, evidence, and severity. No lens closes a gate; no lens records an owner decision.

| Lens | What it checks |
|---|---|
| Governance and authority | Single controlling source per concept; no derived authority; no self-closed gates |
| Truth-plane integrity | Controlling vs derived separation; every generator round-trips; no hand-edited derived state |
| Cross-plane coherence | 2.0 registers vs 3.0 canon vs external-corpus observation: contradictions and stale statements |
| Claims and evidence | Every load-bearing statement carries a label; no prohibited claim; no self-produced independence |
| Data boundary | Synthetic-only; district-agnostic; the one standing PII scan candidate re-examined and dispositioned |
| Architecture and code | Domain/lib/route layering; dead modules; duplicated logic; strict-TS gaps |
| Routes and UX | 42 route files vs route registry; dead ends; heading and navigation integrity |
| Accessibility | Registry-driven checks only; TTR-001 stays NOT-RUN and no conformance is claimed |
| Test and evidence coverage | What the 742 tests actually prove vs what is asserted; uncovered controlling data |
| Supply chain and build | SBOM, licenses, the not-completed vulnerability scan, build reproducibility |

## Construction

### 1. Canon data plane

- `data/ssls-3.0/SSLS3_CANON_SCHEMA.json` — schema for a foundation document: document ID, filename, title, class, version, status, canonical status, review class, controlled concept, controlling relationships, provenance (`transcribed` vs `reconstructed`), and declared open decisions.
- `data/ssls-3.0/canon.json` — the controlling record for all twelve documents, plus the consolidated open-decision index and the 48-vs-28 discrepancy carried as an explicit unresolved item.

### 2. Domain and registry

- `src/domain/ssls-3.0/canon.ts` — types and invariants: no document may be `CANONICAL` without a recorded owner decision; a `RECONSTRUCTED` document can never carry authority; every open decision ID is unique and traceable to its source file.
- `src/lib/ssls-3-0-registry.ts` — read-only queries: documents by class, status counts, open decisions by priority, reconstruction inventory.

### 3. Generator

- `scripts/gen-ssls-3-0-docs.ts` — projects `docs/ssls-3.0/CANON_INDEX.md` and `docs/ssls-3.0/OPEN_DECISIONS.md` from `canon.json`. Discovered automatically by `check:generated`. The twelve source documents stay authored and are never overwritten.

### 4. Reconciliation records

- `docs/ssls-3.0/AUDIT-001.md` — the audit report: findings by lens, severity, evidence, and the owner decisions each finding routes to.
- `docs/ssls-3.0/PLANE_RECONCILIATION.md` — how the 2.0 prototype plane and 3.0 canon coexist: 2.0 registers control 2.0 gates, 3.0 canon controls 3.0 scope, neither inherits from the other.
- `data/external-corpora/ssls-3.0-foundation.json` — add an in-repository transcription note per affected item. The original observation is preserved; nothing is deleted or rewritten.

### 5. App surface

One read-only route, `/ssls-3-0`, registered in `src/lib/route-registry.ts` and added to the governance workspace: canon index, status distribution, open-decision queue by priority, and a prominent non-authority banner. No forms, no state, no disposition controls.

### 6. Tests

`src/test/ssls-3-0-canon.test.ts` — schema conformance for all twelve documents; refusal of any `CANONICAL` status absent a decision ID; refusal of an authority-granting projection; open-decision uniqueness; the discrepancy is present rather than silently corrected; the route renders its non-authority banner.

### 7. Verification

Add `canon.json` and the generator to the current-state input manifest, run `bun run gen:all`, refresh evidence, and run the full `verify:ci` gate.

## Explicitly not in this plan

No owner decision is recorded or closed. No document moves from CANDIDATE to CANONICAL. No reconstruction is promoted. No 3.0 product, schema, route set, or technology is selected. No 2.0 gate, checkpoint, or WP state changes. No claim is authorized. Nothing is deleted. No publish or redeploy.

## Owner disposition at the end

The audit closes with a packet offering three positions — accept the findings as recorded, revise them, or hold — plus the specific decisions the findings route to. Recording any of those remains yours alone.
