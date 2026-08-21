/**
 * Route registry. Single source of truth for navigation and for the route
 * coverage tests. Adding a route means adding it here.
 */
/**
 * Navigation groups. The product preview is listed first and separately from
 * the governance workspace so the two are never mistaken for each other: one
 * is a working synthetic product surface, the other is the record of how this
 * repository is governed.
 */
export const NAV_GROUPS = [
  { id: "product", label: "Learning Loop — Synthetic Preview" },
  { id: "governance", label: "Governance workspace" },
] as const;

export type NavGroupId = (typeof NAV_GROUPS)[number]["id"];

export interface RouteEntry {
  /** TanStack route path. */
  path: string;
  /** Navigation label. Plain language, no unexplained abbreviations. */
  label: string;
  /** What the route answers, in one sentence. */
  purpose: string;
  /** The single H1 rendered by the route. */
  heading: string;
  /** Which navigation group the route belongs to. */
  group: NavGroupId;
}

export const ROUTE_REGISTRY: RouteEntry[] = [
  {
    path: "/learners",
    label: "Learners",
    purpose:
      "The synthetic learning loop: what was seen, what was tried, what it showed, and what to do next.",
    heading: "Learners",
    group: "product",
  },
  {
    path: "/",
    label: "Command Center",
    purpose: "What is true right now, what is open, and what to do next.",
    heading: "Command Center",
    group: "governance",
  },
  {
    path: "/foundation-map",
    label: "Foundation Map",
    purpose: "How the foundation layers stack, and what sits in each one.",
    heading: "Foundation Map",
    group: "governance",
  },
  {
    path: "/authority",
    label: "Authority",
    purpose: "Which artifacts govern, and which only describe or propose.",
    heading: "Authority Ledger",
    group: "governance",
  },
  {
    path: "/capabilities",
    label: "Capabilities",
    purpose:
      "Candidate enterprise capabilities across twelve domains, and what each would require.",
    heading: "Enterprise Capability Architecture (Candidate)",
    group: "governance",
  },
  {
    path: "/objects",
    label: "Shared Objects",
    purpose:
      "The governed objects, relationships, states, and context contracts everything else will reuse.",
    heading: "Shared Enterprise Object Architecture (Candidate)",
    group: "governance",
  },
  {
    path: "/value-streams",
    label: "Value Streams",
    purpose: "How work moves end to end, where it is gated, and where it is refused.",
    heading: "Enterprise Value Stream Architecture (Candidate)",
    group: "governance",
  },
  {
    path: "/traceability",
    label: "Traceability",
    purpose: "How requirements connect to evidence and claims.",
    heading: "Traceability",
    group: "governance",
  },
  {
    path: "/findings",
    label: "Findings",
    purpose: "Open problems, ambiguities, and conflicts that are on the record.",
    heading: "Findings Register",
    group: "governance",
  },
  {
    path: "/evidence",
    label: "Evidence",
    purpose: "What has actually been checked, and what has not.",
    heading: "Evidence Register",
    group: "governance",
  },
  {
    path: "/decisions",
    label: "Decisions",
    purpose: "What has been decided, what is pending, and what is required.",
    heading: "Decisions Register",
    group: "governance",
  },
  {
    path: "/future-architecture",
    label: "Future Architecture",
    purpose: "Target-state workspaces held behind a governance gate.",
    heading: "Future Architecture",
    group: "governance",
  },
  {
    path: "/design-system",
    label: "Design System",
    purpose:
      "Tokens, brand assets, the coordinate grid, and the interface templates every surface is built from.",
    heading: "Brand Visual System and Experience Template Architecture v0.1",
    group: "governance",
  },
  {
    path: "/workspaces",
    label: "Workspaces",
    purpose:
      "The nine enterprise workspaces, their acting capacities, and the gates holding the rest closed.",
    heading: "Enterprise Workspaces",
    group: "governance",
  },
  {
    path: "/actions",
    label: "Action Center",
    purpose: "Every obligation currently owed, projected from the registers that record them.",
    heading: "Action Center",
    group: "governance",
  },
  {
    path: "/search",
    label: "Search",
    purpose: "Find any authorized governed record without leaking what is withheld.",
    heading: "Universal Search",
    group: "governance",
  },
  {
    path: "/notifications",
    label: "Notifications",
    purpose: "States where a human owes a response or must know that work has stopped.",
    heading: "Notifications",
    group: "governance",
  },
  {
    path: "/profile",
    label: "Profile and Capacity",
    purpose: "Who is acting, in what capacity, and what that capacity may not do alone.",
    heading: "Profile and Acting Capacity",
    group: "governance",
  },
  {
    path: "/help",
    label: "Knowledge and Help",
    purpose:
      "Definitions and procedures, with governing policy kept separate from explanatory help.",
    heading: "Knowledge and Help",
    group: "governance",
  },
  {
    path: "/technology-decisions",
    label: "Technology Decisions",
    purpose:
      "Role-first planning: for each analyzed workflow, the minimum effective solution, including no new technology at all.",
    heading: "Role-First Technology Decisions",
    group: "governance",
  },
  {
    path: "/boundaries",
    label: "Settings and Boundaries",
    purpose: "The authorized posture of this workspace and the claims it refuses.",
    heading: "Settings and Boundaries",
    group: "governance",
  },
];
