# Applicability Model

Implemented in `scripts/evidence/applicability.mjs`. Applicability replaces the WP-006 question
"does the declared SHA equal HEAD" with "do the inputs this result depended on still hold, in an
applicable environment, unexpired and unsuperseded".

## The six states

| State | Decided when |
|---|---|
| `CURRENT` | Every declared input hash matches and validity has not ended |
| `STALE` | At least one declared input changed, or a non-reusable type is being read at a different commit |
| `EXPIRED` | The declared validity window has passed |
| `SUPERSEDED` | The record names a successor, or a successor names it |
| `INAPPLICABLE` | The recording environment does not cover the environment under review |
| `UNKNOWN` | Commit, environment, input hashes, or the type declaration is missing |

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
