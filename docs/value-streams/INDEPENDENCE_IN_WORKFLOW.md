# Independence in workflow

Independence is a property of the workflow, not a promise about intent.

## Required separations

| Separation | Rule |
| --- | --- |
| Builder / validator | The function that produced work does not validate it. |
| Decider / evidence producer | The function that supplies evidence does not decide on it. |
| Claimant / claim verifier | The function that wants a claim does not verify its support. |
| Operator / auditor | The function that runs a process does not audit the record of it. |
| Vendor sponsor / vendor reviewer | The function that wants a vendor does not clear the vendor. |

## Exceptions

In a single-operator posture, most of these separations cannot be honoured. The architecture
does not pretend otherwise. Where a stream names the same function as builder and validator,
the surface lists it as an **independence exception** with:

- the separation that is unmet,
- the reason it is currently unmet,
- the compensating control in place (recorded rationale, delayed self-review, external check),
- the condition under which it must be resolved.

## Resolution triggers

Every independence exception must be resolved before:

- the first pilot with a real district,
- any handling of live personal data,
- any public claim about a governed outcome,
- any AI capability leaving the gated-future state.

An unresolved exception at any of these triggers is a refusal condition, not a risk to accept.
