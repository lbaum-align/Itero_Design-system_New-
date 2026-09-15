# Tooltip — sign-off

**Figma**: `01 Tooltip` `34026:193415` (page "Tooltip" `15305:6754`), file `TCdFM9Hy78GHyifCSlkedx`
**Variants**: Placement (Left, Right, Top, Bottom) × Alignment (Start, Middle, End) = 12, + Show carret.

## Storybook coverage (`Components/Tooltip`)
`Default` (controls: Placement, Alignment, Show carret, Show tooltip, Text value, delay, disabled) · `Placement: Bottom / Top / Right / Left` ·
`Alignment: Start / Middle / End` · `Show carret: False` · `AllStates` (Hidden / Visible / Visible without caret × placement) ·
`Figma matrix (all 12 variants)` (× Show carret, rendered with `TooltipBubble`) · `Overflow: long text wraps at 320px` · `Overflow: unbroken word` ·
play tests `HoverShowsAfterDelay`, `FocusShowsEscapeHides`, `DisabledNeverShows`.
Unit tests: `tooltip.test.tsx` (11).

## Fixed during audit
- **Missing Figma props**: added `placement` (Figma name; legacy `position` kept), `alignment` (Start/Middle/End), `showCaret` ("Show carret"), `open` ("Show tooltip", controlled) + `defaultOpen` / `onOpenChange`, `disabled`, `tooltipClassName`
- **Caret**: CSS-border 6px triangle → Figma 8×4 triangle in `background-inverse`, 12px from the bubble edge; direction per placement
- **Position**: 8px margin (`mb-2`) → caret tip 4px (`spacing-01`) from the trigger; Start/End place the bubble edge 16px from the trigger centre so the caret always points at the trigger centre (as in `02`/`03` trigger variants)
- **Width bug**: absolutely positioned bubble was limited by the trigger's width (text wrapped per word on small triggers) → `w-max`, capped at 320px
- **A11y**: `aria-describedby` was set on the wrapper `<div>` only while visible → now on the trigger element (merged with any existing value), pointing to a `role="tooltip"` element that stays in the DOM (`hidden`) so the description is available on focus
- **Behaviour (Figma "Interactions")**: hover opens after a brief delay (default 300ms, was 0), focus opens immediately, stays open while the pointer is over the trigger *or the tooltip* (4px gap is padding, not margin), Escape now works for hover-opened tooltips too (document listener), blur ignores focus moving inside the wrapper
- Handlers passed via props (`onMouseEnter`, `onFocus`, …) are composed instead of overwritten; props extend `HTMLAttributes`
- New `TooltipBubble` (visual `01 Tooltip` without behaviour) exported from the folder barrel

## API compatibility
`Tag` still gets the `relative inline-flex` wrapper + `className`; `position` still works; `TooltipProps` / `TooltipPosition` exports unchanged.

## Component tokens (`src/tokens/components/tooltip.css`)
`--scanner-tooltip-caret-width` (8px), `--scanner-tooltip-caret-height` (4px), `--scanner-tooltip-caret-inset` (12px), `--scanner-tooltip-anchor-offset` (16px) + container tokens.

## Visual check
`Figma matrix` and `Placement: Bottom` screenshots compared with Figma `34026:193415`: bubble size, caret size/position for all 12 variants and the 4px trigger gap match.

## Remaining deviations / Figma inconsistencies
- Figma docs say directions are "auto" by default (flip to stay in the viewport). Not implemented: placement is manual; no collision detection. Consumers choose the placement.
- Figma gives no delay value; 300ms chosen. `delay={0}` restores the old behaviour.
- `02 Icon trigger tooltip` Left/Start and Left/End are offset ±2px vertically and Top/End sits 20px too high (`bottom: 24px` instead of 4px) — Figma drawing errors; implemented the consistent 16px / 4px values.
- No portal: the tooltip renders inside the wrapper, so `overflow: hidden` ancestors can clip it.
- Dark-mode token values not visually verified against Figma.
