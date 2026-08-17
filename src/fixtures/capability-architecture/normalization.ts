import type { NormalizationFinding } from "@/domain";

/**
 * Normalization pass. Each finding records a judgment made while converting a
 * long candidate term list into capability records. None of these findings is
 * approved; each is a candidate resolution that a decision may overturn.
 */
export const NORMALIZATION_FINDINGS: NormalizationFinding[] = [
  {
    id: "NORM-001",
    kind: "synonym",
    subjects: ["Quality assurance", "Testing", "Verification"],
    resolvedInto: ["CAP-D07-002", "CAP-D07-003"],
    statement:
      "Testing and verification are treated as one strategy capability plus one execution capability, rather than as three overlapping terms.",
    boundary: "Does not assert that the resulting split is the correct long-term structure.",
    resolutionState: "partial",
    synthetic: true,
  },
  {
    id: "NORM-002",
    kind: "actually-a-role",
    subjects: ["Data Protection Officer", "Accessibility Lead", "Release Manager"],
    resolvedInto: ["CAP-D06-005", "CAP-D03-005", "CAP-D07-008"],
    statement:
      "Each named title was recorded as a role that may hold a capability, not as a capability itself.",
    boundary: "Does not assert that these roles will exist or that one person may not hold several.",
    resolutionState: "confirmed",
    synthetic: true,
  },
  {
    id: "NORM-003",
    kind: "actually-a-process",
    subjects: ["Sprint planning", "Standup", "Quarterly business review"],
    resolvedInto: ["CAP-D01-010", "CAP-D11-008"],
    statement:
      "Recurring meetings were treated as processes implementing portfolio and capacity capabilities.",
    boundary: "Does not prescribe any particular delivery methodology.",
    resolutionState: "confirmed",
    synthetic: true,
  },
  {
    id: "NORM-004",
    kind: "actually-a-deliverable",
    subjects: ["Roadmap", "Security whitepaper", "Data processing agreement"],
    resolvedInto: ["DT-04", "DT-16", "DT-15"],
    statement: "Named artifacts were mapped to deliverable types rather than to capabilities.",
    boundary: "Does not state that these artifacts exist today.",
    resolutionState: "confirmed",
    synthetic: true,
  },
  {
    id: "NORM-005",
    kind: "actually-a-module",
    subjects: ["Progress dashboard", "IEP workspace", "Family portal"],
    resolvedInto: ["CAP-D03-002", "CAP-D03-009"],
    statement:
      "Product surfaces were treated as things capabilities produce, not as organizational abilities.",
    boundary: "Does not commit SSLS to building any of these surfaces.",
    resolutionState: "confirmed",
    synthetic: true,
  },
  {
    id: "NORM-006",
    kind: "duplicate",
    subjects: ["Vendor risk management", "Third-party assurance"],
    resolvedInto: ["CAP-D06-007"],
    statement: "Two candidate terms described one capability and were merged.",
    boundary: "Procurement remains distinct and is recorded separately.",
    resolutionState: "confirmed",
    synthetic: true,
  },
  {
    id: "NORM-007",
    kind: "duplicate",
    subjects: ["Change management", "Release management", "Deployment"],
    resolvedInto: ["CAP-D04-007", "CAP-D07-007", "CAP-D07-008"],
    statement:
      "One overloaded term was separated into mechanism, risk assessment, and authorization, because they must not be held by the same person.",
    boundary: "Does not assert the split matches any external framework.",
    resolutionState: "partial",
    synthetic: true,
  },
  {
    id: "NORM-008",
    kind: "independence-sensitive",
    subjects: ["Accessibility design", "Accessibility validation"],
    resolvedInto: ["CAP-D03-005", "CAP-D07-004"],
    statement:
      "Deliberately kept as two capabilities so the designer can never be the validator.",
    boundary: "Does not claim SSLS currently has either capability staffed.",
    resolutionState: "confirmed",
    synthetic: true,
  },
  {
    id: "NORM-009",
    kind: "independence-sensitive",
    subjects: ["Marketing claims", "Claim approval"],
    resolvedInto: ["CAP-D08-002", "CAP-D01-008"],
    statement: "Drafting and approving claims are separated to prevent revenue self-approval.",
    boundary: "Does not assert an approver exists today.",
    resolutionState: "confirmed",
    synthetic: true,
  },
  {
    id: "NORM-010",
    kind: "missing-capability",
    subjects: ["Drift detection"],
    resolvedInto: ["CAP-D12-005"],
    statement:
      "No candidate term covered divergence between declared canon and actual practice, so a capability was added.",
    boundary: "Added by the author of this pass; not derived from an approved source.",
    resolutionState: "partial",
    synthetic: true,
  },
  {
    id: "NORM-011",
    kind: "missing-capability",
    subjects: ["Employee accessibility"],
    resolvedInto: ["CAP-D11-010"],
    statement:
      "Accessibility appeared only as a product concern; internal workplace accessibility was added.",
    boundary: "Does not assert any current internal accommodation practice.",
    resolutionState: "partial",
    synthetic: true,
  },
  {
    id: "NORM-012",
    kind: "over-specialized",
    subjects: ["Screen reader testing", "Keyboard testing", "Contrast checking"],
    resolvedInto: ["CAP-D07-004"],
    statement: "Individual techniques were folded into one validation capability.",
    boundary: "Techniques remain required methods; they are not separate capabilities.",
    resolutionState: "confirmed",
    synthetic: true,
  },
  {
    id: "NORM-013",
    kind: "cross-cutting",
    subjects: ["Accessibility", "Privacy", "Evidence discipline"],
    resolvedInto: ["CAP-D03-005", "CAP-D06-005", "CAP-D01-007"],
    statement:
      "Each is recorded as an owned capability and also as a constraint on other domains, rather than being duplicated everywhere.",
    boundary: "Does not remove the obligation from any other capability.",
    resolutionState: "confirmed",
    synthetic: true,
  },
  {
    id: "NORM-014",
    kind: "actually-a-role",
    subjects: ["Founder"],
    resolvedInto: [],
    statement:
      "The founder operator is the current coverage mode for many capabilities and is not itself a capability.",
    boundary:
      "Records the single point of failure explicitly; does not resolve it.",
    resolutionState: "conflicted",
    synthetic: true,
  },
  {
    id: "NORM-015",
    kind: "duplicate",
    subjects: ["Customer success", "Account management", "Renewals"],
    resolvedInto: ["CAP-D09-008"],
    statement: "Three commercial terms were merged into one outcome-accountable capability.",
    boundary: "May need to split again at S4; recorded as an open question.",
    resolutionState: "partial",
    synthetic: true,
  },
];
