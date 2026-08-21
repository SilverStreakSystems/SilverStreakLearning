# Enterprise Capability Architecture v0.1

Builds on the Prompt 001 shell without rebuilding it. The existing ten routes,
domain models, authority vocabulary, fixtures, docs, and tests stay in place.
The current 17-record candidate capability list (`src/domain/capability.ts`,
`src/fixtures/capabilities.ts`) is superseded by a richer governed model, with
the old records mapped forward rather than deleted silently.

Status this increment can claim: ENTERPRISE CAPABILITY ARCHITECTURE v0.1 —
RESEARCH / GOVERNED CANDIDATE IMPLEMENTED. No readiness, staffing, compliance,
or validation claim.

## What gets built

### 1. Capability object model

A governed `EnterpriseCapability` type carrying all required fields: identity
and description, domain and types (multi-type allowed), North Star
contribution, beneficiary model, principles and constraints, function/role
candidates, decision rights and separation of duties, value streams,
deliverables and evidence, data classes, maturity and scale stages, product and
governance triggers, staffing and consolidation rules, independence
requirement, risk if absent, authority/implementation/validation/evidence
status, cross-register relations, conflicts, assumptions, unknowns, review
trigger, supersession, notes.

Supporting models: capability domains (12), capability types (18), beneficiary
classes (13), scale stages S0–S5, trigger gates (before live PII, before
product-facing AI, before district pilot, before public outcome claims, before
enterprise scale), independence levels (Required / Conditional / Not Required
plus trigger), coverage modes (founder, combined role, dedicated role, external
specialist, independent review, automated support, not yet required), value
streams (16), dependency edge kinds (10), and a `DeliverableType` schema.

### 2. Registry content

Roughly 120–135 candidate capability records across the 12 domains, produced by
working the taxonomy through a normalization pass rather than one record per
bullet: synonyms merged, role/process/deliverable/module entries reclassified,
genuinely missing capabilities added. Every record is synthetic-flagged and
carries Research/Candidate authority. Consolidations and reclassifications are
recorded as normalization findings, not deleted.

Dependency edges between capabilities with validation that blocks
self-dependency and duplicate edges, and detects `required_before` cycles,
surfacing any cycle as a recorded design conflict instead of hiding it.

12–16 seeded `DeliverableType` records (ADR, Privacy Impact Assessment, Threat
Model, Accessibility Review, Curriculum Architecture Spec, Research Synthesis,
Product Requirement, Release Readiness Package, District Implementation Plan,
Customer Success Plan, Financial Forecast, Workforce Capability Plan, and a few
more) linked to capabilities.

### 3. Views

`/capabilities` becomes a layout with a Capability Command View:

- Registry (searchable, filterable table — the authoritative surface)
- Domain Map
- Dependency view (tabular edge list plus a per-capability neighbourhood; no
  decorative network graph as the only representation)
- Maturity / Scale Matrix
- Function Coverage
- Independence Matrix
- Trigger Matrix
- Normalization Findings
- Coverage counts panel: independent counts only, never one blended readiness
  percentage

Filters: text search, domain, authority, maturity, scale trigger, product or
governance trigger, owning function, independence requirement, beneficiary,
implementation status. Filter state lives in the URL so views are shareable and
navigation state survives.

`/capabilities/$capabilityId` detail page answers the full question set: what
ability, why, which North Star outcome, who benefits, who is harmed if it
fails, who carries burden, who keeps judgment, constraining principles, owning
function and accountable candidates, expertise, what must stay independent,
proving deliverables and evidence, when it is needed, consolidation and
external-expert eligibility, dependencies both directions, current truth versus
candidate, and the next defensible action.

The Command Center and Findings register gain links to the new capability
findings; the Future Architecture boundary is restated, not loosened.

### 4. Tests

Extends the existing Vitest suite: stable unique IDs; purpose, North Star
contribution, at least one beneficiary, authority class, maturity, and owning
function status present on every record; candidates cannot render as approved
or implemented; no self-dependency; `required_before` cycle detection;
independence-sensitive records surface with text markers; future-stage
capabilities are not shown as current obligations unless triggered; trigger
rendering; filter behaviour; detail route rendering; no blended readiness
percentage anywhere; boundary banner still present on the new routes.

Accessibility carried forward per ULW-AS-001 v1.3: one H1 per route, landmarks,
keyboard-operable filters and tabs, no color-only status, horizontally
scrolling tables that keep headers and keyboard access, reduced-motion safe,
plain language with abbreviations expanded on first use.

### 5. Documents

Create: ENTERPRISE_CAPABILITY_ARCHITECTURE, CAPABILITY_TAXONOMY,
CAPABILITY_OBJECT_MODEL, CAPABILITY_AUTHORITY_RULES,
CAPABILITY_MATURITY_MODEL, CAPABILITY_TRIGGER_MODEL,
CAPABILITY_INDEPENDENCE_MODEL, CAPABILITY_FUNCTION_MAPPING,
CAPABILITY_ROLE_MAPPING, CAPABILITY_VALUE_STREAM_MAPPING,
CAPABILITY_DEPENDENCY_MODEL, DELIVERABLE_TYPE_MODEL,
CAPABILITY_NORMALIZATION_FINDINGS, CAPABILITY_OPEN_QUESTIONS.
Update: CURRENT_STATE, FUTURE_ARCHITECTURE_BOUNDARY, CAPABILITY_REGISTRY_SCHEMA
(pointer to the new object model), README, FINDINGS.

## Technical notes

- New files: `src/domain/capability-architecture.ts` (object model, enums,
  dependency kinds), `src/domain/deliverable-type.ts`,
  `src/fixtures/capability-architecture/*` split by domain so no single file
  becomes unmanageable, `src/fixtures/capability-dependencies.ts`,
  `src/fixtures/deliverable-types.ts`, `src/lib/capability-queries.ts`
  (filtering, grouping, cycle detection, coverage counts — pure functions,
  unit tested).
- Existing `CapabilityRecord` remains exported for the old page contract during
  the transition; the route is rewritten onto the new model and the legacy
  fixture is folded into the new registry with its IDs preserved.
- Routes: `src/routes/capabilities.tsx` (layout + command view shell),
  `capabilities.index.tsx`, one file per view tab, and
  `capabilities.$capabilityId.tsx`. All client-side, in-memory fixtures — no
  backend, no persistence, no AI, consistent with the No-PII posture.
- Head metadata per route with distinct titles and descriptions.

## Deferred on purpose

Physical role-library pages, the complete enterprise workspaces, rewriting the
15-function architecture, persistence, and any live data path.
