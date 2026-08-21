# WP-007 checkpoint 001 — Controller v1.1

Date: 2026-08-19. Entry commit: `62ce7d3a9c305674de5bd83801af3bf5c41edf83`.

## A. Authority check

DEC-007 ratifies SSLS-BPP-001 v2.0. DEC-010 adopts this repository as the software SSOT.
DEC-017 closed WP-037; DEC-018 closed WP-038 and made WP-007 next eligible; DEC-012 is accepted.
No later accepted decision supersedes that sequence, and no accepted decision closes Gate A.
Gate A: OPEN. WP-039: not authorized, not started, not implied.

## B. Entry defects repaired

1. Stale handoff locator: `docs/wp-038/HANDOFF_TO_WP-039.md` renamed to
   `docs/wp-038/HANDOFF_TO_WP-007.md` with active references updated in
   `docs/wp-038/README.md` and `scripts/gen-obligation-docs.ts`. Recorded as EV-030.
2. FND-016's structured `resolutionState` corrected from `unknown` to `partial` to match the
   owner disposition already written in its description. No wording changed, nothing closed.

## C. Cycle target evaluation

Target: a canonical, machine-readable, schema-validated historical-source register covering the
defined repository source universe, every source carrying an evidence-backed authority
classification, exact locator, version or hash where available, access limitation and recovery
relevance, with no historical source promoted.

Result: **MET.**

| Exit criterion                             | State                                                        |
| ------------------------------------------ | ------------------------------------------------------------ |
| Versioned schema exists                    | MET — `data/historical/HISTORICAL_SOURCE_SCHEMA.json` v1.0.0 |
| Bounded universe inventoried               | MET — 22 sources, boundary declared in the register          |
| Every source classified with basis         | MET — enforced by test                                       |
| Exact locator on every source              | MET — enforced by test                                       |
| Version or hash, or explicit NOT-AVAILABLE | MET — unreachable sources carry NOT-AVAILABLE                |
| Access limitation recorded                 | MET                                                          |
| Recovery relevance with reason             | MET; unreachable sources are UNKNOWN by rule                 |
| No promotion of historical authority       | MET — enforced by test                                       |
| Source immutability preserved              | MET — no historical artifact rewritten                       |
| Invariant tests executing                  | MET — `src/test/historical-sources.test.ts`                  |
| Current applicable evidence                | MET — EV-030, EV-031                                         |

## D. Classification distribution

CURRENT-AUTHORITY 3 (repository, obligation registers, application registers — each carried by an
accepted decision), HISTORICAL-EVIDENCE 8, RESEARCH-INPUT 5, REFERENCE-ONLY 4, REFUSED 1
(legacy SSLS 1.x application code, refused under the clean-slate posture and WP-007 anti-targets).

## E. Access limitations recorded

Three sources are `NOT-ACCESSIBLE-TO-EXECUTOR`: the prior repository and bootstrap artifacts named
in WP-006 provenance (HS-018), the owner-supplied Drive folder (HS-019), and legacy application
code (HS-022). Each carries `NOT-AVAILABLE` for version, `UNKNOWN` recovery relevance, and
`UNINSPECTED` personal-data status. No content, count, or completeness claim is made about any of
them. HS-011 (ULW-AS-001 v1.3) and HS-020 (operator session prompt inputs) are `PARTIAL`.

## F. Limitations carried forward unchanged

FND-010 open and conflicted. FND-012 open, not verified — a CI workflow is not branch protection.
FND-014 open and advisory — lint executes at 686 pre-existing problems. FND-016 partially resolved.
FND-017 and FND-018 open. CNF-001, CNF-005, CNF-006 open. DEC-011 and DEC-013 open, routed to
WP-008. `bun audit` remains unable to complete in this environment. Published surface remains
PUBLIC PROTOTYPE.

## G. Anti-targets held

No requirement extraction, no legacy code restoration, no promotion of historical authority, no
rewriting of historical artifacts, no personal data, no product features or routes, no WP-008
conflict resolution, no gate or work-package closure, no WP-039 work.

## H. Next defensible WP-007 target

Cycle 2, proposed and not authorized: for the reachable HIGH-relevance sources only — HS-003,
HS-005, HS-006, HS-011, HS-013, HS-016, HS-020 — define the historical requirement record schema
and extract candidate requirements from a single named source, each bound to its source ID and an
exact in-source locator, classified as candidate with no conformance state assigned. HS-018 and
HS-019 stay blocked until the owner supplies reachable exports; an owner decision is required
before either is opened.

## I. Owner decision required

None to proceed with cycle 2 as scoped. Two decisions are available if the owner wants them:
whether to supply reachable exports of HS-018 and HS-019, and whether HS-020 session inputs may be
transcribed into the repository as historical evidence.
