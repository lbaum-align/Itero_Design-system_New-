# _Decoration — sign-off

**Figma**: `_Decoration` component set `32583:26851` (page "Logos" `15305:8083`), file `TCdFM9Hy78GHyifCSlkedx`. **Status**: ✅ Built 2026-09-15.

**Variants**: 7 — Color: Gray, Red, Magenta, Purple, Blue, Green, Orange · Icon (instance swap, default "Gift" 24×24). Private (not exported from the package barrel).

**Implementation** (`src/components/_decoration/`): `Decoration` (forwardRef `span`), props `color` (default `gray`), `icon` (`IconName` or node, default `gift`), `label`.
- Fixed 44×44 (`--scanner-decoration-size`, `logos.css`), padding spacing-03 (12px), radius medium, 24px icon centred (Figma: icon overflows the padding box, sits at 10,10 — same with `justify-center`)
- Fill `background-highlight-<color>`; icon `icon-on-highlight-<color>`, Gray → `icon-primary` (all read from Figma bindings)
- Presentational: `aria-hidden` unless `label` is given (`role="img"`)

**Storybook** (`Private/_Decoration`): `Default` (controls), one story per Color, `AllStates` (every colour, light + dark), `FigmaMatrix` (7 variants), `IconSwap`, play test `PresentationalByDefault`.

**Tests**: `decoration.test.tsx`, 10 passing.

**Visual check**: Storybook FigmaMatrix vs Figma set screenshot (the Logos page renders in Align dark mode) — tile size, radius, icon size/position and colour mapping match.

## Deviations / Figma notes
- Figma padding 12px + 24px icon exceeds the 44px box; implemented as Figma (fixed 44px, icon centred).
- No interactive states in Figma.
