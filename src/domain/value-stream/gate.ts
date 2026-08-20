/**
 * Stage gate model.
 *
 * A gate is a deliberate decision point with a named owner and a recorded
 * disposition. Silence is never passage, and an average across axes never
 * overrides a stop condition.
 */
import type { EnterpriseFunctionId } from "./functions";

export const GATE_DISPOSITIONS = [
  "pass",
  "pass-with-non-blocking-findings",
  "hold",
  "blocked",
  "refused",
  "revise",
  "not-applicable",
] as const;

export type GateDisposition = (typeof GATE_DISPOSITIONS)[number];

export interface GateDispositionMeta {
  id: GateDisposition;
  label: string;
  /** Text marker so status never depends on colour alone. */
  marker: string;
  meaning: string;
  allowsAdvance: boolean;
}

export const GATE_DISPOSITION_META: Record<GateDisposition, GateDispositionMeta> = {
  pass: {
    id: "pass",
    label: "Pass",
    marker: "[PASS]",
    meaning: "Entry criteria met, required evidence present, no stop condition triggered.",
    allowsAdvance: true,
  },
  "pass-with-non-blocking-findings": {
    id: "pass-with-non-blocking-findings",
    label: "Pass with non-blocking findings",
    marker: "[PASS+F]",
    meaning: "Advance permitted, with named findings carried forward and owned.",
    allowsAdvance: true,
  },
  hold: {
    id: "hold",
    label: "Hold",
    marker: "[HOLD]",
    meaning: "Paused pending a specific missing input. Not a failure.",
    allowsAdvance: false,
  },
  blocked: {
    id: "blocked",
    label: "Blocked",
    marker: "[BLOCK]",
    meaning: "An unmet dependency outside this stage prevents review.",
    allowsAdvance: false,
  },
  refused: {
    id: "refused",
    label: "Refused",
    marker: "[REFUSED]",
    meaning: "Governance declined to advance this work. A legitimate outcome.",
    allowsAdvance: false,
  },
  revise: {
    id: "revise",
    label: "Revise",
    marker: "[REVISE]",
    meaning: "Return to the originating stage with named corrections.",
    allowsAdvance: false,
  },
  "not-applicable": {
    id: "not-applicable",
    label: "Not applicable",
    marker: "[N/A]",
    meaning: "Explicitly recorded as out of scope for this instance, with a reason.",
    allowsAdvance: true,
  },
};

export interface ValueStreamGate {
  gateId: string;
  valueStreamId: string;
  stageId: string;
  name: string;
  purpose: string;
  entryCriteria: string[];
  requiredDeliverables: string[];
  requiredEvidence: string[];
  owner: EnterpriseFunctionId;
  reviewers: EnterpriseFunctionId[];
  /** Conditions that force a stop regardless of any other assessment. */
  stopConditions: string[];
  /** Who may accept residual risk, when residual risk is acceptable at all. */
  residualRiskAuthority: EnterpriseFunctionId | null;
  dispositionOptions: GateDisposition[];
  exitCriteria: string[];
  auditRequirement: string;
  nextStageId: string | null;
  /** Worked synthetic example so refusal and hold are visible, not theoretical. */
  exampleDisposition: GateDisposition;
  exampleRationale: string;
}

export function gateAllowsAdvance(disposition: GateDisposition): boolean {
  return GATE_DISPOSITION_META[disposition].allowsAdvance;
}

export type GateViolationKind =
  "missing-stop-conditions" | "missing-required-evidence" | "disposition-set-too-narrow";

export interface GateViolation {
  gateId: string;
  kind: GateViolationKind;
  detail: string;
}

export function validateGates(gates: ValueStreamGate[]): GateViolation[] {
  const violations: GateViolation[] = [];
  for (const gate of gates) {
    if (gate.stopConditions.length === 0) {
      violations.push({
        gateId: gate.gateId,
        kind: "missing-stop-conditions",
        detail: "A gate with no stop condition cannot stop anything.",
      });
    }
    if (gate.requiredEvidence.length === 0) {
      violations.push({
        gateId: gate.gateId,
        kind: "missing-required-evidence",
        detail: "A gate that requires no evidence is a formality.",
      });
    }
    const blocking = gate.dispositionOptions.filter((d) => !gateAllowsAdvance(d));
    if (blocking.length === 0) {
      violations.push({
        gateId: gate.gateId,
        kind: "disposition-set-too-narrow",
        detail: "No disposition available that would stop the work.",
      });
    }
  }
  return violations;
}
