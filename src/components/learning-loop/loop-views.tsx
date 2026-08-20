import { useEffect, useRef, useState } from "react";

import {
  buildTimeline,
  describeLoadFailure,
  NEXT_STEP_LIMITATION,
  type LearningLoopDocument,
  type NextStepProjection,
} from "@/domain/learning-loop";
import { buildImportPreview, type ImportPreview } from "@/lib/learning-loop/import-preview";
import { MAX_IMPORT_BYTES, type RecoveryExpectation } from "@/lib/learning-loop/repository";
import type { LearningLoopStore } from "@/lib/learning-loop/use-learning-loop";
import { formatMoment } from "@/lib/learning-loop/format";
import { checkImportedRoster } from "@/lib/learning-loop/import-guard";
import { ActionButton, CheckLine, LiveNotice } from "./controls";

/**
 * The next-step surface.
 *
 * It always shows the rule clause, the reason, and the records the projection
 * was computed from. It never renders as an approval, and the limitation is
 * part of the component rather than optional page copy.
 */
export function NextStepCard({
  projection,
  children,
}: {
  projection: NextStepProjection;
  children?: React.ReactNode;
}) {
  return (
    <section
      aria-labelledby="next-step-heading"
      className="rounded-md border-2 border-border-strong bg-surface p-4 sm:p-5"
    >
      <p className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
        Suggested next step
      </p>
      <h2
        id="next-step-heading"
        tabIndex={-1}
        className="font-display mt-1 text-xl font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {projection.label}
      </h2>
      <p className="measure mt-2 text-base text-foreground">{projection.rationale}</p>
      {children ? <div className="mt-4">{children}</div> : null}
      <dl className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
        <div className="flex flex-wrap gap-x-2">
          <dt className="font-semibold">Rule:</dt>
          <dd>
            {projection.ruleSetId} v{projection.ruleSetVersion}, clause {projection.ruleId} (
            {projection.code})
          </dd>
        </div>
        <div className="mt-1 flex flex-wrap gap-x-2">
          <dt className="font-semibold">Computed from:</dt>
          <dd>{projection.basedOnRecordIds.join(", ") || "no records"}</dd>
        </div>
      </dl>
      <p className="measure mt-3 text-xs text-muted-foreground">{NEXT_STEP_LIMITATION}</p>
    </section>
  );
}

export function TimelineList({
  document,
  learnerId,
  goalId,
}: {
  document: LearningLoopDocument;
  learnerId: string;
  goalId?: string;
}) {
  const entries = buildTimeline(document, learnerId, goalId ? { goalId } : {});
  if (entries.length === 0)
    return <p className="text-sm text-muted-foreground">Nothing has been recorded yet.</p>;

  return (
    <ol className="flex flex-col gap-3">
      {entries.map((entry) => (
        <li
          key={entry.entryId}
          className="rounded-md border border-border bg-surface p-4 ps-4 border-s-4 border-s-border-strong"
        >
          <p className="flex flex-wrap items-center gap-2">
            <span className="font-semibold">{entry.headline}</span>
            {entry.superseded ? (
              <span className="rounded-sm border border-border-strong bg-muted px-2 py-0.5 text-xs font-semibold">
                Replaced by a later correction
              </span>
            ) : null}
          </p>
          <p className="measure mt-1 text-sm text-foreground">{entry.detail}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            {formatMoment(entry.occurredAt)} UTC — {entry.recordId}
          </p>
        </li>
      ))}
    </ol>
  );
}

/**
 * Exactly one destructive conversation can be open at a time.
 *
 * Two confirmation panels on screen at once is how someone confirms the wrong
 * one. Starting either action invalidates any confirmation already in progress,
 * so a stale panel can never be confirmed against a newer intention.
 */
export type DestructiveState =
  | { kind: "idle" }
  | { kind: "confirm-restore"; expected: RecoveryExpectation }
  | {
      kind: "preview-import";
      document: LearningLoopDocument;
      preview: ImportPreview;
      expected: RecoveryExpectation;
    };


export function DataControls({ store }: { store: LearningLoopStore }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const restoreTriggerRef = useRef<HTMLButtonElement>(null);
  const importTriggerRef = useRef<HTMLButtonElement>(null);
  const restoreCancelRef = useRef<HTMLButtonElement>(null);
  const importCancelRef = useRef<HTMLButtonElement>(null);
  const [destructive, setDestructive] = useState<DestructiveState>({ kind: "idle" });
  const [fictionalConfirmed, setFictionalConfirmed] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [problemDetails, setProblemDetails] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  // The safe choice is the one that gets focus when a destructive panel opens.
  useEffect(() => {
    if (destructive.kind === "confirm-restore") restoreCancelRef.current?.focus();
    if (destructive.kind === "preview-import") importCancelRef.current?.focus();
  }, [destructive.kind]);

  /** Every exit from a destructive panel returns focus to what opened it. */
  function closeDestructive(returnTo: "restore" | "import") {
    setDestructive({ kind: "idle" });
    setFictionalConfirmed(false);
    (returnTo === "restore" ? restoreTriggerRef : importTriggerRef).current?.focus();
  }

  function fail(message: string, details: string[] = []) {
    setProblem(message);
    setProblemDetails(details);
    setNotice(null);
  }

  /** Every new attempt starts from a clean slate of messages, including the
   * store-level problem, so an old failure can never be read as the result of
   * the action just taken. */
  function clearMessages() {
    setProblem(null);
    setProblemDetails([]);
    setNotice(null);
    store.dismissProblem();
  }


  function download(text: string, name: string): string | null {
    let url: string | null = null;
    try {
      const blob = new Blob([text], { type: "application/json" });
      url = URL.createObjectURL(blob);
      const anchor = window.document.createElement("a");
      anchor.href = url;
      anchor.download = name;
      anchor.rel = "noopener";
      anchor.click();
      return null;
    } catch {
      return "This browser refused to produce the file, so nothing was exported.";
    } finally {
      if (url) {
        try {
          URL.revokeObjectURL(url);
        } catch {
          /* the object URL is released with the page in any case */
        }
      }
    }
  }

  /**
   * Export writes a valid canonical document or refuses.
   *
   * It deliberately does not fall back to the raw stored bytes: corrupt or
   * newer-schema data exported under the ordinary name would look like a good
   * backup and would not be one. Unreadable bytes have their own clearly
   * labelled rescue export.
   */
  function onExport() {
    clearMessages();
    let text: string | null = null;
    try {
      text = store.exportText();
    } catch {
      fail("The saved records could not be read, so nothing was exported.");
      return;
    }
    if (!text) {
      fail(
        store.status === "corrupt" || store.status === "unsupported-version"
          ? "The saved data cannot be read, so there is no valid document to export. Use the rescue export for the unreadable data."
          : "There is nothing saved to export.",
      );
      return;
    }
    const failure = download(text, "ssls-learning-loop-synthetic.json");
    if (failure) {
      fail(failure);
      return;
    }
    setNotice("Exported the current records as a JSON file.");
  }

  function onExportBackup() {
    clearMessages();
    const backup = store.backupText();
    if (backup.status !== "ok") {
      fail(backup.message);
      return;
    }
    if (!backup.raw) {
      fail("There is no recovery copy saved.");
      return;
    }
    const failure = download(backup.raw, "ssls-learning-loop-recovery-copy.json");
    if (failure) {
      fail(failure);
      return;
    }
    setNotice("Exported the recovery copy kept from the last replacement.");
  }

  async function onFile(file: File) {
    clearMessages();
    // Starting an import invalidates any confirmation already in progress.
    setDestructive({ kind: "idle" });
    setFictionalConfirmed(false);
    // The size is refused before a single byte is read into memory.
    if (file.size > MAX_IMPORT_BYTES) {
      fail(
        `That file is ${Math.ceil(file.size / 1024)} KB. The limit is ${Math.floor(MAX_IMPORT_BYTES / 1024)} KB, so it was not read and nothing was changed.`,
      );
      return;
    }
    let text: string;
    try {
      text = await file.text();
    } catch {
      fail("That file could not be read, so nothing was changed.");
      return;
    }
    const result = store.parseImport(text);
    if (!result.ok) {
      fail(result.message, describeLoadFailure(result));
      return;
    }
    const rosterProblems = checkImportedRoster(result.document);
    if (rosterProblems.length > 0) {
      fail(
        "That file was refused and nothing was changed. This preview holds one fixed sample roster, and the file does not match it.",
        rosterProblems.slice(0, 6),
      );
      return;
    }
    // Fail closed: without a captured expectation there is no way to tell, at
    // confirm time, whether another tab wrote in between. The confirmation is
    // not opened at all rather than opened without concurrency protection.
    const expected = store.captureExpectation();
    if (expected.status !== "ok") {
      fail(expected.message);
      return;
    }
    setDestructive({
      kind: "preview-import",
      document: result.document,
      preview: buildImportPreview(store.document, result.document),
      // What this preview was computed against. Confirming re-checks it.
      expected: expected.expectation,
    });
  }


  const hasRecords = store.document !== null;
  const unreadable = store.status === "corrupt" || store.status === "unsupported-version";
  const backup = store.backupText();
  const hasBackup = backup.status === "ok" && backup.raw !== null;

  return (
    <div className="rounded-md border border-border bg-surface p-4 sm:p-5">
      <h2 className="font-display text-lg font-semibold">Sample data and files</h2>
      <p className="measure mt-1 text-sm text-muted-foreground">
        These records are synthetic and are saved in this browser only. Nothing is sent anywhere,
        and clearing your browser data removes them. Export a file if you want to keep them.
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <ActionButton
          ref={restoreTriggerRef}
          onClick={() => {
            clearMessages();
            setFictionalConfirmed(false);
            if (hasRecords || unreadable) {
              // Fail closed: no captured expectation, no confirmation panel.
              const expected = store.captureExpectation();
              if (expected.status !== "ok") {
                fail(expected.message);
                return;
              }
              setDestructive({ kind: "confirm-restore", expected: expected.expectation });
              return;
            }
            const result = store.seedInitialData();
            if (!result.ok) {
              fail(result.problem?.message ?? "Nothing was changed.");
              return;
            }
            setNotice("The sample records are loaded.");
          }}

        >
          {hasRecords || unreadable ? "Restore the sample records" : "Load the sample records"}
        </ActionButton>
        <ActionButton tone="secondary" onClick={onExport}>
          Export a file
        </ActionButton>
        <ActionButton
          ref={importTriggerRef}
          tone="secondary"
          onClick={() => fileRef.current?.click()}
        >
          Import a file
        </ActionButton>
        {hasBackup ? (
          <ActionButton tone="secondary" onClick={onExportBackup}>
            Export the recovery copy
          </ActionButton>
        ) : null}
      </div>

      <label htmlFor="learning-loop-import" className="sr-only">
        Choose an exported learning loop file
      </label>
      <input
        id="learning-loop-import"
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) void onFile(file);
        }}
      />

      <LiveNotice message={problem} tone="problem" />
      {problem && problemDetails.length > 0 ? (
        <ul className="measure mt-2 list-disc ps-5 text-sm text-foreground">
          {problemDetails.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      ) : null}
      <LiveNotice message={notice} tone="ok" />

      {destructive.kind === "confirm-restore" ? (
        <div
          role="group"
          aria-labelledby="restore-confirm-heading"
          aria-describedby="restore-confirm-description"
          className="mt-4 rounded-md border-2 border-border-strong bg-muted p-4"
        >
          <h3 id="restore-confirm-heading" className="font-display text-base font-semibold">
            Restoring replaces everything currently saved
          </h3>
          <p id="restore-confirm-description" className="measure mt-2 text-sm">
            {unreadable
              ? "The saved data cannot be read. Replacing it puts the original sample set in its place and keeps one copy of the unreadable data. Export the unreadable data first if you want to keep it."
              : "Every record in this browser is replaced by the original sample set in one step. Export a file first if you want to keep what is here."}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {/* The safe action comes first in reading and tab order. */}
            <ActionButton
              tone="secondary"
              ref={restoreCancelRef}
              onClick={() => {
                clearMessages();
                closeDestructive("restore");
              }}
            >
              Keep what is saved
            </ActionButton>
            <ActionButton
              onClick={() => {
                const result = store.restoreDemoData(destructive.expected);
                if (!result.ok) {
                  // The confirmation stays open: nothing happened yet.
                  fail(result.problem?.message ?? "Nothing was replaced.");
                  restoreCancelRef.current?.focus();
                  return;
                }
                clearMessages();
                setNotice("The sample records were restored.");
                closeDestructive("restore");
              }}
            >
              Replace with the sample records
            </ActionButton>
          </div>
        </div>
      ) : null}

      {destructive.kind === "preview-import" ? (
        <div
          role="group"
          aria-labelledby="import-confirm-heading"
          aria-describedby="import-confirm-description"
          className="mt-4 rounded-md border-2 border-border-strong bg-muted p-4"
        >
          <h3 id="import-confirm-heading" className="font-display text-base font-semibold">
            {destructive.preview.identical
              ? "This file matches what is already saved"
              : "Importing replaces everything currently saved"}
          </h3>
          {destructive.preview.identical ? (
            <p id="import-confirm-description" className="mt-2 text-sm">
              Every record in the file is already saved, so there is nothing to replace and nothing
              was changed.
            </p>
          ) : (
            <>
              <p id="import-confirm-description" className="measure mt-2 text-sm">
                Nothing has been written yet. This is what would change.
              </p>
              <ul className="mt-2 flex flex-col gap-1 text-sm">
                {destructive.preview.families.map((family) => (
                  <li key={family.family}>
                    <span className="font-semibold">{family.family}:</span> {family.added.length}{" "}
                    added, {family.removed.length} removed, {family.changed.length} changed,{" "}
                    {family.unchanged} unchanged
                  </li>
                ))}
              </ul>
              <CheckLine
                label="I confirm this file contains fictional sample data only, and no information about a real person."
                checked={fictionalConfirmed}
                onChange={(event) => setFictionalConfirmed(event.target.checked)}
              />
            </>
          )}
          <div className="mt-4 flex flex-wrap gap-3">
            <ActionButton
              tone="secondary"
              ref={importCancelRef}
              onClick={() => {
                clearMessages();
                setNotice(
                  destructive.preview.identical
                    ? "Nothing was changed."
                    : "The import was cancelled. Nothing was changed.",
                );
                closeDestructive("import");
              }}
            >
              {destructive.preview.identical ? "Keep what is saved" : "Cancel the import"}
            </ActionButton>
            {destructive.preview.identical ? null : (
              <ActionButton
                disabled={!fictionalConfirmed}
                onClick={() => {
                  if (!fictionalConfirmed) return;
                  const result = store.replaceAll(destructive.document, destructive.expected);
                  if (!result.ok) {
                    // The preview stays on screen so the import can be retried.
                    fail(result.problem?.message ?? "Import was refused and nothing was replaced.");
                    importCancelRef.current?.focus();
                    return;
                  }
                  clearMessages();
                  setNotice("Import complete. The saved records were replaced.");
                  closeDestructive("import");
                }}
              >
                Replace the saved records
              </ActionButton>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Storage and write problems, stated in full.
 *
 * Unreadable data is reported as unreadable and the stored bytes are offered
 * for export, rather than being presented as an empty workspace that invites
 * the person to overwrite their own records.
 */
export function StorageNotices({ store }: { store: LearningLoopStore }) {
  const [rescue, setRescue] = useState<string | null>(null);
  const notices: { key: string; message: string; details?: string[] }[] = [];

  if (store.fallbackNotice) notices.push({ key: "fallback", message: store.fallbackNotice });
  if (store.readProblem) notices.push({ key: "read", message: store.readProblem });
  if (store.problem)
    notices.push({
      key: "write",
      message: store.problem.message,
      details: store.problem.details,
    });

  if (notices.length === 0) return null;
  const unreadable = store.status === "corrupt" || store.status === "unsupported-version";

  return (
    <div
      role="alert"
      className="mt-4 rounded-md border-2 border-signal-halted-foreground bg-signal-halted p-4 text-sm text-signal-halted-foreground"
    >
      {notices.map((notice) => (
        <div key={notice.key} className="mt-2 first:mt-0">
          <p className="measure font-semibold">{notice.message}</p>
          {notice.details && notice.details.length > 0 ? (
            <ul className="measure mt-1 list-disc ps-5">
              {notice.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ))}
      {unreadable ? (
        <div className="mt-3 flex flex-wrap gap-3">
          <ActionButton
            tone="secondary"
            onClick={() => {
              const raw = store.rawText();
              if (raw.status !== "ok") {
                setRescue(raw.message);
                return;
              }
              if (!raw.raw) {
                setRescue("There is nothing saved to export.");
                return;
              }
              let url: string | null = null;
              try {
                const blob = new Blob([raw.raw], { type: "application/json" });
                url = URL.createObjectURL(blob);
                const anchor = window.document.createElement("a");
                anchor.href = url;
                anchor.download = "ssls-learning-loop-unreadable.json";
                anchor.rel = "noopener";
                anchor.click();
                setRescue("Exported the unreadable data exactly as it is stored.");
              } catch {
                // Never report an export that did not happen.
                setRescue("This browser refused to produce the file, so nothing was exported.");
              } finally {
                if (url) {
                  try {
                    URL.revokeObjectURL(url);
                  } catch {
                    /* the object URL is released with the page in any case */
                  }
                }
              }
            }}
          >
            Export the unreadable data
          </ActionButton>
        </div>
      ) : null}
      {rescue ? (
        <p role="status" className="measure mt-3 font-semibold">
          {rescue}
        </p>
      ) : null}
    </div>
  );
}
