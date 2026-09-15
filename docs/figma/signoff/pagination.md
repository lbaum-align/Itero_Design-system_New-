# Pagination — sign-off

**Figma**: `Pagination` `34178:41697` (page Pagination `34178:39970`) · **Variants**: Size (X-Large, Large, Medium, Small) = 4
**Status**: ✅ Verified 2026-09-15

## Storybook coverage (`Components/Pagination`)
`Default` (interactive, controls) · `Size: X-Large / Large / Medium / Small` · `AllSizes` · `AllStates` (size × first / near start / middle / near end / last / disabled / skeleton) · `Figma matrix (all 4 variants)` · `Few pages (no ellipsis)` · `Many pages (ellipsis)` · `SinglePage` · `Disabled` · `Skeleton` · play tests `ClickPageAndNext`, `ArrowKeysChangePage`, `DisabledIgnoresClicks` (all run to `finished` in the browser). Item states are covered by `Private/_PaginationItem`.
Unit tests: `pagination.test.tsx` — 18 passing (incl. `getVisiblePages`).

## Fixed during audit
- **Prev / Next** now reuse `Button` (Secondary, icon-only, as the Figma instances) sized to the item box 60 / 44 / 36 / 28 — inherits Button's inset strokes, hover/pressed, disabled and focus ring (was a hand-rolled bordered button with an outline focus).
- **Icons**: Figma "Caret left/right" (filled) at 24px (X-Large) / 20px, and Figma "More horizontal" for the "Over" slot (registry `chevron-*` and `more-horizontal` are different glyphs).
- **Ellipsis slot**: 48px wide at X-Large, 20px otherwise, item height, `icon-disabled` (was `icon-secondary`, inconsistent heights).
- **Gap**: 8px (Small 4px) — unchanged; sizes now come from `pagination.css` tokens instead of raw `size-[60px]`/`w-[48px]`.
- **Skeleton**: `bg-disabled` + fixed 9 boxes → `bg-highlight-gray` boxes matching the real item/ellipsis footprint.
- **API/a11y**: extends native `nav` attributes (custom `aria-label`, consumer `onKeyDown` merged); selecting the current page no longer fires `onPageChange`; page-range logic moved to `pagination-range.ts` and unit tested.

## Visual comparison
Rendered `Figma matrix` vs Figma set screenshot (page 1 of 10): prev disabled caret, selected first page, 2–5, "…", 10, next — sizes, gaps, strokes, caret and ellipsis glyphs match all 4 sizes.

## Remaining deviations / Figma inconsistencies
- Figma's Large variant resizes a Large Button instance to 44px; Medium/Small use 36/28px Buttons (our Button's own icon-only sizes are 60/48/36), so the Button is squeezed via `className` to the pagination tokens.
- No Figma documentation frame (keyboard, overflow rules). Implemented: max 7 slots with "…", Tab + Enter/Space, ArrowLeft/ArrowRight for previous/next page.
- Disabled and Skeleton are not Figma variants (kept for backwards compatibility).
