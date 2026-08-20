/**
 * Route registry. Single source of truth for navigation and for the route
 * coverage tests. Adding a route means adding it here.
 */
export interface RouteEntry {
  /** TanStack route path. */
  path: string;
  /** Navigation label. Plain language, no unexplained abbreviations. */
  label: string;
  /** What the route answers, in one sentence. */
  purpose: string;
  /** The single H1 rendered by the route. */
  heading: string;
}

export const ROUTE_REGISTRY: RouteEntry[] = [
  {
    path: "/",
    label: "Command Center",
    purpose: "What is true right now, what is open, and what to do next.",
    heading: "Command Center",
  },
  {
    path: "/foundation-map",
    label: "Foundation Map",
    purpose: "How the foundation layers stack, and what sits in each one.",
    heading: "Foundation Map",
  },
  {
    path: "/authority",
    label: "Authority",
    purpose: "Which artifacts govern, and which only describe or propose.",
    heading: "Authority Ledger",
  },
  {
    path: "/capabilities",
    label: "Capabilities",
    purpose:
      "Candidate enterprise capabilities across twelve domains, and what each would require.",
    heading: "Enterprise Capability Architecture (Candidate)",
  },
  {
    path: "/objects",
    label: "Shared Objects",
    purpose:
      "The governed objects, relationships, states, and context contracts everything else will reuse.",
    heading: "Shared Enterprise Object Architecture (Candidate)",
  },
  {
    path: "/value-streams",
    label: "Value Streams",
    purpose: "How work moves end to end, where it is gated, and where it is refused.",
    heading: "Enterprise Value Stream Architecture (Candidate)",
  },
  {
    path: "/traceability",
    label: "Traceability",
    purpose: "How requirements connect to evidence and claims.",
    heading: "Traceability",
  },
  {
    path: "/findings",
    label: "Findings",
    purpose: "Open problems, ambiguities, and conflicts that are on the record.",
    heading: "Findings Register",
  },
  {
    path: "/evidence",
    label: "Evidence",
    purpose: "What has actually been checked, and what has not.",
    heading: "Evidence Register",
  },
  {
    path: "/decisions",
    label: "Decisions",
    purpose: "What has been decided, what is pending, and what is required.",
    heading: "Decisions Register",
  },
  {
    path: "/future-architecture",
    label: "Future Architecture",
    purpose: "Target-state workspaces held behind a governance gate.",
    heading: "Future Architecture",
  },
  {
    path: "/design-system",
    label: "Design System",
    purpose:
      "Tokens, brand assets, the coordinate grid, and the interface templates every surface is built from.",
    heading: "Brand Visual System and Experience Template Architecture v0.1",
  },
  {
    path: "/workspaces",
    label: "Workspaces",
    purpose:
      "The nine enterprise workspaces, their acting capacities, and the gates holding the rest closed.",
    heading: "Enterprise Workspaces",
  },
  {
    path: "/actions",
    label: "Action Center",
    purpose: "Every obligation currently owed, projected from the registers that record them.",
    heading: "Action Center",
  },
  {
    path: "/search",
    label: "Search",
    purpose: "Find any authorized governed record without leaking what is withheld.",
    heading: "Universal Search",
  },
  {
    path: "/notifications",
    label: "Notifications",
    purpose: "States where a human owes a response or must know that work has stopped.",
    heading: "Notifications",
  },
  {
    path: "/profile",
    label: "Profile and Capacity",
    purpose: "Who is acting, in what capacity, and what that capacity may not do alone.",
    heading: "Profile and Acting Capacity",
  },
  {
    path: "/help",
    label: "Knowledge and Help",
    purpose:
      "Definitions and procedures, with governing policy kept separate from explanatory help.",
    heading: "Knowledge and Help",
  },
  {
    path: "/boundaries",
    label: "Settings and Boundaries",
    purpose: "The authorized posture of this workspace and the claims it refuses.",
    heading: "Settings and Boundaries",
  },
];
