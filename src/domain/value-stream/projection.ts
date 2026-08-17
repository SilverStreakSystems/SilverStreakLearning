/**
 * Command Center projection contracts.
 *
 * These are read contracts over shared governed objects, prepared so later
 * surfaces do not invent new sources of truth. Defining a projection confers
 * no authority, creates no dashboard, and does not make any workspace active.
 */
import type { SharedObjectTypeId } from "../shared-object/object-types";

export const PROJECTION_SURFACES = [
  "enterprise-command-center",
  "function-command-center",
  "manager-view",
  "individual-action-center",
  "cross-functional-program-view",
] as const;

export type ProjectionSurface = (typeof PROJECTION_SURFACES)[number];

export const PROJECTION_SURFACE_LABEL: Record<ProjectionSurface, string> = {
  "enterprise-command-center": "Enterprise Command Center",
  "function-command-center": "Function Command Center",
  "manager-view": "Manager view",
  "individual-action-center": "Individual Action Center",
  "cross-functional-program-view": "Cross-functional program view",
};

export interface ProjectionPanel {
  panelId: string;
  question: string;
  /** Canonical object types the panel reads. It never owns them. */
  sourceObjects: SharedObjectTypeId[];
  /** What must never be inferred from this panel. */
  prohibitedInference: string;
}

export interface ProjectionContract {
  surface: ProjectionSurface;
  purpose: string;
  audience: string;
  panels: ProjectionPanel[];
  /** Always true: a projection reflects, it never governs. */
  readOnlyProjection: true;
  /** Always false in the current boundary. */
  active: false;
  authorityNote: string;
}

export const PROJECTION_RULES = [
  "A projection reads canonical objects; it never stores a second copy of them.",
  "A projection may not create a status that does not exist on a governed object.",
  "A projection may not blend independent axes into one score.",
  "Defining a projection contract does not authorize building the surface.",
] as const;
