# WP-007 v0.3.0 Package Integration — Re-Verification Pass

## What the repository already shows

Truth recovered before planning (read-only):

- Branch/HEAD: `edit/edt-ba06e7c2…` at `3955257`, working tree clean.
- The three re-supplied files are byte-identical to the files already ingested:
  - PDF `9632f08c…f943` — matches the manifest and registered artifact PKA-001.
  - XLSX `68064dcb…ce8e` — matches the manifest and registered artifact PKA-002.
  - Manifest TXT `3a98382e…a130` — matches registered PKA-003 (self-hash excluded).
- `data/packages/governed-packages.json` already holds PKG-002 (v0.3.0, SYNCHRONIZED-REFERENCE, NONCANONICAL, three artifacts, integrity VERIFIED-MATCH, retention NOT-RETAINED-GOVERNED-EXTERNAL-LOCATOR) and PKG-001 (v0.2.0, HISTORICAL-EVIDENCE).
- `docs/wp-007/CHECKPOINT-003.md` already carries the full target-stack contract, including anti-targets and the proposed next target.
- `src/test/governed-packages.test.ts` already contains 22 executing tests covering every test listed in section 10 of the prompt (digest match, no self-hash claim, three-file completeness, absent DOCX/ZIP, DEC-012/DEC-018 accepted, WP-038 closed, WP-007 active, WP-039 unauthorized, FND-016 partial, FND-017/018 open, HREQ pre-disposition, synchronized-reference ≠ authority, no promotion by recency, no Gate 0, no v0.2.0-as-current, current-state agreement).

So this cycle's locked outcome is already recorded. Re-ingesting would duplicate records and create drift — the defensible work is a bounded re-verification and freshness pass.

## Plan

1. **Independent re-verification of the supplied package**
   Recompute both declared digests plus the manifest digest against the freshly uploaded copies, and assert equality with the registered PKA-001/002/003 values. Confirm no new or changed artifact was supplied (the "-2" filenames are duplicates, not new versions).

2. **Supersession search**
   Re-scan registers and active docs for later controlling authority and for stale references (Gate 0, WP-038 active, WP-007 merely next-eligible, WP-039 authorized, DEC-012/018 unaccepted, FND-016 unknown, `HANDOFF_TO_WP-039.md`, v0.2.0 as current). Report any hit; repair only stale locators, never authority.

3. **Freshness repairs only if the scan finds drift**
   Examples in scope: a drift-register row whose recorded validation counts trail the current suite, a generated projection that no longer matches its JSON source. Regenerate from the structured sources; never hand-edit generated views.

4. **Evidence record**
   Add one new evidence record (next free EV-0xx) proving re-verification: inputs, digests, comparison result, date 2026-08-19, bound to HEAD. It proves identity only — it closes nothing and promotes nothing.

5. **Test addition**
   Add a test asserting the registered artifact digests equal the literal manifest values and that the register still declares exactly three v0.3.0 artifacts with no fabricated repository locator — pinning the re-verification so a future edit cannot silently drift it.

6. **Full validation and checkpoint**
   Run tests, typecheck, production build, lint (current executable form), evidence generation and verification, package/hash verification, schema validation, stale-reference search. Preserve exact outcomes — known unresolved items (FND-012 branch protection, FND-014 lint debt, `bun audit` not completing, no independent validation) stay recorded as-is, never converted to PASS. Append a re-verification section to `docs/wp-007/CHECKPOINT-003.md` (no new checkpoint number, since no new cycle target is authorized) and return the full A–P completion report.

## Anti-targets (held)

No WP-007 closure or disposition, no WP-039 authorization, no HREQ disposition or further extraction, no re-ingestion or duplicate package record, no new route or role, no AI capability, no PII, no deploy/publish/release, no conformance or compliance claim.

## Expected result

Locked outcome evaluated as **ACHIEVED (previously, re-verified)** with the fresh evidence record binding today's verification to the current HEAD — unless the supersession scan surfaces a conflict, in which case the cycle reports BLOCKED with the controlling record and the minimum owner decision required.
