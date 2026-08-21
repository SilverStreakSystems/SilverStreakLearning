# SSLS 3.0 — Project Charter

| Field | Value |
|---|---|
| Document ID | SSLS3-DOC-01 |
| Version | 0.1.0-draft |
| Status | DRAFT — OWNER REVIEW REQUIRED |
| Owner | Shelby |
| Last updated | 2026-08-21 |
| Authority level | Founding. Controls identity, purpose, North Star, and governing principles. |
| Canonical status | CANDIDATE |
| Review class | AI-assisted authorship. Not independent review, not human review, not validation. |

## Purpose

To establish what SSLS 3.0 is, why it exists, what it commits to, and who decides — before anything is designed, specified, or built.

## Scope

Identity, purpose, principles, commitments, and governance. This charter does **not** define scope boundaries (file 05), product content (file 06), authority ranking (file 02), or current status (file 04).

## Controlling relationships

**Controls:** project identity, purpose, North Star, governing principles, human decision authority, amendment process.

**Controlled by:** owner decisions recorded in [08-SSLS_3.0_DECISION_REGISTER.xlsx](08-SSLS_3.0_DECISION_REGISTER.xlsx).

**Defers to:** [02-SSLS_3.0_SOURCE_HIERARCHY.md](02-SSLS_3.0_SOURCE_HIERARCHY.md) for conflict resolution; [07-SSLS_3.0_GLOSSARY.md](07-SSLS_3.0_GLOSSARY.md) for terminology.

---

## 1. Project identity

**Silver Streak Learning Systems 3.0**, abbreviated **SSLS 3.0**. `[C]`

| Term | Meaning | Rule |
|---|---|---|
| SSLS | The complete modular ecosystem | The whole |
| Silver Streak Learning | The instructional and educator-facing platform within the ecosystem | A part |

These names are **not interchangeable**. `[C]` Substituting one for the other misstates scope and is treated as a defect, not a style choice.

Owner and final decision-maker: **Shelby**. `[C]`

## 2. North Star

> **Make Learning Visible.** `[C]`

Learning that cannot be seen cannot be supported, evidenced, or improved. SSLS exists to make the evidence of learning legible to the people accountable for it — without reducing a learner to a score, and without turning visibility into surveillance.

**What the North Star licenses:** structure, evidence, traceability, explainability.

**What it does not license:** monitoring for its own sake, behavioural tracking, engagement optimization, or the collection of anything beyond what a stated purpose requires. Visibility serves the learner and the educator first. `[I]`

## 3. Clean-slate mandate

SSLS 3.0 is built from **first principles**. `[C]`

It is not a rename, a migration, a refactor, an upgrade, or an automatic inheritance of SSLS 2.0 or any earlier work. No prior schema, role model, route set, module list, technology choice, gate model, maturity claim, or implementation status carries forward. `[C]`

Earlier material is **HISTORICAL REFERENCE — NON-CONTROLLING**. It may be consulted as evidence of what was previously considered. It becomes SSLS 3.0 authority only by an explicit, recorded owner promotion of a named artifact. **No promotion has occurred.** `[C]`

Detail, polish, confidence of tone, recency, and apparent completeness confer no authority.

## 4. Problem space

Education organizations hold a great deal of information about learning and very little usable evidence of it. `[I]`

Observable pattern, stated as interpretation rather than research:

- Evidence of learning is scattered across systems that were not designed to talk to each other.
- The people accountable for a learner's progress often cannot reconstruct why a decision was made.
- Compliance work and instructional work are recorded separately, so neither informs the other.
- Effort spent documenting learning frequently exceeds the value the documentation returns.

`[U]` No user research, needs analysis, demand study, or organizational validation has been conducted for SSLS 3.0. This section is a hypothesis to be tested, not a finding. Any statement that districts, educators, or learners *need* this product is unsupported and prohibited until evidence exists.

## 5. Project purpose

To design and build a governed ecosystem that turns authorized evidence of learning into structure a human can act on — with the reasoning, the source, and the limitations visible alongside the result. `[I]` PROPOSED

## 6. Strategic intent

| Intent | Statement |
|---|---|
| Build the differentiating layer | Governance, evidence, traceability, and educational reasoning. `[I]` |
| Integrate, don't rebuild | Commodity capability is integrated, not re-implemented. `[I]` PROPOSED |
| Earn each expansion | Scope grows only on evidence, never on ambition. `[C]` |
| Stay explainable | A result a human cannot interrogate is not a finished result. `[I]` |

## 7. Intended value

`[I]` PROPOSED — none of the following is validated.

- Reduce the distance between evidence and the action it should inform.
- Preserve the reasoning behind a decision so it can be reviewed later.
- Reduce duplicated documentation effort.
- Make limitations as visible as conclusions.

## 8. Governing principles

1. **One source of truth per concept.** Competing sources are a defect.
2. **Default deny.** Absence, ambiguity, or mismatch denies. Unknown never grants permission.
3. **Evidence before claim.** No assertion outruns what supports it.
4. **Separate the kinds of truth.** Raw fact, derived state, approval, validation, and publication are distinct and never collapse into one field.
5. **Narrower and safer wins.** On genuine ambiguity, take the more conservative reading.
6. **Nothing is deleted.** Superseded material is archived with lineage.
7. **Reversibility is a feature.** Prefer the cheaper-to-reverse option absent strong evidence.
8. **Burden parity.** A governance step that cannot name the decision it improves or the risk it retires is removed.
9. **Explainability over automation.** Deterministic and inspectable beats clever and opaque.
10. **Honest maturity.** Approved ≠ implemented ≠ validated ≠ released.

## 9. Educational and human-centered commitments

`[I]` PROPOSED — commitments, not claims of achievement.

- A person, never a system, holds authority over consequential decisions about a learner.
- Grade-level intellectual work is not reduced because a learner is still developing language or has a disability.
- Language development, literacy profile, disability-related need, and grade-level expectation are **separate axes**. No axis automatically determines another.
- Support is recorded with the conditions under which it was given, so independence can be evidenced rather than assumed.
- Scaffolds are temporary by design and carry a fading path. Required accommodations and assistive technology are not scaffolds and are never faded.
- Constructs stay separate. No single combined score stands in for a learner's progress.
- The system records what may **not** be inferred, not only what happened.

## 10. Privacy, security, accessibility, interoperability, explainability, evidence

| Domain | Principle |
|---|---|
| **Privacy** | Minimum necessary. Purpose-bound. Synthetic-only until owner-approved governance says otherwise. No student data in any AI training path. `[C]` |
| **Security** | Authorization is enforced by the data layer, not the interface. Interface hiding never grants access. Default deny. Least privilege. `[I]` PROPOSED |
| **Accessibility** | Access is a design constraint, not a remediation phase. Brand expression never overrides access or truthfulness. Conformance target is an open decision — see file 08. `[I]` |
| **Interoperability** | Reference external systems by canonical identifier; do not become their system of record. Adopting a standard is not conforming to it. `[I]` PROPOSED |
| **Explainability** | Any derived state must be reconstructable from its inputs and rules. `[I]` |
| **Evidence** | Every evidence item carries its **limitations**. Evidence without stated limitations is how a scoped check becomes a certification claim. `[C]` |

## 11. Human decision authority

Shelby is the sole decision authority for SSLS 3.0. `[C]`

Consequential decisions about a learner — eligibility, placement, grading, discipline, safety, service level — are made by qualified humans with statutory or organizational authority. That authority cannot be delegated to software or to a model, at any maturity level. `[C]`

## 12. AI-assistance boundary

AI is governed assistance, never an autonomous decision-maker. `[C]`

**Permitted:** research, drafting, synthesis, restructuring, code generation, test generation, gap identification, option generation.

**Prohibited:** approving its own output, establishing canon, recording an owner decision, waiving a control, closing a risk or finding, promoting an artifact or phase, authorizing a claim, asserting compliance, merging, migrating, deploying, releasing, or making any consequential decision.

AI-assisted review is **not** independent review, human review, or validation. Simulated reviewers, expert panels, or councils may not be presented as review evidence. Every AI-assisted artifact declares its review class. `[C]`

## 13. Current operating posture

| Aspect | Position | Label |
|---|---|---|
| Operating capacity | Founder/developer. A single person, acting as owner, designer, builder, and reviewer. | `[C]` |
| Data | Synthetic, fictional, or non-identifiable only. | `[C]` |
| Organizational identity | District-agnostic. Placeholders only. | `[C]` |
| Users | No student, family, educator, specialist, administrator, vendor, or public application role exists. | `[C]` |
| Implementation | No repository, code, schema, service, integration, or deployment exists or is claimed. | `[C]` |
| Maturity | None achieved. | `[C]` |

## 14. Stakeholder categories

**All PROPOSED.** `[U]` No stakeholder has been consulted, recruited, interviewed, or confirmed.

| Category | Status |
|---|---|
| Learners | PROPOSED — hypothesis |
| Educators and instructional staff | PROPOSED — hypothesis |
| Specialists and related-service providers | PROPOSED — hypothesis |
| School and organizational leaders | PROPOSED — hypothesis |
| Families and caregivers | PROPOSED — hypothesis |
| Compliance and data staff | PROPOSED — hypothesis |
| Reviewers and auditors | PROPOSED — hypothesis |

Listing a category is not evidence that it has a need, an interest, or an intention to adopt.

## 15. Desired outcomes

`[I]` PROPOSED, in priority order:

1. A coherent, honest foundation that a competent stranger can understand without reconstructing history.
2. A working, evidenced vertical slice that proves the architecture end to end.
3. Documentation whose claims survive technical, legal, and organizational scrutiny.
4. A demonstrated reduction in effort for at least one real workflow.

## 16. Non-goals

SSLS 3.0 is explicitly **not**: a student information system; a learning management system; a replacement for an external assessment authority; a surveillance or engagement-optimization tool; an autonomous decision system; a staff-reduction or wage-suppression instrument; a system that shifts institutional burden onto learners or families; a production platform at this time. `[C]`

## 17. Success dimensions

Measured separately and **never averaged**:

| Dimension | Question |
|---|---|
| Artifact quality | Is it correct, complete, and internally consistent? |
| Implementation maturity | Does it exist and work? |
| Evidence confidence | Is it proven, and how strongly? |

A high score on one never compensates for a low score on another. Safety-relevant categories must meet their threshold independently. `[I]` PROPOSED

## 18. Governance and amendment

- This charter is amended only by a recorded owner decision in file 08.
- Amendments state what changed, why, and what is affected.
- The prior version is retained as SUPERSEDED with a forward pointer.
- No amendment occurs by implication, by a newer file appearing, or by AI inference.
- Review trigger: any change to identity, purpose, principles, decision authority, or operating posture.

## 19. Unresolved founding decisions

| ID | Question |
|---|---|
| OD-01-1 | Confirm the North Star statement and its stated limits (§2). |
| OD-01-2 | Confirm or revise the purpose statement (§5). |
| OD-01-3 | Confirm the ten governing principles (§8). |
| OD-01-4 | Confirm the educational commitments (§9) as binding design constraints. |
| OD-01-5 | Confirm the AI boundary (§12) as binding on all connected tools. |
| OD-01-6 | Set the accessibility conformance target. |
| OD-01-7 | Confirm the three success dimensions and their thresholds. |
| OD-01-8 | Decide whether any named historical artifact is promoted. Default: none. |

## Assumptions and unknowns

| ID | Item | Label |
|---|---|---|
| A-01-1 | The problem space in §4 reflects a real and persistent pattern. | `[I]` |
| A-01-2 | A single operator can sustain this governance model. Contested — see burden parity, §8.8. | `[I]` |
| U-01-1 | No user research, demand evidence, or organizational validation exists. | `[U]` |
| U-01-2 | No SSLS 3.0 Project Instructions were available; this charter derives from the owner's commissioning instruction alone. | `[U]` |
| U-01-3 | Whether the intended value in §7 is achievable is untested. | `[U]` |

## Non-effects

This charter does not approve a module, user, workflow, technology, partnership, integration, or capability. It does not establish scope (file 05), authorize a claim (file 10), assert any maturity level, or authorize implementation, live data, deployment, or release.

## Change history

| Version | Date | Change | Author |
|---|---|---|---|
| 0.1.0-draft | 2026-08-21 | Initial draft for owner review. | AI-assisted authorship |
