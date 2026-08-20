/**
 * The single client-side entry point to product data.
 *
 * Storage is browser-local, so the document must not be read during server
 * render: the first render is deliberately "loading" on both server and client,
 * and hydration happens in an effect. That avoids a hydration mismatch and
 * avoids pretending data exists before it has been read.
 *
 * Nothing here decides what a change means. Commands are pure functions that
 * are handed the current document; this hook only sequences read, command,
 * commit, and the reporting of a structured outcome. Unreadable data is never
 * silently overwritten, and a refused write leaves the interface showing the
 * document that is actually stored.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  createSeedDocument,
  parseDocumentText,
  serializeDocument,
  type InvariantProblem,
  type LearningLoopDocument,
  type SchemaProblem,
} from "@/domain/learning-loop";
import {
  BrowserLearningLoopRepository,
  InMemoryLearningLoopRepository,
  type CommitOutcome,
  type ExpectationOutcome,
  type LearningLoopRepository,
  type RawOutcome,
  type ReadOutcome,
  type RecoveryExpectation,
} from "./repository";

import { liveContext, type CommandContext } from "./context";
import type { CommandResult } from "./commands";

export type StoreStatus =
  "loading" | "empty" | "ready" | "corrupt" | "unsupported-version" | "unavailable";

export interface StoreProblem {
  /** What the person reading the screen needs to know. */
  message: string;
  /** Record-level detail, when the refusal came from validation. */
  details: string[];
  kind: "refused" | "conflict" | "storage" | "precondition";
}

export type CommandRunner<T> = (
  document: LearningLoopDocument,
  context: CommandContext,
) => CommandResult<T>;

/**
 * Which stored snapshot the screen is actually representing.
 *
 * A destructive action is decided against what the person can see. Comparing a
 * freshly captured expectation against the displayed revision alone is not
 * enough: a screen showing corrupt or newer-schema bytes has no revision, so a
 * revision-only check would silently pass while another tab had already
 * recovered that data to a valid document the operator never saw. The exact
 * stored bytes and the displayed status are both recorded here.
 */
export interface DisplayedSnapshot {
  status: StoreStatus;
  revision: number | null;
  /** Exact stored bytes behind what is on screen, or null for nothing stored. */
  token: string | null;
}

export interface RunOutcome<T> {
  ok: boolean;
  /** Present only when the command succeeded and the write was accepted. */
  value: (T & { document: LearningLoopDocument }) | null;
  problem: StoreProblem | null;
}

export interface LearningLoopStore {
  status: StoreStatus;
  document: LearningLoopDocument | null;
  /** The revision the interface is currently showing, for concurrency checks. */
  revision: number | null;
  /** Why the stored data could not be read. The data was left untouched. */
  readProblem: string | null;
  /** The most recent refused write, conflict, or storage failure. */
  problem: StoreProblem | null;
  storageKind: LearningLoopRepository["kind"];
  /** True when nothing written in this session will survive a reload. */
  ephemeral: boolean;
  /** Set when browser storage was unusable and memory is standing in for it. */
  fallbackNotice: string | null;
  run: <T>(command: CommandRunner<T>) => RunOutcome<T>;
  /**
   * What the stored value looks like right now, captured when a destructive
   * confirmation opens and handed back on confirm so a stale panel cannot
   * overwrite a change made in another tab meanwhile.
   *
   * It is a structured outcome on purpose. A storage read that failed is not
   * "no expectation": collapsing the two would let a destructive replacement
   * proceed with no concurrency protection at all.
   */
  captureExpectation: () => ExpectationOutcome;
  /** Which stored snapshot the screen is representing right now. */
  displayed: DisplayedSnapshot | null;
  /**
   * True only when a freshly captured expectation is byte-for-byte the snapshot
   * the screen is representing. Every destructive action asks this before it
   * opens a confirmation, for every displayed status, so an unseen change made
   * in another tab can never be replaced from a stale screen.
   */
  showsCaptured: (captured: ExpectationOutcome) => boolean;
  /** Atomically replaces everything with the deterministic synthetic dataset. */
  restoreDemoData: (expected: RecoveryExpectation) => RunOutcome<unknown>;
  /** Atomically replaces everything with an imported document. */
  replaceAll: (next: LearningLoopDocument, expected: RecoveryExpectation) => RunOutcome<unknown>;
  /**
   * The first write into empty storage. This is an ordinary commit expecting no
   * document, not a destructive replacement, so it needs no captured
   * expectation: if anything is stored meanwhile the commit conflicts.
   */
  seedInitialData: () => RunOutcome<unknown>;
  /** A valid canonical document, or null. Never corrupt or newer-schema bytes. */
  exportText: () => string | null;
  /** The stored text exactly as saved, for rescuing unreadable data. */
  rawText: () => RawOutcome;
  /** The single recovery copy kept from the last destructive replace. */
  backupText: () => RawOutcome;

  /**
   * Re-reads the stored value into the interface. Used when a destructive
   * action finds that what is on screen is older than what is stored: the
   * action is refused and the person is shown the current records instead.
   */
  refresh: () => void;

  parseImport: typeof parseDocumentText;
  dismissProblem: () => void;
  /**
   * Records a refusal decided in the interface rather than by a command, so it
   * survives any re-render of the panel that raised it.
   */
  reportConflict: (message: string) => void;
}

function describeProblems(schema: SchemaProblem[], invariants: InvariantProblem[]): string[] {
  return [
    ...schema.map((row) => `${row.path}: ${row.message}`),
    ...invariants.map((row) => row.message),
  ].slice(0, 6);
}

function problemFromCommit(outcome: CommitOutcome): StoreProblem | null {
  switch (outcome.status) {
    case "ok":
      return null;
    case "conflict":
      return { message: outcome.message, details: [], kind: "conflict" };
    case "invalid":
      return {
        message: outcome.message,
        details: describeProblems(outcome.schemaProblems, outcome.invariantProblems),
        kind: "refused",
      };
    default:
      return { message: outcome.message, details: [], kind: "storage" };
  }
}

function statusFromRead(outcome: ReadOutcome): StoreStatus {
  return outcome.status === "ready" ? "ready" : outcome.status;
}

export function useLearningLoop(
  repositoryFactory?: () => LearningLoopRepository,
  contextFactory: () => CommandContext = liveContext,
): LearningLoopStore {
  const repositoryRef = useRef<LearningLoopRepository | null>(null);
  const [fallbackNotice, setFallbackNotice] = useState<string | null>(null);

  if (repositoryRef.current === null) {
    if (repositoryFactory) {
      repositoryRef.current = repositoryFactory();
    } else {
      const browser = new BrowserLearningLoopRepository();
      // Falling back to memory keeps the workflow usable and says so plainly,
      // rather than presenting a working interface that quietly loses data.
      repositoryRef.current = browser.available ? browser : new InMemoryLearningLoopRepository();
    }
  }
  const repository = repositoryRef.current;

  const [document, setDocument] = useState<LearningLoopDocument | null>(null);
  const [status, setStatus] = useState<StoreStatus>("loading");
  const [readProblem, setReadProblem] = useState<string | null>(null);
  const [problem, setProblem] = useState<StoreProblem | null>(null);
  const [displayed, setDisplayed] = useState<DisplayedSnapshot | null>(null);

  /**
   * Reads the stored value once and makes the interface show exactly that
   * snapshot, recording which snapshot is on screen. Every path that changes
   * what is displayed goes through here, so the displayed identity can never
   * drift from the displayed content.
   */
  const load = useCallback((): ReadOutcome => {
    const captured = repository.expectation();
    if (captured.status !== "ok") {
      setStatus("unavailable");
      setDocument(null);
      setReadProblem(captured.message);
      setDisplayed(null);
      return { status: "unavailable", message: captured.message };
    }
    const outcome = captured.read;
    const next = statusFromRead(outcome);
    setStatus(next);
    setDocument(outcome.status === "ready" ? outcome.document : null);
    setReadProblem(
      outcome.status === "ready" || outcome.status === "empty" ? null : outcome.message,
    );
    setDisplayed({
      status: next,
      revision: outcome.status === "ready" ? outcome.document.revision : null,
      token: captured.expectation.token,
    });
    return outcome;
  }, [repository]);

  useEffect(() => {
    if (!repository.available && repository.kind === "in-memory")
      setFallbackNotice(
        "This browser is not allowing local storage, so this session is being held in memory only. Nothing here will survive a reload.",
      );
    else if (repository.ephemeral)
      setFallbackNotice(
        "This session is being held in memory only. Nothing here will survive a reload.",
      );

    load();
  }, [load, repository]);

  /** One place where a proposed document becomes a persisted document. */
  const commit = useCallback(
    (expectedRevision: number | null, next: LearningLoopDocument, at: string): CommitOutcome => {
      const outcome = repository.commit(expectedRevision, next, at);
      if (outcome.status === "ok") {
        // Re-read so the displayed identity is the stored identity, not a guess.
        load();
        setProblem(null);
        return outcome;
      }
      // A conflict means the interface is stale: show what is actually stored.
      if (outcome.status === "conflict") load();
      setProblem(problemFromCommit(outcome));
      return outcome;
    },
    [load, repository],
  );

  const run = useCallback(
    <T>(command: CommandRunner<T>): RunOutcome<T> => {
      if (!document) {
        const stale: StoreProblem = {
          message: "There is nothing loaded to change yet.",
          details: [],
          kind: "precondition",
        };
        setProblem(stale);
        return { ok: false, value: null, problem: stale };
      }
      const context = contextFactory();
      const result = command(document, context);
      if (!result.ok) {
        // A refused precondition must not advance the revision.
        const refused: StoreProblem = {
          message: result.message,
          details: [],
          kind: "precondition",
        };
        setProblem(refused);
        return { ok: false, value: null, problem: refused };
      }
      // A byte-identical result is not a change. It must not write and must
      // not advance the revision, or the record would claim an edit happened.
      if (serializeDocument(result.document) === serializeDocument(document)) {
        const noop: StoreProblem = {
          message: "Nothing changed, so nothing was saved.",
          details: [],
          kind: "precondition",
        };
        setProblem(noop);
        return { ok: false, value: null, problem: noop };
      }
      const outcome = commit(document.revision, result.document, context.now);
      if (outcome.status !== "ok")
        return { ok: false, value: null, problem: problemFromCommit(outcome) };
      const { ok: _ok, document: _document, ...rest } = result;
      return {
        ok: true,
        value: { ...(rest as T), document: outcome.document },
        problem: null,
      };
    },
    [commit, contextFactory, document],
  );

  /**
   * Destructive replacement, only ever reached after an explicit confirmation.
   *
   * It goes through the repository's recovery transaction rather than `commit`,
   * because `commit` is right to refuse corrupt or newer-schema stored data and
   * that refusal would otherwise make unreadable data impossible to recover
   * from inside the product. Failure changes nothing.
   */
  const replaceAll = useCallback(
    (next: LearningLoopDocument, expected: RecoveryExpectation): RunOutcome<unknown> => {
      const context = contextFactory();
      const outcome = repository.recover(next, context.now, expected);
      if (outcome.status !== "ok") {
        setProblem(problemFromCommit(outcome));
        return { ok: false, value: null, problem: problemFromCommit(outcome) };
      }
      load();
      setProblem(null);
      return { ok: true, value: { document: outcome.document }, problem: null };
    },
    [contextFactory, load, repository],
  );

  const restoreDemoData = useCallback(
    (expected: RecoveryExpectation) => replaceAll(createSeedDocument(), expected),
    [replaceAll],
  );

  /**
   * Seeding empty storage is an ordinary first commit expecting no document.
   * If anything was written meanwhile the commit conflicts and nothing is lost.
   */
  const seedInitialData = useCallback((): RunOutcome<unknown> => {
    const context = contextFactory();
    const outcome = commit(null, createSeedDocument(), context.now);
    if (outcome.status !== "ok")
      return { ok: false, value: null, problem: problemFromCommit(outcome) };
    return { ok: true, value: { document: outcome.document }, problem: null };
  }, [commit, contextFactory]);

  const captureExpectation = useCallback(
    (): ExpectationOutcome => repository.expectation(),
    [repository],
  );

  const refresh = useCallback(() => {
    load();
  }, [load]);

  /**
   * Fails closed by construction: anything other than an exact match between
   * the captured snapshot and the snapshot on screen is a mismatch, including
   * an unavailable capture and a screen that has not loaded a snapshot yet.
   */
  const showsCaptured = useCallback(
    (captured: ExpectationOutcome): boolean => {
      if (captured.status !== "ok" || displayed === null) return false;
      const capturedStatus = statusFromRead(captured.read);
      const capturedRevision =
        captured.read.status === "ready" ? captured.read.document.revision : null;
      return (
        capturedStatus === displayed.status &&
        capturedRevision === displayed.revision &&
        captured.expectation.token === displayed.token
      );
    },
    [displayed],
  );

  const exportText = useCallback(() => (document ? serializeDocument(document) : null), [document]);
  const rawText = useCallback(() => repository.readRaw(), [repository]);
  const backupText = useCallback(() => repository.readBackup(), [repository]);
  const dismissProblem = useCallback(() => setProblem(null), []);

  const reportConflict = useCallback(
    (message: string) => setProblem({ message, details: [], kind: "conflict" }),
    [],
  );

  return useMemo(
    () => ({
      status,
      document,
      revision: document?.revision ?? null,
      readProblem,
      problem,
      storageKind: repository.kind,
      ephemeral: repository.ephemeral,
      fallbackNotice,
      run,
      captureExpectation,
      displayed,
      showsCaptured,
      restoreDemoData,
      replaceAll,
      seedInitialData,
      exportText,
      rawText,
      backupText,
      refresh,
      parseImport: parseDocumentText,
      dismissProblem,
      reportConflict,
    }),
    [
      status,
      document,
      readProblem,
      problem,
      repository.kind,
      repository.ephemeral,
      fallbackNotice,
      run,
      captureExpectation,
      displayed,
      showsCaptured,
      restoreDemoData,
      replaceAll,
      seedInitialData,
      exportText,
      rawText,
      backupText,
      refresh,
      dismissProblem,
      reportConflict,
    ],
  );
}
