/**
 * Mechanical classification of a supplied workflow row into TDP-001 answers.
 *
 * Every derived answer names the source field it came from, so a reader can
 * always check the derivation against the verbatim text beside it. The
 * classifier deliberately does NOT read `recommended_solution`: the supplied
 * recommendation is the thing the derived result is later compared against, so
 * using it as an input would make the comparison meaningless.
 *
 * These are mechanical text rules over owner-supplied analysis. They are not
 * judgements about any real person, and they authorize nothing.
 */
import {
  type ConsequenceClass,
  type DataSensitivityClass,
  type DecisionAnswers,
  type OptionId,
  type PermissionComplexity,
  type Ternary,
} from "./decision-process";
import { type DerivedAnswer, type DerivedAnswers, type SourceField, type WorkflowSource } from "./workflow";

const EMPTY = /^(|—|-|n\/a|na|none|not applicable)$/i;

function present(value: string): boolean {
  return !EMPTY.test(value.trim());
}

function has(value: string, terms: readonly string[]): boolean {
  const text = value.toLowerCase();
  return terms.some((term) => text.includes(term));
}

function answer<T extends string>(
  value: T,
  basis: string,
  basisFields: SourceField[],
): DerivedAnswer<T> {
  return { value, basis, basisFields };
}

/** `Yes`, `No`, or `Partial` prefix of the SSLS Application Need field. */
export function readApplicationNeed(value: string): "yes" | "no" | "partial" | "unclear" {
  const text = value.trim().toLowerCase();
  if (text.startsWith("yes")) return "yes";
  if (text.startsWith("no")) return "no";
  if (text.startsWith("partial") || text.startsWith("maybe")) return "partial";
  return "unclear";
}

const CONSEQUENCE_TERMS: ReadonlyArray<[ConsequenceClass, readonly string[]]> = [
  ["eligibility", ["eligibility", "eligible", "qualif", "entitle"]],
  ["placement", ["placement", "assign to program", "program assignment", "least restrictive"]],
  ["discipline", ["discipline", "suspension", "expulsion", "behavior referral", "manifestation"]],
  ["safety", ["safety", "threat assessment", "crisis", "abuse", "mandated report", "emergency"]],
  ["medical", ["medical", "medication", "health record", "nurse", "immuniz", "clinical"]],
  ["employment", ["hiring", "employment", "personnel action", "staff evaluation", "termination", "contract renewal"]],
  ["legal", ["due process", "legal", "complaint investigation", "hearing", "litigation", "grievance"]],
  ["grading", ["grade", "grading", "transcript", "credit", "promotion", "retention decision"]],
];

const HIGH_SENSITIVITY_TERMS = [
  "iep",
  "504",
  "disability",
  "special education",
  "medical",
  "health",
  "discipline",
  "counsel",
  "mental health",
  "personnel",
  "employment",
  "legal",
  "confidential",
  "protected",
];

const PERSONAL_TERMS = ["student", "family", "parent", "guardian", "staff", "teacher", "roster", "caseload"];

const STUDENT_FACING_TERMS = ["student", "family", "parent", "guardian", "caregiver", "home"];

const RESTRICTED_TERMS = ["confidential", "restricted", "only ", "limited to", "named", "legal", "medical", "private"];

const LONGITUDINAL_TERMS = ["longitudinal", "over time", "history", "historical", "trend", "year over year", "progress monitoring", "multi-year"];

const RELATIONAL_TERMS = ["across", "link", "linked", "relational", "per-student", "per student", "multiple", "connect", "roster", "cross-"];

const AUTHORITATIVE_TERMS = ["record", "system of record", "authoritative", "track", "registry", "log", "documentation"];

const AUDIT_TERMS = ["audit", "retention", "signature", "signed", "log", "timestamp", "trail", "compliance", "evidence"];

function clauseCount(value: string): number {
  return value
    .split(/;|\band\b/i)
    .map((part) => part.trim())
    .filter((part) => part.length > 0).length;
}

/** Derive one complete TDP-001 answer set from the verbatim source fields. */
export function classifyWorkflow(source: WorkflowSource): DerivedAnswers {
  const need = readApplicationNeed(source.ssls_application_need);
  const necessity = source.ai_necessity.trim().toLowerCase();
  const rules = present(source.rules_based_option);
  const workspace = present(source.google_workspace_option);
  const automation = present(source.automation_option);

  const humanSufficient: Ternary = rules || workspace || automation ? "no" : "yes";

  const workspaceFits: Ternary = workspace && !rules && need === "no" ? "yes" : "no";

  const predictable: Ternary = rules
    ? "yes"
    : necessity === "helpful" || necessity === "required"
      ? "no"
      : workspace || automation
        ? "yes"
        : "uncertain";

  const authoritative: Ternary =
    need === "yes" && has(source.ssls_application_need + source.system_of_record, AUTHORITATIVE_TERMS)
      ? "yes"
      : need === "no"
        ? "no"
        : need === "partial"
          ? "yes"
          : "uncertain";

  const relational: Ternary =
    need === "no" ? "no" : has(source.ssls_application_need, RELATIONAL_TERMS) ? "yes" : "no";

  const longitudinal: Ternary =
    need === "no"
      ? "no"
      : has(`${source.ssls_application_need} ${source.outputs} ${source.audit_evidence}`, LONGITUDINAL_TERMS)
        ? "yes"
        : "no";

  const crossRole: Ternary = clauseCount(source.permissions) >= 3 ? "yes" : "no";

  const permissions: PermissionComplexity = !present(source.permissions)
    ? "unclear"
    : has(source.permissions, RESTRICTED_TERMS)
      ? "restricted"
      : clauseCount(source.permissions) >= 2
        ? "role-based"
        : "simple";

  const auditRequired: Ternary =
    present(source.audit_evidence) && has(source.audit_evidence, AUDIT_TERMS) ? "yes" : "no";

  const interpretation: Ternary =
    necessity === "helpful" || necessity === "required"
      ? "yes"
      : necessity === "optional" || necessity === "unnecessary" || necessity === "prohibited"
        ? "no"
        : "uncertain";

  const scanned = `${source.workflow} ${source.responsibilities} ${source.outputs} ${source.inputs}`;
  let consequence: ConsequenceClass = "none";
  for (const [cls, terms] of CONSEQUENCE_TERMS) {
    if (has(scanned, terms)) {
      consequence = cls;
      break;
    }
  }

  const studentFacing: Ternary = has(source.outputs, STUDENT_FACING_TERMS) ? "yes" : "no";

  const sensitivityScan = `${scanned} ${source.permissions} ${source.audit_evidence}`;
  const sensitivity: DataSensitivityClass = has(sensitivityScan, HIGH_SENSITIVITY_TERMS)
    ? "highly-sensitive-personal"
    : has(sensitivityScan, PERSONAL_TERMS)
      ? "personal"
      : "operational";

  return {
    human_process_sufficient: answer(
      humanSufficient,
      humanSufficient === "yes"
        ? "The source offers no rules-based, Workspace, or automation option, so the analysis leaves the human process in place."
        : "The source offers at least one rules-based, Workspace, or automation option, so something is expected to change.",
      ["rules_based_option", "google_workspace_option", "automation_option"],
    ),
    workspace_tool_fits: answer(
      workspaceFits,
      workspaceFits === "yes"
        ? "A Workspace tool is named, no rules-based build is named, and the source says no SSLS application is needed."
        : "The source either names no Workspace-only route, or expects a build beyond native tools.",
      ["google_workspace_option", "rules_based_option", "ssls_application_need"],
    ),
    output_predictable: answer(
      predictable,
      rules
        ? "The source names a rules-based option, which means the correct output can be determined in advance."
        : predictable === "no"
          ? "The source classifies AI as helpful or required, which means the output is not determined in advance."
          : predictable === "yes"
            ? "The source names a Workspace or automation route with no interpretation requirement."
            : "The source names no deterministic route and no interpretation requirement.",
      ["rules_based_option", "ai_necessity", "google_workspace_option", "automation_option"],
    ),
    repeatable_routing: answer(
      automation ? "yes" : "no",
      automation
        ? "The source names an automation option, which is repeatable routing on fixed rules."
        : "The source names no automation option.",
      ["automation_option"],
    ),
    authoritative_record_required: answer(
      authoritative,
      `The SSLS Application Need field reads "${need}".`,
      ["ssls_application_need", "system_of_record"],
    ),
    relational_data_required: answer(
      relational,
      relational === "yes"
        ? "The stated application need describes records that must stay connected."
        : "The stated application need describes no connected-record requirement.",
      ["ssls_application_need"],
    ),
    longitudinal_data_required: answer(
      longitudinal,
      longitudinal === "yes"
        ? "The source describes history, trend, or progress over time."
        : "The source describes no requirement for history over time.",
      ["ssls_application_need", "outputs", "audit_evidence"],
    ),
    cross_role_workflow: answer(
      crossRole,
      crossRole === "yes"
        ? "The permissions field names three or more distinct actors, which is a cross-role workflow."
        : "The permissions field names fewer than three distinct actors.",
      ["permissions"],
    ),
    permission_complexity: answer(
      permissions,
      permissions === "restricted"
        ? "The permissions field limits access to named or protected parties."
        : permissions === "role-based"
          ? "The permissions field gives different roles different access."
          : permissions === "simple"
            ? "The permissions field describes one group with the same access."
            : "The permissions field is empty.",
      ["permissions"],
    ),
    audit_history_required: answer(
      auditRequired,
      auditRequired === "yes"
        ? "The audit and evidence field names retention, logging, signatures, or an audit trail."
        : "The audit and evidence field names no audit history requirement.",
      ["audit_evidence"],
    ),
    interpretation_required: answer(
      interpretation,
      `The source classifies AI necessity as "${source.ai_necessity.trim() || "unstated"}".`,
      ["ai_necessity"],
    ),
    deterministic_core_available: answer(
      rules ? "yes" : "no",
      rules
        ? "The source names a rules-based option that can carry the predictable part of the task."
        : "The source names no rules-based option.",
      ["rules_based_option"],
    ),
    consequence_class: answer(
      consequence,
      consequence === "none"
        ? "No eligibility, placement, grading, discipline, safety, employment, medical, or legal determination appears in the workflow text."
        : `The workflow text describes a ${consequence} determination about a person.`,
      ["workflow", "responsibilities", "outputs", "inputs"],
    ),
    student_facing_output: answer(
      studentFacing,
      studentFacing === "yes"
        ? "The outputs field names output that reaches a student or family."
        : "The outputs field names no student-facing or family-facing output.",
      ["outputs"],
    ),
    data_sensitivity: answer(
      sensitivity,
      sensitivity === "highly-sensitive-personal"
        ? "The workflow text names health, disability, discipline, legal, or employment detail about identifiable people."
        : sensitivity === "personal"
          ? "The workflow text names identifiable students, families, or staff."
          : "The workflow text names district operations without personal detail.",
      ["workflow", "responsibilities", "outputs", "permissions", "audit_evidence"],
    ),
  };
}

/** Collapse a derived answer set into the plain answer object the evaluator takes. */
export function toDecisionAnswers(derived: DerivedAnswers): DecisionAnswers {
  const value = (id: keyof DerivedAnswers) => derived[id].value;
  return {
    human_process_sufficient: value("human_process_sufficient") as Ternary,
    workspace_tool_fits: value("workspace_tool_fits") as Ternary,
    output_predictable: value("output_predictable") as Ternary,
    repeatable_routing: value("repeatable_routing") as Ternary,
    authoritative_record_required: value("authoritative_record_required") as Ternary,
    relational_data_required: value("relational_data_required") as Ternary,
    longitudinal_data_required: value("longitudinal_data_required") as Ternary,
    cross_role_workflow: value("cross_role_workflow") as Ternary,
    permission_complexity: value("permission_complexity") as PermissionComplexity,
    audit_history_required: value("audit_history_required") as Ternary,
    interpretation_required: value("interpretation_required") as Ternary,
    deterministic_core_available: value("deterministic_core_available") as Ternary,
    consequence_class: value("consequence_class") as ConsequenceClass,
    student_facing_output: value("student_facing_output") as Ternary,
    data_sensitivity: value("data_sensitivity") as DataSensitivityClass,
  };
}

/**
 * Read the option numbers the source itself recommended. Parsing only: the
 * supplied text is never rewritten, and a row whose recommendation cannot be
 * parsed is reported as unreadable rather than guessed at.
 */
export function readSuppliedOptions(recommended: string): OptionId[] {
  const found = new Set<OptionId>();
  const explicit = recommended.matchAll(/option\s*([1-7])/gi);
  for (const match of explicit) found.add(`OPT-${match[1]}` as OptionId);
  if (found.size > 0) {
    // "Option 2 + 3" style continuations after the first explicit mention.
    const tail = recommended.match(/option\s*[1-7]((\s*\+\s*[1-7])+)/i);
    if (tail?.[1]) {
      for (const digit of tail[1].matchAll(/[1-7]/g)) found.add(`OPT-${digit[0]}` as OptionId);
    }
  }
  if (/\bbounded\s*5\b/i.test(recommended)) found.add("OPT-5");
  return [...found].sort();
}
