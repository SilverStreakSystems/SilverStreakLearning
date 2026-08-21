# Vendor Lifecycle

Stream id: `vendor-lifecycle`
Authority: **research-candidate** (declared, not derived from implementation)
Operating status: **candidate-internal**
Implementation status: **modeled**
Maturity: current **S0**, target **S2**

All content is synthetic reference architecture. No live operation, no personal data.

## Purpose

Keep external dependencies visible, bounded, and exitable.

## North star contribution

Makes SSLS's dependence on others explicit rather than assumed.

## Who this serves

Human beneficiaries:

- Users whose data or service depends on a third party

Enterprise beneficiaries:

- Security and Privacy, Finance and Legal, Engineering

## Trigger, entry, exit

Trigger: A need cannot be met internally and a third party is considered.

Entry criteria:

- A dependency need is recorded with the alternative of not using a vendor.

Exit criteria:

- The vendor is governed with an exit plan, or the dependency is refused.

## Authority separation

- Primary function: Enterprise Operations
- Supporting functions: Security and Privacy, Finance and Legal, Engineering and Delivery
- Accountable role candidate: Vendor governance lead (candidate, not staffed)
- Decision authorities: Finance and Legal
- Validation authorities: Trust, Quality and Assurance
- Stop authorities: Security and Privacy, Finance and Legal

## Stages

### 1. Dependency need

State the need and the option of not creating a dependency.

- Owner: Enterprise Operations
- Entry: An internal option was considered and recorded.
- Exit: The need and the no-vendor option are recorded.
- Required deliverables: None
- Evidence: The need and the no-vendor option are recorded.
- Refusal states: Refused: internal option is adequate.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 2. Assessment

Assess security, privacy, viability, and data handling.

- Owner: Security and Privacy
- Entry: A dependency need is recorded.
- Exit: Assessment results are recorded per area.
- Required deliverables: None
- Evidence: Assessment results are recorded per area.
- Refusal states: Refused: security or privacy assessment failed.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 3. Exit planning

Plan the exit before creating the dependency.

- Owner: Enterprise Operations
- Entry: Assessment passed.
- Exit: A viable exit plan exists with cost and time recorded.
- Required deliverables: None
- Evidence: A viable exit plan exists with cost and time recorded.
- Refusal states: Refused: no viable exit.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 4. Contract and obligations

Record obligations in both directions.

- Owner: Finance and Legal
- Entry: An exit plan exists.
- Exit: Obligations and renewal dates are recorded with owners.
- Required deliverables: None
- Evidence: Obligations and renewal dates are recorded with owners.
- Refusal states: Stopped: terms conflict with the governed boundary.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 5. Operation and monitoring

Monitor performance, incidents, and drift in data handling.

- Owner: Enterprise Operations
- Entry: The dependency is active.
- Exit: Monitoring findings are recorded each cycle.
- Required deliverables: None
- Evidence: Monitoring findings are recorded each cycle.
- Refusal states: Escalated: vendor changed data handling without notice.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 6. Renewal or exit

Decide continuation deliberately rather than by default.

- Owner: Finance and Legal
- Entry: The renewal date or a trigger has arrived.
- Exit: Renewal or exit is decided and recorded.
- Required deliverables: None
- Evidence: Renewal or exit is decided and recorded.
- Refusal states: Exit executed: dependency no longer acceptable.
- Maximum waiting state: Auto-renewal without a recorded decision is prohibited.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

## Gates

No gate is modelled on this stream. Every stage exit is still evidence-bound.

## Handoffs

- `vendor-lifecycle-S01-H`: Enterprise Operations → Security and Privacy. Required state: Exit criteria of Dependency need are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `vendor-lifecycle-S02-H`: Security and Privacy → Enterprise Operations. Required state: Exit criteria of Assessment are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `vendor-lifecycle-S03-H`: Enterprise Operations → Finance and Legal. Required state: Exit criteria of Exit planning are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `vendor-lifecycle-S04-H`: Finance and Legal → Enterprise Operations. Required state: Exit criteria of Contract and obligations are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `vendor-lifecycle-S05-H`: Enterprise Operations → Finance and Legal. Required state: Exit criteria of Operation and monitoring are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.

## Dependencies

- No cross-stream dependency recorded.

## Refusal and rollback

Refusal conditions:

- No viable exit exists.
- The vendor requires data outside the governed boundary.
- Security or privacy assessment fails.

Rollback and recovery: Execute the exit plan and record the migration as an incident if unplanned.

Escalations:

- A stalled stage escalates to the stream stop authority.
- A refused gate escalates to the decision authority named for that gate.

## Measurement

Outcome measures:

- Every active dependency has a current exit plan.

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

- Lock-in discovered only at renewal.
- Shadow dependencies never assessed.

Assumptions:

- Current vendor use is limited to development tooling.

Unknowns:

- Which dependencies become critical once districts are live.

Review trigger: Renewal date, security event, or a change in vendor data handling.
