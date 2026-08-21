# Foundation and Authority Map

## Layers

| Layer | Name                          | Holds                                                |
| ----- | ----------------------------- | ---------------------------------------------------- |
| L0    | Core Beliefs                  | Non-negotiable commitments.                          |
| L1    | Mission and North Star        | Direction and the outcome being pursued.             |
| L2    | Operating Principles          | How decisions are made and constrained.              |
| L3    | Governance and Authority      | Lifecycle, authority classes, refusal rules.         |
| L4    | Standards                     | Accessibility, language, evidence, naming standards. |
| L5    | Architecture and Models       | Domain models, data shape, system structure.         |
| L6    | Capabilities and Requirements | Candidate capabilities and requirements.             |
| L7    | Implementation and Operations | Built software and operating practice.               |

Layers are a stack of dependency, not a ranking of importance. A lower layer
constrains the layers above it. Nothing in L7 can grant authority to anything.

## Authority classes

Authority is a declared property of an artifact. It is recorded on the artifact
record and rendered directly in the Authority Ledger.

| Class                        | Grants implementation authority |
| ---------------------------- | ------------------------------- |
| Approved Authority           | Yes                             |
| Accepted Decision            | Yes                             |
| Adopted Standard (external)  | No, constrains only             |
| Provisional Working Artifact | No                              |
| Candidate Proposal           | No                              |
| Research Input               | No                              |
| Historical Record            | No                              |
| Gated Future Concept         | No                              |

## The rule

Authority is never derived from:

- folder location or file path,
- whether something is implemented,
- whether tests pass,
- how recently it was written,
- how confident the wording is.

Only two classes carry implementation authority: Approved Authority and Accepted
Decision. This is asserted in code (`carriesImplementationAuthority`) and locked
by test.

## Lifecycle

Vision → Research → Candidate → Requirement → Approved Decision → Planned
Capability → Implemented Capability → Tested Capability → Validated Capability →
Released Capability → Public Claim.

Movement along the lifecycle is a recorded event, not an inference. An artifact
may sit at "Implemented Capability" while holding no authority at all — the shell
itself is exactly that case.
