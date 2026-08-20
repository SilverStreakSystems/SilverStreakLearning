/**
 * Derives the program-state projection from the controlling registers.
 *
 * There is no second truth plane. Gate state, work-package state, the latest
 * checkpoint, the latest attempt, the owner disposition, the bound
 * verifications, the audit execution state, and the state date are all
 * computed here from the decision, finding, evidence, and checkpoint
 * registers. Only genuinely non-derivable narrative — locators, refusal
 * statements, the publication boundary, and the next defensible action — comes
 * from the minimal policy record, and every one of those carries a source
 * identifier that must resolve in a controlling register or in a declared
 * repository locator.
 *
 * This module records nothing. It cannot open or close a gate, discharge a
 * finding, or authorize work.
 */
import type { DecisionRecord, EvidenceRecord, FindingRecord } from "@/domain";
import type {
  AttemptRecord,
  AuditExecutionRecord,
  BoundVerificationRecord,
  DeferredDebtRecord,
  ProgramStateRecord,
  SourceLocator,
  UnauthorizedStageRecord,
} from "@/domain/program-state";

export interface RawSourceLocator {
  record_id: string;
  locator: string;
  route: string | null;
}

export interface RawCheckpoint {
  checkpoint_id: string;
  title: string;
  completed_on: string;
  doc_path: string;
  outcome: string | null;
  closed_nothing: string | null;
  evidence_ids: string[];
}

export interface RawAttempt {
  attempt_id: string;
  title: string;
  attempted_on: string;
  state: string;
  doc_path: string;
  statement: string;
  produced_no_evidence: string;
  controlling_decision: string;
}

export interface RawCheckpointRegister {
  register_id: string;
  register_version: string;
  checkpoints: RawCheckpoint[];
  attempts: RawAttempt[];
}

export interface RawProgramPolicy {
  policy_id: string;
  policy_version: string;
  controlling_decision: string;
  gate: {
    gate_id: string;
    name: string;
    open_basis: string;
    closed_basis: string;
    source: RawSourceLocator;
    closure_phrases: string[];
  };
  active_work_package: {
    work_package_id: string;
    title: string;
    active_statement: string;
    closed_statement: string;
    source: RawSourceLocator;
    closure_phrases: string[];
  };
  owner_disposition_supporting_sources: RawSourceLocator[];
  unauthorized_stages: { stage_id: string; statement: string; source: RawSourceLocator }[];
  publication_boundary: string;
  next_defensible_owner_action: { action: string; why: string; source: RawSourceLocator };
  deferred_debt: { record_id: string; statement: string; locator: string; route: string | null }[];
}

export interface DerivationInputs {
  policy: RawProgramPolicy;
  checkpointRegister: RawCheckpointRegister;
  decisions: DecisionRecord[];
  findings: FindingRecord[];
  evidence: EvidenceRecord[];
  /** Identifier of the touch-target rule whose execution state is reported. */
  touchTargetRuleId: string;
  /** Finding that carries the unrun-verification obligation. */
  touchTargetFindingId: string;
}

function locator(raw: RawSourceLocator): SourceLocator {
  return { recordId: raw.record_id, locator: raw.locator, route: raw.route };
}

function byDateThenId<T extends { date: string; id: string }>(rows: T[]): T | null {
  if (rows.length === 0) return null;
  return (
    [...rows]
      .sort((a, b) => (a.date === b.date ? a.id.localeCompare(b.id) : a.date.localeCompare(b.date)))
      .at(-1) ?? null
  );
}

function mentionsAny(decision: DecisionRecord, phrases: string[]): boolean {
  const haystack = [decision.decision, ...decision.consequences].join(" ").toLowerCase();
  return phrases.some((phrase) => haystack.includes(phrase));
}

export function deriveProgramState(inputs: DerivationInputs): ProgramStateRecord {
  const { policy, checkpointRegister, decisions, findings, evidence } = inputs;

  const accepted = decisions.filter((decision) => decision.state === "accepted");

  const latestCheckpointRow =
    byDateThenId(
      checkpointRegister.checkpoints.map((row) => ({
        date: row.completed_on,
        id: row.checkpoint_id,
        row,
      })),
    )?.row ?? null;
  if (!latestCheckpointRow) throw new Error("checkpoint register carries no completed checkpoint");

  const latestAttemptRow =
    byDateThenId(
      checkpointRegister.attempts.map((row) => ({
        date: row.attempted_on,
        id: row.attempt_id,
        row,
      })),
    )?.row ?? null;

  const latestDecision =
    byDateThenId(accepted.map((row) => ({ date: row.decidedOn ?? "", id: row.id, row })))?.row ??
    null;
  if (!latestDecision) throw new Error("decision register carries no accepted decision");

  const gateClosed = accepted.some((decision) =>
    mentionsAny(decision, policy.gate.closure_phrases),
  );
  const workPackageClosed = accepted.some((decision) =>
    mentionsAny(decision, policy.active_work_package.closure_phrases),
  );

  const verifications: BoundVerificationRecord[] = latestCheckpointRow.evidence_ids.map((id) => {
    const record = evidence.find((entry) => entry.id === id);
    if (!record) throw new Error(`checkpoint evidence reference ${id} does not resolve`);
    return {
      verificationId: record.id,
      statement: record.supports,
      scope: record.doesNotSupport,
      boundTo: `${latestCheckpointRow.checkpoint_id}, ${latestCheckpointRow.completed_on}`,
      source: {
        recordId: record.id,
        locator: `src/fixtures/registers.ts — EVIDENCE, ${record.id}`,
        route: "/evidence",
      },
    };
  });

  const touchTargetFinding = findings.find((entry) => entry.id === inputs.touchTargetFindingId);
  if (!touchTargetFinding)
    throw new Error(`finding ${inputs.touchTargetFindingId} does not resolve`);
  const auditRun = touchTargetFinding.resolutionState === "confirmed";
  const auditExecution: AuditExecutionRecord = {
    ruleId: inputs.touchTargetRuleId,
    state: auditRun ? "RUN" : "NOT-RUN",
    statement: auditRun
      ? `${inputs.touchTargetRuleId} has been executed against the interface and the result is recorded.`
      : `${inputs.touchTargetRuleId} is defined and NOT-RUN. No route, component, or control has been measured or classified, so no target is PASS and no target is FAIL: every target is unmeasured. The partial runner in the repository produced no audit artifact and is not evidence.`,
    source: {
      recordId: touchTargetFinding.id,
      locator: `src/fixtures/registers.ts — FINDINGS, ${touchTargetFinding.id}`,
      route: "/findings",
    },
  };

  const latestAttempt: AttemptRecord | null = latestAttemptRow
    ? {
        attemptId: latestAttemptRow.attempt_id,
        title: latestAttemptRow.title,
        attemptedOn: latestAttemptRow.attempted_on,
        state: latestAttemptRow.state === "PARTIAL" ? "PARTIAL" : "ABORTED-DEFERRED",
        statement: latestAttemptRow.statement,
        producedNoEvidence: latestAttemptRow.produced_no_evidence,
        source: {
          recordId: latestAttemptRow.attempt_id,
          locator: latestAttemptRow.doc_path,
          route: null,
        },
      }
    : null;

  const unauthorizedStages: UnauthorizedStageRecord[] = policy.unauthorized_stages.map((stage) => ({
    stageId: stage.stage_id,
    statement: stage.statement,
    source: locator(stage.source),
  }));

  const deferredDebt: DeferredDebtRecord[] = policy.deferred_debt.map((row) => ({
    recordId: row.record_id,
    statement: row.statement,
    source: { recordId: row.record_id, locator: row.locator, route: row.route },
  }));

  const stateDate = [
    latestCheckpointRow.completed_on,
    latestAttemptRow?.attempted_on ?? "",
    latestDecision.decidedOn ?? "",
  ]
    .filter(Boolean)
    .sort()
    .at(-1) as string;

  return {
    stateDate,
    gate: {
      gateId: policy.gate.gate_id,
      name: policy.gate.name,
      state: gateClosed ? "closed" : "open",
      basis: gateClosed ? policy.gate.closed_basis : policy.gate.open_basis,
      source: locator(policy.gate.source),
    },
    activeWorkPackage: {
      workPackageId: policy.active_work_package.work_package_id,
      title: policy.active_work_package.title,
      state: workPackageClosed ? "closed-by-owner" : "active",
      statement: workPackageClosed
        ? policy.active_work_package.closed_statement
        : policy.active_work_package.active_statement,
      source: locator(policy.active_work_package.source),
    },
    latestCheckpoint: {
      checkpointId: latestCheckpointRow.checkpoint_id,
      title: latestCheckpointRow.title,
      completedOn: latestCheckpointRow.completed_on,
      outcome: latestCheckpointRow.outcome ?? latestCheckpointRow.title,
      closedNothing:
        latestCheckpointRow.closed_nothing ??
        "This checkpoint closed no gate and no work package. Only a recorded owner decision does that.",
      source: {
        recordId: latestCheckpointRow.checkpoint_id,
        locator: latestCheckpointRow.doc_path,
        route: null,
      },
    },
    latestAttempt,
    auditExecution,
    ownerDisposition: {
      subject: latestDecision.title,
      state: "accepted",
      requiredOf: latestDecision.decidedBy ?? "Founder / Operator",
      obligationSource: {
        recordId: latestDecision.id,
        locator: `src/fixtures/registers.ts — DECISIONS, ${latestDecision.id}`,
        route: "/decisions",
      },
      supportingSources: policy.owner_disposition_supporting_sources.map(locator),
    },
    verifications,
    unauthorizedStages,
    deferredDebt,
    publicationBoundary: policy.publication_boundary,
    nextDefensibleOwnerAction: {
      action: policy.next_defensible_owner_action.action,
      why: policy.next_defensible_owner_action.why,
      source: locator(policy.next_defensible_owner_action.source),
    },
  };
}
