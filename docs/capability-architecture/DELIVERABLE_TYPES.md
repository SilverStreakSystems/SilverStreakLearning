# Deliverable Types

Source of truth: `src/fixtures/deliverable-types.ts` and
`src/domain/deliverable-type.ts`. Sixteen types, DT-01 through DT-16.

A deliverable type is the **shape** of an artifact a capability must produce. It
answers one question, carries a default authority class, and states whether it
may ever be cited to justify implementation.

## Rules

- Producing a deliverable never changes anything's authority. Only a decision
  record does that.
- A deliverable type that may justify implementation must have a default
  authority class that carries implementation authority. Locked by test.
- Every deliverable type declares whether an instance exists today. Most are
  recorded as Not Run or Unknown, which is the honest answer.

## Why types rather than a document list

A named document ("the security whitepaper") drifts, gets superseded, and gets
cited long after it stopped being true. A deliverable **type** stays stable and
lets the registry ask a durable question: does an instance of this type exist,
and what is its authority?

Viewable at `/capabilities?view=deliverables`.
