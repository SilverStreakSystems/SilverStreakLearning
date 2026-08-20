import { useRef, useState } from "react";

import {
  buildTimeline,
  describeLoadFailure,
  NEXT_STEP_LIMITATION,
  type LearningLoopDocument,
  type NextStepProjection,
} from "@/domain/learning-loop";
import { buildImportPreview, type ImportPreview } from "@/lib/learning-loop/import-preview";
import type { LearningLoopStore } from "@/lib/learning-loop/use-learning-loop";
import { formatMoment } from "@/lib/learning-loop/format";
import { ActionButton, LiveNotice } from "./controls";

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
      <h2 id="next-step-heading" className="font-display mt-1 text-xl font-bold">
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
 * Restore, export, and previewed replace-import.
 *
 * There is one destructive control, not two. "Restore the sample records" is a
 * single atomic replacement: it never leaves the browser holding nothing, so
 * there is no state in which the workflow is unusable and the person has to
 * guess what to press next. Import never merges: the difference is shown first
 * and the replacement only happens after an explicit confirmation.
 */
export function DataControls({ store }: { store: LearningLoopStore }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<{
    document: LearningLoopDocument;
    preview: ImportPreview;
  } | null>(null);
  const [confirmingRestore, setConfirmingRestore] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  function download(text: string, name: string) {
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = window.document.createElement("a");
    anchor.href = url;
    anchor.download = name;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function onExport() {
    const text = store.exportText() ?? store.rawText();
    if (!text) {
      setProblem("There is nothing saved to export.");
      return;
    }
    download(text, "ssls-learning-loop-synthetic.json");
    setNotice("Exported the current records as a JSON file.");
  }

  async function onFile(file: File) {
    setProblem(null);
    setNotice(null);
    const result = store.parseImport(await file.text());
    if (!result.ok) {
      setProblem([result.message, ...describeLoadFailure(result)].join(" "));
      setPending(null);
      return;
    }
    setPending({
      document: result.document,
      preview: buildImportPreview(store.document, result.document),
    });
  }

  const hasRecords = store.document !== null;

  return (
    <div className="rounded-md border border-border bg-surface p-4 sm:p-5">
      <h2 className="font-display text-lg font-semibold">Sample data and files</h2>
      <p className="measure mt-1 text-sm text-muted-foreground">
        These records are synthetic and are saved in this browser only. Nothing is sent anywhere,
        and clearing your browser data removes them. Export a file if you want to keep them.
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <ActionButton
          onClick={() => {
            setNotice(null);
            setProblem(null);
            if (hasRecords) {
              setConfirmingRestore(true);
              return;
            }
            const result = store.restoreDemoData();
            setNotice(result.ok ? "The sample records are loaded." : null);
            setProblem(result.ok ? null : (result.problem?.message ?? "Nothing was changed."));
          }}
        >
          {hasRecords ? "Restore the sample records" : "Load the sample records"}
        </ActionButton>
        <ActionButton tone="secondary" onClick={onExport}>
          Export a file
        </ActionButton>
        <ActionButton tone="secondary" onClick={() => fileRef.current?.click()}>
          Import a file
        </ActionButton>
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
      <LiveNotice message={notice} tone="ok" />

      {confirmingRestore ? (
        <div className="mt-4 rounded-md border-2 border-border-strong bg-muted p-4">
          <h3 className="font-display text-base font-semibold">
            Restoring replaces everything currently saved
          </h3>
          <p className="measure mt-2 text-sm">
            Every record in this browser is replaced by the original sample set in one step. Export
            a file first if you want to keep what is here.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <ActionButton
              onClick={() => {
                const result = store.restoreDemoData();
                setConfirmingRestore(false);
                setNotice(result.ok ? "The sample records were restored." : null);
                setProblem(
                  result.ok ? null : (result.problem?.message ?? "Nothing was replaced."),
                );
              }}
            >
              Replace with the sample records
            </ActionButton>
            <ActionButton tone="secondary" onClick={() => setConfirmingRestore(false)}>
              Keep what is saved
            </ActionButton>
          </div>
        </div>
      ) : null}

      {pending ? (
        <div className="mt-4 rounded-md border-2 border-border-strong bg-muted p-4">
          <h3 className="font-display text-base font-semibold">
            Importing replaces everything currently saved
          </h3>
          {pending.preview.identical ? (
            <p className="mt-2 text-sm">
              This file matches what is already saved. Nothing changes.
            </p>
          ) : (
            <ul className="mt-2 flex flex-col gap-1 text-sm">
              {pending.preview.families.map((family) => (
                <li key={family.family}>
                  <span className="font-semibold">{family.family}:</span> {family.added.length}{" "}
                  added, {family.removed.length} removed, {family.changed.length} changed,{" "}
                  {family.unchanged} unchanged
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 flex flex-wrap gap-3">
            <ActionButton
              onClick={() => {
                const result = store.replaceAll(pending.document);
                setPending(null);
                setNotice(result.ok ? "Import complete. The saved records were replaced." : null);
                setProblem(
                  result.ok
                    ? null
                    : (result.problem?.message ?? "Import was refused and nothing was replaced."),
                );
              }}
            >
              Replace the saved records
            </ActionButton>
            <ActionButton tone="secondary" onClick={() => setPending(null)}>
              Cancel the import
            </ActionButton>
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
  const notices: { key: string; message: string; details?: string[] }[] = [];

  if (store.fallbackNotice)
    notices.push({ key: "fallback", message: store.fallbackNotice });
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
              if (!raw) return;
              const blob = new Blob([raw], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const anchor = window.document.createElement("a");
              anchor.href = url;
              anchor.download = "ssls-learning-loop-unreadable.json";
              anchor.click();
              URL.revokeObjectURL(url);
            }}
          >
            Export the unreadable data
          </ActionButton>
        </div>
      ) : null}
    </div>
  );
}
