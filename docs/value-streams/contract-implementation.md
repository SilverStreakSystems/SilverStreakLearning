# Contract → Implementation

Stream id: `contract-implementation`
Authority: **research-candidate** (declared, not derived from implementation)
Operating status: **candidate-internal**
Implementation status: **modeled**
Maturity: current **S0**, target **S2**

All content is synthetic reference architecture. No live operation, no personal data.

## Purpose

Deliver what was agreed without silently reinterpreting it.

## North star contribution

Keeps the agreed scope and the delivered reality comparable.

## Who this serves

Human beneficiaries:
- Staff who must use the system after it is installed

Enterprise beneficiaries:
- Support, Quality, Revenue

## Trigger, entry, exit

Trigger: Implementation accepts a scope handoff.

Entry criteria:
- A scope baseline and obligation register exist and are accepted.

Exit criteria:
- The deployment is ready for use and readiness is recorded per axis.

## Authority separation

- Primary function: Customer and Implementation
- Supporting functions: Engineering and Delivery, Data and Measurement, Security and Privacy, Support and Service
- Accountable role candidate: Head of Implementation (candidate, not staffed)
- Decision authorities: Customer and Implementation
- Validation authorities: Trust, Quality and Assurance
- Stop authorities: Security and Privacy, Trust, Quality and Assurance

## Stages

### 1. Scope acceptance

Accept the handoff, or refuse it with named gaps.

- Owner: Customer and Implementation
- Entry: A scope handoff is offered.
- Exit: The handoff is accepted with gaps named.
- Required deliverables: None
- Evidence: The handoff is accepted with gaps named.
- Refusal states: Refused: obligations unclear.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 2. Implementation planning

Plan configuration, data, training, and support.

- Owner: Customer and Implementation
- Entry: Scope is accepted.
- Exit: A plan exists with owners on both sides.
- Required deliverables: None
- Evidence: A plan exists with owners on both sides.
- Refusal states: Blocked: customer-side owner unnamed.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 3. Configuration

Configure to the agreed scope without inventing new scope.

- Owner: Engineering and Delivery
- Entry: A plan with owners exists.
- Exit: Configuration matches the scope baseline.
- Required deliverables: None
- Evidence: Configuration matches the scope baseline.
- Refusal states: Stopped: configuration would exceed the agreed scope.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 4. Data and boundary check

Confirm data handling stays inside the agreed and lawful boundary.

- Owner: Security and Privacy
- Entry: Configuration is complete.
- Exit: Data handling is confirmed within boundary, or stopped.
- Required deliverables: None
- Evidence: Data handling is confirmed within boundary, or stopped.
- Refusal states: Stopped: privacy boundary would be exceeded.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 5. Enablement

Prepare the people who will actually use the system.

- Owner: Customer and Implementation
- Entry: Data handling is approved.
- Exit: Enablement is delivered and recorded, including who was not reached.
- Required deliverables: None
- Evidence: Enablement is delivered and recorded, including who was not reached.
- Refusal states: Held: key user groups not reachable.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 6. Readiness review

Record readiness per axis, with evidence.

- Owner: Trust, Quality and Assurance
- Entry: Enablement is recorded.
- Exit: Each readiness axis has its own recorded state and evidence.
- Required deliverables: None
- Evidence: Each readiness axis has its own recorded state and evidence.
- Refusal states: Refused: blended readiness score submitted.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 7. Go-live

Start live use under a named authority and a support plan.

- Owner: Customer and Implementation
- Entry: Readiness axes are recorded with evidence.
- Exit: Go-live is recorded with the support plan active.
- Required deliverables: None
- Evidence: Go-live is recorded with the support plan active.
- Refusal states: Held: support coverage unavailable.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

## Gates

### Readiness review gate (`contract-implementation-G01`)

Decide whether Contract → Implementation may advance past readiness review.

- Owner: Trust, Quality and Assurance
- Required evidence: Each readiness axis has its own recorded state and evidence.
- Dispositions available: pass, hold, blocked, refused, revise
- Stop conditions: A prerequisite the customer owns is missing.; Data handling would exceed the agreed boundary.; Readiness cannot be evidenced.
- Worked example disposition: hold — Illustrative disposition only. No real work has passed this gate.

## Handoffs

- `contract-implementation-S01-H`: Customer and Implementation → Customer and Implementation. Required state: Exit criteria of Scope acceptance are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `contract-implementation-S02-H`: Customer and Implementation → Engineering and Delivery. Required state: Exit criteria of Implementation planning are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `contract-implementation-S03-H`: Engineering and Delivery → Security and Privacy. Required state: Exit criteria of Configuration are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `contract-implementation-S04-H`: Security and Privacy → Customer and Implementation. Required state: Exit criteria of Data and boundary check are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `contract-implementation-S05-H`: Customer and Implementation → Trust, Quality and Assurance. Required state: Exit criteria of Enablement are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `contract-implementation-S06-H`: Trust, Quality and Assurance → Customer and Implementation. Required state: Exit criteria of Readiness review are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.

## Dependencies

- No cross-stream dependency recorded.

## Refusal and rollback

Refusal conditions:
- A prerequisite the customer owns is missing.
- Data handling would exceed the agreed boundary.
- Readiness cannot be evidenced.

Rollback and recovery: Pause deployment, restore the prior state, and record a finding with the cause.

Escalations:
- A stalled stage escalates to the stream stop authority.
- A refused gate escalates to the decision authority named for that gate.

## Measurement

Outcome measures:
- Readiness evidence exists per axis before go-live.

Recorded metrics:
- Items waiting beyond their maximum waiting state: undefined
- Items returned for correction: undefined
- Gate dispositions recorded: undefined
- Refusals with a recorded ground: undefined

No metric on this stream measures individual output rate, ranks people, or scores a person.

## Learning loop

Findings from this stream return to: `incident-recovery-learning`.

## Risks, assumptions, unknowns

Risks:
- Scope creep absorbed silently by delivery.
- Training treated as optional.

Assumptions:
- Deployment is reference architecture only at this stage.

Unknowns:
- What minimum readiness a small district can realistically evidence.

Review trigger: Any change to scope, environment, or data handling.
