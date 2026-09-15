# TextTriggerTooltip — sign-off

**Figma**: `03 Text trigger tooltip` `31059:239` (page "Tooltip" `15305:6754`), file `TCdFM9Hy78GHyifCSlkedx`
**Variants**: Position (Top, Bottom) × Alignment (Start, Middle, End) = 6, + Show tooltip, Text value.

## Storybook coverage (`Components/TextTriggerTooltip`)
`Default` (controls incl. Show tooltip, Forced state) · `Position: Bottom / Top` (× Alignment) · `AllStates` (Hidden, Visible, Focused forced) ·
`Figma matrix (all 6 variants)` (× Show tooltip) · `InlineInParagraph` · play tests `KeyboardShowsAndEscapeHides`, `HoverShows`.
Unit tests: `text-trigger-tooltip.test.tsx` (5).

## Fixed during audit
- Added `alignment` (Figma Alignment) and `open` ("Show tooltip"), `onOpenChange`, `delay`
- Trigger: focusable `<span role="term">` (not an interactive role) → `<button type="button">` styled as inline text, so it is announced and operable; gets `aria-describedby`
- Focus: 2px outline with `--scanner-focus-ring` → 1px `border-focus` stroke 2px outside the text (same as IconTriggerTooltip), forceable via `data-state="focused"`
- Underline: `underline-offset-2` → `text-underline-position: from-font` like Figma; text stays on one line (`whitespace-nowrap`)
- Tooltip caret now 4px from the text and pointing at the text centre for Start/Middle/End (was centred only, 8px away)

## Remaining deviations / Figma notes
- The text layer is 14/20 but its text style is named `Body/$tp-body-01` (16/24) — overridden in Figma. Implemented 14/20 (`text-sm` / `leading-sm`).
- Top/End variant is drawn 20px higher than the others (Figma error); implemented the consistent 4px gap.
- No Focused variant in Figma (docs: "Users can trigger a tooltip by focusing on the element").
