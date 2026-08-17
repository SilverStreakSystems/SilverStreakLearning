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
    purpose: "Candidate enterprise capabilities across twelve domains, and what each would require.",
    heading: "Enterprise Capability Architecture (Candidate)",
  },
  {
    path: "/objects",
    label: "Shared Objects",
    purpose: "The governed objects, relationships, states, and context contracts everything else will reuse.",
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
    purpose: "Tokens, brand assets, the coordinate grid, and the interface templates every surface is built from.",
    heading: "Brand Visual System and Experience Template Architecture v0.1",
  },
  {
    path: "/boundaries",
    label: "Settings and Boundaries",
    purpose: "The authorized posture of this workspace and the claims it refuses.",
    heading: "Settings and Boundaries",
  },
];

