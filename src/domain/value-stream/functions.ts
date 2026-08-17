/**
 * Candidate 15-function workforce architecture.
 *
 * No prior function taxonomy existed in the repository. This list is declared
 * here as a candidate so value streams can name accountability without
 * inventing role folders. Nothing here is staffed, budgeted, or authorized.
 */
import type { CapabilityDomainId } from "../capability-architecture";

export const ENTERPRISE_FUNCTIONS = [
  "F01",
  "F02",
  "F03",
  "F04",
  "F05",
  "F06",
  "F07",
  "F08",
  "F09",
  "F10",
  "F11",
  "F12",
  "F13",
  "F14",
  "F15",
] as const;

export type EnterpriseFunctionId = (typeof ENTERPRISE_FUNCTIONS)[number];

export interface EnterpriseFunctionMeta {
  id: EnterpriseFunctionId;
  name: string;
  /** What this function is accountable for, in one sentence. */
  accountability: string;
  /** Capability domains this function primarily serves. */
  capabilityDomains: CapabilityDomainId[];
  /** Role names are candidates, not job postings and not staffed positions. */
  accountableRoleCandidate: string;
  expertIcCandidate: string;
  /** Always false in the current boundary. Kept explicit so no view can imply otherwise. */
  staffed: false;
}

export const ENTERPRISE_FUNCTION_META: Record<EnterpriseFunctionId, EnterpriseFunctionMeta> = {
  F01: {
    id: "F01",
    name: "Strategy and Governance",
    accountability: "Decide direction, authority, and what SSLS is allowed to claim.",
    capabilityDomains: ["D01"],
    accountableRoleCandidate: "Head of Strategy and Governance",
    expertIcCandidate: "Governance architect",
    staffed: false,
  },
  F02: {
    id: "F02",
    name: "Research and Evidence",
    accountability: "Produce bounded research and hold the evidence record.",
    capabilityDomains: ["D02", "D12"],
    accountableRoleCandidate: "Head of Research",
    expertIcCandidate: "Research lead",
    staffed: false,
  },
  F03: {
    id: "F03",
    name: "Learning and Educational Validity",
    accountability: "Keep what SSLS teaches and measures educationally sound.",
    capabilityDomains: ["D02"],
    accountableRoleCandidate: "Head of Learning",
    expertIcCandidate: "Curriculum and assessment specialist",
    staffed: false,
  },
  F04: {
    id: "F04",
    name: "Product Management",
    accountability: "Own requirements, scope, and product decisions.",
    capabilityDomains: ["D03"],
    accountableRoleCandidate: "Head of Product",
    expertIcCandidate: "Principal product manager",
    staffed: false,
  },
  F05: {
    id: "F05",
    name: "Design and Accessibility",
    accountability: "Own experience design and accessible interaction.",
    capabilityDomains: ["D03"],
    accountableRoleCandidate: "Head of Design",
    expertIcCandidate: "Accessibility architect",
    staffed: false,
  },
  F06: {
    id: "F06",
    name: "Engineering",
    accountability: "Build and operate the platform.",
    capabilityDomains: ["D04"],
    accountableRoleCandidate: "Head of Engineering",
    expertIcCandidate: "Principal engineer",
    staffed: false,
  },
  F07: {
    id: "F07",
    name: "Data and Analytics",
    accountability: "Own data models, measurement, and analysis integrity.",
    capabilityDomains: ["D05"],
    accountableRoleCandidate: "Head of Data",
    expertIcCandidate: "Analytics engineer",
    staffed: false,
  },
  F08: {
    id: "F08",
    name: "Trust, Security and Privacy",
    accountability: "Protect people and data, and stop unsafe work.",
    capabilityDomains: ["D06"],
    accountableRoleCandidate: "Head of Trust",
    expertIcCandidate: "Security and privacy lead",
    staffed: false,
  },
  F09: {
    id: "F09",
    name: "Quality and Validation",
    accountability: "Determine whether an implementation actually satisfies its requirement.",
    capabilityDomains: ["D07"],
    accountableRoleCandidate: "Head of Quality",
    expertIcCandidate: "Validation lead",
    staffed: false,
  },
  F10: {
    id: "F10",
    name: "Revenue and Partnerships",
    accountability: "Develop responsible commercial relationships.",
    capabilityDomains: ["D08"],
    accountableRoleCandidate: "Head of Revenue",
    expertIcCandidate: "Solutions consultant",
    staffed: false,
  },
  F11: {
    id: "F11",
    name: "Implementation and Professional Learning",
    accountability: "Turn contracted scope into working, understood practice.",
    capabilityDomains: ["D09"],
    accountableRoleCandidate: "Head of Implementation",
    expertIcCandidate: "Implementation architect",
    staffed: false,
  },
  F12: {
    id: "F12",
    name: "Customer Success and Support",
    accountability: "Sustain use, surface barriers, and resolve customer problems.",
    capabilityDomains: ["D09"],
    accountableRoleCandidate: "Head of Customer Success",
    expertIcCandidate: "Support escalation lead",
    staffed: false,
  },
  F13: {
    id: "F13",
    name: "Finance, Legal and Compliance",
    accountability: "Own contracts, obligations, spend, and legal exposure.",
    capabilityDomains: ["D10"],
    accountableRoleCandidate: "Head of Finance and Legal",
    expertIcCandidate: "Contracts specialist",
    staffed: false,
  },
  F14: {
    id: "F14",
    name: "People and Workforce",
    accountability: "Staff and sustain the capabilities the enterprise needs.",
    capabilityDomains: ["D11"],
    accountableRoleCandidate: "Head of People",
    expertIcCandidate: "Workforce planning lead",
    staffed: false,
  },
  F15: {
    id: "F15",
    name: "Enterprise Operations and Vendors",
    accountability: "Run the operating rhythm and govern third-party dependencies.",
    capabilityDomains: ["D10", "D12"],
    accountableRoleCandidate: "Head of Operations",
    expertIcCandidate: "Vendor governance lead",
    staffed: false,
  },
};

export function functionName(id: EnterpriseFunctionId): string {
  return ENTERPRISE_FUNCTION_META[id].name;
}
