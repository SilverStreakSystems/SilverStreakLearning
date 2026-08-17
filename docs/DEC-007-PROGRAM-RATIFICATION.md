# DEC-007 — Ratification of SSLS-BPP-001 v2.0

- **Record ID:** DEC-007
- **Authority class:** accepted-decision
- **Decision state:** accepted
- **Record state:** current
- **Decided on:** 2026-08-17
- **Decided by:** Founder / Operator
- **Related artifacts:** SSLS-BPP-001 (SSLS Build Program Register v2.0), FND-OPMODEL-001
- **Supersedes:** DEC-006

## Context

Work packages were being issued against a build program that carried no ratification
record in the authority chain, so nothing authorized their execution. WP-000 was
correctly blocked on that basis. DEC-006 had declined target-state build outright,
which is no longer the governing posture.

## Decision

SSLS-BPP-001 v2.0 (SSLS Build Program Register) is ratified as the governing build
program for this project. Work packages issued under it, beginning with WP-000
(Exposure Containment and Credential Remediation), are authorized work.

Ratification authorizes execution only. It grants no conformance, no validation, and
no public claim.

DEC-006 is superseded. Target-state work is permitted only through an authorized work
package under this register, never by inference from a prompt.

## Consequences

- WP-000 may be executed and its findings recorded against this authority chain.
- Every subsequent work package must name SSLS-BPP-001 v2.0 as its authorizing register.
- The founder/developer operator boundary holds: no live PII, no production data, no AI features.
- No readiness, conformance, or completion claim follows from ratification.

## Superseded record

DEC-006 ("Build the target-state enterprise model in this pass") is moved to
`state: superseded`, `recordState: historical`, `supersededBy: DEC-007`. Its original
context and outcome are preserved verbatim; only its governing status changed.
