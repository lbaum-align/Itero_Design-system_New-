# AvatarGroup — sign-off

**Figma node**: `02 Avatars group` `24505:108025` (page "Avatar" `15305:6718`)
**Variants**: 7 — Size 28, 32, 36, 40, 44, 48, 52 (each: 4 image avatars + "+4" counter)
**Status**: ✅ Verified 2026-09-15 (Storybook FigmaMatrix vs Figma screenshot)

## Storybook coverage (`Components/AvatarGroup`)
`Default` · `Size: 28` … `Size: 52` · `AllSizes` (+ extrapolated 60/80) · `Figma matrix (all 7 variants)` · `AllStates` (no overflow, overflow, mixed variants, coloured background) ·
`LargeOverflowCount` · `SingleAvatar` · interaction test `OverflowIsAnnounced`.
Unit tests: `avatar-group.test.tsx` — 9 passing.

## Fixed during audit
- Separator ring: 1px CSS `border` (added 2px to every item, breaking overlap) in `border-inverse` (turns dark in dark mode) → 1px ring drawn outside via box-shadow in `border-on-color-strong`
- "+N" counter was painted *under* the last avatar (Avatar root is `position: relative`) so "+" was hidden → every item is `relative`, later items stack on top as in Figma
- Missing size 52; overlap now from spacing tokens: −12 (28), −16 (32–40), −20 (44), −24 (48, 52)
- Counter: 12/16 (28–36) or 14/20 (40–52) regular `text-inverse` on `bg-inverse`, 4px side padding except at 28 (Figma)
- Counter `aria-label` on a plain `div` (not announced) → `role="img"` "N more"
- Items accept `name` / `variant`; group accepts `aria-label` and `div` HTML attributes; `max` clamped to ≥ 0

## Remaining deviations / Figma inconsistencies
- Each item gets an opaque `bg-layer-01` backing (not in Figma): Initials / Icon avatars use a translucent `bg-highlight-gray`, so overlapping ones would show the avatar beneath. Figma only shows Image avatars in the group.
- Sizes 60 / 80 (legacy `3xl` / `4xl`) are not in Figma; overlap −24 / −32 and counter 14/20 / 16/24 are extrapolated.
- Figma counter text style is named "Body 01" / "Label 01" but overridden to 14/20 / 12/16 — the overrides are implemented.
