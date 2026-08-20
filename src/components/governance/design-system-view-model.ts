/**
 * View model for the design system command surface.
 *
 * Search shape, defaults, and validated parsing live here rather than in the
 * component module so the component module exports components only. Moving
 * them changes no behaviour: the same constants, the same defaults, and the
 * same parser are re-used unchanged by the routes and the component module.
 */
import { TEMPLATE_MATURITY_META, type TemplateMaturity } from "@/domain";

export const DESIGN_SYSTEM_VIEWS = [
  { id: "overview", label: "Overview" },
  { id: "tokens", label: "Tokens" },
  { id: "typography", label: "Typography" },
  { id: "grid", label: "Grid and coordinates" },
  { id: "assets", label: "Brand assets" },
  { id: "templates", label: "Interface templates" },
  { id: "workspaces", label: "Workspace templates" },
  { id: "families", label: "Experience families" },
  { id: "blueprints", label: "Blueprints" },
  { id: "states", label: "States" },
  { id: "motion", label: "Motion and responsive" },
  { id: "accessibility", label: "Accessibility" },
  { id: "conformance", label: "Conformance" },
] as const;

export type DesignSystemView = (typeof DESIGN_SYSTEM_VIEWS)[number]["id"];

export interface DesignSystemSearch {
  view: DesignSystemView;
  maturity: TemplateMaturity | "all";
  q: string;
}

export const DEFAULT_DESIGN_SYSTEM_SEARCH: DesignSystemSearch = {
  view: "overview",
  maturity: "all",
  q: "",
};

const VIEW_IDS = DESIGN_SYSTEM_VIEWS.map((view) => view.id) as readonly string[];

export function parseDesignSystemSearch(input: Record<string, unknown>): DesignSystemSearch {
  const rawView = input["view"];
  const rawMaturity = input["maturity"];
  const rawQuery = input["q"];
  const view =
    typeof rawView === "string" && VIEW_IDS.includes(rawView)
      ? (rawView as DesignSystemView)
      : "overview";
  const maturity =
    typeof rawMaturity === "string" && rawMaturity in TEMPLATE_MATURITY_META
      ? (rawMaturity as TemplateMaturity)
      : "all";
  const q = typeof rawQuery === "string" ? rawQuery : "";
  return { view, maturity, q };
}
