# SSLS 3.0 — Product Brief

| Field | Value |
|---|---|
| Document ID | SSLS3-DOC-06 |
| Version | 0.1.0-draft |
| Status | DRAFT — OWNER REVIEW REQUIRED |
| Owner | Shelby |
| Last updated | 2026-08-21 |
| Authority level | Controlling. Defines the product problem, intended value, users, and outcomes. |
| Canonical status | CANDIDATE |
| Review class | AI-assisted authorship. Not independent review, not human review, not validation. |

> **Evidence warning.** No user research, needs analysis, demand study, market analysis, pilot, or organizational validation has been conducted for SSLS 3.0. Every user, need, and outcome below is a **hypothesis**. Nothing here may be cited as evidence of demand, adoption, fit, or effectiveness. `[C]`

## Purpose

To state what SSLS is for, whom it might serve, and what would count as success — at hypothesis strength, before anything is designed.

## Scope

Problem, value, users, outcomes, principles, and proposed capability areas. This is **not** a feature inventory, an architecture specification, a roadmap, or an implementation-status report.

## Controlling relationships

**Controls:** product problem, intended value, users, outcomes.

**Controlled by:** [01-SSLS_3.0_PROJECT_CHARTER.md](01-SSLS_3.0_PROJECT_CHARTER.md) and [05-SSLS_3.0_SCOPE_AND_BOUNDARIES.md](05-SSLS_3.0_SCOPE_AND_BOUNDARIES.md). Terminology from [07-SSLS_3.0_GLOSSARY.md](07-SSLS_3.0_GLOSSARY.md).

---

## 1. Product identity

| Name | What it is | Label |
|---|---|---|
| **SSLS** — Silver Streak Learning Systems | The complete modular ecosystem | `[C]` |
| **Silver Streak Learning** | The instructional and educator-facing platform within the ecosystem | `[C]` |

Not interchangeable. Ecosystem-level statements do not describe the platform, and platform-level statements do not describe the ecosystem. `[C]`

**North Star: "Make Learning Visible."** `[C]`

## 2. Problem statement

`[I]` PROPOSED — a hypothesis to be tested, not a finding.

Education organizations record a great deal about learners and retain very little usable evidence of learning.

Four observed patterns, offered as interpretation:

1. **Evidence is scattered.** What a learner can do sits across systems that were never designed to reconcile.
2. **Reasoning is lost.** The record shows what was decided, rarely why, on what evidence, or what was ruled out.
3. **Documentation and instruction are separate work.** Compliance recording and instructional recording rarely inform each other, so the same understanding is captured twice and used once.
4. **Effort exceeds return.** The people closest to learners spend disproportionate time producing records that are not later usable.

`[U]` Unmeasured. No baseline, no time study, no practitioner survey exists.

## 3. Opportunity statement

`[I]` PROPOSED.

If evidence of learning were captured once, structured at the point of capture, and carried its own reasoning and limitations, then the same evidence could serve instruction, support planning, and accountability without being re-entered — and the reasoning behind a decision would survive the person who made it.

**This is a hypothesis about a mechanism, not a claim about an outcome.**

## 4. Intended users

**All hypothetical.** `[U]` No user has been recruited, interviewed, observed, or confirmed.

| Category | Hypothesized need | Confirmation |
|---|---|---|
| Founder/developer | Build and evaluate the system | `[C]` — the only confirmed actor |
| Educators | Capture evidence once; see it reflected back usefully | `[U]` hypothesis |
| Specialists and related-service providers | Record service and progress evidence with conditions intact | `[U]` hypothesis |
| Instructional leaders | See patterns without re-collecting data | `[U]` hypothesis |
| Compliance and data staff | Assemble monitoring evidence without a parallel process | `[U]` hypothesis |
| Learners | See their own progress in terms they recognize | `[U]` hypothesis |
| Families and caregivers | Understand progress and what happens next | `[U]` hypothesis |

**Only the founder/developer is a confirmed user.** Every other row is an untested assumption about a person who has not been asked. `[C]`

## 5. Jobs to be done

`[I]` PROPOSED — inferred, not researched.

| ID | Job |
|---|---|
| JTBD-01 | Capture what a learner did, once, in a form usable later |
| JTBD-02 | Reconstruct why a decision was made, months later, from the record |
| JTBD-03 | Distinguish what a learner can do independently from what they did with support |
| JTBD-04 | Assemble evidence for a review without a separate collection exercise |
| JTBD-05 | See what evidence does **not** support, as clearly as what it does |
| JTBD-06 | Hand a case to another person without losing context |

## 6. Intended outcomes

`[I]` PROPOSED. Framed as testable hypotheses with named falsifiers.

| ID | Hypothesized outcome | Falsified if |
|---|---|---|
| OUT-01 | Time to reconstruct a decision falls measurably | Reconstruction takes as long as before |
| OUT-02 | Duplicate documentation effort falls | Users maintain parallel records anyway |
| OUT-03 | Support conditions are recorded alongside performance | Users skip the conditions field |
| OUT-04 | Claims trace to evidence | Unsupported claims still appear |
| OUT-05 | Administrative burden does not increase | Users report more work, not less |

**OUT-05 is the disconfirming test for the whole product.** A system that makes evidence visible while increasing burden has failed on its own terms. `[I]`

## 7. Value proposition

`[I]` PROPOSED.

> For a person accountable for a learner's progress who cannot currently reconstruct the evidence behind a decision, SSLS proposes a governed evidence layer that keeps evidence, reasoning, and limitations together — so that decisions can be explained, reviewed, and handed over.

**Unlike** systems that store records without reasoning, or that infer conclusions a human cannot interrogate. `[I]`

`[U]` No competitive analysis has been conducted. This differentiation is asserted, not established.

## 8. Product principles

| # | Principle |
|---|---|
| 1 | Evidence carries its limitations, always |
| 2 | Capture once, at the point of work |
| 3 | Show the reasoning, not only the result |
| 4 | Record what may not be inferred, not only what happened |
| 5 | Separate constructs; refuse the single combined score |
| 6 | The human decides; the system evidences |
| 7 | Reduce the distance between evidence and action |
| 8 | Earn every field — if nobody uses it, remove it |

## 9. Experience principles

| # | Principle |
|---|---|
| 1 | Predictable structure over novel interaction |
| 2 | State visible at all times — including empty, restricted, stale, and conflicted |
| 3 | Plain language; expand terms on first use |
| 4 | No consequential action without a clear, reversible confirmation |
| 5 | Fewer decisions per screen |
| 6 | The interface explains access; it never grants it |

## 10. Accessibility and inclusion commitments

`[I]` PROPOSED — commitments, not conformance claims.

- Accessibility is a design constraint from the first artifact, not a remediation phase.
- Full keyboard operability for every function.
- Status never conveyed by colour alone.
- Text resizing and reflow without loss of content or function.
- Content understandable before translation and structurally sound during it.
- Machine translation labeled as unreviewed; qualified human review for anything consequential.
- Brand expression never overrides access or truthfulness.

`[U]` The conformance target is an **open decision** — OD-01-6. No conformance claim may be made until an independent evaluation exists, and an independent evaluation cannot be self-produced.

## 11. Privacy and trust commitments

| # | Commitment |
|---|---|
| 1 | Minimum necessary. Collect only what a stated purpose requires |
| 2 | Purpose-bound. Access granted for a purpose is not access for all purposes |
| 3 | Synthetic-only until owner-approved governance says otherwise |
| 4 | No student data in any AI model training path |
| 5 | Visibility serves the learner and educator — not surveillance, not engagement optimization |
| 6 | Authorization enforced by the data layer, never by the interface |
| 7 | Limitations disclosed alongside conclusions |

## 12. Proposed capability areas

**PROPOSED. Not approved, not specified, not scheduled, not built.** `[I]`

Areas of possible value, at the coarsest useful grain. Naming an area is not committing to it.

| ID | Area | Question it would answer |
|---|---|---|
| CAP-01 | Evidence capture | What did the learner actually do, under what conditions? |
| CAP-02 | Reasoning and decision record | Why was this decided, on what basis, what was ruled out? |
| CAP-03 | Support and independence conditions | What support was present, and is it fading? |
| CAP-04 | Traceability | What connects this claim to its evidence? |
| CAP-05 | Structured instructional planning | What is the intended learning, and how will it be evidenced? |
| CAP-06 | Evidence assembly for review | What evidence exists for this requirement, and what is missing? |
| CAP-07 | Language and access records | What access support was provided, by whom, reviewed how? |
| CAP-08 | Governed AI assistance | Where can drafting help, behind human approval? |

`[U]` No prioritization, sequencing, or feasibility assessment exists.

## 13. Minimum viable foundation

`[I]` PROPOSED — what must be true before a product question can be answered honestly.

1. An accepted governance foundation. *(This package, pending review.)*
2. A confirmed scope boundary.
3. A requirements register with testable acceptance criteria.
4. One vertical slice — a single workflow, end to end, with evidence.

**Not** a feature set. The minimum viable foundation is the smallest thing that makes the next decision answerable with evidence. `[I]`

## 14. Future-state possibilities

Held in [05-SSLS_3.0_SCOPE_AND_BOUNDARIES.md §10](05-SSLS_3.0_SCOPE_AND_BOUNDARIES.md). Not restated here, and carrying no authority.

## 15. Proposed differentiators

`[I]` PROPOSED. Asserted, not established — no competitive analysis exists. `[U]`

| # | Proposed differentiator |
|---|---|
| 1 | Negative constraints as structured data — what may **not** be inferred, recorded as a first-class field |
| 2 | Evidence-gated claims — a claim without linked evidence is not publishable |
| 3 | Constructs kept separate — no single combined score |
| 4 | Support conditions recorded with performance, so independence is evidenced |
| 5 | Limitations mandatory on every evidence item |

## 16. Success measures

| ID | Measure | Method | Status |
|---|---|---|---|
| SM-01 | Time to reconstruct a decision | Timed task, before and after | Not baselined `[U]` |
| SM-02 | Duplicate documentation effort | Workflow observation | Not baselined `[U]` |
| SM-03 | Proportion of claims with linked current evidence | System query | Not implemented `[U]` |
| SM-04 | Administrative time to maintain the system | Time tracking | Not baselined `[U]` |
| SM-05 | Frequency the system prevents an unsupported claim | Finding count | Not implemented `[U]` |

**No baseline exists for any measure.** Without a baseline, no improvement can be claimed later. Establishing baselines is itself an open decision. `[C]`

## 17. Risks

| ID | Risk | Note |
|---|---|---|
| PR-01 | The problem is real but not painful enough to change behaviour | The most likely failure mode `[I]` |
| PR-02 | Governance overhead exceeds the value returned | Directly contradicts OUT-05 |
| PR-03 | Users skip the fields that carry the value — conditions, limitations, reasoning | Would hollow out the product |
| PR-04 | Structured capture proves too slow at the point of work | Would falsify JTBD-01 |
| PR-05 | Building for hypothetical users produces a system nobody asked for | Uncontrolled — no user contact exists |
| PR-06 | Visibility is experienced as surveillance | Would violate the North Star's stated limits |

## 18. Assumptions

| ID | Assumption | Label |
|---|---|---|
| A-06-1 | Practitioners would use a system that asks for reasoning and conditions. | `[I]` — untested, and PR-03 is its falsifier |
| A-06-2 | Evidence captured once can serve multiple purposes without re-entry. | `[I]` |
| A-06-3 | Explainability is valued enough to justify its cost. | `[I]` |
| A-06-4 | A single operator can build enough to test these hypotheses. | `[I]` |

## 19. Exclusions

SSLS is not a student information system, a learning management system, a replacement for an external assessment authority, a surveillance tool, an autonomous decision system, or a staff-reduction instrument. See charter §16. `[C]`

## 20. Unresolved product decisions

| ID | Decision needed |
|---|---|
| OD-06-1 | Confirm or revise the problem statement (§2). |
| OD-06-2 | Confirm the user hypotheses, and decide whether any user contact is planned. |
| OD-06-3 | Confirm or revise the eight proposed capability areas. |
| OD-06-4 | Decide which capability area, if any, becomes the first vertical slice. |
| OD-06-5 | Decide whether baselines will be established, and how, given no user access. |
| OD-06-6 | Confirm the minimum viable foundation (§13). |
| OD-06-7 | Decide how PR-05 — building for hypothetical users — is controlled. |

## Assumptions and unknowns

| ID | Item | Label |
|---|---|---|
| U-06-1 | No user research, demand evidence, or validation of any kind exists. | `[U]` |
| U-06-2 | No competitive or market analysis exists. | `[U]` |
| U-06-3 | Whether any hypothesized user would adopt this is unknown. | `[U]` |
| U-06-4 | Whether the problem in §2 is the most valuable problem to solve is unknown. | `[U]` |

## Non-effects

This brief approves no capability, feature, module, user role, integration, or technology. It does not schedule work, establish a roadmap, or claim demand, adoption, validation, market fit, or educational effectiveness. Every user and outcome is a hypothesis.

## Change history

| Version | Date | Change | Author |
|---|---|---|---|
| 0.1.0-draft | 2026-08-21 | Initial draft for owner review. | AI-assisted authorship |
