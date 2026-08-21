# Accessibility Acceptance — ULW-AS-001 v1.3

Authority: Adopted Standard. It constrains this build; it is not authored here.

| Requirement                                | State              | How verified                                                                                  |
| ------------------------------------------ | ------------------ | --------------------------------------------------------------------------------------------- |
| Semantic landmarks on every view           | Confirmed          | Automated test asserts banner, navigation, main, contentinfo.                                 |
| Exactly one H1 per view                    | Confirmed          | Automated test per route.                                                                     |
| Skip link first in tab order, targets main | Confirmed          | Keyboard test.                                                                                |
| Keyboard-only navigation between sections  | Confirmed          | Keyboard test.                                                                                |
| Mobile navigation reachable and labelled   | Confirmed          | Toggle exposes aria-expanded and full link set.                                               |
| Visible dual-color focus indicator         | Confirmed (static) | Stylesheet test: 3px outline plus 6px contrasting ring.                                       |
| Status never carried by color alone        | Confirmed          | Every state chip renders a text label and a text marker.                                      |
| Essential text not truncated               | Confirmed          | Test rejects truncate and line-clamp utilities in registries.                                 |
| Reduced motion respected                   | Confirmed (static) | Stylesheet test on prefers-reduced-motion.                                                    |
| 200% zoom resilience and responsive reflow | Partial            | Layout uses wrapping, fluid grids and no fixed viewport scaling; not yet measured on devices. |
| Screen reader walkthrough                  | Not Run            | Requires manual session.                                                                      |
| Measured color contrast ratios             | Not Run            | Requires contrast audit tooling.                                                              |

Nothing above may be restated as a compliance claim. Compliance is refused at
this stage.

## Touch-target acceptance rule (derived)

Derived from the canonical record `data/accessibility/touch-target-rule.json`.
The full projection is `docs/accessibility/TOUCH_TARGET_ACCEPTANCE.md`. Edit the
canonical record, not this section.

| Item                                                                                                               | State     | How verified                                                                        |
| ------------------------------------------------------------------------------------------------------------------ | --------- | ----------------------------------------------------------------------------------- |
| TTR-001 v1.0.0 rule defined: 44 by 44 CSS pixel SHOULD default, 24 by 24 CSS pixel MUST floor                      | Confirmed | Structured record validated against its Draft 2020-12 schema and domain invariants. |
| Five documented SC 2.5.8 exceptions enumerated: spacing, equivalent control, inline, user-agent control, essential | Confirmed | Automated test asserts each type appears exactly once.                              |
| Compact-target departure band 24 to 43 CSS pixels, rationale required, never below the floor                       | Confirmed | Automated classification test.                                                      |
| TTR-001 verification protocol executed against this interface at 320, 768, and 1366 CSS pixels                     | Not Run   | No target has been measured, classified, or recorded. Carried as FND-024.           |

Defining this rule measures no target in this build and asserts no accessibility
conformance. HREQ-025 remains NEEDS-EVIDENCE / DEFER and is not adopted.
