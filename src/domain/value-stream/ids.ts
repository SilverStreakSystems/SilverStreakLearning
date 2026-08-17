/**
 * Cross-architecture identifier aliases.
 *
 * Value streams reference capabilities by identifier rather than importing the
 * capability fixtures, so the domain layer stays free of fixture data. Tests
 * verify that every referenced identifier resolves against the capability
 * registry. Value stream identifiers themselves stay canonical: they come from
 * `VALUE_STREAMS` in the capability architecture.
 */

/** A capability identifier of the form CAP-D01-001. */
export type EnterpriseCapabilityId = string;
