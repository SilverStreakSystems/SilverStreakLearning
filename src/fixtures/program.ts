import policy from "../../data/program/program-policy.json";
import checkpointRegister from "../../data/program/checkpoints.json";

import { deriveProgramState } from "@/domain/program-state-derivation";
import type { RawCheckpointRegister, RawProgramPolicy } from "@/domain/program-state-derivation";
import type { ProgramStateRecord } from "@/domain/program-state";
import { DECISIONS, EVIDENCE, FINDINGS } from "@/fixtures/registers";

/**
 * The in-application program-state projection.
 *
 * DERIVED. Nothing is restated here. Every value is computed by
 * `deriveProgramState` from the controlling decision, finding, evidence, and
 * checkpoint registers, plus the minimal non-derivable policy record at
 * `data/program/program-policy.json`. No component, fixture, or document can
 * override those controlling records: changing this projection requires
 * changing the register it reads.
 */
export const PROGRAM_STATE: ProgramStateRecord = deriveProgramState({
  policy: policy as unknown as RawProgramPolicy,
  checkpointRegister: checkpointRegister as unknown as RawCheckpointRegister,
  decisions: DECISIONS,
  findings: FINDINGS,
  evidence: EVIDENCE,
  touchTargetRuleId: "TTR-001",
  touchTargetFindingId: "FND-024",
});
