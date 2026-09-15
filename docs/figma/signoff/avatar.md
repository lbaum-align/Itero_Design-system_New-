# Avatar — sign-off

**Figma node**: `01 Avatar` `20920:34` (page "Avatar" `15305:6718`)
**Variants**: 36 = Variant (Image, Initials, Icon) × Size (28, 32, 36, 40, 44, 48, 52, 60, 80) × State=Enabled (27) + State=Skeleton × 9 sizes · component prop Show status
**Status**: ✅ Verified 2026-09-15 (Storybook FigmaMatrix vs Figma set screenshot)

## Storybook coverage (`Components/Avatar`)
`Default` · `Variant: Image` / `Variant: Initials` / `Variant: Icon` · `Show status: True` · `StatusOnEveryVariant` · `StatusOnColouredBackground` ·
`State: Skeleton` · `AllSizes` · `AllStates` · `Figma matrix (all 36 variants + status)` · `InitialsFromName` · `ImageErrorFallback` · `LegacySizeNames` ·
interaction tests `AccessibleName`, `SkeletonIsHidden`.
Unit tests: `avatar.test.tsx` — 18 passing.

## Fixed during audit
- Missing Figma size **52** → `size` now takes Figma pixel values (28…80); legacy names (`extra-small` … `4xl`) still accepted
- Initials / Icon background: opaque `bg-tertiary` → `bg-highlight-gray` + 1px inside `border-highlight-gray` stroke (inset shadow)
- Initials typography: hardcoded `text-[16px]` / `text-md` (17px) → Heading 01 (28–36), Heading 02 (40–60), Heading 03 (80), `text-primary`
- Icon: registry `user` (filled person) in `icon-tertiary` → Figma outline "User" glyph in `icon-primary`; sizes 16 (28/32), 20 (36/40), 24 (44–60), 32 (80) — 44 was 20px
- Status: dot with a 2px `bg-primary` border and ad-hoc offsets (+3/+5px inside at 60/80) → Figma cut-out: the avatar is masked with a transparent 2px gap around the dot (works on any background); dot 6/8/10px, 1px from the edge (2px at 32)
- Status colour `status-success` → `icon-success` (Figma)
- Skeleton `bg-tertiary` → `bg-highlight-gray` (pulse)
- Hardcoded `size-[28px]`… → `--scanner-avatar-size-*` tokens (`avatar.css`)
- A11y: `role="img"` + `aria-label` on the root for every variant, status included in the name ("Jane Doe (online)"); broken-image state resets when `src` changes
- Added `name` (initials derived per Figma rule: first letter of up to two words), `variant` override, `showStatus` (Figma "Show status"); accepts `div` HTML attributes

## Remaining deviations / Figma inconsistencies
- Figma set has errors ("Component set has existing errors"): the 52px Initials, Icon and Skeleton variants are named `Size=80`, duplicating the real 80px names.
- 60 / 80px variants: the status instance was never moved (10px at 41,41 — inside the avatar) while the cut-out mask was scaled. Implemented dots of 12px (60) and 16px (80), 1px from the edge, following the scaled mask.
- Initials / Icon at 52, 60, 80 lack the `border-highlight-gray` stroke that 28–48 have — stroke applied at every size (majority).
- 32px status dot sits 2px from the edge, 1px at every other size — implemented as in Figma.
- Figma `_Status` defines Online only; `offline` / `away` / `busy` are kept code extensions.
- Docs text says "seven sizes"; the set has nine (28–80).
- Shared icon registry `user` is a different glyph, so Avatar renders a private `UserGlyph` (exact Figma paths).
- Dark-mode values come from semantic tokens; not compared against a Figma dark screenshot.

> **Update (icon registry audit):** local Figma glyph copies in this component were moved into the shared icon registry (`src/icons/registry.tsx`, exact Figma exports); rendered output is unchanged. See [icons.md](icons.md).
