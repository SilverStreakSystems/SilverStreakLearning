# SSLS 3.0 — Canon Manifest

| Field | Value |
|---|---|
| Document ID | SSLS3-DOC-03 |
| Version | 0.1.0-draft |
| Status | DRAFT — OWNER REVIEW REQUIRED |
| Owner | Shelby |
| Last updated | 2026-08-21 |
| Authority level | Controlling. Defines artifact status and canonicality for SSLS 3.0. |
| Canonical status | CANDIDATE |
| Review class | AI-assisted authorship. Not independent review, not human review, not validation. |

## Purpose

To hold the authoritative inventory of SSLS 3.0 artifacts and their status, so that no artifact's standing has to be inferred.

## Scope

Artifact identity, status, authority, provenance, and lineage. Does not rank sources (file 02), record decisions (file 08), or state project status (file 04).

## Controlling relationships

**Controls:** artifact status and canonicality.

**Controlled by:** [02-SSLS_3.0_SOURCE_HIERARCHY.md](02-SSLS_3.0_SOURCE_HIERARCHY.md) and owner decisions in [08-SSLS_3.0_DECISION_REGISTER.xlsx](08-SSLS_3.0_DECISION_REGISTER.xlsx).

---

## 1. Status definitions

| Status | Definition | Authority | May be cited as |
|---|---|---|---|
| `CANONICAL` | Approved by recorded owner decision; controls its concept | Full, within its concept | Authority |
| `PROVISIONAL` | Owner-approved for bounded, temporary use pending a successor | Bounded and time-limited | Authority, with its stated limits |
| `CANDIDATE` | Complete enough to review; no accepting decision exists | **None** | Proposal only |
| `RESEARCH` | Investigative or exploratory material | **None** | Input to a decision |
| `HISTORICAL_REFERENCE` | SSLS 2.0 or earlier; non-controlling | **None** | Evidence of what was previously considered |
| `SUPERSEDED` | Replaced by a named successor via recorded decision | **None** | Historical record; retained, never deleted |
| `REJECTED` | Considered and declined by recorded decision | **None** | Record of a path not taken |
| `GENERATED` | Produced by tooling or AI from another source | **None** | Derived output; cite the source instead |
| `EXTERNAL_REFERENCE` | Third-party material referenced but not adopted | **None** | External input; cite by name, version, date |

**Only `CANONICAL` and `PROVISIONAL` carry authority.** Everything else is input.

`DRAFT` is a version state, not a status — it may accompany `CANDIDATE` but never `CANONICAL`.

## 2. Manifest — SSLS 3.0 foundation package

All twelve artifacts are `CANDIDATE`. None is approved. `[C]`

| Artifact ID | Filename | Title | Type | Ver | Status | Authority | Owner | Effective | Review | Controlling concept | Supersedes | Superseded by | Dependencies | Provenance |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| SSLS3-DOC-00 | `00-SSLS_3.0_START_HERE.md` | Start Here | Navigation | 0.1.0-draft | CANDIDATE | None | Shelby | — | On approval | Reader routing (controls nothing) | — | — | 01, 02, 04 | AI-assisted, 2026-08-21 |
| SSLS3-DOC-01 | `01-SSLS_3.0_PROJECT_CHARTER.md` | Project Charter | Governance | 0.1.0-draft | CANDIDATE | None | Shelby | — | On approval | Identity, purpose, North Star, principles | — | — | 08 | AI-assisted, 2026-08-21 |
| SSLS3-DOC-02 | `02-SSLS_3.0_SOURCE_HIERARCHY.md` | Source Hierarchy | Governance | 0.1.0-draft | CANDIDATE | None | Shelby | — | On approval | Authority and conflict resolution | — | — | 01, 08 | AI-assisted, 2026-08-21 |
| SSLS3-DOC-03 | `03-SSLS_3.0_CANON_MANIFEST.md` | Canon Manifest | Governance | 0.1.0-draft | CANDIDATE | None | Shelby | — | On approval | Artifact status and canonicality | — | — | 02, 08 | AI-assisted, 2026-08-21 |
| SSLS3-DOC-04 | `04-SSLS_3.0_CURRENT_PROJECT_STATE.md` | Current Project State | Status | 0.1.0-draft | CANDIDATE | None | Shelby | — | Continuous | Dynamic phase, status, blockers, next work | — | — | 02, 03, 08, 10 | AI-assisted, 2026-08-21 |
| SSLS3-DOC-05 | `05-SSLS_3.0_SCOPE_AND_BOUNDARIES.md` | Scope and Boundaries | Governance | 0.1.0-draft | CANDIDATE | None | Shelby | — | On approval | Scope, exclusions, future-state separation | — | — | 01, 08 | AI-assisted, 2026-08-21 |
| SSLS3-DOC-06 | `06-SSLS_3.0_PRODUCT_BRIEF.md` | Product Brief | Product | 0.1.0-draft | CANDIDATE | None | Shelby | — | On approval | Problem, value, users, outcomes | — | — | 01, 05, 07 | AI-assisted, 2026-08-21 |
| SSLS3-DOC-07 | `07-SSLS_3.0_GLOSSARY.md` | Glossary | Governance | 0.1.0-draft | CANDIDATE | None | Shelby | — | On approval | Terminology | — | — | 01 | AI-assisted, 2026-08-21 |
| SSLS3-DOC-08 | `08-SSLS_3.0_DECISION_REGISTER.xlsx` | Decision Register | Register | 0.1.0-draft | CANDIDATE | None | Shelby | — | Continuous | Decision status | — | — | 02, 09, 10 | AI-assisted, 2026-08-21 |
| SSLS3-DOC-09 | `09-SSLS_3.0_REQUIREMENTS_REGISTER.xlsx` | Requirements Register | Register | 0.1.0-draft | CANDIDATE | None | Shelby | — | Continuous | Requirements and acceptance criteria | — | — | 08, 10 | AI-assisted, 2026-08-21 |
| SSLS3-DOC-10 | `10-SSLS_3.0_EVIDENCE_AND_CLAIMS_REGISTER.xlsx` | Evidence and Claims Register | Register | 0.1.0-draft | CANDIDATE | None | Shelby | — | Continuous | Validation evidence and claim authorization | — | — | 08, 09 | AI-assisted, 2026-08-21 |
| SSLS3-DOC-11 | `11-SSLS_3.0_REPOSITORY_MAP.md` | Repository Map | Structure | 0.1.0-draft | CANDIDATE | None | Shelby | — | On approval | File locations and structural relationships | — | — | 02, 03 | AI-assisted, 2026-08-21 |

## 3. Historical inventory

`HISTORICAL_REFERENCE — NON-CONTROLLING` in every case. None is promoted. None controls SSLS 3.0. `[C]`

**Observation channel and limits.** These filenames were observed in a connected Google Drive corpus during an SSLS 2.0 analysis session on 2026-08-19, not in an SSLS 3.0 project source library. Observation establishes existence and title only. It does not establish content currency, authority, correctness, or absence of PII. `[C]`

The corpus reported **530 items (69 folders, 461 files)** at that observation. The entries below are a bounded selection of the most substantive, not the full inventory. `[C]`

| Hist ID | Exact filename or title | Type | Status | Note |
|---|---|---|---|---|
| H-001 | `GOV-001_Project_Charter_v2.2_EFFECTIVE_CONTROLLED_MIRROR_2026-08-15` | Governance | HISTORICAL_REFERENCE | SSLS 2.0 charter. Non-controlling. |
| H-002 | `GOV-001_Project_Charter_v2.3_Candidate_Controlled_Revision_2026-08-06.md` | Governance | HISTORICAL_REFERENCE | Candidate revision of H-001. |
| H-003 | `CRK-001_Clean_Restart_Keep_and_Reimplementation_Standard.md` | Governance | HISTORICAL_REFERENCE | Clean-restart rules from the prior effort. |
| H-004 | `IRR-001_Legacy_Idea_Import_Review_Template.md` | Template | HISTORICAL_REFERENCE | Prior idea-import instrument. |
| H-005 | `ASM-001_v1.0_Approved_Active_Source_Manifest.md` | Register | HISTORICAL_REFERENCE | Prior source manifest. |
| H-006 | `NSM-001_v1.0_Approved_Active_and_Historical_Namespace_Map.md` | Register | HISTORICAL_REFERENCE | Prior namespace map. |
| H-007 | `REPO-BOOT-001_Clean_Repository_Bootstrap_Specification.md` | Specification | HISTORICAL_REFERENCE | Prior repository bootstrap spec. |
| H-008 | `REPO-STRUCT-001_SSLS_Complete_Repository_Tree.md` | Specification | HISTORICAL_REFERENCE | Prior target repository tree. |
| H-009 | `REPO-MAP-001_Current_vs_Target_Repository_Map_v0.1_2026-08-06.md` | Specification | HISTORICAL_REFERENCE | Prior path classification. |
| H-010 | `FIRST-COMMIT-001_First_Controlled_Commit_Review_v0.1_2026-08-07.md` | Specification | HISTORICAL_REFERENCE | Prior first-commit payload review. |
| H-011 | `Universal_Learning_Website_Accessibility_Standard_v1.4.pdf` | Standard | HISTORICAL_REFERENCE | Prior accessibility standard. Not adopted by SSLS 3.0. |
| H-012 | `Universal_Learning_Website_Accessibility_Standard_v1.3.pdf` | Standard | HISTORICAL_REFERENCE | Predecessor of H-011. |
| H-013 | `BRAND-PROG-002_Superseding_Brand_v2_Governance_Program.md` | Governance | HISTORICAL_REFERENCE | Prior brand governance program. |
| H-014 | `COM-001_Approved_Commercial_and_IP_Direction.md` | Governance | HISTORICAL_REFERENCE | Prior commercial direction. |
| H-015 | `SSLS_Modular_K12_Reference_Architecture_v0.6_Revised_Research_Candidate.pdf` | Research | HISTORICAL_REFERENCE | Prior target-state architecture research candidate. |
| H-016 | `MA_Grades_7_12_Standards_WIDA_Crosswalk_v1_0.xlsx` | Research | HISTORICAL_REFERENCE | Jurisdiction standards corpus with recorded hashes. |
| H-017 | `MA_PreK12_Standards_Reference_Guide.xlsx` | Research | HISTORICAL_REFERENCE | Jurisdiction standards corpus. |
| H-018 | `MA_PreK12_Framework_Forensic_Review.pdf` | Research | HISTORICAL_REFERENCE | Analysis of H-016/H-017 sources. |
| H-019 | `K12_Research_Frameworks_Catalog.md` | Research | HISTORICAL_REFERENCE | Framework catalog; internal counts conflicted. |
| H-020 | `SSLS 2.0 - Gate 1 Control Workbook v0.24.0 - 2026-08-15` | Register | HISTORICAL_REFERENCE | Prior operating control surface. |
| H-021 | *Withheld — filename contains an organizational identifier* | Register | HISTORICAL_REFERENCE — RESTRICTED | Referenced by ID only. Filename not reproduced per the district-agnostic rule. |
| H-022 | *Withheld — filename contains an organizational identifier* | Workbook | HISTORICAL_REFERENCE — RESTRICTED | Reported to contain coded records with language, IEP, and 504 fields. **Do not open for SSLS 3.0 purposes.** |
| H-023 | *Withheld — archive; contents unexamined* | Archive | HISTORICAL_REFERENCE — RESTRICTED | Reported to contain real organizational email addresses. **Do not open.** |

**Explicit non-duplication rule.** Several historical titles appear to repeat. Repetition of a title, a size, or a date is **not** evidence of duplication. `[C]` No historical item is classified as a duplicate here, and none may be deleted, renamed, merged, or modified on that basis.

## 4. External references

| Ext ID | Reference | Status | Note |
|---|---|---|---|
| X-001 | W3C WCAG 2.2 | EXTERNAL_REFERENCE | Not adopted. Conformance target is an open decision. |
| X-002 | W3C WCAG 3.0 (Working Draft) | EXTERNAL_REFERENCE | Draft; not a conformance standard. |
| X-003 | US DOJ ADA Title II web and mobile accessibility rule | EXTERNAL_REFERENCE | Regulatory context only; no applicability determination made. |
| X-004 | Ed-Fi Data Standard | EXTERNAL_REFERENCE | Not adopted. No conformance claim. |
| X-005 | 1EdTech OneRoster | EXTERNAL_REFERENCE | Not adopted. No conformance claim. |

`[U]` Version numbers, editions, and effective dates for X-001 through X-005 are deliberately omitted here. Recording a version creates a currency obligation, and no re-verification schedule exists yet. Populate on approval of OD-03-4.

## 5. Manifest maintenance

**Registration.** Every governed artifact is registered at creation with ID, filename, type, version, status, owner, controlling concept, dependencies, and provenance. An unregistered artifact has no standing.

**Update triggers.** Version change · status change · owner decision · supersession · dependency change · discovery of a conflict or defect · expiry of supporting evidence.

**Review cadence.** Every artifact carries a review trigger. `CANDIDATE` artifacts are reviewed when the owner takes them up. `CANONICAL` artifacts are reviewed on their stated trigger, and at minimum whenever a controlling dependency changes.

## 6. Promotion procedure

1. Artifact meets the canonicalization requirements in file 02 §7.
2. A decision is proposed in file 08 naming the exact artifact and version.
3. Shelby records the accepting decision.
4. This manifest is updated: status, authority, effective date, review trigger.
5. Dependents are checked for conflict.
6. File 04 is updated if the promotion changes project status.

**Steps 1–2 without step 3 leave the artifact a CANDIDATE.** No promotion occurs by placement, reference, citation, or AI inference.

## 7. Supersession procedure

1. Successor names the superseded artifact and version.
2. Owner records the supersession decision in file 08.
3. Predecessor status becomes `SUPERSEDED` with a forward pointer.
4. Predecessor is **retained**. Nothing is deleted.
5. Dependents are updated.
6. Claims resting on the predecessor are reopened.

## 8. Integrity procedures

| Check | Rule |
|---|---|
| One concept, one controller | No two `CANONICAL` artifacts may declare the same controlling concept. A collision is a stop condition. |
| No orphan authority | Every `CANONICAL` artifact traces to an accepting decision ID. |
| No circular authority | A controls B, B controls A is a defect. |
| No silent promotion | Status changes only via recorded decision. |
| No stale status blocks | Only file 04 carries current status. |
| Filename fidelity | Historical artifacts referenced by exact filename, except where the filename carries an organizational identifier. |
| Retention | Nothing deleted, ever. |

## Assumptions and unknowns

| ID | Item | Label |
|---|---|---|
| A-03-1 | Nine status values are sufficient without being unusable. | `[I]` |
| A-03-2 | The historical selection in §3 covers the most substantive prior material. | `[I]` |
| U-03-1 | The full historical corpus has not been enumerated for SSLS 3.0. §3 is a bounded selection of ~23 from a reported 530-item corpus. | `[U]` |
| U-03-2 | Content, currency, and PII status of every historical item is unverified. | `[U]` |
| U-03-3 | No SSLS 3.0 project source library was available to inventory. | `[U]` |
| U-03-4 | Whether items H-022 and H-023 contain protected data is reported but unconfirmed by direct inspection — and deliberately not confirmed, because inspection would risk exposure. | `[U]` |

## Required owner decisions

| ID | Decision needed |
|---|---|
| OD-03-1 | Confirm the nine status values (§1). |
| OD-03-2 | Confirm that all twelve foundation artifacts remain CANDIDATE pending individual approval. |
| OD-03-3 | Confirm that no historical artifact is promoted. Default: none. |
| OD-03-4 | Decide whether a full historical inventory is required, and at what depth. |
| OD-03-5 | Confirm the handling of restricted items H-021 through H-023 — reference by ID only, do not open. |

## Non-effects

This manifest does not approve any artifact, grant authority, promote historical material, or classify anything as a duplicate. Registration is not approval.

## Change history

| Version | Date | Change | Author |
|---|---|---|---|
| 0.1.0-draft | 2026-08-21 | Initial draft for owner review. | AI-assisted authorship |
