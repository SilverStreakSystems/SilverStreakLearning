import type { ArchitectureLayer } from "@/domain";

/** Section 8: composition layers from primitive value to product experience. */
export const EXPERIENCE_ARCHITECTURE_LAYERS: ArchitectureLayer[] = [
  {
    layerId: "EXL-1",
    name: "Design tokens",
    responsibility: "Primitive visual values held in one governed place.",
    examples: ["Color", "Type", "Spacing", "Radius", "Motion", "Grid"],
  },
  {
    layerId: "EXL-2",
    name: "Primitives",
    responsibility: "Atomic interface units.",
    examples: ["Text", "Icon", "Button", "Input", "Divider"],
  },
  {
    layerId: "EXL-3",
    name: "Components",
    responsibility: "Reusable assemblies over primitives.",
    examples: ["Card", "Status", "Table", "Toolbar", "Context chip"],
  },
  {
    layerId: "EXL-4",
    name: "Patterns",
    responsibility: "Interaction grammar shared across surfaces.",
    examples: ["Search and filter", "Approval", "Compare", "History", "Review"],
  },
  {
    layerId: "EXL-5",
    name: "Page templates",
    responsibility: "Reusable page anatomy.",
    examples: ["Registry", "Detail", "Planner", "Dashboard", "Context package"],
  },
  {
    layerId: "EXL-6",
    name: "Workspace templates",
    responsibility: "Collaborative environment around a body of work.",
    examples: ["Governance", "Research", "Engineering", "Implementation"],
  },
  {
    layerId: "EXL-7",
    name: "Role and capacity projection",
    responsibility:
      "What a person may see and do in context. A different projection is not a second truth.",
    examples: ["Founder", "Teacher", "Specialist", "Leader", "Student", "Family"],
  },
  {
    layerId: "EXL-8",
    name: "Product experience",
    responsibility: "Composition of templates over governed objects.",
    examples: ["Silver Streak Learning", "Future ecosystem products"],
  },
];
