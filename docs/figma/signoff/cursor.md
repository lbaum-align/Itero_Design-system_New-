# Cursor — sign-off

**Figma**: `Cursor` component set `24097:47335` (page "Logos" `15305:8083`), file `TCdFM9Hy78GHyifCSlkedx`. **Status**: ✅ Built 2026-09-15.

**Variants**: 11 — Type: Pointer (default), Pointer pressed, Hand open, Hand closed, Text, Text pressed, Arrow, Arrow not allowed, Resize width, Resize height, Resize diagonal. 24×24 artboards.

## Decision: React form
Cursors are not UI elements, so the primary API is a **CSS value**, with a visual component for docs:
- `cursorValue(type)` → `url("data:image/svg+xml,…") <hotspot x> <hotspot y>, <native keyword>` and `cursorStyle(type)` → `{ cursor }`. Apply to any element (`style={cursorStyle('hand-open')}`) or imperatively during drags (`el.style.cursor = cursorValue('hand-closed')`). Browsers that reject SVG cursors fall back to the closest native keyword: pointer→`pointer`, hand open/closed→`grab`/`grabbing`, text→`text`, arrow→`default`, not allowed→`not-allowed`, resize→`ew-resize`/`ns-resize`/`nesw-resize`.
- `<Cursor type size label />` renders the glyph inline (docs, onboarding hints such as "drag to pan"). Decorative by default; filter ids are scoped per instance with `useId`.
- Hotspots: pointer / pointer pressed at the fingertip (8,4), arrows at the tip (8,6) / (6,3), hands, text and resize at the centre (12,12).
- Not implemented as CSS custom properties in `logos.css`: data-URI strings would duplicate the TS source; can be generated later if non-React consumers need them (see shared suggestions). No component tokens (24px is the SVG artboard / `size` prop default).

**Artwork** (`cursor-assets.ts`): exact Figma SVG exports. Only change: the 24×24 `fill-opacity: 0.01` hit-area rectangle is dropped. Pressed types = base glyph + the Figma 16px press ring (identical markup reused).

**Colours**: raw black / white / `#8D8D8D @12%` in Figma (no variables). Kept as-is — cursors must stay legible on any theme and CSS variables can't be resolved inside `url()` cursor images. Exempt from the no-hex rule (like logos).

**Storybook** (`Components/Cursor`): `Default` (controls), one story per Type, `AllStates` (glyph at 24/72px, hotspot, fallback, live hover area using the real CSS cursor), `FigmaMatrix` (11 variants), play test `AppliesCssCursor`.

**Tests**: `cursor.test.tsx`, 18 passing.

**Visual check**: Storybook `FigmaMatrix` vs Figma set screenshot — all 11 glyphs match (shapes, strokes, arrow shadows, press rings).

## Deviations / Figma notes
- "Pointer pressed"/"Text pressed" are separate Types in Figma, not states; mapped 1:1. The press ring sits at 0,0–16,16, off-centre from the pointer fingertip — kept as drawn.
- Hotspots are not defined in Figma; chosen from the glyph geometry.
