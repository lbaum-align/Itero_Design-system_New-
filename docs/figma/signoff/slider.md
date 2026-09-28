# Slider — sign-off

**Figma**: `Slider` `17867:9913` (page Slider `18362:19162`) · **Variants**: Layer set (Set 01, Set 02) × Ranged (False, True) × State (Enabled, Disabled, Skeleton) = 12 · Component props: Show label, Show value, Editable, Show explainer, Label text value, Start number value, End number value
**Status**: ✅ Built 2026-09-15

## API
Single: `value` / `defaultValue` (number) / `onChange(number)`; `ranged` (discriminated union): `value` / `defaultValue` (`[start, end]`) / `onChange([start, end])` · `min` (0) / `max` (100) / `step` (1) ·
`layer` · `label` (Show label) · `explainer` (Show explainer) · `showValue` (Show value, default true) + `startValueText` / `endValueText` (default min / max) · `editable` · `showTooltip` (handle value tooltip while dragging) · `formatValue` ·
`startHandleLabel` / `endHandleLabel` · `numberInputProps` / `endNumberInputProps` · `disabled` · `skeleton` · `data-state` (`focused` | `pressed`, forced on every handle).
Tokens: `src/tokens/components/slider.css`.

## Behaviour / a11y (WAI-ARIA slider, multi-thumb)
- Each handle (`_SliderControl`) is `role="slider"`, `tabIndex=0`, `aria-valuenow`, `aria-valuetext` (`formatValue`), `aria-orientation="horizontal"`, `aria-valuemin/max` — ranged handles are bounded by each other (start max = end value, end min = start value).
  Name: `aria-labelledby` → label (single), or `"{label} start" / "{label} end"` (ranged), or `startHandleLabel` / `endHandleLabel`.
- Keyboard: ArrowRight/ArrowUp +step, ArrowLeft/ArrowDown −step, PageUp/PageDown ±10 steps, Home/End → bounds. Values snap to `step` from `min` without float drift.
- Pointer: press anywhere on the 60px track row → nearest handle jumps there, gets focus and drags (pointer capture) with the Pressed look + value tooltip; release ends the drag. Ranged handles can touch but never cross.
- Controlled / uncontrolled. `editable`: Large `NumberInput`(s) without controls/label, bounded like the handles; typing, arrows and handles stay in sync.
- Disabled: handles `tabIndex=-1` + `aria-disabled`, pointer and keys ignored, number inputs disabled. Skeleton: `aria-hidden` placeholder, no sliders.

## Figma values implemented
- Label row: 18/28 `text-secondary` (`text-disabled`), 4px gap to the 16px explainer, 8px bottom padding. Editable inputs → 8px gap → Slider.
- Indication row 60px: Lines are 4px bars (`border-interactive` filled, `border-subtle` rest, all `border-disabled` when disabled), outer ends radius 4; handles 32px.
  Geometry: usable width = `100% − N × 32px`, handle i at `usable × p + i × 32px` (Figma: 144·32·144 single; 85.3·32·85.3·32·85.3 ranged).
- Value row 4px below: start / end texts 18/28 `text-primary` (`text-disabled`), space-between.
- Editable ranged: two inputs sharing the width with a 16px column holding the 16px "Subtract empty" icon (`icon-primary`).
- Layer set → number input background (`background-layer-01/02`).
- Skeleton: 40×8 `background-highlight-gray` label and min/max boxes, track + disabled handles, number input skeletons when editable.

## Storybook coverage (`Components/Slider`)
`Default` (controls for every prop incl. Forced handle state) · `Ranged: False / True` · `Layer set: Set 01 / Set 02` · `State: Enabled / Disabled / Skeleton` · `Handle: Focused / Pressed` · `Editable` · `Editable (Ranged)` · `Show explainer` · `Show label: False, Show value: False` · `Start / End number values` · `Controlled: ranged + editable` · `AllStates` · `Figma matrix (all 12 variants)` · `Optional elements` ·
play tests `KeyboardSingle`, `KeyboardRangedNoCross`, `PointerTrackClick`, `EditableSync`, `DisabledIgnoresInput`.
Unit tests: `slider.test.tsx` — 21 passing.

## Visual comparison
Rendered `Figma matrix`, `Editable (Ranged)` and handle states vs Figma set / documentation screenshots: label/value typography and spacing, track thickness, colours and segment geometry, handle ring, pressed tooltip, disabled colours and skeleton boxes match.

## Remaining deviations / Figma inconsistencies
- **Skeleton track**: Ranged=False skeleton uses `border-subtle` lines + an Enabled handle; Ranged=True skeleton uses Disabled handles, `border-disabled` outer lines and a `border-subtle` middle line. Implemented one consistent placeholder: all lines `border-disabled`, Disabled handles.
- **Skeleton value row** height is 8 (single) vs 16 (ranged, fixed). Implemented 8 (hug).
- Set 02 **single skeleton** references the Set 01 number input skeleton; implemented `layer` consistently.
- The **Editable** number inputs sit *above* the track (Figma), not beside it. Figma instances show them without label/helper/controls; the documentation examples override label + helper + controls — available through `numberInputProps` / `endNumberInputProps`.
- Ranged editable number input instances are 64px tall in Set 01/02 Enabled (helper space) vs 44px elsewhere; implemented the 44px input (helper hidden).
- Separator icon colour when disabled isn't defined (Disabled variant shares the enabled instance); implemented `icon-disabled`.
- Figma docs list only Arrows/Home/End; PageUp/PageDown (±10 steps) added per WAI-ARIA.
- Explainer uses `IconTriggerTooltip` (top / start) and is shown disabled when the slider is disabled (Figma hides it in all variants — "Show explainer" off).
- Dark mode not verified against Figma.
