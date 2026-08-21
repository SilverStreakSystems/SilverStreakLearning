# WP-000 — Findings Register v0.1 CANDIDATE

| finding_id  | severity | statement                                                                                                                                                                                                                                            | evidence                   | disposition                                                                       |
| ----------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- | --------------------------------------------------------------------------------- |
| WP000-F-001 | MEDIUM   | Third-party and historical copies of project material (external caches, screenshots, shared links, prior repositories, downstream forks) cannot be enumerated or verified from the executor position. Status is UNKNOWN, not clean.                  | EXP-003                    | Residual risk accepted by DEC-009 (2026-08-17); status remains UNKNOWN, not clean |
| WP000-F-002 | MEDIUM   | Scan coverage is pattern-based. gitleaks reported 236 commits scanned against 263 unique commit objects across all refs; the de-duplication explanation was not independently proven. Absence of findings is not proof of absence of sensitive data. | EV-WP000-001, EV-WP000-002 | Recorded as scan limitation; independent re-scan recommended before any pilot     |
| WP000-F-003 | LOW      | `.gitignore` carried no `.env` rule, leaving a preventable path for a future credential commit. No credential was ever committed.                                                                                                                    | EXP-002, EV-WP000-004      | Remediated preventively in this work package                                      |
| WP000-F-004 | LOW      | All verification in this work package is executor-run. No independent reviewer examined any surface (R-11).                                                                                                                                          | EV-WP000-001…005           | Owner decision required (DR-004)                                                  |
| WP000-F-005 | LOW      | Access logs for the repository host, preview host, and any third-party surface are unavailable, so unauthorized-access questions are permanently indeterminate for the pre-WP-000 period.                                                            | Disclosure assessment      | Accept as residual risk or obtain logs (DR-002)                                   |

## Severity summary

- CRITICAL: 0
- HIGH: 0
- MEDIUM: 2
- LOW: 3

No unresolved CRITICAL finding exists, so no CRITICAL blocker to WP-000 exit is recorded.
