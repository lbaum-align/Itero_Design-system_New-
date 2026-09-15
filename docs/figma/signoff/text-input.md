# TextInput — sign-off

**Figma**: `Text input` `28:1412` (page Text input `23885:185666`) · **Variants**: Size (X-Large, Large, Medium, Small) × Layer set (Set 01, Set 02) × Filled (False, True) × State (Enabled, Focused, Disabled, Error, Skeleton) = 80 · Component props: Show label, Show helper, Show placeholder, Show explainer, Required, Show counter, Clearable, label/helper/error/placeholder/counter/filled text
**Status**: ✅ Verified 2026-09-15

## Storybook coverage (`Components/TextInput`)
`Default` (controls for every prop incl. Forced state) · `Size: X-Large / Large / Medium / Small` · `Layer set: Set 01 / Set 02` · `Filled: False / True` · `State: Focused / Disabled / Error / Skeleton` · `Required` · `Show explainer` · `Show counter` · `Clearable` · `Show label: False, Show helper: False` · `Controlled: counter + clearable` · `AllSizes` · `AllStates` · `Figma matrix (all 80 variants)` · `Optional elements per size` · `Overflow content` · play tests `TypingFiresOnChange`, `ClearButtonClears`, `EscapeClears`, `DisabledIgnoresInput`, `ErrorIsAnnounced`.
Unit tests: `text-input.test.tsx` — 23 passing.

## Fixed during audit
- **Typography per size** now matches Figma: X-Large label/helper 16/24 + value 18/28; Large 12/16 + 14/20; Medium & Small label/helper 18/28 + 18px value on a 20px line (was hardcoded `text-[16px]`/`text-[18px]`, mixed up per size).
- **Field sizes**: heights 60/44/36/28 (component tokens), padding 16 · 16/12 · 12/8 · 8/4, radius 8 (Small 4).
- **Layer set** background: `bg-primary/secondary` → `--scanner-bg-layer-01/02`.
- **Strokes** drawn inside (inset shadow) instead of a 1px transparent border; Focused `border-focus` via `:focus-within` **and** forced `data-state="focused"` (the old `data-state` went to the `<input>` and did nothing).
- **Skeleton**: `bg-disabled` → `bg-highlight-gray` + pulse; helper bar 40×8 with 8px gap; field box uses the size's radius.
- **Counter**: 12/16 text-secondary, 8px left/bottom padding; new `showCounter` + `maxLength` auto-counter.
- **Clearable**: clear button now actually clears uncontrolled inputs (DOM value used to stay), fires `onChange` + `onClear`, refocuses the input, is keyboard reachable, and Escape clears (Figma keyboard docs). Icon 20px `icon-tertiary`.
- **Explainer** uses `IconTriggerTooltip` with Figma placement Top; label row gap 4, bottom padding 8; required asterisk 12/16 `text-error`.
- Clicking the field container focuses the input (Figma interaction docs); `aria-describedby` merges consumer ids; `aria-disabled` added.
- Label/helper/error/counter anatomy moved into shared private helpers (`field-parts.tsx`, `field-styles.ts`, `use-field-value.ts`) reused by TextArea and PasswordInput.

## Visual comparison
Rendered `Figma matrix` vs Figma set screenshot: sizes, paddings, radii, colours per state, stroke colours, skeleton boxes and typography scale match for all 80 variants.

## Remaining deviations / Figma inconsistencies
- Figma Disabled keeps the **label and counter `text-secondary`**; code uses `text-disabled` to stay consistent with Text area and Password input (both disabled labels are `text-disabled` in Figma).
- Figma Medium/Small value text is 18/28 inside a 20px-tall box (text is clipped in Figma). Code uses 18px on a 20px line so field heights stay 36/28.
- Figma Small helper text is 12/16 in Enabled but 18/28 in Focused/Disabled/Error — majority 18/28 implemented.
- Figma Medium Focused (Set 01 both, Set 02 Filled=False) variants have "Show label" off — treated as a Figma mistake.
- Figma Small skeleton box radius is 8 while the Small field radius is 4 — code uses 4.
- Figma defines no Hovered state; none implemented. Error + focus keeps the error stroke (no Figma variant).
- The "Scroll mask" rectangle (left fade while horizontally scrolling) is not reproduced; native input scrolling is used.
- Explainer icon colour in Disabled is owned by `IconTriggerTooltip` (stays `icon-secondary`).
- Dark-mode values not verified against Figma. Storybook play tests ran in the browser (no error display) but there is no headless test runner; the same behaviour is covered by Vitest.
