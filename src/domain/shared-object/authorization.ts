/**
 * Authorization and context model — CONTRACT ONLY.
 *
 * There is no authorization engine in this build, and none is needed: the
 * runtime has one authorized human and no stored personal data. What is defined
 * here is the shape a future decision would have to take, and the questions any
 * future implementation must be able to answer.
 *
 * The rejected model is "role equals access". A role is one input among seven.
 */

export const AUTHORIZATION_INPUTS = [
  "identity",
  "acting-capacity",
  "relationship",
  "purpose",
  "applicable-policy",
  "capability",
  "object-scope",
  "time",
] as const;

export type AuthorizationInput = (typeof AUTHORIZATION_INPUTS)[number];

export const AUTHORIZATION_INPUT_META: Record<
  AuthorizationInput,
  { id: AuthorizationInput; label: string; question: string; ifOmitted: string }
> = {
  identity: {
    id: "identity",
    label: "Identity",
    question: "Who is this, verifiably?",
    ifOmitted: "Nothing else can be attributed or audited.",
  },
  "acting-capacity": {
    id: "acting-capacity",
    label: "Acting capacity",
    question: "In which of their roles are they acting right now?",
    ifOmitted: "The widest capacity a person holds governs every action they take.",
  },
  relationship: {
    id: "relationship",
    label: "Relationship",
    question: "What connects them to this specific subject?",
    ifOmitted: "A role becomes a key to every record of that type.",
  },
  purpose: {
    id: "purpose",
    label: "Purpose",
    question: "What are they trying to accomplish?",
    ifOmitted: "Access cannot be limited to the minimum necessary.",
  },
  "applicable-policy": {
    id: "applicable-policy",
    label: "Applicable policy",
    question: "Which rule permits or forbids this?",
    ifOmitted: "The system cannot explain a decision it made.",
  },
  capability: {
    id: "capability",
    label: "Capability",
    question: "Is this action within a capability the organization actually holds?",
    ifOmitted: "People are authorized to do things nobody is accountable for.",
  },
  "object-scope": {
    id: "object-scope",
    label: "Object scope",
    question: "Which specific records, not which type of record?",
    ifOmitted: "Type-level access silently becomes population-level access.",
  },
  time: {
    id: "time",
    label: "Time",
    question: "Is this authority still in force?",
    ifOmitted: "Authority granted once persists after the reason for it ends.",
  },
};

export type AuthorizationOutcome = "permitted" | "refused" | "permitted-with-limits" | "undetermined";

export const AUTHORIZATION_OUTCOME_META: Record<
  AuthorizationOutcome,
  { id: AuthorizationOutcome; label: string; marker: string; meaning: string }
> = {
  permitted: { id: "permitted", label: "Permitted", marker: "[PERMIT]", meaning: "A named rule allows it, for this purpose, now." },
  refused: { id: "refused", label: "Refused", marker: "[REFUSED]", meaning: "A named rule forbids it. The reason is recorded." },
  "permitted-with-limits": { id: "permitted-with-limits", label: "Permitted with limits", marker: "[LIMITED]", meaning: "Allowed for a reduced projection or a shorter period." },
  undetermined: { id: "undetermined", label: "Undetermined", marker: "[UNDET]", meaning: "No rule addresses it. Default is deny, and the gap is a finding." },
};

/**
 * The explanation any authorization decision must be able to produce.
 * Every field answers a question a person is entitled to ask.
 */
export interface AuthorizationExplanation {
  /** "Why am I seeing this?" */
  whyVisible: string;
  /** "Who else can see this?" */
  whoElseCanSee: string;
  /** "Why can I perform this action?" */
  whyActionPermitted: string;
  /** "What rule permits it?" */
  governingPolicyId: string;
  /** "When does this authority expire?" */
  expiresAt: string | null;
  outcome: AuthorizationOutcome;
}

export interface AuthorizationRule {
  ruleId: string;
  name: string;
  statement: string;
  requiredInputs: AuthorizationInput[];
  defaultOutcome: Extract<AuthorizationOutcome, "refused" | "undetermined">;
  /** What this rule deliberately does not grant. */
  doesNotGrant: string[];
  authorityNote: string;
  synthetic: boolean;
}

export const AUTHORIZATION_PRINCIPLES: { id: string; rule: string }[] = [
  { id: "AUTH-01", rule: "Default deny. An unaddressed request is refused and recorded as a gap." },
  { id: "AUTH-02", rule: "Role alone never authorizes. Purpose and relationship are required inputs." },
  { id: "AUTH-03", rule: "Every permitted action can explain itself in plain language." },
  { id: "AUTH-04", rule: "Authority is time-bounded. Indefinite grants are a finding." },
  { id: "AUTH-05", rule: "Authorization decisions are audited, including refusals." },
  { id: "AUTH-06", rule: "The model stays reversible: no engine is built before the need is real." },
];

/** Operational visibility must not become surveillance. Locked by test. */
export const PROHIBITED_MONITORING_FIELDS: string[] = [
  "keystroke-metrics",
  "activity-score",
  "productivity-score",
  "algorithmic-performance-rating",
  "inferred-effort",
  "idle-time",
  "screen-capture",
  "location-tracking",
];
