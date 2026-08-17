# WP-000 — Repository and Git History Scan Evidence v0.1 CANDIDATE

All scans executed 2026-08-17 against commit `9854a119bbcaffc0469118bc04a9013fbb966f6f`
in the sandbox development environment. No secret values are reproduced in this record;
gitleaks was run with `--redact` in every pass.

## Scan 1 — Secret scan, current-branch history

- **Tool / version:** gitleaks 8.28.0
- **Command scope:** `detect --source . --redact` (full commit history of the checked-out branch)
- **Commits scanned:** 236
- **Bytes scanned:** ~2,002,264
- **Result:** 0 findings
- **Report artifact hash (sha256):** `37517e5f3dc66819f61f5a7bb8ace1921282415f10551d2defa5c3eb0985b570` (empty finding array)
- **False positives reviewed:** none to review
- **Limitations:** rule-based; custom or novel credential formats may be missed.

## Scan 2 — Secret scan, all refs

- **Tool / version:** gitleaks 8.28.0
- **Command scope:** `detect --log-opts="--all"` (all branches; repository holds 0 tags)
- **Commits scanned:** 236 (blob-level de-duplication against 263 unique commit objects; delta not independently proven)
- **Result:** 0 findings
- **Report artifact hash (sha256):** `37517e5f...5570` (identical empty report)
- **Limitations:** as Scan 1, plus the unproven commit-count delta.

## Scan 3 — Secret scan, working tree

- **Tool / version:** gitleaks 8.28.0
- **Command scope:** `detect --no-git` (tracked and untracked files on disk)
- **Bytes scanned:** ~2,290,109
- **Result:** 0 findings
- **Limitations:** as Scan 1.

## Scan 4 — Deterministic pattern sweep, working tree

- **Tool / version:** ripgrep (regex sweep, manual rule set)
- **Patterns:** email addresses; US SSN; US phone; `sb_secret`; `service_role`; JWT prefix `eyJhbGciOi`; `sk-…`; `ghp_`/`gho_`; `xoxb-`; `AKIA…`; `BEGIN … PRIVATE KEY`
- **Result:** 0 matches
- **Limitations:** pattern-based; does not detect unstructured personal narrative text.

## Scan 5 — Deterministic pattern sweep, full history diff

- **Scope:** `git log --all -p` (2,439,450 bytes) against the same rule set
- **Result:** 263 line hits, all attributable to commit-author trailers. Distinct addresses enumerated: exactly two, both platform `noreply` aliases.
- **Limitations:** as Scan 4.

## Scan 6 — Sensitive-domain term sweep

- **Scope:** `src`, `docs`, `public`
- **Terms:** school district, ISD, USD, IEP, student name, parent name, guardian, DOB, date of birth
- **Result:** matches only inside code identifiers (`prohibitedObjects`, `SharedObjectTypeRecord`, `sharedObjectsUsed`). No real records.

## Scan 7 — Structural inspection

- Branch/tag enumeration: 6 local branches, 3 remote refs, 0 tags — all at `9854a11` or `b2b794d`.
- Deleted-file history: `src/domain/capability.ts`, `src/fixtures/capabilities.ts`, `src/fixtures/future-workspaces.ts`, `src/test/dbg.test.tsx` — source modules only.
- Tracked binary/export file types (png, jpg, jpeg, pdf, csv, xlsx, zip, sql, db): none.
- `public/`: `favicon.ico`, `robots.txt`.

## Method classification

All scans above are **automated** and executed by the work-package executor. Per R-11 none
of them constitutes independent validation.
