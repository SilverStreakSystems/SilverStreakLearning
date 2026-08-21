# SSLS 3.0 — Scope and Boundaries

| Field | Value |
|---|---|
| Document ID | SSLS3-DOC-05 |
| Version | 0.1.0-draft |
| Status | DRAFT — OWNER REVIEW REQUIRED |
| Owner | Shelby |
| Last updated | 2026-08-21 |
| Authority level | Controlling. Defines current scope, exclusions, and the separation of future state from current authority. |
| Canonical status | CANDIDATE |
| Review class | AI-assisted authorship. Not independent review, not human review, not validation. |

## Purpose

To state exactly what is authorized now, what is excluded, what is prohibited, and what may only be discussed as possibility — so that ambition cannot be mistaken for permission.

## Scope

Scope, actors, data, technology, deployment boundaries, and the change process. Does not define product content (file 06) or status (file 04).

## Controlling relationships

**Controls:** current scope, exclusions, future-state separation, scope-change process.

**Controlled by:** [01-SSLS_3.0_PROJECT_CHARTER.md](01-SSLS_3.0_PROJECT_CHARTER.md) and owner decisions in [08-SSLS_3.0_DECISIONS.md](08-SSLS_3.0_DECISIONS.md).

---

## 1. The scope rule

**Scope is default-deny.** `[C]` Anything not explicitly authorized below is out of scope. Absence of a prohibition is not permission.

Four categories, and they are not interchangeable:

| Category | Meaning |
|---|---|
| **In scope** | Authorized now. Work may proceed. |
| **Out of scope** | Not authorized now. May become authorized by owner decision. |
| **Prohibited** | Not authorized at any maturity level without a change to the charter itself. |
| **Future-state possibility** | Discussable as design thinking. Carries **no** authority and may not be built, specified as a requirement, or claimed. |

## 2. Current authorized scope

| Field | Value | Label |
|---|---|---|
| Authorized activity | Definition of the SSLS 3.0 governance foundation | `[C]` |
| Authorized artifacts | The twelve-file foundation source package | `[C]` |
| Authorization source | Owner commissioning instruction, 2026-08-21 | `[C]` |
| Everything else | Out of scope or prohibited | `[C]` |

## 3. Current actors and operating environment

| Aspect | Position | Label |
|---|---|---|
| Actors | **One.** Founder/developer — Shelby, acting as owner, designer, author, and reviewer | `[C]` |
| Application roles | **None exist.** No student, family, educator, specialist, administrator, vendor, auditor, or public role | `[C]` |
| Operating environment | Document authoring and analysis using AI assistance. No application runtime | `[C]` |
| Review capacity | Self-review only. **No independent reviewer exists** | `[C]` |

## 4. Current data boundary

| Rule | Position | Label |
|---|---|---|
| Permitted data | Synthetic, fictional, or non-identifiable only | `[C]` |
| Real personal data | **Prohibited** — student, family, caregiver, staff, health, disability, discipline, immigration, safety, credential, or confidential organizational information | `[C]` |
| Organizational identity | **District-agnostic.** No real district, school, or municipality name in content, titles, filenames, examples, or metadata. Placeholders: `DISTRICT-01`, `SCHOOL-01` | `[C]` |
| Synthetic conventions | Reserved domains only: `.example`, `.test`, `.invalid` | `[C]` |
| Jurisdiction references | Permitted. Statutes, regulations, agencies, and standards bodies are jurisdiction references, distinct from organizational identifiers | `[C]` |
| Re-identification | Renaming a real record does not make it synthetic. Coded or pseudonymous records derived from real people remain protected | `[C]` |
| AI training | **No student data in any AI model training path.** No exception at any maturity level | `[C]` |

## 5. Current technology boundary

| Aspect | Position | Label |
|---|---|---|
| Selected stack | **None.** No language, framework, database, hosting, authentication, or platform has been chosen | `[C]` |
| Inherited stack | **None.** No SSLS 2.0 technology choice carries forward | `[C]` |
| Permitted now | Document authoring; AI-assisted drafting and analysis | `[C]` |
| Not permitted now | Writing application code, creating a schema, provisioning a service, configuring authentication, or selecting a vendor | `[C]` |

Naming a technology as a candidate in any artifact is **not** selection. Selection requires a recorded owner decision.

## 6. Current deployment boundary

| Aspect | Position | Label |
|---|---|---|
| Repository | None created or connected | `[C]` |
| Environments | None | `[C]` |
| Deployment | None | `[C]` |
| Public availability | **None. Not authorized** | `[C]` |
| External transmission | **Not authorized** — no artifact may be sent, shown, or published externally | `[C]` |

## 7. In scope

1. Authoring, revising, and reviewing the twelve foundation artifacts.
2. Recording owner decisions about them.
3. Identifying historical material by exact filename and labeling it non-controlling.
4. Recording assumptions, unknowns, risks, and required decisions.
5. Proposing — never approving — future scope for owner consideration.

## 8. Out of scope

Not authorized now; may become authorized by recorded owner decision.

Requirements beyond foundation governance · phase and maturity model · information architecture · data model or schema · authorization model · threat model · accessibility conformance target and profile · technology selection · repository creation · application code · test suites · design system and brand assets · product capability specification · integration design · migration planning · external source register population · pilot planning · commercial terms.

## 9. Prohibited

Not authorized at any maturity level without amending the charter itself. `[C]`

| # | Prohibited |
|---|---|
| 1 | Introducing real student, family, caregiver, staff, health, disability, discipline, immigration, or safety data |
| 2 | Naming a real district, school, or municipality |
| 3 | Autonomous eligibility, placement, grading, discipline, safety, employment, medical, or legal decisions |
| 4 | Student data in an AI model training path |
| 5 | AI approving, ratifying, promoting, closing, releasing, or certifying anything |
| 6 | Claims of compliance, certification, validation, conformance, adoption, endorsement, affiliation, readiness, or educational effectiveness |
| 7 | Surveillance, behavioural tracking, or engagement optimization |
| 8 | Designing the system as a justification for staff reduction, wage suppression, unpaid labour, or shifting institutional burden onto learners or families |
| 9 | Deleting, renaming, replacing, or modifying an existing source |
| 10 | Promoting historical material to canon without a recorded owner decision |
| 11 | Presenting simulated review as review evidence |
| 12 | External transmission or publication without owner authorization |

## 10. Future-state possibilities

**No authority. Not approved. Not requirements. Not roadmap.** `[I]` PROPOSED for discussion only.

Recorded so that thinking is not lost, and fenced so it cannot be mistaken for a plan.

- An evidence layer that orchestrates existing organizational systems rather than replacing them.
- Structured support-plan and service evidence with explicit fading and independence conditions.
- Multilingual-learner and language-access workflow support.
- Compliance-monitoring evidence assembly, parameterized by jurisdiction.
- Educator-facing instructional evidence capture within Silver Streak Learning.
- Interoperability with roster and data-exchange standards.
- Multi-organization tenancy.
- Governed AI assistance for drafting and translation, behind human approval.

Each would require its own decision, scope expansion, and evidence. None is committed.

## 11. Assumptions

| ID | Assumption | Label |
|---|---|---|
| A-05-1 | A single operator remains the only actor for the foreseeable term. | `[I]` |
| A-05-2 | Synthetic-only is sustainable through design and initial build. | `[I]` |
| A-05-3 | Deferring technology selection does not block foundation work. | `[I]` |
| A-05-4 | Scope will expand incrementally with evidence, not in a single step. | `[I]` |

## 12. Dependencies

| ID | Dependency | Blocks |
|---|---|---|
| DEP-05-1 | Owner acceptance of this scope statement | Any work claiming to be in scope |
| DEP-05-2 | Charter acceptance | This document's authority |
| DEP-05-3 | A phase model, if one is adopted | Gate-based scope expansion |

## 13. Exclusions

Excluded from SSLS 3.0 entirely, not merely deferred: becoming the system of record for data an organization already governs · replacing an external assessment authority · autonomous decision-making about learners · engagement or time-on-platform optimization.

## 14. Scope-change process

1. **Propose** — state the capability, the problem it addresses, and the evidence that it is needed.
2. **Classify** — in scope, out of scope, prohibited, or future-state.
3. **Assess** — impact on data boundary, actors, authorization, accessibility, claims, and burden.
4. **Identify** — artifacts, requirements, and evidence the change would require.
5. **Record** — dependencies, risks, and reversibility.
6. **Decide** — Shelby records the decision in file 08.
7. **Propagate** — update this file, file 03, and file 04 **before** any work begins.

**No AI tool, mockup, prompt, generated schema, draft artifact, or conversation may expand scope by implication.** `[C]`

## 15. Authorization triggers

Scope expansion requires **all** of:

| # | Trigger |
|---|---|
| 1 | A recorded owner decision naming the exact expansion |
| 2 | A stated problem the expansion solves |
| 3 | Evidence that the problem is real |
| 4 | A data-boundary assessment |
| 5 | An authorization and access assessment where protected data could be involved |
| 6 | An accessibility assessment where a human-facing surface is involved |
| 7 | A claims assessment |
| 8 | A burden assessment — what this costs to maintain, and what it retires |
| 9 | A reversibility statement |
| 10 | An updated scope statement, propagated before work begins |

## 16. Required evidence for expanding scope

| Expansion | Minimum evidence |
|---|---|
| Any user role beyond founder/developer | Authorization model, access-control design, and executed negative tests |
| Any real data | Legal review, data agreement, retention schedule, breach procedure, security review — **none of which exist** |
| Any external transmission | Claims review, no-PII review, accessibility review, owner send approval |
| Any technology selection | Options compared against stated criteria, with a recorded decision |
| Any compliance-adjacent capability | Primary-source citation with retrieval date and re-verification trigger |
| Any conformance claim | Executed suite, all tests passed, body-recorded result, disclosed limitations |
| Any accessibility claim | Independent evaluation — cannot be self-produced |

## Assumptions and unknowns

| ID | Item | Label |
|---|---|---|
| U-05-1 | Whether Shelby intends any of §10 as near-term direction. | `[U]` |
| U-05-2 | Whether an external reviewer will become available, which would change §3 materially. | `[U]` |
| U-05-3 | What timeline, if any, applies to this project. | `[U]` |

## Required owner decisions

| ID | Decision needed |
|---|---|
| OD-05-1 | Confirm the current authorized scope (§2). |
| OD-05-2 | Confirm the twelve prohibitions (§9) as charter-level. |
| OD-05-3 | Confirm the data boundary (§4), including the district-agnostic rule. |
| OD-05-4 | Confirm the scope-change process and authorization triggers (§14–15). |
| OD-05-5 | Indicate whether any future-state possibility (§10) should be promoted to a near-term decision. |

## Non-effects

This document authorizes nothing beyond the foundation package. Listing a possibility does not approve it. Listing something as out of scope does not schedule it.

## Change history

| Version | Date | Change | Author |
|---|---|---|---|
| 0.1.0-draft | 2026-08-21 | Initial draft for owner review. | AI-assisted authorship |
