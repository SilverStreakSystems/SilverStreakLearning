# Current State

Authority of this document: Provisional Working Artifact. It describes an
implemented shell. Implementation does not confer authority.

## Implemented (shell only)

- Ten operator views: Command Center, Foundation Map, Authority Ledger,
  Capability Registry, Traceability, Findings, Evidence, Decisions, Future
  Architecture, Settings and Boundaries.
- Domain models for authority classes, verification states, foundation layers,
  foundation artifacts, candidate capabilities, traceability threads, findings,
  evidence, decisions, claims, and gated future workspaces.
- Synthetic fixtures for every register, each marked in the interface.
- Governance components that render declared authority and declared state, with
  a text marker and a text label on every status (never color alone).
- Automated tests covering route rendering, single H1 per page, landmarks, skip
  link and keyboard navigation, boundary banner presence, gating of future
  workspaces, refusal of unearned claims, and stylesheet accessibility
  commitments.

## Declared but not implemented

- Persistence. All records are in-memory fixtures.
- Authentication, roles, row-level security.
- Any student, staff, district, or production data path.
- AI features of any kind.
- External integrations.

## Refused claims

Recorded in the interface under Settings and Boundaries and in the claims
fixture. The shell refuses to state readiness, compliance, validation,
integration availability, or release status, because no evidence supports them.

## Verification state of this build

- Route rendering, landmarks, keyboard reach, gating, and state labelling:
  Confirmed by automated test.
- Screen reader behaviour, 200% zoom reflow on real devices, and color contrast
  measurement: Not Run.
- Security, privacy, and compliance posture: Not Applicable at this scope, and
  Refused as a claim.
