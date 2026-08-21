# Hire → Develop → Retain

Stream id: `hire-develop-retain`
Authority: **research-candidate** (declared, not derived from implementation)
Operating status: **candidate-internal**
Implementation status: **modeled**
Maturity: current **S0**, target **S2**

All content is synthetic reference architecture. No live operation, no personal data.

## Purpose

Connect capability gaps to people decisions without pretending roles are filled.

## North star contribution

Keeps the gap between required capability and available capacity honest.

## Who this serves

Human beneficiaries:

- Future staff who deserve a defined, sustainable role

Enterprise beneficiaries:

- Every function that depends on capacity

## Trigger, entry, exit

Trigger: A capability gap or unsustainable workload is recorded.

Entry criteria:

- A capability gap exists with evidence of the need.

Exit criteria:

- A staffing decision is recorded, including a decision not to hire.

## Authority separation

- Primary function: People and Organizational Learning
- Supporting functions: Strategy and Governance, Finance and Legal, Enterprise Operations
- Accountable role candidate: Head of People (candidate, not staffed)
- Decision authorities: Strategy and Governance
- Validation authorities: Trust, Quality and Assurance
- Stop authorities: Strategy and Governance, Finance and Legal

## Stages

### 1. Capability gap

Record the gap with evidence of impact.

- Owner: People and Organizational Learning
- Entry: A gap is identified with evidence.
- Exit: The gap and its consequence are recorded.
- Required deliverables: None
- Evidence: The gap and its consequence are recorded.
- Refusal states: Refused: gap asserted without evidence.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 2. Work redesign check

Test whether the gap can be closed without adding a person.

- Owner: Enterprise Operations
- Entry: A gap is recorded.
- Exit: Redesign options are assessed and recorded.
- Required deliverables: None
- Evidence: Redesign options are assessed and recorded.
- Refusal states: Refused: hiring rejected in favour of removing work.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 3. Role definition

Define the role by capabilities held and decisions permitted.

- Owner: People and Organizational Learning
- Entry: Redesign did not close the gap.
- Exit: A role definition exists with capabilities and decision rights.
- Required deliverables: None
- Evidence: A role definition exists with capabilities and decision rights.
- Refusal states: Refused: role would hold builder and validator authority together.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 4. Funding and authorization

Confirm funding and authorize the role, or decline it.

- Owner: Finance and Legal
- Entry: A role definition exists.
- Exit: The role is authorized or declined on the record.
- Required deliverables: None
- Evidence: The role is authorized or declined on the record.
- Refusal states: Declined: funding not established.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 5. Onboarding and development

Bring capability up to the standard the role requires.

- Owner: People and Organizational Learning
- Entry: A role is authorized and filled.
- Exit: Onboarding and development plans are recorded.
- Required deliverables: None
- Evidence: Onboarding and development plans are recorded.
- Refusal states: Blocked: no capable supervisor for the role.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 6. Sustainability review

Check the role remains humane, defined, and needed.

- Owner: People and Organizational Learning
- Entry: The role has been active for one review cycle.
- Exit: Load, scope, and continued need are recorded.
- Required deliverables: None
- Evidence: Load, scope, and continued need are recorded.
- Refusal states: Escalated: workload unsustainable.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

## Gates

### Funding and authorization gate (`hire-develop-retain-G01`)

Decide whether Hire → Develop → Retain may advance past funding and authorization.

- Owner: Finance and Legal
- Required evidence: The role is authorized or declined on the record.
- Dispositions available: pass, hold, blocked, refused, revise
- Stop conditions: The role would hold both builder and validator authority for the same work.; The gap can be closed by removing work rather than adding a person.; Funding is not established.
- Worked example disposition: hold — Illustrative disposition only. No real work has passed this gate.

### Sustainability review gate (`hire-develop-retain-G02`)

Decide whether Hire → Develop → Retain may advance past sustainability review.

- Owner: People and Organizational Learning
- Required evidence: Load, scope, and continued need are recorded.
- Dispositions available: pass, hold, blocked, refused, revise
- Stop conditions: The role would hold both builder and validator authority for the same work.; The gap can be closed by removing work rather than adding a person.; Funding is not established.
- Worked example disposition: hold — Illustrative disposition only. No real work has passed this gate.

## Handoffs

- `hire-develop-retain-S01-H`: People and Organizational Learning → Enterprise Operations. Required state: Exit criteria of Capability gap are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `hire-develop-retain-S02-H`: Enterprise Operations → People and Organizational Learning. Required state: Exit criteria of Work redesign check are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `hire-develop-retain-S03-H`: People and Organizational Learning → Finance and Legal. Required state: Exit criteria of Role definition are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `hire-develop-retain-S04-H`: Finance and Legal → People and Organizational Learning. Required state: Exit criteria of Funding and authorization are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `hire-develop-retain-S05-H`: People and Organizational Learning → People and Organizational Learning. Required state: Exit criteria of Onboarding and development are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.

## Dependencies

- No cross-stream dependency recorded.

## Refusal and rollback

Refusal conditions:

- The role would hold both builder and validator authority for the same work.
- The gap can be closed by removing work rather than adding a person.
- Funding is not established.

Rollback and recovery: Withdraw a role definition and record why the gap will be handled differently.

Escalations:

- A stalled stage escalates to the stream stop authority.
- A refused gate escalates to the decision authority named for that gate.

## Measurement

Outcome measures:

- Capability gaps carry an explicit staffing disposition.

Recorded metrics:

- Items waiting beyond their maximum waiting state: undefined
- Items returned for correction: undefined
- Gate dispositions recorded: undefined
- Refusals with a recorded ground: undefined

No metric on this stream measures individual output rate, ranks people, or scores a person.

## Learning loop

Findings from this stream return to: `outcome-research`.

## Risks, assumptions, unknowns

Risks:

- Hiring to relieve symptoms of a process problem.
- Independence violated by role design.

Assumptions:

- Zero staff at this stage; every role is a candidate.

Unknowns:

- Which roles must be first when funding exists.

Review trigger: New capability gap, workload evidence, or funding change.
