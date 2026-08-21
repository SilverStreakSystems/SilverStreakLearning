# Content states and status language

Authority: Working direction. Generated from fixtures.

Every state says what happened, why, and what to do next. Refusal is presented
as successful governance where that is the truth.

| State                              | Required content                                         | Visual rule                                                        | Status language      |
| ---------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------ | -------------------- |
| ST-LOADING Loading                 | What is loading; Non-blocking skeleton where appropriate | No rapid pulse. Respects reduced motion.                           | Loading              |
| ST-EMPTY Empty                     | What belongs here; Why it is empty; One next action      | Restrained star or trajectory motif only when it adds orientation. | Unknown              |
| ST-NO-RESULTS No results           | Search or filter explanation; Reset option               | Do not imply system failure.                                       | Unknown              |
| ST-DENIED Permission denied        | What is unavailable; Why; A safe next step               | No withheld data may be present in the DOM or client state.        | Not authorized       |
| ST-VALIDATION Validation error     | The field and the problem; Correction guidance           | Associated programmatically with the control.                      | Failed               |
| ST-NETWORK Network or server error | What happened; Retry or safe next step                   | Preserve entered data where practical.                             | Failed               |
| ST-STALE Stale or partial data     | Freshness timestamp; Missing source or conflict          | Never present partial data as complete.                            | Passed with findings |
| ST-BLOCKED Blocked dependency      | Blocking object or rule; Owner; Next action              | Refusal is treated as successful governance where appropriate.     | Blocked              |

## Permitted status language

- Approved
- In review
- Blocked
- Unknown
- Superseded
- Not run
- Failed
- Passed with findings
- Not authorized

## Refused status language

- Good
- Healthy
- On track
- All clear
- Green

"Good" usually means "we currently lack evidence of a problem", which is a
different statement and must be written as one.
