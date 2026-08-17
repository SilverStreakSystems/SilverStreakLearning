# Refusal architecture

Refusal is a designed outcome, not an error path.

## Refusal record

Every refusal records: what was refused, who refused it, in which capacity, the rule or
condition invoked, the reason in plain language, what would have to change for the answer to
differ, the notified parties, and the appeal path.

## Rules

1. **Refusal is always available.** Every stage declares at least one refusal state, and every
   gate declares at least one stop condition.
2. **A refusal is not a failure metric.** Refusals are never counted against a person or
   function, and never appear in a productivity measure.
3. **A refusal states what would change the answer.** A refusal with no path forward is a dead
   end and is treated as a finding.
4. **Refusals escalate to a named authority**, not to a queue.
5. **Refusal cannot be overridden by silence.** Only a recorded act by an authority with
   standing changes a refusal.

## Standing refusals in this architecture

- No live personal data anywhere in this system.
- No AI feature, in any surface, at any authority level, until the AI trigger gate is opened.
- No blended readiness, completion, or maturity percentage.
- No metric that measures an individual's output rate or ranks people.
- No public claim without exact wording bound to version-specific evidence.
- No authority derived from implementation status, test success, or deployment.

These are recorded in the boundaries surface as refused claims and are enforced by tests.
