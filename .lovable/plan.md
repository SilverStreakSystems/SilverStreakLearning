# Integrate the revised SSLS 3.0 foundation drafts (files 00, 01, 02)

## What arrived

Three superseding drafts of documents already held in the canon:

| Doc | In repository now | Uploaded draft | Open decisions now → after |
|---|---|---|---|
| SSLS3-DOC-00 Start Here | v0.1.0-draft | **v0.6.0-draft** | 3 → 9 (OD-00-1…9) |
| SSLS3-DOC-01 Project Charter | v0.1.0-draft | **v0.4.0-draft** | 8 → 14 (OD-01-1…14) |
| SSLS3-DOC-02 Source Hierarchy | v0.1.0-draft | **v0.3.0-draft** | 5 → 8 (OD-02-1…8) |

All three remain DRAFT / CANDIDATE, AI-assisted review class. They are substantive rewrites, not edits: File 00 becomes a lifecycle-routing map (Vision → … → Public Claim ladder, R&D-before-tools, cross-functional streams, handoff packet, stop conditions, entry-point test); File 01 and File 02 are realigned against them.

## What "integrate" means here

Transcribe the three drafts into the existing governed canon and update every derived record so nothing drifts. No document is promoted, no decision is recorded or closed, no scope opens, no 2.0 gate or WP state changes.

## Work

1. **Transcribe** each PDF to full markdown, replacing `docs/ssls-3.0/00-…`, `01-…`, `02-…` in place. Header block, body, assumptions/unknowns, open-decision table, non-effects, and the complete version history all preserved. Provenance stays `transcribed`; the superseded v0.1.0 text is replaced, not archived separately (the version-history table in each file carries the lineage).
2. **Supersession record** — a short `docs/ssls-3.0/SUPERSESSION-001.md` stating which prior transcriptions were replaced, by which uploaded source file, and that replacement is transcription, not approval.
3. **Canon data plane** — update `data/ssls-3.0/canon.json`: versions, status text, authority level, review class, and the expanded `open_decision_ids` per document; add the 21 new `OD-nn-n` entries to the open-decision index with priority and question text taken verbatim from each file's own table; bump `document_count`/`open_decision_count` (58 → 79) and `recorded_at`.
4. **Domain fix** — `src/domain/ssls-3-0/canon.ts` validates decision IDs with `^OD-\d{2}-\d$`, which rejects `OD-01-10` through `OD-01-14`. Widen to `\d+`. This is a defect the new drafts expose, not a rule change.
5. **Cross-file references** — files 03, 04, 05, 11 cite File 00/01/02 by version or by statements that moved. Update only citations that are now factually wrong; leave every unresolved discrepancy (including the 48-vs-28 open-decision count) recorded rather than corrected.
6. **Regenerate and verify** — `bun run gen:all` (refreshes `CANON_INDEX.md`, `OPEN_DECISIONS.md`, `CURRENT_STATE.md`, current-state fingerprint), extend `src/test/ssls-3-0-canon.test.tsx` with a multi-digit decision-ID regression and the new counts, refresh evidence, then run `bun run verify:ci`.

## Not in this plan

No owner decision recorded or closed. No document moved from CANDIDATE to CANONICAL. No 3.0 product, schema, route set, or technology selected. No publish or redeploy. Files 03–11 are not rewritten.

## After

Your dispositions stay open: OD-00-9 (File 00 authority summary), the fourteen File 01 items, the eight File 02 items, and AUDIT-001. I close none of them.
