/**
 * The single client-side entry point to product data.
 *
 * Storage is browser-local, so the document must not be read during server
 * render: the first render is deliberately "not loaded yet" on both server and
 * client, and hydration happens in an effect. That avoids a hydration mismatch
 * and avoids pretending data exists before it has been read.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  createSeedDocument,
  parseDocumentText,
  serializeDocument,
  type LearningLoopDocument,
} from "@/domain/learning-loop";
import {
  BrowserLearningLoopRepository,
  type LearningLoopRepository,
  type WriteResult,
} from "./repository";

export type LoadState = "loading" | "empty" | "ready" | "unreadable";

export interface LearningLoopStore {
  state: LoadState;
  document: LearningLoopDocument | null;
  /** Set when stored data could not be read; the data was left untouched. */
  storageProblem: string | null;
  /** Set by the most recent rejected write. */
  writeProblem: string | null;
  storageKind: LearningLoopRepository["kind"];
  storageAvailable: boolean;
  seed: () => void;
  reset: () => void;
  apply: (
    change: (document: LearningLoopDocument, now: string) => LearningLoopDocument,
  ) => WriteResult | null;
  replace: (next: LearningLoopDocument) => WriteResult | null;
  exportText: () => string | null;
  parseImport: typeof parseDocumentText;
  clearWriteProblem: () => void;
}

export function useLearningLoop(
  repositoryFactory?: () => LearningLoopRepository,
): LearningLoopStore {
  const repositoryRef = useRef<LearningLoopRepository | null>(null);
  if (repositoryRef.current === null) {
    repositoryRef.current = repositoryFactory
      ? repositoryFactory()
      : new BrowserLearningLoopRepository();
  }
  const repository = repositoryRef.current;

  const [document, setDocument] = useState<LearningLoopDocument | null>(null);
  const [state, setState] = useState<LoadState>("loading");
  const [storageProblem, setStorageProblem] = useState<string | null>(null);
  const [writeProblem, setWriteProblem] = useState<string | null>(null);

  useEffect(() => {
    const loaded = repository.read();
    if (loaded) {
      setDocument(loaded);
      setState("ready");
      return;
    }
    const problem =
      repository instanceof BrowserLearningLoopRepository ? repository.readError : null;
    if (problem) {
      setStorageProblem(problem);
      setState("unreadable");
      return;
    }
    setState("empty");
  }, [repository]);

  const commit = useCallback(
    (next: LearningLoopDocument): WriteResult => {
      const result = repository.write(next, new Date().toISOString());
      if (result.ok) {
        setDocument(result.document);
        setState("ready");
        setWriteProblem(null);
      } else {
        setWriteProblem(
          [result.message, ...result.problems.slice(0, 3).map((row) => row.message)].join(" "),
        );
      }
      return result;
    },
    [repository],
  );

  const seed = useCallback(() => {
    commit(createSeedDocument());
  }, [commit]);

  const reset = useCallback(() => {
    repository.clear();
    setDocument(null);
    setStorageProblem(null);
    setWriteProblem(null);
    setState("empty");
  }, [repository]);

  const apply = useCallback(
    (change: (document: LearningLoopDocument, now: string) => LearningLoopDocument) => {
      if (!document) return null;
      return commit(change(document, new Date().toISOString()));
    },
    [commit, document],
  );

  const replace = useCallback((next: LearningLoopDocument) => commit(next), [commit]);

  const exportText = useCallback(() => (document ? serializeDocument(document) : null), [document]);

  return useMemo(
    () => ({
      state,
      document,
      storageProblem,
      writeProblem,
      storageKind: repository.kind,
      storageAvailable: repository.available,
      seed,
      reset,
      apply,
      replace,
      exportText,
      parseImport: parseDocumentText,
      clearWriteProblem: () => setWriteProblem(null),
    }),
    [
      state,
      document,
      storageProblem,
      writeProblem,
      repository.kind,
      repository.available,
      seed,
      reset,
      apply,
      replace,
      exportText,
    ],
  );
}
