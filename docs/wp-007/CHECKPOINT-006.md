# WP-007 CHECKPOINT-006 — Cycle 4 execution

State date: 2026-08-19
Authorization: DEC-019 (accepted) — WP-007 Cycle 4 only
Executor: Founder / Operator role, executor capacity
Target evaluation: **ACHIEVED (bounded)**

## What the cycle was authorized to do

DEC-019 authorized one cycle: acquire the August 5, 2026 v0.2.0 partial historical
package, verify it cryptographically, register it as a partial historical source
package, extract requirements from Section 11 of that historical v0.2.0 PDF into the HREQ
sequence beginning at HREQ-015, and build a cross-source restatement index. It
authorized no disposition, no merge, no promotion, and no conformance claim.

## Entry verification

Executed before any register edit:

- Gate A OPEN; WP-007 ACTIVE; WP-039 NOT AUTHORIZED; WP-038 CLOSED BY OWNER.
- No accepted decision supersedes DEC-019.
- Next unused identifiers confirmed: HREQ-015, HS-023, EV-039, RST-001, PKA-103,
  FND-022, CHECKPOINT-006.
- All three authorized inputs present in the supplied-input surface, resolving the
  input-availability blockage recorded as FND-021.

## Digest verification (EV-039)

| Artifact | File | Bytes | Measured SHA-256 | Against DEC-019 |
| --- | --- | --- | --- | --- |
| PKA-103 (historical) | SSLS_2.0_Comprehensive_Clean_Room_Rewrite_v0.2.0_2026-08-05.pdf | 787,831 | `2c83e6b6…7b044` | MATCH |
| PKA-104 (historical) | SSLS_2.0_Control_Workbook_v0.2.0_2026-08-05.xlsx | 36,546 | `f717dab3…3dc1` | MATCH |
| PKA-105 (historical) | SSLS_2.0_v0.2.0_SHA256_2026-08-05.txt | 491 | `914b65e3…d09a8` | MATCH |

The v0.2.0 DOCX and ZIP named by the manifest were **not supplied**. They remain
registered as NOT-SUPPLIED with no measured size and no digest, and no content of
either is inferred, quoted, or claimed. PKG-001 is therefore a **partial**
historical source package.

## Section-numbering fact

DEC-019 names "Section 11 — Accessibility, printed pages 20-21". In this historical v0.2.0
document, Section 11 on printed pages 20-21 **is** titled Accessibility, so the
authorized extraction surface is correct as written. This differs from the v0.3.0
governed rewrite, where accessibility appears as Section 10 and Section 11 is
Security — a difference already recorded as drift row PDR-005. The two documents
are different versions; no renumbering was applied to either record.

## Extraction (EV-040)

- HS-023 registered as a HISTORICAL-EVIDENCE source, digest-bound to PKA-103.
- HREQ-015 through HREQ-030 extracted verbatim: 1 target/refusal statement,
  14 accessibility interface statements, 1 evidence statement.
- Every candidate carries source locator, inherited authority, modality as worded,
  extraction confidence with basis, ambiguity classification, and a boundary.
- Every candidate is `CANDIDATE-PRE-DISPOSITION` and `NOT-ASSESSED`.

## Cross-source restatement index

`data/historical/restatement-index.json` — 17 rows relating HS-023 candidates to
the HS-011 candidates HREQ-001..014:

| Relationship | Rows |
| --- | --- |
| RESTATES | 3 |
| NARROWS | 2 |
| BROADENS | 6 |
| CONFLICTS | 0 |
| NEW | 6 |

Three HS-011 candidates (HREQ-005, HREQ-013, HREQ-014) have no HS-023 counterpart
and are listed as unmatched. No row merges, deduplicates, edits, deletes, ranks,
or elects a controlling wording, and no row assigns a disposition.

## What this checkpoint closed

Nothing. It resolves the input-availability blockage FND-021 as satisfied by
supply and raises FND-022, the open owner obligation to disposition the Cycle 4
output. WP-007 remains ACTIVE, Gate A remains OPEN, WP-039 remains NOT AUTHORIZED,
PKG-001 remains partial and non-canonical, HS-023 remains NOT-PROMOTED, and all
six package drift rows remain unresolved.

## Refused

- disposing of, merging, superseding, or ranking any requirement candidate;
- promoting HS-023 or PKG-001;
- reading or inferring any content of the historical v0.2.0 DOCX and ZIP, neither supplied;
- extracting from the historical v0.2.0 control workbook, which DEC-019 does not authorize;
- extracting from any section of the PDF other than Section 11;
- transcribing the owner-name attribution printed on the document cover;
- asserting WCAG, ADA Title II, Section 508, or any other accessibility conformance;
- closing WP-007, advancing Gate A, or authorizing WP-039.

## Next defensible owner action

Record a disposition for the Cycle 4 candidates and restatement index (FND-022),
and state whether any further cycle is authorized.

## Verification at this checkpoint

353 of 353 tests passed across 16 files (machine-verified only; no human, independent,
accessibility, security, legal, or district review is covered).
