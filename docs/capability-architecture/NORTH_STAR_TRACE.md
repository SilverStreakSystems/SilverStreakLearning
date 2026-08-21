# North Star Trace

North Star: **Make Learning Visible.**

For this build, the North Star is interpreted as making truth, authority,
evidence, and uncertainty understandable to the person accountable for them.

## The question every record must answer

Each capability record answers: _if this ability is absent, whose understanding
of learning becomes less accurate, and who is harmed by that?_

The detail page at `/capabilities/{id}` renders this first, before ownership,
before maturity, before anything operational.

## Chain from ability to human

```text
capability
  -> deliverable type it must produce
    -> evidence it must generate
      -> claim the evidence would support
        -> decision a human makes with that claim
          -> learner, family, or educator affected by that decision
```

Every link is required. A capability that cannot name the human at the end of
the chain is either mis-specified or is not a capability.

## Refusals

- No capability record claims an outcome for a learner. Outcome claims require
  the public-outcome-claims gate, which is not crossed.
- No capability record asserts that visibility has been achieved. The registry
  describes abilities the organization would need, not results it has produced.
