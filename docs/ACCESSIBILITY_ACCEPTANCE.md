# Accessibility Acceptance — ULW-AS-001 v1.3

Authority: Adopted Standard. It constrains this build; it is not authored here.

| Requirement | State | How verified |
| --- | --- | --- |
| Semantic landmarks on every view | Confirmed | Automated test asserts banner, navigation, main, contentinfo. |
| Exactly one H1 per view | Confirmed | Automated test per route. |
| Skip link first in tab order, targets main | Confirmed | Keyboard test. |
| Keyboard-only navigation between sections | Confirmed | Keyboard test. |
| Mobile navigation reachable and labelled | Confirmed | Toggle exposes aria-expanded and full link set. |
| Visible dual-color focus indicator | Confirmed (static) | Stylesheet test: 3px outline plus 6px contrasting ring. |
| Status never carried by color alone | Confirmed | Every state chip renders a text label and a text marker. |
| Essential text not truncated | Confirmed | Test rejects truncate and line-clamp utilities in registries. |
| Reduced motion respected | Confirmed (static) | Stylesheet test on prefers-reduced-motion. |
| 200% zoom resilience and responsive reflow | Partial | Layout uses wrapping, fluid grids and no fixed viewport scaling; not yet measured on devices. |
| Screen reader walkthrough | Not Run | Requires manual session. |
| Measured color contrast ratios | Not Run | Requires contrast audit tooling. |

Nothing above may be restated as a compliance claim. Compliance is refused at
this stage.
