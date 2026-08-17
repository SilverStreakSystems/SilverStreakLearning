# Universal context assembly contract

Context is assembled for a purpose, by a participant, in a capacity, under policy, from named
sources, through declared projections, into a package.

`Purpose → Participant → Capacity → Policy → Source → Projection → Package`

## Every context package records

- the single purpose it was assembled for,
- the requesting actor and the acting capacity claimed,
- the relationship basis that makes the request legitimate,
- the policy basis permitting each inclusion,
- source projections, each naming the object read and the fields taken,
- **missing information** the purpose required but could not be found,
- **conflicts** between sources, stated rather than resolved,
- **uncertainty** that remains even with everything included,
- freshness check time, generation time, and expiry,
- allowed audience, reuse restrictions, and maximum data classification.

## Rules

1. **One purpose per package.** A package assembled to answer one question may not be reused to
   answer another. Reuse restrictions are explicit, not advisory.
2. **Provenance survives assembly.** Every value in a package can be traced to the object and
   version it came from.
3. **Absence is content.** A package that omits its missing-information list is invalid.
4. **Conflicts are shown, not merged.** The assembler does not choose a winner.
5. **Packages expire.** An expired package is not silently refreshed; a new one is assembled
   with a new provenance record.
6. **No package may exceed the classification its purpose permits**, and under the current
   posture no package may contain personal data at all.
