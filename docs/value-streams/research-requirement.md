# Research → Requirement

Stream id: `research-requirement`
Authority: **research-candidate** (declared, not derived from implementation)
Operating status: **candidate-internal**
Implementation status: **modeled**
Maturity: current **S0**, target **S2**

All content is synthetic reference architecture. No live operation, no personal data.

## Purpose

Keep the distance between what was found and what is required visible and deliberate.

## North star contribution

Separates source, finding, interpretation, and requirement so nothing is smuggled forward.

## Who this serves

Human beneficiaries:

- Students and educators affected by what SSLS decides is required

Enterprise beneficiaries:

- Product, Learning Design, and Governance

## Trigger, entry, exit

Trigger: A recorded evidence need or research question enters the research queue.

Entry criteria:

- A research question is stated in answerable form.
- The question has a requester and a purpose.

Exit criteria:

- Findings and interpretations are recorded separately.
- A requirement proposal is created or explicitly declined.

## Authority separation

- Primary function: Research and Intelligence
- Supporting functions: Learning Design and Academics, Product and Learning Systems, Strategy and Governance
- Accountable role candidate: Head of Research (candidate, not staffed)
- Decision authorities: Strategy and Governance
- Validation authorities: Trust, Quality and Assurance
- Stop authorities: Strategy and Governance, Security and Privacy

## Stages

### 1. Research question

State an answerable question with a purpose and a requester.

- Owner: Research and Intelligence
- Entry: A requester and purpose are recorded.
- Exit: The question is answerable and bounded.
- Required deliverables: None
- Evidence: The question is answerable and bounded.
- Refusal states: Refused: question is unanswerable as stated.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 2. Source collection

Gather sources with provenance and known limitations.

- Owner: Research and Intelligence
- Entry: An approved research question exists.
- Exit: Sources are recorded with provenance, date, and limitations.
- Required deliverables: None
- Evidence: Sources are recorded with provenance, date, and limitations.
- Refusal states: Refused: source provenance cannot be established.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 3. Evidence review

Assess quality, relevance, and applicability of each source.

- Owner: Research and Intelligence
- Entry: Sources are collected with provenance.
- Exit: Each source has a recorded quality and applicability judgment.
- Required deliverables: None
- Evidence: Each source has a recorded quality and applicability judgment.
- Refusal states: Refused: evidence base too weak to proceed.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 4. Findings

State what the evidence actually shows, without extending it.

- Owner: Research and Intelligence
- Entry: Evidence review is complete.
- Exit: Findings are recorded and bounded to what the evidence supports.
- Required deliverables: None
- Evidence: Findings are recorded and bounded to what the evidence supports.
- Refusal states: Returned: finding exceeds its evidence.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 5. Interpretation

Record what the findings might mean for SSLS, labelled as interpretation.

- Owner: Learning Design and Academics
- Entry: Findings are recorded separately from interpretation.
- Exit: Interpretation is recorded with its uncertainty stated.
- Required deliverables: None
- Evidence: Interpretation is recorded with its uncertainty stated.
- Refusal states: Returned: interpretation presented as finding.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 6. Candidate implication

Name what SSLS could be required to do, and what it should not conclude.

- Owner: Product and Learning Systems
- Entry: An interpretation exists with stated uncertainty.
- Exit: Candidate implications are recorded with their limits.
- Required deliverables: None
- Evidence: Candidate implications are recorded with their limits.
- Refusal states: Refused: implication not supported by findings.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 7. Requirement proposal

Draft the requirement in testable terms.

- Owner: Product and Learning Systems
- Entry: A candidate implication has survived review.
- Exit: A testable requirement proposal exists with its evidence linked.
- Required deliverables: None
- Evidence: A testable requirement proposal exists with its evidence linked.
- Refusal states: Refused: requirement is not testable.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 8. Requirement governance

Give the requirement an authority class, or decline it.

- Owner: Strategy and Governance
- Entry: A testable proposal exists with linked evidence.
- Exit: The requirement carries a declared authority class, or is declined on the record.
- Required deliverables: None
- Evidence: The requirement carries a declared authority class, or is declined on the record.
- Refusal states: Declined: research does not create product authority by itself.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

## Gates

### Evidence review gate (`research-requirement-G01`)

Decide whether Research → Requirement may advance past evidence review.

- Owner: Research and Intelligence
- Required evidence: Each source has a recorded quality and applicability judgment.
- Dispositions available: pass, hold, blocked, refused, revise
- Stop conditions: The question is not answerable with available sources.; The proposed requirement exceeds what the findings support.; Research would require personal data, which the boundary forbids.
- Worked example disposition: hold — Illustrative disposition only. No real work has passed this gate.

### Requirement governance gate (`research-requirement-G02`)

Decide whether Research → Requirement may advance past requirement governance.

- Owner: Strategy and Governance
- Required evidence: The requirement carries a declared authority class, or is declined on the record.
- Dispositions available: pass, hold, blocked, refused, revise
- Stop conditions: The question is not answerable with available sources.; The proposed requirement exceeds what the findings support.; Research would require personal data, which the boundary forbids.
- Worked example disposition: hold — Illustrative disposition only. No real work has passed this gate.

## Handoffs

- `research-requirement-S01-H`: Research and Intelligence → Research and Intelligence. Required state: Exit criteria of Research question are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `research-requirement-S02-H`: Research and Intelligence → Research and Intelligence. Required state: Exit criteria of Source collection are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `research-requirement-S03-H`: Research and Intelligence → Research and Intelligence. Required state: Exit criteria of Evidence review are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `research-requirement-S04-H`: Research and Intelligence → Learning Design and Academics. Required state: Exit criteria of Findings are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `research-requirement-S05-H`: Learning Design and Academics → Product and Learning Systems. Required state: Exit criteria of Interpretation are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `research-requirement-S06-H`: Product and Learning Systems → Product and Learning Systems. Required state: Exit criteria of Candidate implication are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `research-requirement-S07-H`: Product and Learning Systems → Strategy and Governance. Required state: Exit criteria of Requirement proposal are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.

## Dependencies

- No cross-stream dependency recorded.

## Refusal and rollback

Refusal conditions:

- The question is not answerable with available sources.
- The proposed requirement exceeds what the findings support.
- Research would require personal data, which the boundary forbids.

Rollback and recovery: A requirement proposal may be withdrawn when a source is retracted; dependent decisions are re-opened by finding.

Escalations:

- A stalled stage escalates to the stream stop authority.
- A refused gate escalates to the decision authority named for that gate.

## Measurement

Outcome measures:

- Requirements trace to named findings.
- Declined implications are recorded with reasoning.

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

- Research is treated as product authority.
- A single study becomes a general rule.

Assumptions:

- Public and licensed literature is sufficient at the current stage.

Unknowns:

- What threshold of evidence justifies a mandatory requirement.

Review trigger: Source retraction, contradiction, or a new systematic review.
