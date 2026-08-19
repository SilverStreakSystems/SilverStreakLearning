# WP-038 closure recommendation

**Status: EXECUTOR-COMPLETE — OWNER CLOSURE DECISION REQUIRED.**

WP-038 does not self-close. Only a recorded owner decision closes it.

## What was produced

A canonical, machine-readable regulatory baseline: 43 verified external authorities, 34 obligations,
6 source conflicts, 5 reconciled project references and 6 data-trigger classes, with 21 enforcing
test cases and generated human-readable projections.

## What the baseline establishes

- Which authorities were verified, from which locator, on which date, and at which version.
- Whether each obligation's trigger has occurred, held separately from what SSLS has and from what
  evidence exists.
- Which obligations bind SSLS directly and which reach it only through a district contract.
- Sixteen gaps, each with a required control and an owning route.

## What it does not establish

It establishes no compliance with anything. No obligation is recorded as met. Twenty-two of the
obligations carry a review requirement that no internal record can satisfy. The baseline is
executor-produced, single-source and point-in-time.

## Material findings for the owner

1. **The nearest binding obligation is not the expected one.** 201 CMR 17.00 attaches to SSLS
   directly and may trigger through operator payroll or payment data before any student data exists.
   No written information security program exists (OBL-009).
2. **Retention must shape the first schema.** Massachusetts sets sixty-year and seven-year
   destruction rules on different record types, and IDEA adds a service-end destruction duty. A
   single retention setting cannot satisfy these (OBL-004, OBL-008).
3. **The accessibility standard is unbound.** ULW-AS-001 v1.3 names no external version, so its
   coverage cannot be stated. DEC-012 is ready to decide.
4. **The customer's deadline is dated, SSLS's is not.** Districts must meet WCAG 2.1 AA by
   2027-04-26 or 2028-04-26. That deadline arrives during procurement conversations.
5. **Interoperability shape is a schema decision, not an integration decision.** OneRoster and Ed-Fi
   should constrain the first student and program models rather than be adapted to later.

## Recommendation

**PROMOTE TO OWNER CLOSURE**, with all limitations preserved: criteria 22 and 23 NOT COMPLETED,
CNF-001, CNF-005 and CNF-006 open, SRC-004 CONFLICTED, and FND-012 and FND-014 carried unchanged.

## Proposed owner decisions

- **DEC-018** — close WP-038 by owner, adopting the obligation register as the canonical regulatory
  baseline, creating no compliance claim, and authorising the next work package only.
- **DEC-012** — bind ULW-AS-001 v1.3 to WCAG 2.2 Level AA as an internal engineering target that
  creates no conformance claim. See `DEC-012-BRIEF.md`.
