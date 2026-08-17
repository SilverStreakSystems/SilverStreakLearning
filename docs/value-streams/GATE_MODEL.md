# Gate model

A gate is a point where a human decides whether governed work may advance. It is not a status
field, not a checkbox, and not a build result.

## Dispositions

| Disposition | Marker | Advances? | Meaning |
| --- | --- | --- | --- |
| Pass | `[PASS]` | Yes | Entry criteria met, evidence present, no stop condition triggered. |
| Pass with non-blocking findings | `[PASS+F]` | Yes | Advance permitted with named, owned findings carried forward. |
| Hold | `[HOLD]` | No | Paused pending a specific missing input. Not a failure. |
| Blocked | `[BLOCK]` | No | An unmet dependency outside this stage prevents review. |
| Refused | `[REFUSED]` | No | Governance declined to advance. A legitimate outcome. |
| Revise | `[REVISE]` | No | Return to origin with named corrections. |
| Not applicable | `[N/A]` | Yes | Explicitly out of scope for this instance, with a reason. |

Every disposition carries a text marker so status never depends on colour alone.

## Invariants

1. **A gate must be able to stop something.** A gate with no stop condition is a formality and
   fails validation.
2. **A gate must require evidence.** A gate that examines nothing is theatre. Stages without
   evidence requirements do not receive gates at all.
3. **Silence is not passage.** A gate with no recorded disposition has not passed. Time never
   passes a gate.
4. **Disposition is a human act.** It records actor, acting capacity, timestamp, inputs,
   disposition, and rationale.
5. **Residual risk has an owner.** Passing with findings names the authority accepting the
   residual risk.
6. **Refusal is first-class.** Refused is an outcome the system expects, records, and displays
   with the same weight as pass.
7. **Gated-future streams can only be blocked or refused.** The AI capability lifecycle gate
   offers no pass option at all.
