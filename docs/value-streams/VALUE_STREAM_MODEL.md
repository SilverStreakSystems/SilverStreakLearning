# Value stream model

A value stream is the end-to-end path by which a triggering condition becomes a governed
outcome for a named beneficiary. It is not a team, not a tool, not a folder, and not a
project plan.

## Required declarations

Every modelled stream declares:

- **Purpose** and **north star contribution** — how this movement makes learning visible.
- **Human beneficiaries** and **enterprise beneficiaries**, stated separately. A stream that
  benefits only the enterprise must say so.
- **Trigger**, **entry criteria**, **exit criteria**.
- **Stages**, in sequence, each with its own entry, exit, evidence, and refusal states.
- **Authority class** — declared, never derived. A stream can be fully implemented and still
  hold `research-candidate` authority.
- **Operating status** — `candidate-internal`, `partially-modelled`, or `gated-future`.
- **Implementation status** — tracked on a separate axis from authority and from maturity.
- **Decision, validation, and stop authorities**, listed separately. The same function holding
  all three is an independence exception and is surfaced, not hidden.
- **Refusal conditions**, **rollback and recovery**, **escalations**.
- **Outcome measures** and a **learning loop destination** — a stream with no destination for
  what it learns is incomplete.
- **Risks, assumptions, unknowns**, and a **review trigger**.

## What the model refuses

- No stream reports a blended completion or readiness percentage.
- No stream advances a stage merely because the previous stage finished. Advancement requires
  the next stage's entry criteria and, where gated, a recorded disposition.
- No stream implies authority from test success, deployment, or elapsed time.
- No stream is described as operating. The correct reading of every stream today is
  "modelled, synthetic, not running".

## Relationship to other layers

Streams consume enterprise **capabilities** (what the organisation must be able to do) and move
**shared objects** (what the organisation holds as truth). A stream is the verb; capabilities and
objects are the noun. Where a stream needs a capability that does not exist, that gap is a
finding, not a silent assumption.
