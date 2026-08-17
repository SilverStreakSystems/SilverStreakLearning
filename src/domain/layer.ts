import type { AuthorityClass, RecordState } from "./authority";

/**
 * Foundation layers. The labels L0 through L7 are preserved exactly as issued.
 * Note: L0–L7 is eight labels described as a "seven-layer" classification.
 * That discrepancy is recorded as governance finding FND-001 rather than
 * silently renumbered here.
 */
export const LAYER_IDS = ["L0", "L1", "L2", "L3", "L4", "L5", "L6", "L7"] as const;

export type LayerId = (typeof LAYER_IDS)[number];

export interface FoundationLayer {
  id: LayerId;
  name: string;
  purpose: string;
  /** Declared status of the layer as a whole. */
  declaredState: RecordState;
  declaredAuthority: AuthorityClass;
  /** What must happen before the layer as a whole can be promoted. */
  promotionRequirement: string;
}
