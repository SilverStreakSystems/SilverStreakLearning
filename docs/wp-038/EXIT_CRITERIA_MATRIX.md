# WP-038 exit criteria matrix

| #   | Criterion                                                    | State         | Evidence                                                                                                      |
| --- | ------------------------------------------------------------ | ------------- | ------------------------------------------------------------------------------------------------------------- |
| 1   | Entry authority verified                                     | PASS          | DEC-007, DEC-010, DEC-014, DEC-017 accepted in `src/fixtures/registers.ts`                                    |
| 2   | External authorities verified from primary sources           | PASS          | 43 records in `data/governance/external-authorities.json`, each with locator, version and verification method |
| 3   | Verification failures recorded rather than inferred          | PASS          | UNVERIFIED and CONFLICTED statuses; `CONFLICT_REGISTER.md`                                                    |
| 4   | Obligation register produced                                 | PASS          | 34 records in `data/governance/obligations.json`                                                              |
| 5   | Source statement separated from SSLS interpretation          | PASS          | Independent fields, enforced in test                                                                          |
| 6   | Applicability recorded independently of control status       | PASS          | `APPLICABILITY_MATRIX.md`                                                                                     |
| 7   | Authority type never upgraded by adoption                    | PASS          | Enforced in test: non-binding sources may not be phrased as legal requirements                                |
| 8   | Adopted-but-not-effective law not treated as effective       | PASS          | SRC-037 lifecycle ADOPTED-NOT-YET-EFFECTIVE                                                                   |
| 9   | Massachusetts direct-versus-indirect bases distinguished     | PASS          | `JURISDICTION_SCOPE.md`, CNF-003                                                                              |
| 10  | Current build data collection inspected                      | PASS          | OBL-033 current control, verified by source inspection                                                        |
| 11  | Gaps recorded without remediation                            | PASS          | 16 gaps in `GAP_REGISTER.md`                                                                                  |
| 12  | Evidence requirement recorded per obligation                 | PASS          | `EVIDENCE_REQUIREMENTS.md`                                                                                    |
| 13  | Review requirements and triggers recorded                    | PASS          | `REVIEW_TRIGGERS.md`                                                                                          |
| 14  | Stale project references reconciled                          | PASS          | `STALE_REFERENCE_REGISTER.md`; FND-016, FND-017, FND-018                                                      |
| 15  | Data trigger map produced                                    | PASS          | `DATA_TRIGGER_MAP.md`                                                                                         |
| 16  | Claims reconciled and refusals enumerated                    | PASS          | `REFUSED_CLAIMS.md`, `CLAIMS_RECONCILIATION.md`                                                               |
| 17  | DEC-012 brief prepared for the owner                         | PASS          | `DEC-012-BRIEF.md`                                                                                            |
| 18  | Registry invariants enforced in test                         | PASS          | `src/test/obligations.test.ts`, 21 cases                                                                      |
| 19  | Documentation generated from canonical data                  | PASS          | `scripts/gen-obligation-docs.ts`                                                                              |
| 20  | No compliance claim produced                                 | PASS          | Enforced in test against the prohibited-claim list                                                            |
| 21  | No feature, database, integration, AI or personal data added | PASS          | No route, schema or dependency change                                                                         |
| 22  | Independent verification of interpretations                  | NOT COMPLETED | Executor-produced only. Qualified legal, security and accessibility review remain required.                   |
| 23  | Federal regulatory currency confirmed from the live eCFR     | NOT COMPLETED | Automated access blocked; annual edition used instead. CNF-001 open.                                          |

## Unresolved limitations

- Criterion 22 cannot be satisfied inside this program. It is a structural limitation, not a defect.
- Criterion 23 is a retrieval limitation, preserved rather than worked around.
- CNF-001, CNF-005 and CNF-006 remain open. SRC-004 remains CONFLICTED and may not support a
  determination until re-verified.
