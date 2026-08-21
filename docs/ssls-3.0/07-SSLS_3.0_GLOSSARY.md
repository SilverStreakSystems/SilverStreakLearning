# SSLS 3.0 — Glossary

| Field | Value |
|---|---|
| Document ID | SSLS3-DOC-07 |
| Version | 0.1.0-draft |
| Status | DRAFT — OWNER REVIEW REQUIRED |
| Owner | Shelby |
| Last updated | 2026-08-21 |
| Authority level | Controlling. The single source of SSLS 3.0 terminology. |
| Canonical status | CANDIDATE |
| Review class | AI-assisted authorship. Not independent review, not human review, not validation. |

## Purpose

To fix one meaning per term, so that no artifact quietly redefines a word another artifact depends on.

## Scope

Terminology only. Where a term names a concept controlled elsewhere, the controlling file is named and the definition here stays deliberately thin.

## Controlling relationships

**Controls:** terminology across all SSLS 3.0 artifacts.

**Controlled by:** [01-SSLS_3.0_PROJECT_CHARTER.md](01-SSLS_3.0_PROJECT_CHARTER.md).

**Rule:** every other artifact uses these terms as defined and may not redefine them locally. A term used in a different sense is a defect, not a style choice.

---

## 1. Status values for terms

| Value | Meaning |
|---|---|
| `APPROVED` | Definition accepted by owner decision |
| `PROPOSED` | Candidate definition awaiting approval |
| `RESERVED` | Term is claimed but deliberately undefined |
| `AMBIGUOUS` | In use with more than one meaning; must be resolved |
| `DEPRECATED` | Formerly used; must not be used going forward |

**All terms below are `PROPOSED`** until owner approval. `[C]`

## 2. Identity terms

| Term | Definition | Status | Context | Abbrev. | Prohibited usage | Related | Controlling source |
|---|---|---|---|---|---|---|---|
| **SSLS** | Silver Streak Learning Systems — the complete modular ecosystem | PROPOSED | All | SSLS | Never as a synonym for Silver Streak Learning. Never for a single module | ecosystem, platform | File 01 |
| **Silver Streak Learning** | The instructional and educator-facing platform within the SSLS ecosystem | PROPOSED | Product | — | Never abbreviated to "SSLS". Never used for the ecosystem | SSLS, platform | File 01 |
| **Ecosystem** | The full set of platforms, products, modules, and shared services under SSLS | PROPOSED | Architecture | — | Not a synonym for platform or product | platform, module | File 01 |
| **Platform** | A coherent, user-facing system within the ecosystem serving a defined audience | PROPOSED | Architecture | — | Not a synonym for ecosystem, product, or module | ecosystem, product | File 01 |
| **Product** | A named offering with its own identity, users, and value proposition | PROPOSED | Product | — | Not for an unbuilt capability | platform, capability | File 06 |
| **Module** | A bounded functional unit within a platform | PROPOSED | Architecture | — | **No module is approved.** Never describe one as established | capability, workflow | `[U]` — none defined |
| **Capability** | A thing the system can do, described by outcome rather than implementation | PROPOSED | Product | — | Not a feature list. Not a commitment | module, workflow | File 06 |

## 3. Structural terms

| Term | Definition | Status | Prohibited usage | Controlling source |
|---|---|---|---|---|
| **Workflow** | An ordered sequence of steps a person or system performs to reach an outcome | PROPOSED | Not a synonym for process, feature, or route | `[U]` — none defined |
| **Route** | An addressable location in an interface | PROPOSED | **No route exists.** Never imply an interface is built | `[U]` — none defined |
| **Actor** | A person or system that interacts with SSLS | PROPOSED | Not a synonym for role or user account | File 05 |
| **Role** | A named set of permissions assigned to an actor | PROPOSED | **Only founder/developer exists.** Never describe another role as active | File 05 |
| **Acting capacity** | The hat an actor wears for a task — the same person may act as owner, author, or reviewer at different moments | PROPOSED | Not a synonym for role. Capacity is contextual; role is assigned | File 05 |
| **Relationship** | A recorded connection between an actor and a subject that may condition access | PROPOSED | Not a role. A role says what you are; a relationship says who you are connected to | `[U]` — model undefined |
| **Purpose** | The declared reason access is requested or data is used | PROPOSED | Access for one purpose is not access for all purposes | File 05 |

## 4. Governance terms

| Term | Definition | Status | Prohibited usage | Controlling source |
|---|---|---|---|---|
| **Canonical source** | The single artifact that controls a concept, approved by owner decision | PROPOSED | Never self-applied. An artifact calling itself canonical is not canonical | File 03 |
| **Candidate** | An artifact complete enough to review but not accepted | PROPOSED | Never cited as authority | File 03 |
| **Requirement** | A stated, testable obligation the system must satisfy | PROPOSED | Not a wish, a feature, or an idea. If untestable, it is not a requirement | File 09 |
| **Decision** | A recorded owner determination that creates or removes authority | PROPOSED | A discussion is not a decision. If it is not in file 08, it has not been made | File 08 |
| **Task** | A unit of work | PROPOSED | Task completion is not approval | `[U]` |
| **Implementation** | Something that exists and runs | PROPOSED | **Nothing is implemented.** Never for a specification or a draft | File 04 |
| **Validation** | Evidence-producing verification that something works as required | PROPOSED | AI-assisted review is not validation. Owner approval is not validation | File 10 |
| **Finding** | A defect, gap, or observation produced by review or testing | PROPOSED | Not a risk. A finding is observed; a risk is anticipated | File 10 |
| **Evidence** | A record of something observed, with its method, scope, and **limitations** | PROPOSED | Assertion is not evidence. Evidence without limitations is unusable | File 10 |
| **Claim** | A statement made to an audience about the project or product | PROPOSED | **Defaults to NOT AUTHORIZED** until evidenced and approved | File 10 |
| **Release** | An owner-approved, identified build made available for a stated use | PROPOSED | **Not authorized.** Never used aspirationally | File 04 |
| **Deployment** | Placing a build into an environment | PROPOSED | Not a synonym for release. Deployment is mechanical; release is authorized | File 04 |
| **AI-assisted review** | Review activity performed with AI assistance | PROPOSED | **Never** described as independent review, human review, validation, expert review, or sign-off | File 02 |

## 5. Data terms

| Term | Definition | Status | Prohibited usage | Controlling source |
|---|---|---|---|---|
| **Synthetic data** | Wholly fictional, deliberately constructed, non-identifiable data | PROPOSED | Renaming a real record does **not** make it synthetic. Coded or pseudonymous records derived from real people are not synthetic | File 05 |
| **PII** | Information that identifies a person directly, or in combination with other available information | PROPOSED | Not limited to names and identifiers. Combination and re-identification risk count | File 05 |
| **Minimum necessary** | The least data required to accomplish a stated purpose | PROPOSED | Not "everything we might later want" | File 05 |
| **Organizational identifier** | A name or detail identifying a real district, school, or municipality | PROPOSED | Prohibited in all artifacts. **Distinct from PII** — an organizational disclosure, not a personal one | File 05 |
| **Jurisdiction reference** | A statute, regulation, agency, or standards body | PROPOSED | Permitted. **Not** an organizational identifier. Do not over-scrub these | File 05 |

## 6. State terms

| Term | Definition | Status | Prohibited usage | Controlling source |
|---|---|---|---|---|
| **Current state** | What is true now, evidenced and dated | PROPOSED | Only file 04 may state it. Elsewhere it is stale by construction | File 04 |
| **Target state** | An intended future condition that has been decided | PROPOSED | Requires a recorded decision. **No target state is approved** | File 05 |
| **Future state** | A possibility discussed but not decided | PROPOSED | **No authority.** Never described as planned, committed, or on a roadmap | File 05 |

**The distinction that matters most:** *future state* is thinking; *target state* is a decision; *current state* is evidenced fact. Collapsing them is how a possibility becomes a claim. `[C]`

## 7. Reserved terms

Claimed, deliberately undefined. Using one as though it were defined is a defect.

| Term | Why reserved |
|---|---|
| **Gate** | No phase or gate model exists for SSLS 3.0 — OD-04-1 |
| **Maturity level** | No maturity model exists — OD-04-1 |
| **Increment** | Depends on a phase model |
| **Tenant** | Multi-organization architecture is future-state only |
| **Service** | Reserved until an architecture decision exists |
| **Integration** | Reserved until an interoperability decision exists |
| **Pilot** | Reserved. Carries adoption implications that cannot currently be supported |

## 8. Ambiguous terms requiring resolution

| Term | Ambiguity | Resolution needed |
|---|---|---|
| **Platform** | Used both for Silver Streak Learning specifically and for technical infrastructure generally | OD-07-1 |
| **Evidence** | Used for governance evidence (proof about the project) and instructional evidence (proof about a learner) | OD-07-2 — likely needs two distinct terms |
| **Review** | Used for artifact review, code review, and educational review | OD-07-3 |
| **Assessment** | Carries a specific educational meaning that conflicts with general "evaluation" | OD-07-4 |

## 9. Deprecated terms

| Term | Why | Use instead |
|---|---|---|
| **MVP** | Implies market validation that does not exist | Minimum viable foundation |
| **Production-ready** | Prohibited claim | State the actual state |
| **Canonical** (self-applied) | Authority is granted, not asserted | Candidate, until approved |
| **Expert review / council / panel** | Prohibited when simulated | AI-assisted authorship |
| **Duplicate** (of historical files) | Repetition is not evidence of duplication | Repeated title, unverified |

## 10. Terminology rules

1. One meaning per term, project-wide.
2. Expand a term on first use in every independently readable artifact.
3. Never introduce a synonym for a defined term.
4. Never redefine a term locally.
5. Prefer the plain word where one exists.
6. A term in §7 may not be used as though defined.
7. Adding or changing a term requires an owner decision.

## Assumptions and unknowns

| ID | Item | Label |
|---|---|---|
| A-07-1 | Fixing terminology before design prevents the drift that follows from parallel authoring. | `[I]` |
| A-07-2 | The reserved terms in §7 will be needed later, and reserving them now prevents casual use. | `[I]` |
| U-07-1 | Whether the ecosystem/platform/product/module hierarchy survives contact with an actual architecture. | `[U]` |
| U-07-2 | Whether "evidence" needs splitting into two terms. Likely, but unresolved. | `[U]` |

## Required owner decisions

| ID | Decision needed |
|---|---|
| OD-07-1 | Resolve the two senses of **platform**. |
| OD-07-2 | Resolve **evidence** — governance evidence versus instructional evidence. |
| OD-07-3 | Resolve the three senses of **review**. |
| OD-07-4 | Resolve **assessment** versus **evaluation**. |
| OD-07-5 | Confirm the reserved list (§7). |
| OD-07-6 | Confirm the deprecated list (§9). |
| OD-07-7 | Approve the glossary, moving all terms from PROPOSED to APPROVED. |

## Non-effects

Defining a term does not approve the thing it names. **Module**, **route**, **capability**, and **role** are defined here so they can be used precisely — not because any module, route, capability, or role exists or is approved.

## Change history

| Version | Date | Change | Author |
|---|---|---|---|
| 0.1.0-draft | 2026-08-21 | Initial draft for owner review. | AI-assisted authorship |
