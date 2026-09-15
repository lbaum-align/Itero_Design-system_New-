# SelectMenu — sign-off

**Figma**: `Select menu` set `30409:27826` (page "Dropdown" `15305:6738`). **Status**: ✅ Verified 2026-09-15.

**Variants**: Size (X-Large, Large, Medium, Small) = 4, plus Scroll boolean.

**Storybook coverage** (`Components/SelectMenu`): `Default` (controlled, controls incl. focusMode), `Size: X-Large/Large/Medium/Small` (Figma content), `AllSizes`, `Figma matrix (4 sizes × Scroll)`, `AllStates` (forced option states per size), `WithHeadlinesAndDividers`, `Scroll (long list)`, `LongOptionTruncates`, `ActiveDescendant`, play tests (`KeyboardSelection`, `ClickSelects`, `ActiveDescendantKeyboard`).

**Tests**: `select-menu.test.tsx`, 11 passing.

## Fixed during audit
- Width 180px default, min 64 (`dropdown.css` tokens); panel heights now match Figma (X-Large 488 / Large 360 / Medium 296 / Small 232 with 8 options)
- Scroll: the fake absolute bar is now a real scroll container with a `maxHeight` prop
- Selection API for Dropdown/Combobox/SearchInput: `value`/`defaultValue`/`onChange(value)`
- Focus model: `focusMode="roving"` (default; options get DOM focus, focus starts on the selected option, the container is tabbable only while focus is outside) or `"activedescendant"` (focus stays on the listbox; `aria-activedescendant` points to the active option; `activeValue`/`onActiveChange` can be controlled by an external input)
- Keyboard: ArrowUp/Down skip disabled options and wrap, Home/End, Enter **and Space** select (Space was missing), Escape → `onClose`; `autoFocus`
- Exported `selectMenuOptionId(prefix, value)` and `SelectMenuFocusMode`

## Remaining deviations / Figma notes
- Same "Depth 01" shadow token issue as Menu (`effects.css` placeholder ≠ Figma `0 2px 12px #00000020`)
- Figma Scroll is a decorative 4×116 thumb; code uses the native thin scrollbar
- Type-ahead (jump by first letter) is not implemented; the Figma docs don't require it
- In activedescendant mode, options must keep their generated id (no `id` prop)
