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
| EVD-WP006-08 | EV-012 | Independent verification of the above | External validation | — | — | Nothing | All WP-006 evidence is self-verified | not run |

## Method separation statement

- **Automated** results establish only what the automation measured.
- **Document review** establishes what a document says, never that the statement is true.
- **Executor observation** establishes what the executor saw in the environment at a moment in time.
- **Independent validation** has not occurred for any WP-006 assertion.

No row above may be cited as certification of security, privacy, accessibility, quality, or
compliance.
