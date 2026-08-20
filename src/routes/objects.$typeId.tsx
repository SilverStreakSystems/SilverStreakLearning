import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { PageHeader, RecordCard, Section } from "@/components/governance/page";
import { AuthorityBadge } from "@/components/governance/authority-badge";
import { Field, SyntheticMarker, ValueList } from "@/components/governance/markers";
import {
  AxisChip,
  CanonicalityChip,
  InstantiabilityChip,
} from "@/components/governance/object-controls";
import {
  DEFAULT_OBJECT_SEARCH,
  parseObjectSearch,
} from "@/components/governance/object-view-model";
import { SHARED_OBJECT_CATALOG } from "@/fixtures";
import {
  DATA_CLASSIFICATION_LABEL,
  OBJECT_FAMILY_META,
  RELATIONSHIP_KIND_META,
  STATE_AXIS_META,
  type RelationshipKind,
} from "@/domain";
import { findObjectType, relationshipsForType } from "@/lib/object-queries";

export const Route = createFileRoute("/objects/$typeId")({
  validateSearch: parseObjectSearch,
  loader: ({ params }) => {
    const record = findObjectType(SHARED_OBJECT_CATALOG, params.typeId);
    if (!record) throw notFound();
    return { record };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Object type unavailable | SSLS" }, { name: "robots", content: "noindex" }],
      };
    }
    const { record } = loaderData;
    const description = `${record.definition} Candidate shared object type in the SSLS enterprise object architecture.`;
    return {
      meta: [
        { title: `${record.name} — shared object type | SSLS` },
        { name: "description", content: description },
        { property: "og:title", content: `${record.name} — shared object type | SSLS` },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  notFoundComponent: ObjectTypeNotFound,
  component: ObjectTypeDetail,
});

function ObjectTypeNotFound() {
  return (
    <div>
      <PageHeader
        title="Object type not found"
        summary="No shared object type matches that identifier. It may have been renamed or removed during normalization."
      />
      <p className="mt-6">
        <Link to="/objects" search={DEFAULT_OBJECT_SEARCH} className="underline underline-offset-4">
          Return to the object catalog
        </Link>
      </p>
    </div>
  );
}

function RelationshipList({
  kinds,
  direction,
}: {
  kinds: RelationshipKind[];
  direction: "source" | "target";
}) {
  if (kinds.length === 0) {
    return <span className="text-muted-foreground">None permitted.</span>;
  }
  return (
    <ul className="list-disc space-y-1 pl-5">
      {kinds.map((kind) => {
        const meta = RELATIONSHIP_KIND_META[kind];
        return (
          <li key={kind}>
            <span className="font-semibold">
              {direction === "source" ? meta.verb : meta.inverseVerb}
            </span>{" "}
            — {meta.meaning}
          </li>
        );
      })}
    </ul>
  );
}

function ObjectTypeDetail() {
  const { record } = Route.useLoaderData();
  const search = Route.useSearch();
  const { asSource, asTarget } = relationshipsForType(record.typeId);

  return (
    <div>
      <p className="mb-4 text-sm">
        <Link to="/objects" search={search} className="underline underline-offset-4">
          Back to the shared object architecture
        </Link>
      </p>

      <PageHeader title={record.name} summary={record.definition}>
        <div className="flex flex-wrap items-center gap-2">
          <AuthorityBadge authorityClass="research-candidate" />
          <CanonicalityChip value={record.canonicality} />
          <InstantiabilityChip value={record.instantiability} />
          <SyntheticMarker />
        </div>
        <p className="measure mt-3 border-l-4 border-border-strong bg-muted p-3 text-sm font-semibold">
          Candidate definition. Future consumers listed on this page are modeled intentions, not
          implemented systems.
        </p>
      </PageHeader>

      <Section id="why" title="Why this object exists">
        <RecordCard>
          <dl className="grid gap-x-6 sm:grid-cols-2">
            <Field label="Reason for existence">{record.reasonForExistence}</Field>
            <Field label="Family">
              {OBJECT_FAMILY_META[record.family].label} —{" "}
              {OBJECT_FAMILY_META[record.family].purpose}
            </Field>
            <Field label="Canonical or derived">
              {record.canonicality} —{" "}
              {record.canonicality === "canonical"
                ? "it owns its facts"
                : "it reflects facts owned elsewhere"}
            </Field>
            <Field label="Owned by capability">{record.ownerCapabilityId}</Field>
            <Field label="Used by capabilities">
              <ValueList items={record.usedByCapabilityIds} />
            </Field>
            <Field label="Why it is shared rather than bounded">{record.sharedRationale}</Field>
          </dl>
        </RecordCard>
      </Section>

      <Section id="fields-and-states" title="Fields and states">
        <RecordCard>
          <dl className="grid gap-x-6 sm:grid-cols-2">
            <Field label="Universal governance fields">
              {record.universalFieldsApply
                ? "All universal fields apply."
                : "Universal fields do not apply."}
            </Field>
            <Field label="Conditional fields">
              <ValueList items={record.conditionalFields} />
            </Field>
            <Field label="State axes in use">
              <div className="flex flex-wrap gap-2">
                {record.stateAxes.map((axis) => (
                  <AxisChip key={axis} axis={axis} />
                ))}
              </div>
            </Field>
            <Field label="What those axes never imply">
              <ValueList
                items={record.stateAxes.map((axis) => STATE_AXIS_META[axis].doesNotImply)}
              />
            </Field>
          </dl>
        </RecordCard>
      </Section>

      <Section id="relationships" title="Permitted and prohibited relationships">
        <RecordCard>
          <dl className="grid gap-x-6 sm:grid-cols-2">
            <Field label="As the source of a relationship">
              <RelationshipList kinds={asSource} direction="source" />
            </Field>
            <Field label="As the target of a relationship">
              <RelationshipList kinds={asTarget} direction="target" />
            </Field>
            <Field label="Prohibited">
              <ValueList
                items={record.prohibitedRelationships}
                empty="Nothing specific beyond the general rules."
              />
            </Field>
          </dl>
        </RecordCard>
      </Section>

      <Section id="data-and-purpose" title="Data classification and purpose">
        <RecordCard>
          <dl className="grid gap-x-6 sm:grid-cols-2">
            <Field label="May carry">
              <ValueList
                items={record.permittedDataClassifications.map((c) => DATA_CLASSIFICATION_LABEL[c])}
              />
            </Field>
            <Field label="Purpose restrictions">
              <ValueList items={record.purposeRestrictions} />
            </Field>
          </dl>
        </RecordCard>
      </Section>

      <Section id="lifecycle" title="Versioning, audit, correction, and archival">
        <RecordCard>
          <dl className="grid gap-x-6 sm:grid-cols-2">
            <Field label="Versioning">{record.versioningRule}</Field>
            <Field label="Audit">{record.auditRule}</Field>
            <Field label="Correction">{record.correctionRule}</Field>
            <Field label="Supersession">{record.supersessionRule}</Field>
            <Field label="Archival or deletion">{record.archivalRule}</Field>
            <Field label="What would validate this model">{record.validationExpectation}</Field>
          </dl>
        </RecordCard>
      </Section>

      <Section
        id="future"
        title="Future consumers"
        description="Modeled intentions only. Nothing listed here is built, authorized, or available."
      >
        <RecordCard>
          <ValueList items={record.futureConsumers} />
        </RecordCard>
      </Section>

      <Section id="open-questions" title="Open questions">
        <RecordCard>
          <ValueList items={record.openQuestions} empty="None recorded for this type." />
        </RecordCard>
      </Section>
    </div>
  );
}
