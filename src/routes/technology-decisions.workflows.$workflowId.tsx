import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/governance/page";
import {
  EvaluationPanel,
  PlanningScopeNotice,
  SourceValue,
  SubNav,
  SubNavLink,
} from "@/components/technology-decisions/parts";
import type { DerivedAnswer, QuestionId, SourceField } from "@/domain/technology-decisions";
import { SOURCE_FIELDS } from "@/domain/technology-decisions";
import { analyzedWorkflowById, questionPrompt } from "@/lib/technology-decision-registry";

const FIELD_LABEL: Record<SourceField, string> = {
  role: "Role",
  responsibilities: "Responsibilities",
  workflow: "Workflow",
  inputs: "Inputs",
  outputs: "Outputs",
  system_of_record: "System of record",
  rules_based_option: "Rules-based option",
  google_workspace_option: "Google Workspace option",
  automation_option: "Automation option",
  ssls_application_need: "SSLS application need",
  ai_contribution: "AI contribution",
  ai_necessity: "AI necessity",
  human_approval: "Human approval",
  permissions: "Permissions",
  risk_level: "Risk level",
  audit_evidence: "Audit evidence",
  recommended_solution: "Recommended solution",
  future_maturity_provisional: "Future maturity (provisional)",
};

export const Route = createFileRoute("/technology-decisions/workflows/$workflowId")({
  loader: ({ params }) => {
    const item = analyzedWorkflowById(params.workflowId);
    if (!item) throw notFound();
    return {
      workflow: item.record.source.workflow || item.record.workflow_id,
      group: item.record.role_group_name,
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Workflow unavailable | SSLS" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.workflow} | SSLS`;
    const description = `Supplied analysis and derived minimum effective solution for the ${loaderData.workflow} workflow in ${loaderData.group}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  notFoundComponent: WorkflowNotFound,
  component: WorkflowPage,
});

function WorkflowNotFound() {
  return (
    <PageHeader title="Workflow not found" summary="No analyzed workflow carries that identifier.">
      <SubNav>
        <SubNavLink to="/technology-decisions/roles">All role groups</SubNavLink>
      </SubNav>
    </PageHeader>
  );
}

function WorkflowPage() {
  const { workflowId } = Route.useParams();
  const item = analyzedWorkflowById(workflowId);
  if (!item) return <WorkflowNotFound />;

  const { record, evaluation, derived, drift } = item;
  const source = record.source;
  const derivation = Object.entries(derived) as Array<[QuestionId, DerivedAnswer]>;

  return (
    <div>
      <PageHeader
        title={source.workflow || record.workflow_id}
        summary={`${record.role_group_name} — ${source.role}. The supplied analysis is shown verbatim and is never edited. The derived result is computed separately and may disagree with it.`}
      >
        <PlanningScopeNotice />
        <SubNav>
          <SubNavLink to={`/technology-decisions/roles/${record.role_group_id}`}>
            {record.role_group_name}
          </SubNavLink>
          <SubNavLink to="/technology-decisions/process">Decision process</SubNavLink>
        </SubNav>
      </PageHeader>

      <Section
        id="derived"
        title="Derived analysis"
        description="Produced by the deterministic evaluator from the answers below. No model was consulted."
      >
        <EvaluationPanel evaluation={evaluation} />
        <p className="measure mt-4 text-sm text-muted-foreground">
          Comparison with the supplied recommendation: <strong>{drift.status}</strong>.{" "}
          {drift.explanation}
        </p>
      </Section>

      <Section
        id="answers"
        title="How the answers were derived"
        description="Each answer is read mechanically from the supplied fields named beside it. Nothing here is inferred by a model."
      >
        <dl className="grid gap-3 sm:grid-cols-2">
          {derivation.map(([questionId, entry]) => (
            <div key={questionId} className="rounded-md border border-border bg-surface p-3">
              <dt className="text-sm font-semibold">{questionPrompt(questionId)}</dt>
              <dd className="mt-1 text-sm">
                <span className="font-semibold">{entry.value}</span>
                <span className="mt-1 block text-muted-foreground">{entry.basis}</span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  Read from:{" "}
                  {entry.basisFields.length > 0
                    ? entry.basisFields.map((field) => FIELD_LABEL[field]).join(", ")
                    : "No supplied field carried an answer"}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section
        id="source"
        title="Supplied analysis, verbatim"
        description="Owner-supplied future-state input, preserved exactly as provided — including the recommendation the evaluator may disagree with."
      >
        <dl className="rounded-md border border-border bg-surface px-4 py-2">
          {SOURCE_FIELDS.map((field) => (
            <SourceValue key={field} label={FIELD_LABEL[field]} value={source[field]} />
          ))}
        </dl>
        <p className="measure mt-3 text-xs text-muted-foreground">
          Source: {record.source_artifact_id}, worksheet {record.source_worksheet}, row{" "}
          {record.source_row}. Row digest {record.source_row_sha256.slice(0, 16)}…
        </p>
      </Section>
    </div>
  );
}
