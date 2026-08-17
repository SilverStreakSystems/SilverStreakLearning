# Shared object model

Every governed object in SSLS carries the same three sections.

## 1. Shared identity

Stable identifier, object type, human-readable label, creation record, and version. Identity is
never reused and never re-pointed at a different subject.

## 2. Governance metadata

Declared authority class, owning capability, data classification, retention basis, source of
truth, and the acting capacity required to change it. Authority lives here and nowhere else.
Nothing in the payload or in implementation status can raise or lower it.

## 3. Object-specific payload

Only the fields that are true for that type. Shared fields never migrate into payloads and
payload fields never become shared just because two types happen to use them.

## Lifecycle rules

- **Creation** requires an actor, an acting capacity, and a reason the object exists.
- **Change** is versioned. The prior version remains readable; the record of what changed and
  why is part of the object, not a side log.
- **Supersession** points forward to the replacing object. Superseded objects are not deleted
  and are never silently hidden.
- **Deletion** is reserved for objects created in error and is itself a recorded act.
- **Freshness** is tracked separately from correctness. An object confirmed long ago is stale,
  not wrong.

## Type discipline

Thirty-two object types are defined. A new type is justified only when it has its own
lifecycle, its own owner, and its own reason to exist. Otherwise it is a payload variant or a
relationship, and the normalization pass says which.
