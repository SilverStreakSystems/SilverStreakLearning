# DQ-R01 — Go-forward software SSOT repository

Decision brief. Decision-ready, undecided. Owner-only.

## Question

Which repository is the authorized go-forward software source of truth for SSLS, and what is the
disposition of every other discoverable source-code lineage?

## Authority

- Ratified program: SSLS-BPP-001 v2.0 (DEC-007).
- Applicable prior decisions: ADR-002 (legacy is evidence, not a codebase), OD-17/OD-20/OD-21/OD-23,
  REPO-BOOT-001 v0.2, FIRST-COMMIT-001 v0.1 (candidate, never executed).
- Nothing in the current chain has already decided this question.

## Evidence summary

| Fact | Status |
|---|---|
| Exactly one repository holds executable SSLS code (REPO-CAND-001) | [C] |
| Its provenance is fully recoverable (root `3190f797`, HEAD `70c1f89`, 283 commits) | [C] |
| Its root commit carries no SSLS legacy ancestry | [C] |
| It builds and passes 210 tests at HEAD | [C] |
| No database, no migrations, no live integrations | [C] |
| No real PII found; no committed secrets found | [C] within scan limits |
| The FIRST-COMMIT-001 12-file origin plan was never executed | [C] |
| A legacy SSLS repository lineage is referenced but not locatable from inside the project | [U] |
| Off-platform copies cannot be enumerated | [U], accepted by DEC-009 |

## Options and executor assessment

See `REPOSITORY_CANDIDATE_COMPARISON.md`. Summary: Option A is the only evidenced option.

## Recommendation (executor)

Adopt **Option A** — the current Lovable repository becomes the go-forward software SSOT — with
REPO-CAND-002 and REPO-CAND-003 classified HISTORICAL EVIDENCE SOURCE, REPO-CAND-004 classified
ARCHIVE READ-ONLY once located, and REPO-CAND-005 left UNKNOWN pending owner enumeration.

This is a recommendation only. The executor cannot close it.

## What the decision would and would not do

Would: name the authorized source-code lineage; classify the others; accept the actual root commit as
the controlled origin.

Would not: certify security, privacy, accessibility, or compliance; authorize release, deployment,
live data, or public claims; close Gate A; resolve DSC-001, DSC-004, or DSC-005.

## Linked open questions

DQ-R02-CAND (locate or author the program register), DQ-R03-CAND (authority register unification),
DQ-R04-CAND (effective accessibility standard version), DQ-R05-CAND (gate lineage).

## Owner disposition

Not recorded. Decision state: **required**.
