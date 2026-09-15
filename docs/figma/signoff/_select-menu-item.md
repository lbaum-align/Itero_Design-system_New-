# _SelectMenuItem — sign-off

**Figma**: `_Select menu Item` set `7149:1690` (page "Dropdown" `15305:6738`). **Status**: ✅ Verified 2026-09-15.

**Variants**: Size (X-Large, Large, Medium, Small) × Type (Single) × Selected (False, True) × State (Enabled, Hovered, Focused, Disabled) = 32, plus Show divider, Show headline, Show subtext, Option/Headline/Subhead text.

**Storybook coverage** (`Private/_SelectMenuItem`): `Default` (controls incl. Forced state), `Size: X-Large/Large/Medium/Small`, `Selected: True`, `Show headline`, `Show subtext`, `Show divider`, `AllSizes`, `AllStates`, `Hovered`, `Focused`, `Disabled`, `Figma matrix (all 32 variants)` + boolean-property grid per size, `LongOptionTruncates`, play tests (`ClickCallsOnClick`, `DisabledIgnoresClick`).

**Tests**: `select-menu-item.test.tsx`, 8 passing.

## Fixed during audit
- `data-state` hover/focus never worked: the `group-data-*` classes targeted a wrapper that never received `data-state`. `role="option"`, `data-state` and the other props now sit on the option row.
- Option text colour `icon-primary` → `text-primary`; X-Large text raw `18px` → `text-scanner-md`
- Subtext `text-primary` → `text-secondary`; gap below the option removed (Figma gap 0)
- Disabled `text-tertiary` → `text-disabled` (option and subtext), checkmark `icon-disabled`
- Focus: 1px ring → 1px inset `border-focus` stroke; no ring on disabled options
- Checkmark: Material `check` → Figma "Checkmark empty" glyph, 24px frame at X-Large and 20px otherwise (tokens in `dropdown.css`)
- Size now comes from `SelectMenu` context (it was always `x-large` unless set on each item)
- Headline padding (12/8/8/8) kept; divider is a 1px line 3px into an 8px frame, hidden from AT (a separator isn't allowed in a listbox)
- New `value` prop: inside `SelectMenu` it derives `aria-selected`, selects on click, and gets a deterministic id for `aria-activedescendant`. `data-active` highlights the active option in activedescendant mode.
- Text props accept ReactNode; `data-state` typed

## Remaining deviations / Figma notes
- Figma *Selected + Focused* variants have no focus stroke (Medium puts it on the outer frame with no radius). Implemented the same 4px-radius focus stroke as unselected, for a consistent focus indicator.
- Type has only "Single"; Multi (checkbox) options belong to the future Dropdown Multi.
- Figma asks for a tooltip on truncated options. Not implemented here.
