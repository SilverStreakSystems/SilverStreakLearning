# Authorization model

Access is not a role check. Eight elements must all hold.

| Element | Question |
| --- | --- |
| Identity | Who is this, verifiably? |
| Capacity | In which declared capacity are they acting right now? |
| Relationship | What connects them to this object? |
| Purpose | Why do they need it, stated before access? |
| Policy | Which rule permits this, for this purpose? |
| Capability | Is the requested operation one this capacity may perform? |
| Scope | Which subset of objects, not "all of type X"? |
| Time | For how long, and has that window closed? |

## Rules

1. **Any element failing denies access.** There is no cumulative score.
2. **Purpose is declared before access, not inferred after.** Access granted for one purpose
   does not extend to another.
3. **Capacity is per-act.** Holding a capacity historically does not authorise an act today.
4. **Scope defaults to nothing.** Broad access is granted explicitly, with an expiry.
5. **Denials are recorded** with the element that failed, so access problems are diagnosable
   without weakening the rule.
6. **Nothing here authorises access to personal data**, because none exists in this system.
   When it does, this model is the gate, not an addition to it.
