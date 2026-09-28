# _SliderControl — sign-off

**Figma**: `_Slider control` `18362:19166` (page Slider `18362:19162`) · **Variants**: States (Enabled, Focused, Pressed, Disabled) = 4 · Component prop: Value (boolean)
**Status**: ✅ Built 2026-09-15 · Private (not in `src/index.ts`)

## API
`pressed` · `disabled` · `showValue` (Figma "Value", default `true`) · `valueText` (tooltip "Text value") · `data-state` (`focused` | `pressed`) · every other prop (`role="slider"`, `aria-*`, `tabIndex`, key handlers, `style`) is forwarded to the root so `Slider` owns behaviour.
Tokens: `src/tokens/components/slider.css` (handle 32, ring 28 / 2px, dot 16, tooltip offset 1px).

## Figma values implemented
- 32×32 box; ring = 28px circle with a 2px stroke, transparent inside (the Slider track stops at the box edges).
- Enabled `icon-tertiary` · Focused `icon-link` (`:focus-visible` or `data-state="focused"`) · Pressed `icon-link` ring + 16px `icon-link` dot + value tooltip · Disabled `icon-disabled` (+ `aria-disabled`).
- Tooltip: `TooltipBubble` placement top / alignment middle (01 Tooltip Position=Bottom, Alignment=Middle instance: caret under the bubble), centred on the handle, bottom edge 1px above the box; `aria-hidden` (the value is exposed by the slider's `aria-valuetext`).

## Storybook coverage (`Private/_SliderControl`)
`Default` (controls incl. Forced state) · `States: Enabled / Focused / Pressed / Pressed, Value: False / Disabled` · `AllStates` · `Figma matrix (all 4 variants × Value)` · play tests `KeyboardFocusable`, `PressedShowsTooltip`.
Unit tests: `slider-control.test.tsx` — 8 passing.

## Visual comparison
Rendered Figma matrix vs Figma set screenshot: ring size/stroke, colours per state, pressed dot and tooltip (size, caret, offset) match.

## Remaining deviations / Figma inconsistencies
- The ring and dot are Figma vectors (not Icons-library icons); drawn with CSS using the same geometry so colours follow tokens — no registry icon needed.
- Figma's **Value** boolean isn't bound to any layer (the Pressed tooltip is always visible). Implemented as documented intent: `showValue` toggles the tooltip.
- Figma has no visible focus ring beyond the colour change (Focused = `icon-link` ring); implemented as designed.
- No Hovered variant in Figma.
