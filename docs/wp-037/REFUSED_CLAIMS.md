# Refused Claims

Statements this pipeline will not produce, and the permitted wording in their place. Aligned with
`docs/trust/SSLS-GOV-002-claims-register-v0.1-CANDIDATE.md`, where permitted wording is exact.

| Refused statement | Why it is refused | Permitted wording |
|---|---|---|
| "The application is secure." | No scanner establishes security | "A dependency advisory scan completed and reported N advisories at this dependency set." |
| "No vulnerabilities exist." | Absence of advisories is not absence of vulnerability | "No advisories were reported by this scanner for this dependency set at this time." |
| "The build is verified." | A build result is an exit code, not a verification | "A production build executed and exited 0 at the declared input set." |
| "All tests pass, so the system works." | Coverage is not correctness | "N of N tests in the declared suite passed at the declared input set." |
| "The repository is licence-compliant." | No legal review has occurred | "Declared licence strings were inventoried; N entries require legal review." |
| "There is no PII in the repository." | Pattern matching is not proof of absence | "No personal-data patterns matched over the scanned scope. Detection is pattern-bound." |
| "No secrets are present." | Same limitation, higher stakes | "No credential patterns matched over the scanned scope; history and untracked files are out of scope." |
| "CI blocks merges on failure." | Branch protection is unverified (FND-012) | "A CI workflow exists and runs. Merge enforcement is not verified." |
| "Evidence is independently validated." | Every record is executor-produced | "Executor-produced evidence. Not independent." |
| "The system is N% ready." | Blended scores conceal which condition failed | Per-condition state, reported individually. |
| "This check closes the gate." | Only a recorded owner decision closes a gate | "This evidence is offered toward the criterion. Closure requires an owner decision." |
| "Evidence was refreshed to the current commit." | Layer A is never rebound | "The baseline was re-derived; cited evidence remains applicable via unchanged input sets." |

## Standing rule

An automated result never promotes a claim. Promotion requires a recorded owner decision that cites
the evidence, and the decision — not the check — carries the authority.
