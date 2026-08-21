# SSLS 3.0 — Source Hierarchy

| Field | Value |
|---|---|
| Document ID | SSLS3-DOC-02 |
| Version | 0.1.0-draft |
| Status | DRAFT — OWNER REVIEW REQUIRED |
| Owner | Shelby |
| Last updated | 2026-08-21 |
| Authority level | Controlling. Defines authority ranking and conflict resolution for all SSLS 3.0 work. |
| Canonical status | CANDIDATE |
| Review class | AI-assisted authorship. Not independent review, not human review, not validation. |

## Purpose

To make authority explicit and default-deny, so that no artifact acquires standing by accident, appearance, or repetition.

## Scope

Authority ranking, source classes, evidence quality, canonicalization, promotion, supersession, and conflict resolution. Does not define artifact status values (file 03) or current status (file 04).

## Controlling relationships

**Controls:** authority, conflict resolution, promotion and demotion, supersession, provenance requirements.

**Controlled by:** [01-SSLS_3.0_PROJECT_CHARTER.md](01-SSLS_3.0_PROJECT_CHARTER.md) and recorded owner decisions.

---

## 1. The default-deny rule

**A source has no authority unless this document grants it.** `[C]`

Authority is never inferred from filename, folder, date, recency, file size, polish, format, length, confidence of tone, apparent completeness, or repetition. An artifact that calls itself canonical is not canonical.

Where authority is absent, ambiguous, or contested, the outcome is **deny** — record the ambiguity, mark the content `[U]`, and route to the owner.

## 2. Authority hierarchy

Higher rank controls lower rank. Rank 1 is highest.

| Rank | Source | Notes |
|---|---|---|
| 1 | Current Shelby-approved SSLS 3.0 decisions | Recorded in file 08. Only source that creates new authority. |
| 2 | Current canonical SSLS 3.0 governance | Files marked CANONICAL in file 03. |
| 3 | Accepted ADRs, decision questions, owner dispositions | Bounded by their own recorded scope. |
| 4 | Current approved specifications and requirements | File 09 and its descendants. |
| 5 | Verified primary sources | Statute, regulation, official guidance, standards-body publications, retrieved and dated. |
| 6 | Research and reference sources | Peer-reviewed literature, professional standards, secondary analysis. |
| 7 | Historical SSLS evidence | SSLS 2.0 and earlier. **Non-controlling.** Evidence of what was considered, never of what is authorized. |
| 8 | Implementation convenience | What is easy, fast, already written, or already generated. Lowest rank; never wins a conflict. |

**Nothing at rank 5–8 authorizes anything.** Ranks 5 and 6 inform; rank 7 records history; rank 8 is a preference.

## 3. Normative versus descriptive authority

Two hierarchies, permanently separate. Merging them is the most common authority error.

| | **Normative** — what is *authorized* | **Descriptive** — what *actually exists* |
|---|---|---|
| 1 | Non-negotiable constraints (no-PII, human decision authority, claims discipline) | Directly observed runtime and data behaviour |
| 2 | Project charter | Reproducible, version-bound test evidence |
| 3 | Canonical governance | Inspected code, schema, configuration, environment |
| 4 | Accepted decisions | Implementation and change records |
| 5 | Approved requirements and specifications | Reviewed artifacts and screenshots |
| 6 | Implementation convenience | Assertions and unverified description |

**Governing rule:** an approved requirement outranks code as a statement of *intended* behaviour; a reproducible failed test outranks the requirement as evidence of *actual* behaviour. `[C]`

Never cite a normative source to prove something exists. Never cite a descriptive source to prove something is permitted.

## 4. Source classes

| Class | Definition | Authority |
|---|---|---|
| `OWNER_DECISION` | A recorded decision by Shelby | Creates authority |
| `CANONICAL_GOVERNANCE` | Approved governing artifact | Controls within its concept |
| `APPROVED_SPEC` | Approved requirement or specification | Controls within its scope |
| `PRIMARY_SOURCE` | Statute, regulation, official guidance, standards publication | Informs; never authorizes internally |
| `RESEARCH` | Literature, professional standards, secondary analysis | Informs only |
| `HISTORICAL` | SSLS 2.0 and earlier | Non-controlling evidence |
| `AI_GENERATED` | Any AI output not yet accepted | Candidate content only |
| `EXTERNAL_REFERENCE` | Third-party material referenced but not adopted | No authority |
| `WORKING` | Notes, drafts, scratch, conversation | No authority |

## 5. Artifact roles — never silently conflated

Each of these has a different role, and treating one as another is a defect. `[C]`

| Item | Role | Authority |
|---|---|---|
| Repository artifact | Version-controlled record of what was committed | Descriptive only. A committed file is not an approved file. |
| Project Instructions | Operating configuration for a tool | Directs behaviour; does not establish canon |
| AI system memory | Model or tool retention across sessions | **None.** Not a source. Unverifiable and mutable. |
| AI summary | A model's compression of other material | **None.** Cite the underlying source. |
| Screenshot | Image of a rendered state | Weak descriptive evidence. Proves rendering, not security, data integrity, accessibility, or database behaviour. |
| Chat transcript | Conversation record | Working. May contain a decision but is not itself the decision record. |
| Decision record (file 08) | The decision | Authoritative |

A decision discussed in chat and never written to file 08 has not been made.

## 6. Evidence-quality criteria

Every load-bearing claim is labeled:

| Label | Meaning | Requirement |
|---|---|---|
| `[C]` Confirmed | Directly supported by an identified source | Name the source |
| `[I]` Supported interpretation | Reasoned inference from available evidence | Name the basis and the reasoning |
| `[U]` Unknown | Not established | Name what would resolve it |
| PROPOSED | Candidate awaiting owner approval | Route to file 08 |

Quality tests applied to any evidence offered:

- **Proposition match** — does it address the claim actually being made?
- **Object and version match** — is it about *this* artifact at *this* version?
- **Environment match** — was it produced where it is being applied?
- **Method relevance** — can the method support this conclusion?
- **Independence** — who produced it, and were they reviewing their own work?
- **Freshness** — is it still current, and when does it expire?
- **Limitations** — stated, or absent? Evidence without stated limitations is unusable.

**A bounded negative search is not proof that something never existed.** **Metadata proves only the metadata observed.**

## 7. Canonicalization requirements

An artifact becomes CANONICAL only when **all** hold:

1. It has a stable ID, a version, an owner, and an effective date.
2. It declares exactly one controlling concept, not shared with another canonical artifact.
3. Its load-bearing statements are labeled.
4. Its assumptions and unknowns are visible.
5. It states its own review class honestly.
6. It carries explicit non-effects.
7. Shelby has recorded an accepting decision in file 08.
8. File 03 has been updated to reflect the new status.

Steps 1–6 without step 7 produce a CANDIDATE, not canon.

## 8. Promotion and demotion

**Promotion** — from a lower class to a higher one — requires a recorded owner decision naming the exact artifact and version, the scope of the promotion, and its limits. Promotion is never implied by moving, copying, renaming, referencing, or citing an artifact.

Promoting historical material additionally requires: identifying it by exact filename; recording why it is fit for current use; confirming it contains no PII, credential, or organizational identifier; and confirming it does not contradict current canon.

**Demotion** occurs when an artifact is superseded, when its evidence expires, when a dependency is invalidated, or when a finding shows it is wrong. Demotion is recorded, and dependent claims are reopened.

## 9. Supersession

Supersession occurs **only** by explicit owner decision. `[C]`

It does **not** occur by: title similarity · filename convention · upload or modification date · recency · file size · repetition · apparent improvement · AI inference · a newer file simply existing.

A superseding artifact must name what it supersedes. The superseded artifact is marked SUPERSEDED with a forward pointer and is **retained**. Nothing is deleted.

Where two artifacts appear to control one concept and no supersession is recorded, this is an **authority collision** — a stop condition (§13).

## 10. Conflict-resolution workflow

1. **Stop.** Do not resolve silently.
2. **Identify** each source, its class, its rank, its version, and its effective date.
3. **Determine** whether the conflict is normative or descriptive, and apply the correct hierarchy (§3).
4. **Apply rank.** Higher rank controls.
5. **If ranks tie**, apply the conservative rule: narrower scope, safer data posture, stronger access control, more honest maturity statement, most recent approved decision.
6. **If still unresolved**, record a conflict entry, mark affected content `[U]`, and route to Shelby.
7. **Record** the resolution, its rationale, and every artifact requiring update.
8. **Update** dependents. An unpropagated resolution is not a resolution.

Conflict record fields: conflict ID · date · sources involved · exact conflicting statements · classes and ranks · normative or descriptive · scope, safety, and claim impact · resolution · rationale · artifacts requiring update · verification · closure date.

## 11. Treatment of historical files

All SSLS 2.0 and earlier material is **HISTORICAL_REFERENCE — NON-CONTROLLING**. `[C]`

Permitted: reading it; citing it as evidence of what was previously considered; extracting an idea for clean re-authoring under current authority.

Prohibited: treating it as a requirement, a decision, or a specification; copying it forward unchanged; inheriting its schemas, roles, routes, modules, technology choices, gates, maturity claims, or implementation status; presenting it as current canon; assuming similar-looking filenames are duplicate uploads; deleting, renaming, or modifying it.

When referenced, identify by **exact filename** and label explicitly. Where a historical filename itself contains an organizational identifier, reference it by artifact ID only and do not reproduce the filename.

## 12. Treatment of AI-generated output, external standards, and research

**AI output** is `AI_GENERATED` — candidate content with no authority until accepted by owner decision. It must be labeled as AI-assisted, must not be described as review or validation, and must not be cited as a source for its own correctness. AI cannot promote, approve, close, ratify, or release.

**External standards** are `PRIMARY_SOURCE`. Cite by exact name, version or edition, publisher, and retrieval date, with a re-verification trigger. Adopting a standard as a design target is **not** conformance. A conformance claim requires: exact product and version · exact standard version and profile · an executed test suite · all tests passed · a result recorded by the certifying body · currency · disclosed limitations.

**Research** is `RESEARCH`. Cite with population, method, effect direction where relevant, and **stated limitations**. Component evidence is not evidence of local effectiveness. Never cite a research finding as an SSLS capability claim.

## 13. Ambiguity and stop conditions

Stop and route to the owner on any of these:

- Two sources appear to control one concept with no recorded supersession.
- A required source cannot be located, and content would have to be reconstructed from memory.
- Authority would have to be inferred from placement, naming, or recency.
- A claim would have to rest on an unlabeled or `[U]` statement.
- Real PII, a credential, or an organizational identifier is encountered.
- Historical material would have to be treated as current to proceed.
- An AI system would have to approve, ratify, or close something.
- A hard requirement would have to be averaged, softened, or waived to proceed.

**A stop condition may not be averaged away.**

## 14. Provenance, version, and effective date

Every governed artifact records: origin · author or generating system · date created · date last updated · version · effective date · supersession relationships · dependencies · review or expiry trigger.

Version format `MAJOR.MINOR.PATCH` with an optional `-draft` suffix. A draft is never effective. A **blank effective date never implies activation.** An artifact is effective only from its recorded effective date, and only if its accepting decision exists.

## 15. Permitted and prohibited authority inferences

**Permitted**

- "File 03 lists this artifact as CANONICAL and file 08 records decision D-0xx accepting it, therefore it controls its concept."
- "This is rank 5 primary source, so it informs the requirement but does not authorize the scope."
- "A reproducible failed test outranks the requirement as evidence of actual behaviour."
- "No owner decision exists, therefore the answer is deny, and the question is routed."

**Prohibited**

- "It is in the governance folder, so it governs."
- "It is the newest file, so it supersedes the older one."
- "It is titled *canonical*, so it is canonical."
- "It is thorough and well formatted, so it is authoritative."
- "SSLS 2.0 decided this, so SSLS 3.0 inherits it."
- "The AI produced a detailed analysis, so the conclusion is established."
- "A screenshot shows it working, so the security control is verified."
- "Two files have similar names, so one is a duplicate."
- "It is in the repository, so it is approved."
- "Project Instructions mention it, so it is canon."

## Assumptions and unknowns

| ID | Item | Label |
|---|---|---|
| A-02-1 | An eight-rank hierarchy is granular enough without being unusable by one operator. | `[I]` |
| A-02-2 | Separating normative from descriptive authority prevents the most costly class of error. | `[I]` |
| U-02-1 | No SSLS 3.0 owner decisions exist yet beyond the commissioning instruction, so rank 1 is nearly empty. | `[U]` |
| U-02-2 | Whether external legal or standards review will alter these rules is unknown. | `[U]` |

## Required owner decisions

| ID | Decision needed |
|---|---|
| OD-02-1 | Confirm the eight-rank hierarchy (§2). |
| OD-02-2 | Confirm the normative/descriptive separation (§3). |
| OD-02-3 | Confirm that AI memory and AI summaries carry no authority (§5). |
| OD-02-4 | Confirm the stop conditions (§13) as binding. |
| OD-02-5 | Confirm that no historical artifact is promoted by default. |

## Non-effects

This document grants no artifact authority. It defines how authority is granted. It does not classify any specific artifact — that is file 03 — and does not record any decision — that is file 08.

## Change history

| Version | Date | Change | Author |
|---|---|---|---|
| 0.1.0-draft | 2026-08-21 | Initial draft for owner review. | AI-assisted authorship |
