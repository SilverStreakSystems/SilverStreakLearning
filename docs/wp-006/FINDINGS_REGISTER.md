# WP-006 Findings Register

Findings raised by WP-006. Mirrored into the in-app register as FND-006 through FND-014.
Reconciled 2026-08-19 at commit `9a257f7`. Persisting issues keep their original identifiers.

| id | in-app id | title | severity | affected area | required decision | state |
|---|---|---|---|---|---|---|
| F-WP006-001 | FND-006 | Governing program register text cannot be located in either plane | Critical | Program authority | DEC-011 (DQ-R02-CAND) | open |
| F-WP006-002 | FND-007 | Gate lineage between historical and current taxonomies unresolved | High | Gate governance | DEC-013 (DQ-R05-CAND) | open |
| F-WP006-003 | FND-008 | Actual repository origin diverges from the never-executed first-commit plan | Medium | Repository provenance | DEC-010 (DQ-R01) | open |
| F-WP006-004 | FND-009 | Document-plane control map states no repository exists | High | Documentation truth | none — factual correction | open |
| F-WP006-005 | FND-010 | Effective revision of the interface acceptance standard not declared | Medium | Accessibility acceptance | DEC-012 (DQ-R04-CAND) | open |
| F-WP006-006 | not mirrored | Two parallel authority registers cover different populations without a stated relationship | Medium | Authority model | DQ-R03-CAND | open |
| F-WP006-007 | not mirrored | Repository history uses non-descriptive commit messages, weakening narrative traceability | Low | Provenance quality | none | open |
| F-WP006-008 | not mirrored | No branch protection, required checks, or secret scanning is evidenced on the repository | Medium | Containment controls | none — WP-037 scope | partially superseded by FND-012; a required check now exists in CI, its enforcement is unverified |
| F-WP006-009 | not mirrored | No off-platform mirror of the repository is evidenced; availability depends on one platform | Medium | Continuity | none | open |
| F-WP006-011 | FND-011 | Declared binding drifts from HEAD on every authoring commit | Medium | Evidence freshness | none — WP-037 scope | open |
| F-WP006-012 | FND-012 | Required-merge enforcement of the binding check is not verified | Medium | CI enforcement | none — repository settings, outside this project | not verified |
| F-WP006-013 | FND-013 | Binding identity does not establish semantic freshness | High | Evidence architecture | none — WP-037 scope | open |
| F-WP006-014 | FND-014 | Repository-wide lint does not pass (683 problems, predominantly formatting) | Low | Code quality | none | open |
| F-WP006-010 | not mirrored | No independent verification exists for any current-state assertion | High by class | Evidence quality | none — structural, phase-appropriate | accepted limitation |

Severity here is a WP-006 triage label. The in-app register uses its own three-value scale
(governance, structural, advisory); the mapping is recorded in each mirrored entry.

None of these findings is closed by WP-006. Findings are closed by owner decision or by a later work
package that produces contrary evidence.
