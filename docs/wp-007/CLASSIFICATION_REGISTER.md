# WP-007 authority classification register

> Generated from `data/historical/historical-sources.json` by `scripts/gen-historical-source-docs.ts`. Do not edit by hand.
> No source is promoted into current authority by appearing here.


| ID | Classification | Promotion | Basis | Supporting records |
| --- | --- | --- | --- | --- |
| HS-001 | CURRENT-AUTHORITY | PROMOTED-BY-DECISION | DEC-010 adopts this repository as the go-forward software source of truth; DEC-014 closed WP-006 on that basis. | DEC-010, DEC-014, EV-013, EV-015 |
| HS-002 | HISTORICAL-EVIDENCE | NOT-PROMOTED | Executed WP-000 artifacts closed by DEC-008 with residual risk accepted by DEC-009. They record what was done, not what is now required. | DEC-008, DEC-009 |
| HS-003 | HISTORICAL-EVIDENCE | NOT-PROMOTED | Closed by DEC-014. Its SSOT record is bound to an earlier commit and is superseded as a live description by the evidence pipeline. | DEC-014, EV-013, EV-014, EV-015 |
| HS-004 | HISTORICAL-EVIDENCE | NOT-PROMOTED | Closed by DEC-017 after the bounded remediation authorized by DEC-016. | DEC-015, DEC-016, DEC-017 |
| HS-005 | REFERENCE-ONLY | NOT-PROMOTED | Closed by DEC-018 and projected from the canonical registers under data/governance/. The documents are a projection; the JSON registers are the source. | DEC-018, EV-026, EV-027 |
| HS-006 | RESEARCH-INPUT | NOT-PROMOTED | Candidate architecture produced under Build Prompt 002. No decision promotes it beyond candidate status. | EV-002 |
| HS-007 | RESEARCH-INPUT | NOT-PROMOTED | Candidate architecture produced under Build Prompt 003. | EV-002 |
| HS-008 | RESEARCH-INPUT | NOT-PROMOTED | Candidate architecture produced under Build Prompt 004. | EV-002 |
| HS-009 | RESEARCH-INPUT | NOT-PROMOTED | Candidate architecture produced under Build Prompt 005. | EV-002 |
| HS-010 | REFERENCE-ONLY | NOT-PROMOTED | Projected from the design-system registers by scripts/gen-design-system-docs.ts; it records applied tokens rather than governing requirements. | EV-002 |
| HS-011 | HISTORICAL-EVIDENCE | NOT-PROMOTED | Adopted under DEC-001 and carried forward, but FND-010 records that which revision is effective is undeclared and FND-016 records that the contract names no WCAG version in its own text. | DEC-001, DEC-012, FND-010, FND-016 |
| HS-012 | HISTORICAL-EVIDENCE | NOT-PROMOTED | Produced under Build Prompt 001 and partially superseded by later work packages; docs/CURRENT_STATE.md itself records that WP-006 replaced it as the canonical current-state record. | EV-002, DEC-014 |
| HS-013 | CURRENT-AUTHORITY | PROMOTED-BY-DECISION | DEC-018 closes WP-038 on these registers as the canonical obligation baseline, enforced by executing integrity tests. | DEC-018, EV-026, EV-027 |
| HS-014 | HISTORICAL-EVIDENCE | NOT-PROMOTED | Layer A of the WP-037 pipeline: execution records are written once and never repaired, including failed and not-completed attempts. | EV-019, EV-024, EV-025 |
| HS-015 | REFERENCE-ONLY | NOT-PROMOTED | Layer B is re-derived, not rebound; the manifest describes the current input sets and is replaced on every run. | EV-019, EV-020 |
| HS-016 | CURRENT-AUTHORITY | PROMOTED-BY-DECISION | Holds the accepted decision, finding, evidence and claim records the interface renders; owner dispositions are recorded here and nowhere else. | DEC-007, DEC-014, DEC-017, DEC-018 |
| HS-017 | HISTORICAL-EVIDENCE | NOT-PROMOTED | A candidate record bound to a past commit. The evidence pipeline replaced declared-SHA comparison as the live mechanism. | EV-013, EV-014, EV-015 |
| HS-018 | HISTORICAL-EVIDENCE | NOT-PROMOTED | DEC-010 records these as historical governance and evidence lineage that do not control current executable implementation, and requires any newly discovered prior repository to be inventoried and dispositioned before use. | DEC-010, DEC-014 |
| HS-019 | HISTORICAL-EVIDENCE | NOT-PROMOTED | Declared by the owner as part of the WP-007 source universe. No decision assigns it current authority, and its contents have not been inspected. | — |
| HS-020 | RESEARCH-INPUT | NOT-PROMOTED | They originate the work packages, but only what was recorded into the repository registers carries authority; the session text itself is an input, not a record. | DEC-007 |
| HS-021 | REFERENCE-ONLY | NOT-PROMOTED | EV-020 classifies the published surface as PUBLIC PROTOTYPE; publication is not release authority and the deployed build is a projection of the repository. | EV-020 |
| HS-022 | REFUSED | NOT-PROMOTED | The clean-slate posture carries no structures forward by default, and the WP-007 anti-targets forbid restoring legacy code. Refusal is recorded so the absence is deliberate rather than an oversight. | DEC-010 |

Classification records how much authority a source carries now. Age, volume, and effort never
upgrade it; only a recorded owner decision can.
