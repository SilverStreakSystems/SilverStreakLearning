# Enterprise Capability Architecture v0.1 — Overview

Authority: Research / Governed Candidate. This document, and every record it
describes, is a candidate. Nothing here grants implementation authority,
ownership, staffing, budget, or the right to make a public claim.

## What a capability is here

A capability is a durable organizational ability: something SSLS must be able to
do, repeatedly and defensibly, regardless of who is employed, which tools are in
use, or which product modules exist.

A capability is **not**:

- a role or job title
- a team or department
- a process or meeting
- a document or deliverable
- a product module or screen
- a piece of software

The normalization pass (`docs/capability-architecture/NORMALIZATION_PASS.md`)
records every case where a candidate term was one of those things instead.

## Scope of v0.1

- 12 candidate domains, D01 through D12.
- 129 candidate capability records.
- 16 deliverable types.
- 38 dependency relationships.
- 15 normalization findings.

## What v0.1 deliberately does not do

- It does not compute a readiness percentage, maturity score, or blended index.
  Counts of declared records are shown; a count is never presented as progress.
- It does not assert that any capability exists, is staffed, or is working.
- It does not authorize the crossing of any trigger gate.
- It does not describe production data, learners, districts, or AI features.

## Source of truth

- Model: `src/domain/capability-architecture.ts`
- Deliverable types: `src/domain/deliverable-type.ts`
- Records: `src/fixtures/capability-architecture/`
- Views: `/capabilities` in the operator shell
