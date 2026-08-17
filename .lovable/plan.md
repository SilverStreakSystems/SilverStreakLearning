# Enterprise Value Streams & Operating Workflow Architecture v0.1

## Current truth recovered (verified by reading the repo)

- Routes present: `/`, `/foundation-map`, `/authority`, `/capabilities` (+ detail), `/objects` (+ detail), `/traceability`, `/findings`, `/evidence`, `/decisions`, `/future-architecture`, `/boundaries`. `src/lib/route-registry.ts` is the navigation and test single source of truth.
- Prompt 002 is implemented: 12 capability domains, 129 candidate capabilities, deliverable types, dependencies, normalization findings, docs in `docs/capability-architecture/`.
- Prompt 003 domain and fixtures are implemented (`src/domain/shared-object/*`, `src/fixtures/shared-object/*`): 32 object types, 26 relationship kinds, 8 independent state axes, work / event / deliverable / evidence / claim / knowledge / context / authorization / normalization contracts, plus the `/objects` 11-view surface and type detail page.
- Two Prompt 003 deliverables are missing and will be closed in this increment: there is no `src/test/shared-object.test.tsx` and no `docs/shared-object/` directory.
- There is **no 15-function workforce taxonomy** anywhere in the repo. Only `enterprise-function-reference` (an object type) and the 12 capability domains exist. This increment will define the 15 functions as a new candidate taxonomy and record the gap as a finding, rather than pretending it already existed.
- Governing boundary confirmed in fixtures and docs: founder/developer operator only, synthetic data only, no PII, no live integrations, no product-facing AI, no readiness or conformance claims.

## What this increment adds

A governed candidate value-stream layer that sits between the shared object architecture and any future Command Center. Nothing becomes operational.

### 1. Domain model — `src/domain/value-stream/`

- `functions.ts` — 15-function workforce taxonomy (candidate), each mapped to the capability domains it serves. Explicitly marked "not staffed".
- `decision-rights.ts` — Recommend, Input, Decide, Approve, Execute, Validate, Veto/Stop. Exactly one decision authority per decision point is enforced by a validator.
- `value-stream.ts` — the `ValueStream` record with the full field set (purpose, North Star contribution, beneficiaries, trigger, entry/exit criteria, authority, maturity, capabilities, functions, objects, deliverables, evidence, gates, dependencies, handoffs, escalations, refusals, rollback, metrics, learning loop, risks, assumptions, unknowns, review trigger, supersession).
- `stage.ts` — `ValueStreamStage` with sequence, owner, allowed acting capacities, input/output objects, required context, work types, deliverables, decision points, approvals, validation, evidence, handoff recipient, exit criteria, refusal states, escalation, maximum waiting state, provenance requirement.
- `transition.ts` — the state transition contract (current state → preconditions → authorized actor → action → resulting state → side effects → evidence → audit → refusal → escalation → recovery), with validators rejecting unauthorized or precondition-free transitions and rejecting "previous task complete" as a sole precondition.
- `handoff.ts` — `HandoffContract` with receiver acceptance, refusal reason, escalation, audit, outcome. Sending is never completion.
- `dependency.ts` — six dependency kinds with owner, state, blocking status, criticality, fallback, review date, evidence, escalation; hidden dependencies surface as findings.
- `commitment.ts` — governed `Commitment` record; casual discussion is explicitly excluded.
- `gate.ts` — `ValueStreamGate` with dispositions PASS, PASS WITH NON-BLOCKING FINDINGS, HOLD, BLOCKED, REFUSED, REVISE, N/A. Silence is never passage.
- `refusal.ts` — refusal as first-class success: what, why, governing rule, resolution path, appeal availability.
- `metric.ts` — metric contract including prohibited interpretation and perverse-incentive risk; a prohibited-metric list (keystrokes, activity counts, individual productivity scores) enforced by test.
- `burden.ts` — eight burden types plus who bears each.
- `projection.ts` — Command Center projection **contracts only** (enterprise, function, manager, individual, cross-functional program), typed as read projections over existing shared objects. No new sources of truth, no active authority.

### 2. Fixtures — `src/fixtures/value-stream/`

All 18 candidate streams VS-01…VS-18 with their stages, seeded through a builder that applies governance defaults (synthetic marker, candidate authority, gated-future flag for VS-08/09/10/15/16/17). Plus: handoff contracts across stream boundaries, dependency records, gate records with worked HOLD/BLOCKED/REFUSED examples, commitments, metrics, burden entries, function and role mappings, evidence requirements per stage, context-package usage per stage, and normalization findings (duplicates, subflows-not-streams, departmental processes, missing learning loops, streams wrongly shown as active).

### 3. Query layer and UI

- `src/lib/value-stream-queries.ts` — filtering, stage lookup, handoff/dependency/gate matrices, coverage rollups. No blended score of any kind.
- `src/routes/value-streams.tsx` (layout), `value-streams.index.tsx` with 12 views: Registry, End-to-End Map, Handoff Matrix, Dependency Matrix, Gate Matrix, Decision Rights, Capability Coverage, Function Coverage, Evidence Requirements, Metrics/Outcomes, Command Center Contracts, Findings.
- `src/routes/value-streams.$streamId.tsx` — detail page answering all 19 required questions, with a sequential stage view and per-stage drill-down.
- Registry entry added to `src/lib/route-registry.ts` so the existing shell tests cover the new routes.
- Design and accessibility follow the existing shell: one H1, landmarks, skip link, keyboard-operable tabs and filters, dual-color focus, no color-only status, table semantics, 320px reflow, 200% zoom.

### 4. Tests

- New `src/test/value-stream.test.tsx` covering every listed test requirement (stable IDs, purpose/outcome, authority, entry/exit, stage purpose and I/O, criteria-gated advancement, completion ≠ approval, implementation ≠ validation, validation ≠ release, release ≠ claim, handoff acceptance and refusal, blocking dependencies, gate HOLD/BLOCK/REFUSE, evidence linkage, gated-future streams never rendering as operational, no PII, no blended percentage, no surveillance metrics, AI lifecycle gated, projection contracts confer no authority).
- New `src/test/shared-object.test.tsx` closing the Prompt 003 gap.
- Accessibility and route tests extended to the new routes.

### 5. Documents

All 23 named documents, under `docs/value-streams/` except `CURRENT_STATE.md` and `FUTURE_ARCHITECTURE_BOUNDARY.md`, which are updated in place at `docs/`. The deferred `docs/shared-object/` set is also written so the record is complete.

## Decisions taken (no options offered)

- The 15-function taxonomy is created here as a **candidate**, derived from the 12 capability domains, and the absence of a prior taxonomy is filed as a finding.
- VS-08, VS-09, VS-10, VS-15, VS-16 and VS-17 render as gated future architecture with an explicit gate panel; they cannot present operational state.
- Normalization is expected to demote at least one candidate stream to a subflow rather than force 18 peers; the exact outcome is recorded in `VALUE_STREAM_NORMALIZATION_FINDINGS.md` from the actual pass, not pre-declared here.

## Out of scope

Command Centers and workspace surfaces, product-specific workflows, live integrations, CRM, billing, HRIS, PII, AI features, and any readiness, conformance, or independent-validation claim.
