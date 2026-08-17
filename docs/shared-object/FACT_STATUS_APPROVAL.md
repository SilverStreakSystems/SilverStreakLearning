# Raw fact, derived status, human approval

Three categories, kept formally separate.

## Raw fact

Something recorded because it happened: an evidence record was collected, a test ran, a message
was sent, a document version exists. Raw facts are immutable once recorded. Correcting one
creates a new record referencing the error.

## Derived status

A computation over raw facts, defined by a stated rule. Derived status may recompute at any
time and may move backwards. Every derived status displays the rule that produced it and the
facts it read. A derived status is never stored as though a human asserted it.

## Human approval

An act by a person with declared standing, in a declared acting capacity, with a rationale and a
timestamp. Approvals do not recompute. They are withdrawn only by another human act, recorded
the same way.

## The rule that matters

**A derived status must never be presented as an approval, and no accumulation of raw facts
ever produces one.** "All tests pass" is a derived status. "This is approved for release" is a
human act. The system will not convert the first into the second under any conditions.
