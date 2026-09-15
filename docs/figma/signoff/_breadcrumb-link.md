# _BreadcrumbLink — sign-off

**Figma**: `_Breadcrumb link` `25889:49863` (page Breadcrumbs `15305:6720`) · **Variants**: State (Enabled, Hovered, Focused, Disabled, Skeleton) × Show divider = 10 · Private (not in `src/index.ts`)
**Status**: ✅ Verified 2026-09-15

## Storybook coverage (`Private/_BreadcrumbLink`)
`Default` (controls incl. Show divider + Forced state) · `Enabled` · `Hovered` · `Focused` · `Disabled` · `Skeleton` · `Show divider: False` · `CurrentPage` · `AllStates` · `Figma matrix (all variants)` · play tests `KeyboardActivation` (Enter + Space), `DisabledIsInert`.
Unit tests: `breadcrumb-link.test.tsx` — 8 passing.

## Fixed during audit
- Colour text-primary → **text-secondary**; typography `.scanner-text-body-02` 18/28 (was 17px + invalid `font-[var(...)]` weight class).
- Hovered: underline only (colour unchanged), `data-state="hovered"` support.
- Focused: 1px `border-focus` stroke outside the label via box-shadow (was outline), `data-state="focused"` support.
- Disabled: text-tertiary → **text-disabled**; href removed, `aria-disabled`, `tabIndex=-1`, clicks prevented.
- Skeleton: `bg-hover` rounded bar → `bg-highlight-gray` 12px bar at 90% opacity, sized to the label (min 91px), no radius.
- Divider: chevron-right icon → "|" text, text-tertiary, 8px gap; `showDivider` (Figma name) with `showSeparator` kept as deprecated alias.
- Space key activates the link (Figma keyboard docs).
- Shared link classes moved to `breadcrumb-link.styles.ts`.

## Visual comparison
Measured: label 90.2×28 (Figma 91×28), item with divider 102.6×28 (Figma 104), colours rgba(0,0,0,.63) / disabled .23, focus ring rgb(0,154,206) 1px, skeleton bar 12px — matches Figma screenshot.

## Remaining deviations / Figma inconsistencies
- Figma Skeleton label frame is 16px tall (row stays 28px only because of the divider); code keeps 28px so rows don't jump.
- `isCurrent` (plain-text current page) is not a Figma variant of this component; it lives in `Breadcrumbs` in Figma.
