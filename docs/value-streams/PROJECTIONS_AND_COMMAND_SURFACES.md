# Projections and command surfaces

A projection is a read-only view assembled for one operator question. It is not a dashboard and
it does not hold truth.

## Contract

Each projection declares: the question it answers, the audience, the source objects it reads,
the refresh basis, the freshness statement it must show, what it deliberately excludes, and the
actions it does **not** grant.

## Rules

1. **Projections never write.** A projection cannot change state, approve anything, or record a
   disposition.
2. **A projection shows its freshness.** A view that cannot say when it was last confirmed is
   not shown.
3. **A projection shows what is missing.** Absence is displayed as absence, never as zero or as
   an empty success state.
4. **No projection blends unlike things into a single score.** Counts by declared state are
   permitted; a composite health number is not.
5. **A projection names its exclusions**, so the operator knows what they are not looking at.

## Modelled projections

Five read-only command surfaces are modelled: enterprise command centre, authority standing,
work in motion, evidence and claim standing, and refusal and stop record. All are declared
inactive: they are contracts describing what such a surface would be permitted to do, not
running views over real work.
