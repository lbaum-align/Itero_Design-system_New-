# _PaginationItem — sign-off

**Figma**: `_Pagination item` `34178:41733` (page Pagination `34178:39970`) · **Variants**: Size (X-Large, Large, Medium, Small) × State (Enabled, Hovered, Focused, Selected) = 16
**Status**: ✅ Verified 2026-09-15 · private (not in `src/index.ts`)

## Storybook coverage (`Private/_PaginationItem`)
`Default` (controls incl. Forced state) · `Size: X-Large / Large / Medium / Small` · `State: Enabled / Hovered / Focused / Selected` · `AllSizes` · `AllStates` (+ code-only Disabled column) · `Figma matrix (all 16 variants)` · `MultiDigitPages` · play tests `ClickSelectsPage`, `KeyboardActivation`, `SelectedIsCurrentPage` (all run to `finished` in the browser).
Unit tests: `pagination-item.test.tsx` — 12 passing.

## Fixed during audit
- **Sizes**: box 60 / 44 / 36 / 28 now from component tokens (was Tailwind `h-7`/`h-9` and raw `h-[44px]`/`h-[60px]`); padding 12 / 12 / 8 / 4 and radius 8 (Small 4) unchanged.
- **Typography**: X-Large 16/24 (was raw `text-[16px]`), others 14/20 via tokens (was Tailwind `text-sm`).
- **Stroke**: 1px drawn inside (inset shadow) instead of a CSS border; Hovered `border-subtle-hover` (was `border-hover` = accent-hovered); Selected `border-interactive`.
- **Focused**: 2px `border-focus` ring 4px outside with radius 12 (Small 8), like Button (was an outline); forceable via `data-state="hovered|focused"` (previously ignored).
- Props now extend native button attributes (`aria-label` override, `data-state`); `aria-disabled` added.

## Visual comparison
Rendered `Figma matrix` vs Figma set screenshot: sizes, radii, strokes per state, focus ring offset/radius and typography match for all 16 variants.

## Remaining deviations / Figma inconsistencies
- Disabled is not a Figma state; kept for disabled Pagination (`border-disabled` + `text-disabled`).
- Selected + hover / focus combinations are not drawn in Figma; Selected keeps `border-interactive` on hover and gains the focus ring on focus.
