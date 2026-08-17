# Normalization Pass

Source of truth: `src/fixtures/capability-architecture/normalization.ts`, shown
in the shell under `/capabilities?view=normalization`.

The pass converted a long list of candidate terms into capability records. Each
finding records a judgment and the boundary of that judgment. Each is a
candidate resolution; a decision record may overturn any of them.

## Finding kinds

- **Duplicate** — two terms named the same ability; merged.
- **Synonym** — different vocabulary, same ability.
- **Actually a role** — a title that may hold a capability, not a capability.
- **Actually a process** — a recurring activity implementing a capability.
- **Actually a deliverable** — an artifact a capability produces.
- **Actually a module** — a product surface, not an organizational ability.
- **Missing capability** — no term covered a real ability, so one was added.
- **Over-specialized** — a technique folded into a broader capability.
- **Cross-cutting** — owned once, constrains many.
- **Independence sensitive** — deliberately kept split so the builder cannot be
  the validator.

## Notable resolutions

- Accessibility design (CAP-D03-005) and accessibility validation (CAP-D07-004)
  are kept apart on purpose.
- Change, release, and deployment were split into mechanism, risk assessment,
  and authorization, because one person must not hold all three.
- "Founder" was recorded as a coverage mode, not a capability. NORM-014 records
  the resulting single point of failure as conflicted and unresolved.

## What this pass does not assert

It does not assert the resulting structure is correct, complete, or approved.
Several findings are recorded as Partial precisely because the author is not an
independent reviewer.
