# DatePicker — sign-off

**Figma**: `01 Date picker` `7014:14260` (page Date picker `15305:6737`) · **Variants**: Layer set (Set 01, Set 02) × Type (Single, Ranged) × Selected (False, True) × State (Enabled, Hovered, Focused, Disabled, Error, Skeleton) = 48 · Component props: Show label, Required, Show helper, Show explainer, Label / Helper / Error text value, Placeholder text, Date value, First / Second date value
**Status**: ✅ Built 2026-09-15

## Implementation
`src/components/date-picker/DatePicker.tsx` — label / required / explainer / helper / error from the shared `text-input/field-parts.tsx` + `field-styles.ts`; calendar panel = `Calendar`, positioned locally below the field (absolute, 4px gap, z-index token).

- Field: 60px, 12/16 padding, 8 gap, radius medium, `background-layer-01|02`; value/placeholder 18/28 (`text-primary` / `text-tertiary`); 24px "Calendar" icon `icon-tertiary`.
- Hovered: icon → `icon-primary` (`:hover` / `data-state="hovered"`). Focused: 1px inset `border-focus` (`:focus-within` / `data-state="focused"` / while open). Error: `border-error` + error message (`role="alert"`, `aria-invalid`). Disabled: text/icon disabled, layer background kept. Skeleton: 12px label box · 60px field box · 12px helper box (`background-highlight-gray`, 143px bars).
- Ranged: start input · " → " (`text-tertiary`) · end input; inputs hug their text (`field-sizing: content`, ch-width fallback).
- Selected is derived from `value`.

Props: `type` (`single | ranged`), `value` / `defaultValue` / `onChange` (`Date | null` or `{ start, end }`), `layer`, `error`, `disabled`, `skeleton`, `label`, `showLabel`, `required`, `helperText`, `errorText`, `showHelper`, `showExplainer`, `explainerText`, `placeholder` (default = `format`), `format` (default `mm.dd.yyyy`), `allowTyping`, `open` / `defaultOpen` / `onOpenChange`, `min`, `max`, `isDateDisabled`, `today`, `locale`, `weekStartsOn`, `openCalendarLabel`, `startDateLabel`, `endDateLabel`, `id`, `data-state`, `className`. Ref → root element.

Behaviour: click on field / input / calendar icon opens; outside pointerdown or tabbing out closes; Enter or ArrowDown opens and moves focus to the active day; Escape closes and returns focus to the input; picking a date (Single) or the second date (Ranged) closes and refocuses the input. Typing: a complete valid date in `format` (within min/max, not disabled) commits immediately; empty text commits `null`; invalid text reverts on blur. Inputs are `role="combobox"` with `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls`; panel is `role="dialog"`.

## Should the field compose DateInput?
No — DateInput has no trailing icon slot, no hover state, a different padding (16 all sides) and a single input, while Date picker needs the calendar icon, hover icon colour, open/focus stroke, and the ranged "first → second" layout. Both reuse the same shared field parts/styles, so label/helper/error/skeleton styling stays identical.

## Storybook coverage (`Components/DatePicker`)
`Default` (controls incl. Forced state) · `Type: Single / Ranged` · `Layer set: Set 01 / Set 02` · `Selected: False / True` · `State: Hovered / Focused / Disabled / Error / Skeleton` · `Required` · `Show explainer` · `Show label: False, Show helper: False` · `Open: Single / Ranged` · `Range selection` · `Min / max` · `Locales` (de-DE dd.mm.yyyy, ja-JP yyyy-mm-dd) · `AllStates` · `Figma matrix (all 48 variants)` · `LongContent` · play tests `ClickOpensAndSelects`, `KeyboardOpenNavigateSelect`, `EscapeClosesAndReturnsFocus`, `OutsideClickCloses`, `TypingCommitsDate`, `RangedByClicks`, `DisabledDoesNotOpen` (all reach phase `finished`).
Unit tests: `date-picker.test.tsx` — 19 passing (fixed `today`).

## Visual comparison
Figma matrix render vs the Figma set screenshot: field height/padding/radius, both layer backgrounds, placeholder vs value colours, hovered icon, focus/error strokes, disabled colours, ranged arrow and skeleton boxes match for all 48 variants.

## Deviations / Figma inconsistencies
- Figma Set 02 Ranged Enabled/Hovered arrows are 14/20 (they nearly disappear in the screenshot); every other variant uses 18/28 — implemented 18/28 everywhere.
- Skeleton label/helper box widths vary in Figma (143 / 159 / 341px); 143px used everywhere (capped at field width).
- Figma doesn't show the panel attached to the field; offset (4px), left alignment and z-index are local choices (tokens `--scanner-date-picker-panel-offset|z`). The panel overlays the helper text. Replace with Popover once available.
- Explainer tooltip uses the shared `FieldHeader` (Figma instance: Placement=Top, Alignment=Start).
- Figma has no Error + Focused / open combination: error stroke wins.
- Dark mode not verified against Figma.
