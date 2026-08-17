# Candidate Capability Registry — Schema

Source of truth: `src/domain/capability.ts`. Every seeded record is synthetic
and carries Candidate Proposal authority. No record grants implementation
authority.

Fields: id, name, purpose, north star contribution, human beneficiary, owning
function candidate, accountable role candidate, supporting functions, dependency
candidates, required evidence, risk profile, failure mode if absent, maturity
candidate, authority class, lifecycle stage, implementation status, open
questions, synthetic flag.

Rules:

- A capability is a candidate until an Approved Decision record promotes it.
- `implementationStatus` is descriptive only; changing it never changes
  `currentAuthority`. This is locked by test.
- Every record must name a human beneficiary and a failure mode if absent.
