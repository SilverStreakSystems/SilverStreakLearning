# SSLS 3.0 — Evidence and Claims Register

| Field | Value |
|---|---|
| Document ID | SSLS3-DOC-10 |
| Version | 0.1.0-draft |
| Status | DRAFT — OWNER REVIEW REQUIRED |
| Owner | Shelby |
| Last updated | 2026-08-21 |
| Authority level | Register. Holds validation evidence and claim authorization for SSLS 3.0. |
| Canonical status | CANDIDATE |
| Review class | AI-assisted authorship. Not independent review, not human review, not validation. |

## Purpose

To hold what is actually known, what supports it, and which exact wordings are authorized to be said — so that the gap between evidence and claim stays visible instead of closing by assumption.

## Scope

Evidence identity, method, limitations, and review class; claim wording, authorization state, and expiry. Does not state project status (file 04), record decisions (file 08), or define requirements (file 09).

## Controlling relationships

**Controls:** validation evidence and claim authorization.

**Controlled by:** owner decisions in [08-SSLS_3.0_DECISIONS.md](08-SSLS_3.0_DECISIONS.md).

**Defers to:** [09-SSLS_3.0_REQUIREMENTS.md](09-SSLS_3.0_REQUIREMENTS.md) for what evidence must satisfy.

## Provenance of this file

This register was **reconstructed**, not transcribed. `[C]` The foundation package cited an evidence and claims register as controlling; no such register existed in any available source. [04-SSLS_3.0_CURRENT_PROJECT_STATE.md](04-SSLS_3.0_CURRENT_PROJECT_STATE.md) §9 counts six evidence items without enumerating them. The six entries in §2 are reconstructed from the observations that file states. `[I]`

---

## 1. Evidence rules

| # | Rule | Source |
|---|---|---|
| 1 | Every evidence item carries its limitations. Evidence without stated limitations is how a scoped check becomes a certification claim. | File 01 §9 |
| 2 | Review class is stated honestly, including when it is AI-assisted self-verification. | File 00 §14 |
| 3 | An absence observation evidences absence **of observation**, not absence in fact, unless the method could have detected the thing. | `[I]` |
| 4 | Self-produced evidence is never independent evidence. An independent evaluation cannot be self-produced. | File 00 §11 |
| 5 | Evidence expires. A stale item is withdrawn, not extended by default. | File 01 §8.3 |

### Evidence labels used throughout the package

| Label | Meaning |
|---|---|
| `[C]` | Confirmed — directly supported |
| `[I]` | Inferred — authoring judgment |
| `[U]` | Unknown — stated gap |

## 2. Evidence items

Six items. **Independent evidence: 0. Test evidence: 0. Validation performed: none.** `[C]`

| ID | Subject | Observation | Method | Date | Limitations | Review class | Label |
|---|---|---|---|---|---|---|---|
| EV-0001 | Authoring environment | The operating environment is document authoring and analysis with AI assistance. No application runtime exists. | Direct observation of the working environment | 2026-08-21 | Describes one session's environment only | AI-assisted self-verification | `[C]` |
| EV-0002 | Repository | No SSLS 3.0 repository was observable — no URL, commit, branch, or settings receipt. | Attempted observation | 2026-08-21 | Evidences absence of observation. A repository could exist and be unreachable (A-04-2) | AI-assisted self-verification | `[C]` |
| EV-0003 | Project instructions | No SSLS 3.0 Project Instructions were available to read in this environment. | Attempted read | 2026-08-21 | Absence of availability, not proof of non-existence | AI-assisted self-verification | `[C]` |
| EV-0004 | Source library | No SSLS 3.0 project source library was available to inventory. | Attempted inventory | 2026-08-21 | Absence of availability, not proof of non-existence | AI-assisted self-verification | `[C]` |
| EV-0005 | Historical corpus | An SSLS 2.0 corpus was observed in connected storage on 2026-08-19: filenames and titles only. | Directory listing | 2026-08-19 | Establishes existence and title only — **not** content currency, authority, correctness, or absence of PII | AI-assisted self-verification | `[C]` |
| EV-0006 | Foundation package | Twelve candidate foundation artifacts were authored and exist. None is approved. | Direct observation | 2026-08-21 | Existence, not quality, correctness, or fitness | AI-assisted self-verification | `[C]` |

**What this evidence base is.** Observations about this environment and about the absence of things. Nothing has been tested, measured, or independently checked. `[C]`

`[U]` The six items above are a reconstruction of a count stated in file 04 §9. The owner confirms, corrects, or replaces the set — see OD-10-1.

## 3. Claims

**Authorized claims: 0.** `[C]`

Every claim defaults to **NOT AUTHORIZED** until evidence exists and the owner approves the exact wording. `[C]` A claim is a specific wording, not a topic: approval attaches to the words, and altering approved words withdraws the approval.

| ID | Proposed wording | Audience | Supporting evidence | State |
|---|---|---|---|---|
| — | *(none proposed)* | — | — | — |

### Claim authorization procedure

1. **Exact wording.** Record the words proposed, verbatim — never a paraphrase.
2. **Evidence linkage.** Map each assertion in the wording to a specific `EV-` item, or flag it unsupported.
3. **Contradiction check.** Search for evidence that contradicts the assertion; record and address what is found.
4. **Limitations in the wording.** Boundaries are written into the claim itself, not appended as fine print.
5. **Owner decision.** Shelby approves or refuses the exact wording, and the decision is recorded in file 08. **Refusal is a successful outcome.**
6. **Expiry.** Every approved claim carries a revalidation date. Past that date it is withdrawn, not extended.

Steps 1–4 may be AI-assisted. Step 5 may not — AI cannot approve a claim (file 01 §12).

### Prohibited claims

The prohibited set is stated in [00-SSLS_3.0_START_HERE.md](00-SSLS_3.0_START_HERE.md) §11 and is **not restated here** — one controlling source per concept (file 01 §8.1). It covers, by reference: production readiness; deployment; district adoption, pilot, procurement, endorsement, or affiliation; legal, privacy, or regulatory compliance; security certification or validation; accessibility conformance or independent evaluation; interoperability conformance; educational effectiveness or student outcomes; user research, market fit, or demand; that an AI system cannot leak or hallucinate; and that any maturity level has been achieved.

A prohibited claim is not unlocked by evidence quality. It is unlocked, if ever, by direct current evidence **and** the appropriate review authority — which does not exist for SSLS 3.0 today. `[C]`

## 4. Standing position

| Question | Position | Label |
|---|---|---|
| Has anything been validated? | No | `[C]` |
| Is any evidence independent? | No. A single operator with no second reviewer cannot produce independent evidence (R-06) | `[C]` |
| Is any claim authorized? | No | `[C]` |
| Does this register authorize anything? | No | `[C]` |

## 5. Decisions this register raises

| ID | Decision needed |
|---|---|
| OD-10-1 | Confirm, correct, or replace the six reconstructed evidence items `EV-0001`–`EV-0006` |
| OD-10-2 | Confirm the claim authorization procedure in §3 |
| OD-10-3 | Decide the default revalidation interval for an approved claim |
| OD-10-4 | Decide how independence is obtained, given that no second reviewer exists (relates to OD-04-3) |

## Assumptions and unknowns

| ID | Item | Label |
|---|---|---|
| A-10-1 | The six items counted in file 04 §9 correspond to the observations enumerated in §2. | `[I]` |
| A-10-2 | An absence observation is worth recording as evidence, provided its limitation is stated. | `[I]` |
| U-10-1 | No original evidence and claims register was available in any connected source. | `[U]` |
| U-10-2 | Whether evidence artifacts will be stored as files under an `EV-NNNN_subject_YYYY-MM-DD` convention (file 11 §7) or held only as register rows. | `[U]` |

## Non-effects

This file records evidence and claim state. It does not authorize a claim, validate anything, confer independence on self-produced evidence, establish conformance, or upgrade any maturity level. Recording an evidence item does not make the thing it describes true; recording a claim does not authorize saying it.

## Change history

| Version | Date | Change | Author |
|---|---|---|---|
| 0.1.0-draft | 2026-08-21 | Initial reconstruction from the evidence count and observations stated in file 04, and the claim rules in file 00. No original register existed. | AI-assisted authorship |
