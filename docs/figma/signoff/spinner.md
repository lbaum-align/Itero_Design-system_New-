# Spinner — sign-off

**Figma**: `Spinner` set `25:1124` (page `15305:6739`), file `TCdFM9Hy78GHyifCSlkedx`. **Status**: ✅ Verified 2026-09-15.

**Variants**: Size (Mini 20, Small 24, Medium 32, Large 48, X Large 80, 2X Large 96) × On color (False, True) × Phase (1–4) = 48 designed frames. The set holds 56 children because some names are duplicated or wrong, which is why variant properties aren't exposed ("Component set has existing errors").

**Storybook coverage** (`Components/Spinner`): `Default`, `On color: False/True`, `AllSizes`, `AllStates (phases)`, `Figma matrix (all variants)` (Size × On color × Phase), play tests `AnnouncesLoading`, `PhaseFreezesAnimation`.

**Tests**: `spinner.test.tsx`, 13 passing.

## Fixed during audit
- Geometry now matches Figma for each size. The ring is the Figma ellipse size (box − 2.5px, except 2X Large = 96) and the stroke sits inside it.
  - Stroke widths were 2 / 2 / 2.5 / 3 / 4 / 4. Figma is 2px for Mini–Large and 8px for X Large / 2X Large.
- Arc was 135°. Figma is 270° (Mini–Large) or 302.4° (X Large, 2X Large), starting at 9 o'clock and running clockwise, with butt caps (was round).
- Colours: track `border-subtle` / arc `border-strong`; On color track `border-on-color-subtle` / arc `border-on-color-strong`. Before: `gray-alpha-10`, `icon-primary`, `white/20`, `white`.
- Box sizes moved from Tailwind sizes to `--scanner-spinner-size-*` tokens
- Added `phase` prop (Figma "Phase") to freeze the rotation at 0/90/180/270° for visual tests
- Props extend `HTMLAttributes<HTMLDivElement>` (backwards compatible). Button's `size="mini"` loading spinner checked visually.

## Remaining deviations / Figma notes
- Figma set errors:
  - Rows at y=118 and y=354 are named `On color=False` but are drawn white (they're really On color=True).
  - Several X Large / 2X Large variants are named `Phase=1` twice.
  - There are two identical `Size=Medium` rows.
  - Implemented the designed intent: 6 sizes × 2 × 4.
- 2X Large ring fills the whole 96px box, while every other size is inset by 1.25px. Implemented as drawn.
- Animation speed isn't specified in Figma. Uses Tailwind `animate-spin` (1s linear, clockwise, same as the phase order).
- The docs mention only "Small" and "Large" usage; all 6 sizes are implemented.
