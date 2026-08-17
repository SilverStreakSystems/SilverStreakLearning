# SSLS-FND-001 — Current-State Single Source of Truth

- **Version:** v0.1
- **Authority class:** CANDIDATE
- **Record state:** current
- **Bound to commit:** `70c1f891c5d341c60132d0109979042004425a4b`
- **Produced by:** WP-006 under SSLS-BPP-001 v2.0 (ratified by DEC-007)
- **Evidence method:** executor-produced. No independent validation.

This document is the canonical record of what currently exists. It is candidate authority: it
describes reality, it does not approve, validate, release, or authorize anything. Any statement here
becomes false the moment the bound commit changes.

## 1. Program posture

| Fact | Status |
|---|---|
| Governing program | SSLS-BPP-001 v2.0, ratified by DEC-007 — register text not located (FND-006) |
| Current gate | Gate A (Workspace Proof) |
| Completed work packages | WP-000 Exposure Containment & Credential Remediation — owner-closed by DEC-008, residual risk accepted by DEC-009 |
| Current work package | WP-006 Current-State SSOT & Repository Provenance |
| Release authority | None |
| Independent validation | None, of anything |
| Data posture | Zero real PII; synthetic fixtures only |
| Deployment posture | Preview only; not published |
| AI features | None in the product |

## 2. Repository

| Field | Value |
|---|---|
| Candidate id | REPO-CAND-001 |
| Role | Only lineage containing executable SSLS code |
| Root commit | `3190f7973cc6626912c8de24731514df0608a5d9` — platform template scaffold |
| HEAD at this record | `70c1f891c5d341c60132d0109979042004425a4b` |
| Branch | single working branch |
| Commits | 283 |
| Working tree | clean at capture |
| Legacy SSLS ancestry | none detected |
| Authorized as SSOT | **Not yet.** Pending DEC-010 / DQ-R01 |

Detail: `PROVENANCE_REPORT.md`, `REPOSITORY_MANIFEST.md`.

## 3. Implementation

| Area | Status |
|---|---|
| Source files | 210 |
| Route files | 30, of which 29 addressable |
| Registered navigation paths | 19 |
| Domain modules | authority, layers, artifacts, traceability, registers, capability architecture, shared objects, value streams, workspaces, experience |
| Fixtures | 30+ files, all synthetic |
| Test suites | 8, 210 tests, all passing at HEAD |
| Build | succeeds at HEAD |
| State management | none — route-local only |
| Authentication | none |
| Persistence | none |
| Live integrations | none |
| CI pipeline | none |

Detail: `IMPLEMENTATION_INVENTORY.md`, `ROUTE_MANIFEST.md`, `BUILD_MANIFEST.md`,
`TEST_BUILD_STATUS.md`.

## 4. Data and backend

No database, no migrations, no schema, no storage buckets, no server-side authentication, no
external app-level integrations. All displayed content originates from code-resident synthetic
fixtures. Detail: `DATA_BACKEND_STATUS.md`.

## 5. Governance records

| Register | Current content |
|---|---|
| Decisions | DEC-001…DEC-009 accepted or resolved; DEC-010…DEC-013 recorded as decision-required by WP-006 |
| Findings | FND-001…FND-005 from earlier passes; FND-006…FND-010 raised by WP-006 |
| Evidence | EV-001…EV-007 from earlier passes; EV-008…EV-012 from WP-006 |
| Claims | Candidate claims register with a permitted set and an explicit prohibited set |

## 6. Known contradictions between planes

Six recorded, none silently resolved: DSC-001 through DSC-007 in `DISCREPANCY_REGISTER.md`. Six
staleness entries in `STALENESS_REGISTER.md`.

## 7. What may not be claimed

Production readiness, district readiness, security, privacy, accessibility conformance, compliance
with any framework, validation, release, availability, integration status, or any statement about
copies of this work outside this project.

## 8. Supersession

This record supersedes `docs/CURRENT_STATE.md` as the canonical current-state record. That file is
preserved and now points here. Any later commit invalidates this record until it is re-bound.
