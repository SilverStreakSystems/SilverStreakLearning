import type { FoundationLayer } from "@/domain";

export const FOUNDATION_LAYERS: FoundationLayer[] = [
  {
    id: "L0",
    name: "Core Beliefs Doctrine",
    purpose: "Human and educational philosophy that everything else must answer to.",
    declaredState: "candidate",
    declaredAuthority: "research-candidate",
    promotionRequirement:
      "Governed promotion by the operator, with the doctrine text recorded as an approved artifact.",
  },
  {
    id: "L1",
    name: "Enterprise Governance and Cross-Cutting Standards",
    purpose:
      "Authority, evidence, accessibility, language access, privacy, security, responsible AI, claims, source governance, workforce equity, and change control.",
    declaredState: "current",
    declaredAuthority: "approved-authority",
    promotionRequirement:
      "Each standard is promoted individually. Layer status reflects only the standards already adopted.",
  },
  {
    id: "L2",
    name: "Enterprise Capability Architecture",
    purpose: "The durable bridge between principles and organizational or product implementation.",
    declaredState: "candidate",
    declaredAuthority: "research-candidate",
    promotionRequirement:
      "A complete capability registry, reviewed against doctrine and standards, then accepted by decision record.",
  },
  {
    id: "L3",
    name: "Enterprise Operating Model",
    purpose:
      "Target-state workspaces, value streams, shared enterprise primitives, and organizational operations.",
    declaredState: "candidate",
    declaredAuthority: "gated-future",
    promotionRequirement: "Depends on a promoted capability architecture at L2.",
  },
  {
    id: "L4",
    name: "Product Family and Domain Architecture",
    purpose:
      "Bounded products, modules, domains, shared services, interoperability, adoption modes, and product responsibilities.",
    declaredState: "candidate",
    declaredAuthority: "research-candidate",
    promotionRequirement: "Product boundaries reviewed against capability ownership at L2.",
  },
  {
    id: "L5",
    name: "Knowledge and Educational Systems Architecture",
    purpose:
      "Standards, curriculum, learning science, language development, assessment, and professional practice knowledge.",
    declaredState: "candidate",
    declaredAuthority: "research-candidate",
    promotionRequirement: "Educational validity review recorded as evidence before promotion.",
  },
  {
    id: "L6",
    name: "Shared Technical and Governance Platform",
    purpose:
      "Identity, authorization, purpose, relationship, provenance, audit, evidence, search, context assembly, work and events, notifications, files, integration, localization, and accessibility infrastructure.",
    declaredState: "candidate",
    declaredAuthority: "provisional-implementation",
    promotionRequirement:
      "Bounded proof implementations are recorded as provisional until a platform decision record is accepted.",
  },
  {
    id: "L7",
    name: "Implementation, Validation, Release, and Operations",
    purpose:
      "Versioned implementation, migrations, tests, validation, findings, evidence, releases, incidents, operations, and claims.",
    declaredState: "current",
    declaredAuthority: "current-summary",
    promotionRequirement:
      "Reports state only. This layer never grants authority to the work it describes.",
  },
];
