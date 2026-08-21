# Record the SSLS 3.0 foundation corpus as an observed external reference

## What is in the folder

I read the folder. It holds 15 items, three groups:

**SSLS 3.0 foundation package (drafted 2026-08-21, all DRAFT / CANDIDATE, none accepted)**

| File | Document ID | Role |
|---|---|---|
| 00-SSLS_3.0_START_HERE.md | SSLS3-DOC-00 | Routing only, controls nothing |
| 01-SSLS_3.0_PROJECT_CHARTER.md | SSLS3-DOC-01 | Identity, North Star, principles |
| 02-SSLS_3.0_SOURCE_HIERARCHY.md | SSLS3-DOC-02 | What counts as authority |
| 03-SSLS_3.0_CANON_MANIFEST.md | SSLS3-DOC-03 | Artifact status |
| 04-SSLS_3.0_CURRENT_PROJECT_STATE.md | SSLS3-DOC-04 | Only permitted status source |
| 05-SSLS_3.0_SCOPE_AND_BOUNDARIES.md | SSLS3-DOC-05 | What is permitted |
| 06-SSLS_3.0_PRODUCT_BRIEF.md | SSLS3-DOC-06 | Problem, users, value |
| 07-SSLS_3.0_GLOSSARY.md | SSLS3-DOC-07 | Terminology |
| 11-SSLS_3.0_REPOSITORY_MAP.md | SSLS3-DOC-11 | Proposed structure, nothing implemented |

Registers 08 (decisions), 09 (requirements) and 10 (evidence and claims) are referenced by the
package but are **not present in this folder**. That is a gap in the delivered set, not an
inference: files 04 and 11 cite them as controlling sources.

**Related workbooks and spreadsheets**

- 08-SSLS_3.0_GREENFIELD_ENTERPRISE_ARTIFACT_MATRICES_v1.0 — the 296-record artifact matrix
  already examined in this session, now also present here as a Google Sheet.
- SSLS Enterprise Lifecycle SSOT v0.1 — Working
- SSLS Kanban Organizer v0.4.0 — 2026-08-21
- K12 Academic Language Literacy Workbook v2.15 — Provisional Comprehensive Source Propagation
- SSLS_Internal_Dashboard_Workbook.xlsx
- `__control_probe_delete_me.xlsx` — a 1.5 KB probe artifact, apparently disposable.

## The conflict this creates, stated plainly

The SSLS 3.0 package is a **clean-slate declaration**. It states that SSLS 3.0 is not a rename,
migration, upgrade, or inheritance of SSLS 2.0, that nothing historical has been promoted, that no
repository is connected or created, and that repository creation, technology selection, and
committing to a repository are **prohibited without a recorded owner decision** (OD-11-1).

This repository is SSLS 2.0. Building the SSLS 3.0 structure here, or ingesting the 3.0 canon into
this repository's governance layer, would violate the package's own rules on three counts: it would
create the repository without OD-11-1, it would place SSLS 3.0 artifacts inside inherited SSLS 2.0
ancestry, and placement would risk being read as promotion.

So the previous plan in this session — normalizing the greenfield matrices into this repository's
data plane — is withdrawn. It is the wrong move against the canon you just wrote.

## What this increment does instead

The one action that is both useful and permitted: record, inside SSLS 2.0, that this external
corpus was observed — without promoting it, citing it as authority, or changing any SSLS 2.0 state.

Controlling (authored):

- `data/external-corpora/EXTERNAL_CORPUS_SCHEMA.json` — schema for an observed, non-controlling
  external corpus: corpus ID, observation timestamp, observer, method, location class, item
  records (name, document ID, declared status, size, modified time, provider file ID), declared
  gaps, and a mandatory non-authority statement.
- `data/external-corpora/ssls-3.0-foundation.json` — the observation record for this folder:
  15 items, the nine present foundation documents with their declared document IDs and DRAFT /
  CANDIDATE status, the three absent registers recorded as declared-but-not-present, and the
  related workbooks. Contents are not copied in; the record is an index with provenance, not a
  second copy of the source.
- `scripts/gen-external-corpus-docs.ts` — governed generator (matches the `gen-*.ts` convention).
- `src/test/external-corpora.test.ts` — invariants.

Derived (generated, never hand-edited):

- `docs/external-corpora/SSLS_3.0_FOUNDATION_OBSERVATION.md` — the item index and declared gaps.
- `docs/external-corpora/NON_PROMOTION_BOUNDARY.md` — what this record explicitly does not do.

Nothing else changes: no route, no navigation, no fixture, no register entry, no gate, no
work-package state, no current-state claim, no publish.

## Tests

- Every item carries an observation timestamp, a location class, and a provider file ID.
- No item may carry a status of accepted, canonical, approved, promoted, adopted, or implemented.
- The three declared-but-absent registers are recorded as absent and may not be recorded as
  present.
- The corpus record cannot introduce a DEC, FND, EV, CHECKPOINT, or WP identifier.
- The non-authority statement is present and non-empty on the record and in both generated docs.
- Content is indexed, not restated: no item body text is stored, so the record cannot drift from
  the source.

## Verification

`bun run gen:all`, then `bun run verify`, then regenerate current state so the new controlling
inputs are reflected.

## What needs your decision, not mine

1. **OD-11-1** — whether an SSLS 3.0 repository is created at all, and where. Until that is
   recorded, no SSLS 3.0 structure can be built anywhere, including here.
2. Whether SSLS 3.0 should eventually live in this repository (inheriting 2.0 ancestry, against
   the clean-slate rule) or in a separate one.
3. Whether the three missing registers (08, 09, 10) exist elsewhere or still need drafting.
4. `__control_probe_delete_me.xlsx` — I will not touch anything in your Drive; delete it yourself
   if it is spent.

## Out of scope

No SSLS 3.0 repository or directory structure. No promotion of any artifact to canon. No owner
decision recorded on your behalf. No change to SSLS 2.0 gates, work packages, evidence, UI, or
navigation. No backend, auth, or data capability. No publish or redeploy. No conformance,
readiness, or release claim.
