# WP-006 Evidence Index

Every record is executor-produced. Evidence method separation is preserved: automated results,
document review, and executor observation are never merged into a single confidence statement, and
none of them is independent validation.

| id | in-app id | evidence | method | collected | binds to | supports | does not support | state |
|---|---|---|---|---|---|---|---|---|
| EVD-WP006-01 | EV-009 | Repository provenance inspection: root commit, history depth, branch, HEAD, tree hash, working-tree cleanliness | Executor observation of version-control state | 2026-08-17 | `70c1f89` | One executable lineage; recoverable history; no legacy ancestry in the root commit | Anything about copies outside this project or unlocated repositories | confirmed |
| EVD-WP006-02 | EV-010 | Production build plus full test suite, 210 of 210 passing | Automated, executor-run | 2026-08-17 | `70c1f89` | That this commit builds and its declared suite passes | Correctness, accessibility conformance, security, fitness for use | confirmed |
| EVD-WP006-03 | EV-011 | Backend and data-surface absence check across configuration, dependencies, and source | Executor observation | 2026-08-17 | `70c1f89` | No database, migrations, authentication, storage, or live integration exists | Any future data-handling or privacy statement | confirmed |
| EVD-WP006-04 | EV-008 | Document-corpus enumeration to four levels and authority mapping | Document review | 2026-08-17 | corpus root as recorded | Which governing artifacts exist and where the planes disagree | Completeness beyond the inspected depth | partial |
| EVD-WP006-05 | — | Delta scan for secrets and personal data since the containment baseline | Automated pattern scan, executor-run | 2026-08-17 | `9854a11`…`70c1f89` | No new secret-like or personal-data-like strings in changed files | Absence of secrets outside the scanned diff, or in history before the baseline | confirmed within scope |
| EVD-WP006-06 | — | Route enumeration cross-checked against the route registry and shell tests | Executor observation plus automated test | 2026-08-17 | `70c1f89` | The addressable route set and which routes have behavioral coverage | That any route is complete, correct, or accessible | confirmed |
| EVD-WP006-07 | — | Implementation inventory by component area | Executor observation | 2026-08-17 | `70c1f89` | What exists in source and what is absent | That anything present is validated or released | confirmed |
| EVD-WP006-09 | EV-013 | Superseded binding of the current-state record and its manifests at `70c1f89` | Document review | 2026-08-17 | `70c1f89` | That those documents once declared that commit | Any statement about the present repository | stale |
| EVD-WP006-10 | EV-014 | Superseded binding at `6aa254e` with build and 210 of 210 tests | Automated, executor-run | 2026-08-19 | `6aa254e` | That the documents declared `6aa254e` and that suite passed there | Any statement about the present repository | stale |
| EVD-WP006-11 | EV-015 | Executable declared-binding check and its CI workflow | Automated, executor-run | 2026-08-19 | `9a257f7` | That the check exists, runs on push and pull request, and uses the pull-request head commit | That merge protection requires it, or that bound figures are accurate | confirmed |
| EVD-WP006-12 | EV-016 | Re-bind to `9a257f7` with production build, 217 of 217 tests, full lint, and a passing binding check | Automated, executor-run | 2026-08-19 | `9a257f7` | That the four bound documents declare `9a257f7`, the build succeeds, the suite passes, and lint reports 683 problems | Correctness, conformance, authority; and it ceases to be current on the next commit | confirmed |
| EVD-WP006-13 | EV-017 | Negative control: the binding check run against a commit no document declares | Automated, executor-run | 2026-08-19 | fabricated commit, isolated invocation | That the check exits non-zero and reports textual mismatch states rather than passing | That a real merge is blocked | confirmed |
| EVD-WP006-08 | EV-012 | Independent verification of the above | External validation | — | — | Nothing | All WP-006 evidence is self-verified | not run |

## Method separation statement

- **Automated** results establish only what the automation measured.
- **Document review** establishes what a document says, never that the statement is true.
- **Executor observation** establishes what the executor saw in the environment at a moment in time.
- **Independent validation** has not occurred for any WP-006 assertion.

No row above may be cited as certification of security, privacy, accessibility, quality, or
compliance.
