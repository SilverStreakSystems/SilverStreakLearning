# Method and limits

## What was done

Five parallel primary-source verification passes were run on 2026-08-19 covering federal education
privacy, Massachusetts obligations, accessibility authority, security and AI frameworks, and
education interoperability standards. Each pass was instructed to retrieve the issuing body's own
text, record version and date, and to state explicitly where retrieval failed rather than infer.

Each verified source became a record in `data/governance/external-authorities.json` carrying its
citation, official locator, version, effective date, verification date, verification method,
lifecycle and status. Each interpreted requirement became a record in
`data/governance/obligations.json` carrying, as separate fields, what the source states, how SSLS
reads it, whether the trigger has occurred, what control would be required, what SSLS actually has,
what evidence would be needed, and what claim is refused.

The current build was inspected directly for data collection paths: authentication, submitting
forms, analytics, third-party scripts and outbound data calls.

## What this method supports

- That the recorded citations, versions and dates were retrieved from the stated locators on the
  stated date.
- That each obligation record is bound to a registered source.
- That the applicability, control and evidence dimensions are recorded independently.

## What this method does not support

- **It is not legal advice and not a legal determination.** Every applicability judgement is an
  SSLS interpretation. Obligations carrying a review requirement may not be determined without
  qualified review.
- **It is point-in-time.** Sources change. Verification dated 2026-08-19 says nothing about
  2026-09-19.
- **It is single-source and executor-produced.** No independent party reviewed either the retrieval
  or the interpretation.
- **Retrieval failures are recorded, not resolved.** Live eCFR pages blocked automated access, so
  federal regulatory currency rests on the govinfo annual edition and the Cornell mirror. Several
  sources could not be dated at all and are recorded UNVERIFIED.
- **Absence of a found amendment is not proof of none.**

## Recording rules applied

1. A source that could not be versioned or dated is UNVERIFIED and may not support a determination.
2. A source whose own currency metadata was inconsistent is CONFLICTED.
3. Adopted-but-not-yet-effective law is never recorded as effective.
4. A voluntary framework, attestation standard or procurement expectation is never phrased as a
   legal requirement, and the register enforces this in test.
5. Applicability, control status and evidence status are never collapsed into one value.
6. NOT-APPLICABLE records the absence of a trigger. It never records satisfaction.
