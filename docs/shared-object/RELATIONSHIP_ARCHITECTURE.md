# Relationship architecture

Relationships are typed edges with meaning, not generic links.

Each relationship kind declares a verb, an inverse verb, permitted source and target types,
cardinality, whether it is authority-bearing, and what it does **not** mean.

Representative kinds: `decided_by`, `verified_by`, `supports_claim`, `supersedes`,
`derived_from`, `owned_by`, `depends_on`, `serves`, `escalates_to`, `produced_by`.

## Rules

1. **An edge means one thing.** `verified_by` never doubles as `reviewed_by`.
2. **Authority-bearing edges are enumerated.** Only a declared set of edges can affect standing,
   and those edges require a human act to create.
3. **Inverse verbs are declared**, so a traversal reads correctly in both directions.
4. **Cardinality is stated**, and violations are findings rather than silently accepted data.
5. **An edge with attributes that need their own lifecycle is an object.** A handoff carries
   acceptance, timing, and rejection — so a handoff is an object, not an edge.
6. **An object that is only ever a pairing with no lifecycle is an edge.** The normalization
   pass records both directions of this correction, with the judgment made and its consequence.
