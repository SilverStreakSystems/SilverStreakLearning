# Accessibility requirements and responsive validation

Authority: Working direction. Generated from fixtures.

The target is a WCAG 2.2 AA-informed implementation. This is not an
independent conformance determination.

| Requirement | Minimum |
| --- | --- |
| AC-01 Body contrast | 4.5 to 1 |
| AC-02 Large text contrast | 3 to 1 |
| AC-03 Non-text and focus contrast | 3 to 1 |
| AC-04 Body text | 16px for primary reading |
| AC-05 Touch target | 44 by 44px effective target |
| AC-06 Zoom | 200 percent without loss of essential content |
| AC-07 Reflow | Usable at 320 CSS pixels |
| AC-08 Keyboard | Every interactive element operable; logical focus order |
| AC-09 Focus | Visible on all supported surfaces |
| AC-10 Motion | prefers-reduced-motion respected |
| AC-11 Status | Never color only |
| AC-12 Tables | Headers, captions, and scrolling preserve meaning |
| AC-13 Language | lang metadata; localization-safe strings; RTL-compatible layout |

## Responsive validation matrix

A `clamp()` in the stylesheet is an intention, not a measurement.

| Viewport | Width | Result | Recorded on |
| --- | --- | --- | --- |
| 320 by 568 | 320px | not-run | No run recorded |
| 375 by 667 | 375px | not-run | No run recorded |
| 390 by 844 | 390px | not-run | No run recorded |
| 768 by 1024 | 768px | not-run | No run recorded |
| 1024 by 768 | 1024px | not-run | No run recorded |
| 1280 by 720 | 1280px | not-run | No run recorded |
| 1366 by 768 | 1366px | not-run | No run recorded |
| 1440 by 900 | 1440px | not-run | No run recorded |
| 1920 by 1080 | 1920px | not-run | No run recorded |
