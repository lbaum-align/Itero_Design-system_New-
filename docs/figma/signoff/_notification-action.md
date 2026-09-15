# _NotificationAction — sign-off

**Figma**: `.Notification action` `34305:10071` (page Notification `15305:6745`) · **Variants**: Type (Link, Button) = 2 · checked against `Toast` `34305:10008` and `.Notification text content` `34305:10065`
**Status**: ✅ Verified 2026-09-15

## Storybook coverage
`Default` (controls per type) · `Type: Link` · `Type: Button` · `Figma matrix (all 2 variants)` (bounds outlined) · `AllStates` (link, external link, two buttons, single button) · `ButtonsWrap` (narrow toast) · `In Toast content (reference layout)` · play tests `LinkKeyboardActivation`, `ButtonsTabAndActivate` (both passing in headless Edge).
Unit tests: `notification-action.test.tsx` — 8 passing.

## Fixed during audit
- Link type: wrapper stretched the link (`items-stretch`) → hugs its content like Figma (`items-start`); one wrapper for all types.
- Props now extend `HTMLAttributes<HTMLDivElement>` (rest props were spread but not typed); `linkText`/button labels accept ReactNode.
- Added `linkExternal` (Link "External") and `secondaryButtonText={null}` for a single-button action (Toast often needs one).
- Keyboard: a link without `href` stays focusable and activates with Enter (via `Link`), matching the Figma docs "Tab navigates between action and the close icon; Enter/Space toggles actions".
- Stories imported `@storybook/test` → `storybook/test`; added play tests and a Toast reference layout.

## Visual comparison
Link 33×44 (Figma 34×44 in Toast instances), Button 247×76 (Figma 264×76 — see below); screenshots match the Toast "Warning" example.

## Remaining deviations / Figma inconsistencies
- Type=Link main component has 18px top padding, but every Toast instance uses 16px (same as Type=Button). Implemented 16px.
- The Type=Button instances inside the set are stale Button instances (2px stroke, 20px side padding, 100px min-width → 128px wide). The current Button spec (1px inset stroke, 16px padding) is used, so each button is ~120px.
- Toast itself is not built yet; the action is placed directly below `.Notification text content` in the content column.
