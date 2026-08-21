# WP-038 handoff

WP-038 is CLOSED BY OWNER under DEC-018 (accepted 2026-08-19). The next eligible work package is
**WP-007 — Historical Requirement Conformance Recovery**, subject to verification that no later
accepted decision supersedes the current Build Program sequence. Eligibility follows the accepted
program sequence, not numerical order: WP-039 is not authorized because its number follows WP-038.

## Carried forward

| Item                          | State                                                                |
| ----------------------------- | -------------------------------------------------------------------- |
| Canonical obligation baseline | `data/governance/` — schema, 43 authorities, 34 obligations, context |
| Register invariants           | `src/test/obligations.test.ts`, 21 cases                             |
| Documentation projection      | `scripts/gen-obligation-docs.ts`                                     |
| Gap register                  | 16 gaps with owning routes                                           |
| Verification date             | 2026-08-19 — the whole baseline ages from this date                  |

## Open items inherited

- **DEC-011** — open; routed to WP-008.
- **DEC-012** — ACCEPTED 2026-08-19; WCAG 2.2 Level AA internal target, no conformance claim.
- **DEC-013** — open; routed to WP-008.
- **DEC-018** — ACCEPTED 2026-08-19; WP-038 CLOSED BY OWNER.
- **FND-010** — open / conflicted; DEC-012 does not declare the effective ULW-AS-001 revision.
- **FND-012** — open; recorded as OBL-034.
- **FND-014** — open / advisory; unchanged.
- **FND-016** — open, partially resolved by DEC-012 (named target only).
- **FND-017, FND-018** — open.
- **CNF-001, CNF-005, CNF-006** — open source conflicts.

## Constraints that travel with the handoff

1. No obligation in the register may be recorded as met, satisfied or complied with on the basis of
   this baseline. It records requirement, applicability, control state and evidence gap only.
2. Any source recorded UNVERIFIED or CONFLICTED may not support a determination.
3. Obligations carrying a review requirement need qualified external review, not an internal record.
4. The baseline is dated. Re-verification is required before it is relied on in any procurement or
   legal context.
5. The zero-personal-data boundary is now a governed control (OBL-033), not an incidental property.
   Adding a form, account, analytics or third-party script changes the obligation posture
   immediately and requires review first.
