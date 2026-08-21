# Claims Register reconciliation

WP-038 adds no permitted claim. It narrows what may be said and names three findings.

## Permitted statements confirmed by this baseline

- The current surface collects no personal information. It has no authentication, no submitting
  forms, no analytics and no third-party data calls. The interface sets one first-party sidebar
  preference cookie.
- SSLS maintains an obligation register bound to verified primary sources, dated 2026-08-19.
- SSLS generates a CycloneDX software bill of materials and a dependency advisory scan per pipeline
  run.
- SSLS applies an internal accessibility standard, ULW-AS-001 v1.3, and runs automated checks.

## Wording newly refused

- Any "compliant", "certified", "approved", "aligned" or "ready" formulation against any authority
  named in the register. Enumerated in `REFUSED_CLAIMS.md` and enforced in `src/test/obligations.test.ts`.
- "No cookies" or "no tracking of any kind" — inaccurate because of the sidebar preference cookie.
- "WCAG conformant" in any version — automated coverage is partial and no independent audit exists.
- "Ed-Fi conformant", "OneRoster conformant" or any interoperability conformance wording — informal
  implementation is not certified conformance, and no implementation exists.

## Findings raised

| Finding | Statement                                                                                                                                                                         | State |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| FND-016 | ULW-AS-001 v1.3 is not bound to a named WCAG version and level, so its coverage cannot be stated.                                                                                 | OPEN  |
| FND-017 | The BEFORE LIVE PII trigger gate implies student data is the first binding trigger. Massachusetts narrow personal information, including operator payroll data, may attach first. | OPEN  |
| FND-018 | Supply-chain documentation names CycloneDX without a specification version, while the ratified standard and the latest specification differ.                                      | OPEN  |

## Findings carried, not restated

FND-012 (branch protection unverified) is recorded as OBL-034 rather than raised again.
FND-014 (repository-wide lint debt) is unchanged and unrelated to this package.
