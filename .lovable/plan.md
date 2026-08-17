# Shared Enterprise Object, Context, Work & Evidence Architecture v0.1

Governed Candidate. Nothing in this increment becomes approved authority, and the
founder-only / No-PII / synthetic-only boundary is preserved unchanged.

## Current repository truth (recovered before planning)

Confirmed by inspection, not assumption:

- Ten shell routes exist, plus `/capabilities` (nine views) and
  `/capabilities/{id}` detail. Route SSOT is `src/lib/route-registry.ts`.
- Domain models exist for authority (8 classes, 11 verification states),
  layers L0-L7, artifacts, 129 candidate enterprise capabilities, 16 deliverable
  types, traceability (governance spine + enterprise chain), findings/evidence/
  decisions/claims registers, and gated future workspaces.
- 74 tests pass across 4 test files. No persistence, no auth, no AI, no
  integrations. Every fixture is `synthetic: true`.
- Prompt 001 assumption correction to record: the original `CapabilityRecord`
  model was retired in Prompt 002; `docs/CAPABILITY_REGISTRY_SCHEMA.md` now
  points forward rather than describing a live model.
- Existing registers (Finding, Evidence, Decision, Claim) are **thin shell
  records**, not the full contracts this increment specifies. They will be
  extended in place, not duplicated.

## Normalization decisions (made, not deferred)

Of the 43 candidate objects in the brief, v0.1 keeps **26 first-class object
types**, demotes 9 to typed relationships, and defers 8.

Kept as first-class: Person Reference, Organization, Organizational Unit,
Acting Capacity, Role Reference, Enterprise Capability (already exists),
Requirement, Decision, Policy/Rule, Standard, Approval, Review, Risk, Finding,
Claim, Work Item, Deliverable Type, Deliverable Instance, Event, Evidence,
Source, Research Record, Artifact Reference, Validation, Context Package,
Context Projection Definition.

Demoted to typed relationships: Dependency, Handoff, Escalation, Commitment,
Relationship, Milestone, Communication Content Version, Recipient Eligibility
Snapshot, Dispatch Intent. Rationale recorded per item — each is a state or an
edge between two objects, not a thing that exists on its own.

Rejected as an abstraction: Knowledge Object as a superclass. Replaced by
explicit typed knowledge objects (guidance, procedure, template, research,
policy, standard, reference, evidence) sharing common governance metadata.

Reference-only (modeled, gated, not instantiable): Product Reference, Module
Reference, Shared Service Reference, Enterprise Function Reference, Value Stream
Reference, Communication, Release Candidate, Context Request.

Deferred with reason: Discussion/Proposal objects (collaboration is out of
scope), Commitment as an object (revisit at value-stream stage).

## What gets built

### 1. Domain models (`src/domain/shared-object/`)

- `identity.ts` — stable ID, human key, object type, and the object-type registry.
- `governance-metadata.ts` — the shared metadata block, split explicitly into
  universal fields (required on every object) and conditional fields.
- `states.ts` — seven separate state axes: workflow, authority, implementation,
  validation, evidence, approval, publication, freshness. Reuses the existing
  authority and verification vocabularies rather than duplicating them.
- `derivation.ts` — the raw fact / derived status / human approval contract,
  including rule version and explanation, with approval never inferable.
- `relationships.ts` — ~24 typed relationship kinds with inverse, cardinality,
  and permitted source/target type pairs.
- `work.ts`, `event.ts`, `deliverable.ts`, `evidence.ts`, `claim.ts`,
  `knowledge.ts` — the per-family contracts.
- `context.ts` — Context Package, projection definition, purpose, and the
  Universal Context Assembly contract as Research/Candidate.
- `authorization.ts` — identity + capacity + relationship + purpose + policy +
  capability + scope + time contract, plus the "why am I seeing this?"
  explanation shape. Contract only; no runtime engine.

### 2. Synthetic fixtures (`src/fixtures/shared-object/`)

Object-type catalog entries for all 26 kept types, ~24 relationship definitions,
a small set of example instances (work items, deliverable instances, evidence,
claims, context packages including stale/conflicted/refused/expired examples),
and an object normalization findings set covering duplicates, overlaps,
over-generalizations, and shared-vs-bounded decisions. All records synthetic and
visibly marked; no realistic person data anywhere.

### 3. Routes

New `/objects` command view with eleven addressable views (Catalog, Object Types,
Relationships, State Models, Work, Deliverables, Evidence, Context,
Authorization, Lifecycle, Normalization Findings), plus `/objects/{objectTypeId}`
detail pages answering the full question set from the brief. Filter state lives
in the URL. Reuses the existing governance components and the capability command
view's control patterns rather than inventing new ones.

Added to `src/lib/route-registry.ts` so navigation and tests stay in sync.

### 4. Tests (`src/test/shared-object.test.tsx`)

Every test named in the brief, at domain/static/render level and labelled
truthfully as such: stable IDs; each state axis independent; approval never
derived from completion; candidate never renders as approved; Context Package
rejected as source authority and preserving provenance; missing/conflicted/stale
context representable; no self-links; duplicate active edges detected; prohibited
type pairs detected; Work Item requires purpose and a served object or an
explicit recorded exception; Deliverable Instance references a type; Evidence
version/environment bound; Claim requires evidence state; reference objects
gated; no PII fixtures; boundary banner visible; no percentage rendered; keyboard
operability and reflow-safe markup on new routes.

### 5. Documentation

The 22 documents named in the brief, under `docs/shared-object/` with
`CURRENT_STATE.md` and `FUTURE_ARCHITECTURE_BOUNDARY.md` updated in place.
Existing governed documents are extended, never silently replaced.

## Explicit refusals in this increment

No AI of any kind. Context Package is not permission to send anything to a model.
No communication execution, no "sent" or "delivered" states. No employee activity,
productivity, or effort fields. No blended readiness score. No persistence, auth,
or RLS — the authorization model is a contract, not an engine.

## Technical notes

TypeScript-first, one file per object family, no giant catch-all module. The
object catalog is data, so the UI and the tests read the same source. Existing
`AuthorityClass` and `VerificationState` vocabularies are reused; the new state
axes wrap them rather than redefining them. New surfaces follow the established
accessibility pattern: one H1, text marker plus text label on every status,
tabular relationship graph, labelled filters, `aria-live` result counts.

## Terminal status on completion

SHARED ENTERPRISE OBJECT / CONTEXT / WORK / EVIDENCE ARCHITECTURE v0.1 —
GOVERNED CANDIDATE IMPLEMENTED.
