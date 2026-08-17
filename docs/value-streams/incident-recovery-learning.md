# Incident → Recovery → Learning

Stream id: `incident-recovery-learning`
Authority: **research-candidate** (declared, not derived from implementation)
Operating status: **candidate-internal**
Implementation status: **modeled**
Maturity: current **S0**, target **S2**

All content is synthetic reference architecture. No live operation, no personal data.

## Purpose

Protect people first, restore service second, and learn without blame.

## North star contribution

Makes failure legible so it is not repeated.

## Who this serves

Human beneficiaries:
- Anyone affected by a failure of the system

Enterprise beneficiaries:
- Security and Privacy, Support, Engineering, Governance

## Trigger, entry, exit

Trigger: A failure, harm, near-miss, or suspected breach is reported or detected.

Entry criteria:
- An incident report exists with what was observed and when.

Exit criteria:
- Service is restored, cause is recorded, and lessons are routed to learning.

## Authority separation

- Primary function: Security and Privacy
- Supporting functions: Engineering and Delivery, Support and Service, Finance and Legal, Strategy and Governance
- Accountable role candidate: Incident commander (candidate, not staffed)
- Decision authorities: Security and Privacy
- Validation authorities: Trust, Quality and Assurance
- Stop authorities: Security and Privacy, Strategy and Governance

## Stages

### 1. Detection or report

Record the incident with what was observed and when.

- Owner: Support and Service
- Entry: Something was observed or reported.
- Exit: An incident record exists with its first timestamp.
- Required deliverables: None
- Evidence: An incident record exists with its first timestamp.
- Refusal states: Escalated immediately if potential harm to a person is suspected.
- Maximum waiting state: Potential-harm reports are triaged immediately, not queued.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 2. Triage and severity

Classify severity by harm, not by inconvenience.

- Owner: Security and Privacy
- Entry: An incident record exists.
- Exit: Severity and potential harm are recorded.
- Required deliverables: None
- Evidence: Severity and potential harm are recorded.
- Refusal states: Escalated: severity disputed.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 3. Containment

Stop ongoing harm before diagnosing.

- Owner: Security and Privacy
- Entry: Severity is recorded.
- Exit: Ongoing harm is contained, or containment is recorded as not possible.
- Required deliverables: None
- Evidence: Ongoing harm is contained, or containment is recorded as not possible.
- Refusal states: Stop authority may halt the service entirely.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 4. Notification

Tell affected people and obligated parties honestly and promptly.

- Owner: Finance and Legal
- Entry: Containment is underway.
- Exit: Required notifications are made and recorded, including who was not reachable.
- Required deliverables: None
- Evidence: Required notifications are made and recorded, including who was not reachable.
- Refusal states: Refused: suppression of notification for reputational reasons.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 5. Recovery

Restore service to a verified good state.

- Owner: Engineering and Delivery
- Entry: Containment is complete.
- Exit: Service is restored and the restored state is verified.
- Required deliverables: None
- Evidence: Service is restored and the restored state is verified.
- Refusal states: Blocked: no verified good state to restore to.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 6. Cause analysis

Find system conditions that allowed the failure.

- Owner: Security and Privacy
- Entry: Service is restored.
- Exit: Contributing conditions are recorded without blaming individuals.
- Required deliverables: None
- Evidence: Contributing conditions are recorded without blaming individuals.
- Refusal states: Returned: analysis names a person as root cause.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 7. Corrective action

Assign and complete corrective actions with owners.

- Owner: Engineering and Delivery
- Entry: Cause analysis is complete.
- Exit: Corrective actions exist with owners and verification steps.
- Required deliverables: None
- Evidence: Corrective actions exist with owners and verification steps.
- Refusal states: Blocked: action has no owner.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 8. Lessons and routing

Route lessons into organizational learning and governance.

- Owner: People and Organizational Learning
- Entry: Corrective actions are recorded.
- Exit: Lessons are routed and the incident is closed with an outcome.
- Required deliverables: None
- Evidence: Lessons are routed and the incident is closed with an outcome.
- Refusal states: Escalated: corrective action closed without verification.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

## Gates

No gate is modelled on this stream. Every stage exit is still evidence-bound.

## Handoffs

- `incident-recovery-learning-S01-H`: Support and Service → Security and Privacy. Required state: Exit criteria of Detection or report are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `incident-recovery-learning-S02-H`: Security and Privacy → Security and Privacy. Required state: Exit criteria of Triage and severity are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `incident-recovery-learning-S03-H`: Security and Privacy → Finance and Legal. Required state: Exit criteria of Containment are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `incident-recovery-learning-S04-H`: Finance and Legal → Engineering and Delivery. Required state: Exit criteria of Notification are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `incident-recovery-learning-S05-H`: Engineering and Delivery → Security and Privacy. Required state: Exit criteria of Recovery are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `incident-recovery-learning-S06-H`: Security and Privacy → Engineering and Delivery. Required state: Exit criteria of Cause analysis are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `incident-recovery-learning-S07-H`: Engineering and Delivery → People and Organizational Learning. Required state: Exit criteria of Corrective action are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.

## Dependencies

- No cross-stream dependency recorded.

## Refusal and rollback

Refusal conditions:
- Notification is suppressed for reputational reasons.
- A cause analysis is asked to name a person as the root cause.

Rollback and recovery: Reverse the change that caused the incident and re-validate before resuming.

Escalations:
- A stalled stage escalates to the stream stop authority.
- A refused gate escalates to the decision authority named for that gate.

## Measurement

Outcome measures:
- Every incident has a recorded cause and a corrective action with an owner.

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
- Near-misses go unrecorded.
- Corrective actions are closed without verification.

Assumptions:
- No live incidents exist at this stage.

Unknowns:
- What notification obligations apply once districts are live.

Review trigger: Any incident, near-miss, or repeated corrective action.
