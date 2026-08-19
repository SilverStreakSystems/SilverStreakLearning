# DEC-012 decision brief — accessibility conformance target

DEC-012 has been open since WP-006 and is routed no later than WP-041. WP-038 supplies the evidence
needed to close it and prepares, but does not make, the decision.

## Question

To which external accessibility standard and version does ULW-AS-001 v1.3 bind?

## Verified facts

- WCAG 2.2 is the current W3C Recommendation, dated 2023-10-05. WCAG 3.0 remains a Working Draft
  and is not a standard.
- ADA Title II, 28 CFR 35.200(b), names WCAG 2.1 Level AA and binds public entities including
  school districts. Compliance dates were extended to 2027-04-26 and 2028-04-26.
- The HHS Section 504 rule, 45 CFR 84.84, names WCAG 2.1 Level A and AA.
- Section 508 names WCAG 2.0 A and AA and applies to federal agencies, not districts.
- WCAG 2.2 Level AA is a superset of 2.1 Level AA: all prior success criteria are preserved and nine
  are added.
- The Massachusetts EOTSS enterprise policy scope and version could not be verified (CNF-005).

## Options

**Bind to WCAG 2.1 AA.** Matches exactly what regulation names for SSLS customers. Leaves a
re-test cycle if districts, state policy or a later rule move to 2.2.

**Bind to WCAG 2.2 AA.** Current Recommendation, and conformance to it necessarily satisfies the
2.1 AA criteria named in regulation. Costs nine additional success criteria of engineering effort
that no regulation currently requires.

**Bind to WCAG 2.0 AA via Section 508.** Wrong regulatory scope for district customers and a lower
bar than the rule that governs them. Not recommended by the evidence.

## Recommendation to the owner

Bind ULW-AS-001 v1.3 to **WCAG 2.2 Level AA** as the internal engineering target, and state in every
external context that the target names what SSLS builds toward, not what it has been verified to
meet. This satisfies the regulated 2.1 AA criteria without a second cycle, and it keeps the internal
standard bound to a current, citable version.

## What the decision does not do

It creates no conformance claim, no accessibility statement and no procurement representation.
Conformance requires manual and assistive-technology testing beyond automated checks, and any
external statement requires independent review first. OBL-013, OBL-014 and OBL-015 remain gaps
after this decision is made.
