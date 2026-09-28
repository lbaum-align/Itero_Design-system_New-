# _NotificationTextContent — sign-off

**Figma**: `.Notification text content` `34305:10065` (page Notification `15305:6745`) · **Variants**: Show title (True, False) = 2 · texts Title / Subtitle / Text value
**Status**: ✅ Built 2026-09-15 (private — not exported from `src/index.ts`)

## API
`showTitle` (default true; title renders only when `title` is set) · `title` · `message` (Figma "Subtitle text value" with a title, "Text value" without) · `titleId` / `messageId` · HTML div attributes, ref, className.

## Implementation
- Title: 18/28 Medium `text-primary` (`.scanner-text-heading-02`); message 18/28 Regular (`.scanner-text-body-02`) in `text-secondary` under a title, `text-primary` alone; 16px gap (`--scanner-spacing-5`). Text wraps, long words break.
- Rendered as `<p>` elements (a notification must not inject headings into the page outline).

## Storybook coverage
`Default` · `Show title: True | False` · `Figma matrix (all 2 variants)` · `AllStates` · `LongContent` · play test `TitleVisibilityTest` (passing in headless Edge).
Unit tests: `notification-text-content.test.tsx` — 5 passing.

## Visual comparison
Matches the text block of every Toast instance (Title 28px line, 16px gap, message 28px line).

## Remaining deviations / Figma inconsistencies
- The main component is stale: Show title=True uses 20/32 text with an 18px gap, Show title=False has a 4px gap. All 8 Toast instances override it to 18/28 with a 16px gap — implemented the instance values.
- "Subtitle text value" and "Text value" are two properties for the same message line (one per variant) → one `message` prop.
