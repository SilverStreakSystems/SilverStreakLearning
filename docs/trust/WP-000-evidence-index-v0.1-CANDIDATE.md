# WP-000 — Evidence Index v0.1 CANDIDATE

Standing evidence schema. Environment for all entries: sandbox development environment,
commit `9854a119bbcaffc0469118bc04a9013fbb966f6f`. Producer for all entries: WP-000
executor (Lovable agent) acting for Founder / Operator. No entry contains secret values or
personal data.

| evidence_id | type | method | commit SHA | timestamp (UTC) | expiry | artifact hash (sha256) | scope | expected | actual | limitations | related |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EV-WP000-001 | Secret scan report | automated | 9854a11 | 2026-08-17 04:41 | 2026-09-17 (or next commit to any ref) | 37517e5f…5570 | gitleaks 8.28.0 over current-branch history (236 commits), all refs, and working tree | 0 findings or enumerated findings | 0 findings in all three passes | Rule-based; novel credential formats may evade | EXP-001, CRED-001 |
| EV-WP000-002 | Pattern sweep log | automated | 9854a11 | 2026-08-17 04:42 | 2026-09-17 | n/a (transcript recorded in scan evidence doc) | ripgrep rule set over working tree and `git log --all -p` | 0 real identifiers | 2 platform `noreply` aliases only | Pattern-based; misses unstructured narrative PII | EXP-001 |
| EV-WP000-003 | Structural inspection record | manual | 9854a11 | 2026-08-17 04:42 | 2026-09-17 | n/a | Branches, tags, deleted-file history, tracked binaries, `public/`, project metadata, secret inventory | No data files, no exports, no env files | Confirmed as expected | Self-review; not independent | SSLS-TRUST-001 §2 |
| EV-WP000-004 | Configuration change record | manual | post-`9854a11` | 2026-08-17 04:44 | on next `.gitignore` change | n/a | `.env` / `.env.*` ignore rule added | Rule present | Rule present | Preventive only | EXP-002 |
| EV-WP000-005 | Test suite run | automated | 9854a11 | 2026-08-17 04:39 | on next source change | n/a | 210 Vitest cases | All pass | 210 passed | Not independent validation (R-11); not security evidence | DEC-007 |

## Reuse eligibility

EV-WP000-001 through EV-WP000-003 are bound to commit `9854a11`. They may not be reused as
evidence for any later commit; a new scan is required after any change to any ref.
