# WP-007 checkpoint 002 — Controller v1.1

Date: 2026-08-19. Entry commit: `6e447103fcb65c2054d2080a12847777960a4642`.

## A. Authority check

DEC-007 ratifies SSLS-BPP-001 v2.0. DEC-010 adopts this repository as the software SSOT. DEC-017
closed WP-037; DEC-018 closed WP-038 and made WP-007 next eligible; DEC-012 is accepted. No later
accepted decision supersedes that sequence, and no accepted decision closes Gate A or WP-007.
Cycle 2 proceeds on the owner authorization recorded in this session. Gate A: OPEN. WP-007: ACTIVE.
WP-039: not authorized, not started, not implied.

## B. Entry state recovered

No new entry defects found. Cycle 1 artifacts are intact: 22 sources in
`data/historical/historical-sources.json`, schema v1.0.0, invariant tests executing, projection under
`docs/wp-007/`. FND-016 remains `partial`; FND-010, FND-012, FND-014, FND-017, FND-018 remain open.

## C. Source selection

The owner-preferred **verified August 5, 2026 clean-room v0.2 source is NOT reachable** through the
repository's governed source mechanism, and no such source was opened, inferred, or simulated. The
only clean-room material recorded anywhere in the repository is the v0.15–v0.23 Drive ZIP family at
`docs/wp-006/DRIVE_REPOSITORY_AUTHORITY_MAP.md` line 39, held under HS-018 and HS-019, both
`NOT-ACCESSIBLE-TO-EXECUTOR` with `NOT-AVAILABLE` versions and an import prohibition of record. No
repository artifact dated August 5, 2026 or versioned v0.2 exists as a requirement source.

Selected instead: **HS-011 — ULW-AS-001 v1.3 accessibility acceptance contract as carried in this
repository**, `docs/ACCESSIBILITY_ACCEPTANCE.md`. Rationale: among reachable HIGH-relevance sources,
HS-003 and HS-011 are `HISTORICAL-EVIDENCE` while HS-006 is `RESEARCH-INPUT` and HS-005 is
`REFERENCE-ONLY`; of the two, HS-003 is a current-state report about the repository whereas HS-011 is
the only reachable source carrying adopted-standard normative requirement wording — the material this
cycle exists to recover. HS-011's `PARTIAL` access is inherited by every record: only the
repository-carried excerpt was read, and no claim is made about the upstream full standard.

## D. Cycle target evaluation

Target: define the canonical historical-requirement schema and extract candidate requirements from
exactly one named HIGH-relevance reachable historical source.

Result: **MET.**

| Exit criterion | State |
|---|---|
| Versioned requirement schema exists | MET — `data/historical/HISTORICAL_REQUIREMENT_SCHEMA.json` v1.0.0 |
| Exactly one source extracted | MET — HS-011 only; enforced by test |
| Stable HREQ identifiers | MET — HREQ-001..HREQ-014, unique and sequential |
| Exact in-source locators | MET — line-anchored, pattern-enforced |
| Original wording separated from normalized summary | MET — verbatim text substring-verified against the live file |
| Authority inherited without promotion | MET — every record `HISTORICAL-EVIDENCE`; source `NOT-PROMOTED` |
| Requirement-family classification | MET — 12 accessibility-interface, 1 governance-authority, 1 claim-discipline |
| Extraction confidence and ambiguity | MET — 10 HIGH, 4 MEDIUM; 4 NONE, 2 TERMINOLOGY, 3 SCOPE, 4 VERIFIABILITY, 1 AUTHORITY-BOUNDARY |
| Schema validation and invariant tests | MET — `src/test/historical-requirements.test.ts` |
| Human-readable projection | MET — `REQUIREMENT_CANDIDATES.md`, `REQUIREMENT_FAMILY_INDEX.md`, `EXTRACTION_CONFIDENCE.md`, `CYCLE2_SOURCE_SELECTION.md` |
| Current applicable evidence | MET — EV-032 |

## E. Disposition discipline

Every candidate carries `disposition: CANDIDATE-PRE-DISPOSITION` and
`conformance_state: NOT-ASSESSED`. A test asserts that the strings `REQUIRED-NOW`, `REMEDIATION`,
`TARGET-STATE`, `UNNECESSARY` and `SUPERSEDED` appear nowhere as values in the register. The source's
own state column (`Confirmed` / `Partial` / `Not Run`) was deliberately not carried into any record,
so no extracted candidate inherits an implied satisfaction claim.

## F. Limitations carried forward unchanged

FND-010 open and conflicted. FND-012 open, not verified. FND-014 open and advisory — lint executes at
its pre-existing problem count. FND-016 partially resolved. FND-017 and FND-018 open. CNF-001,
CNF-005, CNF-006 open. DEC-011 and DEC-013 open, routed to WP-008. `bun audit` remains unable to
complete in this environment. HS-018, HS-019 and HS-022 remain unreachable. Published surface remains
PUBLIC PROTOTYPE.

## G. Anti-targets held

No multi-source extraction. No legacy code restoration. No Drive or prior-repository ingestion. No
promotion of historical authority. No owner disposition assigned. No inference of implementation,
testing, release, claimability, or acceptance. No WP-008 conflict resolution. No WP-007 closure. No
Gate A advance. No WP-039 work. No personal data.

## H. Next defensible WP-007 target

Cycle 3, proposed and **not authorized**: extract candidate requirements from the second named source,
HS-003 (`docs/wp-006/`), under the same schema and the same pre-disposition rule, and add a
cross-source duplication index that records where an HS-003 candidate restates an HS-011 candidate
without merging, ranking, or resolving either. Extraction remains single-cycle-per-source and no
disposition is assigned.

## I. Owner decision required

None to proceed with cycle 3 as scoped. Three decisions remain available: whether reachable exports of
HS-018 and HS-019 will be supplied; whether HS-020 session inputs may be transcribed into the
repository as historical evidence; and whether an August 5, 2026 clean-room v0.2 package exists
outside this repository and can be supplied in reachable form.
