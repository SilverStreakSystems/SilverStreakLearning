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
  type LearningLoopRepository,
  type ReadOutcome,
} from "./repository";
import { liveContext, type CommandContext } from "./context";
import type { CommandResult } from "./commands";

export type StoreStatus =
  | "loading"
  | "empty"
  | "ready"
  | "corrupt"
  | "unsupported-version"
  | "unavailable";

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
  /** Atomically replaces everything with the deterministic synthetic dataset. */
  restoreDemoData: () => RunOutcome<unknown>;
  /** Atomically replaces everything with an imported document. */
  replaceAll: (next: LearningLoopDocument) => RunOutcome<unknown>;
  exportText: () => string | null;
  /** The stored text exactly as saved, for rescuing unreadable data. */
  rawText: () => string | null;
  parseImport: typeof parseDocumentText;
  dismissProblem: () => void;
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

  useEffect(() => {
    if (!repository.available && repository.kind === "in-memory")
      setFallbackNotice(
        "This browser is not allowing local storage, so this session is being held in memory only. Nothing here will survive a reload.",
      );
    else if (repository.ephemeral)
      setFallbackNotice(
        "This session is being held in memory only. Nothing here will survive a reload.",
      );

    const outcome = repository.read();
    setStatus(statusFromRead(outcome));
    if (outcome.status === "ready") {
      setDocument(outcome.document);
      setReadProblem(null);
      return;
    }
    setDocument(null);
    setReadProblem(outcome.status === "empty" ? null : outcome.message);
  }, [repository]);

  /** One place where a proposed document becomes a persisted document. */
  const commit = useCallback(
    (expectedRevision: number | null, next: LearningLoopDocument, at: string): CommitOutcome => {
      const outcome = repository.commit(expectedRevision, next, at);
      if (outcome.status === "ok") {
        setDocument(outcome.document);
        setStatus("ready");
        setProblem(null);
        return outcome;
      }
      // A conflict means the interface is stale: show what is actually stored.
      if (outcome.status === "conflict") {
        const fresh = repository.read();
        setStatus(statusFromRead(fresh));
        setDocument(fresh.status === "ready" ? fresh.document : null);
        if (fresh.status !== "ready" && fresh.status !== "empty") setReadProblem(fresh.message);
      }
      setProblem(problemFromCommit(outcome));
      return outcome;
    },
    [repository],
  );

  const run = useCallback(
    <T,>(command: CommandRunner<T>): RunOutcome<T> => {
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

  /** Destructive replacement is expected to overwrite, so it expects whatever is there. */
  const replaceAll = useCallback(
    (next: LearningLoopDocument): RunOutcome<unknown> => {
      const context = contextFactory();
      const current = repository.read();
      const expected = current.status === "ready" ? current.document.revision : null;
      const outcome = commit(expected, next, context.now);
      if (outcome.status !== "ok")
        return { ok: false, value: null, problem: problemFromCommit(outcome) };
      return { ok: true, value: { document: outcome.document }, problem: null };
    },
    [commit, contextFactory, repository],
  );

  const restoreDemoData = useCallback(
    () => replaceAll(createSeedDocument()),
    [replaceAll],
  );

  const exportText = useCallback(() => (document ? serializeDocument(document) : null), [document]);
  const rawText = useCallback(() => repository.readRaw(), [repository]);
  const dismissProblem = useCallback(() => setProblem(null), []);

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
      restoreDemoData,
      replaceAll,
      exportText,
      rawText,
      parseImport: parseDocumentText,
      dismissProblem,
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
      restoreDemoData,
      replaceAll,
      exportText,
      rawText,
      dismissProblem,
    ],
  );
}
