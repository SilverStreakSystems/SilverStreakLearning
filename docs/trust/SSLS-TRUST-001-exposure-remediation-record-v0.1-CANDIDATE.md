# SSLS-TRUST-001 — Exposure Remediation Record v0.1 CANDIDATE

- **Work package:** WP-000 — Exposure Containment & Credential Remediation
- **Program:** SSLS-BPP-001 v2.0 (ratified by DEC-007)
- **Executed:** 2026-08-17 04:41–04:43 UTC
- **Repository HEAD at execution:** `9854a119bbcaffc0469118bc04a9013fbb966f6f`
- **Record state:** Executor output, OWNER CLOSED by DEC-008 on 2026-08-17. Residual
  unknown accepted by DEC-009. Closure is an owner act on this evidence package, not a
  technical certification; all evidence below remains executor/self-verified and is
  preserved exactly as executed.

## 1. Scope boundary

Exposure containment and credential remediation only. No feature work, no architecture
advancement, no WP-006 work performed.

## 2. Surfaces inspected

| Surface                                       | Method                                                           | Result                                                                |
| --------------------------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------- |
| Working tree (337 tracked files, 0 untracked) | gitleaks 8.28.0 `--no-git`; deterministic regex sweep            | No secrets, no PII patterns                                           |
| Git history, current branch                   | gitleaks 8.28.0 `detect` (236 commits scanned)                   | No leaks                                                              |
| Git history, all refs                         | gitleaks `--log-opts=--all`; full `git log --all -p` regex sweep | No leaks; only two `noreply` commit-author addresses                  |
| Branches and tags                             | `git for-each-ref` (10 refs, 0 tags)                             | All refs point at `9854a11` or `b2b794d`; both within scanned history |
| Deleted-file history                          | `git log --all --diff-filter=D --name-only`                      | 4 deleted files, all source modules; no data files                    |
| Commit messages                               | `git log --all --format=%s` (14 unique)                          | No sensitive content                                                  |
| Static assets `public/`                       | Directory listing                                                | `favicon.ico`, `robots.txt` only                                      |
| Tracked binaries / exports                    | `git ls-files` filtered on png/jpg/pdf/csv/xlsx/zip/sql/db       | None tracked                                                          |
| Environment configuration                     | Filesystem listing; `rg process.env / import.meta.env`           | No `.env`, `.dev.vars`, or env reads in source                        |
| Project secrets                               | Platform secret inventory                                        | 1 secret: `LOVABLE_API_KEY` (platform-managed)                        |
| Backend / data stores                         | `src/integrations` absence; no backend enabled                   | No database, no storage buckets, no seed data                         |
| Project metadata                              | `.lovable/project.json`                                          | Template metadata only                                                |
| Deployment surfaces                           | Publish state                                                    | Not published; preview URL serves the same synthetic tree             |

## 3. Exposure records

| exposure_id | source_surface                                                                                        | location                               | category                                                                           | PII     | learner | staff   | family  | credential | district-confidential | earliest       | latest     | accessibility | in history | current accessibility | rotation required | containment                          | remediation                                        | verification                                                        | uncertainty  | evidence_id  | status                                        |
| ----------- | ----------------------------------------------------------------------------------------------------- | -------------------------------------- | ---------------------------------------------------------------------------------- | ------- | ------- | ------- | ------- | ---------- | --------------------- | -------------- | ---------- | ------------- | ---------- | --------------------- | ----------------- | ------------------------------------ | -------------------------------------------------- | ------------------------------------------------------------------- | ------------ | ------------ | --------------------------------------------- |
| EXP-001     | Git history (commit metadata)                                                                         | Author/committer trailers, all commits | Platform `noreply` addresses (`*@users.noreply.github.com`, `noreply@lovable.dev`) | No      | No      | No      | No      | No         | No                    | repo inception | 2026-08-17 | Private repo  | Yes        | Private               | No                | None required                        | None — non-identifying platform aliases            | Regex enumeration of all history diffs; only two distinct addresses | None         | EV-WP000-002 | VERIFIED (no exposure)                        |
| EXP-002     | Repository configuration                                                                              | `.gitignore`                           | No `.env` ignore rule (`*.local`, `.dev.vars` present)                             | No      | No      | No      | No      | Preventive | No                    | repo inception | 2026-08-17 | Private       | N/A        | N/A                   | No                | N/A                                  | Preventive control added: `.env`, `.env.*` ignored | Post-change inspection of `.gitignore`                              | None         | EV-WP000-004 | REMEDIATED (preventive; no exposure occurred) |
| EXP-003     | Third-party surfaces (GitHub mirror, deployment provider, external caches, screenshots, shared links) | Outside inspectable tooling            | Unknown                                                                            | Unknown | Unknown | Unknown | Unknown | Unknown    | Unknown               | Unknown        | Unknown    | Unknown       | Unknown    | Unknown               | Unknown           | None possible from executor position | None                                               | Not verifiable with authorized tooling                              | Whole record | —            | UNKNOWN                                       |

No IDENTIFIED-and-uncontained exposure of real learner, educator, staff, family, district,
or customer information was found on any inspectable surface.

## 4. Containment actions

None required. No inspectable surface held real PII or an exposed credential, and the
project is not published.

## 5. Remediation actions

- Preventive: `.env` / `.env.*` added to `.gitignore` (EXP-002). Non-destructive, no history change.
- No history rewrite performed, considered, or required — no contaminated blob was found.

## 6. Residual unknowns

- EXP-003: third-party copies (external caches, screenshots, shared links, downstream forks)
  cannot be enumerated from within the project. Recorded as UNKNOWN, not remediated.
- gitleaks reported 236 commits scanned while 263 unique commit objects exist across all
  refs; the delta is attributable to blob-level de-duplication but was not independently
  proven. Recorded as a scan limitation, not a clean result.
- Detection is pattern-based. Absence of a match is not proof of absence of sensitive data.

## 7. Related evidence

See `WP-000-evidence-index-v0.1-CANDIDATE.md`.
