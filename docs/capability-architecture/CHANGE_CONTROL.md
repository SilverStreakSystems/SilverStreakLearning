# Change Control — Capability Architecture

## How a capability record may change

1. **Edit a candidate record.** Allowed freely while authority is Research /
   Candidate. The record stays a candidate.
2. **Promote a record.** Requires a decision record that names the capability,
   states the evidence, and names the approver. Promotion changes
   `currentAuthority` and nothing else changes it.
3. **Supersede a record.** The old record stays visible with `recordState:
historical` and a supersession pointer. Records are never silently deleted.
4. **Retire a record.** Requires a decision record stating why the ability is no
   longer needed and who accepted the resulting risk.

## What may never change a record's authority

- Implementing it in code.
- Passing tests.
- Producing a deliverable.
- Visual polish, thoroughness, or confidence of wording.
- A prior AI statement.

## Version rule

v0.1 is the first governed candidate. A version increment requires a decision
record. Increments do not confer authority: v0.9 candidate material is still
candidate material.

## Review triggers

Every record declares a `reviewTrigger`. In addition, the whole architecture is
re-reviewed before any trigger gate is crossed, and whenever a normalization
finding moves to Conflicted.
