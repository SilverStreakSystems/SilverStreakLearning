# Independence Rules

Independence protects the people the product affects. It exists so that the
person who builds a thing is never the last person who says it is safe.

## Levels

| Level | Marker | Meaning |
| --- | --- | --- |
| Required | [IND REQ] | The builder may never be the final validator or approver. |
| Conditional | [IND COND] | Independence becomes mandatory at a named trigger. |
| Not required | [IND N/R] | No separation is required at any stage. |

Every record declares a separation-of-duties statement. Conditional records must
also name the trigger. Locked by test.

## Structural separations in v0.1

- Accessibility design (D03) is separate from accessibility validation (D07).
- Release mechanism (D04) is separate from release risk assessment and release
  authorization (D07).
- Claim drafting (D08) is separate from claim approval (D01).
- Security engineering (D04, D06) is separate from independent security
  assurance (D06).
- Efficacy design (D02) is separate from statistical review (D05).

## Coverage constraint

A capability whose independence level is Required may not be eligible for
founder-only coverage. Locked by test.

## Current honest position

At S0 the founder covers most capabilities. Where independence is Required, that
capability is therefore **not covered**, not "covered by the founder". The
registry records the absence rather than disguising it.
