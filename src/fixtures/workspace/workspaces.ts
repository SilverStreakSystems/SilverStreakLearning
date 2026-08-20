/**
 * The nine enterprise workspaces.
 *
 * Each one is a projection over shared governed objects. Availability and
 * authority are stored fields: a workspace does not become current because a
 * route renders it.
 */
import type { WorkspaceDefinition } from "@/domain";

const SHARED_ACCESSIBILITY: string[] = [
  "One H1 per page, semantic landmarks, and a working skip link.",
  "Full keyboard operation with a visible focus indicator on every control.",
  "Status carried by text and shape, never by colour alone.",
  "Dense tables keep row and column headers and scroll rather than truncate.",
  "Essential content survives 320 CSS-pixel reflow and 200 percent text enlargement.",
  "Reduced-motion preference honoured; no essential meaning conveyed by motion.",
  "Plain language, complete sentences in instructions and errors, translation-ready copy.",
];

const NO_PII = "No personal data of any kind. Synthetic records only.";

export const WORKSPACES: WorkspaceDefinition[] = [
  {
    workspaceId: "command-center",
    name: "Command Center",
    purpose:
      "Give the authorized operator one honest view of what is true now and what deserves attention next.",
    fundamentalQuestion:
      "What is happening across SSLS now, and what requires responsible attention?",
    authorityState: "provisional-implementation",
    implementationState: "implemented",
    maturity: "S2",
    targetUsers: ["Founder and developer operator"],
    actingCapacities: ["founder-developer"],
    requiredCapabilities: ["CAP-D01-001", "CAP-D01-002", "CAP-D12-001"],
    primaryValueStreams: ["strategy-portfolio", "requirement-decision", "build-validation"],
    sharedObjectsUsed: [
      "decision",
      "finding",
      "evidence",
      "risk",
      "work-item",
      "value-stream-reference",
      "enterprise-capability",
      "claim",
    ],
    allowedProjections: [
      "Authority standing across recorded artifacts",
      "Open obligations drawn from canonical registers",
      "Independent readiness axes",
    ],
    prohibitedObjects: [
      "Any record containing personal data",
      "Sales, revenue, workforce, or customer health figures presented as current fact",
      "A blended readiness percentage of any kind",
    ],
    minimumContextRequirements: [
      "Acting capacity is known and active.",
      "Every displayed record names its canonical register.",
      "Freshness and missing information are stated where material.",
    ],
    navigationItems: [
      { itemId: "cc-now", label: "What is true now", route: "/", availability: "current" },
      { itemId: "cc-actions", label: "Action center", route: "/actions", availability: "current" },
      {
        itemId: "cc-future",
        label: "Future enterprise surfaces",
        route: "/future-architecture",
        availability: "gated-future",
      },
    ],
    primarySurfaces: [
      {
        surfaceId: "cc-authoritative",
        name: "What is authoritative now",
        question: "Which records may currently be cited to justify work?",
        availability: "current",
        readsObjectTypes: ["decision", "policy-rule", "standard"],
      },
      {
        surfaceId: "cc-blocked",
        name: "What is blocked or awaiting a decision",
        question: "Where has work stopped, and who must act?",
        availability: "current",
        readsObjectTypes: ["finding", "decision", "work-item"],
      },
      {
        surfaceId: "cc-validation",
        name: "What has actually been validated",
        question: "Which checks have genuinely run, and which have not?",
        availability: "current",
        readsObjectTypes: ["evidence", "validation"],
      },
      {
        surfaceId: "cc-portfolio-health",
        name: "Portfolio, customer, and workforce health",
        question: "How is the enterprise performing across its operating surfaces?",
        availability: "gated-future",
        readsObjectTypes: ["organization", "product-reference", "role-reference"],
      },
    ],
    actionTypes: ["decision-needed", "unresolved-finding", "evidence-request", "revalidation"],
    decisionRights: [
      "Founder operator may accept, decline, or defer any recorded decision within the governed boundary.",
    ],
    metrics: [
      {
        metricId: "CC-M1",
        name: "Open governance blockers",
        questionAnswered: "How many recorded findings currently stop work from advancing?",
        source: "Findings register",
        calculation: "Count of findings whose resolution state is blocked or conflicted.",
        freshness: "As current as the findings register.",
        interpretation: "A count of stop conditions that each need an individual resolution.",
        prohibitedInterpretation:
          "Not a quality score, not a trend, and never divided into a readiness percentage.",
        actionTriggered: "Resolve or formally accept each blocker before advancing dependent work.",
      },
      {
        metricId: "CC-M2",
        name: "Checks never executed",
        questionAnswered: "How much of the evidence register has never actually been run?",
        source: "Evidence register",
        calculation: "Count of evidence records with no collection date.",
        freshness: "As current as the evidence register.",
        interpretation: "Work that is claimed but unverified.",
        prohibitedInterpretation: "Not a defect count and not proof that the checks would fail.",
        actionTriggered: "Schedule the missing check or withdraw the associated claim.",
      },
    ],
    evidenceRequirements: [
      "Every state shown must cite the register it came from.",
      "An unrun check is displayed as unrun, never as passing.",
    ],
    notificationRules: [
      "Notify on decision needed, gate blocked, evidence stale, and critical risk.",
      "Do not notify on ordinary record edits.",
    ],
    searchDomains: [
      "decisions",
      "findings",
      "evidence",
      "work-items",
      "value-streams",
      "capabilities",
    ],
    dependencies: ["Governance registers", "Value stream architecture", "Capability registry"],
    availability: "current",
    currentBoundary: `Founder and developer operator only. ${NO_PII}`,
    futureBoundary:
      "Enterprise health, release state, pipeline, and workforce surfaces stay gated until real operations and authorized roles exist.",
    accessibilityRequirements: SHARED_ACCESSIBILITY,
    reviewTrigger: "Any new register, gate, or acting capacity is added.",
    supersession: null,
    notes: "Deliberately narrow. A command center that shows everything commands nothing.",
  },
  {
    workspaceId: "strategy-governance",
    name: "Strategy and Governance",
    purpose:
      "Hold direction, authority, and the rules that constrain every other workspace in one governed place.",
    fundamentalQuestion:
      "What are we trying to accomplish, what governs us, and what are we authorized to do?",
    authorityState: "provisional-implementation",
    implementationState: "implemented",
    maturity: "S2",
    targetUsers: ["Founder and developer operator"],
    actingCapacities: ["founder-developer"],
    requiredCapabilities: ["CAP-D01-001", "CAP-D01-002", "CAP-D01-003"],
    primaryValueStreams: [
      "strategy-portfolio",
      "requirement-decision",
      "governance-artifact-lifecycle",
    ],
    sharedObjectsUsed: [
      "decision",
      "policy-rule",
      "standard",
      "enterprise-capability",
      "risk",
      "claim",
      "approval",
    ],
    allowedProjections: [
      "Authority ledger by declared class",
      "Foundation layer map",
      "Capability registry with gate conditions",
      "Claims governance and refused claims",
    ],
    prohibitedObjects: ["Personal data", "Unrecorded verbal direction presented as authority"],
    minimumContextRequirements: [
      "Authority class is displayed from the stored field for every artifact.",
      "Supersession is shown wherever a record has been replaced.",
    ],
    navigationItems: [
      {
        itemId: "sg-authority",
        label: "Authority ledger",
        route: "/authority",
        availability: "current",
      },
      {
        itemId: "sg-foundation",
        label: "Foundation map",
        route: "/foundation-map",
        availability: "current",
      },
      {
        itemId: "sg-capabilities",
        label: "Capability registry",
        route: "/capabilities",
        availability: "current",
      },
      { itemId: "sg-decisions", label: "Decisions", route: "/decisions", availability: "current" },
      {
        itemId: "sg-boundaries",
        label: "Boundaries and refused claims",
        route: "/boundaries",
        availability: "current",
      },
    ],
    primarySurfaces: [
      {
        surfaceId: "sg-north-star",
        name: "North Star and core beliefs",
        question: "What does Make Learning Visible require of this decision?",
        availability: "current",
        readsObjectTypes: ["policy-rule", "standard"],
      },
      {
        surfaceId: "sg-authority-manifest",
        name: "Authority manifest",
        question: "Which records currently carry implementation authority?",
        availability: "current",
        readsObjectTypes: ["decision", "policy-rule", "standard", "approval"],
      },
      {
        surfaceId: "sg-portfolio",
        name: "Portfolio priorities",
        question: "What is authorized, deferred, or declined, and at what opportunity cost?",
        availability: "candidate",
        readsObjectTypes: ["decision", "enterprise-capability"],
      },
    ],
    actionTypes: ["decision-needed", "approval", "review", "unresolved-finding"],
    decisionRights: [
      "Founder operator holds all governance decision rights until a governance body exists.",
    ],
    metrics: [
      {
        metricId: "SG-M1",
        name: "Artifacts carrying implementation authority",
        questionAnswered:
          "How much of the recorded foundation may actually justify building something?",
        source: "Foundation artifact registry",
        calculation:
          "Count of current artifacts whose declared class carries implementation authority.",
        freshness: "As current as the artifact registry.",
        interpretation: "The authorized basis available to downstream work.",
        prohibitedInterpretation:
          "Not a maturity score. A large count of approved artifacts does not mean the enterprise is ready.",
        actionTriggered: "Promote or retire artifacts so authority matches intent.",
      },
    ],
    evidenceRequirements: [
      "Every approved artifact names the decision that approved it.",
      "A claim without evidence is shown as refused, not pending.",
    ],
    notificationRules: ["Notify on decision needed, approval requested, and claim expiry."],
    searchDomains: ["decisions", "policies", "standards", "capabilities", "risks", "artifacts"],
    dependencies: ["Authority model", "Capability architecture"],
    availability: "current",
    currentBoundary: `Project governance records only. ${NO_PII}`,
    futureBoundary: "Board, executive, and delegated governance bodies remain target-state.",
    accessibilityRequirements: SHARED_ACCESSIBILITY,
    reviewTrigger: "Any change to the authority model or the governed boundary.",
    supersession: null,
    notes: "This workspace is the source of constraint for the other eight.",
  },
  {
    workspaceId: "research-intelligence",
    name: "Research and Intelligence",
    purpose:
      "Keep what is known, what is being learned, and what remains uncertain distinguishable from one another.",
    fundamentalQuestion:
      "What do we know, what are we learning, what remains uncertain, and what should change?",
    authorityState: "provisional-implementation",
    implementationState: "partially-implemented",
    maturity: "S1",
    targetUsers: ["Founder and developer operator"],
    actingCapacities: ["founder-developer", "chief-academic-officer-preview"],
    requiredCapabilities: ["CAP-D02-001", "CAP-D12-001", "CAP-D01-002"],
    primaryValueStreams: ["research-requirement", "outcome-research", "feedback-decision"],
    sharedObjectsUsed: [
      "source",
      "research-record",
      "finding",
      "evidence",
      "knowledge-object",
      "requirement",
    ],
    allowedProjections: [
      "Research portfolio and open questions",
      "Source to finding to interpretation chain",
      "Unknowns register",
      "Research to requirement traceability",
    ],
    prohibitedObjects: [
      "Personal data from any study participant",
      "An interpretation presented as a finding",
      "A finding presented as a requirement",
    ],
    minimumContextRequirements: [
      "Source, research record, finding, interpretation, and requirement stay visibly distinct.",
      "Every finding names the source it rests on.",
    ],
    navigationItems: [
      {
        itemId: "ri-findings",
        label: "Findings register",
        route: "/findings",
        availability: "current",
      },
      {
        itemId: "ri-traceability",
        label: "Traceability",
        route: "/traceability",
        availability: "current",
      },
      {
        itemId: "ri-objects",
        label: "Research objects",
        route: "/objects",
        availability: "current",
      },
    ],
    primarySurfaces: [
      {
        surfaceId: "ri-portfolio",
        name: "Research portfolio",
        question: "Which questions are open, and who is answering them?",
        availability: "candidate",
        readsObjectTypes: ["research-record", "source"],
      },
      {
        surfaceId: "ri-unknowns",
        name: "Unknowns",
        question: "What have we explicitly recorded that we do not know?",
        availability: "current",
        readsObjectTypes: ["finding", "knowledge-object"],
      },
      {
        surfaceId: "ri-standards-watch",
        name: "Standards and policy monitoring",
        question: "Which external standards changed, and what does that oblige us to do?",
        availability: "candidate",
        readsObjectTypes: ["standard", "source"],
      },
    ],
    actionTypes: ["review", "evidence-request", "unresolved-finding", "revalidation"],
    decisionRights: [
      "Research may propose requirements. It may not approve them; that right sits with governance.",
    ],
    metrics: [
      {
        metricId: "RI-M1",
        name: "Findings without a source",
        questionAnswered: "How many recorded findings cannot name what they rest on?",
        source: "Findings register",
        calculation: "Count of findings with no source or evidence reference.",
        freshness: "As current as the findings register.",
        interpretation: "Assertions that are not yet defensible.",
        prohibitedInterpretation: "Not a measure of researcher performance.",
        actionTriggered: "Attach a source or downgrade the finding to an open question.",
      },
    ],
    evidenceRequirements: [
      "A requirement traceable to research must cite the finding, not the source alone.",
    ],
    notificationRules: [
      "Notify on review due and evidence stale. Do not notify on every new source.",
    ],
    searchDomains: [
      "research",
      "findings",
      "evidence",
      "standards",
      "requirements",
      "documentation",
    ],
    dependencies: ["Shared object architecture", "Evidence contract"],
    availability: "current",
    currentBoundary: `Desk research on public sources only. No human-subject research. ${NO_PII}`,
    futureBoundary:
      "Studies involving educators, learners, or districts require separate authorization and ethics review.",
    accessibilityRequirements: SHARED_ACCESSIBILITY,
    reviewTrigger: "Any new research method or participant category is proposed.",
    supersession: null,
    notes: "The distinction between a source and a finding is the whole point of this workspace.",
  },
  {
    workspaceId: "product-learning-systems",
    name: "Product and Learning Systems",
    purpose: "Define what SSLS products and learning systems should do, before anyone builds them.",
    fundamentalQuestion:
      "What should SSLS products, learning systems, and educational capabilities do?",
    authorityState: "gated-future",
    implementationState: "specified-only",
    maturity: "S0",
    targetUsers: ["Founder operator", "Future product and academic leadership"],
    actingCapacities: [
      "founder-developer",
      "chief-product-officer-preview",
      "chief-academic-officer-preview",
    ],
    requiredCapabilities: ["CAP-D03-001", "CAP-D02-001", "CAP-D02-002"],
    primaryValueStreams: ["requirement-decision", "research-requirement", "adoption-outcome"],
    sharedObjectsUsed: [
      "requirement",
      "product-reference",
      "module-reference",
      "enterprise-capability",
      "decision",
    ],
    allowedProjections: [
      "Product portfolio reference",
      "Capability to product mapping",
      "Educational capability contracts",
      "Accessibility and multilingual requirements",
    ],
    prohibitedObjects: [
      "Student records of any kind",
      "District runtime configuration",
      "Individualized education program content",
    ],
    minimumContextRequirements: [
      "Every product reference is labelled as a reference, not a shipped product.",
      "Special education and multilingual safeguards appear as requirements, not options.",
    ],
    navigationItems: [
      {
        itemId: "pl-capabilities",
        label: "Capability to product mapping",
        route: "/capabilities",
        availability: "candidate",
      },
      {
        itemId: "pl-preview",
        label: "Workspace preview",
        route: null,
        availability: "gated-future",
      },
    ],
    primarySurfaces: [
      {
        surfaceId: "pl-portfolio",
        name: "Product portfolio",
        question: "Which product references exist, and which capability does each serve?",
        availability: "candidate",
        readsObjectTypes: ["product-reference", "enterprise-capability"],
      },
      {
        surfaceId: "pl-learning-architecture",
        name: "Learning architecture",
        question: "How do curriculum, assessment, and evidence of learning fit together?",
        availability: "gated-future",
        readsObjectTypes: ["requirement", "standard"],
      },
      {
        surfaceId: "pl-safeguards",
        name: "Accessibility and special education safeguards",
        question: "Which learners are protected by this requirement, and how?",
        availability: "candidate",
        readsObjectTypes: ["requirement", "standard", "risk"],
      },
    ],
    actionTypes: ["decision-needed", "review", "unresolved-finding"],
    decisionRights: [
      "Product scope decisions remain with the founder operator until roles are staffed.",
    ],
    metrics: [
      {
        metricId: "PL-M1",
        name: "Capabilities with no product reference",
        questionAnswered: "Which declared capabilities have nothing that would deliver them?",
        source: "Capability registry and product references",
        calculation: "Count of capabilities with no linked product reference.",
        freshness: "As current as both registries.",
        interpretation: "A gap between what SSLS says it can do and what could carry it.",
        prohibitedInterpretation: "Not a roadmap commitment and not a delivery forecast.",
        actionTriggered: "Either link a product reference or record the capability as deferred.",
      },
    ],
    evidenceRequirements: [
      "Educational validity claims require research evidence, not product intent.",
    ],
    notificationRules: [
      "Notify on decision needed and accessibility risk. Nothing else is authorized yet.",
    ],
    searchDomains: ["requirements", "products", "capabilities", "standards", "research"],
    dependencies: ["Research and Intelligence", "Strategy and Governance"],
    availability: "gated-future",
    currentBoundary:
      "Architecture only. No product runtime, no learner-facing function, no district function.",
    futureBoundary:
      "Opens when a product family and shared service boundary architecture is approved and educational validity capabilities reach a working stage.",
    accessibilityRequirements: SHARED_ACCESSIBILITY,
    reviewTrigger: "Approval of the product family and shared service boundary architecture.",
    supersession: null,
    notes:
      "District and student product functions belong to a product runtime, never to this enterprise workspace.",
  },
  {
    workspaceId: "engineering-delivery",
    name: "Engineering and Delivery",
    purpose:
      "Track how authorized capabilities are designed, built, validated, released, operated, and maintained.",
    fundamentalQuestion:
      "How do we design, build, validate, release, operate, and maintain authorized capabilities?",
    authorityState: "provisional-implementation",
    implementationState: "partially-implemented",
    maturity: "S1",
    targetUsers: ["Founder and developer operator"],
    actingCapacities: [
      "founder-developer",
      "chief-technology-officer-preview",
      "engineering-manager-preview",
    ],
    requiredCapabilities: ["CAP-D04-001", "CAP-D07-001", "CAP-D04-002"],
    primaryValueStreams: [
      "decision-build",
      "build-validation",
      "validation-release",
      "incident-recovery-learning",
    ],
    sharedObjectsUsed: [
      "work-item",
      "decision",
      "deliverable-instance",
      "evidence",
      "validation",
      "event",
      "risk",
    ],
    allowedProjections: [
      "Implementation work by served object",
      "Architecture decisions",
      "Validation state separate from implementation state",
      "Release evidence and gate dispositions",
    ],
    prohibitedObjects: [
      "Production customer data",
      "Live environment credentials",
      "Any developer activity telemetry",
    ],
    minimumContextRequirements: [
      "Implementation, validation, and release states are displayed on separate axes.",
      "Every work item names its purpose and the object it serves.",
    ],
    navigationItems: [
      {
        itemId: "ed-streams",
        label: "Delivery value streams",
        route: "/value-streams",
        availability: "current",
      },
      {
        itemId: "ed-evidence",
        label: "Evidence register",
        route: "/evidence",
        availability: "current",
      },
      {
        itemId: "ed-objects",
        label: "Work and deliverables",
        route: "/objects",
        availability: "current",
      },
    ],
    primarySurfaces: [
      {
        surfaceId: "ed-work",
        name: "Implementation work",
        question: "What is being built, for which object, and under whose decision?",
        availability: "current",
        readsObjectTypes: ["work-item", "decision"],
      },
      {
        surfaceId: "ed-validation",
        name: "Validation state",
        question: "What has been checked, by what method, and when?",
        availability: "current",
        readsObjectTypes: ["validation", "evidence"],
      },
      {
        surfaceId: "ed-release",
        name: "Release candidates and gates",
        question: "What is eligible to advance, and what stops it?",
        availability: "candidate",
        readsObjectTypes: ["deliverable-instance", "approval", "evidence"],
      },
      {
        surfaceId: "ed-reliability",
        name: "Environment state, reliability, and incidents",
        question: "Is the running system healthy, and what happened when it was not?",
        availability: "gated-future",
        readsObjectTypes: ["event", "risk"],
      },
    ],
    actionTypes: [
      "assigned-work",
      "review",
      "evidence-request",
      "dependency-resolution",
      "revalidation",
    ],
    decisionRights: [
      "Architecture decisions are recorded by the developer capacity and approved under governance.",
      "Release authority is not held by this workspace.",
    ],
    metrics: [
      {
        metricId: "ED-M1",
        name: "Implemented but unvalidated capabilities",
        questionAnswered: "What has been built without a validation record?",
        source: "Capability registry and evidence register",
        calculation:
          "Count of capabilities with an implementation record and no corresponding validation evidence.",
        freshness: "As current as both registers.",
        interpretation: "Work that cannot yet support a claim.",
        prohibitedInterpretation:
          "Not a defect rate, not developer throughput, and never a proportion of overall readiness.",
        actionTriggered: "Run the validation or record explicitly that the capability is unproven.",
      },
    ],
    evidenceRequirements: [
      "A test run is evidence. A test that exists but has not run is not.",
      "Release evidence must predate the release decision it supports.",
    ],
    notificationRules: ["Notify on validation failed, gate blocked, and handoff rejected."],
    searchDomains: [
      "work-items",
      "decisions",
      "deliverables",
      "evidence",
      "risks",
      "value-streams",
    ],
    dependencies: [
      "Value stream architecture",
      "Evidence contract",
      "Trust, Quality and Assurance",
    ],
    availability: "current",
    currentBoundary: `One operator building a private governed shell. ${NO_PII} No production deployment authority.`,
    futureBoundary:
      "Environments, incidents, and on-call operations open only when a real runtime exists.",
    accessibilityRequirements: SHARED_ACCESSIBILITY,
    reviewTrigger: "Any move toward a deployed runtime or a second contributor.",
    supersession: null,
    notes: "Implementation status never grants authority and never implies validation.",
  },
  {
    workspaceId: "market-growth",
    name: "Market and Growth",
    purpose: "Hold responsible external communication and every claim SSLS may legitimately make.",
    fundamentalQuestion:
      "Who needs SSLS, how do we responsibly communicate value, and what may we legitimately claim?",
    authorityState: "gated-future",
    implementationState: "specified-only",
    maturity: "S0",
    targetUsers: ["Future revenue and marketing leadership"],
    actingCapacities: ["chief-revenue-officer-preview"],
    requiredCapabilities: ["CAP-D08-001", "CAP-D01-002", "CAP-D06-001"],
    primaryValueStreams: ["opportunity-contract", "evidence-claim"],
    sharedObjectsUsed: ["claim", "evidence", "organization", "decision", "communication-reference"],
    allowedProjections: [
      "Claims governance with evidence links",
      "Synthetic opportunity reference records",
      "Message library bound to approved claims",
    ],
    prohibitedObjects: [
      "Live customer relationship data",
      "Real contact records of any person",
      "Any claim without a linked evidence record",
    ],
    minimumContextRequirements: [
      "Every claim shows its exact approved wording and the evidence supporting it.",
      "Synthetic pipeline records are labelled on every surface that displays them.",
    ],
    navigationItems: [
      {
        itemId: "mg-claims",
        label: "Claims and refused claims",
        route: "/boundaries",
        availability: "current",
      },
      {
        itemId: "mg-preview",
        label: "Workspace preview",
        route: null,
        availability: "gated-future",
      },
    ],
    primarySurfaces: [
      {
        surfaceId: "mg-claims",
        name: "Claims governance",
        question: "What exactly may SSLS say, and what evidence backs those words?",
        availability: "candidate",
        readsObjectTypes: ["claim", "evidence"],
      },
      {
        surfaceId: "mg-pipeline",
        name: "Pipeline and opportunities",
        question: "Which opportunities exist, and what has been promised?",
        availability: "gated-future",
        readsObjectTypes: ["organization", "decision"],
      },
    ],
    actionTypes: ["approval", "review", "commitment"],
    decisionRights: [
      "No external claim may be published without a recorded evidence link and approval.",
    ],
    metrics: [
      {
        metricId: "MG-M1",
        name: "Refused claims on the record",
        questionAnswered: "Which statements has SSLS explicitly declined to make?",
        source: "Claims register",
        calculation: "Count of claims with a refused posture.",
        freshness: "As current as the claims register.",
        interpretation: "A record of restraint that protects future credibility.",
        prohibitedInterpretation: "Not a backlog of claims waiting to be approved.",
        actionTriggered: "Review whether new evidence changes any refusal. Usually it does not.",
      },
    ],
    evidenceRequirements: [
      "A claim requires evidence bound to a specific version of the thing claimed.",
    ],
    notificationRules: [
      "Notify on claim expiry and commitment approaching. No campaign notifications.",
    ],
    searchDomains: ["organizations", "evidence", "decisions", "documentation"],
    dependencies: ["Evidence to Claim value stream", "Trust, Quality and Assurance"],
    availability: "gated-future",
    currentBoundary:
      "No live pipeline, no customer relationship system, no outbound communication.",
    futureBoundary:
      "Opens when SSLS has a released capability, approved claims, and a commercial authority.",
    accessibilityRequirements: SHARED_ACCESSIBILITY,
    reviewTrigger: "First approved external claim or first commercial conversation.",
    supersession: null,
    notes: "Marketing without claims governance is how organizations acquire liabilities.",
  },
  {
    workspaceId: "customer-implementation",
    name: "Customer and Implementation",
    purpose:
      "Describe how an organization would responsibly adopt, configure, learn, and gain value from SSLS.",
    fundamentalQuestion:
      "How do organizations responsibly adopt, configure, learn, stabilize, and gain value from SSLS?",
    authorityState: "gated-future",
    implementationState: "specified-only",
    maturity: "S0",
    targetUsers: ["Future customer success and implementation leadership"],
    actingCapacities: ["customer-success-leader-preview"],
    requiredCapabilities: ["CAP-D09-001", "CAP-D09-002", "CAP-D02-001"],
    primaryValueStreams: ["contract-implementation", "implementation-adoption", "adoption-outcome"],
    sharedObjectsUsed: [
      "organization",
      "organizational-unit",
      "work-item",
      "event",
      "evidence",
      "risk",
    ],
    allowedProjections: [
      "Synthetic customer organization reference records",
      "Implementation plan templates",
      "Adoption and outcome reference views",
    ],
    prohibitedObjects: [
      "Any real district, school, educator, or learner record",
      "Live integration credentials",
      "Support tickets containing personal data",
    ],
    minimumContextRequirements: [
      "Every organization shown is labelled synthetic.",
      "Small districts and low-incidence programs appear in the reference set, not as an exception.",
    ],
    navigationItems: [
      {
        itemId: "ci-preview",
        label: "Workspace preview",
        route: null,
        availability: "gated-future",
      },
    ],
    primarySurfaces: [
      {
        surfaceId: "ci-onboarding",
        name: "Implementation and onboarding plan",
        question: "What must happen, in what order, for an organization to adopt safely?",
        availability: "candidate",
        readsObjectTypes: ["work-item", "deliverable-type"],
      },
      {
        surfaceId: "ci-health",
        name: "Adoption and customer health",
        question: "Is this organization gaining value, and where is it struggling?",
        availability: "gated-future",
        readsObjectTypes: ["organization", "event", "risk"],
      },
    ],
    actionTypes: ["assigned-work", "commitment", "risk-action", "upcoming-event"],
    decisionRights: ["No customer commitment may be made without a recorded contract authority."],
    metrics: [
      {
        metricId: "CI-M1",
        name: "Implementation steps without an owner",
        questionAnswered: "Which planned adoption steps have nobody accountable?",
        source: "Implementation plan reference",
        calculation: "Count of plan steps with no owning function.",
        freshness: "As current as the plan reference.",
        interpretation: "Silent failure points in an adoption plan.",
        prohibitedInterpretation: "Not a customer health score and not a satisfaction proxy.",
        actionTriggered: "Assign an owning function or remove the step.",
      },
    ],
    evidenceRequirements: [
      "Outcome claims about a customer require evidence from that customer's context.",
    ],
    notificationRules: ["Notify on commitment approaching and critical risk only."],
    searchDomains: ["organizations", "work-items", "events", "risks", "documentation"],
    dependencies: ["Market and Growth", "Product and Learning Systems"],
    availability: "gated-future",
    currentBoundary:
      "No customers exist. Every record here is invented to test the projection architecture.",
    futureBoundary:
      "Opens at first pilot agreement, with a data protection review completed first.",
    accessibilityRequirements: SHARED_ACCESSIBILITY,
    reviewTrigger: "First pilot conversation with a real organization.",
    supersession: null,
    notes: "Adoption is a governed value stream, not a customer relationship dashboard.",
  },
  {
    workspaceId: "trust-quality-assurance",
    name: "Trust, Quality and Assurance",
    purpose:
      "Hold the stop authority: safety, accessibility, validity, security, privacy, and evidence integrity.",
    fundamentalQuestion:
      "Is SSLS safe, accessible, valid, secure, private, supportable, evidence-backed, and eligible to advance?",
    authorityState: "provisional-implementation",
    implementationState: "partially-implemented",
    maturity: "S1",
    targetUsers: ["Founder and developer operator", "Future assurance leadership"],
    actingCapacities: ["founder-developer", "trust-leader-preview"],
    requiredCapabilities: ["CAP-D06-001", "CAP-D07-001", "CAP-D06-002"],
    primaryValueStreams: ["build-validation", "validation-release", "ai-capability-lifecycle"],
    sharedObjectsUsed: [
      "finding",
      "risk",
      "evidence",
      "validation",
      "approval",
      "standard",
      "claim",
    ],
    allowedProjections: [
      "Open assurance findings that no other workspace may clear",
      "Accessibility, security, and privacy state on separate axes",
      "Release gate dispositions with stop conditions",
      "Independent review requirements",
    ],
    prohibitedObjects: ["Personal data", "Any assurance finding marked resolved without evidence"],
    minimumContextRequirements: [
      "A finding is cleared only by evidence, never by a delivery deadline.",
      "Independence requirements are shown wherever a builder would otherwise validate their own work.",
    ],
    navigationItems: [
      {
        itemId: "tq-findings",
        label: "Findings register",
        route: "/findings",
        availability: "current",
      },
      {
        itemId: "tq-evidence",
        label: "Evidence register",
        route: "/evidence",
        availability: "current",
      },
      {
        itemId: "tq-boundaries",
        label: "Refused claims",
        route: "/boundaries",
        availability: "current",
      },
    ],
    primarySurfaces: [
      {
        surfaceId: "tq-findings",
        name: "Open quality and assurance findings",
        question: "What is unresolved, and what does it stop?",
        availability: "current",
        readsObjectTypes: ["finding", "risk"],
      },
      {
        surfaceId: "tq-accessibility",
        name: "Accessibility state",
        question: "What has been checked, by what method, and what has never been tested?",
        availability: "current",
        readsObjectTypes: ["evidence", "standard", "validation"],
      },
      {
        surfaceId: "tq-ai-assurance",
        name: "AI assurance",
        question: "What would have to be true before any AI capability could be built?",
        availability: "gated-future",
        readsObjectTypes: ["policy-rule", "risk", "standard"],
      },
    ],
    actionTypes: [
      "unresolved-finding",
      "risk-action",
      "evidence-request",
      "review",
      "revalidation",
    ],
    decisionRights: [
      "This workspace may stop advancement. No other workspace may overrule that stop by asserting urgency.",
    ],
    metrics: [
      {
        metricId: "TQ-M1",
        name: "Assurance areas with no executed check",
        questionAnswered: "Where do we have no evidence at all?",
        source: "Evidence register",
        calculation: "Count of assurance subjects with no evidence record that has been executed.",
        freshness: "As current as the evidence register.",
        interpretation: "Areas where any claim of safety would be unsupported.",
        prohibitedInterpretation:
          "Not a risk score, not a conformance rating, and never a certification claim.",
        actionTriggered: "Plan the check or record the area as explicitly unverified.",
      },
    ],
    evidenceRequirements: [
      "Independent validation is required before any external conformance statement.",
      "Automated checks may support structural claims only.",
    ],
    notificationRules: [
      "Notify on validation failed, critical risk, evidence stale, and gate blocked.",
    ],
    searchDomains: ["findings", "risks", "evidence", "standards", "policies", "decisions"],
    dependencies: ["Engineering and Delivery", "Strategy and Governance"],
    availability: "current",
    currentBoundary: `Self-assessment only. No independent accessibility, security, or privacy validation has occurred. ${NO_PII}`,
    futureBoundary:
      "Independent review, certification, and vendor assurance require external parties and budget.",
    accessibilityRequirements: SHARED_ACCESSIBILITY,
    reviewTrigger: "Any proposed external claim, or any move toward real users.",
    supersession: null,
    notes:
      "Assurance findings survive a shipping deadline. That is the entire purpose of the workspace.",
  },
  {
    workspaceId: "enterprise-operations",
    name: "Enterprise Operations",
    purpose:
      "Describe how SSLS itself would operate across workforce, finance, legal, procurement, and systems.",
    fundamentalQuestion:
      "How does SSLS itself operate sustainably across workforce, finance, legal, procurement, systems, and organizational capability?",
    authorityState: "gated-future",
    implementationState: "specified-only",
    maturity: "S0",
    targetUsers: ["Future operations leadership"],
    actingCapacities: ["founder-developer"],
    requiredCapabilities: ["CAP-D10-001", "CAP-D11-001", "CAP-D12-001"],
    primaryValueStreams: ["hire-develop-retain", "vendor-lifecycle", "feedback-decision"],
    sharedObjectsUsed: ["role-reference", "organizational-unit", "decision", "risk", "work-item"],
    allowedProjections: [
      "Role architecture and staffing triggers",
      "Vendor and procurement reference records",
      "Organizational learning loops",
    ],
    prohibitedObjects: [
      "Any employee record",
      "Payroll, compensation, or performance data",
      "Live financial accounts",
      "Any productivity or activity measure about a person",
    ],
    minimumContextRequirements: [
      "Roles are reference architecture. None is staffed.",
      "Staffing triggers are stated as conditions, not as hiring plans.",
    ],
    navigationItems: [
      {
        itemId: "eo-preview",
        label: "Workspace preview",
        route: null,
        availability: "gated-future",
      },
    ],
    primarySurfaces: [
      {
        surfaceId: "eo-roles",
        name: "Role architecture and staffing triggers",
        question: "What condition would require SSLS to add a role?",
        availability: "candidate",
        readsObjectTypes: ["role-reference", "acting-capacity"],
      },
      {
        surfaceId: "eo-finance",
        name: "Finance, budget, and procurement",
        question: "What does the enterprise spend, owe, and commit?",
        availability: "gated-future",
        readsObjectTypes: ["decision", "organization"],
      },
    ],
    actionTypes: ["decision-needed", "commitment", "risk-action"],
    decisionRights: [
      "All operations decisions sit with the founder operator while SSLS is one person.",
    ],
    metrics: [
      {
        metricId: "EO-M1",
        name: "Capabilities dependent on an unstaffed role",
        questionAnswered:
          "Which capabilities cannot progress because nobody holds the required capacity?",
        source: "Capability registry and role architecture",
        calculation: "Count of capabilities whose required capacity has no active holder.",
        freshness: "As current as both registers.",
        interpretation: "A structural constraint on what SSLS can honestly attempt.",
        prohibitedInterpretation:
          "Not a hiring commitment and not a workload measure for any person.",
        actionTriggered: "Defer the capability, or record the staffing trigger as met.",
      },
    ],
    evidenceRequirements: ["A staffing trigger claimed as met requires a recorded decision."],
    notificationRules: ["Notify on decision needed only. No workforce notifications exist."],
    searchDomains: ["decisions", "risks", "organizations", "documentation"],
    dependencies: ["Strategy and Governance"],
    availability: "gated-future",
    currentBoundary:
      "SSLS is one person. There is no workforce, payroll, vendor, or finance system.",
    futureBoundary: "Opens at the first contracted person or the first material vendor commitment.",
    accessibilityRequirements: SHARED_ACCESSIBILITY,
    reviewTrigger: "First contractor, employee, or recurring vendor obligation.",
    supersession: null,
    notes:
      "Operational visibility here concerns capacity and obligations, never observation of people.",
  },
];
