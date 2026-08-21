# AI Capability Lifecycle (gated future)

Stream id: `ai-capability-lifecycle`
Authority: **gated-future** (declared, not derived from implementation)
Operating status: **gated-future**
Implementation status: **not-implemented**
Maturity: current **S0**, target **S2**

All content is synthetic reference architecture. No live operation, no personal data.

## Purpose

Define in advance the gates any AI capability must pass before it could ever be considered.

## North star contribution

States the conditions for trust before any AI capability exists, not after.

## Who this serves

Human beneficiaries:

- Students and educators who would be subject to AI-influenced decisions

Enterprise beneficiaries:

- Governance, Security and Privacy, Quality

## Trigger, entry, exit

Trigger: A future AI capability is proposed. No such proposal is authorized today.

Entry criteria:

- The AI trigger gate has been formally opened by a governed decision. It has not been.
- A human-decision boundary is defined for the proposed capability.

Exit criteria:

- The capability is authorized under continuous oversight, or refused.

## Authority separation

- Primary function: Data and Measurement
- Supporting functions: Security and Privacy, Trust, Quality and Assurance, Learning Design and Academics, Strategy and Governance
- Accountable role candidate: AI governance authority (candidate, not staffed, gate closed)
- Decision authorities: Strategy and Governance
- Validation authorities: Trust, Quality and Assurance
- Stop authorities: Security and Privacy, Strategy and Governance, Trust, Quality and Assurance

## Stages

### 1. Gate check

Confirm whether the AI trigger gate is open. Today it is not.

- Owner: Strategy and Governance
- Entry: A proposal referencing AI exists.
- Exit: The gate state is recorded. A closed gate ends the stream here.
- Required deliverables: None
- Evidence: The gate state is recorded. A closed gate ends the stream here.
- Refusal states: Blocked: AI trigger gate is closed.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 2. Purpose and boundary

Define what the capability may and may not influence.

- Owner: Strategy and Governance
- Entry: The gate is open.
- Exit: The human-decision boundary is written and approved.
- Required deliverables: None
- Evidence: The human-decision boundary is written and approved.
- Refusal states: Refused: capability would shape a decision about a person without human authority.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 3. Risk and harm assessment

Assess harm to the people the capability would touch.

- Owner: Security and Privacy
- Entry: A boundary is approved.
- Exit: Harms, failure modes, and affected groups are recorded.
- Required deliverables: None
- Evidence: Harms, failure modes, and affected groups are recorded.
- Refusal states: Refused: failure modes are not human-detectable.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 4. Human oversight design

Design oversight that a real person can actually perform.

- Owner: Experience and Accessibility
- Entry: Harms and failure modes are recorded.
- Exit: An oversight plan exists that is workable within real workload.
- Required deliverables: None
- Evidence: An oversight plan exists that is workable within real workload.
- Refusal states: Refused: oversight is nominal rather than real.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 5. Independent validation

Validate behaviour on the intended population.

- Owner: Trust, Quality and Assurance
- Entry: An oversight plan exists.
- Exit: Validation results are recorded per subgroup, with limits.
- Required deliverables: None
- Evidence: Validation results are recorded per subgroup, with limits.
- Refusal states: Refused: performance not evidenced for the intended population.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 6. Authorization

Authorize under continuous oversight, or refuse.

- Owner: Strategy and Governance
- Entry: Independent validation is complete.
- Exit: A recorded authorization with oversight conditions, or a refusal.
- Required deliverables: None
- Evidence: A recorded authorization with oversight conditions, or a refusal.
- Refusal states: Refused: conditions for trust not met.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 7. Continuous oversight and disablement

Monitor in use and disable immediately on harm.

- Owner: Security and Privacy
- Entry: The capability is authorized.
- Exit: Oversight findings are recorded each cycle.
- Required deliverables: None
- Evidence: Oversight findings are recorded each cycle.
- Refusal states: Disabled immediately on evidence of harm. No committee required.
- Maximum waiting state: Suspected harm triggers disablement first and review second.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

## Gates

### Gate check gate (`ai-capability-lifecycle-G01`)

Decide whether AI Capability Lifecycle (gated future) may advance past gate check.

- Owner: Strategy and Governance
- Required evidence: The gate state is recorded. A closed gate ends the stream here.
- Dispositions available: blocked, refused
- Stop conditions: The AI trigger gate is closed. This is the current state and blocks every stage.; The capability would make or strongly shape a decision about a person without human authority.; Failure modes cannot be detected by a human reviewer.
- Worked example disposition: blocked — The AI trigger gate is closed, so no AI capability may advance.

### Authorization gate (`ai-capability-lifecycle-G02`)

Decide whether AI Capability Lifecycle (gated future) may advance past authorization.

- Owner: Strategy and Governance
- Required evidence: A recorded authorization with oversight conditions, or a refusal.
- Dispositions available: blocked, refused
- Stop conditions: The AI trigger gate is closed. This is the current state and blocks every stage.; The capability would make or strongly shape a decision about a person without human authority.; Failure modes cannot be detected by a human reviewer.
- Worked example disposition: blocked — The AI trigger gate is closed, so no AI capability may advance.

## Handoffs

- `ai-capability-lifecycle-S01-H`: Strategy and Governance → Strategy and Governance. Required state: Exit criteria of Gate check are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `ai-capability-lifecycle-S02-H`: Strategy and Governance → Security and Privacy. Required state: Exit criteria of Purpose and boundary are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `ai-capability-lifecycle-S03-H`: Security and Privacy → Experience and Accessibility. Required state: Exit criteria of Risk and harm assessment are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `ai-capability-lifecycle-S04-H`: Experience and Accessibility → Trust, Quality and Assurance. Required state: Exit criteria of Human oversight design are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `ai-capability-lifecycle-S05-H`: Trust, Quality and Assurance → Strategy and Governance. Required state: Exit criteria of Independent validation are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `ai-capability-lifecycle-S06-H`: Strategy and Governance → Security and Privacy. Required state: Exit criteria of Authorization are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.

## Dependencies

- No cross-stream dependency recorded.

## Refusal and rollback

Refusal conditions:

- The AI trigger gate is closed. This is the current state and blocks every stage.
- The capability would make or strongly shape a decision about a person without human authority.
- Failure modes cannot be detected by a human reviewer.

Rollback and recovery: Disable the capability immediately; disablement requires no committee.

Escalations:

- A stalled stage escalates to the stream stop authority.
- A refused gate escalates to the decision authority named for that gate.

## Measurement

Outcome measures:

- No AI capability advances without a recorded gate opening.

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

- Gate opened implicitly by building an AI feature first.

Assumptions:

- No AI capability exists in SSLS today.

Unknowns:

- What evidence standard would justify opening the gate.

Review trigger: Any proposal referencing AI, model output, or automated inference.
