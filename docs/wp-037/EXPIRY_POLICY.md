# Expiry Policy

Implemented in `scripts/evidence/expiry.mjs`. Every evidence class declares an invalidation
condition, a validity window, or both, each with a rationale. There is no single arbitrary
duration.

| Evidence type           | Window   | Invalidated by                            | Rationale                                                      |
| ----------------------- | -------- | ----------------------------------------- | -------------------------------------------------------------- |
| BUILD                   | none     | source, config, or lockfile change        | A build result depends on its inputs, not on elapsed time      |
| TEST                    | none     | source, tests, config, or lockfile change | Test outcomes are a function of the code and the tests         |
| TYPECHECK               | none     | source, tests, or config change           | Type checking is deterministic over its inputs                 |
| LINT                    | none     | source, tests, or config change           | Lint follows the ruleset and the files it runs against         |
| SSOT_BINDING            | none     | bound documents or guard change           | The guard compares declared strings only                       |
| SOURCE_PROVENANCE       | none     | any tracked-tree change                   | Provenance describes an exact tree                             |
| DEPENDENCY_INVENTORY    | none     | manifest or lockfile change               | Derived from manifest and lockfile only                        |
| SBOM                    | none     | manifest or lockfile change               | An inventory goes out of date when dependencies change         |
| VULNERABILITY_SCAN      | 7 days   | manifest or lockfile change               | Advisory feeds change independently of this repository         |
| LICENSE_SCAN            | 90 days  | manifest or lockfile change               | Guards against upstream relicensing within an unchanged range  |
| SECRET_SCAN             | none     | any change in scanned scope               | Answers a question about an exact tree                         |
| PII_BOUNDARY_SCAN       | none     | any change in scanned scope               | Answers a question about an exact tree                         |
| ROUTE_INVENTORY         | none     | route source change                       | Derived from the route directory                               |
| BASELINE_MANIFEST       | none     | any tracked-tree change                   | Regenerated rather than carried                                |
| CONFIGURATION           | none     | configuration or workflow change          | A statement about configuration files                          |
| ACCESSIBILITY_AUTOMATED | 180 days | tested surface change                     | Tool rulesets are revised over time                            |
| CUSTOM_VALIDATION       | 90 days  | source, tests, or config change           | Conservative default for validations without a specific policy |

## Why most types have no clock

Time does not change a deterministic function of unchanged inputs. Attaching an arbitrary window to
build or test evidence would produce routine expiry events that carry no information, and routine
uninformative alerts are how real signals get ignored.

## Why some types do

Vulnerability intelligence, licence declarations, and accessibility tooling all change outside this
repository. For those, an unchanged input set is not sufficient grounds to keep asserting the
result, so a bounded window is declared with its reason.
