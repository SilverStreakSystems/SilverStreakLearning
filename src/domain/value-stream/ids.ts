/**
 * Cross-architecture identifier aliases.
 *
 * Value streams reference capabilities by identifier rather than importing the
 * capability fixtures, so the domain layer stays free of fixture data. Tests
 * verify that every referenced identifier resolves against the capability
 * registry.
 */

/** A capability identifier of the form CAP-D01-001. */
export type EnterpriseCapabilityId = string;

/** A value stream identifier of the form VS-01. */
export type ValueStreamId = string;
