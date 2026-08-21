# WP-000 — Decision Requirements v0.1 CANDIDATE

Only a recorded human owner decision closes a gate or accepts residual risk (R-10). The
executor does not close WP-000 (R-17, §19).

| decision_id | Decision required                                                                                              | Why it cannot be made by the executor                                                | Linked record                                                            |
| ----------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| DR-001      | Close WP-000 or hold it open                                                                                   | Gate closure is an owner act                                                         | DEC-008 (state: required)                                                |
| DR-002      | Accept or reject the residual UNKNOWN on third-party and historical copies (EXP-003, WP000-F-001, WP000-F-005) | Residual-risk acceptance is an owner act                                             | DEC-009 (state: required)                                                |
| DR-003      | Decide whether platform key CRED-001 should be rotated as a precaution despite no identified exposure path     | Rotation without a finding is a risk-posture judgment, not a remediation requirement | Fold into DEC-008                                                        |
| DR-004      | Decide whether independent (non-executor) verification is required before Gate A work begins                   | Independence cannot be self-declared (R-11)                                          | Fold into DEC-008                                                        |
| DR-005      | Legal / privacy notification determination                                                                     | Reserved to the owner or qualified review; the executor makes no determination       | Record separately if any external fact changes the disclosure assessment |

## Recorded in the authority chain

- **DEC-008** — "Disposition of WP-000 exposure containment and credential remediation" — state `required`.
- **DEC-009** — "Accept or reject residual unknown on third-party and historical copies" — state `required`.

Both are open records. Neither grants any claim, closure, or credit while open.

## Disposition (recorded 2026-08-17)

The table above is preserved as issued. Current record states:

- **DEC-008** — now `accepted`, decided 2026-08-17 by Founder / Operator. Closes WP-000 on
  the current evidence package and resolves DR-001, DR-003 (no precautionary rotation
  required on current evidence), and DR-004 (independent verification not required before
  Gate A, with the executor/self-verified limitation left explicitly on the record).
- **DEC-009** — now `accepted`, decided 2026-08-17 by Founder / Operator. Resolves DR-002 by
  accepting the bounded residual UNKNOWN for the current private, founder-only,
  zero-real-PII phase.
- **DR-005** remains unresolved by design. No legal or privacy notification determination has
  been made, and none may be inferred from closure.
