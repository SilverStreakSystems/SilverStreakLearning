import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Cell,
  PageHeader,
  RecordCard,
  RegistryTable,
  RowHeader,
  Section,
} from "@/components/governance/page";
import { AuthorityBadge } from "@/components/governance/authority-badge";
import { Field, GatedPanel, SyntheticMarker, ValueList } from "@/components/governance/markers";
import {
  AxisChip,
  CanonicalityChip,
  InstantiabilityChip,
  ObjectFilterBar,
  ObjectViewTabs,
} from "@/components/governance/object-controls";
import { parseObjectSearch, type ObjectSearch } from "@/components/governance/object-view-model";
import {
  EXAMPLE_AUTHORIZATION_RULES,
  EXAMPLE_CLAIMS,
  EXAMPLE_CONTEXT_PACKAGES,
  EXAMPLE_DELIVERABLES,
  EXAMPLE_EVIDENCE,
  EXAMPLE_HANDOFFS,
  EXAMPLE_PROJECTION_DEFINITIONS,
  EXAMPLE_WORK_ITEMS,
  OBJECT_NORMALIZATION_FINDINGS,
  RELATIONSHIP_NORMALIZATION_FINDINGS,
  SHARED_OBJECT_CATALOG,
} from "@/fixtures";
import {
  AUTHORIZATION_INPUTS,
  AUTHORIZATION_INPUT_META,
  AUTHORIZATION_PRINCIPLES,
  CONTEXT_ASSEMBLY_STEPS,
  CONTEXT_ASSEMBLY_STEP_META,
  CONTEXT_PACKAGE_RULES,
  CONTEXT_PACKAGE_STATUSES,
  CONTEXT_PACKAGE_STATUS_META,
  CONDITIONAL_METADATA_FIELDS,
  DELIVERABLE_RULES,
  EVIDENCE_CONFIDENCE,
  EVIDENCE_CONFIDENCE_META,
  HISTORY_RULES,
  KNOWLEDGE_SEPARATION_RULES,
  KNOWLEDGE_TYPES,
  KNOWLEDGE_TYPE_META,
  NORMALIZATION_DISPOSITION_LABEL,
  OBJECT_NORMALIZATION_ISSUE_LABEL,
  PROHIBITED_MONITORING_FIELDS,
  RELATIONSHIP_KINDS,
  RELATIONSHIP_KIND_META,
  RELATIONSHIP_NORMALIZATION_ISSUE_LABEL,
  SHARED_EVIDENCE_TYPES,
  SHARED_EVIDENCE_TYPE_LABEL,
  STATE_AXES,
  STATE_AXIS_META,
  UNIVERSAL_METADATA_FIELDS,
  VERSION_BOUND_EVIDENCE_TYPES,
  WORK_TYPES,
  WORK_TYPE_LABEL,
  validateClaims,
  validateEvidence,
  validateWorkItems,
  type SharedObjectTypeRecord,
} from "@/domain";
import { familyGroups, filterObjectTypes } from "@/lib/object-queries";

export const Route = createFileRoute("/objects/")({
  validateSearch: parseObjectSearch,
  head: () => ({
    meta: [
      { title: "Shared Enterprise Object Architecture v0.1 (Candidate) | SSLS" },
      {
        name: "description",
        content:
          "Candidate shared object, context, work, and evidence architecture for SSLS: object catalog, typed relationships, independent state axes, and context assembly.",
      },
      {
        property: "og:title",
        content: "Shared Enterprise Object Architecture v0.1 (Candidate) | SSLS",
      },
      {
        property: "og:description",
        content:
          "Governed candidate object model. No record here carries implementation authority.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ObjectArchitectureView,
});

function ObjectArchitectureView() {
  const navigate = Route.useNavigate();
  const search = Route.useSearch();
  const filtered = filterObjectTypes(SHARED_OBJECT_CATALOG, search);

  const updateSearch = (next: Partial<ObjectSearch>) => {
    void navigate({ search: (prev) => ({ ...prev, ...next }), replace: true });
  };

  return (
    <div>
      <PageHeader
        title="Shared Enterprise Object Architecture (Candidate)"
        summary={`${SHARED_OBJECT_CATALOG.length} governed object types, their permitted relationships, their independent state axes, and the contracts for work, deliverables, evidence, and context assembly.`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <AuthorityBadge authorityClass="research-candidate" />
          <SyntheticMarker />
        </div>
        <p className="mt-3 rounded-md border-l-4 border-border-strong bg-muted p-3 text-sm font-semibold">
          Version 0.1, candidate. No storage, no schema migration, and no authorization engine
          exists. Every example record is invented. Context assembly is modeled as a logical
          contract and is not permission to send anything to a model.
        </p>
      </PageHeader>

      <ObjectViewTabs current={search.view} search={search} />
      {search.view === "catalog" || search.view === "types" ? (
        <ObjectFilterBar search={search} resultCount={filtered.length} onChange={updateSearch} />
      ) : null}

      {search.view === "catalog" ? <CatalogView records={filtered} search={search} /> : null}
      {search.view === "types" ? <TypesView records={filtered} /> : null}
      {search.view === "relationships" ? <RelationshipView /> : null}
      {search.view === "states" ? <StateView /> : null}
      {search.view === "work" ? <WorkView /> : null}
      {search.view === "deliverables" ? <DeliverableView /> : null}
      {search.view === "evidence" ? <EvidenceView /> : null}
      {search.view === "context" ? <ContextView /> : null}
      {search.view === "authorization" ? <AuthorizationView /> : null}
      {search.view === "lifecycle" ? <LifecycleView records={SHARED_OBJECT_CATALOG} /> : null}
      {search.view === "normalization" ? <NormalizationView /> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ catalog */

function CatalogView({
  records,
  search,
}: {
  records: SharedObjectTypeRecord[];
  search: ObjectSearch;
}) {
  return (
    <Section
      id="object-catalog"
      title="Object catalog"
      description="Every governed object type, what it is, whether it owns its facts, and whether records may exist under the current posture."
    >
      {records.length === 0 ? (
        <p className="rounded-md border border-border bg-surface p-4 text-sm">
          No object types match the current filters.
        </p>
      ) : (
        <RegistryTable
          caption="Shared object catalog"
          headers={["Object type", "Family", "Owns its facts", "Records now", "Why it exists"]}
        >
          {records.map((record) => (
            <tr key={record.typeId}>
              <RowHeader>
                <Link
                  to="/objects/$typeId"
                  params={{ typeId: record.typeId }}
                  search={search}
                  className="underline underline-offset-4"
                >
                  {record.name}
                </Link>
                <span className="mt-1 block font-mono text-xs font-normal text-muted-foreground">
                  {record.typeId}
                </span>
              </RowHeader>
              <Cell>{record.family}</Cell>
              <Cell>
                <CanonicalityChip value={record.canonicality} />
              </Cell>
              <Cell>
                <InstantiabilityChip value={record.instantiability} />
              </Cell>
              <Cell className="measure">{record.reasonForExistence}</Cell>
            </tr>
          ))}
        </RegistryTable>
      )}
    </Section>
  );
}

function TypesView({ records }: { records: SharedObjectTypeRecord[] }) {
  const groups = familyGroups(records);

  return (
    <Section
      id="object-types"
      title="Object types by family"
      description="Families group types for reading. A family is descriptive and carries no authority of its own."
    >
      <div className="space-y-6">
        {groups.map((group) => (
          <RecordCard key={group.family}>
            <h3 className="font-display text-lg font-semibold">{group.label}</h3>
            <p className="measure mt-1 text-sm text-muted-foreground">{group.purpose}</p>
            <ul className="mt-3 space-y-3">
              {group.records.map((record) => (
                <li key={record.typeId} className="border-t border-border pt-3">
                  <p className="font-semibold">{record.name}</p>
                  <p className="measure mt-1 text-sm">{record.definition}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <CanonicalityChip value={record.canonicality} />
                    <InstantiabilityChip value={record.instantiability} />
                    {record.stateAxes.map((axis) => (
                      <AxisChip key={axis} axis={axis} />
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </RecordCard>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------ relationships */

function RelationshipView() {
  return (
    <>
      <Section
        id="relationship-kinds"
        title="Typed relationships"
        description="Relationships are typed, directional, and constrained. A generic association would absorb every edge and explain none."
      >
        <RegistryTable
          caption="Relationship kinds"
          headers={["Verb", "Inverse", "Cardinality", "Meaning", "Does not imply"]}
        >
          {RELATIONSHIP_KINDS.map((kind) => {
            const meta = RELATIONSHIP_KIND_META[kind];
            return (
              <tr key={kind}>
                <RowHeader>{meta.verb}</RowHeader>
                <Cell>{meta.inverseVerb}</Cell>
                <Cell>{meta.cardinality}</Cell>
                <Cell className="measure">{meta.meaning}</Cell>
                <Cell className="measure">{meta.doesNotImply}</Cell>
              </tr>
            );
          })}
        </RegistryTable>
      </Section>

      <Section
        id="relationship-rejections"
        title="Rejected edges"
        description="Four conditions are rejected outright, in the model and in the validation helper."
      >
        <ValueList
          items={[
            "Self-links: an object may never point at itself, in any relationship kind.",
            "Duplicate active edges: the same kind between the same two objects may exist once.",
            "Impossible type combinations: each kind declares which source and target types are permitted.",
            "Destructive deletion: history-preserving edges are end-dated, never removed.",
          ]}
        />
      </Section>
    </>
  );
}

/* ------------------------------------------------------------------- states */

function StateView() {
  return (
    <>
      <Section
        id="state-axes"
        title="Independent state axes"
        description="There is no single status field. Each axis answers a different question and moves on its own."
      >
        <RegistryTable
          caption="State axes"
          headers={["Axis", "Question", "Values", "Never implies"]}
        >
          {STATE_AXES.map((axis) => {
            const meta = STATE_AXIS_META[axis];
            return (
              <tr key={axis}>
                <RowHeader>{meta.label}</RowHeader>
                <Cell className="measure">{meta.question}</Cell>
                <Cell>
                  <ul className="space-y-0.5 font-mono text-xs">
                    {meta.values.map((value) => (
                      <li key={value}>{value}</li>
                    ))}
                  </ul>
                </Cell>
                <Cell className="measure">{meta.doesNotImply}</Cell>
              </tr>
            );
          })}
        </RegistryTable>
      </Section>

      <Section
        id="metadata-fields"
        title="Governance metadata"
        description="Universal fields apply to every consequential object. Conditional fields apply only where the family calls for them."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <RecordCard>
            <h3 className="font-display text-lg font-semibold">Universal fields</h3>
            <ValueList items={[...UNIVERSAL_METADATA_FIELDS]} />
          </RecordCard>
          <RecordCard>
            <h3 className="font-display text-lg font-semibold">Conditional fields</h3>
            <ValueList items={[...CONDITIONAL_METADATA_FIELDS]} />
          </RecordCard>
        </div>
      </Section>
    </>
  );
}

/* --------------------------------------------------------------------- work */

function WorkView() {
  const violations = validateWorkItems(EXAMPLE_WORK_ITEMS);

  return (
    <>
      <Section
        id="work-types"
        title="One work contract"
        description="Task, review, remediation, and obligation differ by type, not by schema. That is what makes cross-functional dependency possible later."
      >
        <ul className="flex flex-wrap gap-2">
          {WORK_TYPES.map((type) => (
            <li
              key={type}
              className="rounded-sm border border-border bg-surface px-2 py-1 text-xs font-semibold"
            >
              {WORK_TYPE_LABEL[type]}
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="work-examples"
        title="Worked examples"
        description="Invented records, including one that deliberately has no served object."
      >
        <RegistryTable
          caption="Example work items"
          headers={["Work item", "Purpose", "Serves", "Workflow state", "Completion result"]}
        >
          {EXAMPLE_WORK_ITEMS.map((item) => (
            <tr key={item.workItemId}>
              <RowHeader>
                {item.title}
                <span className="mt-1 block font-mono text-xs font-normal text-muted-foreground">
                  {item.workItemId} · {WORK_TYPE_LABEL[item.workType]}
                </span>
              </RowHeader>
              <Cell className="measure">{item.purpose}</Cell>
              <Cell className="measure">
                {item.servedObjectId ?? (
                  <span>
                    <span className="font-mono text-xs">[EXCEPTION]</span>{" "}
                    {item.servedObjectException}
                  </span>
                )}
              </Cell>
              <Cell>{item.workflowState}</Cell>
              <Cell className="measure">{item.completionResult ?? "Not complete."}</Cell>
            </tr>
          ))}
        </RegistryTable>
        <p className="mt-3 text-sm font-semibold">
          {violations.length === 0
            ? "No work item violates the purpose or served-object rules."
            : `${violations.length} work items would be surfaced as findings.`}
        </p>
      </Section>

      <Section
        id="handoffs"
        title="Handoffs"
        description="A handoff is a typed edge with terms attached, not a separate object. Nothing is ever accepted by elapsed time."
      >
        {EXAMPLE_HANDOFFS.map((handoff) => (
          <RecordCard key={handoff.handoffId}>
            <h3 className="font-display text-lg font-semibold">
              {handoff.sendingRoleId} to {handoff.receivingRoleId}
            </h3>
            <dl className="mt-2 grid gap-x-6 sm:grid-cols-2">
              <Field label="Object handed off">{handoff.objectId}</Field>
              <Field label="Required state on send">{handoff.requiredStateOnSend}</Field>
              <Field label="Evidence that must accompany it">
                <ValueList items={handoff.requiredAccompanyingEvidenceIds} />
              </Field>
              <Field label="Acceptance criteria">
                <ValueList items={handoff.acceptanceCriteria} />
              </Field>
              <Field label="If rejected">{handoff.rejectionPath}</Field>
              <Field label="If overdue">{handoff.overduePath}</Field>
              <Field label="Accepted">
                {handoff.accepted ? "Yes" : "Not accepted. No receiver exists in founder mode."}
              </Field>
            </dl>
          </RecordCard>
        ))}
      </Section>

      <Section
        id="command-center-prep"
        title="Command Center data contract"
        description="Shared objects are shaped so incoming, internal, and outgoing projections become possible later. No command center is built."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <RecordCard>
            <h3 className="font-display text-base font-semibold">Incoming</h3>
            <ValueList
              items={[
                "Requests",
                "Dependencies",
                "Reviews",
                "Approvals",
                "Escalations",
                "Commitments",
              ]}
            />
          </RecordCard>
          <RecordCard>
            <h3 className="font-display text-base font-semibold">Internal</h3>
            <ValueList
              items={["Work", "Deliverables", "Decisions", "Risks", "Evidence", "Findings"]}
            />
          </RecordCard>
          <RecordCard>
            <h3 className="font-display text-base font-semibold">Outgoing</h3>
            <ValueList
              items={[
                "Deliverables",
                "Commitments",
                "Decisions",
                "Handoffs",
                "Unresolved dependencies",
                "Evidence",
              ]}
            />
          </RecordCard>
        </div>
        <div className="mt-4">
          <GatedPanel
            title="Fields that will never exist"
            notice="These are refused by design, not deferred. Operational visibility must not become surveillance."
          >
            <ValueList items={PROHIBITED_MONITORING_FIELDS} />
          </GatedPanel>
        </div>
      </Section>
    </>
  );
}

/* -------------------------------------------------------------- deliverable */

function DeliverableView() {
  return (
    <>
      <Section
        id="deliverable-rules"
        title="Required versus produced"
        description="A deliverable type says what must exist. A deliverable instance is the artifact that was actually produced."
      >
        <ValueList items={DELIVERABLE_RULES.map((rule) => `${rule.id}: ${rule.rule}`)} />
      </Section>

      <Section id="deliverable-examples" title="Worked example">
        {EXAMPLE_DELIVERABLES.map((deliverable) => (
          <RecordCard key={deliverable.deliverableId}>
            <h3 className="font-display text-lg font-semibold">{deliverable.title}</h3>
            <dl className="mt-2 grid gap-x-6 sm:grid-cols-2">
              <Field label="Deliverable type">{deliverable.deliverableTypeId}</Field>
              <Field label="Purpose">{deliverable.purpose}</Field>
              <Field label="Accountable role">{deliverable.accountableRoleId}</Field>
              <Field label="Required reviewer">
                {deliverable.requiredReviewerRoleId ?? "None named."}
              </Field>
              <Field label="Workflow state">{deliverable.workflowState}</Field>
              <Field label="Validation state">{deliverable.validationState}</Field>
              <Field label="Evidence state">{deliverable.evidenceState}</Field>
              <Field label="Approval state">{deliverable.approvalState}</Field>
              <Field label="Canonical artifact">
                {deliverable.artifactReferenceId ?? "Not produced."}
              </Field>
              <Field label="Version">{deliverable.currentVersion}</Field>
            </dl>
            <p className="measure mt-3 border-l-4 border-border-strong pl-3 text-sm font-semibold">
              Complete and unapproved at the same time. Finishing work never approves it.
            </p>
          </RecordCard>
        ))}
      </Section>
    </>
  );
}

/* ----------------------------------------------------------------- evidence */

function EvidenceView() {
  const violations = validateEvidence(EXAMPLE_EVIDENCE);
  const claimViolations = validateClaims(EXAMPLE_CLAIMS);

  return (
    <>
      <Section
        id="evidence-types"
        title="Evidence types"
        description="Types marked version-bound are meaningless without the version and environment they examined."
      >
        <RegistryTable caption="Evidence types" headers={["Type", "Version-bound"]}>
          {SHARED_EVIDENCE_TYPES.map((type) => (
            <tr key={type}>
              <RowHeader>{SHARED_EVIDENCE_TYPE_LABEL[type]}</RowHeader>
              <Cell>
                {VERSION_BOUND_EVIDENCE_TYPES.includes(type)
                  ? "Yes — version and environment required"
                  : "No — records its own date and source"}
              </Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>

      <Section id="evidence-confidence" title="Confidence labels">
        <dl className="grid gap-3 sm:grid-cols-3">
          {EVIDENCE_CONFIDENCE.map((level) => {
            const meta = EVIDENCE_CONFIDENCE_META[level];
            return (
              <div key={level} className="rounded-md border border-border bg-surface p-3">
                <dt className="font-semibold">
                  <span aria-hidden="true" className="font-mono text-xs">
                    {meta.marker}
                  </span>{" "}
                  {meta.label}
                </dt>
                <dd className="measure mt-1 text-sm text-muted-foreground">{meta.meaning}</dd>
              </div>
            );
          })}
        </dl>
      </Section>

      <Section id="evidence-examples" title="Worked evidence records">
        <RegistryTable
          caption="Example evidence"
          headers={[
            "Evidence",
            "Proposition",
            "Version and environment",
            "Confidence",
            "Limitations",
          ]}
        >
          {EXAMPLE_EVIDENCE.map((record) => (
            <tr key={record.evidenceId}>
              <RowHeader>
                {SHARED_EVIDENCE_TYPE_LABEL[record.evidenceType]}
                <span className="mt-1 block font-mono text-xs font-normal text-muted-foreground">
                  {record.evidenceId}
                </span>
              </RowHeader>
              <Cell className="measure">{record.propositionSupported}</Cell>
              <Cell className="measure">
                {record.subjectVersion ?? "Not applicable"}
                {record.environment ? ` · ${record.environment}` : ""}
              </Cell>
              <Cell>{EVIDENCE_CONFIDENCE_META[record.confidence].label}</Cell>
              <Cell className="measure">
                <ValueList items={record.limitations} />
              </Cell>
            </tr>
          ))}
        </RegistryTable>
        <p className="mt-3 text-sm font-semibold">
          {violations.length === 0
            ? "Every example evidence record satisfies its version-binding rule."
            : `${violations.length} evidence records would be refused.`}
        </p>
      </Section>

      <Section
        id="claims"
        title="Claims"
        description="No claim may exceed its evidence. A claim contradicted by an open finding may not be approved."
      >
        <RegistryTable
          caption="Example claims"
          headers={[
            "Exact wording",
            "Evidence",
            "Contradicted by",
            "Approval state",
            "Prohibited wording",
          ]}
        >
          {EXAMPLE_CLAIMS.map((claim) => (
            <tr key={claim.claimId}>
              <RowHeader>{claim.exactWording}</RowHeader>
              <Cell>
                {claim.supportingEvidenceIds.length === 0
                  ? "None"
                  : claim.supportingEvidenceIds.join(", ")}
              </Cell>
              <Cell>
                {claim.contradictingFindingIds.length === 0
                  ? "Nothing recorded"
                  : claim.contradictingFindingIds.join(", ")}
              </Cell>
              <Cell>{claim.approvalState}</Cell>
              <Cell className="measure">
                <ValueList items={claim.prohibitedWording} empty="None recorded." />
              </Cell>
            </tr>
          ))}
        </RegistryTable>
        <p className="mt-3 text-sm font-semibold">
          {claimViolations.length === 0
            ? "No example claim exceeds its evidence."
            : `${claimViolations.length} claims would be refused.`}
        </p>
      </Section>

      <Section
        id="knowledge"
        title="Research and knowledge"
        description="Source, research, finding, interpretation, requirement, and decision are kept apart on purpose."
      >
        <RegistryTable
          caption="Knowledge types"
          headers={["Type", "Obligatory", "How it changes", "Lifecycle note"]}
        >
          {KNOWLEDGE_TYPES.map((type) => {
            const meta = KNOWLEDGE_TYPE_META[type];
            return (
              <tr key={type}>
                <RowHeader>{meta.label}</RowHeader>
                <Cell>{meta.obligatory ? "Yes" : "No"}</Cell>
                <Cell className="measure">{meta.changeRule}</Cell>
                <Cell className="measure">{meta.lifecycleNote}</Cell>
              </tr>
            );
          })}
        </RegistryTable>
        <div className="mt-4">
          <ValueList items={KNOWLEDGE_SEPARATION_RULES.map((rule) => `${rule.id}: ${rule.rule}`)} />
        </div>
      </Section>
    </>
  );
}

/* ------------------------------------------------------------------ context */

function ContextView() {
  return (
    <>
      <Section
        id="context-assembly"
        title="Universal context assembly"
        description="Candidate architecture. The steps run in order; skipping one is a governance failure, not a shortcut."
      >
        <ol className="space-y-3">
          {CONTEXT_ASSEMBLY_STEPS.map((step, index) => {
            const meta = CONTEXT_ASSEMBLY_STEP_META[step];
            return (
              <li key={step} className="rounded-md border border-border bg-surface p-3">
                <p className="font-semibold">
                  <span className="font-mono text-xs">{index + 1}.</span> {meta.label}
                </p>
                <p className="measure mt-1 text-sm">{meta.question}</p>
                <p className="measure mt-1 text-sm text-muted-foreground">
                  If skipped: {meta.failureIfSkipped}
                </p>
              </li>
            );
          })}
        </ol>
      </Section>

      <Section id="context-rules" title="What a context package is not">
        <ValueList items={CONTEXT_PACKAGE_RULES.map((rule) => `${rule.id}: ${rule.rule}`)} />
      </Section>

      <Section id="context-statuses" title="Package statuses">
        <dl className="grid gap-3 sm:grid-cols-2">
          {CONTEXT_PACKAGE_STATUSES.map((status) => {
            const meta = CONTEXT_PACKAGE_STATUS_META[status];
            return (
              <div key={status} className="rounded-md border border-border bg-surface p-3">
                <dt className="font-semibold">
                  <span aria-hidden="true" className="font-mono text-xs">
                    {meta.marker}
                  </span>{" "}
                  {meta.label}
                </dt>
                <dd className="measure mt-1 text-sm text-muted-foreground">{meta.meaning}</dd>
              </div>
            );
          })}
        </dl>
      </Section>

      <Section
        id="context-example"
        title="Worked context package"
        description="A deliberately imperfect example: it is conflicted, it names what is missing, and it expires."
      >
        {EXAMPLE_CONTEXT_PACKAGES.map((pkg) => (
          <RecordCard key={pkg.contextPackageId}>
            <h3 className="font-display text-lg font-semibold">{pkg.purpose}</h3>
            <p className="measure mt-2 border-l-4 border-border-strong pl-3 text-sm font-semibold">
              Status: {CONTEXT_PACKAGE_STATUS_META[pkg.status].label}. This package is not a source
              of truth.
            </p>
            <dl className="mt-2 grid gap-x-6 sm:grid-cols-2">
              <Field label="Requesting actor">{pkg.requestingActorId}</Field>
              <Field label="Acting capacity">{pkg.actingCapacityId}</Field>
              <Field label="Relationship basis">{pkg.relationshipBasis}</Field>
              <Field label="Policy basis">
                <ValueList items={pkg.policyBasis} />
              </Field>
              <Field label="Included fields">
                <ValueList items={pkg.sourceProjections.flatMap((p) => p.includedFields)} />
              </Field>
              <Field label="Excluded sensitive fields">
                <ValueList
                  items={pkg.sourceProjections.flatMap((p) =>
                    p.excludedSensitiveFields.map((f) => `${f.field} — ${f.reason}`),
                  )}
                />
              </Field>
              <Field label="Missing information">
                <ValueList items={pkg.missingInformation} />
              </Field>
              <Field label="Conflicts">
                <ValueList items={pkg.conflicts} />
              </Field>
              <Field label="Uncertainty">
                <ValueList items={pkg.uncertainty} />
              </Field>
              <Field label="Reuse restrictions">
                <ValueList items={pkg.reuseRestrictions} />
              </Field>
              <Field label="Generated">{pkg.generatedAt}</Field>
              <Field label="Expires">{pkg.expiresAt ?? "Does not expire."}</Field>
            </dl>
          </RecordCard>
        ))}
      </Section>

      <Section id="projection-definitions" title="Projection definitions">
        <RegistryTable
          caption="Context projection definitions"
          headers={[
            "Definition",
            "Source type",
            "Allowed fields",
            "Forbidden fields",
            "Classification ceiling",
          ]}
        >
          {EXAMPLE_PROJECTION_DEFINITIONS.map((definition) => (
            <tr key={definition.projectionDefinitionId}>
              <RowHeader>{definition.name}</RowHeader>
              <Cell>{definition.sourceObjectTypeId}</Cell>
              <Cell className="measure">{definition.allowedFields.join(", ")}</Cell>
              <Cell className="measure">{definition.forbiddenFields.join(", ")}</Cell>
              <Cell>{definition.maxDataClassification}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>
    </>
  );
}

/* ------------------------------------------------------------ authorization */

function AuthorizationView() {
  return (
    <>
      <Section
        id="authorization-inputs"
        title="Eight inputs, not one role"
        description="Role alone never authorizes. Each input below answers a question, and omitting any one causes a specific failure."
      >
        <RegistryTable caption="Authorization inputs" headers={["Input", "Question", "If omitted"]}>
          {AUTHORIZATION_INPUTS.map((input) => {
            const meta = AUTHORIZATION_INPUT_META[input];
            return (
              <tr key={input}>
                <RowHeader>{meta.label}</RowHeader>
                <Cell className="measure">{meta.question}</Cell>
                <Cell className="measure">{meta.ifOmitted}</Cell>
              </tr>
            );
          })}
        </RegistryTable>
      </Section>

      <Section id="authorization-principles" title="Principles">
        <ValueList items={AUTHORIZATION_PRINCIPLES.map((rule) => `${rule.id}: ${rule.rule}`)} />
      </Section>

      <Section
        id="authorization-rules"
        title="Declared rules"
        description="Two rules exist because two are enough. No engine is built before the need is real."
      >
        {EXAMPLE_AUTHORIZATION_RULES.map((rule) => (
          <RecordCard key={rule.ruleId} className="mb-4">
            <h3 className="font-display text-lg font-semibold">{rule.name}</h3>
            <p className="measure mt-1 text-sm">{rule.statement}</p>
            <dl className="mt-2 grid gap-x-6 sm:grid-cols-2">
              <Field label="Required inputs">
                <ValueList
                  items={rule.requiredInputs.map((input) => AUTHORIZATION_INPUT_META[input].label)}
                />
              </Field>
              <Field label="Default outcome">{rule.defaultOutcome}</Field>
              <Field label="Does not grant">
                <ValueList items={rule.doesNotGrant} />
              </Field>
              <Field label="Authority note">{rule.authorityNote}</Field>
            </dl>
          </RecordCard>
        ))}
      </Section>
    </>
  );
}

/* ---------------------------------------------------------------- lifecycle */

function LifecycleView({ records }: { records: SharedObjectTypeRecord[] }) {
  return (
    <>
      <Section
        id="history-rules"
        title="History is never rewritten"
        description="A wrong record is superseded and stays readable, so an old decision can still be understood on its own terms."
      >
        <RegistryTable caption="History rules" headers={["Rule", "Why"]}>
          {HISTORY_RULES.map((rule) => (
            <tr key={rule.id}>
              <RowHeader>{rule.rule}</RowHeader>
              <Cell className="measure">{rule.rationale}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>

      <Section
        id="lifecycle-by-type"
        title="Correction, supersession, and archival by type"
        description="How each type is corrected depends on whether it owns its facts."
      >
        <RegistryTable
          caption="Lifecycle rules by object type"
          headers={["Object type", "Correction", "Supersession", "Archival"]}
        >
          {records.map((record) => (
            <tr key={record.typeId}>
              <RowHeader>{record.name}</RowHeader>
              <Cell className="measure">{record.correctionRule}</Cell>
              <Cell className="measure">{record.supersessionRule}</Cell>
              <Cell className="measure">{record.archivalRule}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>
    </>
  );
}

/* ------------------------------------------------------------ normalization */

function NormalizationView() {
  return (
    <>
      <Section
        id="object-normalization"
        title="Object normalization findings"
        description="What was considered, what was decided, and what the decision costs. Most are reversible."
      >
        <RegistryTable
          caption="Object normalization findings"
          headers={["Candidate", "Issue", "Disposition", "Judgment", "Cost", "Reversible"]}
        >
          {OBJECT_NORMALIZATION_FINDINGS.map((finding) => (
            <tr key={finding.findingId}>
              <RowHeader>
                {finding.candidateName}
                <span className="mt-1 block font-mono text-xs font-normal text-muted-foreground">
                  {finding.findingId}
                </span>
              </RowHeader>
              <Cell>{OBJECT_NORMALIZATION_ISSUE_LABEL[finding.issue]}</Cell>
              <Cell>{NORMALIZATION_DISPOSITION_LABEL[finding.disposition]}</Cell>
              <Cell className="measure">{finding.judgment}</Cell>
              <Cell className="measure">{finding.costOfDecision}</Cell>
              <Cell>{finding.reversible ? "Yes" : "No"}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>

      <Section id="relationship-normalization" title="Relationship normalization findings">
        <RegistryTable
          caption="Relationship normalization findings"
          headers={["Candidate verb", "Issue", "Resolved as", "Judgment", "Cost"]}
        >
          {RELATIONSHIP_NORMALIZATION_FINDINGS.map((finding) => (
            <tr key={finding.findingId}>
              <RowHeader>{finding.candidateVerb}</RowHeader>
              <Cell>{RELATIONSHIP_NORMALIZATION_ISSUE_LABEL[finding.issue]}</Cell>
              <Cell>{finding.resolvedKind ?? "Not modeled"}</Cell>
              <Cell className="measure">{finding.judgment}</Cell>
              <Cell className="measure">{finding.costOfDecision}</Cell>
            </tr>
          ))}
        </RegistryTable>
      </Section>
    </>
  );
}
