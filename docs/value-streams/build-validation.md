# Build → Validation

Stream id: `build-validation`
Authority: **research-candidate** (declared, not derived from implementation)
Operating status: **candidate-internal**
Implementation status: **modeled**
Maturity: current **S0**, target **S2**

All content is synthetic reference architecture. No live operation, no personal data.

## Purpose

Separate what was built from what was proven.

## North star contribution

Makes the difference between planned and executed checks visible.

## Who this serves

Human beneficiaries:

- Users who rely on the thing actually working

Enterprise beneficiaries:

- Quality, Governance, Release

## Trigger, entry, exit

Trigger: An implementation candidate is offered for validation.

Entry criteria:

- An implementation candidate exists.
- The governing requirement is testable.

Exit criteria:

- A validation disposition is recorded with evidence bound to a version.

## Authority separation

- Primary function: Trust, Quality and Assurance
- Supporting functions: Engineering and Delivery, Experience and Accessibility, Security and Privacy
- Accountable role candidate: Head of Quality and Assurance (candidate, not staffed)
- Decision authorities: Trust, Quality and Assurance
- Validation authorities: Trust, Quality and Assurance
- Stop authorities: Trust, Quality and Assurance, Security and Privacy

## Stages

### 1. Implementation candidate

Accept or refuse the candidate for validation.

- Owner: Trust, Quality and Assurance
- Entry: A candidate is offered with its version identified.
- Exit: The candidate is accepted for validation, or refused with a reason.
- Required deliverables: None
- Evidence: The candidate is accepted for validation, or refused with a reason.
- Refusal states: Refused: requirement not testable as written.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 2. Validation planning

Define the checks, their preconditions, and their evidence.

- Owner: Trust, Quality and Assurance
- Entry: A candidate has been accepted for validation.
- Exit: Planned checks exist with preconditions and expected evidence.
- Required deliverables: None
- Evidence: Planned checks exist with preconditions and expected evidence.
- Refusal states: Blocked: environment unavailable.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 3. Preconditions

Confirm the conditions required for the check to mean anything.

- Owner: Trust, Quality and Assurance
- Entry: Planned checks exist.
- Exit: Preconditions are confirmed or the check is marked not executable.
- Required deliverables: None
- Evidence: Preconditions are confirmed or the check is marked not executable.
- Refusal states: Not executed: preconditions unmet, recorded as such.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 4. Execution

Run the checks and record what actually happened.

- Owner: Trust, Quality and Assurance
- Entry: Preconditions are confirmed.
- Exit: Actual results are recorded and bound to the version tested.
- Required deliverables: None
- Evidence: Actual results are recorded and bound to the version tested.
- Refusal states: Halted: unsafe or invalid test conditions.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 5. Actual result

State what the result shows and what it does not.

- Owner: Trust, Quality and Assurance
- Entry: Checks were executed.
- Exit: Results are recorded with their scope and limits.
- Required deliverables: None
- Evidence: Results are recorded with their scope and limits.
- Refusal states: Returned: result over-generalized beyond what was tested.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 6. Finding

Raise findings for anything that did not meet the requirement.

- Owner: Trust, Quality and Assurance
- Entry: Results are recorded.
- Exit: Findings exist with severity and owner.
- Required deliverables: None
- Evidence: Findings exist with severity and owner.
- Refusal states: Blocked: no owner accepts the finding.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 7. Remediation and retest

Correct and re-check, without discarding the original result.

- Owner: Engineering and Delivery
- Entry: Findings exist with owners.
- Exit: Remediation is complete and re-checked, with both results retained.
- Required deliverables: None
- Evidence: Remediation is complete and re-checked, with both results retained.
- Refusal states: Refused: remediation changed scope without a decision.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 8. Validation disposition

Record the validation outcome as its own axis.

- Owner: Trust, Quality and Assurance
- Entry: Checks and any retests are complete.
- Exit: Validation status is recorded; release status is untouched.
- Required deliverables: None
- Evidence: Validation status is recorded; release status is untouched.
- Refusal states: Refused: attempt to infer release readiness here.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

## Gates

### Validation disposition gate (`build-validation-G01`)

Decide whether Build → Validation may advance past validation disposition.

- Owner: Trust, Quality and Assurance
- Required evidence: Validation status is recorded; release status is untouched.
- Dispositions available: pass, hold, blocked, refused, revise
- Stop conditions: The validator is not independent of the builder.; Preconditions for the check are not met.; The requirement is not testable as written.
- Worked example disposition: hold — Illustrative disposition only. No real work has passed this gate.

## Handoffs

- `build-validation-S01-H`: Trust, Quality and Assurance → Trust, Quality and Assurance. Required state: Exit criteria of Implementation candidate are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `build-validation-S02-H`: Trust, Quality and Assurance → Trust, Quality and Assurance. Required state: Exit criteria of Validation planning are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `build-validation-S03-H`: Trust, Quality and Assurance → Trust, Quality and Assurance. Required state: Exit criteria of Preconditions are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `build-validation-S04-H`: Trust, Quality and Assurance → Trust, Quality and Assurance. Required state: Exit criteria of Execution are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `build-validation-S05-H`: Trust, Quality and Assurance → Trust, Quality and Assurance. Required state: Exit criteria of Actual result are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `build-validation-S06-H`: Trust, Quality and Assurance → Engineering and Delivery. Required state: Exit criteria of Finding are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `build-validation-S07-H`: Engineering and Delivery → Trust, Quality and Assurance. Required state: Exit criteria of Remediation and retest are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.

## Dependencies

- No cross-stream dependency recorded.

## Refusal and rollback

Refusal conditions:

- The validator is not independent of the builder.
- Preconditions for the check are not met.
- The requirement is not testable as written.

Rollback and recovery: Failed validation returns the work to remediation with named findings.

Escalations:

- A stalled stage escalates to the stream stop authority.
- A refused gate escalates to the decision authority named for that gate.

## Measurement

Outcome measures:

- Executed checks are distinguishable from planned checks.

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

- Planned tests are counted as evidence.
- The builder validates their own work.

Assumptions:

- At current scale, independence is procedural rather than organizational.

Unknowns:

- When independent external validation becomes mandatory.

Review trigger: Any change to the implementation under validation.
