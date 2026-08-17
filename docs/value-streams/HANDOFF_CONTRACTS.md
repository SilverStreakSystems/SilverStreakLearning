# Handoff contracts

Work loses meaning at boundaries. A handoff contract makes the boundary explicit.

Each handoff between consecutive stages records:

- source stage and receiving stage,
- sending owner and receiving owner (by function),
- objects transferred,
- the required state of those objects on send,
- required deliverables and required evidence,
- the purpose of the context package the receiver needs,
- acceptance criteria, expressed as the receiver's entry criteria,
- expected timing,
- whether the receiver has accepted, and by whom.

## Rules

1. **Acceptance is an explicit act by the receiver.** Elapsed time never accepts a handoff.
2. **An unaccepted handoff is not complete**, regardless of how the sending stage records
   itself. Sending is not receiving.
3. **The receiver may reject**, naming what is missing. Rejection returns the work with a
   reason, not a score.
4. **Context travels with the work.** A handoff without the receiver's required context is
   incomplete even if every deliverable is present.
5. **Overdue handoffs escalate** to the stream's stop authority rather than expiring silently.
