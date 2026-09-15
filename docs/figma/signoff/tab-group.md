# TabGroup — sign-off

**Figma**: `Tab group` `25501:14769` (page Tab `15305:6750`) · **Variants**: Scrollable=False (1) · Show previews · Show next
**Status**: ✅ Verified 2026-09-15

## Storybook coverage
`Default` (uncontrolled) · `Figma matrix (Scrollable=False)` · `Controlled` · `AllStates` (all item states + badges) · `ManyTabs` (12 slots) · play tests `ArrowKeyNavigation` (Right/Left wrap, skip disabled, Home/End), `ClickSelects`.
Unit tests: `tab-group.test.tsx` — 8 passing.

## Fixed during audit
- oxlint rules-of-hooks errors in stories: hooks moved into a named `InteractiveTabs` component.
- Removed the container `border-b` — Figma group has no stroke (PageHeader draws its own dashed line).
- Arrow keys only called `onChange` and never moved focus → now move focus (roving tabindex), wrap, **skip disabled tabs**; Home/End go to first/last enabled tab.
- Clicking a disabled tab no longer fires `onChange`; the child's own `onClick` is preserved (was overwritten).
- Added uncontrolled mode (`defaultActiveIndex`), `activationMode` (`automatic` | `manual`), `aria-orientation`, HTML attribute passthrough (`aria-label`).
- Stories import from `storybook/test` (was `@storybook/test`).

## Visual comparison
3-tab group measured 242×60 with 16px gap (Figma 245×60, text sub-pixel), matches Figma screenshot.

## Remaining deviations / Figma inconsistencies
- "Show previews" and "Show next" booleans aren't bound to any layer and Scrollable has only `False`; no scroll arrows are defined, so nothing is implemented for them.
