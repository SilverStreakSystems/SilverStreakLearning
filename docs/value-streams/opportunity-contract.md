# Opportunity → Contract

Stream id: `opportunity-contract`
Authority: **research-candidate** (declared, not derived from implementation)
Operating status: **candidate-internal**
Implementation status: **modeled**
Maturity: current **S0**, target **S2**

All content is synthetic reference architecture. No live operation, no personal data.

## Purpose

Ensure what is promised is what SSLS can actually deliver and has evidence for.

## North star contribution

Prevents commitments that outrun capability, capacity, or evidence.

## Who this serves

Human beneficiaries:
- Educators who would otherwise inherit an oversold promise

Enterprise beneficiaries:
- Implementation, Support, Finance and Legal

## Trigger, entry, exit

Trigger: A district or partner expresses interest, or a qualified need is identified.

Entry criteria:
- A named opportunity exists with a recorded need and context.

Exit criteria:
- A signed scope with obligations exists, or the opportunity is declined on the record.

## Authority separation

- Primary function: Revenue and Market
- Supporting functions: Customer and Implementation, Finance and Legal, Security and Privacy
- Accountable role candidate: Head of Revenue (candidate, not staffed)
- Decision authorities: Revenue and Market
- Validation authorities: Trust, Quality and Assurance
- Stop authorities: Finance and Legal, Security and Privacy, Strategy and Governance

## Stages

### 1. Opportunity identified

Record the opportunity with its stated need and context.

- Owner: Revenue and Market
- Entry: A named organization and stated need exist.
- Exit: The opportunity is recorded with context and constraints.
- Required deliverables: None
- Evidence: The opportunity is recorded with context and constraints.
- Refusal states: Refused: outside the governed boundary.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 2. Need qualification

Test whether SSLS can honestly serve the need.

- Owner: Revenue and Market
- Entry: The opportunity is recorded.
- Exit: Fit and gaps are stated plainly.
- Required deliverables: None
- Evidence: Fit and gaps are stated plainly.
- Refusal states: Refused: need exceeds current capability.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 3. Capability and capacity check

Confirm both ability and available capacity.

- Owner: Enterprise Operations
- Entry: Fit and gaps are stated.
- Exit: Capacity to deliver is confirmed or denied, with risks recorded.
- Required deliverables: None
- Evidence: Capacity to deliver is confirmed or denied, with risks recorded.
- Refusal states: Refused: no capacity to deliver responsibly.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 4. Proposal and claims review

Ensure the proposal only asserts approved claims.

- Owner: Strategy and Governance
- Entry: Capacity is confirmed.
- Exit: Every asserted capability maps to an approved claim.
- Required deliverables: None
- Evidence: Every asserted capability maps to an approved claim.
- Refusal states: Refused: proposal contains an unapproved claim.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 5. Negotiation and obligations

Make each obligation explicit, owned, and deliverable.

- Owner: Finance and Legal
- Entry: The proposal passed claims review.
- Exit: Obligations are listed with owners and dates.
- Required deliverables: None
- Evidence: Obligations are listed with owners and dates.
- Refusal states: Stopped: obligation without a delivery owner.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 6. Signature and scope baseline

Record the agreed scope as the baseline for delivery.

- Owner: Finance and Legal
- Entry: Obligations are agreed and owned.
- Exit: A scope baseline and obligation register exist.
- Required deliverables: None
- Evidence: A scope baseline and obligation register exist.
- Refusal states: Refused: legal objection recorded.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 7. Handoff to implementation

Transfer scope, obligations, and context to delivery.

- Owner: Customer and Implementation
- Entry: A scope baseline exists.
- Exit: Implementation accepts the handoff explicitly.
- Required deliverables: None
- Evidence: Implementation accepts the handoff explicitly.
- Refusal states: Handoff refused: context incomplete.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

## Gates

### Proposal and claims review gate (`opportunity-contract-G01`)

Decide whether Opportunity → Contract may advance past proposal and claims review.

- Owner: Strategy and Governance
- Required evidence: Every asserted capability maps to an approved claim.
- Dispositions available: pass, hold, blocked, refused, revise
- Stop conditions: The requested scope exceeds current capability.; The buyer requires a claim SSLS cannot support with evidence.; Delivery would require personal data outside the governed boundary.
- Worked example disposition: hold — Illustrative disposition only. No real work has passed this gate.

### Signature and scope baseline gate (`opportunity-contract-G02`)

Decide whether Opportunity → Contract may advance past signature and scope baseline.

- Owner: Finance and Legal
- Required evidence: A scope baseline and obligation register exist.
- Dispositions available: pass, hold, blocked, refused, revise
- Stop conditions: The requested scope exceeds current capability.; The buyer requires a claim SSLS cannot support with evidence.; Delivery would require personal data outside the governed boundary.
- Worked example disposition: hold — Illustrative disposition only. No real work has passed this gate.

## Handoffs

- `opportunity-contract-S01-H`: Revenue and Market → Revenue and Market. Required state: Exit criteria of Opportunity identified are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `opportunity-contract-S02-H`: Revenue and Market → Enterprise Operations. Required state: Exit criteria of Need qualification are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `opportunity-contract-S03-H`: Enterprise Operations → Strategy and Governance. Required state: Exit criteria of Capability and capacity check are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `opportunity-contract-S04-H`: Strategy and Governance → Finance and Legal. Required state: Exit criteria of Proposal and claims review are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `opportunity-contract-S05-H`: Finance and Legal → Finance and Legal. Required state: Exit criteria of Negotiation and obligations are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `opportunity-contract-S06-H`: Finance and Legal → Customer and Implementation. Required state: Exit criteria of Signature and scope baseline are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.

## Dependencies

- No cross-stream dependency recorded.

## Refusal and rollback

Refusal conditions:
- The requested scope exceeds current capability.
- The buyer requires a claim SSLS cannot support with evidence.
- Delivery would require personal data outside the governed boundary.

Rollback and recovery: Withdraw the proposal or renegotiate scope; record the reason as a decision.

Escalations:
- A stalled stage escalates to the stream stop authority.
- A refused gate escalates to the decision authority named for that gate.

## Measurement

Outcome measures:
- Declined opportunities are recorded with reasons.
- Obligations are explicit before signature.

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
- Sales language exceeding approved claims.
- Obligations accepted without a delivery owner.

Assumptions:
- No live opportunities exist at this stage; this stream is reference architecture.

Unknowns:
- What contracting patterns small districts will actually require.

Review trigger: Any scope change or claim change during negotiation.
