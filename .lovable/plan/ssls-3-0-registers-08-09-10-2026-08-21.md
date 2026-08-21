# SSLS 3.0 — Registers 08, 09, 10

Files 00–07 and 11 cite three registers as controlling but they do not exist. Verified: the connected Drive folder holds no decision, requirements, or evidence register (file `08-…` there is the Greenfield Artifact Matrices workbook, unrelated). So the three registers must be composed from content already cited across the existing foundation files — nothing invented.

## What gets created

Three CANDIDATE markdown registers in `docs/ssls-3.0/`, each with the same header block, evidence labels (`[C]` / `[I]` / `[U]`), non-effects block, and change history as files 00–07.

### 08-SSLS_3.0_DECISIONS.md — Decision Register
- Recorded and in force: `D-3001` through `D-3010`, reconstructed from the ten decisions named in file 04 §6 and stated verbatim where the charter, hierarchy, scope, and manifest already word them (project identity; North Star; naming rule; clean-slate mandate; decision authority; synthetic/no-PII posture; default-deny authority; draft status of the package; claims default NOT AUTHORIZED; version scheme). Each row carries basis, source file, consequence, reversibility, and revisit trigger.
- Open decisions: the `OD-nn-n` items cited across files 01–07 and 11, prioritised exactly as the consolidated queue in file 04 §13. File 04 states twenty-eight are open; the register lists every OD actually cited by the source files and records the residual count as an unresolved discrepancy (`[U]`) rather than inventing rows to reach 28.
- Explicit note that none of `D-3001`–`D-3010` is independently ratified (file 04 §11, rung 5).

### 09-SSLS_3.0_REQUIREMENTS.md — Requirements Register
- Foundation governance requirements only, derived from the in-scope items in file 05 and the charter principles — the only requirement class currently authorized.
- Each requirement: ID, statement, source file, authority class, acceptance criterion, status (all `DRAFT`, none approved — file 04 rung 4), and blocking decision.
- Explicit exclusion table restating the not-authorized set from file 04 §5, so absence of product requirements is a recorded position rather than a gap.

### 10-SSLS_3.0_EVIDENCE_AND_CLAIMS.md — Evidence and Claims Register
- Evidence section: the six evidence items file 04 §9 counts — each an observation about this environment or the absence of a thing — with review class `AI-assisted self-verification`, independent evidence `0`, test evidence `0`.
- Claims section: claims default NOT AUTHORIZED; zero authorized claims; the prohibited-claim discipline mirrored from the existing trust canon by reference, not by copy.
- Claim authorization procedure: evidence linkage → contradiction check → limitations in the wording → owner decision.

## Naming reconciliation

Files 03 and 11 name these as `.xlsx` (`08-SSLS_3.0_DECISION_REGISTER.xlsx`, etc.). The request is for `.md`. Both are CANDIDATE drafts, so file 03's manifest rows and file 11's mapping table get updated to the markdown filenames, with a change-history line recording the format change and a note that the format itself remains open to owner decision. Inbound links in files 02, 04, 05 are repointed so no reference dangles.

## Boundaries

- No owner decision is closed, ratified, or created by this work. Every new record is CANDIDATE with authority `None`.
- SSLS 2.0 registers (`src/fixtures/registers.ts`, `data/`) are untouched — 3.0 canon stays in `docs/ssls-3.0/` on its own plane.
- No generator, schema, route, UI, or test change: these are hand-authored canon documents, matching how 00–07 and 11 were ingested.
- Verification: `bun run verify` to confirm the doc additions leave the existing gate green.

## Open question, recorded not guessed

The exact wording of `D-3001`–`D-3010` was never supplied — file 04 names their subjects only. The register will state each decision in the wording the charter/hierarchy/scope files already use for that subject, and flag the reconstruction as `[I]` (inferred) so owner review corrects rather than ratifies it.
