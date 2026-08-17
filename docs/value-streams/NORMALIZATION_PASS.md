# Normalization pass

Before a workflow architecture is usable, near-duplicates must be resolved and mis-shaped
concepts corrected. Twelve findings are recorded in `src/fixtures/value-stream/normalization.ts`
and displayed on the normalization view of `/value-streams`.

## Question set applied to every candidate stream

1. Is this a value stream, a stage of another stream, or a recurring activity?
2. Does it have its own trigger and its own beneficiary, or does it inherit both?
3. Would refusing it stop anything?
4. Does it produce an object no other stream produces?
5. Is it a stream in the enterprise sense, or a tool workflow described as one?

## Typical outcomes

- **Demoted to subflow** — "evidence collection" has no independent trigger; it is a stage
  obligation inside every stream.
- **Merged** — near-duplicate intake paths that differ only by requester are one stream with a
  declared trigger variant.
- **Promoted** — a step that owns its own beneficiary and refusal path becomes a stream.
- **Split** — a stream with two unrelated exits is two streams.
- **Kept with a boundary note** — retained, with the adjacent concept it is often confused with
  named explicitly.

Every finding records the judgment made and the consequence of that judgment, so the reader can
disagree with the decision rather than guess at it.
