# Work, deliverable, evidence and claim contracts

## Work item

Every work item names the **purpose** it serves and the **served object** it acts on. Work that
serves nothing is not tracked into existence; it is questioned. Work items also record type,
owner, acting capacity, required inputs, definition of done, and the refusal path.

## Event

An event records that something happened: actor, capacity, object, action, timestamp, and the
rule in force. Events are immutable and are never edited to reflect a later understanding.

## Deliverable type vs deliverable instance

A **deliverable type** is a definition: what this kind of thing must contain, who reviews it,
and what makes it acceptable. A **deliverable instance** is a produced artifact conforming to a
type, with its own version and its own review record. The two are never merged: counting types
tells you what the enterprise can produce, counting instances tells you what it has produced.

## Evidence

Evidence supports exactly one proposition. Each record names the proposition, the evidence type,
the source, the subject version, environment, scenario, method, expected and actual result, who
executed it, who reviewed it, a locator for raw output, confidence, and — required — its
**limitations**: what this evidence cannot show.

Version-bound evidence types must carry a subject version. Evidence about version 3 says nothing
about version 4.

## Claim

A claim records its **exact public wording**, the audience, the supporting evidence identifiers,
the approving human, and the conditions under which the claim would cease to be true. A claim
whose wording changes is a new claim requiring new approval. No claim exists without supporting
evidence, and no public claim is permitted while the supporting evidence is synthetic.
