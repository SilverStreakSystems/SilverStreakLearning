# State transition model

Work state is not a single field. Each transition is recorded on the axis it actually belongs
to, so that progress on one axis never manufactures progress on another.

## Axes in play during workflow

| Axis | Question | Never implies |
| --- | --- | --- |
| Workflow | Where is this in its stream? | That it is approved or correct. |
| Authority | What standing does this hold? | That it is implemented. |
| Implementation | Has it been built? | That it works or is authorised. |
| Validation | Has someone independent checked it? | That it is released. |
| Evidence | What supports the statement? | That the statement is approved. |
| Approval | Has a human with standing accepted it? | That it is published. |
| Publication | Is it externally stated? | That it remains true. |
| Freshness | When was this last confirmed? | That it is still correct. |

## Transition record

Every transition records: the object, the axis, the prior value, the new value, the actor, the
acting capacity, the rule invoked, the evidence referenced, the timestamp, and whether the
transition was automatic or human.

Rules:

1. **A derived status may change automatically. An approval may not.** Automatic transitions
   are limited to axes whose value is a computation over recorded facts.
2. **Backward transitions are legitimate** and recorded with the same weight as forward ones.
   Validation can be withdrawn; freshness can lapse.
3. **No transition is inferred from another axis.** A passing test never moves the authority
   axis.
4. **A transition without an actor is invalid** unless it is explicitly a derived-status
   recomputation, in which case the rule is the actor.
