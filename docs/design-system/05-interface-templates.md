# Universal interface templates

Authority: Working direction. Generated from fixtures.

Maturity is a declared field. It is never derived from implementation status,
test success, or the existence of a route.

| Label              | Meaning                                                                    |
| ------------------ | -------------------------------------------------------------------------- |
| Implemented        | Exists in the current runtime and has direct implementation evidence.      |
| Prototype          | Interactive or rendered proof. Not production authorized.                  |
| Specified          | Defined well enough to implement but not yet built.                        |
| Research candidate | Target-state pattern requiring a governing decision before implementation. |
| Gated future       | Explicitly out of current scope until authority changes.                   |

| Template                            | Primary job                                              | Maturity           | Implementing routes                                                       |
| ----------------------------------- | -------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------- |
| TPL-01 Enterprise Application Shell | Provide the authenticated global frame.                  | Specified          | /                                                                         |
| TPL-02 Command Center               | Orient the operator to what matters first.               | Implemented        | /                                                                         |
| TPL-03 Workspace Shell              | Hold collaborative context around a body of work.        | Gated future       | None                                                                      |
| TPL-04 Focus Workspace              | Support deep work on one object.                         | Research candidate | None                                                                      |
| TPL-05 Registry                     | Browse and manage governed objects.                      | Implemented        | /capabilities, /objects, /value-streams, /findings, /evidence, /decisions |
| TPL-06 Record Detail                | Inspect one governed object.                             | Implemented        | /capabilities/$capabilityId, /objects/$typeId, /value-streams/$streamId   |
| TPL-07 Action Center                | Hold one cross-platform work queue.                      | Specified          | None                                                                      |
| TPL-08 Search                       | Retrieve only what the viewer is authorized to see.      | Specified          | None                                                                      |
| TPL-09 Context Package              | Deliver a purpose-bound projection.                      | Prototype          | /objects                                                                  |
| TPL-10 Meeting                      | Prepare, decide, and follow up.                          | Gated future       | None                                                                      |
| TPL-11 Plan                         | Move from current state to target state.                 | Specified          | None                                                                      |
| TPL-12 Review                       | Evaluate a target against stated criteria.               | Prototype          | /findings                                                                 |
| TPL-13 Approval                     | Record an explicit human promotion.                      | Prototype          | /decisions, /authority                                                    |
| TPL-14 Compare                      | Show the difference between versions or objects.         | Specified          | None                                                                      |
| TPL-15 Timeline                     | Present chronological truth.                             | Specified          | None                                                                      |
| TPL-16 Relationship Explorer        | Show typed relationships with an accessible alternative. | Prototype          | /objects, /traceability                                                   |
| TPL-17 Notification Center          | Present an action-aware change stream.                   | Gated future       | None                                                                      |
| TPL-18 Resource Library             | Find and reuse governed knowledge.                       | Specified          | None                                                                      |

## Required anatomy and open unknowns

### TPL-01 — Enterprise Application Shell

- Declared maturity: Specified
- Required anatomy: Brand identity, Global navigation, Universal Search, Universal Action Center, Notifications, My Workspaces, Knowledge and Help, Profile and acting capacity
- Blueprint: None recorded
- Open unknowns:
  - The current shell provides brand identity and global navigation only. Search, action center, notifications, workspaces, help, and acting capacity are absent.
  - There is no authentication in this workspace, so 'authenticated frame' cannot be evidenced.

### TPL-02 — Command Center

- Declared maturity: Implemented
- Required anatomy: Critical attention, Current state, Changes, Risks, Decisions, Next actions
- Blueprint: BP-COMMAND-CENTER
- Open unknowns:
  - Region geometry has not been measured against the blueprint coordinates.

### TPL-03 — Workspace Shell

- Declared maturity: Gated future
- Required anatomy: Purpose, Members, Channels, Work, Resources, Decisions, Events, Activity
- Blueprint: None recorded
- Open unknowns:
  - Requires multi-participant operation, which this posture refuses.

### TPL-04 — Focus Workspace

- Declared maturity: Research candidate
- Required anatomy: Active object, Minimized navigation, Context rail, Workflow stepper
- Blueprint: None recorded
- Open unknowns:
  - No governing decision yet on when navigation may be minimized.

### TPL-05 — Registry

- Declared maturity: Implemented
- Required anatomy: Search, Filters, Saved views, Sort, Display mode, Results, Bulk action if authorized
- Blueprint: BP-REGISTRY
- Open unknowns:
  - Saved views and bulk action are not built; the registries are read only by posture.

### TPL-06 — Record Detail

- Declared maturity: Implemented
- Required anatomy: Identity, Status, Facts, Relationships, Work, Evidence, History, Provenance, Access
- Blueprint: BP-RECORD-DETAIL
- Open unknowns:
  - History and access sections are not yet rendered on every detail route.

### TPL-07 — Action Center

- Declared maturity: Specified
- Required anatomy: Today, Overdue, Upcoming, Waiting, Reviews, Approvals, Assigned, Completed
- Blueprint: None recorded
- Open unknowns:
  - Requires assignable work items with owners, which this posture does not operate.

### TPL-08 — Search

- Declared maturity: Specified
- Required anatomy: Result type, Title, Context, Why relevant, Source, Freshness, Action
- Blueprint: None recorded
- Open unknowns:
  - Authorization evaluation is modelled but not executed anywhere in this build.

### TPL-09 — Context Package

- Declared maturity: Prototype
- Required anatomy: Purpose, Acting capacity, Freshness, Missing and conflict checks, Minimum relevant information
- Blueprint: None recorded
- Open unknowns:
  - The context view renders example packages only; no package is assembled at runtime.

### TPL-10 — Meeting

- Declared maturity: Gated future
- Required anatomy: Agenda, Context, Notes, Proposals, Decisions, Work items, Next event
- Blueprint: None recorded
- Open unknowns:
  - Multi-participant operation is out of scope for this posture.

### TPL-11 — Plan

- Declared maturity: Specified
- Required anatomy: Current state, Goals, Actions, Owners, Dependencies, Measures, Evidence, Milestones
- Blueprint: None recorded
- Open unknowns:
  - No owner model exists in a single-operator workspace.

### TPL-12 — Review

- Declared maturity: Prototype
- Required anatomy: Target, Criteria, Evidence, Findings, Severity, Disposition, Required action
- Blueprint: None recorded
- Open unknowns:
  - Findings are recorded, but no criteria-bound review instrument is implemented.

### TPL-13 — Approval

- Declared maturity: Prototype
- Required anatomy: Version, Evidence, Authority, Unresolved findings, Consequences, Effective date
- Blueprint: None recorded
- Open unknowns:
  - Approvals are displayed as fixtures; no approval can be executed in this build.

### TPL-14 — Compare

- Declared maturity: Specified
- Required anatomy: Side by side, Additions, Removals, Conflicts, Provenance
- Blueprint: None recorded
- Open unknowns:
  - Version history is modelled but not stored, so nothing can be diffed.

### TPL-15 — Timeline

- Declared maturity: Specified
- Required anatomy: Date, Event, Actor, Source, Changed fields, Evidence
- Blueprint: None recorded
- Open unknowns:
  - No event store exists in this build.

### TPL-16 — Relationship Explorer

- Declared maturity: Prototype
- Required anatomy: Nodes, Edges, Direction, Orphan state, Structured list or table alternative
- Blueprint: None recorded
- Open unknowns:
  - Only the table alternative exists. No graph rendering is built, which is the accessible order to build in.

### TPL-17 — Notification Center

- Declared maturity: Gated future
- Required anatomy: What happened, Why it matters, Affected object, Action, Deadline
- Blueprint: None recorded
- Open unknowns:
  - Requires persistent change capture, which is out of scope.

### TPL-18 — Resource Library

- Declared maturity: Specified
- Required anatomy: Search, Collections, Provenance, Version, Approval, Accessibility, Language
- Blueprint: None recorded
- Open unknowns:
  - No content store and no translation provenance mechanism exist.

## Enterprise workspace templates

Target-state architecture. None is authorized as a released capability.

| Workspace                           | Template family                                                                                                               | Maturity           | Note                                                                                     |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------ | ---------------------------------------------------------------------------------------- |
| WSP-01 Command Center               | Enterprise state, Priority queue, Decisions, Blockers, Risk, Evidence gaps, Initiatives                                       | Prototype          | A single-operator command center exists at /. The enterprise workspace form does not.    |
| WSP-02 Strategy and Governance      | Governance register, Authority map, Requirements, Decisions, Policy, Gates, Claims, Risk                                      | Prototype          | Authority, decisions, findings, and evidence registers exist as operator surfaces.       |
| WSP-03 Research and Intelligence    | Research library, Source comparison, Evidence synthesis, Standards explorer, Horizon scan                                     | Specified          | No research library is stored in this build.                                             |
| WSP-04 Product and Learning Systems | Capability map, Learning architecture, Curriculum, content, assessment design, Accessibility and multilingual review          | Specified          | The capability map exists; learning design surfaces do not.                              |
| WSP-05 Engineering and Delivery     | Backlog, Architecture explorer, Decision records, Implementation records, Validations, Findings, Release and dependency views | Specified          | Decision and finding registers exist; delivery mechanics do not.                         |
| WSP-06 Market and Growth            | Market intelligence, Opportunity pipeline, Organizations, Proposals, Demo and publication readiness, Governed claims          | Research candidate | Public claims are governed at /boundaries; the growth workspace is not authorized.       |
| WSP-07 Customer and Implementation  | Onboarding, Readiness, Implementation plan, Milestones, Configuration, Training, Support, Adoption                            | Gated future       | Requires real district relationships. Gated until a pilot decision exists.               |
| WSP-08 Trust, Quality and Assurance | Accessibility, Privacy, Security, AI governance, Validation, Evidence packages, Release gates, Corrective action              | Prototype          | Accessibility and evidence surfaces exist. AI governance stays modelled, never operated. |
| WSP-09 Enterprise Operations        | Finance planning, Capacity, Vendors, Contracts, Assets, Continuity, Enterprise calendar                                       | Gated future       | Out of scope until the enterprise operates with more than one participant.               |
