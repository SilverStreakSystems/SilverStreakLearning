# Evidence → Claim

Stream id: `evidence-claim`
Authority: **research-candidate** (declared, not derived from implementation)
Operating status: **candidate-internal**
Implementation status: **modeled**
Maturity: current **S0**, target **S2**

All content is synthetic reference architecture. No live operation, no personal data.

## Purpose

Make the exact wording of every claim answerable to specific evidence.

## North star contribution

Keeps the gap between what is known and what is said visible.

## Who this serves

Human beneficiaries:

- Districts and families who rely on accurate statements

Enterprise beneficiaries:

- Governance, Revenue, Legal

## Trigger, entry, exit

Trigger: Someone proposes wording that asserts something about SSLS or its results.

Entry criteria:

- Exact proposed wording exists.
- A purpose and audience are stated.

Exit criteria:

- The claim is approved with limitations, or refused, with the decision recorded.

## Authority separation

- Primary function: Strategy and Governance
- Supporting functions: Research and Intelligence, Finance and Legal, Revenue and Market
- Accountable role candidate: Claims review authority (candidate, not staffed)
- Decision authorities: Strategy and Governance
- Validation authorities: Trust, Quality and Assurance
- Stop authorities: Strategy and Governance, Finance and Legal

## Stages

### 1. Proposed wording

Capture the exact words proposed, not a paraphrase.

- Owner: Revenue and Market
- Entry: Exact wording, audience, and purpose are recorded.
- Exit: The wording is on the record verbatim.
- Required deliverables: None
- Evidence: The wording is on the record verbatim.
- Refusal states: Returned: paraphrase submitted instead of exact wording.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 2. Evidence linkage

Map each assertion in the wording to specific evidence.

- Owner: Research and Intelligence
- Entry: Exact wording exists.
- Exit: Every assertion is linked to evidence, or flagged as unsupported.
- Required deliverables: None
- Evidence: Every assertion is linked to evidence, or flagged as unsupported.
- Refusal states: Refused: assertion has no supporting evidence.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 3. Contradiction review

Look for evidence that contradicts the claim.

- Owner: Research and Intelligence
- Entry: Assertions are linked to evidence.
- Exit: Contradicting evidence is recorded and addressed.
- Required deliverables: None
- Evidence: Contradicting evidence is recorded and addressed.
- Refusal states: Refused: unresolved contradiction.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 4. Limitations and disclaimer

State the boundaries of the claim in the claim itself.

- Owner: Strategy and Governance
- Entry: Contradictions are addressed.
- Exit: Limitations are written into the wording, not appended as fine print.
- Required deliverables: None
- Evidence: Limitations are written into the wording, not appended as fine print.
- Refusal states: Returned: limitations omitted.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 5. Claims review

Review the complete claim against evidence, law, and boundary.

- Owner: Finance and Legal
- Entry: Wording includes its limitations.
- Exit: A review position is recorded.
- Required deliverables: None
- Evidence: A review position is recorded.
- Refusal states: Stopped: legal or boundary objection.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 6. Approval or refusal

Approve or refuse the exact wording.

- Owner: Strategy and Governance
- Entry: Claims review is complete.
- Exit: An approval or a refusal is recorded against the exact wording.
- Required deliverables: None
- Evidence: An approval or a refusal is recorded against the exact wording.
- Refusal states: Refused: claim exceeds evidence. This is a successful outcome.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 7. Effective claim

Publish only the approved wording, in the approved context.

- Owner: Revenue and Market
- Entry: An approval exists for this exact wording.
- Exit: The claim is in use, with its approval and evidence attached.
- Required deliverables: None
- Evidence: The claim is in use, with its approval and evidence attached.
- Refusal states: Withdrawn: wording altered after approval.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 8. Expiry and revalidation

Retire or revalidate the claim before its evidence goes stale.

- Owner: Strategy and Governance
- Entry: The revalidation date has arrived, or evidence has changed.
- Exit: The claim is revalidated, amended, or withdrawn.
- Required deliverables: None
- Evidence: The claim is revalidated, amended, or withdrawn.
- Refusal states: Withdrawn: evidence expired.
- Maximum waiting state: A claim past its revalidation date is withdrawn, not extended by default.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

## Gates

### Contradiction review gate (`evidence-claim-G01`)

Decide whether Evidence → Claim may advance past contradiction review.

- Owner: Research and Intelligence
- Required evidence: Contradicting evidence is recorded and addressed.
- Dispositions available: pass, hold, blocked, refused, revise
- Stop conditions: The wording asserts more than the evidence supports.; Supporting evidence has expired.; The claim implies independent validation that has not occurred.
- Worked example disposition: hold — Illustrative disposition only. No real work has passed this gate.

### Claims review gate (`evidence-claim-G02`)

Decide whether Evidence → Claim may advance past claims review.

- Owner: Finance and Legal
- Required evidence: A review position is recorded.
- Dispositions available: pass, hold, blocked, refused, revise
- Stop conditions: The wording asserts more than the evidence supports.; Supporting evidence has expired.; The claim implies independent validation that has not occurred.
- Worked example disposition: hold — Illustrative disposition only. No real work has passed this gate.

### Approval or refusal gate (`evidence-claim-G03`)

Decide whether Evidence → Claim may advance past approval or refusal.

- Owner: Strategy and Governance
- Required evidence: An approval or a refusal is recorded against the exact wording.
- Dispositions available: pass, hold, blocked, refused, revise
- Stop conditions: The wording asserts more than the evidence supports.; Supporting evidence has expired.; The claim implies independent validation that has not occurred.
- Worked example disposition: hold — Illustrative disposition only. No real work has passed this gate.

## Handoffs

- `evidence-claim-S01-H`: Revenue and Market → Research and Intelligence. Required state: Exit criteria of Proposed wording are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `evidence-claim-S02-H`: Research and Intelligence → Research and Intelligence. Required state: Exit criteria of Evidence linkage are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `evidence-claim-S03-H`: Research and Intelligence → Strategy and Governance. Required state: Exit criteria of Contradiction review are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `evidence-claim-S04-H`: Strategy and Governance → Finance and Legal. Required state: Exit criteria of Limitations and disclaimer are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `evidence-claim-S05-H`: Finance and Legal → Strategy and Governance. Required state: Exit criteria of Claims review are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `evidence-claim-S06-H`: Strategy and Governance → Revenue and Market. Required state: Exit criteria of Approval or refusal are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `evidence-claim-S07-H`: Revenue and Market → Strategy and Governance. Required state: Exit criteria of Effective claim are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.

## Dependencies

- No cross-stream dependency recorded.

## Refusal and rollback

Refusal conditions:

- The wording asserts more than the evidence supports.
- Supporting evidence has expired.
- The claim implies independent validation that has not occurred.

Rollback and recovery: Withdraw the claim, publish the correction, and record a finding.

Escalations:

- A stalled stage escalates to the stream stop authority.
- A refused gate escalates to the decision authority named for that gate.

## Measurement

Outcome measures:

- Approved claims carry expiry and revalidation dates.

Recorded metrics:

- Items waiting beyond their maximum waiting state: undefined
- Items returned for correction: undefined
- Gate dispositions recorded: undefined
- Refusals with a recorded ground: undefined

No metric on this stream measures individual output rate, ranks people, or scores a person.

## Learning loop

Findings from this stream return to: `governance-artifact-lifecycle`.

## Risks, assumptions, unknowns

Risks:

- Marketing language drifts from the approved wording.

Assumptions:

- All current claims are internal only.

Unknowns:

- What review cadence external claims will need.

Review trigger: Evidence expiry, contradiction, or any change to the wording.
