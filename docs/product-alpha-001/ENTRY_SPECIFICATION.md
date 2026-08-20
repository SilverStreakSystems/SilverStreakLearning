# Product Alpha 001 — entry specification

Authority class: bounded entry specification. This document binds nothing on its
own. It restates the scope already authorized by decision **DEC-023** so that the
implementation has one written boundary to be checked against.

This document is **not** a checkpoint, **not** an evidence record, **not** a work
package, and **not** an independent authority. It closes no gate, closes no work
package, discharges no finding, and authorizes no successor increment.

Controlling decision: `DEC-023` — `src/fixtures/registers.ts` → `DECISIONS`, `DEC-023`.

## 1. Authorized scope

Product Alpha 001 is one bounded, local-only, synthetic vertical slice in which a
founder/operator can:

1. hold a small set of visibly fictional learners;
2. work on **one** goal per learner at a time;
3. record what was observed against that goal;
4. plan a support action that cites the observations it is based on;
5. mark that support done or cancelled;
6. record a follow-up observation after it;
7. record what the follow-up evidence showed;
8. read a deterministic next step computed by rule **LLR-001 v1.0.0**.

Persistence is browser-local only. The five canonical record families are
`SyntheticLearnerRecord`, `LearningGoalRecord`, `LearningObservationRecord`,
`SupportActionRecord`, and `GoalReviewRecord`. Observations and reviews are
append-only; a correction is a new record that supersedes an earlier one and
both stay visible.

Interface surface is exactly two routes: `/learners` and `/learners/$learnerId`.

## 2. Refused expansion

The following are expressly outside this increment and are not implemented, not
started, and not authorized:

- backend services of any kind, server-side storage, or hosted database;
- authentication, accounts, sessions, roles, tenancy, or row-level security;
- artificial-intelligence features, model calls, or generated recommendations;
- any real personal data, real learner data, or district data of any kind;
- sharing, synchronization, collaboration, or multi-device access;
- reporting, export to district systems, or integrations;
- analytics, telemetry, or tracking;
- publication or deployment of this slice as a released product;
- promotion of any candidate historical requirement to an implemented state;
- execution of the deferred TTR-001 touch-target audit (`FND-024` stays open).

## 3. Technical acceptance boundary

An implementation satisfies this entry specification when all of the following
hold mechanically:

1. every record family has a strict schema that rejects unknown keys, rejects
   `synthetic: false`, and enforces field length and timestamp validity;
2. cross-record invariants (identity, reference, ownership, state, temporal
   order, uniqueness, supersession) are validated at runtime on **every** write,
   not only in TypeScript types;
3. the repository is a real transaction boundary: writes are validated,
   revisions are checked with optimistic concurrency, a conflicting or invalid
   write changes nothing, and the revision only advances on an accepted write;
4. read, write, clear, and replace return structured outcomes — `empty`,
   `ready`, `conflict`, `unavailable`, `corrupt`, `unsupported-version`,
   `write-failed` — and never collapse a corrupt or newer document into "empty";
5. when browser storage is unavailable the flow still works for the session
   against an in-memory adapter and says plainly that nothing will survive
   reload;
6. corrupt or newer stored data is never overwritten automatically; recovery is
   an explicit confirmed action and the raw stored value stays exportable;
7. exactly one bounded recovery snapshot is kept before a replace-import or a
   restore of demo data;
8. import is replace-only, size-limited, previewed, cancellable, and leaves
   prior data byte-for-byte intact when it fails;
9. export is the canonical document only and is byte-stable;
10. the clock and the identifier generator are injected; identifiers are opaque
    and prefixed, never derived from a collection count;
11. there is no free-text path that can create an arbitrary learner record;
12. LLR-001 v1.0.0 is pure, versioned, `asOf`-filtered, cites its basis records,
    carries its own limitation statement, and never recommends that the system
    close a goal;
13. the product interface applies the TTR-001 implementation contract (44 px
    default target, 24 px floor) — applying it is not measuring it.

## 4. What acceptance of this boundary does not establish

Meeting every item above establishes mechanics only. It does not establish
founder usability, workflow stability, learning impact, educational validity,
accessibility conformance, privacy or security certification, production, pilot
or district readiness, release, publication, or any independent validation.

The next defensible owner action after implementation is a bounded
founder/operator walkthrough of the loop with recorded usability findings.
