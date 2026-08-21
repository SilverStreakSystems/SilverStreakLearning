# Gate-Lineage Reconciliation

Two gate taxonomies exist. They are not renamed into one another here. No accepted decision in the
current authority chain (DEC-001…DEC-009) reconciles them, so this reconciliation is analysis plus a
finding, not a resolution.

## Historical taxonomy (Drive, pre-program)

| Gate                                     | Meaning as evidenced                                                                                                                                                                                                                                                                                            | Current state                                                                                     |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Gate 0 — decision-ready control baseline | Establish charter, controls, source hierarchy, No-PII boundary, claims/evidence controls, artifact register, and owner decisions sufficient to continue. Evidence: `GATE0-REV-001_Final_Review`, `Gate_0_Decision_Ready_Crosswalk`, control packs v0.15–v0.19.                                                  | **CLOSED — ADVANCE** by OD-24 (2026-08-06), owner-approved. Artifacts remain evidence.            |
| Gate 1 — Governed Foundation Complete    | Complete governance foundation: charter disposition, active source manifest, namespace map, first controlled repository commit ratification, Gate 1 exit checklist and evidence index. Evidence: G1-PREP-001 v0.2, G1-EVID-001 v0.2, G1-EXIT-001 v0.2, Gate 1 Control Workbook v0.24.0, AI-assisted pre-review. | **IN PROGRESS, never owner-closed.** Its owner-outcome template (`G1-OD-CAND-001`) remains blank. |

A third, unrelated use of gate letters exists inside REPO-BOOT-001 v0.2, where "Gate A — Containment"
and "Gate B — Truth in Documentation" are _bootstrap phases of a specification_, not program gates.
This naming collides lexically with the program's Gate A and must not be read as the same thing.

## Current taxonomy (SSLS-BPP-001 v2.0)

| Gate                     | Meaning as evidenced in the current chain                                                                                                                                       |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gate A — Workspace Proof | The gate under which WP-006 is sequenced (Seq 01, Foundation domain). Its full definitional text lives in the program register, which is not located in either plane (DSC-001). |
| Gate B / C / D           | Named by the program; definitions not located.                                                                                                                                  |

## Relationship assessment

[I] Gate A and historical Gate 1 overlap in subject matter — both concern a governed foundation
before substantive product implementation — but they are not equivalent:

- Gate 1's exit conditions are Drive-artifact conditions (charter disposition, source manifest,
  first-commit ratification). Gate A's conditions are work-package conditions under a register that
  post-dates it.
- Gate 1 was never closed; Gate A is being executed. Executing Gate A does not close Gate 1, and no
  accepted decision states that it supersedes, replaces, or incorporates Gate 1.

[U] Whether Gate A supersedes, incorporates, or runs independently of Gate 1 is **unresolved**. No
DQ-R05 or equivalent accepted decision was located.

Consequences of leaving it unresolved:

- Gate 1 evidence (G1-EVID-001, G1-EXIT-001) has no stated status under the current program.
- The first-commit ratification condition of Gate 1 was never satisfied, while a repository with 283
  commits now exists — a live contradiction between the two planes (DSC-003).

## Disposition of historical gate artifacts

| Artifact                                     | Remains evidence | Retains authority              | Superseded                                                               |
| -------------------------------------------- | ---------------- | ------------------------------ | ------------------------------------------------------------------------ |
| OD-24 Gate 0 final outcome                   | Yes              | Yes, for its own era's advance | No                                                                       |
| Gate 0 review/crosswalk bundles              | Yes              | No                             | Effectively, by the program era                                          |
| G1-PREP-001 / G1-EVID-001 / G1-EXIT-001 v0.2 | Yes              | Unresolved                     | Unresolved                                                               |
| Gate 1 Control Workbook v0.24.0              | Yes              | Unresolved                     | Unresolved                                                               |
| REPO-BOOT-001 "Gate A/Gate B" phases         | Yes              | Specification-only             | Not superseded, but naming collides — must be cited with its artifact id |

## Finding raised

**F-WP006-002 — Gate lineage unresolved (High).** No accepted decision maps historical Gate 0/Gate 1
to Gate A–D, and historical Gate 1 is open while the program proceeds under Gate A. Owner decision
required. Recorded in `FINDINGS_REGISTER.md` and carried as decision requirement DQ-R05-CAND.
