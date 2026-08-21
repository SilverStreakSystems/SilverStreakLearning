/**
 * Comparison between what the source recommended and what the evaluator
 * derived.
 *
 * The comparison is a statement about two option sets. It is NOT a judgement
 * that either side is right: the evaluator is not policy authority, and the
 * supplied recommendation is not evidence of correctness. A relation is the
 * beginning of a review, not the end of one.
 */
import { type OptionId } from "./decision-process";
import { type EvaluationResult } from "./evaluator";
import { type SourceExpression } from "./source-expression";

export const COMPARISON_RELATIONS = [
  "EXACT",
  "DERIVED-PROPER-SUBSET",
  "DERIVED-PROPER-SUPERSET",
  "PARTIAL-OVERLAP",
  "DISJOINT",
  "SOURCE-UNPARSEABLE",
  "DERIVED-ABSTAIN",
] as const;
export type ComparisonRelation = (typeof COMPARISON_RELATIONS)[number];

export interface ComparisonResult {
  relation: ComparisonRelation;
  suppliedOptionIds: OptionId[];
  derivedOptionIds: OptionId[];
  /** True when the two sides name exactly the same options. */
  identical: boolean;
  /** True when the two sides can be compared as option sets at all. */
  comparable: boolean;
  explanation: string;
}

function sameSet(a: readonly OptionId[], b: readonly OptionId[]): boolean {
  return a.length === b.length && a.every((id) => b.includes(id));
}

function subsetOf(a: readonly OptionId[], b: readonly OptionId[]): boolean {
  return a.every((id) => b.includes(id));
}

/**
 * Resolve exactly one relation.
 *
 * Precedence is fixed and documented so the result never depends on evaluation
 * order: an unreadable source is reported first, because a comparison against
 * a reading the parser does not trust would be worse than saying it cannot be
 * compared; an evaluator abstention is reported next, because an abstention is
 * not a disagreement.
 */
export function compareRecommendation(
  expression: SourceExpression,
  evaluation: EvaluationResult,
): ComparisonResult {
  const supplied = expression.primaryOptionIds;
  const derived = evaluation.optionIds;

  if (expression.parseStatus !== "parsed") {
    return {
      relation: "SOURCE-UNPARSEABLE",
      suppliedOptionIds: supplied,
      derivedOptionIds: derived,
      identical: false,
      comparable: false,
      explanation:
        expression.parseStatus === "unparseable"
          ? "The supplied recommendation names no option that can be read mechanically, so the two cannot be compared."
          : expression.parseStatus === "contradictory"
            ? "The supplied recommendation both names and rules out the same option, so it cannot be read as one committed set."
            : "The supplied recommendation expresses a choice or a sequence, which cannot be compared as a single committed set.",
    };
  }

  if (evaluation.outcome === "unresolved") {
    return {
      relation: "DERIVED-ABSTAIN",
      suppliedOptionIds: supplied,
      derivedOptionIds: derived,
      identical: false,
      comparable: false,
      explanation:
        "The evaluator abstained. Abstention is a valid result and is not a disagreement with the source.",
    };
  }

  if (sameSet(supplied, derived)) {
    return {
      relation: "EXACT",
      suppliedOptionIds: supplied,
      derivedOptionIds: derived,
      identical: true,
      comparable: true,
      explanation: "Both sides name exactly the same options.",
    };
  }

  if (subsetOf(derived, supplied)) {
    return {
      relation: "DERIVED-PROPER-SUBSET",
      suppliedOptionIds: supplied,
      derivedOptionIds: derived,
      identical: false,
      comparable: true,
      explanation: "Every derived option is in the supplied set, and the supplied set names more.",
    };
  }

  if (subsetOf(supplied, derived)) {
    return {
      relation: "DERIVED-PROPER-SUPERSET",
      suppliedOptionIds: supplied,
      derivedOptionIds: derived,
      identical: false,
      comparable: true,
      explanation: "Every supplied option is in the derived set, and the derived set names more.",
    };
  }

  const overlap = derived.filter((id) => supplied.includes(id));
  if (overlap.length > 0) {
    return {
      relation: "PARTIAL-OVERLAP",
      suppliedOptionIds: supplied,
      derivedOptionIds: derived,
      identical: false,
      comparable: true,
      explanation: `The two sides share ${overlap.join(", ")} and each names an option the other does not.`,
    };
  }

  return {
    relation: "DISJOINT",
    suppliedOptionIds: supplied,
    derivedOptionIds: derived,
    identical: false,
    comparable: true,
    explanation: "The two sides share no option at all.",
  };
}
