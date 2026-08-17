# Current state — value streams increment

Recovered truth as of this increment. Status words are used strictly.

## Implemented (code exists and is exercised by tests)

- Value stream domain models: streams, stages, gates, handoffs, dependencies, commitments,
  metrics, burden assessments, state transitions, refusal records, escalation paths.
- Fifteen canonical enterprise functions with positive and negative decision rights.
- Eighteen seeded priority value streams, all synthetic.
- Derived operating records generated from the seeds, so records cannot contradict the streams.
- Twelve normalization findings and five read-only projection contracts.
- Query layer: filtering, function involvement, independence exceptions, learning-loop targets.
- Surfaces: `/value-streams` registry with eleven views, and `/value-streams/$streamId` detail.
- Invariant tests: gate stop conditions, evidence-bearing gates, no advancement by predecessor
  completion alone, absence of prohibited metrics, AI lifecycle gating, projection read-only
  status, normalization judgments, and route rendering with a single H1.

## Specified but not implemented

- Instance-level workflow execution. Nothing runs; all records are reference architecture.
- Time-based escalation behaviour. Maximum waiting states are declared, not enforced.
- Cross-increment linkage from stream metrics to the governance registers.

## Candidate / provisional

- The eighteen-stream set itself. It is a candidate taxonomy at `research-candidate` authority.
- Burden offsets, which are asserted in the model and not yet validated against real practice.

## Gated future

- AI capability lifecycle. Blocked and refused dispositions only.
- Any live personal data path. Closed.

## Missing

- Prompt 003 shared-object documentation existed only as code until this increment; core
  documents are now written and invariant tests added, but per-family reference pages remain
  outstanding.

## Contradictory

- None outstanding. The earlier collision between dependency naming and enterprise function
  naming was reconciled during this increment.
