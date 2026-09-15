# _Status — sign-off

**Figma node**: `_Status` `20920:33` (page "Avatar" `15305:6718`) — private, not exported from the package
**Variants**: 1 — State=Online (16×16 ellipse, `Icons interactive/icon-success`)
**Status**: ✅ Verified 2026-09-15

## Storybook coverage (`Private/_Status`)
`Default` · `State: Online` · `Figma matrix (1 variant)` · `AllSizes` (6/8/10/12/16) · `AllStates` (online + extensions) · interaction test `HasAccessibleLabel`.
Unit tests: `status.test.tsx` — 4 passing.

## Fixed during audit
- Removed the 2px `bg-primary` border (Figma has none; Avatar cuts a transparent gap instead)
- Colour `status-success` → `icon-success`; extensions use `icon-warning` / `icon-error` / `icon-tertiary`
- Sizes: `small/medium/large` = 8/12/16 → Figma pixel sizes 6, 8, 10 (Avatar) plus 12, 16; legacy names kept; default is now 16 (the Figma component size)
- `role="status"` (a live region — wrong for a static dot) → `role="img"` with label; `label={null}` hides it when the parent announces it (Avatar)
- Accepts `span` HTML attributes

## Remaining deviations / Figma inconsistencies
- `offline`, `away`, `busy` are not in Figma.
- Default size changed 12px → 16px (component is private; only Avatar uses it and always passes a size).
