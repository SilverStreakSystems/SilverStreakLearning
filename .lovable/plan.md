# Unpack the SSLS 3.0 Greenfield Enterprise Artifact Matrices

Normalize the owner-supplied workbook into a governed, machine-readable register in this
repository, with a derived documentation projection and a reconciliation map against what SSLS 2.0
already contains. Reference material only: it authorizes nothing, changes no gate, no work-package
state, and no current-state claim.

## What the workbook contains

- 21 worksheets: Overview, 17 domain matrices, Maturity Scale (levels 0–10), Prompt Guide,
  Resource Index.
- 296 artifact records across FND, BLD, GOV, REG, PRD, WKS, LRN, KBG, KBO, RAG, ARC, TRU, A11,
  APP, QAE, OPS, DST.
- 80 resource-index entries.
- Each record has 9 fields: artifact ID, file path(s), general contents, when created, copy-ready
  Claude prompt, links and resources, introduced level, mature target, per-level maturity notes.

## Decisions taken (no owner input required to proceed)

- **Authority:** the register is an external owner-supplied input with no authority. It activates no
  role, authorizes no implementation, and creates no SSLS 3.0 program.
- **Truth plane:** source text is stored verbatim under a `source` object and never edited.
  Every classification is derived at read time, so the register can never disagree with the reader.
- **3.0 vs 2.0:** recorded as *candidate successor reference architecture*, with a reconciliation
  map marking each artifact PRESENT / PARTIAL / ABSENT in the current repository. Every mapping is
  advisory and owner-decision-required; nothing is marked adopted.
- **No UI route** in this increment. Planning surfaces need a separate authorization.

## Files

Controlling (authored):
- `data/greenfield-matrices/GREENFIELD_MATRIX_SCHEMA.json` — record and register schema.
- `data/greenfield-matrices/matrices.json` — 296 records, verbatim source fields, per-row SHA-256,
  worksheet digests, provenance (filename, byte size, workbook SHA-256).
- `data/greenfield-matrices/maturity-scale.json`, `resource-index.json`, `prompt-guide.json`.
- `data/greenfield-matrices/reconciliation.json` — declared PRESENT/PARTIAL/ABSENT mapping to
  existing repository paths, each with a locator or an explicit "no locator" statement.
- `scripts/extract-greenfield-matrices.mjs` — reproducible one-time extraction with a
  reconciliation guard that refuses to write when observed totals disagree with expected totals.
- `src/domain/greenfield-matrices/` — types plus derived readers: domain grouping, level-band
  distribution, gap classification. Pure functions, no stored judgement.
- `scripts/gen-greenfield-matrix-docs.ts` — governed generator (discovered by `gen-*.ts`).
- `src/test/greenfield-matrices.test.ts` — invariants.

Derived (generated, never hand-edited):
- `docs/greenfield-matrices/MATRIX_REGISTER.md` — full record index by domain.
- `docs/greenfield-matrices/MATURITY_MODEL.md` — levels 0–10 and introduced/mature targets.
- `docs/greenfield-matrices/RECONCILIATION_MAP.md` — SSLS 3.0 artifact vs SSLS 2.0 present state.
- `docs/greenfield-matrices/NON_CLAIM_BOUNDARY.md` — what this register does not authorize.
- `docs/greenfield-matrices/MANIFEST.md` — controlling vs generated outputs, self-inclusive.

## Tests

- Totals: 296 records, 17 domains, per-domain counts, 80 resource entries, 9 source fields.
- Identifier uniqueness and prefix/domain agreement; `introduced level <= mature target`,
  both within 0–10.
- Source immutability: every row digest recomputes from its verbatim fields.
- Refusal posture: no record may carry adopted / approved / conformant / implemented status; no
  gate, decision, or work-package identifier may be created by this register.
- Reconciliation entries are advisory-only and every PRESENT/PARTIAL claim carries a repository
  locator that exists.
- Manifest lists its own generated output set.

## Verification

`bun run gen:all`, then `bun run verify` (lint, typecheck, tests, build, check:current-state,
check:generated), then regenerate current state so the new inputs are reflected. The workbook
itself is not committed; provenance digests make the extraction reproducible when re-supplied.

## Out of scope

No UI or navigation change, no SSLS 3.0 program creation, no gate or work-package state change, no
backend/auth/data capability, no publish or redeploy, no conformance or release claim.
