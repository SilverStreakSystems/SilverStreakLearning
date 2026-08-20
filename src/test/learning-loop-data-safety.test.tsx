/**
 * Data-safety acceptance for Product Alpha 001.
 *
 * Everything a person can do to the saved records from the interface —
 * exporting, importing, replacing, recovering — is exercised here against the
 * real routes and the real browser-local adapter. Every failure has to be
 * visible, distinct, and non-destructive: no path may report success while
 * having changed nothing, and no path may change data while reporting failure.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderRoute } from "./render-route";
import {
  LEARNING_LOOP_STORAGE_KEY,
  MAX_IMPORT_BYTES,
  isEnvelope,
  type StorageEnvelope,
} from "@/lib/learning-loop/repository";
import {
  canonicalizeDocument,
  createSeedDocument,
  parseDocumentText,
  serializeDocument,
  type LearningLoopDocument,
} from "@/domain/learning-loop";

const SEED_TEXT = serializeDocument(createSeedDocument());

/** The complete stored value, for byte-for-byte "nothing moved" assertions. */
function storedValue(): string | null {
  return window.localStorage.getItem(LEARNING_LOOP_STORAGE_KEY);
}

/** The one-key envelope the product writes, or null before anything is stored. */
function storedEnvelope(): StorageEnvelope | null {
  const raw = storedValue();
  if (raw === null) return null;
  const parsed: unknown = JSON.parse(raw);
  expect(isEnvelope(parsed)).toBe(true);
  return parsed as StorageEnvelope;
}

/** The current document bytes held inside the envelope. */
function storedText(): string | null {
  return storedEnvelope()?.current ?? null;
}

/** The single recovery copy held inside the same envelope. */
function storedBackup(): string | null {
  return storedEnvelope()?.backup ?? null;
}

function storedRevision(): number | null {
  const raw = storedText();
  return raw ? (JSON.parse(raw) as { revision: number }).revision : null;
}

/** Hands a file to the import control the way the file picker does. */
function chooseFile(file: File) {
  const input = window.document.getElementById("learning-loop-import") as HTMLInputElement;
  Object.defineProperty(input, "files", { value: [file], configurable: true });
  fireEvent.change(input);
}

/** A File whose reported size and text() are under the test's control. */
function fakeFile(options: { size: number; text?: () => Promise<string>; name?: string }): {
  file: File;
  text: ReturnType<typeof vi.fn>;
} {
  const text = vi.fn(options.text ?? (() => Promise.resolve("{}")));
  const file = new File(["placeholder"], options.name ?? "import.json", {
    type: "application/json",
  });
  Object.defineProperty(file, "size", { value: options.size, configurable: true });
  Object.defineProperty(file, "text", { value: text, configurable: true });
  return { file, text };
}

/**
 * The confirmed-replace path: a person must state the file is fictional before
 * the destructive control becomes usable at all.
 */
async function confirmReplace(user: ReturnType<typeof userEvent.setup>) {
  const confirm = await screen.findByRole("button", { name: "Replace the saved records" });
  expect(confirm).toHaveProperty("disabled", true);
  await user.click(screen.getByLabelText(/fictional sample data only/i));
  expect(confirm).toHaveProperty("disabled", false);
  await user.click(confirm);
}

async function loadSamples(user: ReturnType<typeof userEvent.setup>) {
  await user.click(await screen.findByRole("button", { name: "Load the sample records" }));
  await screen.findByText(/Sample Learner A \(fictional\)/);
}

describe("canonical serialization", () => {
  it("is stable: serializing twice, and serializing a reordered document, give the same bytes", () => {
    const document = createSeedDocument();
    expect(serializeDocument(document)).toBe(serializeDocument(document));

    const shuffled: LearningLoopDocument = {
      ...document,
      learners: [...document.learners].reverse(),
      goals: [...document.goals].reverse(),
      observations: [...document.observations].reverse(),
      supportActions: [...document.supportActions].reverse(),
      goalReviews: [...document.goalReviews].reverse(),
    };
    expect(serializeDocument(shuffled)).toBe(serializeDocument(document));
    expect(serializeDocument(canonicalizeDocument(shuffled))).toBe(serializeDocument(document));
  });

  it("round-trips through export text and back with no loss", () => {
    const parsed = parseDocumentText(SEED_TEXT);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(serializeDocument(parsed.document)).toBe(SEED_TEXT);
    expect(parsed.document).toEqual(canonicalizeDocument(createSeedDocument()));
  });

  it("is far smaller than the import size limit, so the limit never blocks a real export", () => {
    expect(new Blob([SEED_TEXT]).size).toBeLessThan(MAX_IMPORT_BYTES / 4);
  });
});

describe("export, import, and previewed replace, through the interface", () => {
  let createObjectURL: ReturnType<typeof vi.fn>;
  let blobs: Blob[];

  beforeEach(() => {
    window.localStorage.clear();
    blobs = [];
    createObjectURL = vi.fn((blob: Blob) => {
      blobs.push(blob);
      return "blob:test";
    });
    vi.stubGlobal(
      "URL",
      Object.assign(Object.create(URL), URL, {
        createObjectURL,
        revokeObjectURL: vi.fn(),
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("exports exactly the stored bytes, and importing them back is a previewed no-change", async () => {
    const user = userEvent.setup();
    await renderRoute("/learners");
    await loadSamples(user);
    const revisionBefore = storedRevision();
    const valueBefore = storedValue();
    const lastUpdatedBefore = JSON.parse(storedText()!).lastUpdatedAt as string;

    await user.click(screen.getByRole("button", { name: "Export a file" }));
    expect(await screen.findByText("Exported the current records as a JSON file.")).toBeTruthy();
    expect(createObjectURL).toHaveBeenCalledTimes(1);
    const exported = await blobs[0]!.text();
    expect(exported).toBe(storedText());

    chooseFile(fakeFile({ size: exported.length, text: () => Promise.resolve(exported) }).file);
    expect(
      await screen.findByRole("heading", { name: "This file matches what is already saved" }),
    ).toBeTruthy();
    // An identical import is a real no-op: there is no replace control at all,
    // and nothing about the stored value moves.
    expect(screen.queryByRole("button", { name: "Replace the saved records" })).toBeNull();
    expect(storedRevision()).toBe(revisionBefore);
    expect(storedValue()).toBe(valueBefore);
    expect(storedBackup()).toBeNull();
    expect(JSON.parse(storedText()!).lastUpdatedAt).toBe(lastUpdatedBefore);
  });

  it("previews a real difference, and cancelling changes neither the revision nor the bytes", async () => {
    const user = userEvent.setup();
    await renderRoute("/learners");
    await loadSamples(user);
    const bytesBefore = storedText();
    const revisionBefore = storedRevision();

    const reduced = createSeedDocument();
    reduced.goalReviews = [];
    chooseFile(
      fakeFile({ size: 500, text: () => Promise.resolve(serializeDocument(reduced)) }).file,
    );

    const cancel = await screen.findByRole("button", { name: "Cancel the import" });
    expect(cancel).toHaveFocus();
    expect(screen.getByText("Results:").parentElement!.textContent).toContain("1 removed");

    await user.click(cancel);
    expect(await screen.findByText("The import was cancelled. Nothing was changed.")).toBeTruthy();
    expect(storedText()).toBe(bytesBefore);
    expect(storedRevision()).toBe(revisionBefore);
  });

  it("changes the document once on a confirmed replace and keeps one recovery snapshot", async () => {
    const user = userEvent.setup();
    await renderRoute("/learners");
    await loadSamples(user);
    const bytesBefore = storedText()!;
    const revisionBefore = storedRevision()!;

    const reduced = createSeedDocument();
    reduced.goalReviews = [];
    chooseFile(
      fakeFile({ size: 500, text: () => Promise.resolve(serializeDocument(reduced)) }).file,
    );
    await confirmReplace(user);

    expect(
      await screen.findByText("Import complete. The saved records were replaced."),
    ).toBeTruthy();
    expect(storedRevision()).toBe(revisionBefore + 1);
    expect(JSON.parse(storedText()!).goalReviews).toEqual([]);
    // Exactly one snapshot, holding the exact prior bytes, inside the one key.
    expect(storedBackup()).toBe(bytesBefore);
    expect(Object.keys(window.localStorage).filter((key) => key.startsWith("ssls."))).toEqual([
      LEARNING_LOOP_STORAGE_KEY,
    ]);
    expect(screen.queryByRole("button", { name: "Replace the saved records" })).toBeNull();
  });

  it("keeps the current data and the preview when the replace itself fails, then succeeds on retry", async () => {
    const user = userEvent.setup();
    await renderRoute("/learners");
    await loadSamples(user);
    const bytesBefore = storedText();
    const revisionBefore = storedRevision();

    const reduced = createSeedDocument();
    reduced.goalReviews = [];
    chooseFile(
      fakeFile({ size: 500, text: () => Promise.resolve(serializeDocument(reduced)) }).file,
    );
    const confirm = await screen.findByRole("button", { name: "Replace the saved records" });
    await user.click(screen.getByLabelText(/fictional sample data only/i));

    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(function (
      this: Storage,
      key: string,
    ) {
      if (key === LEARNING_LOOP_STORAGE_KEY) throw new Error("quota");
    });
    await user.click(confirm);

    expect((await screen.findAllByText(/refused to save the replacement/i)).length).toBeGreaterThan(
      0,
    );
    expect(storedText()).toBe(bytesBefore);
    expect(storedRevision()).toBe(revisionBefore);
    // The preview is still on screen so the same import can be retried.
    expect(screen.getByRole("button", { name: "Replace the saved records" })).toBeTruthy();

    setItem.mockRestore();
    // The confirmation is still ticked, so the retry needs no re-statement.
    await user.click(screen.getByRole("button", { name: "Replace the saved records" }));
    expect(
      await screen.findByText("Import complete. The saved records were replaced."),
    ).toBeTruthy();
    expect(storedRevision()).toBe(revisionBefore! + 1);
  });

  it("reports a download failure instead of claiming an export happened", async () => {
    const user = userEvent.setup();
    await renderRoute("/learners");
    await loadSamples(user);

    createObjectURL.mockImplementation(() => {
      throw new Error("no object urls here");
    });
    await user.click(screen.getByRole("button", { name: "Export a file" }));

    expect(
      await screen.findByText("This browser refused to produce the file, so nothing was exported."),
    ).toBeTruthy();
    expect(screen.queryByText("Exported the current records as a JSON file.")).toBeNull();
  });
});

describe("import boundaries and refusals", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  async function ready() {
    const user = userEvent.setup();
    await renderRoute("/learners");
    await loadSamples(user);
    return { user, bytes: storedText(), revision: storedRevision() };
  }

  it("accepts a file at exactly the limit and reads it", async () => {
    const { bytes } = await ready();
    // A real difference, so the preview offers the replace control at all.
    const atLimit = createSeedDocument();
    atLimit.goalReviews = [];
    const { file, text } = fakeFile({
      size: MAX_IMPORT_BYTES,
      text: () => Promise.resolve(serializeDocument(atLimit)),
    });
    chooseFile(file);

    expect(await screen.findByRole("button", { name: "Replace the saved records" })).toBeTruthy();
    expect(text).toHaveBeenCalledTimes(1);
    expect(storedText()).toBe(bytes);
  });

  it("refuses a file over the limit before a single byte is read", async () => {
    const { bytes, revision } = await ready();
    const { file, text } = fakeFile({ size: MAX_IMPORT_BYTES + 1 });
    chooseFile(file);

    expect(await screen.findByText(/The limit is 1024 KB, so it was not read/)).toBeTruthy();
    expect(text).not.toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: "Replace the saved records" })).toBeNull();
    expect(storedText()).toBe(bytes);
    expect(storedRevision()).toBe(revision);
  });

  it("reports a file that cannot be read, and changes nothing", async () => {
    const { bytes } = await ready();
    chooseFile(fakeFile({ size: 100, text: () => Promise.reject(new Error("unreadable")) }).file);

    expect(
      await screen.findByText("That file could not be read, so nothing was changed."),
    ).toBeTruthy();
    expect(storedText()).toBe(bytes);
  });

  const refusals: { name: string; text: string; expected: RegExp }[] = [
    { name: "invalid JSON", text: "{ not json", expected: /That file is not valid JSON\./ },
    {
      name: "a valid JSON document of the wrong shape",
      text: JSON.stringify({ schemaVersion: 1, learners: "no" }),
      expected: /The data does not match the expected shape\./,
    },
    {
      name: "a document with no schema version",
      text: JSON.stringify({ learners: [] }),
      expected: /The saved data declares no schema version\./,
    },
    {
      name: "a document written by a newer schema",
      text: JSON.stringify({ ...createSeedDocument(), schemaVersion: 99 }),
      expected: /written by a newer version of the preview \(schema 99\)/,
    },
  ];

  for (const refusal of refusals) {
    it(`refuses ${refusal.name} with its own visible message, non-destructively`, async () => {
      const { bytes, revision } = await ready();
      chooseFile(fakeFile({ size: refusal.text.length, text: async () => refusal.text }).file);

      expect(await screen.findByText(refusal.expected)).toBeTruthy();
      expect(screen.queryByRole("button", { name: "Replace the saved records" })).toBeNull();
      expect(storedText()).toBe(bytes);
      expect(storedRevision()).toBe(revision);
    });
  }

  it("refuses duplicate identifiers and names the inconsistency", async () => {
    const { bytes } = await ready();
    const duplicated = createSeedDocument();
    duplicated.goals.push({ ...duplicated.goals[0]! });
    const text = JSON.stringify(duplicated);
    chooseFile(fakeFile({ size: text.length, text: async () => text }).file);

    expect(await screen.findByText(/The data is internally inconsistent\./)).toBeTruthy();
    expect(storedText()).toBe(bytes);
  });

  it("refuses a temporally impossible document", async () => {
    const { bytes } = await ready();
    const impossible = createSeedDocument();
    // A support marked finished before it was ever planned.
    const support = impossible.supportActions.find((row) => row.completedAt)!;
    support.completedAt = "1999-01-01T00:00:00.000Z";
    const text = JSON.stringify(impossible);
    chooseFile(fakeFile({ size: text.length, text: async () => text }).file);

    expect(await screen.findByText(/internally inconsistent|does not match/i)).toBeTruthy();
    expect(storedText()).toBe(bytes);
  });
});

describe("corrupt and newer stored data", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("never presents unreadable data as an empty workspace, and only a confirmed replace overwrites it", async () => {
    const corrupt = "{ this was never valid";
    window.localStorage.setItem(LEARNING_LOOP_STORAGE_KEY, corrupt);
    const user = userEvent.setup();
    await renderRoute("/learners");

    expect(await screen.findByText(/The saved data is not readable\./)).toBeTruthy();
    expect(screen.queryByRole("heading", { name: /nothing is saved yet/i })).toBeNull();
    // The unreadable bytes are offered for rescue, not silently discarded.
    expect(screen.getByRole("button", { name: "Export the unreadable data" })).toBeTruthy();
    // Read non-destructively: the legacy raw value is still exactly as written.
    expect(storedValue()).toBe(corrupt);

    // Restoring is destructive, so it is confirmed, and cancelling keeps the bytes.
    await user.click(screen.getByRole("button", { name: "Restore the sample records" }));
    await user.click(screen.getByRole("button", { name: "Keep what is saved" }));
    expect(storedValue()).toBe(corrupt);

    await user.click(screen.getByRole("button", { name: "Restore the sample records" }));
    await user.click(screen.getByRole("button", { name: "Replace with the sample records" }));

    expect(await screen.findByText(/Sample Learner A \(fictional\)/)).toBeTruthy();
    expect(screen.queryByText(/The saved data is not readable\./)).toBeNull();
    expect(storedRevision()).toBe(1);
    // The exact prior bytes survive as the single recovery snapshot.
    expect(storedBackup()).toBe(corrupt);
  });

  it("treats newer stored data as unreadable rather than overwriting it on an ordinary save", async () => {
    const newer = JSON.stringify({ ...createSeedDocument(), schemaVersion: 99 });
    window.localStorage.setItem(LEARNING_LOOP_STORAGE_KEY, newer);
    await renderRoute("/learners");

    expect(
      await screen.findByText(/written by a newer version of the preview \(schema 99\)/),
    ).toBeTruthy();
    expect(storedValue()).toBe(newer);
    // There is no ordinary write path on offer: the destructive one is confirmed.
    expect(screen.getByRole("button", { name: "Restore the sample records" })).toBeTruthy();
  });
});

describe("write failures during ordinary work", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("reports a storage refusal instead of pretending the observation was saved", async () => {
    const user = userEvent.setup();
    await renderRoute("/learners");
    await loadSamples(user);
    await user.click(await screen.findByRole("link", { name: /Sample Learner A/ }));

    const bytesBefore = storedText();
    await user.click(await screen.findByRole("button", { name: "Record an observation" }));
    await user.type(
      await screen.findByLabelText(/What did you see\?/),
      "This attempt is made while the browser is refusing writes.",
    );

    vi.spyOn(Storage.prototype, "setItem").mockImplementation(function (
      this: Storage,
      key: string,
    ) {
      if (key === LEARNING_LOOP_STORAGE_KEY) throw new Error("quota");
    });
    await user.click(screen.getByRole("button", { name: "Save this observation" }));

    expect((await screen.findAllByText(/refused to save the change/i)).length).toBeGreaterThan(0);
    expect(storedText()).toBe(bytesBefore);
  });

  it("reports a revision conflict when the saved records moved underneath the open form", async () => {
    const user = userEvent.setup();
    await renderRoute("/learners");
    await loadSamples(user);
    await user.click(await screen.findByRole("link", { name: /Sample Learner A/ }));

    await user.click(await screen.findByRole("button", { name: "Record an observation" }));
    await user.type(
      await screen.findByLabelText(/What did you see\?/),
      "Written against a revision that another tab has already moved past.",
    );

    // Another tab writes first. The document stays valid; only the revision moves.
    const moved = JSON.parse(storedText()!) as LearningLoopDocument;
    moved.revision += 5;
    window.localStorage.setItem(
      LEARNING_LOOP_STORAGE_KEY,
      JSON.stringify({
        envelopeVersion: 1,
        current: serializeDocument(moved),
        backup: null,
      }),
    );

    await user.click(screen.getByRole("button", { name: "Save this observation" }));

    expect(
      (await screen.findAllByText(/changed since this form was opened/i)).length,
    ).toBeGreaterThan(0);
    expect(JSON.parse(storedText()!).revision).toBe(moved.revision);
  });

  it("does not revise anything when a command is refused before it reaches storage", async () => {
    const user = userEvent.setup();
    await renderRoute("/learners");
    await loadSamples(user);
    await user.click(await screen.findByRole("link", { name: /Sample Learner A/ }));
    const revisionBefore = storedRevision();

    await user.click(await screen.findByRole("button", { name: "Record an observation" }));
    await user.click(screen.getByRole("button", { name: "Save this observation" }));

    expect(await screen.findByRole("alert")).toBeTruthy();
    await waitFor(() => expect(storedRevision()).toBe(revisionBefore));
  });

  it("keeps the loop usable after a refusal: the next valid save still works", async () => {
    const user = userEvent.setup();
    await renderRoute("/learners");
    await loadSamples(user);
    await user.click(await screen.findByRole("link", { name: /Sample Learner A/ }));
    const revisionBefore = storedRevision()!;

    await user.click(await screen.findByRole("button", { name: "Record an observation" }));
    await user.click(screen.getByRole("button", { name: "Save this observation" }));
    await screen.findByRole("alert");

    await user.type(
      await screen.findByLabelText(/What did you see\?/),
      "Recorded after the refused attempt, to show the workflow is not stuck.",
    );
    await user.click(screen.getByRole("button", { name: "Save this observation" }));

    await waitFor(() => expect(storedRevision()).toBe(revisionBefore + 1));
    const timeline = screen.getByRole("region", { name: "Everything, in order" });
    expect(within(timeline).getAllByText(/Recorded after the refused attempt/).length).toBe(1);
  });
});

/**
 * The fixed synthetic roster is a preview boundary: records may come and go
 * through import, learner identities may not.
 */
describe("import roster guard", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * The mutations below deliberately produce documents the type system would
   * reject, because that is exactly what a hand-edited file can contain.
   */
  type LooseDocument = Record<string, unknown> & {
    learners: Record<string, unknown>[];
    goals: { learnerId: string }[];
  };

  const mutations: { name: string; mutate: (document: LooseDocument) => void }[] = [
    {
      name: "adds a learner",
      mutate: (document) => {
        document.learners.push({
          ...document.learners[0]!,
          learnerId: "LRN-NEW",
          displayLabel: "Sample Learner E (fictional)",
        });
      },
    },
    {
      name: "removes a learner",
      mutate: (document) => {
        document.learners = document.learners.filter((row) => row["learnerId"] !== "LRN-D");
        document.goals = document.goals.filter((row) => row.learnerId !== "LRN-D");
      },
    },
    {
      name: "renames a learner",
      mutate: (document) => {
        document.learners[0]!["displayLabel"] = "A Real Sounding Name";
      },
    },
    {
      name: "changes a learner's grade band",
      mutate: (document) => {
        document.learners[0]!["gradeBand"] = "secondary";
      },
    },
    {
      name: "changes a learner's origin",
      mutate: (document) => {
        document.learners[0]!["origin"] = "created";
      },
    },
    {
      name: "marks a learner as not synthetic",
      mutate: (document) => {
        document.learners[0]!["synthetic"] = false;
      },
    },
    {
      name: "changes the application marker",
      mutate: (document) => {
        document["application"] = "some-other-app";
      },
    },
    {
      name: "changes the dataset marker",
      mutate: (document) => {
        document["datasetId"] = "district-live";
      },
    },
    {
      name: "changes the seed version marker",
      mutate: (document) => {
        document["seedVersion"] = 99;
      },
    },
    {
      name: "drops the synthetic-only marker",
      mutate: (document) => {
        document["syntheticOnly"] = false;
      },
    },
  ];

  for (const mutation of mutations) {
    it(`refuses a file that ${mutation.name}, and changes nothing`, async () => {
      const user = userEvent.setup();
      await renderRoute("/learners");
      await loadSamples(user);
      const valueBefore = storedValue();

      const document = createSeedDocument();
      mutation.mutate(document as unknown as LooseDocument);
      const text = JSON.stringify(document);
      chooseFile(fakeFile({ size: text.length, text: async () => text }).file);

      // Refusal is stated, whatever the specific reason: roster guard or the
      // schema/marker checks that run alongside it.
      expect((await screen.findAllByText(/not|cannot|refus/i)).length).toBeGreaterThan(0);
      expect(screen.queryByRole("button", { name: "Replace the saved records" })).toBeNull();
      expect(storedValue()).toBe(valueBefore);
    });
  }
});

describe("destructive confirmation states", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("keeps restore and import confirmations mutually exclusive", async () => {
    const user = userEvent.setup();
    await renderRoute("/learners");
    await loadSamples(user);

    await user.click(screen.getByRole("button", { name: "Restore the sample records" }));
    expect(
      screen.getByRole("heading", { name: "Restoring replaces everything currently saved" }),
    ).toBeTruthy();

    // Starting an import while a restore is pending replaces the pending state
    // rather than showing two destructive confirmations at once.
    const reduced = createSeedDocument();
    reduced.goalReviews = [];
    chooseFile(
      fakeFile({ size: 500, text: () => Promise.resolve(serializeDocument(reduced)) }).file,
    );

    await screen.findByRole("heading", { name: "Importing replaces everything currently saved" });
    expect(
      screen.queryByRole("heading", { name: "Restoring replaces everything currently saved" }),
    ).toBeNull();
  });

  it("returns focus to the control that opened the confirmation when it is cancelled", async () => {
    const user = userEvent.setup();
    await renderRoute("/learners");
    await loadSamples(user);

    const restore = screen.getByRole("button", { name: "Restore the sample records" });
    await user.click(restore);
    const keep = await screen.findByRole("button", { name: "Keep what is saved" });
    expect(keep).toHaveFocus();
    await user.click(keep);
    expect(restore).toHaveFocus();
  });

  it("keeps the confirmation open and focused on the safe choice when a restore fails", async () => {
    const user = userEvent.setup();
    await renderRoute("/learners");
    await loadSamples(user);
    const valueBefore = storedValue();

    await user.click(screen.getByRole("button", { name: "Restore the sample records" }));
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(function (
      this: Storage,
      key: string,
    ) {
      if (key === LEARNING_LOOP_STORAGE_KEY) throw new Error("quota");
    });
    await user.click(screen.getByRole("button", { name: "Replace with the sample records" }));

    expect((await screen.findAllByText(/refused to save the replacement/i)).length).toBeGreaterThan(
      0,
    );
    const keep = screen.getByRole("button", { name: "Keep what is saved" });
    expect(keep).toHaveFocus();
    expect(storedValue()).toBe(valueBefore);
  });
});

describe("recovery export is distinct from ordinary export", () => {
  let blobs: Blob[];

  beforeEach(() => {
    window.localStorage.clear();
    blobs = [];
    vi.stubGlobal(
      "URL",
      Object.assign(Object.create(URL), URL, {
        createObjectURL: vi.fn((blob: Blob) => {
          blobs.push(blob);
          return "blob:test";
        }),
        revokeObjectURL: vi.fn(),
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("offers no ordinary export of unreadable bytes, only the labelled rescue export", async () => {
    const corrupt = "{ this was never valid";
    window.localStorage.setItem(LEARNING_LOOP_STORAGE_KEY, corrupt);
    const user = userEvent.setup();
    await renderRoute("/learners");
    await screen.findByText(/The saved data is not readable\./);

    await user.click(screen.getByRole("button", { name: "Export a file" }));
    expect(await screen.findByText(/Use the rescue export for the unreadable data\./)).toBeTruthy();
    expect(blobs).toEqual([]);

    await user.click(screen.getByRole("button", { name: "Export the unreadable data" }));
    expect(await blobs[0]!.text()).toBe(corrupt);
  });

  it("exports the recovery copy separately from the current records", async () => {
    const user = userEvent.setup();
    await renderRoute("/learners");
    await loadSamples(user);
    const replaced = storedText();

    const reduced = createSeedDocument();
    reduced.goalReviews = [];
    chooseFile(
      fakeFile({ size: 500, text: () => Promise.resolve(serializeDocument(reduced)) }).file,
    );
    await confirmReplace(user);
    await screen.findByText("Import complete. The saved records were replaced.");

    await user.click(await screen.findByRole("button", { name: "Export the recovery copy" }));
    expect(
      await screen.findByText("Exported the recovery copy kept from the last replacement."),
    ).toBeTruthy();
    expect(await blobs[0]!.text()).toBe(replaced);

    await user.click(screen.getByRole("button", { name: "Export a file" }));
    const current = await blobs[1]!.text();
    expect(current).toBe(storedText());
    expect(current).not.toBe(replaced);
  });
});
