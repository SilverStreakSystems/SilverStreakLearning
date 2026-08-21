# Object families

Seven families group the thirty-two shared object types. Families are for comprehension and
ownership, not for access control; access is decided by the authorization model.

| Family | Holds | Boundary note |
| --- | --- | --- |
| A. Actors and organisations | People-shaped and organisation-shaped records, roles, acting capacities, relationships to organisations | Under the current posture these are synthetic only. No live personal data exists. |
| B. Governance | Decisions, requirements, policies, authority grants, findings, refusals | Authority is declared here and read everywhere else. |
| C. Work and delivery | Work items, commitments, handoffs, deliverable types and deliverable instances | A deliverable type is a definition; a deliverable instance is a produced thing. Never conflated. |
| D. Evidence and knowledge | Evidence records, sources, research artifacts, claims | Evidence is bound to a version and a proposition. |
| E. Product and reference | Capabilities, taxonomies, reference data | Reference data changes slowly and is versioned when it changes. |
| F. Communication | Messages, notices, escalations, published statements | A published statement is a claim and inherits claim rules. |
| G. Context | Context packages and their source projections | A context package belongs to exactly one purpose. |

## Rules

1. An object belongs to exactly one family.
2. Family membership never grants access.
3. A type that appears to fit two families is usually two types, and the normalization pass
   records which one was split.
