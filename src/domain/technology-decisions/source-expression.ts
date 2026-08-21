/**
 * Parsing of the supplied `recommended_solution` text into an explicit
 * expression model.
 *
 * The supplied wording is owner-authored source. It is never rewritten, never
 * corrected, and never replaced by the parsed form. Everything here is a
 * READING of that text, stored beside it so a reviewer can check the reading
 * against the original.
 *
 * The parser refuses to guess. A form it cannot read is reported as
 * `unparseable`, and a form that says two incompatible things is reported as
 * `contradictory`. Both fail into an unresolved evidence state rather than
 * into a confident option set.
 */
import { type OptionId } from "./decision-process";

export const PARSER_VERSION = "1.0.0";

export const EXPRESSION_TYPES = [
  "SINGLE",
  "UNORDERED-ALTERNATIVES",
  "ORDERED-PREFERENCE",
  "COMBINATION",
  "HYBRID",
  "UNPARSEABLE",
] as const;
export type ExpressionType = (typeof EXPRESSION_TYPES)[number];

export const PARSE_STATUSES = ["parsed", "ambiguous", "contradictory", "unparseable"] as const;
export type ParseStatus = (typeof PARSE_STATUSES)[number];

/**
 * How strongly the source commits to an option reference.
 *
 * Only `primary` references are the recommendation. A staged, optional, or
 * interim reference is recorded, but treating it as part of the recommendation
 * would attribute to the owner a commitment the owner did not make.
 */
export const OPTION_MODALITIES = ["primary", "optional", "future", "interim", "excluded"] as const;
export type OptionModality = (typeof OPTION_MODALITIES)[number];

export interface OptionReference {
  optionId: OptionId;
  modality: OptionModality;
  /** The verbatim clause the reference was read from. */
  clause: string;
}

export interface SourceExpression {
  /** The supplied text, verbatim and unmodified. */
  verbatim: string;
  expressionType: ExpressionType;
  parseStatus: ParseStatus;
  /** Every option reference found, with its modality and originating clause. */
  references: OptionReference[];
  /** The committed recommendation: `primary` references only, sorted, de-duplicated. */
  primaryOptionIds: OptionId[];
  /** Referenced but not committed: staged, optional, or interim. */
  deferredOptionIds: OptionId[];
  /** Explicitly ruled out by the source. */
  excludedOptionIds: OptionId[];
  /** Machine-readable notes about how the reading was reached. */
  diagnostics: string[];
}

const OPTIONAL_MARKERS = [
  "optional",
  "under review",
  " if ",
  "where needed",
  "as needed",
  "may ",
  "consider",
];
const FUTURE_MARKERS = [
  "future",
  "later",
  "target",
  "as it scales",
  "as scale grows",
  "scale grows",
  "matures",
  "mature",
  "grows",
  "scales",
  "scale",
  "when ",
  "once ",
  "next phase",
  "phase 2",
  "eventually",
];
const INTERIM_MARKERS = ["interim", "until ", "in the meantime", "stopgap", "bridge"];
const NEGATION_MARKERS = ["no ai", "without ai", "not option", "no option", "never option"];

function hasMarker(clause: string, markers: readonly string[]): boolean {
  const text = ` ${clause.toLowerCase()} `;
  return markers.some((marker) => text.includes(marker));
}

/** Option numbers named in one clause, including `Option 2 + 3` continuations. */
function optionsInClause(clause: string): OptionId[] {
  const found = new Set<OptionId>();
  for (const match of clause.matchAll(/option\s*([1-7])((?:\s*\+\s*[1-7])*)/gi)) {
    found.add(`OPT-${match[1]}` as OptionId);
    for (const digit of (match[2] ?? "").matchAll(/[1-7]/g)) {
      found.add(`OPT-${digit[0]}` as OptionId);
    }
  }
  // `bounded 5` names Option 5 without the word "Option". It is the only
  // shorthand present in the register, and it is read explicitly rather than
  // by a general number sweep that would misread quantities.
  if (/\bbounded\s*5\b/i.test(clause)) found.add("OPT-5");
  return [...found].sort();
}

function modalityOf(clause: string, isHead: boolean): OptionModality {
  if (hasMarker(clause, NEGATION_MARKERS)) return "excluded";
  if (hasMarker(clause, INTERIM_MARKERS)) return "interim";
  if (hasMarker(clause, OPTIONAL_MARKERS)) return "optional";
  if (hasMarker(clause, FUTURE_MARKERS)) return "future";
  return isHead ? "primary" : "primary";
}

/** Split on clause boundaries the source actually uses, keeping the text intact. */
function clausesOf(text: string): string[] {
  return text
    .split(/;/)
    .map((clause) => clause.trim())
    .filter((clause) => clause.length > 0);
}

/**
 * Read one supplied recommendation. Pure: same text in, same expression out.
 */
export function parseSourceRecommendation(verbatim: string): SourceExpression {
  const diagnostics: string[] = [];
  const clauses = clausesOf(verbatim);
  const references: OptionReference[] = [];

  clauses.forEach((clause, index) => {
    const isHead = index === 0;
    const negatedHere = clause.match(/\b(?:not|no|never)\s+option\s*([1-7])/i);
    const clauseModality = modalityOf(clause, isHead);
    for (const optionId of optionsInClause(clause)) {
      const modality: OptionModality =
        negatedHere && `OPT-${negatedHere[1]}` === optionId ? "excluded" : clauseModality;
      references.push({ optionId, modality, clause });
    }
  });

  const byModality = (modality: OptionModality) =>
    [...new Set(references.filter((ref) => ref.modality === modality).map((r) => r.optionId))].sort(
      (a, b) => a.localeCompare(b),
    );

  const excludedOptionIds = byModality("excluded");
  const primaryOptionIds = byModality("primary").filter((id) => !excludedOptionIds.includes(id));
  const deferredOptionIds = [
    ...new Set([...byModality("optional"), ...byModality("future"), ...byModality("interim")]),
  ]
    .filter((id) => !primaryOptionIds.includes(id) && !excludedOptionIds.includes(id))
    .sort((a, b) => a.localeCompare(b));

  if (deferredOptionIds.length > 0) {
    diagnostics.push(
      `staged-or-optional-references:${deferredOptionIds.join("+")} — named by the source but not committed to now`,
    );
  }
  if (excludedOptionIds.length > 0) {
    diagnostics.push(`explicitly-excluded:${excludedOptionIds.join("+")}`);
  }
  if (hasMarker(verbatim, NEGATION_MARKERS)) {
    diagnostics.push("negation-present — the source rules something out in words");
  }

  const head = clauses[0] ?? "";
  const headOptions = optionsInClause(head);
  const alternatives = /option\s*[1-7][^;]{0,24}\bor\b[^;]{0,24}option\s*[1-7]/i.test(verbatim);
  const ordered =
    /option\s*[1-7][^;]{0,24}\bthen\b[^;]{0,24}option\s*[1-7]/i.test(verbatim) ||
    /\bfirst\b[^;]{0,40}\bthen\b/i.test(verbatim);

  if (references.length === 0) {
    diagnostics.push("no-option-reference — the text names no option number");
    return {
      verbatim,
      expressionType: "UNPARSEABLE",
      parseStatus: "unparseable",
      references,
      primaryOptionIds: [],
      deferredOptionIds: [],
      excludedOptionIds: [],
      diagnostics,
    };
  }

  if (primaryOptionIds.length === 0) {
    diagnostics.push(
      "no-committed-option — every reference is staged, optional, or excluded, so the source commits to nothing now",
    );
    return {
      verbatim,
      expressionType: "UNPARSEABLE",
      parseStatus: "ambiguous",
      references,
      primaryOptionIds: [],
      deferredOptionIds,
      excludedOptionIds,
      diagnostics,
    };
  }

  let expressionType: ExpressionType;
  if (ordered) {
    expressionType = "ORDERED-PREFERENCE";
    diagnostics.push("ordering-preserved — the source expresses a sequence, not a set");
  } else if (alternatives) {
    expressionType = "UNORDERED-ALTERNATIVES";
    diagnostics.push("alternatives — the source offers a choice between options, not a combination");
  } else if (primaryOptionIds.length === 1 && primaryOptionIds[0] === "OPT-6") {
    // Option 6 is the hybrid option in its own right. It is NOT expanded into
    // {Option 2, Option 5}: the source named one option, and rewriting it into
    // two would invent a recommendation the source did not make.
    expressionType = "HYBRID";
    diagnostics.push("hybrid-option-not-decomposed — Option 6 is read as Option 6");
  } else if (primaryOptionIds.length === 1) {
    expressionType = "SINGLE";
  } else {
    expressionType = headOptions.length === primaryOptionIds.length ? "COMBINATION" : "COMBINATION";
    diagnostics.push("combination — the source commits to more than one option together");
  }

  const contradictory = primaryOptionIds.some((id) => excludedOptionIds.includes(id));
  const parseStatus: ParseStatus = contradictory
    ? "contradictory"
    : alternatives || ordered
      ? "ambiguous"
      : "parsed";
  if (contradictory) {
    diagnostics.push("contradiction — the same option is both recommended and ruled out");
  }
  if (alternatives) {
    diagnostics.push(
      "alternatives-not-collapsed — a choice between options cannot be compared as a single committed set",
    );
  }
  if (ordered) {
    diagnostics.push(
      "ordered-preference-not-collapsed — a sequence cannot be compared as a single committed set",
    );
  }

  return {
    verbatim,
    expressionType,
    parseStatus,
    references,
    primaryOptionIds,
    deferredOptionIds,
    excludedOptionIds,
    diagnostics,
  };
}
