# Capability Command View

Route: `/capabilities`. Detail: `/capabilities/{capabilityId}`.

## Views

| View                | Search parameter     | Answers                                          |
| ------------------- | -------------------- | ------------------------------------------------ |
| Registry            | `view=registry`      | What candidate capabilities are recorded?        |
| Domain map          | `view=domains`       | How are they organized, and how many per domain? |
| Dependencies        | `view=dependencies`  | What depends on what, and why?                   |
| Maturity and stages | `view=maturity`      | When must each ability exist?                    |
| Independence        | `view=independence`  | Where may the builder not be the validator?      |
| Trigger gates       | `view=gates`         | What must exist before a threshold is crossed?   |
| Coverage            | `view=coverage`      | How may a capability be held today?              |
| Deliverable types   | `view=deliverables`  | What must capabilities produce?                  |
| Normalization       | `view=normalization` | What judgments shaped the taxonomy?              |

## Filters

`domain`, `type`, `stage`, `gate`, `independence`, `maturity`, and free-text `q`.
All filter state lives in the URL, so a view is shareable, bookmarkable, and
preserved when the operator opens a detail page and returns.

## Accessibility commitments in this view

- One H1 per page; views are sections beneath it.
- The view switcher is a `nav` with `aria-current="page"` on the active view.
- Every filter control has a visible `label`, not a placeholder.
- The result count is announced through `aria-live="polite"`.
- Status is never carried by color alone: stage, gate, independence, authority,
  and verification state each render a text marker and a text label.
- The dependency graph is a table, not a diagram.
- Registry tables scroll horizontally rather than truncating cell text.

## Refusals in this view

The view header states plainly that no readiness percentage, maturity score, or
blended index is calculated. A test asserts the rendered page contains no
percentage figure.
