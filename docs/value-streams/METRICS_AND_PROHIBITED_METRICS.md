# Metrics and prohibited metrics

## What a metric must declare

Each metric records: the question it answers, the decision it informs, how it is computed, its
source objects, its known distortions, and what it must never be used for.

A metric that informs no decision is removed. A metric with no declared distortion has not been
thought about.

## Metric families used

- **Flow**: where work waits, and for how long.
- **Quality of evidence**: how much of what is claimed is supported at the required strength.
- **Refusal**: what is being refused and why, read as a signal about upstream conditions.
- **Burden**: whether the work adds load to the people the product serves.
- **Freshness**: how much of the record has not been confirmed recently.

## Prohibited metrics

The following are structurally refused and enforced by test:

- Individual output rate, throughput per person, or velocity per person.
- Any ranking, scoring, or leaderboard of people.
- Comparative productivity between named individuals.
- Time-on-task surveillance, activity monitoring, or keystroke or presence measures.
- Blended readiness, completion, or maturity percentages across unlike things.
- Any measure that treats refusal count as a negative performance signal.

A metric that would require surveilling a person to compute is not implemented, not modelled,
and not deferred. It is refused.
