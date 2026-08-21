# Repository Manifest — candidate repositories and source lineages

Authority class: candidate. Every candidate reasonably discoverable from inside the current project
and from the SSLS Drive corpus is listed. No repository was created, modified, frozen, or deleted.

## REPO-CAND-001 — Current Lovable project repository

| Field                                   | Value                                                                                                                    |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| repository_id                           | REPO-CAND-001                                                                                                            |
| repository_name                         | SSLS 2.0 foundation shell (Lovable project `87c55369-0a52-4467-a48b-f8adcfd7d11e`)                                       |
| provider                                | Lovable-managed Git (GCP code storage), with an S3 secondary                                                             |
| URL / safe locator                      | `git.private.lovable-gcp.code.storage/87c55369-0a52-4467-a48b-f8adcfd7d11e.git`                                          |
| visibility                              | Private; not published                                                                                                   |
| owner                                   | Founder / Operator                                                                                                       |
| branch                                  | `edit/edt-f97ae920-46a2-4498-aa4f-4b8f70b79817`                                                                          |
| HEAD SHA                                | `70c1f891c5d341c60132d0109979042004425a4b`                                                                               |
| root commit SHA                         | `3190f7973cc6626912c8de24731514df0608a5d9`                                                                               |
| creation date                           | 2026-08-16 (root commit)                                                                                                 |
| last activity                           | 2026-08-17                                                                                                               |
| ancestry                                | Platform template scaffold only; no SSLS legacy history                                                                  |
| relationship to prior SSLS repositories | None in Git terms. Concept-level continuity only.                                                                        |
| relationship to Lovable                 | Platform-hosted and platform-managed                                                                                     |
| current executable code                 | Yes — builds and runs                                                                                                    |
| database / migrations                   | None                                                                                                                     |
| tests                                   | Yes — 210 passing at HEAD                                                                                                |
| CI                                      | None detected in-repo                                                                                                    |
| real PII found                          | None found (delta scan at HEAD; WP-000 full scan at `9854a11`)                                                           |
| secrets found                           | None in tree. The checked-out remote URL carries a platform-scoped token — a platform mechanism, not a committed secret. |
| governance references                   | DEC-007, DEC-008, DEC-009, `docs/CURRENT_STATE.md`, `docs/trust/*`                                                       |
| current authority state                 | Implemented executable evidence; authority declared separately in the registers                                          |
| recommended disposition                 | **GO-FORWARD SSOT** (owner decision DQ-R01 required)                                                                     |

## REPO-CAND-002 — First-commit candidate package (Drive)

| Field                    | Value                                                                          |
| ------------------------ | ------------------------------------------------------------------------------ |
| repository_id            | REPO-CAND-002                                                                  |
| repository_name          | 12-file first controlled commit candidate                                      |
| provider                 | Google Drive folder, not a repository                                          |
| safe locator             | `/10 - CURRENT - SSLS and FOS/00-governance/repository/first-commit-candidate` |
| visibility               | Drive-private                                                                  |
| branch / HEAD / root SHA | None — never instantiated as Git                                               |
| creation date            | 2026-08-07 (FIRST-COMMIT-001 v0.1)                                             |
| ancestry                 | None                                                                           |
| executable code          | No — documentation and containment files only                                  |
| database / tests / CI    | None                                                                           |
| PII / secrets            | Owner name present in Drive metadata; no credentials observed                  |
| governance references    | FIRST-COMMIT-001, REPO-BOOT-001 v0.2, REPO-MAP-001, ADR-002                    |
| current authority state  | Candidate, never ratified, never executed                                      |
| recommended disposition  | **HISTORICAL EVIDENCE SOURCE**                                                 |

## REPO-CAND-003 — Clean-restart bootstrap source packages (Drive ZIPs)

| Field                   | Value                                                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------------------------------- |
| repository_id           | REPO-CAND-003                                                                                                 |
| repository_name         | `SSLS_Clean_Restart_Repository_Bootstrap_v0.1_2026-08-06.zip` and sibling v0.15/v0.18/v0.19/v0.20/v0.23 packs |
| provider                | Google Drive, `/10 - CURRENT - SSLS and FOS/00-governance/source-packages`                                    |
| branch / SHA            | None                                                                                                          |
| executable code         | Not verified; packages not extracted during WP-006                                                            |
| governance references   | REPO-BOOT-001, LEGACY-REPO-001, OD-17 through OD-24                                                           |
| current authority state | Candidate / historical control packs                                                                          |
| recommended disposition | **HISTORICAL EVIDENCE SOURCE**                                                                                |

## REPO-CAND-004 — Legacy pre-clean-restart SSLS repository lineage

| Field                             | Value                                                                                                                                                       |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| repository_id                     | REPO-CAND-004                                                                                                                                               |
| repository_name                   | Legacy SSLS repository (pre-clean-restart)                                                                                                                  |
| provider                          | Unknown from inside this project                                                                                                                            |
| safe locator                      | Referenced by LEGACY-REPO-001 and ADR-002; quarantined evidence under `/10 …/source-packages/legacy-repository-evidence` and `/90 - HISTORY AND SUPERSEDED` |
| visibility / owner / branch / SHA | Unknown                                                                                                                                                     |
| executable code                   | Historical                                                                                                                                                  |
| PII / secrets                     | Unknown — not inspected in WP-006                                                                                                                           |
| current authority state           | Evidence and pattern catalog only, per ADR-002                                                                                                              |
| recommended disposition           | **ARCHIVE READ-ONLY** if it still exists; **UNKNOWN** until located                                                                                         |

## REPO-CAND-005 — Prior Lovable project(s)

| Field                   | Value                                                                                                                     |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| repository_id           | REPO-CAND-005                                                                                                             |
| repository_name         | Any earlier Lovable project for SSLS                                                                                      |
| evidence                | None discoverable from inside this project; no cross-project reference found in the tree or in the Drive corpus inspected |
| current authority state | Unknown                                                                                                                   |
| recommended disposition | **UNKNOWN** — owner is the only party who can enumerate account-level projects                                            |

## Summary

One repository holds current executable code (REPO-CAND-001). Everything else is documentation,
packaged artifacts, or an unenumerated legacy lineage. No repository was deleted; deletion is out of
scope for WP-006.
