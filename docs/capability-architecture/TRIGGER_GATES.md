# Trigger Gates

A trigger gate names a threshold that must not be crossed until the capabilities
behind it exist. Every gate below is currently **not crossed**.

| Gate | Marker | Meaning |
| --- | --- | --- |
| Before live personal data | [PII] | Must exist before any real personal information enters a system. |
| Before product-facing AI | [AI] | Must exist before any AI feature reaches a person outside SSLS. |
| Before district pilot | [PILOT] | Must exist before a district uses the product with real staff or learners. |
| Before public outcome claims | [CLAIM] | Must exist before SSLS states publicly that it improves outcomes. |
| Before enterprise scale | [SCALE] | Must exist before the enterprise operates beyond a small team. |

## Rules

- A gate is crossed only by an Approved Decision record that names the gate and
  cites the evidence for each capability behind it.
- Implementation, testing, or a convincing demo never crosses a gate.
- `crossed: false` is asserted for all five gates and locked by test.
- A capability may sit behind more than one gate.

## Where to see them

`/capabilities?view=gates` lists each gate with every capability required before
it, and states plainly that the gate is uncrossed.
