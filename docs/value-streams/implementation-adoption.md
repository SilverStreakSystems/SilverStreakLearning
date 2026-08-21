# Implementation → Adoption

Stream id: `implementation-adoption`
Authority: **research-candidate** (declared, not derived from implementation)
Operating status: **candidate-internal**
Implementation status: **modeled**
Maturity: current **S0**, target **S2**

All content is synthetic reference architecture. No live operation, no personal data.

## Purpose

Distinguish access from actual use and actual usefulness.

## North star contribution

Shows whether people can actually use the thing, not just whether it exists.

## Who this serves

Human beneficiaries:
- Teachers and staff whose daily work the system touches

Enterprise beneficiaries:
- Support, Product, Learning Design

## Trigger, entry, exit

Trigger: A deployment goes live.

Entry criteria:
- Go-live is recorded and support is available.

Exit criteria:
- Sustained use, or a recorded finding explaining non-adoption.

## Authority separation

- Primary function: Customer and Implementation
- Supporting functions: Support and Service, Product and Learning Systems, Experience and Accessibility, Learning Design and Academics
- Accountable role candidate: Adoption lead (candidate, not staffed)
- Decision authorities: Customer and Implementation
- Validation authorities: Trust, Quality and Assurance
- Stop authorities: Security and Privacy, Strategy and Governance

## Stages

### 1. Initial use

Observe first real use and what gets in the way.

- Owner: Support and Service
- Entry: Go-live is recorded.
- Exit: First-use observations are recorded.
- Required deliverables: None
- Evidence: First-use observations are recorded.
- Refusal states: Refused: observation would require individual surveillance.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 2. Barrier identification

Name barriers as system problems with owners.

- Owner: Support and Service
- Entry: First-use observations exist.
- Exit: Each barrier has a cause hypothesis and an owner.
- Required deliverables: None
- Evidence: Each barrier has a cause hypothesis and an owner.
- Refusal states: Returned: barrier attributed to user rather than system.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 3. Support and correction

Resolve what support can resolve, and escalate the rest.

- Owner: Support and Service
- Entry: Barriers have owners.
- Exit: Resolvable barriers are addressed; the rest are escalated.
- Required deliverables: None
- Evidence: Resolvable barriers are addressed; the rest are escalated.
- Refusal states: Escalated: barrier requires a product decision.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 4. Practice integration

Fit the tool into real workflows rather than adding a parallel one.

- Owner: Customer and Implementation
- Entry: Support-resolvable barriers are addressed.
- Exit: Use is integrated into existing practice, or the mismatch is recorded.
- Required deliverables: None
- Evidence: Use is integrated into existing practice, or the mismatch is recorded.
- Refusal states: Recorded: tool creates duplicate work; escalated to product.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 5. Sustained use review

Review whether use persists and whether it helps.

- Owner: Customer and Implementation
- Entry: Integration is attempted.
- Exit: Sustained use, or a recorded cause of non-adoption.
- Required deliverables: None
- Evidence: Sustained use, or a recorded cause of non-adoption.
- Refusal states: Refused: measurement would rank individual staff.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 6. Adoption disposition

Record adoption status honestly, including failure.

- Owner: Customer and Implementation
- Entry: A sustained-use review is complete.
- Exit: Adoption status is recorded with its cause and next action.
- Required deliverables: None
- Evidence: Adoption status is recorded with its cause and next action.
- Refusal states: Recorded non-adoption with cause. This is a valid outcome.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

## Gates

### Sustained use review gate (`implementation-adoption-G01`)

Decide whether Implementation → Adoption may advance past sustained use review.

- Owner: Customer and Implementation
- Required evidence: Sustained use, or a recorded cause of non-adoption.
- Dispositions available: pass, hold, blocked, refused, revise
- Stop conditions: Adoption would require surveillance-style measurement of staff.; Barriers are structural and cannot be resolved by support.
- Worked example disposition: hold — Illustrative disposition only. No real work has passed this gate.

### Adoption disposition gate (`implementation-adoption-G02`)

Decide whether Implementation → Adoption may advance past adoption disposition.

- Owner: Customer and Implementation
- Required evidence: Adoption status is recorded with its cause and next action.
- Dispositions available: pass, hold, blocked, refused, revise
- Stop conditions: Adoption would require surveillance-style measurement of staff.; Barriers are structural and cannot be resolved by support.
- Worked example disposition: hold — Illustrative disposition only. No real work has passed this gate.

## Handoffs

- `implementation-adoption-S01-H`: Support and Service → Support and Service. Required state: Exit criteria of Initial use are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `implementation-adoption-S02-H`: Support and Service → Support and Service. Required state: Exit criteria of Barrier identification are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `implementation-adoption-S03-H`: Support and Service → Customer and Implementation. Required state: Exit criteria of Support and correction are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `implementation-adoption-S04-H`: Customer and Implementation → Customer and Implementation. Required state: Exit criteria of Practice integration are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `implementation-adoption-S05-H`: Customer and Implementation → Customer and Implementation. Required state: Exit criteria of Sustained use review are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.

## Dependencies

- No cross-stream dependency recorded.

## Refusal and rollback

Refusal conditions:
- Adoption would require surveillance-style measurement of staff.
- Barriers are structural and cannot be resolved by support.

Rollback and recovery: Reduce scope of use, restore prior practice, and record the reason.

Escalations:
- A stalled stage escalates to the stream stop authority.
- A refused gate escalates to the decision authority named for that gate.

## Measurement

Outcome measures:
- Barriers are named with owners.
- Support burden is recorded rather than absorbed silently.

Recorded metrics:
- Items waiting beyond their maximum waiting state: undefined
- Items returned for correction: undefined
- Gate dispositions recorded: undefined
- Refusals with a recorded ground: undefined

No metric on this stream measures individual output rate, ranks people, or scores a person.

## Learning loop

Findings from this stream return to: `feedback-decision`.

## Risks, assumptions, unknowns

Risks:
- Measuring individuals rather than the system.
- Reading login counts as adoption.

Assumptions:
- Adoption is a shared responsibility, not solely the customer's.

Unknowns:
- What sustained use looks like in low-incidence programs.

Review trigger: Sharp change in use, or an unresolved barrier.
