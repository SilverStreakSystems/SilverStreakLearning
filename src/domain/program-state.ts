/**
 * Canonical structured projection of the program's current governed state.
 *
 * This module defines the SHAPE only. The record itself lives in
 * `src/fixtures/program.ts` and is the single in-application source for gate
 * state, active work package, latest checkpoint, pending owner disposition,
 * and the explicitly unauthorized next stage. Route components read it; they
 * never restate any of it.
 *
 * Nothing here closes a gate, closes a work package, records a disposition, or
 * upgrades authority. Every field carries the locator of the canonical record
 * it reports, so any statement on a surface can be traced back to its source.
 */

export type GateState = "open" | "closed";
export type WorkPackageState = "active" | "closed-by-owner" | "not-authorized";
export type DispositionState = "pending" | "accepted" | "declined";

export interface SourceLocator {
  /** Canonical identifier, for example `DEC-018`, `FND-020`, `CHECKPOINT-003`. */
  recordId: string;
  /** Repository path or register locator. Never fabricated. */
  locator: string;
  /** In-application route that shows the owning register, when one exists. */
  route: string | null;
}

export interface GateStateRecord {
  gateId: string;
  name: string;
  state: GateState;
  basis: string;
  source: SourceLocator;
}

export interface WorkPackageStateRecord {
  workPackageId: string;
  title: string;
  state: WorkPackageState;
  statement: string;
  source: SourceLocator;
}

export interface CheckpointRecord {
  checkpointId: string;
  title: string;
  completedOn: string;
  /** What the cycle did, stated without closure language. */
  outcome: string;
  /** Stated plainly so a completed cycle is never read as a closed package. */
  closedNothing: string;
  source: SourceLocator;
}

export interface OwnerDispositionRecord {
  subject: string;
  state: DispositionState;
  requiredOf: string;
  /** The canonical obligation record this pending disposition is carried on. */
  obligationSource: SourceLocator;
  /** Supporting locators an owner needs before deciding. */
  supportingSources: SourceLocator[];
}

/** Commit- or checkpoint-bound verification. Never a standing global claim. */
export interface BoundVerificationRecord {
  verificationId: string;
  statement: string;
  /** Exactly what the statement covers. */
  scope: string;
  /** The checkpoint or commit the statement is bound to. */
  boundTo: string;
  source: SourceLocator;
}

export interface UnauthorizedStageRecord {
  stageId: string;
  statement: string;
  source: SourceLocator;
}

/**
 * An execution attempt that produced no evidence. Never a checkpoint, never a
 * result, never a conformance basis.
 */
export interface AttemptRecord {
  attemptId: string;
  title: string;
  attemptedOn: string;
  state: "ABORTED-DEFERRED" | "PARTIAL";
  statement: string;
  /** Stated plainly so an attempt is never read as execution evidence. */
  producedNoEvidence: string;
  source: SourceLocator;
}

/** Execution state of a defined verification protocol. */
export interface AuditExecutionRecord {
  ruleId: string;
  state: "NOT-RUN" | "RUN";
  statement: string;
  source: SourceLocator;
}

export interface DeferredDebtRecord {
  recordId: string;
  statement: string;
  source: SourceLocator;
}

export interface ProgramStateRecord {
  stateDate: string;
  gate: GateStateRecord;
  activeWorkPackage: WorkPackageStateRecord;
  latestCheckpoint: CheckpointRecord;
  /** The most recent attempt that produced no evidence, when one exists. */
  latestAttempt: AttemptRecord | null;
  auditExecution: AuditExecutionRecord;
  ownerDisposition: OwnerDispositionRecord;
  verifications: BoundVerificationRecord[];
  unauthorizedStages: UnauthorizedStageRecord[];
  deferredDebt: DeferredDebtRecord[];
  /** What hosting the application does and does not mean. */
  publicationBoundary: string;
  /** The single next action the current posture permits the owner to take. */
  nextDefensibleOwnerAction: {
    action: string;
    why: string;
    source: SourceLocator;
  };
}

/**
 * Statements the program-state record may never make. Enforced by test.
 */
export const PROHIBITED_PROGRAM_STATE_CLAIMS = [
  "production ready",
  "district validated",
  "independently validated",
  "certified",
  "release authorized",
  "compliance conformance",
  "wp-039 is authorized",
] as const;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Structural invariants only. Returns violation strings; empty means the record
 * is internally consistent. It asserts nothing about the truth of the state.
 */
export function validateProgramState(record: ProgramStateRecord): string[] {
  const problems: string[] = [];

  if (!ISO_DATE.test(record.stateDate)) problems.push("malformed state date");
  if (!ISO_DATE.test(record.latestCheckpoint.completedOn))
    problems.push("malformed checkpoint completion date");

  const locators: SourceLocator[] = [
    record.gate.source,
    record.activeWorkPackage.source,
    record.latestCheckpoint.source,
    record.ownerDisposition.obligationSource,
    ...record.ownerDisposition.supportingSources,
    ...record.verifications.map((entry) => entry.source),
    ...record.unauthorizedStages.map((entry) => entry.source),
    record.nextDefensibleOwnerAction.source,
  ];
  for (const locator of locators) {
    if (!locator.recordId.trim()) problems.push("a source locator has no record id");
    if (!locator.locator.trim()) problems.push(`${locator.recordId}: empty locator`);
  }

  for (const verification of record.verifications) {
    if (!verification.boundTo.trim())
      problems.push(
        `${verification.verificationId}: verification is not bound to a checkpoint or commit`,
      );
    if (!verification.scope.trim())
      problems.push(`${verification.verificationId}: verification scope must be stated`);
  }

  const haystack = JSON.stringify(record).toLowerCase();
  for (const claim of PROHIBITED_PROGRAM_STATE_CLAIMS) {
    const index = haystack.indexOf(claim);
    if (index === -1) continue;
    const window = haystack.slice(Math.max(0, index - 90), index);
    if (!/(does not|never|no |not |neither )[^.]*$/.test(window))
      problems.push(`prohibited claim phrasing "${claim}" is not refused`);
  }

  return problems;
}
