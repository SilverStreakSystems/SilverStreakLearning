/**
 * Function identifiers for the existing 15-function workforce candidate.
 *
 * The function names themselves already exist in the capability architecture
 * (`ENTERPRISE_FUNCTIONS`) and are not rewritten here. This module adds stable
 * identifiers, capability-domain mapping, and role candidates so value streams
 * can name accountability without duplicating the taxonomy.
 *
 * Nothing here is staffed, budgeted, or authorized.
 */
import {
  ENTERPRISE_FUNCTIONS,
  type CapabilityDomainId,
  type EnterpriseFunction,
} from "../capability-architecture";

export const ENTERPRISE_FUNCTION_IDS = [
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

export type EnterpriseFunctionId = (typeof ENTERPRISE_FUNCTION_IDS)[number];

export interface EnterpriseFunctionMeta {
  id: EnterpriseFunctionId;
  /** The canonical name, taken from the capability architecture. */
  name: EnterpriseFunction;
  accountability: string;
  capabilityDomains: CapabilityDomainId[];
  accountableRoleCandidate: string;
  expertIcCandidate: string;
  /** Always false in the current boundary, so no view can imply staffing. */
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
    name: "Research and Intelligence",
    accountability: "Produce bounded research and hold the source and evidence record.",
    capabilityDomains: ["D02", "D12"],
    accountableRoleCandidate: "Head of Research",
    expertIcCandidate: "Research lead",
    staffed: false,
  },
  F03: {
    id: "F03",
    name: "Learning Design and Academics",
    accountability: "Keep what SSLS teaches and measures educationally sound.",
    capabilityDomains: ["D02"],
    accountableRoleCandidate: "Head of Learning Design",
    expertIcCandidate: "Curriculum and assessment specialist",
    staffed: false,
  },
  F04: {
    id: "F04",
    name: "Product and Learning Systems",
    accountability: "Own requirements, scope, and product decisions.",
    capabilityDomains: ["D03"],
    accountableRoleCandidate: "Head of Product",
    expertIcCandidate: "Principal product manager",
    staffed: false,
  },
  F05: {
    id: "F05",
    name: "Experience and Accessibility",
    accountability: "Own experience design and accessible interaction.",
    capabilityDomains: ["D03"],
    accountableRoleCandidate: "Head of Experience",
    expertIcCandidate: "Accessibility architect",
    staffed: false,
  },
  F06: {
    id: "F06",
    name: "Engineering and Delivery",
    accountability: "Build and operate the platform.",
    capabilityDomains: ["D04"],
    accountableRoleCandidate: "Head of Engineering",
    expertIcCandidate: "Principal engineer",
    staffed: false,
  },
  F07: {
    id: "F07",
    name: "Data and Measurement",
    accountability: "Own data models, measurement, and analysis integrity.",
    capabilityDomains: ["D05"],
    accountableRoleCandidate: "Head of Data",
    expertIcCandidate: "Analytics engineer",
    staffed: false,
  },
  F08: {
    id: "F08",
    name: "Trust, Quality and Assurance",
    accountability: "Determine independently whether an implementation meets its requirement.",
    capabilityDomains: ["D07"],
    accountableRoleCandidate: "Head of Quality and Assurance",
    expertIcCandidate: "Validation lead",
    staffed: false,
  },
  F09: {
    id: "F09",
    name: "Security and Privacy",
    accountability: "Protect people and data, and stop unsafe work.",
    capabilityDomains: ["D06"],
    accountableRoleCandidate: "Head of Security and Privacy",
    expertIcCandidate: "Privacy engineer",
    staffed: false,
  },
  F10: {
    id: "F10",
    name: "Revenue and Market",
    accountability: "Develop responsible commercial relationships.",
    capabilityDomains: ["D08"],
    accountableRoleCandidate: "Head of Revenue",
    expertIcCandidate: "Solutions consultant",
    staffed: false,
  },
  F11: {
    id: "F11",
    name: "Customer and Implementation",
    accountability: "Turn contracted scope into working, understood practice.",
    capabilityDomains: ["D09"],
    accountableRoleCandidate: "Head of Implementation",
    expertIcCandidate: "Implementation architect",
    staffed: false,
  },
  F12: {
    id: "F12",
    name: "Support and Service",
    accountability: "Sustain use, surface barriers, and resolve customer problems.",
    capabilityDomains: ["D09"],
    accountableRoleCandidate: "Head of Support",
    expertIcCandidate: "Support escalation lead",
    staffed: false,
  },
  F13: {
    id: "F13",
    name: "Finance and Legal",
    accountability: "Own contracts, obligations, spend, and legal exposure.",
    capabilityDomains: ["D10"],
    accountableRoleCandidate: "Head of Finance and Legal",
    expertIcCandidate: "Contracts specialist",
    staffed: false,
  },
  F14: {
    id: "F14",
    name: "Enterprise Operations",
    accountability: "Run the operating rhythm and govern third-party dependencies.",
    capabilityDomains: ["D10", "D12"],
    accountableRoleCandidate: "Head of Operations",
    expertIcCandidate: "Vendor governance lead",
    staffed: false,
  },
  F15: {
    id: "F15",
    name: "People and Organizational Learning",
    accountability:
      "Staff and sustain the capabilities the enterprise needs, and close learning loops.",
    capabilityDomains: ["D11", "D12"],
    accountableRoleCandidate: "Head of People",
    expertIcCandidate: "Workforce planning lead",
    staffed: false,
  },
};

/** Guards that the identifier map stays aligned with the canonical name list. */
export const FUNCTION_NAMES_ALIGNED: boolean = ENTERPRISE_FUNCTION_IDS.every((id) =>
  (ENTERPRISE_FUNCTIONS as readonly string[]).includes(ENTERPRISE_FUNCTION_META[id].name),
);

export function functionName(id: EnterpriseFunctionId): string {
  return ENTERPRISE_FUNCTION_META[id].name;
}
