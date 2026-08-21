# SSLS 3.0 — Decision Register

| Field | Value |
|---|---|
| Document ID | SSLS3-DOC-08 |
| Version | 0.1.0-draft |
| Status | DRAFT — OWNER REVIEW REQUIRED |
| Owner | Shelby |
| Last updated | 2026-08-21 |
| Authority level | Register. Holds decision status for SSLS 3.0. |
| Canonical status | CANDIDATE |
| Review class | AI-assisted authorship. Not independent review, not human review, not validation. |

## Purpose

To hold every SSLS 3.0 decision — recorded and open — in one place, so that no decision's standing has to be inferred from prose scattered across the foundation files.

## Scope

Decision identity, basis, consequence, reversibility, revisit trigger, and status. Does not rank sources (file 02), assign artifact status (file 03), state project status (file 04), or authorize a claim (file 10).

## Controlling relationships

**Controls:** decision status.

**Controlled by:** the owner. Only Shelby records, amends, or closes a decision. `[C]`

**Defers to:** [02-SSLS_3.0_SOURCE_HIERARCHY.md](02-SSLS_3.0_SOURCE_HIERARCHY.md) for conflict resolution; [07-SSLS_3.0_GLOSSARY.md](07-SSLS_3.0_GLOSSARY.md) for terminology.

## Provenance of this file

This register was **reconstructed**, not transcribed. `[C]` The foundation package cited a decision register as controlling, but no such register existed in any available source. `D-3001` through `D-3010` are named — by subject only — in [04-SSLS_3.0_CURRENT_PROJECT_STATE.md](04-SSLS_3.0_CURRENT_PROJECT_STATE.md) §6. Their wording here is taken from the charter, hierarchy, manifest, and scope files, which already state each subject in normative language. `[I]`

The reconstruction is offered for owner **correction**, not owner ratification. A decision does not become recorded because it appears in this file.

---

## 1. Status values

| Status | Meaning | Authority |
|---|---|---|
| `RECORDED` | Owner has decided; the decision is in force | Full, within its subject |
| `RECONSTRUCTED` | Wording derived from other foundation files; awaiting owner confirmation | **None** |
| `OPEN` | Stated as a question; no decision exists | **None** |
| `SUPERSEDED` | Replaced by a later decision that names it | Historical record |
| `WITHDRAWN` | Retracted before taking effect | Historical record |

Only `RECORDED` carries authority. Every row in §2 is currently `RECONSTRUCTED`; every row in §3 is `OPEN`. **No decision in this file carries authority today.** `[C]`

## 2. Decisions derived from the owner commissioning instruction

Basis for all ten: the owner commissioning instruction of 2026-08-21. `[C]` Wording: reconstructed. `[I]`

| ID | Subject | Decision as stated in the foundation files | Source | Consequence | Reversibility | Revisit trigger | Status |
|---|---|---|---|---|---|---|---|
| D-3001 | Project identity | The project is **Silver Streak Learning Systems 3.0**, abbreviated SSLS 3.0. SSLS is the complete modular ecosystem; Silver Streak Learning is the instructional and educator-facing platform within it. The names are not interchangeable. | File 01 §1 | All artifacts, IDs, and prose use the exact names | Low cost early, high cost after any external use | Any ecosystem restructure | RECONSTRUCTED |
| D-3002 | North Star | The North Star is **Make Learning Visible**, licensing structure, evidence, traceability, and explainability — and not monitoring, behavioural tracking, engagement optimization, or collection beyond a stated purpose. | File 01 §2 | Every scope and capability proposal is tested against it | Reversible while no product exists | Any proposed capability that visibility alone cannot justify | RECONSTRUCTED |
| D-3003 | Naming rule | SSLS and Silver Streak Learning are distinct names; substituting one for the other is a defect, not a style choice. | File 01 §1 | Naming errors are findings, not preferences | Reversible | Ecosystem or brand change | RECONSTRUCTED |
| D-3004 | Clean-slate mandate | SSLS 3.0 is built from first principles. No SSLS 2.0 schema, role model, route set, module list, technology choice, gate model, maturity claim, or implementation status carries forward. Earlier material is HISTORICAL_REFERENCE — non-controlling. | File 01 §3; file 02 §11 | Nothing historical may be cited as authority | Reversible only by explicit promotion of a **named** artifact | An owner promotion decision | RECONSTRUCTED |
| D-3005 | Decision authority | Shelby is the owner and final decision-maker. AI may research and draft; it may not approve its own output, establish canon, or record a decision. | File 01 §1, §12; file 00 §9 | No gate closes without a recorded owner act | Reversible when a second reviewer exists | First additional participant | RECONSTRUCTED |
| D-3006 | Data posture | Synthetic, fictional, or non-identifiable data only. Real personal data is prohibited; the project is district-agnostic; no student data enters any AI training path, at any maturity level. | File 05 §4; file 00 §10 | Stop-line behaviour on encountering real PII | The AI-training prohibition is **not** reversible; the rest requires charter amendment | Any authorized real-data pilot proposal | RECONSTRUCTED |
| D-3007 | Default deny | Absence, ambiguity, or mismatch denies. Unknown never grants permission. Anything not explicitly authorized is out of scope. | File 01 §8.2; file 05 §1 | Silence is never treated as permission | Reversible | A demonstrated case where default-deny blocks safe work | RECONSTRUCTED |
| D-3008 | Package status | All twelve foundation artifacts are CANDIDATE. None is approved; none carries authority. | File 03 §2; file 04 §11 | No foundation file may be cited as authority | Reversible per artifact by owner acceptance | Owner review of the package | RECONSTRUCTED |
| D-3009 | Claims default | Every claim defaults to **NOT AUTHORIZED** until evidence exists and the owner approves the exact wording. | File 00 §11; file 10 | Zero authorized claims today | Reversible per claim, never in general | An evidence-backed claim proposal | RECONSTRUCTED |
| D-3010 | Version scheme | Artifacts carry semantic draft versions (`0.1.0-draft`). DRAFT is a version state, not a status, and never accompanies CANONICAL. | File 03 §1; file 11 §7–8 | Version and status are separate fields | Reversible | Repository platform decision (OD-11-1) | RECONSTRUCTED |

**None of these ten has been independently ratified.** File 04 §11 places the project between rungs 3 and 5 of the state-progression ladder for exactly this reason. `[C]`

## 3. Open decisions

Every `OD-NN-N` cited anywhere in the foundation package, consolidated. Priority 1 blocks everything downstream. `[C]`

### Priority 1

| ID | Decision needed | Source |
|---|---|---|
| OD-04-1 | Confirm or set the program phase, and confirm whether a phase/maturity model is needed at all | File 04 |
| OD-03-2 | Confirm that all twelve foundation artifacts remain CANDIDATE pending individual approval — accept, revise, or reject each | Files 03, 04 |
| OD-02-1 | Confirm the eight-rank authority hierarchy | File 02 |
| OD-01-1 | Confirm the North Star statement and its stated limits | File 01 |

### Priority 2

| ID | Decision needed | Source |
|---|---|---|
| OD-05-1 | Confirm the current authorized scope | File 05 |
| OD-01-6 | Set the accessibility conformance target | File 01 |
| OD-04-2 | Decide whether to build a phase/maturity model now or defer it | File 04 |
| OD-03-3 | Confirm that no historical artifact is promoted. Default: none | File 03 |

### Priority 3

| ID | Decision needed | Source |
|---|---|---|
| OD-06-1 | Confirm or revise the problem statement | File 06 |
| OD-11-1 | Decide whether a repository is created, and on what platform | File 11 |
| OD-04-3 | Decide how R-02 (governance burden) and R-06 (self-approval) are controlled | File 04 |

### Remaining open decisions, by source file

| ID | Decision needed |
|---|---|
| OD-00-1 | Confirm or replace the mandatory reading order |
| OD-00-2 | Confirm the AI-use boundaries as binding on all connected tools |
| OD-00-3 | Confirm the definition of done for governed work |
| OD-01-2 | Confirm or revise the purpose statement |
| OD-01-3 | Confirm the ten governing principles |
| OD-01-4 | Confirm the educational commitments as binding design constraints |
| OD-01-5 | Confirm the AI boundary as binding on all connected tools |
| OD-01-7 | Confirm the three success dimensions and their thresholds |
| OD-01-8 | Decide whether any named historical artifact is promoted. Default: none |
| OD-02-2 | Confirm the normative/descriptive separation |
| OD-02-3 | Confirm that AI memory and AI summaries carry no authority |
| OD-02-4 | Confirm the stop conditions as binding |
| OD-02-5 | Confirm that no historical artifact is promoted by default |
| OD-03-1 | Confirm the nine status values |
| OD-03-4 | Decide whether a full historical inventory is required, and at what depth |
| OD-03-5 | Confirm the handling of restricted items H-021 through H-023 — reference by ID only, do not open |
| OD-05-2 | Confirm the twelve prohibitions as charter-level |
| OD-05-3 | Confirm the data boundary, including the district-agnostic rule |
| OD-05-4 | Confirm the scope-change process and authorization triggers |
| OD-05-5 | Indicate whether any future-state possibility should be promoted to a near-term decision |
| OD-06-2 | Confirm the user hypotheses, and decide whether any user contact is planned |
| OD-06-3 | Confirm or revise the eight proposed capability areas |
| OD-06-4 | Decide which capability area, if any, becomes the first vertical slice |
| OD-06-5 | Decide whether baselines will be established, and how, given no user access |
| OD-06-6 | Confirm the minimum viable foundation |
| OD-06-7 | Decide how PR-05 — building for hypothetical users — is controlled |
| OD-07-1 | Resolve the two senses of **platform** |
| OD-07-2 | Resolve **evidence** — governance evidence versus instructional evidence |
| OD-07-3 | Resolve the three senses of **review** |
| OD-07-4 | Resolve **assessment** versus **evaluation** |
| OD-07-5 | Confirm the reserved term list |
| OD-07-6 | Confirm the deprecated term list |
| OD-07-7 | Approve the glossary, moving all terms from PROPOSED to APPROVED |
| OD-11-2 | Decide whether reserved directories are created empty or on first need |
| OD-11-3 | Confirm the naming and ID conventions |
| OD-11-4 | Decide the register format for version control — `.xlsx` binary versus a text-based alternative |
| OD-11-5 | Confirm that no historical material enters the SSLS 3.0 structure |

**Total open decisions cited in the foundation package: 48.** `[C]`

`[U]` File 04 §6 states that **twenty-eight** decisions are open. The count above is derived by enumerating every `OD-NN-N` actually cited across files 00–07 and 11, and it does not reconcile. No rows were invented to reach 28, and none were dropped to reach it. Either file 04's count is stale or it counts a subset — the owner resolves which. Recorded here as an unresolved discrepancy, not silently corrected. See OD-08-1.

## 4. Decisions this register itself raises

| ID | Decision needed |
|---|---|
| OD-08-1 | Reconcile the open-decision count: 48 enumerated here versus 28 stated in file 04 §6 |
| OD-08-2 | Confirm or correct the reconstructed wording of `D-3001` through `D-3010`, moving each from RECONSTRUCTED to RECORDED or amending it |
| OD-08-3 | Confirm that this register, in markdown, is the controlling decision surface — superseding the `.xlsx` filename cited in files 03 and 11 (relates to OD-11-4) |

## Assumptions and unknowns

| ID | Item | Label |
|---|---|---|
| A-08-1 | The subjects listed in file 04 §6 map one-to-one, in order, to `D-3001` through `D-3010`. | `[I]` |
| A-08-2 | Where a foundation file states a subject in normative language, that wording reflects the owner's intent for the corresponding decision. | `[I]` |
| U-08-1 | No original decision register was available in any connected source. | `[U]` |
| U-08-2 | Whether the owner intends decisions to be numbered `D-3001`+ beyond the initial ten. | `[U]` |

## Non-effects

This file records decision status. It does not make a decision, close a decision, ratify a reconstruction, confer authority on any artifact, resolve the count discrepancy in §3, or authorize any work. A decision becomes RECORDED only when the owner records it.

## Change history

| Version | Date | Change | Author |
|---|---|---|---|
| 0.1.0-draft | 2026-08-21 | Initial reconstruction from cited content in files 00–07 and 11. No original register existed. | AI-assisted authorship |
