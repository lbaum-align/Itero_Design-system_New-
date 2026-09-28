# SlotContent — sign-off

**Figma**: `Slot content` component `8146:4227` (page "Logos" `15305:8083`), file `TCdFM9Hy78GHyifCSlkedx`. **Status**: ✅ Built 2026-09-15.

**Variants**: 1 component, no properties. Placeholder for swappable content inside Popover (and Modal window / Data table slots).

**Implementation** (`src/components/slot-content/`): `SlotContent` (forwardRef `div`, `children` replaces the default "Swap me to any component").
- 1px dashed `border-interactive` stroke (Figma dash 4/4, inside) → `outline-1 outline-dashed -outline-offset-1` so it doesn't change layout
- Padding spacing-04 (16px), radius medium (8px), items centred
- Body/$tp-body-02 18/28 Regular → `text-scanner-md` / `leading-lg`, colour `text-link`

**Storybook** (`Components/SlotContent`): `Default` (controls), `AllStates`, `FigmaMatrix`, `CustomLabel`, `LongTextWraps`, play test `RendersPlaceholderText`. Used in all Popover stories.

**Tests**: `slot-content.test.tsx`, 4 passing.

## Deviations / Figma notes
- CSS dashed outlines use the browser's dash length (≈3px dash for a 1px line in Chromium), not exactly Figma's 4/4 dash.
- Design-time placeholder only — not interactive, no states.
