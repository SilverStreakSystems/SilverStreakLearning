# WP-006 — Closure Reconciliation, DQ-R01 Package, Gate-A Handoff

Governance and evidence work only. No product functionality, no WP-037 execution, no database.

## Verified current state (read before planning)

- HEAD is `7acb5d6e9aabe1960212d4498b6fd9ffaacdc934` on branch `edit/edt-32665212-...`; top commit "Added SSOT binding CI guard".
- The SSOT binding guard currently **FAILS** at HEAD: all four bound documents still declare `6aa254e…` (`[MISMATCH]` x4, exit 1). This is expected drift caused by the guard's own commit.
- Registers already carry EV-013/EV-014/EV-015, DEC-010…DEC-013 (all `required`), FND-001…FND-010, and DEC-007/008/009.
- Scripts available: `test`, `build`, `lint`, `check:ssot-binding`.

## What this work package pass does

### 1. Authority check
Confirm from `src/fixtures/registers.ts` that DEC-007, DEC-008, DEC-009 are accepted and current and that nothing supersedes them. If any fails, stop and return `BLOCKED — WP-006 CLOSURE AUTHORITY NOT ESTABLISHED`.

### 2. Re-execute evidence at current HEAD
Run at `7acb5d6`: `bun run test`, `bun run build`, `bun run check:ssot-binding`, plus lint reported in two separate buckets — WP-006-touched files vs. full repository (pre-existing `scripts/gen-value-stream-docs.ts` errors stay visible as a finding, never absorbed into a "lint PASS").

### 3. Guard verification with both controls
- Positive: guard passes after rebinding (`--head=<HEAD>` → exit 0).
- Negative: run the guard with a deliberately wrong `--head` value; assert exit 1 and `[MISMATCH]` textual state. No governed record is edited to force the failure.
Record command, SHA, environment, expected, actual, method, timestamp, evidence ID for each.

### 4. Legitimate rebinding only
Rebind the four current-summary documents (SSOT record, `PROVENANCE_REPORT`, `BUILD_MANIFEST`, `TEST_BUILD_STATUS`) to `7acb5d6` **and** refresh the figures they carry (commit count, tracked files, route/test counts, build result) from freshly executed inspection. Any field not reverified is marked stale/unknown rather than carried forward silently. EV-013 stays bound to `70c1f89`; EV-014 is marked superseded by a new EV-016 for the `7acb5d6` binding; EV-015 gains the re-run result plus new EV-017 for the negative control.

### 5. Exit-criteria reconciliation
Rewrite `EXIT_CRITERIA_MATRIX.md` using strictly PASS / FAIL / NOT VERIFIED / N/A, each row carrying evidence ID, SHA, method, limitation, and linked finding. The fourteen closure questions in the prompt are answered explicitly. No criterion is softened to make closure easier; criterion 4 (authorized go-forward SSOT) remains owner-blocked.

### 6. CI enforcement status
From repository content prove only A–D (implemented, runs on push, runs on PR, uses PR head SHA). Branch protection is recorded as `REQUIRED MERGE ENFORCEMENT — NOT VERIFIED` and raised as a finding; it is not inferred from the workflow file.

### 7. Semantic-freshness limitation
Kept open, not resolved. Classified as an input to WP-037 with the recommendation that WP-037 split immutable execution evidence from the current baseline manifest so unrelated commits stop forcing meaningless rebinds.

### 8. DQ-R01 / DEC-010 decision brief
Refresh `DQ-R01-DECISION-BRIEF.md`: Options A–D scored on provenance, implementation, No-PII posture, history, contamination, test and evidence continuity, authority alignment, migration burden, maintainability, rollback, operational feasibility, with `[C]` / `[I]` / `[U]` markers. Recommend Option A (current Lovable repository as go-forward SSOT), historical artifacts as evidence lineage, any later-discovered repository quarantined. DEC-010 stays `state: required` with exact proposed owner wording; it is not marked accepted.

### 9. Open decision routing
For DEC-011, DEC-012, DEC-013 state whether each blocks WP-006 closure, WP-037, or a Gate A criterion, and record routing: DEC-011 → WP-008, DEC-012 → no later than WP-041, DEC-013 → WP-008. None are resolved here.

### 10. Findings and claims
Reuse existing finding IDs where the issue persists; add new findings only for SSOT declaration drift at HEAD, unverified branch protection, and pre-existing lint failures if not already registered. Claims Register gains at most the evidenced wording "an automated repository check verifies that designated current-state documents declare the commit under review"; the five prohibited propositions stay prohibited.

### 11. Closure recommendation and handoff
Add `WP-006-CLOSURE-RECOMMENDATION.md` and `GATE-A-HANDOFF-NOTE.md` listing the inputs WP-037 inherits (repository identity, baseline manifest, evidence schema, EV-013/014/015/016/017 lineage, guard implementation, both limitations, build/test commands, synthetic fixture posture, Claims Register, findings). Expected recommendation: **PROMOTE TO OWNER CLOSURE**, terminal status `WP-006 EXECUTOR-COMPLETE — OWNER SSOT DISPOSITION REQUIRED`.

## Technical notes

- Doc edits under `docs/wp-006/` plus additive record entries in `src/fixtures/registers.ts`.
- `src/test/ssot-binding.test.ts` constants update to the new binding; the 210+7 existing tests must continue to pass.
- No new routes, no schema, no dependencies, no product code.

## Out of scope

WP-037 implementation, evidence-pipeline architecture, route repair, database provisioning, branch-protection configuration (repository settings, outside this project), and any owner decision closure.

## Final output

The response returns sections A through S exactly as specified in the prompt.
