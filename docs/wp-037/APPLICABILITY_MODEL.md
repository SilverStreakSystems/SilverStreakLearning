# Applicability Model

Implemented in `scripts/evidence/applicability.mjs`. Applicability replaces the WP-006 question
"does the declared SHA equal HEAD" with "do the inputs this result depended on still hold, in an
applicable environment, unexpired and unsuperseded".

## The six states

| State          | Decided when                                                                                                                               |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `CURRENT`      | Every declared input hash matches and validity has not ended                                                                               |
| `STALE`        | At least one declared input changed, or a type whose declared inputs do not fully determine its result is being read at a different commit |
| `EXPIRED`      | The declared validity window has passed                                                                                                    |
| `SUPERSEDED`   | The record names a successor, or a successor names it                                                                                      |
| `INAPPLICABLE` | The recording environment does not cover the environment under review                                                                      |
| `UNKNOWN`      | Commit, environment, input hashes, or the type declaration is missing                                                                      |

## Amendment — 2026-08-20 (engineering-baseline recovery, EV-045)

Two scoping defects made evidence invalidate itself on every commit and are now fixed.

1. Generated outputs are excluded from every declared input set: `evidence/`, `dist/`, `.output/`,
   `docs/CURRENT_STATE.md`, and `data/current-state/current-state.fingerprint.json`. Writing
   evidence, or regenerating the current-state projection, no longer changes the inputs that
   evidence depends on. `isDerivedOutput` in `scripts/evidence/inputs.mjs` is the single list, and
   a test asserts the exclusion.
2. Tree-wide scans (`SOURCE_PROVENANCE`, `SECRET_SCAN`, `PII_BOUNDARY_SCAN`, `BASELINE_MANIFEST`)
   and the projection guard (`SSOT_BINDING`) are no longer commit-bound. Their declared input scope
   fully determines their result, so unchanged inputs keep them `CURRENT` at a later commit. The
   commit SHA remains recorded as provenance; it is not the applicability test.
   `SSOT_BINDING` now declares the `projection` set — the current-state input manifest, the inputs
   it names, and the generator — instead of the whole `docs` tree, which contained its own output.

Fail-closed behaviour is unchanged: missing or `UNKNOWN` input hashes still yield `UNKNOWN`, and a
type whose declared scope does not determine its result still goes `STALE` at a different commit.

## Evaluation order

Supersession, then binding completeness, then expiry, then environment, then input comparison. The
order matters: a superseded record is superseded regardless of whether its inputs still match, and
an expired record is expired regardless of environment.

## Unknown is preserved

`UNKNOWN` is never collapsed into `CURRENT` or `STALE`. An undetermined answer is reported as
undetermined, because a false `CURRENT` is the failure mode this whole architecture exists to
prevent, and a false `STALE` teaches the operator to ignore the signal.

## Environment

Evidence produced in one environment does not automatically cover another. The sandbox and CI are
treated as interchangeable for input-derived facts only, since both execute the same repository
toolchain. Staging, production, and independent-test environments are never covered by either.

## What the model does not do

It does not judge whether a result is good, whether risk is acceptable, or whether work may
proceed. `CURRENT` means the result still describes the present inputs. It does not mean the result
was favourable, and it never means a claim is authorized.
