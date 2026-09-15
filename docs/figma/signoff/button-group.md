# ButtonGroup — sign-off

**Figma**: `02 Buttons group` `36403:6370` (page Button `15305:6719`) · **Variants**: Size (Large, Medium, Small) × Position (Horizontal, Vertical) = 6
**Status**: ✅ Verified 2026-09-15

## Storybook coverage
`Default` (Size/Position controls) · `Horizontal` · `Vertical` · `Large` · `Medium` · `Small` · `AllSizes` · `AllStates` (child Button states inside a group) · `Figma matrix (all 6 variants)` · `ManyButtons` (9 slots) · `MixedContent` (wrapping label, SplitButton child) · play tests `KeyboardTabsThroughButtons`, `SizePropagatesToButtons`.
Unit tests: `button-group.test.tsx` — 10 passing.

## Fixed during audit
- Gap was per-size only (Large 16 / Medium+Small 8). Figma: **16px only for Large + Horizontal**, 8px for every other variant (Large + Vertical was 16 → 8).
- Horizontal groups now stretch items (Figma children "fill" height) — a wrapped label makes neighbours equally tall.
- Added Figma-named `position` prop (`orientation` kept as deprecated alias).
- Group `size` now propagates to child `Button` / `SplitButton` without their own `size` (Figma group size = button size).
- Props now extend `HTMLAttributes<HTMLDivElement>` (rest was spread but untyped); `data-size` / `data-position` attributes.

## Visual comparison
Rendered sizes: L/H 255×60 (Figma 256×60), M/H 231×48 (232), S/H 215×36 (216), L/V 120×128, M/V 112×104, S/V 104×80 — all match (±1px text sub-pixel width).

## Remaining deviations / Figma inconsistencies
- Large/Horizontal gap (16px) is an unbound value while all other variants bind `spacing-02` (8px). Implemented as drawn (`--scanner-spacing-5`); may be a Figma mistake.
- Button instances inside the group are stale overrides of `01 Button`: Large uses a 2px stroke and 100px min-width, Medium/Large py 12 / 8. The group reuses the verified `Button` (1px stroke, 72px min-width) instead.
