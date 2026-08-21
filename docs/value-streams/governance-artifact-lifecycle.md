# Governance Artifact → Promotion / Supersession

Stream id: `governance-artifact-lifecycle`
Authority: **research-candidate** (declared, not derived from implementation)
Operating status: **candidate-internal**
Implementation status: **modeled**
Maturity: current **S0**, target **S2**

All content is synthetic reference architecture. No live operation, no personal data.

## Purpose

Ensure the governing record itself is versioned, reviewed, and never silently replaced.

## North star contribution

Makes it clear which document governs today and which one used to.

## Who this serves

Human beneficiaries:

- Anyone who must follow the current rule rather than an old one

Enterprise beneficiaries:

- Every function that relies on standing rules

## Trigger, entry, exit

Trigger: A governance artifact is drafted, revised, or challenged.

Entry criteria:

- A draft or revision exists with a named author and purpose.

Exit criteria:

- The artifact carries a declared authority class, or is retired and superseded.

## Authority separation

- Primary function: Strategy and Governance
- Supporting functions: Research and Intelligence, Security and Privacy, Finance and Legal
- Accountable role candidate: Governance architect (candidate, not staffed)
- Decision authorities: Strategy and Governance
- Validation authorities: Trust, Quality and Assurance
- Stop authorities: Strategy and Governance

## Stages

### 1. Draft

Create the artifact with an author, purpose, and scope.

- Owner: Strategy and Governance
- Entry: An author and purpose are recorded.
- Exit: A draft exists, marked as draft.
- Required deliverables: None
- Evidence: A draft exists, marked as draft.
- Refusal states: Refused: no owner willing to hold the artifact.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 2. Review

Review the draft against evidence and practice.

- Owner: Research and Intelligence
- Entry: A draft exists.
- Exit: Review comments and findings are recorded.
- Required deliverables: None
- Evidence: Review comments and findings are recorded.
- Refusal states: Returned for revision with named findings.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 3. Conflict check

Check the draft against every current governing artifact.

- Owner: Strategy and Governance
- Entry: Review is complete.
- Exit: Conflicts are named and resolved, or the draft is held.
- Required deliverables: None
- Evidence: Conflicts are named and resolved, or the draft is held.
- Refusal states: Held: unresolved conflict with a current standard.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 4. Authority decision

Assign an authority class, or decline the artifact.

- Owner: Strategy and Governance
- Entry: Conflicts are resolved.
- Exit: An authority class is declared and recorded.
- Required deliverables: None
- Evidence: An authority class is declared and recorded.
- Refusal states: Declined: artifact does not warrant governing authority.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 5. Current and approved

Publish the artifact as current within its scope.

- Owner: Strategy and Governance
- Entry: An authority class has been declared.
- Exit: The artifact is current and discoverable, with its scope stated.
- Required deliverables: None
- Evidence: The artifact is current and discoverable, with its scope stated.
- Refusal states: Blocked: scope ambiguous.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 6. Monitoring

Watch for drift between the artifact and actual practice.

- Owner: Enterprise Operations
- Entry: The artifact is current.
- Exit: Drift and conflicts are recorded as findings.
- Required deliverables: None
- Evidence: Drift and conflicts are recorded as findings.
- Refusal states: Escalated: practice contradicts a current rule.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 7. Revision

Revise the artifact with version history preserved.

- Owner: Strategy and Governance
- Entry: A finding or review trigger requires change.
- Exit: A new version exists with the change reasoned on the record.
- Required deliverables: None
- Evidence: A new version exists with the change reasoned on the record.
- Refusal states: Refused: revision would exceed the artifact's scope.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

### 8. Supersession or retirement

Retire the artifact and name what replaces it.

- Owner: Strategy and Governance
- Entry: A replacement exists, or the subject no longer needs governing.
- Exit: The artifact is marked superseded or retired, naming its replacement.
- Required deliverables: None
- Evidence: The artifact is marked superseded or retired, naming its replacement.
- Refusal states: Blocked: no replacement for a subject that still needs a rule.
- Maximum waiting state: Ten working days waiting without movement requires escalation.
- Escalation: Escalate to the stream's stop authority with the blocking reason named.
- Audit: Record who acted, in which capacity, on which objects, under which rule, and when.

## Gates

### Review gate (`governance-artifact-lifecycle-G01`)

Decide whether Governance Artifact → Promotion / Supersession may advance past review.

- Owner: Research and Intelligence
- Required evidence: Review comments and findings are recorded.
- Dispositions available: pass, hold, blocked, refused, revise
- Stop conditions: The artifact conflicts with a current standing rule and the conflict is unresolved.; No authority is willing to own the artifact.
- Worked example disposition: hold — Illustrative disposition only. No real work has passed this gate.

### Authority decision gate (`governance-artifact-lifecycle-G02`)

Decide whether Governance Artifact → Promotion / Supersession may advance past authority decision.

- Owner: Strategy and Governance
- Required evidence: An authority class is declared and recorded.
- Dispositions available: pass, hold, blocked, refused, revise
- Stop conditions: The artifact conflicts with a current standing rule and the conflict is unresolved.; No authority is willing to own the artifact.
- Worked example disposition: hold — Illustrative disposition only. No real work has passed this gate.

## Handoffs

- `governance-artifact-lifecycle-S01-H`: Strategy and Governance → Research and Intelligence. Required state: Exit criteria of Draft are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `governance-artifact-lifecycle-S02-H`: Research and Intelligence → Strategy and Governance. Required state: Exit criteria of Review are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `governance-artifact-lifecycle-S03-H`: Strategy and Governance → Strategy and Governance. Required state: Exit criteria of Conflict check are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `governance-artifact-lifecycle-S04-H`: Strategy and Governance → Strategy and Governance. Required state: Exit criteria of Authority decision are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `governance-artifact-lifecycle-S05-H`: Strategy and Governance → Enterprise Operations. Required state: Exit criteria of Current and approved are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `governance-artifact-lifecycle-S06-H`: Enterprise Operations → Strategy and Governance. Required state: Exit criteria of Monitoring are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.
- `governance-artifact-lifecycle-S07-H`: Strategy and Governance → Strategy and Governance. Required state: Exit criteria of Revision are recorded as met. Acceptance is an explicit act by the receiver; elapsed time never accepts a handoff.

## Dependencies

- No cross-stream dependency recorded.

## Refusal and rollback

Refusal conditions:

- The artifact conflicts with a current standing rule and the conflict is unresolved.
- No authority is willing to own the artifact.

Rollback and recovery: Restore the prior artifact version and record the reversal as a decision.

Escalations:

- A stalled stage escalates to the stream stop authority.
- A refused gate escalates to the decision authority named for that gate.

## Measurement

Outcome measures:

- Every governing artifact states its authority class and its supersession status.

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

- Two artifacts govern the same subject.
- A draft is used as if it were approved.

Assumptions:

- Markdown documents plus the authority ledger are sufficient at this stage.

Unknowns:

- When artifact governance needs tooling beyond the current ledger.

Review trigger: Conflict discovered, evidence change, or the review interval elapsing.
