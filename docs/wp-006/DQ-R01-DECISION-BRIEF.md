# DQ-R01 — Go-forward software SSOT repository

Decision brief, reconciled 2026-08-19 at commit `9a257f754e97b9cddf9a474009c5947488102c04`.
Decision-ready and undecided. Owner-only. Status markers: [C] confirmed, [I] supported
interpretation, [U] unknown.

## Question

Which repository is the authorized go-forward software source of truth for SSLS, and what is the
disposition of every other discoverable source-code lineage?

## Authority

- Ratified program: SSLS-BPP-001 v2.0 (DEC-007, accepted, current).
- WP-000 owner-closed by DEC-008; residual unknown accepted by DEC-009. Both accepted and current.
- Applicable prior decisions: ADR-002 (legacy is evidence, not a codebase), OD-17/OD-20/OD-21/OD-23,
  REPO-BOOT-001 v0.2, FIRST-COMMIT-001 v0.1 (candidate, never executed).
- No later decision supersedes the program authority. Nothing in the chain has already decided this
  question.

## Evidence summary

| Fact | Status |
|---|---|
| Exactly one repository holds executable SSLS code (REPO-CAND-001) | [C] |
| Its provenance is fully recoverable (root `3190f797`, HEAD `9a257f7`, 330 commits) | [C] |
| Its root commit carries no SSLS legacy ancestry | [C] |
| It builds and passes 217 tests at the bound source tree | [C] |
| A declared-binding check exists, runs in CI on push and pull request, and uses the pull-request head | [C] |
| Required-merge enforcement of that check | [U] — not verifiable from repository content (FND-012) |
| No database, no migrations, no live integrations | [C] |
| No real PII found; no committed secrets found | [C] within scan limits |
| Repository-wide lint does not pass (683 problems, predominantly formatting) | [C], FND-014 |
| The FIRST-COMMIT-001 12-file origin plan was never executed | [C] |
| A legacy SSLS repository lineage is referenced but not locatable from inside the project | [U] |
| Off-platform copies cannot be enumerated | [U], accepted by DEC-009 |

## Option analysis

| Criterion | A. Current Lovable repository | B. Historical clean repository | C. New clean repository from reviewed artifacts | D. Any other repository discovered by WP-006 |
|---|---|---|---|---|
| Provenance | Fully recoverable to root [C] | Not locatable from inside the project [U] | Would start from a known parent, but discards recovered history [I] | No such repository was discovered [U] |
| Current implementation | Holds all executable code [C] | Holds none that can be shown [U] | Zero at creation; requires migration [C] | Unknown [U] |
| No-PII posture | Scanned across tree and history, no findings [C] | Unscannable while unlocated [U] | Inherits whatever is copied; requires a fresh scan [I] | Unknown [U] |
| History | 330 commits, weak commit messages [C], FND-007 triage | Unknown [U] | Truncated by construction [C] | Unknown [U] |
| Contamination risk | No legacy ancestry detected [C] | Cannot be assessed [U] | Low if the copy set is reviewed [I] | Unknown [U] |
| Test continuity | 217 tests continuous with prior captures [C] | None [U] | Tests survive the copy, history does not [I] | Unknown [U] |
| Evidence continuity | EV-008…EV-017 bind to this lineage [C] | Would orphan all existing evidence [C] | Every evidence record would need rebinding [C] | Unknown [U] |
| Authority alignment | Satisfies ADR-002 and REPO-BOOT-001 in substance; diverges from FIRST-COMMIT-001 (DSC-003) [I] | Cannot be evaluated [U] | Could satisfy FIRST-COMMIT-001 literally [I] | Unknown [U] |
| Migration burden | None [C] | Unknown, presumed high [I] | High: copy, rescan, rebind, re-verify [I] | Unknown [U] |
| Maintainability | Platform-managed, already in use [C] | Unknown [U] | Adds a second lineage to keep coherent [I] | Unknown [U] |
| Rollback | Full history available [C] | Unknown [U] | Loses pre-migration rollback [C] | Unknown [U] |
| Operational feasibility | Immediate [C] | Not actionable while unlocated [C] | Feasible but costly and disruptive [I] | Not actionable [C] |

Option B and Option D cannot be selected on present evidence because their subjects are not located.
Option C is feasible and would satisfy FIRST-COMMIT-001 literally, at the price of discarding
recovered provenance and all evidence continuity for no evidenced defect in Option A. No fact about
an undiscovered repository is asserted anywhere above.

## Recommendation (executor)

Adopt **Option A**: the current Lovable-managed repository becomes the go-forward software SSOT.
REPO-CAND-002 and REPO-CAND-003 are classified HISTORICAL EVIDENCE / GOVERNANCE LINEAGE.
REPO-CAND-004 is classified ARCHIVE READ-ONLY once located. REPO-CAND-005 and any subsequently
discovered prior repository are QUARANTINED FOR FORENSIC CLASSIFICATION until explicitly
dispositioned.

This is a recommendation only. The executor cannot close it.

## Proposed owner decision wording

> Adopt the current Lovable-managed SSLS repository, identified by the repository provenance record,
> as the go-forward software source of truth. Historical repository and bootstrap artifacts remain
> historical governance and evidence lineage and do not control current executable implementation.
> Any subsequently discovered prior repository must be inventoried and explicitly dispositioned
> before use.

## What the decision would and would not do

Would: name the authorized source-code lineage; classify the others; accept the actual root commit as
the controlled origin.

Would not: certify security, privacy, accessibility, or compliance; authorize release, deployment,
live data, or public claims; close Gate A; resolve DSC-001, DSC-004, or DSC-005; establish that the
binding check is enforced at merge.

## Linked open questions

DQ-R02-CAND / DEC-011 (locate or author the program register text), DQ-R03-CAND (authority register
unification), DQ-R04-CAND / DEC-012 (effective accessibility standard revision), DQ-R05-CAND /
DEC-013 (gate lineage).

## Owner disposition

Not recorded. Decision state: **required**.
