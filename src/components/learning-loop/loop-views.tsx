import { useRef, useState } from "react";

import {
  buildTimeline,
  describeLoadFailure,
  type LearningLoopDocument,
  type NextStepRecommendation,
} from "@/domain/learning-loop";
import { buildImportPreview, type ImportPreview } from "@/lib/learning-loop/import-preview";
import type { LearningLoopStore } from "@/lib/learning-loop/use-learning-loop";
import { ActionButton, LiveNotice } from "./controls";

export function formatMoment(value: string): string {
  const date = new Date(value);
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(date);
}

/**
 * The recommendation surface.
 *
 * It always shows the rule identifier, the reason, and the records the
 * recommendation was computed from. It never renders as an approval, and the
 * refusal line is part of the component rather than optional page copy.
 */
export function NextStepCard({
  recommendation,
  children,
}: {
  recommendation: NextStepRecommendation;
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
        {recommendation.title}
      </h2>
      <p className="measure mt-2 text-base text-foreground">{recommendation.why}</p>
      {children ? <div className="mt-4">{children}</div> : null}
      <dl className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
        <div className="flex flex-wrap gap-x-2">
          <dt className="font-semibold">Rule:</dt>
          <dd>
            {recommendation.ruleId} v{recommendation.ruleVersion}, clause {recommendation.precedence}{" "}
            ({recommendation.stepCode})
          </dd>
        </div>
        <div className="mt-1 flex flex-wrap gap-x-2">
          <dt className="font-semibold">Computed from:</dt>
          <dd>{recommendation.basisRecordIds.join(", ") || "no records"}</dd>
        </div>
      </dl>
      <p className="measure mt-3 text-xs text-muted-foreground">
        This is a fixed rule reading the records on this page. It is not an artificial-intelligence
        output, not a clinical or eligibility judgement, and not an approval. A person decides.
      </p>
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
 * Seed, export, and previewed replace-import.
 *
 * Import never merges. The difference is shown first and the replacement only
 * happens after an explicit confirmation.
 */
export function DataControls({ store }: { store: LearningLoopStore }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<{
    document: LearningLoopDocument;
    preview: ImportPreview;
  } | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  function onExport() {
    const text = store.exportText();
    if (!text) return;
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = window.document.createElement("a");
    anchor.href = url;
    anchor.download = "ssls-learning-loop-synthetic.json";
    anchor.click();
    URL.revokeObjectURL(url);
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

  return (
    <div className="rounded-md border border-border bg-surface p-4 sm:p-5">
      <h2 className="font-display text-lg font-semibold">Sample data and files</h2>
      <p className="measure mt-1 text-sm text-muted-foreground">
        These records are saved in this browser only. Nothing is sent anywhere, and clearing your
        browser data removes them. Export a file if you want to keep them.
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <ActionButton onClick={store.seed}>Load the sample learners</ActionButton>
        <ActionButton tone="secondary" onClick={onExport} disabled={!store.document}>
          Export a file
        </ActionButton>
        <ActionButton tone="secondary" onClick={() => fileRef.current?.click()}>
          Import a file
        </ActionButton>
        <ActionButton tone="secondary" onClick={store.reset} disabled={!store.document}>
          Clear everything from this browser
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

      {pending ? (
        <div className="mt-4 rounded-md border-2 border-border-strong bg-muted p-4">
          <h3 className="font-display text-base font-semibold">
            Importing replaces everything currently saved
          </h3>
          {pending.preview.identical ? (
            <p className="mt-2 text-sm">This file matches what is already saved. Nothing changes.</p>
          ) : (
            <ul className="mt-2 flex flex-col gap-1 text-sm">
              {pending.preview.families.map((family) => (
                <li key={family.family}>
                  <span className="font-semibold">{family.family}:</span> {family.added.length} added,{" "}
                  {family.removed.length} removed, {family.changed.length} changed,{" "}
                  {family.unchanged} unchanged
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 flex flex-wrap gap-3">
            <ActionButton
              onClick={() => {
                const result = store.replace(pending.document);
                setPending(null);
                setNotice(
                  result?.ok
                    ? "Import complete. The saved records were replaced."
                    : "Import was refused and nothing was replaced.",
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

export function StorageNotices({ store }: { store: LearningLoopStore }) {
  const messages = [
    store.storageProblem,
    store.writeProblem,
    store.storageAvailable
      ? null
      : "This browser is blocking local storage, so nothing can be saved here.",
  ].filter((value): value is string => Boolean(value));

  if (messages.length === 0) return null;
  return (
    <div
      role="alert"
      className="mt-4 rounded-md border-2 border-signal-halted-foreground bg-signal-halted p-4 text-sm font-semibold text-signal-halted-foreground"
    >
      {messages.map((message) => (
        <p key={message} className="measure">
          {message}
        </p>
      ))}
    </div>
  );
}
