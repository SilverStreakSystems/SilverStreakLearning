# SSLS 3.0 — Requirements Register

| Field | Value |
|---|---|
| Document ID | SSLS3-DOC-09 |
| Version | 0.1.0-draft |
| Status | DRAFT — OWNER REVIEW REQUIRED |
| Owner | Shelby |
| Last updated | 2026-08-21 |
| Authority level | Register. Holds requirements and acceptance criteria for SSLS 3.0. |
| Canonical status | CANDIDATE |
| Review class | AI-assisted authorship. Not independent review, not human review, not validation. |

## Purpose

To hold every SSLS 3.0 requirement with its source, acceptance criterion, and status — so that what is required is separable from what is merely written down.

## Scope

Foundation governance requirements only. That is the sole requirement class currently authorized (file 05 §7). This register does not define scope (file 05), record decisions (file 08), or authorize a claim (file 10).

## Controlling relationships

**Controls:** requirements and acceptance criteria.

**Controlled by:** owner decisions in [08-SSLS_3.0_DECISIONS.md](08-SSLS_3.0_DECISIONS.md).

**Defers to:** [05-SSLS_3.0_SCOPE_AND_BOUNDARIES.md](05-SSLS_3.0_SCOPE_AND_BOUNDARIES.md) for what may be required at all; [07-SSLS_3.0_GLOSSARY.md](07-SSLS_3.0_GLOSSARY.md) for terminology.

## Provenance of this file

This register was **derived**, not transcribed. `[C]` The foundation package cited a requirements register as controlling; no such register existed in any available source. Every requirement below restates an obligation already stated normatively in files 00–07 and 11. Nothing new is introduced. `[I]`

---

## 1. Status values

| Status | Meaning | Authority |
|---|---|---|
| `DRAFT` | Written, not approved | **None** |
| `APPROVED` | Accepted by recorded owner decision | Full, within its subject |
| `IMPLEMENTED` | Satisfied in practice, evidenced | Not a claim of validation |
| `VALIDATED` | Independently checked | Requires an independent checker |
| `WITHDRAWN` | Retracted | Historical record |

**Every requirement below is `DRAFT`. None is approved.** File 04 §11 places requirements at rung 4, partial. `[C]` Approved ≠ implemented ≠ validated ≠ released (file 01 §8.10).

## 2. Requirement classes currently authorized

| Class | Authorized? | Basis |
|---|---|---|
| Foundation governance | **Yes** | File 05 §7 |
| Everything else | **No** | File 05 §8–9; file 04 §5 |

Requirements are default-deny like scope. A requirement outside the authorized class is not a backlog item; it is out of scope until an owner decision moves it.

## 3. Foundation governance requirements

Prefix `RQ-G` — governance. Each requirement names the file that already obliges it.

### 3.1 Source and authority integrity

| ID | Requirement | Source | Acceptance criterion | Blocked by | Status |
|---|---|---|---|---|---|
| RQ-G-001 | Exactly one controlling source exists per concept; a competing duplicate is a defect. | File 01 §8.1 | Every concept in the canon manifest resolves to one controlling artifact, with no second artifact claiming the same concept | OD-02-1 | DRAFT |
| RQ-G-002 | Authority is declared by recorded owner decision, never derived from detail, tone, recency, completeness, or filename. | File 01 §3; file 02 | No artifact is cited as authority without a decision ID | OD-02-1 | DRAFT |
| RQ-G-003 | Absence, ambiguity, or mismatch denies. Unknown never grants permission. | File 01 §8.2; file 05 §1 | No artifact treats silence as permission | OD-05-1 | DRAFT |
| RQ-G-004 | Historical material is labeled HISTORICAL_REFERENCE — non-controlling, and is promoted only by explicit owner promotion of a named artifact. | File 01 §3; file 03 §3 | Every historical item carries the label; the promotion count is zero unless a decision says otherwise | OD-03-3, OD-01-8 | DRAFT |
| RQ-G-005 | Supersession is recorded explicitly by a successor naming its predecessor; it never occurs by title similarity, date, recency, or inference. | File 00 §13 | Every SUPERSEDED artifact has a named successor and a decision ID | OD-03-1 | DRAFT |
| RQ-G-006 | Nothing is deleted. Superseded material is archived with lineage intact. | File 01 §8.6 | No artifact is removed from the manifest; retired items remain with lineage | OD-03-1 | DRAFT |

### 3.2 Evidence and claim discipline

| ID | Requirement | Source | Acceptance criterion | Blocked by | Status |
|---|---|---|---|---|---|
| RQ-G-007 | No assertion outruns what supports it. | File 01 §8.3 | Every load-bearing statement carries `[C]`, `[I]`, `[U]`, or PROPOSED | — | DRAFT |
| RQ-G-008 | Every evidence item carries its limitations. | File 01 §9 (evidence commitment) | No evidence record lacks a stated limitation | — | DRAFT |
| RQ-G-009 | Every claim defaults to NOT AUTHORIZED until evidence exists and the owner approves the exact wording. | File 00 §11 | Authorized-claim count in file 10 equals the count of recorded approvals | — | DRAFT |
| RQ-G-010 | Raw fact, derived state, approval, validation, and publication are distinct and never collapse into one field. | File 01 §8.4 | No register column mixes two of these kinds | — | DRAFT |
| RQ-G-011 | Review class is stated honestly on every artifact, including when it is AI-assisted self-review. | File 00 §14 | Every artifact header names its review class | — | DRAFT |
| RQ-G-012 | Each artifact ends with explicit non-effects. | File 00 §14 | Every artifact has a non-effects block | OD-00-3 | DRAFT |

### 3.3 Data and safety boundary

| ID | Requirement | Source | Acceptance criterion | Blocked by | Status |
|---|---|---|---|---|---|
| RQ-G-013 | Only synthetic, fictional, or non-identifiable data appears in any artifact. | File 05 §4 | No real personal data in content, titles, filenames, examples, or metadata | — | DRAFT |
| RQ-G-014 | The project is district-agnostic; placeholders `DISTRICT-01` and `SCHOOL-01` and reserved domains `.example`, `.test`, `.invalid` are used. | File 05 §4 | No real district, school, or municipality name anywhere | — | DRAFT |
| RQ-G-015 | No student data enters any AI model training path, at any maturity level. | File 05 §4 | Stated as an absolute; no exception recorded | — | DRAFT |
| RQ-G-016 | Work stops immediately on encountering real PII, an exposed secret, or an organizational identifier. | File 00 §10 | A stop is recorded as a finding, not worked around | — | DRAFT |
| RQ-G-017 | A person, never a system, holds authority over consequential decisions about a learner. | File 01 §9 | No autonomous eligibility, placement, grading, discipline, safety, employment, medical, or legal decision is designed or built | OD-01-4 | DRAFT |
| RQ-G-018 | AI may research and draft; it may not approve its own output, establish canon, or record an owner decision. | File 00 §9; file 01 §12 | Every approval and every decision record has a human actor | OD-00-2, OD-01-5 | DRAFT |

### 3.4 Artifact and process discipline

| ID | Requirement | Source | Acceptance criterion | Blocked by | Status |
|---|---|---|---|---|---|
| RQ-G-019 | The artifact lifecycle is Propose → Review → Accept → Supersede → Archive, and only Accept confers authority. | File 00 §13 | Status transitions in file 03 trace to lifecycle steps | OD-03-1 | DRAFT |
| RQ-G-020 | Cross-references use real IDs and exact filenames. | File 00 §14 | No dangling reference; no invented ID | OD-11-3 | DRAFT |
| RQ-G-021 | Required owner decisions are named and routed, never left implicit. | File 00 §14 | Every open question has an `OD-NN-N` in file 08 | — | DRAFT |
| RQ-G-022 | Assumptions and unknowns are visible, not buried. | File 00 §14 | Every artifact has an assumptions-and-unknowns block | — | DRAFT |
| RQ-G-023 | A governance step that cannot name the decision it improves or the risk it retires is removed. | File 01 §8.8 | Each governance artifact names its decision or risk | OD-04-3 | DRAFT |
| RQ-G-024 | Prefer the cheaper-to-reverse option absent strong evidence; on genuine ambiguity take the narrower, safer reading. | File 01 §8.5, §8.7 | Reversibility is recorded on every decision in file 08 | — | DRAFT |

**Total foundation governance requirements: 24. Approved: 0.** `[C]`

## 4. Deliberately absent requirement classes

Not gaps. Recorded positions, restating file 04 §5 and file 05 §8. `[C]`

| Class | Position |
|---|---|
| Product capability requirements | Out of scope — blocked by OD-05-1, OD-06-3 |
| Information architecture, data model, schema | Out of scope — blocked by OD-05-1 |
| Authorization model, threat model | Out of scope — blocked by OD-05-1 |
| Accessibility conformance target and profile | Out of scope — blocked by OD-01-6 |
| Technology selection | Out of scope — blocked by OD-05-1; naming a candidate is not selection |
| Repository, code, tests, integration, deployment | Out of scope — blocked by OD-11-1 |
| Any user role beyond founder/developer | Out of scope |
| Any real data, external transmission, or public claim | **Prohibited** — charter amendment required |

## 5. Decisions this register raises

| ID | Decision needed |
|---|---|
| OD-09-1 | Confirm or revise the 24 foundation governance requirements, moving each from DRAFT to APPROVED or amending it |
| OD-09-2 | Confirm that requirements are default-deny by class, as stated in §2 |
| OD-09-3 | Confirm the `RQ-G-NNN` identifier scheme and its extension to future classes (relates to OD-11-3) |

## Assumptions and unknowns

| ID | Item | Label |
|---|---|---|
| A-09-1 | Obligations stated normatively in files 00–07 and 11 were intended as requirements, not as commentary. | `[I]` |
| A-09-2 | Acceptance criteria stated here are checkable by inspection of the artifacts alone. | `[I]` |
| U-09-1 | No original requirements register was available in any connected source. | `[U]` |
| U-09-2 | Whether the owner wants foundation governance requirements versioned separately from the artifacts that state them. | `[U]` |

## Non-effects

This file records requirements. It does not approve a requirement, expand scope, authorize work outside the foundation governance class, establish an acceptance decision, or claim that any requirement is satisfied. Writing an acceptance criterion does not evidence that it is met.

## Change history

| Version | Date | Change | Author |
|---|---|---|---|
| 0.1.0-draft | 2026-08-21 | Initial derivation from obligations stated in files 00–07 and 11. No original register existed. | AI-assisted authorship |
