# Boundary Controls — Secrets and Personal Data

Implemented in `scripts/evidence/boundary.mjs`. These two scans support the boundaries the current
posture depends on: no exposed credentials, and zero real personal data.

## Secret exposure scan — `EV-SECRET`

Pattern scan over git-tracked, text-readable files for credential-shaped literals: cloud access key
ids, provider tokens, private key blocks, JSON Web Tokens, and high-entropy assignments to
credential-named keys.

**Matched values are never recorded.** A match writes the file, the line number, the pattern
identifier, and a truncated digest of the matched text. Writing the value into the evidence artifact
would turn the control into the exposure.

The scanner's own pattern definitions and the governance documents describing them are excluded from
the scan scope, because they self-match by construction.

## Personal-data boundary scan — `EV-PII`

Pattern scan for personal-data shapes and for field names that imply personal data: email addresses
outside reserved example domains, telephone numbers, national identifier patterns, date-of-birth
fields, and student identifier fields. Matches inside declared synthetic fixtures are counted
separately, because the fixture posture is synthetic-by-declaration and a resemblance there is
expected.

## What both scans cannot support

- Pattern matching cannot detect a credential in an unrecognised format.
- Pattern matching cannot distinguish real personal data from synthetic data that resembles it.
- Untracked files, Git history, and every external system are out of scope.
- No match means no match by these patterns. It is not proof of absence, and it is never reported
  as one.

Every match is recorded as `CANDIDATE - REQUIRES REVIEW`. The scanner does not determine whether a
match is a real exposure; a human does, and that determination is recorded separately.
