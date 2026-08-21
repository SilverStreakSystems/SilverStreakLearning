# SSLS 3.0 — Repository Map

| Field | Value |
|---|---|
| Document ID | SSLS3-DOC-11 |
| Version | 0.1.0-draft |
| Status | DRAFT — OWNER REVIEW REQUIRED |
| Owner | Shelby |
| Last updated | 2026-08-21 |
| Authority level | Controlling. Defines file locations and structural relationships. |
| Canonical status | CANDIDATE |
| Review class | AI-assisted authorship. Not independent review, not human review, not validation. |

> ## ⚠ Nothing here exists
>
> **No repository is connected, created, or observable.** `[C]` Every path below is **PROPOSED — NOT IMPLEMENTED**. This is a structural proposal, not a description and not proof of implementation.
>
> No codebase, service, database, integration, route, environment, or deployment exists or is claimed to exist. `[C]`

## Purpose

To propose where artifacts would live and how they would relate — so that structure is decided deliberately rather than accreting.

## Scope

Structure, naming, placement, and the relationship between storage locations. Does not define artifact status (file 03) or authority (file 02).

## Controlling relationships

**Controls:** file locations and structural relationships.

**Controlled by:** [02-SSLS_3.0_SOURCE_HIERARCHY.md](02-SSLS_3.0_SOURCE_HIERARCHY.md) and [03-SSLS_3.0_CANON_MANIFEST.md](03-SSLS_3.0_CANON_MANIFEST.md).

---

## 1. Repository purpose

If created, an SSLS 3.0 repository would hold the version-controlled record of governance artifacts, specifications, and — later — code, with an independent history and no inherited ancestry. `[I]` PROPOSED

**Placement in the repository confers no authority.** A committed file is not an approved file. Authority comes only from file 03 status plus a recorded decision in file 08. `[C]`

## 2. Proposed root structure

**PROPOSED — NOT IMPLEMENTED.** No directory below exists. `[C]`

```text
ssls-3.0/                        PROPOSED — NOT IMPLEMENTED
├── README.md                    Entry point; mirrors file 00 routing
├── docs/
│   ├── 00-governance/           Charter, hierarchy, manifest, state, scope, glossary
│   ├── 01-product/              Product brief and product decisions
│   ├── 02-requirements/         Requirements and acceptance criteria
│   ├── 03-design/               IA, interaction, content, design tokens
│   ├── 04-architecture/         System context, contexts, decisions
│   ├── 05-data/                 Object model, dictionary, classification
│   ├── 06-security/             Authorization, threat model, secrets policy
│   ├── 07-accessibility/        Profile, test scripts, findings
│   ├── 08-testing/              Test plan, cases, coverage
│   ├── 09-release/              Release standard, checklists, procedures
│   ├── 10-portfolio/            Claims register, case material
│   └── 11-operations/           Status, dependencies, gaps
├── registers/                   The .xlsx registers (files 08, 09, 10)
├── evidence/                    Evidence receipts, organized by subject
├── research/                    RESEARCH-class material; no authority
├── archive/                     SUPERSEDED material, retained with lineage
├── src/                         PROPOSED — NOT IMPLEMENTED. No code exists
├── db/                          PROPOSED — NOT IMPLEMENTED. No schema exists
├── tests/                       PROPOSED — NOT IMPLEMENTED. No tests exist
├── scripts/                     PROPOSED — NOT IMPLEMENTED
└── .github/                     PROPOSED — NOT IMPLEMENTED. No automation exists
```

`[U]` Whether `src/`, `db/`, `tests/`, `scripts/`, and `.github/` should exist as empty reserved names or be created only when needed is undecided — OD-11-2. Empty reserved directories in the prior effort were observed to imply capability that did not exist.

## 3. Directory responsibilities

| Directory | Holds | Does not hold |
|---|---|---|
| `docs/00-governance/` | Controlling governance artifacts | Product content, status of work |
| `docs/01-product/` | Problem, value, users, outcomes | Requirements, architecture |
| `docs/02-requirements/` | Testable requirements and acceptance criteria | Design or implementation detail |
| `docs/03-design/` | Structure, interaction, content, tokens | Brand assets, code |
| `docs/04-architecture/` | Context, boundaries, architectural decisions | Data dictionary, code |
| `docs/05-data/` | Object model, dictionary, classification | Physical schema |
| `docs/06-security/` | Authorization model, threat model, policies | Secrets, credentials — **ever** |
| `docs/07-accessibility/` | Profile, test scripts, findings | Conformance claims |
| `docs/08-testing/` | Plans, cases, coverage | Test results — those are evidence |
| `docs/09-release/` | Standard, checklists, procedures | Release claims |
| `docs/10-portfolio/` | Claims register, case material | Unapproved claims |
| `docs/11-operations/` | Status, dependencies, gaps | Governance policy |
| `registers/` | The three `.xlsx` registers | Narrative documents |
| `evidence/` | Receipts of things that happened | Assertions, drafts |
| `research/` | RESEARCH-class material | Anything cited as authority |
| `archive/` | SUPERSEDED artifacts with lineage | Anything current |

## 4. Controlling source per concept

Exactly one controller per concept. A second controller is a defect. `[C]`

| Concept | Controlling artifact |
|---|---|
| Identity, purpose, North Star, principles | `01-SSLS_3.0_PROJECT_CHARTER.md` |
| Authority and conflict resolution | `02-SSLS_3.0_SOURCE_HIERARCHY.md` |
| Artifact status and canonicality | `03-SSLS_3.0_CANON_MANIFEST.md` |
| Dynamic project status | `04-SSLS_3.0_CURRENT_PROJECT_STATE.md` |
| Scope, exclusions, future-state separation | `05-SSLS_3.0_SCOPE_AND_BOUNDARIES.md` |
| Product problem, value, users, outcomes | `06-SSLS_3.0_PRODUCT_BRIEF.md` |
| Terminology | `07-SSLS_3.0_GLOSSARY.md` |
| Decision status | `08-SSLS_3.0_DECISION_REGISTER.xlsx` |
| Requirements and acceptance criteria | `09-SSLS_3.0_REQUIREMENTS_REGISTER.xlsx` |
| Evidence and claim authorization | `10-SSLS_3.0_EVIDENCE_AND_CLAIMS_REGISTER.xlsx` |
| File locations and structure | `11-SSLS_3.0_REPOSITORY_MAP.md` |
| Reader routing | `00-SSLS_3.0_START_HERE.md` — routes only, controls nothing |

## 5. Current versus proposed paths

| Artifact | Current location | Proposed path | Status |
|---|---|---|---|
| All twelve foundation files | Delivered as standalone files for owner review; **not committed anywhere** | `docs/00-governance/` (00–07, 11) and `registers/` (08–10) | PROPOSED — NOT IMPLEMENTED |

`[C]` The twelve files currently exist only as draft deliverables awaiting review. They have not been uploaded to any source library, committed to any repository, or placed in any structure.

## 6. Generated versus human-maintained

| Type | Rule |
|---|---|
| **Human-maintained** | Authored and owned by a person. May be canonical. |
| **AI-assisted** | Drafted with AI, reviewed and owned by a person. May become canonical **only** after owner acceptance. Must declare its review class. |
| **Generated** | Produced by tooling from another source. Status `GENERATED`. **Never canonical.** Cite the source, never the generated output. |

Generated files carry a header stating that they are generated, what generated them, from what source, and that manual edits will be overwritten.

**All twelve foundation artifacts are AI-assisted**, not generated, and all are CANDIDATE. `[C]`

## 7. Naming conventions

`[I]` PROPOSED.

| Item | Convention | Example |
|---|---|---|
| Governance document | `NN-SSLS_3.0_NAME.md` | `01-SSLS_3.0_PROJECT_CHARTER.md` |
| Register | `NN-SSLS_3.0_NAME.xlsx` | `08-SSLS_3.0_DECISION_REGISTER.xlsx` |
| Other document | `AREA-NAME_vMAJOR.MINOR.PATCH.md` | `arch-system_context_v0.1.0.md` |
| Evidence | `EV-NNNN_subject_YYYY-MM-DD.ext` | `EV-0001_environment_check_2026-08-21.md` |
| Archived | Original filename, unchanged, under `archive/` | — |

Rules: no spaces · no real organizational names · no personal names except the owner's where required · version in the filename only where the file is not otherwise versioned · **never rename an archived file**.

## 8. Artifact ID conventions

| Prefix | Applies to | Format |
|---|---|---|
| `SSLS3-DOC-NN` | Foundation documents | Two digits, matching the file number |
| `D-3NNN` | Decisions | Sequential from D-3001 |
| `REQ-AREA-NNN` | Requirements | Area code plus sequence |
| `AC-AREA-NNN-N` | Acceptance criteria | Requirement ID plus sequence |
| `EV-NNNN` | Evidence items | Sequential |
| `CL-NNNN` | Claims | Sequential |
| `F-NNNN` | Findings | Sequential |
| `H-NNN` | Historical references | Sequential |
| `X-NNN` | External references | Sequential |
| `OD-NN-N` | Owner decisions required | File number plus sequence |

**IDs are permanent.** A title may change; an ID never does. IDs are never reused, even after rejection or supersession. `[C]`

## 9. Placement rules

1. One artifact, one location. No copies in two places.
2. Placement never confers authority.
3. Superseded material moves to `archive/` and is never deleted.
4. Research stays in `research/` and is never cited as authority.
5. Evidence goes in `evidence/`; assertions do not.
6. **No secret, credential, token, key, or connection string in any location, ever.**
7. Nothing bearing an organizational identifier is committed.
8. Registers stay in `registers/`; narrative stays in `docs/`.

## 10. Generated-file warnings

Any generated file must carry, at the top:

```text
GENERATED FILE — DO NOT EDIT
Generated by: <tool and version>
From source: <exact source path and version>
Generated: <ISO date>
Status: GENERATED — no authority. Cite the source, not this file.
```

## 11. Archival and supersession structure

```text
archive/
├── superseded/     Artifacts replaced by a named successor
├── rejected/       Artifacts declined by recorded decision
└── historical/     SSLS 2.0 and earlier, if ever brought in
```

Rules: retain the original filename · record the superseding artifact ID and the deciding decision ID · **never delete** · never edit an archived artifact · archived material is never cited as current.

`[C]` No historical material has been brought into any SSLS 3.0 structure, and none is proposed to be.

## 12. Prohibited duplicate-source patterns

Each of these is a defect. `[C]`

| Pattern | Why it fails |
|---|---|
| The same content in two locations | Two sources of truth; they will diverge |
| A summary that restates a controlling artifact | Becomes stale, then contradicts |
| Format twins — the same artifact as `.md` and `.pdf` and `.docx` | Three files, one intent, guaranteed drift |
| A current-state block inside a standard | Stale by construction; only file 04 carries status |
| A second register covering the same domain | Competing registers is the defect, not the fix |
| An artifact that both defines and applies a rule | Split definition from application |
| A README that restates the charter | Route to it instead |

**Link, do not restate.** `[C]`

## 13. Relationship to external locations

`[C]` Observed facts about the current environment, and the rules that would follow.

| Location | Status now | Role if used | Authority |
|---|---|---|---|
| **GitHub** | **Not connected. No repository observed** | Version-controlled record | Descriptive only. Committed ≠ approved |
| **ChatGPT Project Sources** | **No SSLS 3.0 project source library was available** | Working source library for an AI tool | Directs tool behaviour. **Not canon** |
| **ChatGPT Project Instructions** | **No SSLS 3.0 Project Instructions were available to read** | Tool configuration | Not canon |
| **Claude** | Used for this authoring session | Drafting and analysis | AI-assisted output; candidate only |
| **Lovable** | Not connected or observed | Would be an implementation tool | Generated output; no authority |
| **Connected storage (e.g. Drive)** | An SSLS 2.0 corpus was observed on 2026-08-19 | Historical reference only | `HISTORICAL_REFERENCE` — non-controlling |
| **AI system memory** | Not applicable | — | **None.** Never a source |

**The rule across all of them:** a location is a place a file sits. Authority comes from file 03 status plus a decision in file 08 — never from where the file happens to live. `[C]`

## Assumptions and unknowns

| ID | Item | Label |
|---|---|---|
| A-11-1 | A numbered `docs/` structure aids navigation at this scale. | `[I]` |
| A-11-2 | Separating registers from narrative documents is worth the extra directory. | `[I]` |
| U-11-1 | No repository exists; the entire structure is untested against real use. | `[U]` |
| U-11-2 | Whether a repository is the right home at all, versus a document store. | `[U]` |
| U-11-3 | Whether empty reserved directories help or mislead. | `[U]` |
| U-11-4 | Whether `.xlsx` registers belong in version control given binary diffing. | `[U]` |

## Required owner decisions

| ID | Decision needed |
|---|---|
| OD-11-1 | Decide whether a repository is created, and on what platform. |
| OD-11-2 | Decide whether reserved directories are created empty or on first need. |
| OD-11-3 | Confirm the naming and ID conventions (§7–8). |
| OD-11-4 | Decide the register format for version control — `.xlsx` binary versus a text-based alternative. |
| OD-11-5 | Confirm that no historical material enters the SSLS 3.0 structure. |

## Non-effects

This map does not create a repository, directory, or file. It does not commit anything, and it does not evidence that any path, codebase, service, database, integration, route, or deployment exists. Every path is proposed.

## Change history

| Version | Date | Change | Author |
|---|---|---|---|
| 0.1.0-draft | 2026-08-21 | Initial draft for owner review. | AI-assisted authorship |
