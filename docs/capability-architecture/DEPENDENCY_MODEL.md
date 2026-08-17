# Dependency Model

Source of truth: `src/fixtures/capability-architecture/dependencies.ts`.
Viewable at `/capabilities?view=dependencies`.

## Why a table, not a diagram

The dependency graph is rendered as a table. A node-and-edge picture is
unreadable with a screen reader, unreadable without color, and unusable at 200%
zoom. The table carries the same information and every relationship states its
rationale in plain language.

## Relationship kinds

- depends on
- required before
- enables
- constrained by
- validated by
- reviewed by
- supplies evidence to
- shares service with
- conflicts with

## Rules

- Every edge points at a real capability record and never at itself. Locked by
  test.
- Every edge states why it exists. Locked by test.
- `conflicts_with` is a first-class edge. Recorded conflicts are not defects to
  be hidden; they are the places where the organization must choose.

## Notable recorded conflict

CAP-D04-004 (integration engineering) conflicts with CAP-D08-006 (procurement
response), because procurement answers routinely assert integrations before
integration engineering has tested them. The conflict is recorded, not resolved.
