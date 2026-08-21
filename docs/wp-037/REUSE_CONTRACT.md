# Evidence Reuse Contract

A result may be carried forward to a later commit only when **all seven** conditions hold. Any one
failing condition ends reuse. Implemented as `evaluateReuse` in
`scripts/evidence/applicability.mjs`.

| #   | Condition                                                      | Failure meaning                                          |
| --- | -------------------------------------------------------------- | -------------------------------------------------------- |
| 1   | The declared input scope fully determines the result           | Type must be re-executed at the commit under review      |
| 2   | Every declared input hash is unchanged                         | The subject moved; the result describes a different tree |
| 3   | The recording environment covers the environment under review  | The result is INAPPLICABLE here                          |
| 4   | The declared validity window has not ended                     | The result is EXPIRED                                    |
| 5   | No later artifact supersedes it for the same scope             | The successor governs                                    |
| 6   | No open finding invalidates the result                         | The finding must be dispositioned first                  |
| 7   | The proposition cited lies within the record's `supports` list | The citation is overreach, not evidence                  |

## Required wording when reuse is exercised

A reused record is reported in exactly this form:

> `EV-<id>` — CURRENT/APPLICABLE VIA UNCHANGED INPUT SET. It was not executed at the current commit.

The second sentence is not optional. Reuse is transparent or it is drift with better manners.

## Condition 7 is the one people skip

Conditions 1 to 6 are mechanical. Condition 7 is the human one: a build record supports "a build ran
and exited 0", and nothing else. Citing it for "the application works" fails condition 7 even when
every hash matches. The `does_not_support` list on every record exists so that this failure is
visible rather than rhetorical.
