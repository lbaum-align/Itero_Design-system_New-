# Logo — sign-off

**Figma**: `Logo` component set `13355:4609` (page "Logos" `15305:8083`), file `TCdFM9Hy78GHyifCSlkedx`. **Status**: ✅ Built 2026-09-15.

**Variants**: 8 — Variation: Align (default), Align X-ray insight, Invisalign, Invisalign first, iTero, Vivera retainers, iTero + Exocad, All logos. All 28px tall.

**Implementation** (`src/components/logo/`): `Logo` (forwardRef inline `svg`), props `variation`, `height` (default 28, width scales), `label`, `decorative`. `logoLabels` gives the default accessible names ("Align", "Align X-ray Insights", "Invisalign", "Invisalign First", "iTero", "Vivera Retainers", "iTero and exocad", "Align, Invisalign, iTero and exocad"). `role="img"` + `aria-label`; `decorative` → `aria-hidden`.

**Artwork** (`logo-artwork.ts`, generated): the SVG assets from the earlier session (`.claude/worktrees/agent-ac7efd6d0aedf3699/src/components/logo/assets/`) were verified against a fresh `exportAsync({ format: 'SVG_STRING' })` of every variant — path count and an FNV-1a digest of the joined path data are identical for all 8, so their path data is used.

**Colours — no hex needed**: every vector-network region in Figma is bound to a variable, so the logos are theme tokens, not fixed brand hex: wordmarks `icon-primary`, the Align dot `icon-link`, Invisalign star rays `icon-secondary` (8) / `icon-tertiary` (8). The region → token order was read from Figma and matches export path order. (The earlier assets had flattened everything to `currentColor`, losing the dot and ray tones; the Figma exports show `#41C1F0` / `white` + `fill-opacity` only because the Logos page renders in Align dark mode.) Logos therefore invert correctly in dark theme.

**Storybook** (`Components/Logo`): `Default` (controls), one story per Variation, `AllStates` (every variation, light + dark), `FigmaMatrix` (8 variants), `Sizes`, play test `HasAccessibleName`.

**Tests**: `logo.test.tsx`, 14 passing.

**Visual check**: Storybook `AllStates` vs Figma set screenshot — identical artwork, dot and star tones; dark column matches the Figma (dark-mode) render.

## Deviations / Figma notes
- Figma frame widths are fractional (e.g. 224.2px); the viewBox uses the Figma size so geometry is exact, rendered width is rounded to 0.01px.
- "All logos" Figma export wraps paths in a full-frame clipPath; dropped (all paths are inside the viewBox, which clips anyway).
- `height` scaling is not a Figma property (Figma has only the 28px size).
