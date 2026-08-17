# Enterprise value streams and operating workflow architecture v0.1

This folder is the single source of truth for how governed SSLS work moves end to end.
Everything here is **synthetic reference architecture**. No live operation, no personal data,
no AI feature is running. Authority is declared on each artifact and is never inferred from
whether something is implemented, tested, or shipped.

## Reading order

1. [VALUE_STREAM_MODEL.md](./VALUE_STREAM_MODEL.md) — what a value stream is here, and what it is not.
2. [ENTERPRISE_FUNCTIONS.md](./ENTERPRISE_FUNCTIONS.md) — the 15 canonical functions that own work.
3. [STAGE_MODEL.md](./STAGE_MODEL.md) — stage anatomy, entry/exit, waiting states.
4. [GATE_MODEL.md](./GATE_MODEL.md) — dispositions, evidence, and silence.
5. [HANDOFF_CONTRACTS.md](./HANDOFF_CONTRACTS.md) — how work changes hands without loss.
6. [DEPENDENCY_AND_COMMITMENT_MODEL.md](./DEPENDENCY_AND_COMMITMENT_MODEL.md)
7. [STATE_TRANSITION_MODEL.md](./STATE_TRANSITION_MODEL.md)
8. [REFUSAL_ARCHITECTURE.md](./REFUSAL_ARCHITECTURE.md)
9. [METRICS_AND_PROHIBITED_METRICS.md](./METRICS_AND_PROHIBITED_METRICS.md)
10. [BURDEN_MODEL.md](./BURDEN_MODEL.md)
11. [INDEPENDENCE_IN_WORKFLOW.md](./INDEPENDENCE_IN_WORKFLOW.md)
12. [PROJECTIONS_AND_COMMAND_SURFACES.md](./PROJECTIONS_AND_COMMAND_SURFACES.md)
13. [NORMALIZATION_PASS.md](./NORMALIZATION_PASS.md)
14. [AI_LIFECYCLE_GATED_FUTURE.md](./AI_LIFECYCLE_GATED_FUTURE.md)
15. [PRIORITY_VALUE_STREAMS.md](./PRIORITY_VALUE_STREAMS.md) — index of the 18 modelled streams.
16. [CURRENT_STATE_VALUE_STREAMS.md](./CURRENT_STATE_VALUE_STREAMS.md) — what is implemented, specified, or missing.
17. [OPEN_QUESTIONS.md](./OPEN_QUESTIONS.md)

Per-stream documents are generated from the fixtures by `scripts/gen-value-stream-docs.ts`,
so a stream document can never drift from the modelled stream.

## Where the code lives

- Domain models: `src/domain/value-stream/`
- Seeded streams and derived records: `src/fixtures/value-stream/`
- Queries: `src/lib/value-stream-queries.ts`
- Surfaces: `src/routes/value-streams.tsx`, `.index.tsx`, `.$streamId.tsx`
- Invariant tests: `src/test/value-streams.test.tsx`
