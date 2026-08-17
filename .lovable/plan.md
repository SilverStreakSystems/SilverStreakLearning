# WP-006 — Current-State SSOT & Repository Provenance

Documentation, inventory, and reconciliation only. No feature work, no database, no route remediation, no WP-037.

## Entry criteria (verified before this plan)

- SSLS-BPP-001 v2.0 ratified by DEC-007 — `accepted`, current.
- WP-000 owner-closed by DEC-008 — `accepted`, current.
- DEC-009 residual-risk acceptance — `accepted`, current.
- No later decision supersedes DEC-007/008/009 (DEC-010+ do not exist).

Entry criteria satisfied. WP-006 may execute.

## Evidence planes

**A. Current Lovable executable plane (primary).** Recover project ID, branch, HEAD SHA, parent SHA, full source tree, dependency and lockfile state, TypeScript/build/test configuration, entry points, routes, domain models, fixtures, tests, backend/database state, environment contract, and current docs and decision fixtures. Bind every recorded result to the inspected SHA; rerun build and tests rather than reusing prior numbers.

**B. Google Drive control plane.** Requires linking a Google Drive connection to this project (two are available on the account; the plan assumes the primary "Shelby's Google Drive"). Starting at the SSLS root folder and the "START HERE" authority-boundary map, mine 00–90 folders for current control artifacts. If Drive cannot be reached, the whole plane is recorded as UNKNOWN — not assumed empty — and the affected exit criteria stay open.

**C. Historical repository plane.** REPO-MAP-001, REPO-BOOT-001, REPO-STRUCT-001, FIRST-COMMIT-001, prior manifests, Gate 0/Gate 1 artifacts, clean-room packages. Classified as candidate or historical unless a current decision promotes them.

Authority precedence is default-deny, in the order given by the work package. Executable evidence establishes existence, never authorization.

## Deliverables

All written under `docs/wp-006/` except the current-state SSOT, which supersedes-in-place by version rather than duplicating:

1. `SSLS-FND-001-current-state-ssot-v0.1-CANDIDATE.md` — canonical current-state record; `docs/CURRENT_STATE.md` becomes a pointer/mirror with the source relationship recorded, not a second canonical copy.
2. Repository Manifest — every discoverable repository/lineage with the full candidate field set and a recommended disposition.
3. Build Manifest — runtime, package manager, lockfile, TS config, build tool, test runner, lint, a11y tooling, env model, backend status, commands, and freshly executed build/test results bound to the SHA.
4. Route Manifest — every route with id, path, component, source file, purpose, actor, authority class, R-03 implementation status, data source, test coverage, ULW-AS-001 obligation reference, disposition (classification only), and provenance commit.
5. Implementation Inventory — component-level, each entry citing source path and SHA.
6. Repository Provenance Report — branch, commit, parent, tree/lockfile hashes, environment, visibility, preview locator, evidence method, executor.
7. Drive-to-Repository Authority Map — each artifact family classified AUTHORITATIVE SOURCE / REPOSITORY AUTHORITATIVE / CONTROL INDEX / RESEARCH-REFERENCE / HISTORICAL EVIDENCE / CANDIDATE, with source-to-mirror relationships.
8. Repository Candidate Comparison — Options A–D scored on provenance, contamination, implementation, authority alignment, migration burden, history quality, evidence and test continuity, No-PII posture, rollback, maintainability.
9. Gate-Lineage Reconciliation — what Gate 0 and Gate 1 meant, what Gate A means, and whether Gate A supersedes, incorporates, or runs independent of Gate 1. No silent renaming; a finding is raised if no accepted decision resolves it.
10. Discrepancy Register — full field set, including the Drive-vs-Lovable disagreements.
11. Staleness Register — stale propositions marked without overwriting historical text; replacement identified.
12. Current Data/Backend Status — expected `DATABASE STATUS — NOT IMPLEMENTED`, recorded as current truth, not as failure.
13. Current Test/Build Status — bound to SHA.
14. WP-006 Evidence Index — standing schema; every record typed automated/manual/AT/independent. Project self-inspection is never labeled independent.
15. WP-006 Findings Register — Critical/High/Medium/Low.
16. DQ-R01 Decision Brief — decision-ready, recommendation only.
17. WP-006 Exit-Criteria Matrix — all 14 criteria with evidence pointers and open items.

## No-PII verification

WP-000 evidence is reused as prior evidence. If the WP-006 baseline SHA differs from the WP-000 evidence SHA, a scoped delta scan over changed files is run; if that cannot settle it, the status is `UNKNOWN / REVALIDATION REQUIRED`. The zero-real-PII boundary holds: no personal name enters code, fixtures, or app-visible content.

## Governance record updates

- Add WP-006 evidence records and any findings to the governance registers as candidate records only.
- Register the DQ-R01 decision as `state: required` (owner-only). No self-closure.
- Recommend exactly one disposition in the final report.

## Technical notes

- Doc-only increment plus register fixture additions in `src/fixtures/registers.ts`. No new routes, no schema, no dependencies, no product code.
- Existing tests must continue to pass unchanged; any new test is limited to guarding record integrity of the added evidence/decision entries.
- Final report returns sections A through V exactly as specified.

## Out of scope

WP-037, route repair, requirement conformance auditing (WP-007/WP-011), database provisioning, repository deletion, history rewriting, promotion of candidate doctrine.
