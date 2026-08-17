# Enterprise Command Centers & Workspace Experience Architecture v0.1

## Recovered repository truth (verified this turn)

Implemented today: 15 routes (Command Center at `/`, Foundation Map, Authority, Capabilities, Shared Objects, Value Streams, Traceability, Findings, Evidence, Decisions, Future Architecture, Boundaries, Design System), domain modules for authority, layers, artifacts, capabilities, shared objects, value streams, experience/templates, and a route registry that drives both navigation and tests. 147 tests pass.

Thin or missing relative to this prompt:
- `src/domain/future-workspace.ts` is an 8-field placeholder; the prompt's `WorkspaceDefinition` needs ~28 fields.
- No workspace projection, membership, acting-capacity, action-center, search, or notification contracts exist.
- The Command Center at `/` is a static governance summary, not an assembled projection.
- Navigation is one flat list with no workspace / utility separation and no CURRENT / CANDIDATE / GATED FUTURE badges.

## What gets built

### 1. Workspace domain layer (`src/domain/workspace/`)

- `WorkspaceDefinition` with every required field, replacing the placeholder `FutureWorkspace` (existing gated-future data is migrated, not deleted).
- `WorkspaceMembership` contract that separates person, acting capacity, relationship, purpose, capabilities, object scope, effective period, and policy basis — with an explicit rule that membership never implies record-level access.
- `WorkspaceProjection` contract implementing the required assembly order: purpose → participant → capacity → relationship → policy → canonical sources → minimum projection → freshness/missing/conflict → projection. Every projection carries a `canonicalSourceRef` and is marked "projection, not source of truth".
- Contracts for the reusable patterns: Function Command Center (incoming / internal / outgoing), Manager View (with a hard-coded prohibited-signal list), Individual Action Center, Cross-Functional Program View.
- `DashboardMetric` contract requiring name, question answered, source, calculation, freshness, interpretation, prohibited interpretation, and triggered action. A metric without a triggered action fails a test.
- Eleven surface states: loading, normal, empty, no-results, stale, partial, conflicted, restricted, refused, error, future/gated.

### 2. Action, search, notification, capacity layers (`src/lib/`)

- **Action Center** assembles obligations from existing fixtures (work items, gates, handoffs, dependencies, commitments, findings, evidence, decisions). No new task store; each action references its canonical object and answers the nine required questions. Priority uses the eight declared factors in that order, with the prohibited factors recorded as refused.
- **Universal Search** runs authorization before retrieval. Unauthorized records are excluded from results, counts, facets, and suggestions in a single filtering step, so hidden-record existence cannot leak through a count.
- **Notifications** derive from a small trigger list (approval requested, decision needed, validation failed, evidence stale, gate blocked, commitment approaching, handoff rejected, critical risk, review due, claim expiry), each bound to a canonical object with severity and expiry. Not every state change becomes a notification.
- **Acting capacity**: identity, acting capacity, role reference, and authorization are four separate fields. `founder_developer` is the only real capacity; previewed capacities (CTO, CPO, CAO, CRO, Customer Success, Trust, Engineering Manager, IC) are labelled simulated target-state and cannot be activated.

### 3. Fixtures (`src/fixtures/workspace/`)

Nine workspace definitions in the required order, each with fundamental question, authority state, implementation state, value streams, capabilities, allowed and prohibited objects, boundaries, and review trigger. Command Center, Strategy & Governance, Research & Intelligence, Engineering & Delivery, and Trust/Quality draw on real project records; Market & Growth, Customer & Implementation, Product & Learning Systems, and Enterprise Operations are candidate/gated with synthetic reference records only. Six global-utility contracts. Simulated capacity previews.

### 4. Routes (7 new, 2 reworked — no route explosion)

- `/workspaces` — My Workspaces registry with per-workspace cards showing authority, implementation, availability, relevance, dependencies, status.
- `/workspaces/$workspaceId` — one templated workspace page rendering the projection contract, surfaces, authority display, and the state matrix. All nine workspaces share this route; there are no nine bespoke dashboards.
- `/actions`, `/search`, `/notifications`, `/profile`, `/help` — the utility surfaces.
- `/` reworked into the assembled founder Command Center answering the thirteen required questions, with candidate enterprise surfaces shown only inside a labelled Future Preview panel.
- `/future-architecture` reworked to point at the new workspace registry instead of holding its own duplicate list.

Navigation is regrouped into Workspaces / Utilities / Governance registers, with text badges (CURRENT, CANDIDATE, GATED FUTURE, PREVIEW) that never rely on color alone.

### 5. Tests

One new suite covering all 31 listed requirements, grouped as: workspace identity and contract completeness; no duplicate canonical objects; projection and authorization discipline (including membership ≠ access and search-before-retrieval, with a leak test asserting result counts exclude unauthorized records); refused/restricted state coverage; prohibitions (no blended readiness score, no surveillance metric, no product-facing AI, no live integration); labelling of simulated previews; and accessibility (one H1, skip link, landmarks, non-color status, dense-table semantics) on every new route.

### 6. Documents

The 23 required documents under `docs/enterprise-experience/`, with registry-style ones generated from fixtures by a script so they cannot drift. `CURRENT_STATE.md`, `FUTURE_ARCHITECTURE_BOUNDARY.md`, and `docs/README.md` are updated in place.

## Decisions I am making

- **Typography stays Poppins / Plus Jakarta Sans for now.** The prompt says ULW-AS-001 v1.3 specifies Atkinson Hyperlegible Next / Noto Sans, but that standard is not in this repository — only the brand PDF is. Switching type families on the strength of a quoted sentence would be an unverifiable change to a governing surface. I will record the brand-versus-accessibility typography conflict as an open finding with the swap staged as the next increment, and I will not claim ULW typography conformance anywhere.
- **One templated workspace route, not nine.** Nine bespoke pages would be nine drifting sources of layout truth.
- **No new task, evidence, decision, or notification stores.** Every utility is a projection over existing fixtures.

## Terminal status this will support

ENTERPRISE COMMAND CENTERS & WORKSPACE EXPERIENCE ARCHITECTURE v0.1 — GOVERNED CANDIDATE IMPLEMENTED, with no claim of production, staffing, district readiness, or certification.
