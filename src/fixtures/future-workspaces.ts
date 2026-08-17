import { FUTURE_GATE_NOTICE, type FutureWorkspace } from "@/domain";

const gate = (
  id: string,
  name: string,
  intent: string,
  candidateCapabilities: string[],
  promotionRequirement: string,
): FutureWorkspace => ({
  id,
  name,
  intent,
  candidateCapabilities,
  promotionRequirement,
  authorityClass: "gated-future",
  gateNotice: FUTURE_GATE_NOTICE,
});

export const FUTURE_WORKSPACES: FutureWorkspace[] = [
  gate(
    "WS-01",
    "Command Center",
    "One place to see current truth, open decisions, and the next defensible action across the enterprise.",
    ["CAP-001", "CAP-002"],
    "A promoted capability architecture defines what the center is allowed to summarize.",
  ),
  gate(
    "WS-02",
    "Strategy and Governance",
    "Hold doctrine, standards, authority, and claims, and govern their promotion.",
    ["CAP-001", "CAP-013"],
    "Doctrine at L0 must be recorded and promoted first.",
  ),
  gate(
    "WS-03",
    "Research and Intelligence",
    "Gather and hold research material without letting it act as decision.",
    ["CAP-003", "CAP-004"],
    "A research governance procedure must be accepted by decision record.",
  ),
  gate(
    "WS-04",
    "Product and Learning Systems",
    "Design products and learning systems against educational validity and access requirements.",
    ["CAP-004", "CAP-005", "CAP-006", "CAP-010"],
    "Product and domain architecture at L4 must move beyond research material.",
  ),
  gate(
    "WS-05",
    "Engineering and Delivery",
    "Build, change, and operate software safely and reversibly.",
    ["CAP-011", "CAP-008"],
    "A platform decision record must replace the current provisional implementations.",
  ),
  gate(
    "WS-06",
    "Market and Growth",
    "Reach districts with claims that are traceable to evidence.",
    ["CAP-013"],
    "A claims register with an evidence link for every supported claim.",
  ),
  gate(
    "WS-07",
    "Customer and Implementation",
    "Move districts from agreement to working, configured, supported use.",
    ["CAP-014", "CAP-015"],
    "A first pilot district must be authorized, which the current posture excludes.",
  ),
  gate(
    "WS-08",
    "Trust, Quality and Assurance",
    "Independently validate work, hold evidence, and govern responsible AI.",
    ["CAP-002", "CAP-007", "CAP-009", "CAP-012"],
    "Independence of validation from delivery must be structurally possible.",
  ),
  gate(
    "WS-09",
    "Enterprise Operations",
    "Run workforce, finance, and the operating rhythm that sustains everything else.",
    ["CAP-016", "CAP-017"],
    "An organization larger than one person.",
  ),
];
