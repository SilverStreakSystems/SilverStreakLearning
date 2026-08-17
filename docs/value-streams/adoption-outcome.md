# Adoption → Outcome

Stream id: `adoption-outcome`
Authority: **research-candidate** (declared, not derived from implementation)
Operating status: **candidate-internal**
Implementation status: **modeled**
Maturity: current **S0**, target **S2**

All content is synthetic reference architecture. No live operation, no personal data.

## Purpose

Keep the distance between use, association, and causal claim explicit.

## North star contribution

Makes uncertainty about impact visible instead of hiding it behind a number.

## Who this serves

Human beneficiaries:
- Students whose outcomes are the point of the work

Enterprise beneficiaries:
- Research, Governance, Product

## Trigger, entry, exit

Trigger: Sustained use exists long enough for outcomes to be examined.

Entry criteria:
- Sustained use is recorded.
- An intended outcome was defined in advance.

Exit criteria:
- An outcome finding exists with its confidence and limits stated.

## Authority separation

- Primary function: Data and Measurement
- Supporting functions: Research and Intelligence, Learning Design and Academics, Trust, Quality and Assurance
- Accountable role candidate: Head of Data and Measurement (candidate, not staffed)
- Decision authorities: Strategy and Governance
- Validation authorities: Trust, Quality and Assurance
- Stop authorities: Security and Privacy, Strategy and Governance

## Stages

### 1. Outcome question

State the outcome question that was intended in advance.

- Owner: Data and Measurement
- Entry: An intended outcome was defined before use began.
- Exit: An answerable outcome question is recorded.
- Required deliverables: None
- Evidence: An answerable outcome question is recorded.
- Refusal states: Refused: outcome defined after the fact.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 2. Measure definition

Define measures that do not harm or surveil.

- Owner: Data and Measurement
- Entry: An outcome question exists.
- Exit: Measures are defined with their limits and exclusions.
- Required deliverables: None
- Evidence: Measures are defined with their limits and exclusions.
- Refusal states: Refused: measure would rank or surveil individuals.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 3. Data sufficiency

Check whether the available data can answer the question at all.

- Owner: Data and Measurement
- Entry: Measures are defined.
- Exit: Sufficiency is confirmed, or insufficiency is recorded.
- Required deliverables: None
- Evidence: Sufficiency is confirmed, or insufficiency is recorded.
- Refusal states: Refused: data insufficient. Recorded, not worked around.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 4. Analysis

Analyze with confounds and alternatives explicitly considered.

- Owner: Data and Measurement
- Entry: Data sufficiency is confirmed.
- Exit: Results exist with confounds and alternatives recorded.
- Required deliverables: None
- Evidence: Results exist with confounds and alternatives recorded.
- Refusal states: Halted: analysis would require out-of-boundary data.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 5. Interpretation and limits

State what the result supports and what it cannot.

- Owner: Research and Intelligence
- Entry: Analysis results exist.
- Exit: An interpretation with confidence and limits is recorded.
- Required deliverables: None
- Evidence: An interpretation with confidence and limits is recorded.
- Refusal states: Returned: causal language on associational evidence.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 6. Outcome finding

Record the finding and route it, without creating a claim.

- Owner: Data and Measurement
- Entry: Interpretation is recorded with its limits.
- Exit: The finding is recorded and routed to research and governance.
- Required deliverables: None
- Evidence: The finding is recorded and routed to research and governance.
- Refusal states: Refused: attempt to publish a claim directly from this stage.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

## Gates

No gate is modelled on this stream. Every stage exit is still evidence-bound.

## Handoffs

- `adoption-outcome-S01-H`: Data and Measurement → Data and Measurement. Required state: Exit criteria of Outcome question are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `adoption-outcome-S02-H`: Data and Measurement → Data and Measurement. Required state: Exit criteria of Measure definition are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `adoption-outcome-S03-H`: Data and Measurement → Data and Measurement. Required state: Exit criteria of Data sufficiency are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `adoption-outcome-S04-H`: Data and Measurement → Research and Intelligence. Required state: Exit criteria of Analysis are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `adoption-outcome-S05-H`: Research and Intelligence → Data and Measurement. Required state: Exit criteria of Interpretation and limits are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.

## Dependencies

- No cross-stream dependency recorded.

## Refusal and rollback

Refusal conditions:
- The data cannot support the outcome question asked.
- Analysis would require identifiable student data outside the boundary.
- The intended outcome was never defined in advance.

Rollback and recovery: Withdraw the outcome finding and any claim resting on it; record the retraction.

Escalations:
- A stalled stage escalates to the stream stop authority.
- A refused gate escalates to the decision authority named for that gate.

## Measurement

Outcome measures:
- Outcome findings state their confidence and their limits.

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
- Outcome findings converted directly into marketing claims.

Assumptions:
- No real outcome data exists at this stage.

Unknowns:
- What outcome measures are defensible for low-incidence populations.

Review trigger: New data, contradictory result, or a claim request resting on this finding.
