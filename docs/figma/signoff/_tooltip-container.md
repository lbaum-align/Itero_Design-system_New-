# _TooltipContainer — sign-off

**Figma**: `_Tooltip container` `24150:41017` (page "Tooltip" `15305:6754`), file `TCdFM9Hy78GHyifCSlkedx` · Private (not in `src/index.ts`)
**Variants**: 1 (Text value).

## Storybook coverage (`Private/_TooltipContainer`)
`Default` (Text value control) · `Figma matrix (1 variant)` · `AllStates` (min width, default, wraps at 320px, unbroken word).
Unit tests: `tooltip-container.test.tsx` (3).

## Fixed during audit
- Removed the built-in CSS-border arrow (6px, wrong size and colour source) — Figma's container has no caret; the 8×4 caret belongs to `01 Tooltip` (`TooltipBubble`)
- Removed the invented `shadow-depth-01` (Figma container has no effect)
- Text 17px (`text-md`) → Body 01 16/24 (`text-base` / `leading-md`)
- Hard-coded `max-w-[320px] min-w-[44px]` → component tokens; text min width 28px added
- Props now extend `HTMLAttributes<HTMLDivElement>`; `role="tooltip"` / `id` moved to `Tooltip` (the element that is shown/hidden). `position` prop removed (private, only `Tooltip` used it); `TooltipPosition` type still exported for form groups.

## Component tokens (`src/tokens/components/tooltip.css`)
`--scanner-tooltip-min-width` (44px), `--scanner-tooltip-max-width` (320px), `--scanner-tooltip-text-min-width` (28px).

## Visual check
Storybook vs Figma `24150:41017` / `01 Tooltip` screenshot: bubble 116×40 for "Text message", radius 8, `#262626` fill, white 16/24 text — matches.

## Remaining deviations / Figma notes
- Figma text max width is 288px; implied by 320px container − 2×8px padding, so not tokenised separately.
- Dark-mode token values not visually verified against Figma.
