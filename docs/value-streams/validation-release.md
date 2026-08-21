# Validation → Release

Stream id: `validation-release`
Authority: **research-candidate** (declared, not derived from implementation)
Operating status: **candidate-internal**
Implementation status: **modeled**
Maturity: current **S0**, target **S2**

All content is synthetic reference architecture. No live operation, no personal data.

## Purpose

Keep release a deliberate authorization rather than a consequence of finishing work.

## North star contribution

Keeps independent axes visible instead of averaging them into a single number.

## Who this serves

Human beneficiaries:
- People who would be harmed by an unsafe or inaccessible release

Enterprise beneficiaries:
- Governance, Security and Privacy, Support

## Trigger, entry, exit

Trigger: A validated increment is proposed for release.

Entry criteria:
- Validation evidence exists and is current.

Exit criteria:
- Release is authorized, held, or refused, with the disposition recorded.

## Authority separation

- Primary function: Strategy and Governance
- Supporting functions: Engineering and Delivery, Trust, Quality and Assurance, Security and Privacy, Experience and Accessibility, Support and Service
- Accountable role candidate: Release authority (candidate, not staffed)
- Decision authorities: Strategy and Governance
- Validation authorities: Trust, Quality and Assurance
- Stop authorities: Security and Privacy, Experience and Accessibility, Trust, Quality and Assurance

## Stages

### 1. Validation evidence

Assemble the evidence that exists, and name what is missing.

- Owner: Trust, Quality and Assurance
- Entry: A release candidate is proposed.
- Exit: Evidence is assembled with gaps and conflicts named.
- Required deliverables: None
- Evidence: Evidence is assembled with gaps and conflicts named.
- Refusal states: Blocked: evidence conflicts unresolved.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 2. Findings review

Review open findings and decide which block release.

- Owner: Trust, Quality and Assurance
- Entry: Evidence is assembled.
- Exit: Each open finding is classified as blocking or non-blocking, with reasoning.
- Required deliverables: None
- Evidence: Each open finding is classified as blocking or non-blocking, with reasoning.
- Refusal states: Held: finding severity disputed and unresolved.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 3. Cross-cutting gate review

Run accessibility, security, privacy, and educational validity gates separately.

- Owner: Security and Privacy
- Entry: Findings are classified.
- Exit: Each gate records its own disposition.
- Required deliverables: None
- Evidence: Each gate records its own disposition.
- Refusal states: Refused: accessibility barrier unresolved.; Refused: privacy stop.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 4. Release candidate

Freeze the candidate and bind evidence to its version.

- Owner: Engineering and Delivery
- Entry: All gates recorded a disposition that permits advance.
- Exit: The candidate is frozen and evidence is version-bound.
- Required deliverables: None
- Evidence: The candidate is frozen and evidence is version-bound.
- Refusal states: Blocked: candidate changed after gate review.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 5. Authorization

Authorize, hold, or refuse the release under named authority.

- Owner: Strategy and Governance
- Entry: A frozen candidate with version-bound evidence exists.
- Exit: A release decision is recorded.
- Required deliverables: None
- Evidence: A release decision is recorded.
- Refusal states: Refused: release authority declines on the record.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 6. Release, hold or refuse

Execute the recorded decision.

- Owner: Engineering and Delivery
- Entry: A recorded release decision exists.
- Exit: The release event is recorded, including a hold or refusal.
- Required deliverables: None
- Evidence: The release event is recorded, including a hold or refusal.
- Refusal states: Rolled back: post-release stop condition triggered.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 7. Monitoring and hypercare

Watch for harm and route problems into incident handling.

- Owner: Support and Service
- Entry: A release occurred.
- Exit: The hypercare window closes with findings recorded.
- Required deliverables: None
- Evidence: The hypercare window closes with findings recorded.
- Refusal states: Escalated: harm detected, incident opened.
- Maximum waiting state: Hypercare may not close early without a recorded review.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

## Gates

### Findings review gate (`validation-release-G01`)

Decide whether Validation → Release may advance past findings review.

- Owner: Trust, Quality and Assurance
- Required evidence: Each open finding is classified as blocking or non-blocking, with reasoning.
- Dispositions available: pass, hold, blocked, refused, revise
- Stop conditions: An accessibility barrier is unresolved.; A security or privacy stop condition is triggered.; Validation evidence is stale relative to the candidate.
- Worked example disposition: hold — Illustrative disposition only. No real work has passed this gate.

### Cross-cutting gate review gate (`validation-release-G02`)

Decide whether Validation → Release may advance past cross-cutting gate review.

- Owner: Security and Privacy
- Required evidence: Each gate records its own disposition.
- Dispositions available: pass, hold, blocked, refused, revise
- Stop conditions: An accessibility barrier is unresolved.; A security or privacy stop condition is triggered.; Validation evidence is stale relative to the candidate.
- Worked example disposition: hold — Illustrative disposition only. No real work has passed this gate.

### Authorization gate (`validation-release-G03`)

Decide whether Validation → Release may advance past authorization.

- Owner: Strategy and Governance
- Required evidence: A release decision is recorded.
- Dispositions available: pass, hold, blocked, refused, revise
- Stop conditions: An accessibility barrier is unresolved.; A security or privacy stop condition is triggered.; Validation evidence is stale relative to the candidate.
- Worked example disposition: hold — Illustrative disposition only. No real work has passed this gate.

## Handoffs

- `validation-release-S01-H`: Trust, Quality and Assurance → Trust, Quality and Assurance. Required state: Exit criteria of Validation evidence are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `validation-release-S02-H`: Trust, Quality and Assurance → Security and Privacy. Required state: Exit criteria of Findings review are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `validation-release-S03-H`: Security and Privacy → Engineering and Delivery. Required state: Exit criteria of Cross-cutting gate review are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `validation-release-S04-H`: Engineering and Delivery → Strategy and Governance. Required state: Exit criteria of Release candidate are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `validation-release-S05-H`: Strategy and Governance → Engineering and Delivery. Required state: Exit criteria of Authorization are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `validation-release-S06-H`: Engineering and Delivery → Support and Service. Required state: Exit criteria of Release, hold or refuse are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.

## Dependencies

- No cross-stream dependency recorded.

## Refusal and rollback

Refusal conditions:
- An accessibility barrier is unresolved.
- A security or privacy stop condition is triggered.
- Validation evidence is stale relative to the candidate.

Rollback and recovery: Roll back the release, record an incident, and enter Incident → Recovery → Learning.

Escalations:
- A stalled stage escalates to the stream stop authority.
- A refused gate escalates to the decision authority named for that gate.

## Measurement

Outcome measures:
- Every release carries a recorded gate disposition.

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
- Pressure to release overrides a stop condition.
- Silence is treated as gate passage.

Assumptions:
- Hypercare is feasible at current scale.

Unknowns:
- What monitoring is sufficient before external users exist.

Review trigger: Any change to the release candidate after gate review.
