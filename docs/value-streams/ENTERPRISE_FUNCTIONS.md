# Enterprise functions

Fifteen canonical functions own work in this architecture. A function is a durable
organisational responsibility, not a job title and not a headcount. In the current
founder-operator posture one person may act in several functions; the model still records the
acting capacity separately from the person, so independence gaps are visible rather than
erased.

Functions are defined in `src/domain/value-stream/functions.ts` with, for each:

- the responsibility it holds,
- the decisions it may make,
- the decisions it may **not** make,
- the objects it owns,
- the evidence it is accountable for.

## Rules

1. Every stage names exactly one owning function. Shared ownership is not ownership.
2. Every gate names a reviewing function distinct from the function that produced the work,
   or the exception is recorded.
3. A function's decision rights are enumerated positively and negatively. "Does not grant" is
   part of the record.
4. Acting capacity is declared per stage. Acting in a capacity you do not hold is a refusal
   condition, not a warning.
5. Functions do not accumulate authority by doing more work. Authority is granted, not earned
   through volume.

## Independence exceptions

Where the same function appears as builder and validator on a stream, the surface at
`/value-streams` lists it under independence exceptions with the reason it currently cannot be
separated. These exceptions are expected in a single-operator posture and must be resolved
before any pilot with real users.
