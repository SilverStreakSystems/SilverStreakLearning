# Stage model

A stage is the smallest unit of governed movement. It has an owner, an input state, work, an
output state, and a way to stop.

## Anatomy

| Element | Rule |
| --- | --- |
| Owner | Exactly one enterprise function. |
| Participating functions | Named, so a stage cannot silently depend on an uninvolved party. |
| Acting capacities | Declared. Work performed outside a declared capacity is refused. |
| Input objects | Shared object types the stage requires. |
| Required context | The purpose-bound context package the stage needs, or `null`. |
| Entry criteria | Must be independently checkable. Not "previous stage done". |
| Work types | The kind of work performed, so effort is described honestly. |
| Deliverables | Named deliverable types produced. |
| Decision points | Each with its own authority and options, including the option to decline. |
| Approvals | Human acts, recorded with actor, capacity, and rationale. |
| Validation | The check performed by someone other than the producer, where required. |
| Evidence | At least one reviewable proposition bound to the instance and version. |
| Exit criteria | Observable statements, not sentiment. |
| Refusal states | Named ways this stage legitimately stops. |
| Maximum waiting state | A bounded wait. Silence past the bound escalates. |
| Escalation | Where a stall goes, by function. |
| Output objects | What leaves the stage. |
| Audit requirement | Who acted, in which capacity, on which objects, under which rule, when. |

## Advancement rule

A stage may be exited only when its own exit criteria are met and its evidence is recorded.
The completion of a preceding stage is never sufficient reason to advance. Tests enforce this:
no stage entry criterion in the fixtures reduces to "the previous stage is complete".

## Default evidence

When a stage seed does not state its own evidence, the builder binds the stage's first exit
criterion to a recorded exit review with a named reviewer drawn from the stream's validation
authority. This makes exit reviewable by construction; it does not make it true.
