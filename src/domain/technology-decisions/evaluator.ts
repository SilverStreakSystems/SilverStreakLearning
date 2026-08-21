/**
 * TDP-001 evaluator — pure, deterministic, and explainable.
 *
 * Same answers in, same result out, always. The evaluator never reads a
 * supplied recommendation, never reads a maturity value, and never consults
 * anything outside its input. It recommends a MINIMUM EFFECTIVE option set for
 * planning. It authorizes nothing and decides nothing about a person.
 *
 * When an uncertain answer would change the outcome, the evaluator abstains and
 * names the questions that must be answered. Abstention is a valid result.
 */
import {
  type AiBoundaryClass,
  type ConsequenceClass,
  type DecisionAnswers,
  type OptionId,
  type QuestionId,
  isConsequential,
} from "./decision-process";

export interface EvaluationResult {
  /** `resolved` when the precedence order reached an option set; `unresolved` when it abstained. */
  outcome: "resolved" | "unresolved";
  /** The minimum effective option set. Empty when the evaluator abstains. */
  optionIds: OptionId[];
  /** The precedence step that decided the result, or null when abstaining. */
  decidedAtStep: string | null;
  /** Plain-language reasons, in the order the evaluator applied them. */
  rationale: string[];
  /** Questions whose uncertainty blocked the result. */
  unresolvedQuestions: QuestionId[];
  /** What AI may or may not do in this workflow. */
  aiBoundary: AiBoundaryClass;
  /** True when a named human must approve output before it is used. */
  requiresNamedApprover: boolean;
  /** Invariants that actually constrained this result. */
  invariantsApplied: string[];
}

function abstain(
  questions: QuestionId[],
  rationale: string[],
  aiBoundary: AiBoundaryClass,
  invariants: string[],
): EvaluationResult {
  return {
    outcome: "unresolved",
    optionIds: [],
    decidedAtStep: null,
    rationale: [
      ...rationale,
      "Abstaining: the evidence does not support a recommendation, and inventing certainty would be worse than saying so.",
    ],
    unresolvedQuestions: questions,
    aiBoundary,
    requiresNamedApprover: false,
    invariantsApplied: [...invariants, "TDP-INV-08"],
  };
}

/** Evaluate one workflow against TDP-001. Pure: no I/O, no clock, no randomness. */
export function evaluate(answers: DecisionAnswers): EvaluationResult {
  const rationale: string[] = [];
  const invariants: string[] = [];

  const consequence: ConsequenceClass | "uncertain" = answers.consequence_class;
  const consequential = consequence !== "uncertain" && isConsequential(consequence);

  // Guard, evaluated before any option is considered: a consequential
  // determination is closed to AI regardless of everything else.
  let aiBoundary: AiBoundaryClass = "unnecessary";
  if (consequential) {
    aiBoundary = "prohibited";
    invariants.push("TDP-INV-03");
    rationale.push(
      `This workflow decides something consequential about a person (${consequence}). AI must not make that determination.`,
    );
  }

  // Step 1 — is the existing human process already sufficient?
  if (answers.human_process_sufficient === "yes") {
    return {
      outcome: "resolved",
      optionIds: ["OPT-7"],
      decidedAtStep: "STEP-HUMAN",
      rationale: [
        ...rationale,
        "The existing human process is sufficient, so no technology is needed. That is a successful outcome, not a gap.",
      ],
      unresolvedQuestions: [],
      aiBoundary,
      requiresNamedApprover: false,
      invariantsApplied: invariants,
    };
  }
  if (answers.human_process_sufficient === "uncertain") {
    return abstain(["human_process_sufficient"], rationale, aiBoundary, invariants);
  }
  rationale.push("The existing human process is not sufficient on its own.");

  // Step 2 — does a tool the district already has fit as-is?
  if (answers.workspace_tool_fits === "yes") {
    return {
      outcome: "resolved",
      optionIds: ["OPT-1"],
      decidedAtStep: "STEP-WORKSPACE",
      rationale: [
        ...rationale,
        "A tool the district already licenses and administers fits this workflow as-is, so nothing new should be built.",
      ],
      unresolvedQuestions: [],
      aiBoundary,
      requiresNamedApprover: false,
      invariantsApplied: invariants,
    };
  }
  if (answers.workspace_tool_fits === "uncertain") {
    return abstain(["workspace_tool_fits"], rationale, aiBoundary, invariants);
  }
  rationale.push("No existing Workspace tool fits the workflow without building something.");

  // Structured-application need. Evaluated here because it decides whether a
  // predictable output can live in a template or genuinely needs records.
  const structuredReasons: string[] = [];
  if (answers.authoritative_record_required === "yes")
    structuredReasons.push("it must hold the authoritative record");
  if (answers.relational_data_required === "yes")
    structuredReasons.push("related records must stay connected");
  if (answers.longitudinal_data_required === "yes")
    structuredReasons.push("history over time is required");
  if (answers.cross_role_workflow === "yes")
    structuredReasons.push("the work crosses roles with handoffs");
  if (answers.audit_history_required === "yes") structuredReasons.push("an audit history is required");
  if (answers.permission_complexity === "restricted")
    structuredReasons.push("access must be restricted to named people");
  const structuredNeeded = structuredReasons.length > 0;

  const structuredUncertain: QuestionId[] = (
    [
      "authoritative_record_required",
      "relational_data_required",
      "longitudinal_data_required",
      "cross_role_workflow",
      "audit_history_required",
      "permission_complexity",
    ] as const
  ).filter((id) => answers[id] === "uncertain");

  // Step 3 / Step 4 — deterministic route, in a template or in an application.
  if (answers.output_predictable === "uncertain") {
    return abstain(["output_predictable"], rationale, aiBoundary, invariants);
  }
  if (answers.output_predictable === "yes") {
    invariants.push("TDP-INV-02");
    rationale.push(
      "The correct output can be determined in advance from the inputs, so a deterministic route is both cheaper and more defensible than a model.",
    );
    if (!structuredNeeded && structuredUncertain.length > 0) {
      return abstain(structuredUncertain, rationale, aiBoundary, invariants);
    }
    const optionIds: OptionId[] = structuredNeeded ? ["OPT-4"] : ["OPT-2"];
    if (answers.repeatable_routing === "yes") optionIds.push("OPT-3");
    if (structuredNeeded) {
      rationale.push(
        `A structured application is required because ${structuredReasons.join(", ")}. Option 4 is reached by need, not because this is an SSLS project.`,
      );
    } else {
      rationale.push(
        "Nothing here requires authoritative records, connected history, restricted access, or an audit trail, so a deterministic workbook or template is the minimum effective solution.",
      );
    }
    if (answers.repeatable_routing === "yes") {
      rationale.push(
        "The routing repeats on fixed rules, so transparent rules automation carries it without a model.",
      );
    }
    return {
      outcome: "resolved",
      optionIds,
      decidedAtStep: structuredNeeded ? "STEP-APPLICATION" : "STEP-DETERMINISTIC",
      rationale,
      unresolvedQuestions: [],
      aiBoundary,
      requiresNamedApprover: false,
      invariantsApplied: invariants,
    };
  }
  rationale.push("The correct output cannot be determined in advance from the inputs.");

  // Step 5 / Step 6 — AI, only after every deterministic route was rejected.
  if (answers.interpretation_required === "uncertain") {
    return abstain(["interpretation_required"], rationale, aiBoundary, invariants);
  }
  if (answers.interpretation_required === "yes") {
    if (answers.deterministic_core_available === "uncertain") {
      return abstain(["deterministic_core_available"], rationale, aiBoundary, invariants);
    }
    invariants.push("TDP-INV-01", "TDP-INV-05");
    const hybrid = answers.deterministic_core_available === "yes";
    const optionIds: OptionId[] = hybrid ? ["OPT-6"] : ["OPT-5"];
    if (hybrid) {
      optionIds.unshift(structuredNeeded ? "OPT-4" : "OPT-2");
      rationale.push(
        "Part of the task is predictable, so that part stays deterministic and flexible language is bounded to the part that is not.",
      );
    } else {
      rationale.push(
        "Every deterministic route was rejected on the merits, and the work genuinely requires interpretation or flexible language.",
      );
    }
    const studentFacing = answers.student_facing_output === "yes";
    const requiresNamedApprover = consequential || studentFacing;
    if (requiresNamedApprover) {
      invariants.push("TDP-INV-04");
      rationale.push(
        "Because the output is consequential or reaches a student or family, a named human must review it before it is used.",
      );
    }
    if (consequential) {
      rationale.push(
        "AI may draft language here. It may not make the determination, and its output must stay distinguishable from the authoritative record.",
      );
    }
    return {
      outcome: "resolved",
      optionIds,
      decidedAtStep: hybrid ? "STEP-HYBRID" : "STEP-AI",
      rationale,
      unresolvedQuestions: [],
      aiBoundary: consequential ? "prohibited" : "helpful",
      requiresNamedApprover,
      invariantsApplied: invariants,
    };
  }

  // Nothing fit: the output is not predictable and interpretation is not
  // required. That combination means the analysis is incomplete.
  return abstain(["output_predictable", "interpretation_required"], rationale, aiBoundary, invariants);
}
