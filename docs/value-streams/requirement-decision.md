# Requirement → Decision

Stream id: `requirement-decision`
Authority: **research-candidate** (declared, not derived from implementation)
Operating status: **candidate-internal**
Implementation status: **modeled**
Maturity: current **S0**, target **S2**

All content is synthetic reference architecture. No live operation, no personal data.

## Purpose

Make choices deliberate, attributable, and revisitable.

## North star contribution

Makes authority visible: who decided, on what basis, and when it will be reconsidered.

## Who this serves

Human beneficiaries:
- Anyone affected by a choice they did not make

Enterprise beneficiaries:
- Engineering, Product, Quality, Legal

## Trigger, entry, exit

Trigger: A requirement contains a material choice that cannot be resolved by an existing rule.

Entry criteria:
- A decision question is stated.
- The requirement it serves is identified.

Exit criteria:
- A decision is recorded as accepted, refused, or deferred, with rationale and revisit trigger.

## Authority separation

- Primary function: Strategy and Governance
- Supporting functions: Product and Learning Systems, Engineering and Delivery, Security and Privacy, Finance and Legal
- Accountable role candidate: Decision authority named per decision (candidate)
- Decision authorities: Strategy and Governance
- Validation authorities: Trust, Quality and Assurance
- Stop authorities: Strategy and Governance, Security and Privacy

## Stages

### 1. Current requirement

Establish what is already required before deciding anything new.

- Owner: Product and Learning Systems
- Entry: The requirement is identified with its authority class.
- Exit: The existing constraint set is stated.
- Required deliverables: None
- Evidence: The existing constraint set is stated.
- Refusal states: Refused: requirement lacks authority.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 2. Decision question

State the actual choice, not the preferred answer.

- Owner: Strategy and Governance
- Entry: The constraint set is stated.
- Exit: A neutral decision question is recorded.
- Required deliverables: None
- Evidence: A neutral decision question is recorded.
- Refusal states: Returned: question presupposes its answer.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 3. Options

Develop genuinely different options including doing nothing.

- Owner: Product and Learning Systems
- Entry: A decision question is recorded.
- Exit: Options exist, including the option of no change.
- Required deliverables: None
- Evidence: Options exist, including the option of no change.
- Refusal states: Returned: no viable alternative offered.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 4. Evidence and constraints

Attach evidence, constraints, and unknowns to each option.

- Owner: Research and Intelligence
- Entry: Options are documented.
- Exit: Each option carries evidence, constraints, and named unknowns.
- Required deliverables: None
- Evidence: Each option carries evidence, constraints, and named unknowns.
- Refusal states: Blocked: evidence stale beyond its revalidation date.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 5. Recommendation

Recommend one option with reasoning, without deciding.

- Owner: Product and Learning Systems
- Entry: Options carry evidence and unknowns.
- Exit: A single recommendation with reasoning is recorded.
- Required deliverables: None
- Evidence: A single recommendation with reasoning is recorded.
- Refusal states: Returned: recommendation not supported by the attached evidence.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 6. Authority review

Review the recommendation against authority, policy, and risk appetite.

- Owner: Strategy and Governance
- Entry: A recommendation exists.
- Exit: The reviewing authority records a position.
- Required deliverables: None
- Evidence: The reviewing authority records a position.
- Refusal states: Stopped: policy or privacy objection raised.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 7. Decision recorded

Record acceptance, refusal, or deferral with consequence and reversibility.

- Owner: Strategy and Governance
- Entry: Authority review is complete.
- Exit: The decision, rationale, consequence, reversibility, and revisit trigger are recorded.
- Required deliverables: None
- Evidence: The decision, rationale, consequence, reversibility, and revisit trigger are recorded.
- Refusal states: Refused with reason recorded, which is a valid outcome.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 8. Requirement update

Propagate the decision into the requirement record.

- Owner: Product and Learning Systems
- Entry: A recorded decision exists.
- Exit: The affected requirement reflects the decision, with version history intact.
- Required deliverables: None
- Evidence: The affected requirement reflects the decision, with version history intact.
- Refusal states: Blocked: requirement owner unavailable to accept the change.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

## Gates

### Decision question gate (`requirement-decision-G01`)

Decide whether Requirement → Decision may advance past decision question.

- Owner: Strategy and Governance
- Required evidence: A neutral decision question is recorded.
- Dispositions available: pass, hold, blocked, refused, revise
- Stop conditions: No authorized decision authority is available.; The choice would breach a standing policy rule.; Evidence is stale relative to the decision's consequence.
- Worked example disposition: hold — Illustrative disposition only. No real work has passed this gate.

### Authority review gate (`requirement-decision-G02`)

Decide whether Requirement → Decision may advance past authority review.

- Owner: Strategy and Governance
- Required evidence: The reviewing authority records a position.
- Dispositions available: pass, hold, blocked, refused, revise
- Stop conditions: No authorized decision authority is available.; The choice would breach a standing policy rule.; Evidence is stale relative to the decision's consequence.
- Worked example disposition: hold — Illustrative disposition only. No real work has passed this gate.

### Decision recorded gate (`requirement-decision-G03`)

Decide whether Requirement → Decision may advance past decision recorded.

- Owner: Strategy and Governance
- Required evidence: The decision, rationale, consequence, reversibility, and revisit trigger are recorded.
- Dispositions available: pass, hold, blocked, refused, revise
- Stop conditions: No authorized decision authority is available.; The choice would breach a standing policy rule.; Evidence is stale relative to the decision's consequence.
- Worked example disposition: hold — Illustrative disposition only. No real work has passed this gate.

## Handoffs

- `requirement-decision-S01-H`: Product and Learning Systems → Strategy and Governance. Required state: Exit criteria of Current requirement are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `requirement-decision-S02-H`: Strategy and Governance → Product and Learning Systems. Required state: Exit criteria of Decision question are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `requirement-decision-S03-H`: Product and Learning Systems → Research and Intelligence. Required state: Exit criteria of Options are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `requirement-decision-S04-H`: Research and Intelligence → Product and Learning Systems. Required state: Exit criteria of Evidence and constraints are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `requirement-decision-S05-H`: Product and Learning Systems → Strategy and Governance. Required state: Exit criteria of Recommendation are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `requirement-decision-S06-H`: Strategy and Governance → Strategy and Governance. Required state: Exit criteria of Authority review are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `requirement-decision-S07-H`: Strategy and Governance → Product and Learning Systems. Required state: Exit criteria of Decision recorded are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.

## Dependencies

- No cross-stream dependency recorded.

## Refusal and rollback

Refusal conditions:
- No authorized decision authority is available.
- The choice would breach a standing policy rule.
- Evidence is stale relative to the decision's consequence.

Rollback and recovery: A decision may be superseded by a later decision that names it; the original stays on the record.

Escalations:
- A stalled stage escalates to the stream stop authority.
- A refused gate escalates to the decision authority named for that gate.

## Measurement

Outcome measures:
- Decisions carry rationale, consequence, reversibility, and revisit trigger.

Recorded metrics:
- Items waiting beyond their maximum waiting state: undefined
- Items returned for correction: undefined
- Gate dispositions recorded: undefined
- Refusals with a recorded ground: undefined

No metric on this stream measures individual output rate, ranks people, or scores a person.

## Learning loop

Findings from this stream return to: `governance-artifact-lifecycle`.

## Risks, assumptions, unknowns

Risks:
- Ambiguous shared accountability.
- Silent decisions taken in implementation.

Assumptions:
- One operator currently holds most decision rights and records them honestly.

Unknowns:
- How decision rights redistribute when functions are first staffed.

Review trigger: New evidence, changed constraint, or the recorded revisit trigger firing.
