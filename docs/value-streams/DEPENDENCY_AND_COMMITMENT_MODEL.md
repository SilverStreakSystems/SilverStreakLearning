# Dependency and commitment model

## Dependencies

A dependency states that one stream or stage cannot proceed without something another owns.
Each dependency records the dependent side, the providing side, the kind of dependency
(information, decision, artifact, capacity, or external party), what specifically is needed,
what happens when it is unavailable, and who is notified.

Rules:

1. A dependency names a provider. "Waiting on the business" is not a dependency.
2. Unavailability has a declared consequence: hold, reroute, reduce scope, or refuse.
3. Circular dependencies are findings, not configurations. They are surfaced in the
   normalization pass.
4. A dependency on an external party is also a risk and must appear in the stream's risks.

## Commitments

A commitment is a promise one function makes to another with a named recipient and a
consequence when it is not met. Commitments are distinct from dependencies: a dependency is a
need, a commitment is an obligation.

Each commitment records the committing function, the receiving function, the promise, the
condition under which it holds, the signal when it will not be met, and the recovery path.

Rules:

1. A commitment with no consequence is an intention. It is recorded as such and not shown as a
   commitment.
2. Failure to meet a commitment triggers a recorded signal to the recipient before the deadline
   where possible, not an explanation after it.
3. Commitments are never made on behalf of a function by another function.
