# State axes

Eight axes are tracked independently. Collapsing them into one status field is the single most
common way a governance system starts lying.

| Axis | Question | Never implies |
| --- | --- | --- |
| Workflow | Where is this in its stream? | Approval or correctness. |
| Authority | What standing does this hold? | That it exists in code. |
| Implementation | Has it been built? | That it works, or that it is permitted. |
| Validation | Has someone independent checked it? | That it is released. |
| Evidence | What supports this statement, and how strongly? | That the statement is approved. |
| Approval | Has a human with standing accepted it? | That it is published. |
| Publication | Is it stated externally? | That it is still true. |
| Freshness | When was this last confirmed? | That it is correct. |

## Rules

1. Each axis has its own value set and its own transition record.
2. No axis may be computed from another. A test result never moves the authority axis; a
   deployment never moves the validation axis.
3. Every surface that displays state displays the axis it belongs to, with a text marker so the
   reading never depends on colour.
4. Where a surface must summarise, it shows counts by declared state. It never produces a
   blended score.
