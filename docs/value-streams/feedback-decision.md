# Feedback → Decision

Stream id: `feedback-decision`
Authority: **research-candidate** (declared, not derived from implementation)
Operating status: **candidate-internal**
Implementation status: **modeled**
Maturity: current **S0**, target **S2**

All content is synthetic reference architecture. No live operation, no personal data.

## Purpose

Ensure feedback is answered, even when the answer is no.

## North star contribution

Shows people what happened to what they said.

## Who this serves

Human beneficiaries:
- Users who took the time to report a problem

Enterprise beneficiaries:
- Product, Support, Governance

## Trigger, entry, exit

Trigger: Feedback is submitted or observed.

Entry criteria:
- A feedback item exists with its source and context.

Exit criteria:
- A recorded disposition exists and the originator can see it.

## Authority separation

- Primary function: Product and Learning Systems
- Supporting functions: Support and Service, Experience and Accessibility, Strategy and Governance
- Accountable role candidate: Feedback triage owner (candidate, not staffed)
- Decision authorities: Product and Learning Systems
- Validation authorities: Trust, Quality and Assurance
- Stop authorities: Strategy and Governance

## Stages

### 1. Feedback intake

Record the feedback with its source and context.

- Owner: Support and Service
- Entry: Feedback exists with a source.
- Exit: The feedback is recorded verbatim with context.
- Required deliverables: None
- Evidence: The feedback is recorded verbatim with context.
- Refusal states: Refused: unattributable feedback recorded as a signal only.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 2. Classification

Distinguish defect, barrier, request, and misunderstanding.

- Owner: Support and Service
- Entry: Feedback is recorded.
- Exit: The feedback is classified with reasoning.
- Required deliverables: None
- Evidence: The feedback is classified with reasoning.
- Refusal states: Returned: classification not supported by the content.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 3. Impact assessment

Assess who is affected and how badly, including who is not represented.

- Owner: Product and Learning Systems
- Entry: Feedback is classified.
- Exit: Affected groups and severity are recorded, including unheard groups.
- Required deliverables: None
- Evidence: Affected groups and severity are recorded, including unheard groups.
- Refusal states: Held: impact unclear without more information.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 4. Disposition decision

Decide accept, defer, refuse, or route, with a reason.

- Owner: Product and Learning Systems
- Entry: Impact is assessed.
- Exit: A disposition with a reason and a decider is recorded.
- Required deliverables: None
- Evidence: A disposition with a reason and a decider is recorded.
- Refusal states: Refused with reason recorded. This is a valid outcome.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 5. Routing

Send accepted items into the requirement or build stream.

- Owner: Product and Learning Systems
- Entry: A disposition exists.
- Exit: Accepted items are routed with their originating feedback attached.
- Required deliverables: None
- Evidence: Accepted items are routed with their originating feedback attached.
- Refusal states: Blocked: no receiving stream will accept the item.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 6. Response to originator

Tell the person what happened to their feedback.

- Owner: Support and Service
- Entry: A disposition is recorded.
- Exit: The originator can see the outcome and its reason.
- Required deliverables: None
- Evidence: The originator can see the outcome and its reason.
- Refusal states: Escalated: no response sent within the review interval.
- Maximum waiting state: Feedback with no response after one review cycle escalates.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

## Gates

### Disposition decision gate (`feedback-decision-G01`)

Decide whether Feedback → Decision may advance past disposition decision.

- Owner: Product and Learning Systems
- Required evidence: A disposition with a reason and a decider is recorded.
- Dispositions available: pass, hold, blocked, refused, revise
- Stop conditions: Acting on the feedback would harm another user group.; The request would exceed the governed boundary.
- Worked example disposition: hold — Illustrative disposition only. No real work has passed this gate.

## Handoffs

- `feedback-decision-S01-H`: Support and Service → Support and Service. Required state: Exit criteria of Feedback intake are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `feedback-decision-S02-H`: Support and Service → Product and Learning Systems. Required state: Exit criteria of Classification are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `feedback-decision-S03-H`: Product and Learning Systems → Product and Learning Systems. Required state: Exit criteria of Impact assessment are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `feedback-decision-S04-H`: Product and Learning Systems → Product and Learning Systems. Required state: Exit criteria of Disposition decision are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `feedback-decision-S05-H`: Product and Learning Systems → Support and Service. Required state: Exit criteria of Routing are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.

## Dependencies

- No cross-stream dependency recorded.

## Refusal and rollback

Refusal conditions:
- Acting on the feedback would harm another user group.
- The request would exceed the governed boundary.

Rollback and recovery: Reopen a disposition when new evidence contradicts the reason given.

Escalations:
- A stalled stage escalates to the stream stop authority.
- A refused gate escalates to the decision authority named for that gate.

## Measurement

Outcome measures:
- No feedback item closes without a recorded reason.

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
- Loudest voice prioritized over widest need.
- Silent closure of inconvenient feedback.

Assumptions:
- Feedback volume is currently zero; this is reference architecture.

Unknowns:
- What response time is fair once districts are live.

Review trigger: Repeated feedback on the same subject.
