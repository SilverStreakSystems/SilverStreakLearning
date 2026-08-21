# Decision → Build

Stream id: `decision-build`
Authority: **research-candidate** (declared, not derived from implementation)
Operating status: **candidate-internal**
Implementation status: **modeled**
Maturity: current **S0**, target **S2**

All content is synthetic reference architecture. No live operation, no personal data.

## Purpose

Make implementation traceable to the decision that authorized it.

## North star contribution

Shows why each piece of work exists and which requirement it serves.

## Who this serves

Human beneficiaries:

- Users who receive work that was actually authorized

Enterprise beneficiaries:

- Engineering, Product, Quality

## Trigger, entry, exit

Trigger: An accepted decision creates authorized implementation scope.

Entry criteria:

- An accepted decision and a testable requirement both exist.

Exit criteria:

- Implementation is complete and internally reviewed, with validation not yet claimed.

## Authority separation

- Primary function: Engineering and Delivery
- Supporting functions: Product and Learning Systems, Experience and Accessibility, Data and Measurement
- Accountable role candidate: Head of Engineering (candidate, not staffed)
- Decision authorities: Product and Learning Systems
- Validation authorities: Trust, Quality and Assurance
- Stop authorities: Trust, Quality and Assurance, Security and Privacy

## Stages

### 1. Accepted decision

Confirm the authorizing decision is current and in scope.

- Owner: Product and Learning Systems
- Entry: An accepted decision exists and has not been superseded.
- Exit: Scope authorized by the decision is stated.
- Required deliverables: None
- Evidence: Scope authorized by the decision is stated.
- Refusal states: Refused: decision superseded.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 2. Implementation planning

Plan the work within the authorized scope.

- Owner: Engineering and Delivery
- Entry: Authorized scope is stated.
- Exit: A plan exists with named risks and accessibility considerations.
- Required deliverables: None
- Evidence: A plan exists with named risks and accessibility considerations.
- Refusal states: Blocked: accessibility approach unresolved.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 3. Work decomposition

Break the plan into work items that each serve a named object.

- Owner: Engineering and Delivery
- Entry: A plan exists.
- Exit: Every work item names its purpose and served object.
- Required deliverables: None
- Evidence: Every work item names its purpose and served object.
- Refusal states: Refused: orphan work item without a served object.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 4. Dependency resolution

Surface and assign dependencies before building.

- Owner: Engineering and Delivery
- Entry: Work items exist.
- Exit: Each dependency has an owner, a state, and an escalation path.
- Required deliverables: None
- Evidence: Each dependency has an owner, a state, and an escalation path.
- Refusal states: Blocked: unowned dependency raised as a finding.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 5. Build

Implement the authorized scope.

- Owner: Engineering and Delivery
- Entry: Blocking dependencies are cleared or explicitly accepted.
- Exit: The implementation exists and is recorded against its work items.
- Required deliverables: None
- Evidence: The implementation exists and is recorded against its work items.
- Refusal states: Stopped: scope exceeded what the decision authorized.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 6. Internal review

Check the work against the requirement before handing it to validation.

- Owner: Engineering and Delivery
- Entry: An implementation exists.
- Exit: Internal review is recorded, with findings raised.
- Required deliverables: None
- Evidence: Internal review is recorded, with findings raised.
- Refusal states: Returned for correction with named findings.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 7. Implementation complete

Declare implementation complete without claiming validation.

- Owner: Engineering and Delivery
- Entry: Internal review is recorded.
- Exit: Implementation status is recorded as implemented; validation status remains unchanged and separate.
- Required deliverables: None
- Evidence: Implementation status is recorded as implemented; validation status remains unchanged and separate.
- Refusal states: Refused: attempt to record validation from this stage.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

## Gates

### Accepted decision gate (`decision-build-G01`)

Decide whether Decision → Build may advance past accepted decision.

- Owner: Product and Learning Systems
- Required evidence: Scope authorized by the decision is stated.
- Dispositions available: pass, hold, blocked, refused, revise
- Stop conditions: Work has no served object or purpose.; The decision authorizing the work has been superseded.; A dependency is unowned.
- Worked example disposition: hold — Illustrative disposition only. No real work has passed this gate.

### Internal review gate (`decision-build-G02`)

Decide whether Decision → Build may advance past internal review.

- Owner: Engineering and Delivery
- Required evidence: Internal review is recorded, with findings raised.
- Dispositions available: pass, hold, blocked, refused, revise
- Stop conditions: Work has no served object or purpose.; The decision authorizing the work has been superseded.; A dependency is unowned.
- Worked example disposition: hold — Illustrative disposition only. No real work has passed this gate.

## Handoffs

- `decision-build-S01-H`: Product and Learning Systems → Engineering and Delivery. Required state: Exit criteria of Accepted decision are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `decision-build-S02-H`: Engineering and Delivery → Engineering and Delivery. Required state: Exit criteria of Implementation planning are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `decision-build-S03-H`: Engineering and Delivery → Engineering and Delivery. Required state: Exit criteria of Work decomposition are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `decision-build-S04-H`: Engineering and Delivery → Engineering and Delivery. Required state: Exit criteria of Dependency resolution are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `decision-build-S05-H`: Engineering and Delivery → Engineering and Delivery. Required state: Exit criteria of Build are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `decision-build-S06-H`: Engineering and Delivery → Engineering and Delivery. Required state: Exit criteria of Internal review are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.

## Dependencies

- No cross-stream dependency recorded.

## Refusal and rollback

Refusal conditions:

- Work has no served object or purpose.
- The decision authorizing the work has been superseded.
- A dependency is unowned.

Rollback and recovery: Reverse the change and record a finding; the requirement returns to its prior state.

Escalations:

- A stalled stage escalates to the stream stop authority.
- A refused gate escalates to the decision authority named for that gate.

## Measurement

Outcome measures:

- Work items trace to authorized decisions.
- Orphan work is surfaced, not hidden.

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

- Implementation completion is read as validation.
- Scope grows without a decision.

Assumptions:

- Internal review by the builder is insufficient and is treated as such.

Unknowns:

- When independent review becomes mandatory rather than advisory.

Review trigger: Scope change, superseded decision, or a blocking dependency.
