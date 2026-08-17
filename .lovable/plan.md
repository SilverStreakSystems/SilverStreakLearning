# Remediation Sequence Before Prompt 006

Audit-only run. No code, docs, routes, or configuration were changed. This file records the recommended remediation order that follows from the audit findings.

## R1 — Reconcile the current-truth document (Critical)

`docs/CURRENT_STATE.md` still describes a ten-view Prompt 001/002 shell. It does not mention shared objects, value streams, the brand/experience system, or the workspace layer. It is the one document whose purpose is to state current truth, and it is wrong.

Rewrite it to cover all five increments, or generate it from fixtures the way value-stream and workspace docs already are.

## R2 — Close the SSOT split between the two workspace models (High)

`src/fixtures/future-workspaces.ts` (9 gated future workspaces, rendered at `/future-architecture`) and `src/fixtures/workspace/workspaces.ts` (9 workspace definitions, rendered at `/workspaces`) model the same nine organizational surfaces under two independent schemas that can drift apart silently.

Pick one canonical source. Preferred: keep `WORKSPACES` canonical and derive the future-architecture view from it, retiring `FUTURE_WORKSPACES`.

## R3 — Extend rendering and accessibility coverage to dynamic routes (High)

`ROUTE_REGISTRY` drives the single-H1, landmark, and boundary-banner tests, and it lists static routes only. `/workspaces/$workspaceId` and `/design-system/templates/$templateId` are never rendered by any test, so no ULW-AS-001 evidence exists for them.

Add render tests for every dynamic route, including a not-found parameter case for each.

## R4 — Record the accessibility checks that have not been run (High)

`docs/ACCESSIBILITY_ACCEPTANCE.md` correctly marks screen reader walkthrough and measured contrast ratios as Not Run, and 200% zoom as Partial. Those three remain unevidenced across the whole shell.

Either run automated axe checks plus a scripted 200%-zoom reflow capture and record the results, or leave them Not Run and make sure no later prompt treats them as satisfied. Do not infer human review.

## R5 — Complete the Prompt 005 test point set (Medium)

25 workspace invariants exist against a stated 31 points. Identify the six unaddressed points and either implement them or record them as explicitly deferred with a reason.

## R6 — Add a governed doc set for Prompt 001 and 002 parity (Low)

Prompts 003, 004, and 005 each have a generated `docs/` set. Prompt 001 and 002 material lives in eight loose root files and `docs/capability-architecture/`. Normalize the layout so every increment is discoverable the same way.

## Prompt 006 eligibility

Prompt 006 may start after R1 and R2 only. Both concern truth and single-source-of-truth integrity, and any new increment built on a stale current-state document or a duplicated workspace model inherits the drift. R3 through R6 can run in parallel with Prompt 006 work.
