# SSLS 3.0 — Start Here

| Field | Value |
|---|---|
| Document ID | SSLS3-DOC-00 |
| Version | 0.1.0-draft |
| Status | DRAFT — OWNER REVIEW REQUIRED |
| Owner | Shelby |
| Last updated | 2026-08-21 |
| Authority level | Navigational. Routes readers to controlling sources. Controls nothing itself. |
| Canonical status | CANDIDATE |

## Purpose

The mandatory entry point for every human and every AI system that touches SSLS 3.0. Read this first, every time.

## Scope

Routing, boundaries, and procedure. This file does **not** restate policy. Where a rule lives elsewhere, this file names the file that holds it.

## Controlling relationships

This file is controlled by [01-SSLS_3.0_PROJECT_CHARTER.md](01-SSLS_3.0_PROJECT_CHARTER.md) and [02-SSLS_3.0_SOURCE_HIERARCHY.md](02-SSLS_3.0_SOURCE_HIERARCHY.md). It controls no concept.

---

## 1. Project identity

**Silver Streak Learning Systems 3.0 (SSLS 3.0).** Owner and final decision-maker: Shelby. `[C]`

**North Star: "Make Learning Visible."** `[C]`

**Naming rule — not interchangeable.** `[C]`

- **SSLS** is the complete modular ecosystem.
- **Silver Streak Learning** is the instructional and educator-facing platform *within* that ecosystem.

Using one name for the other is a defect. See [07-SSLS_3.0_GLOSSARY.md](07-SSLS_3.0_GLOSSARY.md).

## 2. Clean-slate declaration

SSLS 3.0 is built from first principles. It is **not** a rename, migration, upgrade, or inheritance of SSLS 2.0 or any earlier work. `[C]`

Earlier material may be consulted as **HISTORICAL REFERENCE — NON-CONTROLLING**. It acquires authority in SSLS 3.0 only through an explicit, recorded owner promotion. Nothing has been promoted. `[C]`

## 3. Intended audience

Shelby; any future collaborator or reviewer; and every AI system asked to read, draft, analyse, or generate SSLS 3.0 material.

## 4. Mandatory reading order

| Order | File | Why |
|---|---|---|
| 1 | This file | Boundaries and routing |
| 2 | [01 Project Charter](01-SSLS_3.0_PROJECT_CHARTER.md) | Identity, purpose, principles |
| 3 | [02 Source Hierarchy](02-SSLS_3.0_SOURCE_HIERARCHY.md) | What counts as authority |
| 4 | [04 Current Project State](04-SSLS_3.0_CURRENT_PROJECT_STATE.md) | What is true right now |
| 5 | [05 Scope and Boundaries](05-SSLS_3.0_SCOPE_AND_BOUNDARIES.md) | What is permitted |
| 6 | Whichever controlling file your task requires (§6) | |

## 5. Before every task — checklist

1. Read this file.
2. Read [04 Current Project State](04-SSLS_3.0_CURRENT_PROJECT_STATE.md) and note its verification timestamp. If the timestamp is stale, treat status as `[U]`.
3. Identify which single file controls your question (§6).
4. Confirm the work is inside current authorized scope (file 05).
5. Confirm you are not relying on historical material for authority.
6. Label every load-bearing statement `[C]`, `[I]`, `[U]`, or PROPOSED.
7. Stop at any boundary in §9–§11 rather than proceeding on assumption.

## 6. Task routing — which file controls which question

| Your question | Controlling file |
|---|---|
| What is this project, and what does it stand for? | 01 Project Charter |
| Which source wins when two disagree? | 02 Source Hierarchy |
| Is this artifact canonical? What is its status? | 03 Canon Manifest |
| What phase are we in? What is authorized right now? | 04 Current Project State |
| Is this work in scope? | 05 Scope and Boundaries |
| Who is this for, and what problem does it solve? | 06 Product Brief |
| What does this term mean? | 07 Glossary |
| Has this been decided? | 08 Decision Register |
| What must the system do, and how is that verified? | 09 Requirements Register |
| Can we say this publicly? What evidence supports it? | 10 Evidence and Claims Register |
| Where does a file belong? | 11 Repository Map |

**One concept, one controlling source.** If two files appear to control the same concept, that is a defect — record it and stop. See §8.

## 7. Current-state lookup procedure

1. Open [04 Current Project State](04-SSLS_3.0_CURRENT_PROJECT_STATE.md).
2. Read the verification timestamp and evidence cutoff.
3. Use only what is marked `[C]` as fact. Treat `[I]` as interpretation and `[U]` as unknown.
4. Do not reconstruct status from any other file, from a filename, from a folder, or from memory.

No other file may carry a current-state block. A status statement found anywhere else is stale by construction.

## 8. Conflict and uncertainty procedure

1. Stop. Do not resolve a material conflict silently.
2. Apply [02 Source Hierarchy](02-SSLS_3.0_SOURCE_HIERARCHY.md).
3. If the hierarchy resolves it, record the resolution and the artifacts needing update.
4. If it does not, record a conflict entry, mark the affected content `[U]`, and route the question to Shelby.
5. When in doubt, apply the narrower scope, the safer data posture, the stronger access control, and the more conservative claim.

**Unknown is a valid state and never grants permission.**

## 9. AI-use boundaries

Applies to ChatGPT, Claude, Lovable, GitHub Copilot, and every other AI system.

**AI may** research, draft, summarize, restructure, generate candidate content, identify gaps, propose options, write and inspect code, and flag findings.

**AI may not** approve its own output, establish canon, record an owner decision, waive a control, close a risk or finding, promote an artifact or a phase, authorize a claim, assert compliance, merge, migrate, deploy, release, or make any consequential educational, eligibility, placement, disciplinary, safety, employment, medical, or legal decision.

**AI-assisted review is not independent review, human review, or validation.** Any artifact produced with AI assistance must say so in its own review-class field. Simulated reviewers, expert panels, and councils may not be presented as review evidence.

**No student data enters an AI model training path.** No exceptions at any maturity level.

## 10. No-PII and synthetic-data stop line

SSLS 3.0 uses **synthetic, fictional, or non-identifiable data only**. `[C]`

Prohibited: real student, family, caregiver, staff, health, disability, discipline, immigration, safety, credential, or confidential organizational information — and any combination of details that could identify a real person.

Renaming a real record does not make it synthetic.

**District-agnostic.** No real district, school, or municipality name in content, titles, filenames, examples, or metadata. Use `DISTRICT-01`, `SCHOOL-01`, and reserved domains `.example`, `.test`, `.invalid`.

Jurisdiction references — statutes, regulations, agencies, standards bodies — are permitted and are distinct from organizational identifiers.

**Stop immediately** on encountering real PII, an exposed secret or credential, or an organizational identifier. Do not continue the task.

## 11. Prohibited claims

Do not state or imply, in any artifact or any conversation: production readiness · deployment · district adoption, pilot, procurement, endorsement, or affiliation · legal, privacy, or regulatory compliance · security certification or validation · accessibility conformance or independent evaluation · interoperability conformance · educational effectiveness or student outcomes · user research, market fit, or demand · that an AI system cannot leak or hallucinate · that any maturity level has been achieved.

Every claim defaults to **NOT AUTHORIZED** until evidence exists and Shelby approves the wording. See file 10.

## 12. Prohibited without owner authorization

Deleting, renaming, replacing, or modifying an existing source · promoting historical material to canon · committing to a repository · publishing or transmitting externally · introducing real data · expanding scope · selecting a technology stack · declaring a phase or gate outcome · approving a claim · creating an additional governing file.

## 13. Artifact lifecycle

**Propose → Review → Accept → Supersede → Archive.**

1. **Propose.** Draft carries status DRAFT or CANDIDATE, an owner, a date, and its evidence labels. Registered in file 03.
2. **Review.** Checked against charter, scope, hierarchy, glossary, and the claims rules. Findings recorded.
3. **Accept.** Shelby records the decision in file 08. Only this step confers authority. File 03 status changes to CANONICAL.
4. **Supersede.** A successor names what it supersedes; the predecessor is marked SUPERSEDED with a pointer forward. Supersession never occurs by title similarity, filename, date, recency, file size, repetition, or AI inference.
5. **Archive.** Superseded material is retained with lineage intact. **Nothing is deleted.**

## 14. Definition of done for governed work

Work is done when **all** hold:

- One controlling source, no competing duplicate.
- Every load-bearing statement carries `[C]`, `[I]`, `[U]`, or PROPOSED.
- Assumptions and unknowns are visible, not buried.
- Cross-references use real IDs and exact filenames.
- No PII, credential, or organizational identifier appears.
- No prohibited claim appears.
- Required owner decisions are named and routed.
- The artifact states its own review class honestly.
- The artifact ends with explicit non-effects.

## Assumptions and unknowns

| ID | Item | Label |
|---|---|---|
| A-00-1 | The reading order in §4 suits a single-operator project; it is untested with any other reader. | `[I]` |
| U-00-1 | No SSLS 3.0 Project Instructions were available in this environment. This file was drafted from the owner's commissioning instruction alone. | `[U]` |
| U-00-2 | No repository is connected or observable. Nothing here is verified against code. | `[U]` |

## Required owner decisions

| ID | Decision needed |
|---|---|
| OD-00-1 | Confirm or replace the mandatory reading order. |
| OD-00-2 | Confirm the AI-use boundaries in §9 as binding on all connected tools. |
| OD-00-3 | Confirm the definition of done in §14. |

## Non-effects

This file approves nothing, authorizes nothing, and establishes no canon. It routes readers. Placement of any file in any folder or index confers no authority.

## Change history

| Version | Date | Change | Author |
|---|---|---|---|
| 0.1.0-draft | 2026-08-21 | Initial draft for owner review. | AI-assisted authorship |
