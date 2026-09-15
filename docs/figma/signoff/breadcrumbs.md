# Breadcrumbs — sign-off

**Figma**: `Breadcrumbs` `21114:1171` (page Breadcrumbs `15305:6720`) · **Properties**: Show current page (bool), Show overflow (bool)
**Status**: ✅ Verified 2026-09-15

## Storybook coverage
`Default` · `Show current page: True` · `Show overflow: True` · `AllStates` (enabled / disabled item / skeleton) · `Figma matrix (all variants)` (current page × overflow) · `LongTrailWraps` · play tests `KeyboardNavigation`, `OverflowExpands`.
Unit tests: `breadcrumbs.test.tsx` — 9 passing.

## Fixed during audit
- Divider: chevron icon → "|" text in text-tertiary (via `_BreadcrumbLink`).
- Link colour text-primary → text-secondary; 18/28 body-02 (was `text-md` 17px).
- Divider rules per Figma: dividers between links, none after the last link and none before the current page.
- Added `showCurrentPage` (Figma prop); default inferred from last item without `href` so PageHeader usage is unchanged.
- Added `showOverflow` + `maxVisibleItems`: collapses middle levels behind a "…" button (docs: "collapse earlier links… using an ellipsis"); click/Enter expands and moves focus to the first revealed link.
- Added `skeleton`, per-item `disabled` / `onClick`, custom `aria-label`, HTML attribute passthrough.

## Visual comparison
Matrix screenshot vs Figma Demo frame (`25890:50508`): identical layout — 8px gaps, "|" dividers, current page in text-primary with no divider before it.

## Remaining deviations / Figma inconsistencies
- Main component's hidden "Current page" text uses Body/$tp-body-01 14/20; the page Demo overrides it to body-02 18/28. Implemented 18/28 (matches links).
- No divider before the current page (component and Demo agree) — looks like a possible design oversight; flagged for design review.
- "Show overflow" is not bound to any layer in Figma; overflow UI (ellipsis button, expand-in-place) is derived from the documentation text, not from a drawn design.
