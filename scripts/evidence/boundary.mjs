/**
 * Boundary controls: secret exposure and PII posture.
 *
 * These are the two boundaries the current posture depends on. Both are
 * conservative: a detection is reported as a candidate requiring review, and
 * a clean run is reported as "no match by these patterns", never as proof of
 * absence.
 */
import { readFileSync, statSync } from "node:fs";

import { computeExpiry } from "./expiry.mjs";
import { inputSetFor } from "./inputs.mjs";
import { createEvidenceRecord } from "./schema.mjs";
import { nowIso, sha256, trackedFiles } from "./util.mjs";

const BINARY_SUFFIXES = [
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".ico",
  ".woff",
  ".woff2",
  ".ttf",
  ".otf",
  ".pdf",
  ".zip",
  ".lockb",
];

const MAX_BYTES = 2 * 1024 * 1024;

/** Paths whose whole purpose is to describe the controls, so they self-match. */
const SELF_REFERENTIAL = ["scripts/evidence/", "docs/wp-037/", "docs/trust/", "docs/wp-006/"];

const SECRET_PATTERNS = [
  { id: "aws-access-key-id", label: "AWS access key id", pattern: /\bAKIA[0-9A-Z]{16}\b/g },
  { id: "github-token", label: "GitHub token", pattern: /\bgh[pousr]_[A-Za-z0-9]{36,}\b/g },
  { id: "openai-key", label: "OpenAI-style key", pattern: /\bsk-[A-Za-z0-9]{32,}\b/g },
  { id: "slack-token", label: "Slack token", pattern: /\bxox[abprs]-[A-Za-z0-9-]{10,}\b/g },
  { id: "google-api-key", label: "Google API key", pattern: /\bAIza[0-9A-Za-z_-]{35}\b/g },
  { id: "private-key-block", label: "Private key block", pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/g },
  {
    id: "supabase-service-key",
    label: "Service-role style key",
    pattern: /\bsb_secret_[A-Za-z0-9_-]{20,}\b/g,
  },
  {
    id: "jwt",
    label: "JSON Web Token",
    pattern: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g,
  },
  {
    id: "generic-assigned-secret",
    label: "Assigned credential literal",
    pattern:
      /\b(?:api[_-]?key|secret|password|passwd|token|client[_-]?secret)\b\s*[:=]\s*["'][^"'\n]{12,}["']/gi,
  },
];

const PII_PATTERNS = [
  {
    id: "email-address",
    label: "Email address",
    pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
    allow: /(example\.(com|org|net)|invalid|localhost|@types|\.local)/i,
  },
  {
    id: "us-phone",
    label: "Telephone number",
    pattern: /\b(?:\+1[-. ]?)?\(?\d{3}\)?[-. ]\d{3}[-. ]\d{4}\b/g,
  },
  { id: "ssn", label: "National identifier pattern", pattern: /\b\d{3}-\d{2}-\d{4}\b/g },
  {
    id: "date-of-birth",
    label: "Date-of-birth field",
    pattern: /\b(?:date[_ -]?of[_ -]?birth|dob|birthdate)\b/gi,
  },
  {
    id: "student-identifier",
    label: "Student identifier field",
    pattern: /\b(?:student[_ -]?(?:id|ssn|number)|state[_ -]?student[_ -]?id)\b/gi,
  },
];

function readable(path) {
  if (BINARY_SUFFIXES.some((suffix) => path.endsWith(suffix))) return false;
  try {
    return statSync(path).size <= MAX_BYTES;
  } catch {
    return false;
  }
}

function isSelfReferential(path) {
  return SELF_REFERENTIAL.some((prefix) => path.startsWith(prefix));
}

function scan(files, patterns, { skipSelfReferential }) {
  const matches = [];
  let scanned = 0;

  for (const file of files) {
    if (!readable(file)) continue;
    if (skipSelfReferential && isSelfReferential(file)) continue;
    scanned += 1;
    let content;
    try {
      content = readFileSync(file, "utf8");
    } catch {
      continue;
    }
    const lines = content.split("\n");
    for (const { id, label, pattern, allow } of patterns) {
      lines.forEach((line, index) => {
        pattern.lastIndex = 0;
        const found = line.match(pattern);
        if (!found) return;
        for (const value of found) {
          if (allow && allow.test(value)) continue;
          matches.push({
            file,
            line: index + 1,
            pattern_id: id,
            pattern_label: label,
            // Never write the matched value into an artifact.
            redacted_digest: sha256(value).slice(0, 16),
            disposition: "CANDIDATE - REQUIRES REVIEW",
          });
        }
      });
    }
  }

  return { scanned, matches };
}

function base(context, evidenceType, fields) {
  const timestamp = nowIso();
  return createEvidenceRecord({
    evidence_type: evidenceType,
    commit_sha: context.commit,
    tree_hash: context.treeHash,
    environment: context.environment,
    timestamp,
    expires_at: computeExpiry(evidenceType, timestamp),
    input_set: inputSetFor(evidenceType, context.inputSets),
    producer: context.producer,
    producer_type: "pipeline",
    method: "automated",
    independent: false,
    synthetic_data_only: true,
    ...fields,
  });
}

export function collectSecretScan(context) {
  const files = context.files ?? trackedFiles();
  const { scanned, matches } = scan(files, SECRET_PATTERNS, { skipSelfReferential: true });
  const payload = {
    scope: "Git-tracked files in the current tree, excluding the scanner's own pattern definitions.",
    files_scanned: scanned,
    patterns: SECRET_PATTERNS.map((p) => ({ id: p.id, label: p.label })),
    matches,
    limitations: [
      "Pattern matching only. A credential in an unrecognised format is not detected.",
      "Untracked files, Git history, and any external system are out of scope.",
      "No match means no match by these patterns. It is not proof that no secret exists.",
    ],
  };
  const content = JSON.stringify(payload, null, 2);

  return {
    record: base(context, "SECRET_SCAN", {
      evidence_id: "EV-SECRET",
      title: "Secret exposure scan over the tracked tree",
      description: "Pattern scan for credential-shaped literals. Matched values are never recorded.",
      tool: "scripts/evidence/boundary.mjs",
      tool_version: "1.0.0",
      command: "bun run evidence:run",
      expected_result: "No credential-shaped literal in the tracked tree.",
      actual_result: `${scanned} files scanned; ${matches.length} candidate matches.`,
      status: matches.length > 0 ? "review-required" : "pass",
      supports: [
        "That the declared patterns produced the recorded number of candidate matches over the scanned scope.",
      ],
      does_not_support: [
        "That no secret exists. Detection is pattern-bound, and history and untracked files are out of scope.",
      ],
      artifact_path: "boundary/secret-scan.json",
      artifact_hash: sha256(content),
      reproduction: "bun run evidence:run",
    }),
    artifact: { path: "boundary/secret-scan.json", content },
    matches,
  };
}

export function collectPiiBoundaryScan(context) {
  const files = context.files ?? trackedFiles();
  const { scanned, matches } = scan(files, PII_PATTERNS, { skipSelfReferential: true });

  const fixtureMatches = matches.filter((match) => match.file.startsWith("src/fixtures/"));
  const payload = {
    boundary: "Zero real personal data. All fixture data is synthetic and flagged synthetic.",
    scope: "Git-tracked files in the current tree, excluding the scanner's own pattern definitions.",
    files_scanned: scanned,
    patterns: PII_PATTERNS.map((p) => ({ id: p.id, label: p.label })),
    matches,
    fixture_matches: fixtureMatches.length,
    limitations: [
      "Pattern matching cannot distinguish real personal data from synthetic data that resembles it.",
      "Every match is a candidate for human review, not a determination that personal data is present.",
      "Absence of matches does not establish that the boundary holds; it establishes that these patterns did not fire.",
    ],
  };
  const content = JSON.stringify(payload, null, 2);

  return {
    record: base(context, "PII_BOUNDARY_SCAN", {
      evidence_id: "EV-PII",
      title: "Personal-data boundary scan over the tracked tree",
      description:
        "Pattern scan supporting the zero-real-PII boundary. Matched values are recorded only as digests.",
      tool: "scripts/evidence/boundary.mjs",
      tool_version: "1.0.0",
      command: "bun run evidence:run",
      expected_result: "No personal-data-shaped content outside declared synthetic fixtures.",
      actual_result: `${scanned} files scanned; ${matches.length} candidate matches, of which ${fixtureMatches.length} are inside declared synthetic fixtures.`,
      status: matches.length > 0 ? "review-required" : "pass",
      supports: [
        "That the declared patterns produced the recorded candidate matches over the scanned scope.",
      ],
      does_not_support: [
        "That the repository contains no personal data, and that any match is or is not real personal data.",
      ],
      artifact_path: "boundary/pii-boundary-scan.json",
      artifact_hash: sha256(content),
      reproduction: "bun run evidence:run",
    }),
    artifact: { path: "boundary/pii-boundary-scan.json", content },
    matches,
  };
}

export { PII_PATTERNS, SECRET_PATTERNS };
