# Repository Candidate Comparison — evidence for DQ-R01

Comparison only. The go-forward repository is an owner decision and is not decided here.

## Options

- **Option A** — the current Lovable repository (REPO-CAND-001) becomes the go-forward SSOT.
- **Option B** — a historical clean repository becomes the SSOT.
- **Option C** — a new clean repository is created from reviewed current artifacts.
- **Option D** — another evidenced repository becomes the SSOT.

## Evaluation

| Criterion                 | Option A                                                                                                                    | Option B                                                                                                        | Option C                                                                                             | Option D                    |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | --------------------------- |
| Provenance                | [C] Fully recoverable: root commit, 283 commits, branch, HEAD, tree hash, lockfile hash                                     | [C] No such repository exists — the "clean repository" is a Drive plan and ZIP packs, never instantiated in Git | [I] Would start with perfect provenance from commit one                                              | [U] No candidate identified |
| Contamination risk        | [C] Low: root commit is a platform template scaffold; no legacy SSLS history, no legacy secrets, no legacy backend bindings | Not applicable                                                                                                  | [I] Lowest in theory; in practice the imported artifacts are the same artifacts                      | [U]                         |
| Current implementation    | [C] All of it: 30 route files, 210 tests, working build                                                                     | [C] None                                                                                                        | [I] Requires re-import of ~35.5k lines                                                               | [U]                         |
| Authority alignment       | [I] Partial: DEC-007/008/009 already reference this baseline; deviates from the never-ratified FIRST-COMMIT-001 plan        | [C] Aligns with a plan that was never executed and is now stale                                                 | [I] Could satisfy FIRST-COMMIT-001 literally, at the cost of discarding executed governance evidence | [U]                         |
| Migration burden          | [C] None                                                                                                                    | High and pointless                                                                                              | High: re-import, re-verify, re-run all evidence, re-bind every SHA in existing records               | [U]                         |
| History quality           | [I] Machine-generated commit messages ("Changes") reduce narrative value, but every state is recoverable                    | Not applicable                                                                                                  | [I] Would be clean but empty                                                                         | [U]                         |
| Evidence continuity       | [C] WP-000 evidence, DEC-008/DEC-009, and accessibility evidence are all bound to commits in this lineage                   | [C] None                                                                                                        | [C] Broken: every existing evidence record would become historical and require re-execution          | [U]                         |
| Test continuity           | [C] 210 tests passing at HEAD                                                                                               | None                                                                                                            | Would need full re-run and re-binding                                                                | [U]                         |
| No-PII posture            | [C] No real PII found; WP-000 full scan at `9854a11`, delta scan clean at HEAD                                              | Unknown                                                                                                         | [I] Equivalent at best                                                                               | [U]                         |
| Rollback                  | [C] Any commit is recoverable                                                                                               | Not applicable                                                                                                  | [I] Old repository would be retained as fallback anyway                                              | [U]                         |
| Long-term maintainability | [C] Platform-managed hosting; single-remote dependency on the Lovable platform is the main structural risk                  | Not applicable                                                                                                  | [I] Provider choice could be widened, at migration cost                                              | [U]                         |

## Residual risks under Option A

1. Hosting is platform-managed; the repository is reachable only through the platform locator and an
   S3 secondary. No independent off-platform mirror is evidenced. [U]
2. Commit messages are largely non-descriptive, weakening narrative traceability. [C]
3. No branch protection, secret scanning, or required status checks are evidenced, contrary to
   REPO-BOOT-001's containment expectations. [U]
4. The first-commit ratification ritual of FIRST-COMMIT-001 was never performed (DSC-003). [C]

Each risk is addressable inside Option A; none of them is cured by Options B, C, or D.

## Recommendation (executor, not a decision)

**Option A.** It is the only option with executable code, recoverable provenance, continuous
evidence, and passing tests. Options B and D have no evidenced repository behind them. Option C
would discard evidence continuity and re-import the same artifacts to satisfy a plan the owner never
ratified.

Recommended accompanying conditions, for the owner to accept or reject:

- Freeze any legacy SSLS repository read-only as historical evidence, once located.
- Record the actual root commit as the controlled origin instead of retrofitting FIRST-COMMIT-001.
- Enable protected-branch and secret-scanning controls to the extent the platform supports them.
- Adopt meaningful commit messages going forward.
