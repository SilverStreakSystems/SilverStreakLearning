/**
 * SSLS 3.0 canon registration tests.
 *
 * These prove the registration refuses to become an approval: no document may
 * carry authority without a recorded owner decision, no reconstruction may be
 * promoted, and no open decision may go missing between a document and the
 * index.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  CANON_AUTHORITY_CLASS,
  authorizedDocuments,
  canonDefects,
  canonicalStatusCounts,
  decisionsByPriority,
  documentsByClass,
  documentsMissingReviewClass,
  reconstructedDocuments,
  type CanonRecord,
} from "@/domain/ssls-3-0/canon";
import {
  canonDocuments,
  decisionsRaisedBy,
  findDocument,
  loadCanon,
  openDecisions,
} from "@/lib/ssls-3-0-registry";
import { ROUTE_REGISTRY } from "@/lib/route-registry";

import { renderRoute } from "./render-route";

const DOCS_DIR = join(process.cwd(), "docs", "ssls-3.0");

function clone(): CanonRecord {
  return JSON.parse(JSON.stringify(loadCanon())) as CanonRecord;
}

describe("SSLS 3.0 canon record", () => {
  it("loads without defects", () => {
    expect(canonDefects(loadCanon())).toEqual([]);
  });

  it("registers all twelve foundation documents", () => {
    const documents = canonDocuments();
    expect(documents).toHaveLength(12);
    expect(documents.map((d) => d.document_id)).toEqual([
      "SSLS3-DOC-00",
      "SSLS3-DOC-01",
      "SSLS3-DOC-02",
      "SSLS3-DOC-03",
      "SSLS3-DOC-04",
      "SSLS3-DOC-05",
      "SSLS3-DOC-06",
      "SSLS3-DOC-07",
      "SSLS3-DOC-08",
      "SSLS3-DOC-09",
      "SSLS3-DOC-10",
      "SSLS3-DOC-11",
    ]);
  });

  it("points every registered document at a file that exists on disk", () => {
    for (const doc of canonDocuments()) {
      const text = readFileSync(join(DOCS_DIR, doc.file_name), "utf8");
      expect(text).toContain(doc.document_id);
    }
  });

  it("carries the index-only authority class", () => {
    expect(loadCanon().authority_class).toBe(CANON_AUTHORITY_CLASS);
  });

  it("grants no document authority", () => {
    expect(authorizedDocuments(loadCanon())).toEqual([]);
    for (const doc of canonDocuments()) {
      expect(doc.canonical_status).toBe("CANDIDATE");
      expect(doc.authorizing_decision).toBeNull();
    }
    expect([...canonicalStatusCounts(loadCanon())]).toEqual([["CANDIDATE", 12]]);
  });

  it("records the three reconstructions rather than hiding them", () => {
    expect(reconstructedDocuments(loadCanon()).map((d) => d.document_id)).toEqual([
      "SSLS3-DOC-08",
      "SSLS3-DOC-09",
      "SSLS3-DOC-10",
    ]);
    // The revised File 00 draft states its own review class, so nothing is missing one.
    expect(documentsMissingReviewClass(loadCanon())).toEqual([]);
  });

  it("carries the owner-supplied revised drafts of files 00, 01, and 02", () => {
    const record = loadCanon();
    const versions = Object.fromEntries(record.documents.map((d) => [d.document_id, d.version]));
    expect(versions["SSLS3-DOC-00"]).toBe("0.6.0-draft");
    expect(versions["SSLS3-DOC-01"]).toBe("0.4.0-draft");
    expect(versions["SSLS3-DOC-02"]).toBe("0.3.0-draft");
    // A newer transcription is still a transcription: authority is unchanged.
    for (const id of ["SSLS3-DOC-00", "SSLS3-DOC-01", "SSLS3-DOC-02"]) {
      const doc = record.documents.find((d) => d.document_id === id);
      expect(doc?.canonical_status).toBe("CANDIDATE");
      expect(doc?.authorizing_decision).toBeNull();
      expect(doc?.provenance).toBe("transcribed");
    }
  });

  it("groups documents by their declared class", () => {
    const grouped = documentsByClass(loadCanon());
    expect(grouped.get("register")).toHaveLength(3);
    expect(grouped.get("navigational")).toHaveLength(1);
  });
});

describe("open decisions", () => {
  it("indexes every open decision exactly once", () => {
    const decisions = openDecisions();
    expect(decisions).toHaveLength(74);
    expect(new Set(decisions.map((d) => d.decision_id)).size).toBe(74);
    for (const decision of decisions) {
      expect(decision.state).toBe("open");
    }
  });

  it("accepts the multi-digit and suffixed identifiers the source documents use", () => {
    const ids = openDecisions().map((d) => d.decision_id);
    // File 01 numbers past nine and inserts a sibling item; both must survive validation.
    expect(ids).toContain("OD-01-10");
    expect(ids).toContain("OD-01-14");
    expect(ids).toContain("OD-01-1A");
    expect(canonDefects(loadCanon())).toEqual([]);
  });

  it("indexes exactly the decisions the documents raise", () => {
    const record = loadCanon();
    const fromDocuments = record.documents.flatMap((d) => d.open_decision_ids).sort();
    const fromIndex = record.open_decisions.map((d) => d.decision_id).sort();
    expect(fromDocuments).toEqual(fromIndex);
  });

  it("resolves the decisions a document raises, in the document's own order", () => {
    expect(decisionsRaisedBy("SSLS3-DOC-04").map((d) => d.decision_id)).toEqual([
      "OD-04-1",
      "OD-04-2",
      "OD-04-3",
    ]);
    expect(decisionsRaisedBy("SSLS3-DOC-99")).toEqual([]);
    expect(findDocument("SSLS3-DOC-99")).toBeUndefined();
  });

  it("keeps the four priority-1 decisions first", () => {
    const grouped = decisionsByPriority(loadCanon());
    expect(grouped.get("1")?.map((d) => d.decision_id)).toEqual([
      "OD-04-1",
      "OD-03-2",
      "OD-02-1",
      "OD-01-1",
    ]);
    expect([...grouped.keys()]).toEqual(["1", "2", "3", "unranked"]);
  });

  it("carries the open-decision count discrepancy rather than correcting it", () => {
    const discrepancy = loadCanon().unresolved_items.find((item) => item.item_id === "U3-001");
    expect(discrepancy).toBeDefined();
    expect(discrepancy?.positions.length).toBeGreaterThanOrEqual(2);
    expect(discrepancy?.routed_to).toBe("OD-08-1");
  });
});

describe("authority refusals", () => {
  it("refuses a CANONICAL document with no authorizing decision", () => {
    const record = clone();
    record.documents[1]!.canonical_status = "CANONICAL";
    expect(canonDefects(record).join(" ")).toContain("CANONICAL without an authorizing owner");
  });

  it("refuses to promote a reconstruction even with a decision attached", () => {
    const record = clone();
    const reconstruction = record.documents.find((d) => d.provenance === "reconstructed")!;
    reconstruction.canonical_status = "CANONICAL";
    reconstruction.authorizing_decision = "D-3001";
    expect(canonDefects(record).join(" ")).toContain("reconstructed document may not be CANONICAL");
  });

  it("refuses an authority class other than index-only", () => {
    const record = clone();
    (record as { authority_class: string }).authority_class = "CONTROLLING";
    expect(canonDefects(record).join(" ")).toContain("registration never confers authority");
  });

  it("refuses a record whose counts disagree with its contents", () => {
    const record = clone();
    record.document_count = 11;
    record.open_decision_count = 1;
    const defects = canonDefects(record).join(" ");
    expect(defects).toContain("document_count 11");
    expect(defects).toContain("open_decision_count 1");
  });

  it("refuses an orphaned or unlisted open decision", () => {
    const dropped = clone();
    dropped.open_decisions = dropped.open_decisions.filter((d) => d.decision_id !== "OD-00-1");
    dropped.open_decision_count = dropped.open_decisions.length;
    expect(canonDefects(dropped).join(" ")).toContain("raises OD-00-1");

    const unlisted = clone();
    unlisted.documents[0]!.open_decision_ids = [];
    expect(canonDefects(unlisted).join(" ")).toContain("not listed by its source document");
  });

  it("refuses a transcription with no named source and a reconstruction with no note", () => {
    const record = clone();
    const transcribed = record.documents.find((d) => d.provenance === "transcribed")!;
    transcribed.source_item_name = null;
    const reconstructed = record.documents.find((d) => d.provenance === "reconstructed")!;
    delete reconstructed.provenance_note;
    const defects = canonDefects(record).join(" ");
    expect(defects).toContain("transcribed provenance requires a named source item");
    expect(defects).toContain("reconstructed provenance requires a note");
  });

  it("refuses an unresolved item that states a single position", () => {
    const record = clone();
    record.unresolved_items[0]!.positions = ["The count is simply wrong."];
    expect(canonDefects(record).join(" ")).toContain("at least two positions");
  });

  it("states its non-effects, including that no claim is authorized", () => {
    const effects = loadCanon().non_effects.join(" ");
    expect(effects).toContain("confers no authority");
    expect(effects).toContain("authorized-claim count remains zero");
    expect(effects).toContain("inherited into SSLS 3.0");
  });
});

describe("canon route", () => {
  it("is registered in the route registry", () => {
    const entry = ROUTE_REGISTRY.find((route) => route.path === "/ssls-3-0");
    expect(entry).toBeDefined();
    expect(entry?.group).toBe("governance");
    expect(entry?.heading).toBe("SSLS 3.0 Canon Index");
  });

  it("renders the non-authority banner above the documents", async () => {
    await renderRoute("/ssls-3-0");
    expect(
      await screen.findByRole("heading", { name: "SSLS 3.0 Canon Index", level: 1 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /index only — non-controlling/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/approves nothing, promotes nothing/i)).toBeInTheDocument();
  });

  it("shows zero documents carrying authority and every open decision", async () => {
    await renderRoute("/ssls-3-0");
    expect(await screen.findByText("Documents carrying authority")).toBeInTheDocument();
    expect(screen.getAllByText("Open owner decisions").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/OD-04-1/).length).toBeGreaterThan(0);
    expect(screen.getByText(/none stated — recorded defect/)).toBeInTheDocument();
  });

  it("offers no control that could record or close a decision", async () => {
    await renderRoute("/ssls-3-0");
    const heading = await screen.findByRole("heading", { name: "SSLS 3.0 Canon Index", level: 1 });
    const page = within(heading.closest("main") ?? document.body);
    expect(page.queryAllByRole("button")).toHaveLength(0);
    expect(page.queryAllByRole("textbox")).toHaveLength(0);
    expect(page.queryAllByRole("checkbox")).toHaveLength(0);
  });
});
