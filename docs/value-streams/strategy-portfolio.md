# Strategy → Portfolio

Stream id: `strategy-portfolio`
Authority: **research-candidate** (declared, not derived from implementation)
Operating status: **candidate-internal**
Implementation status: **modeled**
Maturity: current **S0**, target **S2**

All content is synthetic reference architecture. No live operation, no personal data.

## Purpose

Decide what SSLS will pursue, what it will not pursue, and on what basis.

## North star contribution

Makes direction visible: what was chosen, what was declined, and which evidence supported each.

## Who this serves

Human beneficiaries:

- Educators whose priorities are affected by what SSLS builds

Enterprise beneficiaries:

- Every downstream stream that inherits direction

## Trigger, entry, exit

Trigger: A signal, need, constraint, or opportunity is recorded and reaches strategic review.

Entry criteria:

- A named signal or need exists with a recorded source.
- The signal is within the current governed boundary.

Exit criteria:

- A portfolio commitment or refusal is recorded with rationale and opportunity cost.
- Downstream streams can see what was authorized and what was declined.

## Authority separation

- Primary function: Strategy and Governance
- Supporting functions: Research and Intelligence, Product and Learning Systems, Finance and Legal
- Accountable role candidate: Head of Strategy and Governance (candidate, not staffed)
- Decision authorities: Strategy and Governance
- Validation authorities: Trust, Quality and Assurance
- Stop authorities: Strategy and Governance, Security and Privacy

## Stages

### 1. Signal or need

Capture the signal with its source so it can be traced later.

- Owner: Strategy and Governance
- Entry: A signal is recorded with a named source.
- Exit: The signal is stated as a need or question, with its source attached.
- Required deliverables: None
- Evidence: The signal is stated as a need or question, with its source attached.
- Refusal states: Untraceable signal refused: no source.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 2. Strategic analysis

Understand the need against mission, constraints, and current evidence.

- Owner: Strategy and Governance
- Entry: The need is stated and within the governed boundary.
- Exit: Constraints, risks, and evidence gaps are named.
- Required deliverables: None
- Evidence: Constraints, risks, and evidence gaps are named.
- Refusal states: Out of boundary: analysis stopped and recorded.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 3. Option development

Produce distinct options rather than one predetermined answer.

- Owner: Strategy and Governance
- Entry: Constraints and evidence gaps are recorded.
- Exit: At least two genuinely different options exist, each with cost and consequence.
- Required deliverables: None
- Evidence: At least two genuinely different options exist, each with cost and consequence.
- Refusal states: Single-option submission returned for revision.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 4. Prioritization

Compare options against mission, evidence, capacity, and risk.

- Owner: Strategy and Governance
- Entry: Options are documented with cost and consequence.
- Exit: A recommended option and its opportunity cost are recorded.
- Required deliverables: None
- Evidence: A recommended option and its opportunity cost are recorded.
- Refusal states: Insufficient evidence to compare options.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 5. Decision

Take the portfolio decision under named authority.

- Owner: Strategy and Governance
- Entry: A recommendation exists with recorded opportunity cost.
- Exit: A decision is recorded as accepted, refused, or deferred, with rationale.
- Required deliverables: None
- Evidence: A decision is recorded as accepted, refused, or deferred, with rationale.
- Refusal states: Deferred: decision authority unavailable or evidence stale.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 6. Portfolio commitment

Convert the decision into named, bounded, owned work.

- Owner: Strategy and Governance
- Entry: An accepted decision exists.
- Exit: Committed work is named with an owner and a served object.
- Required deliverables: None
- Evidence: Committed work is named with an owner and a served object.
- Refusal states: Commitment refused: no capacity or no owner.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 7. Review and rebalance

Re-examine commitments as evidence changes, including stopping work.

- Owner: Strategy and Governance
- Entry: A review trigger has fired, or the review interval has elapsed.
- Exit: Each commitment is confirmed, paused, or stopped, with rationale.
- Required deliverables: None
- Evidence: Each commitment is confirmed, paused, or stopped, with rationale.
- Refusal states: Rebalance blocked: outcome evidence missing.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

## Gates

### Decision gate (`strategy-portfolio-G01`)

Decide whether Strategy → Portfolio may advance past decision.

- Owner: Strategy and Governance
- Required evidence: A decision is recorded as accepted, refused, or deferred, with rationale.
- Dispositions available: pass, hold, blocked, refused, revise
- Stop conditions: The signal has no source and cannot be traced.; The option would exceed the current governed boundary.; The evidence base is too thin to prioritize responsibly.
- Worked example disposition: hold — Illustrative disposition only. No real work has passed this gate.

### Review and rebalance gate (`strategy-portfolio-G02`)

Decide whether Strategy → Portfolio may advance past review and rebalance.

- Owner: Strategy and Governance
- Required evidence: Each commitment is confirmed, paused, or stopped, with rationale.
- Dispositions available: pass, hold, blocked, refused, revise
- Stop conditions: The signal has no source and cannot be traced.; The option would exceed the current governed boundary.; The evidence base is too thin to prioritize responsibly.
- Worked example disposition: hold — Illustrative disposition only. No real work has passed this gate.

## Handoffs

- `strategy-portfolio-S01-H`: Strategy and Governance → Strategy and Governance. Required state: Exit criteria of Signal or need are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `strategy-portfolio-S02-H`: Strategy and Governance → Strategy and Governance. Required state: Exit criteria of Strategic analysis are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `strategy-portfolio-S03-H`: Strategy and Governance → Strategy and Governance. Required state: Exit criteria of Option development are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `strategy-portfolio-S04-H`: Strategy and Governance → Strategy and Governance. Required state: Exit criteria of Prioritization are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `strategy-portfolio-S05-H`: Strategy and Governance → Strategy and Governance. Required state: Exit criteria of Decision are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `strategy-portfolio-S06-H`: Strategy and Governance → Strategy and Governance. Required state: Exit criteria of Portfolio commitment are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.

## Dependencies

- No cross-stream dependency recorded.

## Refusal and rollback

Refusal conditions:

- The signal has no source and cannot be traced.
- The option would exceed the current governed boundary.
- The evidence base is too thin to prioritize responsibly.

Rollback and recovery: A portfolio commitment may be paused or stopped by the decision authority; the reversal is recorded as a new decision that supersedes the earlier one.

Escalations:

- A stalled stage escalates to the stream stop authority.
- A refused gate escalates to the decision authority named for that gate.

## Measurement

Outcome measures:

- Portfolio commitments carry recorded rationale and opportunity cost.
- Declined options remain visible with their reason.

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

- Strategy silently becomes product requirement without passing through governance.
- Assumptions are treated as evidence.

Assumptions:

- A single operator can hold strategy and governance at the current scale.

Unknowns:

- What cadence portfolio rebalancing should follow once more than one function exists.

Review trigger: Any material change in boundary, evidence, or capacity.
