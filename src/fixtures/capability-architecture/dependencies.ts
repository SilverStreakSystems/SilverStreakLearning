import type { CapabilityDependency } from "@/domain";

/**
 * Candidate dependency edges between capabilities. Rendered as a table rather
 * than a picture: the relationships must be readable without vision, without
 * color, and at 200% zoom.
 */
export const CAPABILITY_DEPENDENCIES: CapabilityDependency[] = [
  {
    from: "CAP-D01-003",
    kind: "enables",
    to: "CAP-D01-004",
    rationale: "Decisions can only bind if authority classes are declared and enforced.",
  },
  {
    from: "CAP-D01-002",
    kind: "required_before",
    to: "CAP-D02-001",
    rationale: "Learning doctrine inherits its premises from the core beliefs doctrine.",
  },
  {
    from: "CAP-D01-004",
    kind: "required_before",
    to: "CAP-D01-005",
    rationale: "A requirement is only authorized once a decision approves its intent.",
  },
  {
    from: "CAP-D01-005",
    kind: "required_before",
    to: "CAP-D07-008",
    rationale: "Release cannot be authorized against an unstated requirement.",
  },
  {
    from: "CAP-D01-007",
    kind: "supplies_evidence_to",
    to: "CAP-D01-008",
    rationale: "Claim governance consumes evidence records and refuses claims without them.",
  },
  {
    from: "CAP-D01-006",
    kind: "enables",
    to: "CAP-D01-008",
    rationale: "Traceability is how a claim is walked back to its basis.",
  },
  {
    from: "CAP-D01-011",
    kind: "constrained_by",
    to: "CAP-D06-005",
    rationale: "Boundary changes that touch personal data require a privacy assessment.",
  },
  {
    from: "CAP-D02-005",
    kind: "depends_on",
    to: "CAP-D05-003",
    rationale: "Mastery definitions require defined measures with stated limits.",
  },
  {
    from: "CAP-D02-004",
    kind: "validated_by",
    to: "CAP-D05-006",
    rationale: "Assessment inference must survive independent statistical review.",
  },
  {
    from: "CAP-D02-006",
    kind: "constrained_by",
    to: "CAP-D03-005",
    rationale: "Specialized program design cannot exceed the accessibility standard.",
  },
  {
    from: "CAP-D02-007",
    kind: "depends_on",
    to: "CAP-D05-002",
    rationale: "Language and content must be distinct in the canonical data model.",
  },
  {
    from: "CAP-D03-005",
    kind: "reviewed_by",
    to: "CAP-D07-004",
    rationale: "Accessibility design is validated by an independent accessibility validator.",
  },
  {
    from: "CAP-D03-004",
    kind: "depends_on",
    to: "CAP-D03-008",
    rationale: "Interaction design relies on the shared design system for consistency.",
  },
  {
    from: "CAP-D03-010",
    kind: "constrained_by",
    to: "CAP-D05-011",
    rationale: "Product analytics scope is limited by retention and minimization rules.",
  },
  {
    from: "CAP-D04-005",
    kind: "required_before",
    to: "CAP-D09-003",
    rationale: "Roster onboarding cannot begin without a verified access model.",
  },
  {
    from: "CAP-D04-004",
    kind: "conflicts_with",
    to: "CAP-D08-006",
    rationale:
      "Procurement responses routinely assert integrations before integration engineering has tested them.",
  },
  {
    from: "CAP-D04-007",
    kind: "constrained_by",
    to: "CAP-D07-008",
    rationale: "The release mechanism may only act on an authorized release decision.",
  },
  {
    from: "CAP-D04-008",
    kind: "constrained_by",
    to: "CAP-D05-011",
    rationale: "Telemetry content is bounded by data minimization.",
  },
  {
    from: "CAP-D04-009",
    kind: "enables",
    to: "CAP-D10-009",
    rationale: "Technical recovery capability underpins enterprise continuity planning.",
  },
  {
    from: "CAP-D05-001",
    kind: "required_before",
    to: "CAP-D05-004",
    rationale: "Analysis is only permitted within governed purposes.",
  },
  {
    from: "CAP-D05-007",
    kind: "required_before",
    to: "CAP-D05-008",
    rationale: "Evaluation needs an approved use case and prohibited-use list to test against.",
  },
  {
    from: "CAP-D05-009",
    kind: "constrained_by",
    to: "CAP-D01-011",
    rationale: "Human oversight requirements come from the authorized posture.",
  },
  {
    from: "CAP-D06-002",
    kind: "enables",
    to: "CAP-D04-005",
    rationale: "Identity engineering implements the security architecture.",
  },
  {
    from: "CAP-D06-006",
    kind: "required_before",
    to: "CAP-D09-003",
    rationale: "Student data protection rules must exist before any roster is imported.",
  },
  {
    from: "CAP-D06-011",
    kind: "supplies_evidence_to",
    to: "CAP-D06-010",
    rationale: "Trust statements must cite independent assurance, not self-assessment.",
  },
  {
    from: "CAP-D07-003",
    kind: "supplies_evidence_to",
    to: "CAP-D07-008",
    rationale: "Automated verification results are one input to a release decision.",
  },
  {
    from: "CAP-D07-004",
    kind: "required_before",
    to: "CAP-D08-002",
    rationale: "No accessibility claim may be made before independent validation exists.",
  },
  {
    from: "CAP-D07-010",
    kind: "supplies_evidence_to",
    to: "CAP-D02-009",
    rationale: "Pilot results feed efficacy research rather than substituting for it.",
  },
  {
    from: "CAP-D08-002",
    kind: "constrained_by",
    to: "CAP-D01-008",
    rationale: "Messaging is bounded by claim governance.",
  },
  {
    from: "CAP-D08-004",
    kind: "depends_on",
    to: "CAP-D09-001",
    rationale: "Fit assessment needs a real implementation method to judge feasibility against.",
  },
  {
    from: "CAP-D09-005",
    kind: "supplies_evidence_to",
    to: "CAP-D12-003",
    rationale: "Adoption signals feed the improvement portfolio.",
  },
  {
    from: "CAP-D09-009",
    kind: "supplies_evidence_to",
    to: "CAP-D03-002",
    rationale: "Field feedback is an input to product definition.",
  },
  {
    from: "CAP-D10-004",
    kind: "required_before",
    to: "CAP-D08-007",
    rationale: "Contracting requires qualified legal review.",
  },
  {
    from: "CAP-D11-001",
    kind: "depends_on",
    to: "CAP-D01-010",
    rationale: "Workforce architecture follows the authorized portfolio, not the reverse.",
  },
  {
    from: "CAP-D11-009",
    kind: "constrained_by",
    to: "CAP-D10-009",
    rationale: "Succession requirements come from continuity obligations.",
  },
  {
    from: "CAP-D12-005",
    kind: "supplies_evidence_to",
    to: "CAP-D01-009",
    rationale: "Drift detection raises findings into the findings register.",
  },
  {
    from: "CAP-D12-009",
    kind: "validated_by",
    to: "CAP-D01-007",
    rationale: "Improvement effectiveness must be recorded as governed evidence.",
  },
  {
    from: "CAP-D12-002",
    kind: "shares_service_with",
    to: "CAP-D01-004",
    rationale: "Institutional memory and decision governance operate on the same record store.",
  },
];
