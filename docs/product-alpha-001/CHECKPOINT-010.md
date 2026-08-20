# CHECKPOINT-010 — Product Alpha 001 implementation checkpoint

**Product Alpha 001 implementation checkpoint — not WP-007 Cycle 9.**

Controlling decision: `DEC-023` — `src/fixtures/registers.ts` → `DECISIONS`, `DEC-023`.
Evidence record: `EV-046` — `src/fixtures/registers.ts` → `EVIDENCE`, `EV-046`.
Entry boundary: `docs/product-alpha-001/ENTRY_SPECIFICATION.md`.
Completed on: 2026-08-20.

This document records that an implementation happened. It creates no state: it
opens and closes no gate, closes no work package, discharges no finding, records
no accessibility result, and authorizes no successor increment.

## 1. Scope actually executed

The bounded, local-only, synthetic vertical slice authorized by DEC-023, and
nothing else:

- data is fictional and generated from a fixed synthetic seed;
- persistence is browser-local only, behind a repository interface with an
  in-memory adapter for the no-storage case;
- the interface surface is `/learners` and `/learners/$learnerId`;
- no backend, authentication, account, tenancy, database, row-level security,
  artificial-intelligence feature, integration, analytics, or real personal data
  was implemented, started, or enabled.

## 2. What was implemented

1. **Learner evidence → support/action → outcome → timeline loop.** Five
   canonical record families (`SyntheticLearnerRecord`, `LearningGoalRecord`,
   `LearningObservationRecord`, `SupportActionRecord`, `GoalReviewRecord`) with
   strict schemas and cross-record invariants enforced at runtime on every
   write. Observations and goal reviews are append-only; a correction is a new
   record that supersedes an earlier one and both stay visible. A chronological
   timeline projects the recorded loop for one learner.
2. **Deterministic next-step projection.** `LLR-001 v1.0.0` is a pure, total,
   `asOf`-filtered projection over the current document. Its clause precedence
   is fixed, each outcome carries its rule identifier, rationale, and limitation
   statement, and every projection cites the sorted, unique basis record
   identifiers it was computed from. It never closes a goal.
3. **Local repository, recovery, and import/export boundary.** One versioned
   storage envelope under one canonical key holds the current document and a
   single prior backup, written in one transaction. Reads return structured
   outcomes (`empty`, `ready`, `conflict`, `unavailable`, `corrupt`,
   `unsupported-version`, `write-failed`) and never collapse corrupt or newer
   stored bytes into "empty". Corrupt or newer data is only replaced through a
   confirmed recovery that carries an expectation captured when the confirmation
   opened; a stale expectation returns conflict and writes nothing. Export is
   byte-stable canonical serialization; import is replace-only, size-limited,
   previewed, cancellable, and leaves prior bytes intact when it fails.
4. **Feature-scoped interface mechanics.** The bounded golden path (load
   synthetic data → baseline observation → planned support → completed support →
   follow-up observation → recorded result → timeline → announced next step) is
   driven end to end by user events in tests, survives reload from browser-local
   storage, and keeps focus continuity on save, on failure, and across the
   small-screen navigation drawer (Escape, focus containment, focus restoration,
   scroll restoration). The TTR-001 sizing contract is applied as an
   implementation contract.

## 3. Validation observed at this tree

Recorded in `EV-046` with the exact observed commands and counts. The checks run
were the repository's own quality commands: frozen install, lint at a
zero-warning ceiling, typecheck, the full Vitest suite, the production build,
the generated-artefact check, the current-state projection check, committed
evidence generation and verification, the evidence output-safety guard, and the
aggregate `verify` and `verify:ci` gates. At this tree the full suite observed
is 629 tests across 30 test files, all passing, with lint at zero warnings and a
clean typecheck. That count includes the independent-acceptance and
independent-audit regressions (`src/test/product-alpha-blockers.test.tsx`,
`src/test/product-alpha-audit.test.tsx`) covering same-support correction
refusal, mandatory recovery expectations at the repository boundary,
version-aware envelope decoding, import preview and restore fail-closed
behaviour under concurrent writes, draft and target continuity through refused
writes, golden-path focus placement, and mobile drawer focus containment.

## 4. closed_nothing

This checkpoint closed nothing. Explicitly, it did **not** establish or close:

- the TTR-001 touch-target audit — it remains NOT-RUN and unauthorized, and
  `FND-024` remains open as deferred debt;
- `EV-003` — it remains NOT-RUN;
- `HREQ-025` — unchanged at NEEDS-EVIDENCE / DEFER;
- founder usability validation, usefulness, or workflow stability;
- learning impact, educational validity, or any clinical, eligibility, or
  district-practice claim;
- accessibility conformance (WCAG 2.2 AA, ADA Title II, Section 508) of any kind;
- privacy or security certification, or any independent validation;
- closure of any gate, work package, cycle, or finding — Gate A remains OPEN and
  WP-007 remains ACTIVE;
- release, publication, production, pilot, or district readiness;
- any backend, authentication, database, tenancy, artificial-intelligence,
  integration, or real-data capability;
- authorization of any successor stage — `WP-039`, a Cycle 9, and a bounded
  `PRODUCT-ALPHA-001-EXPANSION` all remain unauthorized.

## 5. Next defensible owner action

A bounded founder/operator walkthrough of the loop with recorded usability
findings, followed by an owner decision on whether the workflow needs a bounded
revision or is stable enough for a separately authorized TTR-001 audit. The
non-authoritative, not-yet-executed protocol for that walkthrough is
`docs/product-alpha-001/FOUNDER_WALKTHROUGH_PROTOCOL.md`.
