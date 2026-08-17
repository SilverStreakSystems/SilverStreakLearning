/**
 * Global utilities.
 *
 * Utilities sit beside the workspaces rather than inside any one of them,
 * because an obligation, a search, or a capacity is not the property of a
 * department.
 */
import type { WorkspaceAvailability } from "./workspace";

export const GLOBAL_UTILITY_IDS = [
  "action-center",
  "universal-search",
  "notifications",
  "my-workspaces",
  "knowledge-help",
  "profile-capacity",
] as const;

export type GlobalUtilityId = (typeof GLOBAL_UTILITY_IDS)[number];

export interface GlobalUtilityContract {
  utilityId: GlobalUtilityId;
  name: string;
  purpose: string;
  question: string;
  route: string;
  availability: WorkspaceAvailability;
  /** Canonical objects read. A utility owns no records of its own. */
  readsCanonicalObjects: string[];
  createsCanonicalObjects: never[];
  boundary: string;
  accessibilityRequirements: string[];
  notes: string;
}

/** Knowledge and help content, kept explicitly separate from governing policy. */
export const HELP_CONTENT_KINDS = [
  "governing-policy",
  "governing-standard",
  "procedure",
  "definition",
  "object-help",
  "workflow-help",
  "boundary-statement",
  "explanatory-help",
] as const;

export type HelpContentKind = (typeof HELP_CONTENT_KINDS)[number];

export const HELP_CONTENT_KIND_META: Record<
  HelpContentKind,
  { label: string; governs: boolean }
> = {
  "governing-policy": { label: "Governing policy", governs: true },
  "governing-standard": { label: "Governing standard", governs: true },
  procedure: { label: "Procedure", governs: true },
  definition: { label: "Definition", governs: false },
  "object-help": { label: "Object help", governs: false },
  "workflow-help": { label: "Workflow help", governs: false },
  "boundary-statement": { label: "Current boundary", governs: true },
  "explanatory-help": { label: "Explanatory help", governs: false },
};

export interface HelpEntry {
  entryId: string;
  kind: HelpContentKind;
  title: string;
  body: string;
  source: string;
  authorityClass: string;
  version: string;
  effectiveState: "effective" | "draft" | "superseded" | "withdrawn";
  supersededBy: string | null;
  route: string | null;
}

export function governsWork(entry: HelpEntry): boolean {
  return HELP_CONTENT_KIND_META[entry.kind].governs && entry.effectiveState === "effective";
}
