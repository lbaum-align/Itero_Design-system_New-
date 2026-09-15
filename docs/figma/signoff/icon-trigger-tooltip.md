# IconTriggerTooltip — sign-off

**Figma**: `02 Icon trigger tooltip` `33957:20415` (page "Tooltip" `15305:6754`), file `TCdFM9Hy78GHyifCSlkedx`
**Variants**: Placement (Left, Right, Top, Bottom) × Alignment (Start, Middle, End) = 12, + Show tooltip.

## Storybook coverage (`Components/IconTriggerTooltip`)
`Default` (controls incl. Show tooltip, disabled, Forced state) · `Placement: Bottom / Top / Right / Left` (× Alignment) ·
`AllStates` (Hidden, Visible, Focused forced, Disabled) · `Figma matrix (all 12 variants)` (× Show tooltip) · `Explainer next to a label` ·
play tests `KeyboardShowsAndEscapeHides`, `HoverShows`, `DisabledIsInert`.
Unit tests: `icon-trigger-tooltip.test.tsx` (7).

## Fixed during audit
- **Focus treatment**: 2px `outline` with legacy `--scanner-focus-ring` alias → 1px `border-focus` stroke 2px outside the icon, radius small (same treatment as Link / breadcrumb link); forceable with `data-state="focused"`
- Added `alignment` (Figma Alignment; default `middle`, so existing usages are unchanged) and `placement` (Figma name; legacy `position` still works, default `bottom`)
- Added `open` (Figma "Show tooltip"), `onOpenChange`, `delay`, `triggerLabel`
- Added optional `disabled` (coordinator request): `icon-disabled`, native `disabled`, tooltip never shows
- Hard-coded `size-[16px]` → `--scanner-tooltip-trigger-icon-size`; button reset (`border-0 bg-transparent p-0`) so the trigger is exactly 16×16
- Trigger now gets `aria-describedby` → tooltip; tooltip caret sits 4px from the icon and points at its centre (via `Tooltip`)
- Props extend `HTMLAttributes<HTMLDivElement>`

## API compatibility
Default accessible name stays `Help: <content>` (used by checkbox/radio group tests); `content`, `position`, `iconName`, `className` unchanged. Consumer suites (text-input, date/number/password input, checkbox & radio groups, text-area) pass.

## Remaining deviations / Figma notes
- **Disabled**: Figma has no disabled explainer. Every Disabled variant of Text input (`28:1412`), Password input (`6176:2285`) and Dropdown (`20:610`) hides the explainer instance, and no icon colour is defined for it. The `disabled` prop is a code-only extension; wiring it into disabled fields is up to the field owners.
- **Focused**: Figma draws no focus state for the trigger; the 1px `border-focus` stroke mirrors Link.
- The trigger's accessible name repeats the tooltip text (`Help: …`) and is also described by it — kept for backwards compatibility; pass `triggerLabel` (e.g. "More information") to avoid the repetition.
- Registry `help` glyph is the same Carbon "Help" path as Figma "Help outline" (20px viewBox scaled to 16px).
