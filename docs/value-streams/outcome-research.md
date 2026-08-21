# Outcome → Research

Stream id: `outcome-research`
Authority: **research-candidate** (declared, not derived from implementation)
Operating status: **candidate-internal**
Implementation status: **modeled**
Maturity: current **S0**, target **S2**

All content is synthetic reference architecture. No live operation, no personal data.

## Purpose

Make organizational learning a governed stream rather than an intention.

## North star contribution

Turns what actually happened into what SSLS next needs to know.

## Who this serves

Human beneficiaries:

- Future users who benefit from lessons already paid for

Enterprise beneficiaries:

- Research, Strategy, Product

## Trigger, entry, exit

Trigger: An outcome finding, incident lesson, or surprising result is recorded.

Entry criteria:

- A finding or lesson exists with its source.

Exit criteria:

- A research question is queued, or the loop is closed with a recorded reason.

## Authority separation

- Primary function: People and Organizational Learning
- Supporting functions: Research and Intelligence, Strategy and Governance
- Accountable role candidate: Organizational learning lead (candidate, not staffed)
- Decision authorities: Strategy and Governance
- Validation authorities: Trust, Quality and Assurance
- Stop authorities: Strategy and Governance

## Stages

### 1. Finding intake

Take in findings and lessons from every stream.

- Owner: People and Organizational Learning
- Entry: A finding or lesson exists with a source.
- Exit: The lesson is recorded with its origin.
- Required deliverables: None
- Evidence: The lesson is recorded with its origin.
- Refusal states: Refused: anecdote without a traceable source.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 2. Pattern review

Look for repeated patterns rather than one-off events.

- Owner: People and Organizational Learning
- Entry: Lessons are recorded.
- Exit: Patterns and single events are distinguished.
- Required deliverables: None
- Evidence: Patterns and single events are distinguished.
- Refusal states: Held: insufficient history to identify a pattern.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 3. Question formulation

Turn the pattern into an answerable research question.

- Owner: Research and Intelligence
- Entry: A pattern or significant event is identified.
- Exit: An answerable question exists, naming its originating finding.
- Required deliverables: None
- Evidence: An answerable question exists, naming its originating finding.
- Refusal states: Refused: question unanswerable within the boundary.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 4. Prioritization

Decide which questions enter the research queue.

- Owner: Strategy and Governance
- Entry: Questions are formulated.
- Exit: Questions are queued, deferred, or closed, each with a reason.
- Required deliverables: None
- Evidence: Questions are queued, deferred, or closed, each with a reason.
- Refusal states: Closed with reason recorded. This is a valid outcome.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 5. Loop closure

Confirm the originating finding has an outcome recorded against it.

- Owner: People and Organizational Learning
- Entry: A queue decision exists.
- Exit: The originating finding shows what happened to it.
- Required deliverables: None
- Evidence: The originating finding shows what happened to it.
- Refusal states: Escalated: finding has no recorded outcome after its review interval.
- Maximum waiting state: A finding with no recorded outcome after one review cycle escalates.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

## Gates

### Pattern review gate (`outcome-research-G01`)

Decide whether Outcome → Research may advance past pattern review.

- Owner: People and Organizational Learning
- Required evidence: Patterns and single events are distinguished.
- Dispositions available: pass, hold, blocked, refused, revise
- Stop conditions: The lesson is anecdotal and cannot be traced to a source.; The question cannot be answered within the governed boundary.
- Worked example disposition: hold — Illustrative disposition only. No real work has passed this gate.

## Handoffs

- `outcome-research-S01-H`: People and Organizational Learning → People and Organizational Learning. Required state: Exit criteria of Finding intake are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `outcome-research-S02-H`: People and Organizational Learning → Research and Intelligence. Required state: Exit criteria of Pattern review are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `outcome-research-S03-H`: Research and Intelligence → Strategy and Governance. Required state: Exit criteria of Question formulation are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `outcome-research-S04-H`: Strategy and Governance → People and Organizational Learning. Required state: Exit criteria of Prioritization are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.

## Dependencies

- No cross-stream dependency recorded.

## Refusal and rollback

Refusal conditions:

- The lesson is anecdotal and cannot be traced to a source.
- The question cannot be answered within the governed boundary.

Rollback and recovery: Withdraw a queued question when its originating finding is retracted.

Escalations:

- A stalled stage escalates to the stream stop authority.
- A refused gate escalates to the decision authority named for that gate.

## Measurement

Outcome measures:

- Findings either produce a question or a recorded reason for closure.

Recorded metrics:

- Items waiting beyond their maximum waiting state: undefined
- Items returned for correction: undefined
- Gate dispositions recorded: undefined
- Refusals with a recorded ground: undefined

No metric on this stream measures individual output rate, ranks people, or scores a person.

## Learning loop

Findings from this stream return to: `research-requirement`.

## Risks, assumptions, unknowns

Risks:

- Lessons recorded but never acted on.

Assumptions:

- Learning must be scheduled, not incidental.

Unknowns:

- What review cadence keeps the loop alive with one operator.

Review trigger: Each learning review cycle, or a retracted originating finding.
