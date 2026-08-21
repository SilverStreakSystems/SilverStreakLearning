# Founder review protocol — technology decision drift

Controlled prose. Written by hand, not generated. This document explains how the
owner reviews the prepared drift analysis. It records no review and no decision.

## Standing position

The comparison mechanism is a reading aid. It is not an authority. The supplied
recommendations remain the owner's words, stored verbatim, and the deterministic
evaluator remains a planning tool that recommends a minimum effective option set
for consideration. A disagreement between the two is information about the
question, not a verdict on either side.

Nothing in the generated analysis has been reviewed. Every record carries
`review_status: NOT-REVIEWED` and `owner_disposition: null`. Regeneration cannot
change that, because the generator has no code path that writes anything else.

## What must be read individually

A record is in the mandatory cohort when any of the following holds:

- the source rates the workflow high risk;
- the workflow contributes to a consequential determination about a person
  (eligibility, placement, grading, discipline, safety, employment, medical, or
  legal);
- the workflow's inputs or outputs involve students or families;
- the supplied and derived readings disagree about whether AI may take part;
- the source states AI is prohibited;
- the available evidence contradicts itself;
- the two readings share no option at all.

Mandatory records are never batched. Similarity between two records about
children is not an argument for deciding them together.

## Order of review

1. Read the negative controls first. If a record where both readings agree looks
   wrong, the mechanism is wrong and the rest of the review is premature.
2. Read the representative sample. Its purpose is to calibrate confidence in the
   mechanism before volume review, not to decide anything.
3. Read the mandatory cohort, one record at a time.
4. Read the batch-eligible proposals last, and only where the basis fingerprint
   is genuinely identical.

## Disposition vocabulary

The generated analysis uses an engineering vocabulary — `RETAIN-SUPPLIED`,
`ACCEPT-DERIVED`, `MERGE-OPTIONS`, `CORRECT-IMPLEMENTATION-DEFECT`,
`NEEDS-EVIDENCE`, `OWNER-POLICY-DECISION`, `OUT-OF-SCOPE`, `NO-PROPOSAL`. These
are proposals.

An owner disposition is a separate act, recorded as a decision in the governance
register under the governing programme, naming the workflow identifiers it
covers and the generation fingerprint of the analysis it was read against. A
disposition recorded against a stale fingerprint is void: the analysis it
described no longer exists.

## What a disposition does not do

A disposition settles what the planning record should say about a workflow. It
does not activate the workflow, authorize an implementation, adopt an option,
schedule work, or close a gate. Implementation authority is granted separately
and explicitly, and never by this review.

## Refusals recorded in this protocol

- No proposal may be generated for a record whose evidence is missing or
  contradictory. Such records are marked `NEEDS-EVIDENCE` and left open.
- No evaluator rule may be changed to reduce the number of disagreements. A rule
  changes only when a reproducible defect is demonstrated with a failing test.
- The count of disagreements is not a quality metric. A lower count is not by
  itself evidence of improvement, and this protocol does not treat it as one.
