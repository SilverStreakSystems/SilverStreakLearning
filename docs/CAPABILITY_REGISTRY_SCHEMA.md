# Candidate Capability Registry — Schema

Superseded by the Enterprise Capability Architecture v0.1. The earlier
`CapabilityRecord` model and its 17 seeded records were retired to prevent two
competing capability truths.

Current source of truth:

- Model: `src/domain/capability-architecture.ts` (`EnterpriseCapability`)
- Deliverable types: `src/domain/deliverable-type.ts`
- Records: `src/fixtures/capability-architecture/`
- Documentation: `docs/capability-architecture/`

Rules carried forward unchanged:

- A capability is a candidate until an Approved Decision record promotes it.
- `implementationStatus` is descriptive only; changing it never changes
  `currentAuthority`. This is locked by test.
- Every record must name a human beneficiary and a risk if absent.
