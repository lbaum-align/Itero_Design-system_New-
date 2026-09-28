# _DataTableCheckboxItem — sign-off

**Figma**: `Items / Data table checkbox item` `30570:39080` (page "Data table" `30526:43048`), file `TCdFM9Hy78GHyifCSlkedx`. **Status**: ✅ Built 2026-09-28.

**Variants**: `Size` = Large / X-large / 2X-large → 3 variants, all implemented (`size` prop). Each variant is a 24px-wide cell of the full row height (52 / 72 / 92) holding a `01 Checkbox item` instance with `Show value = false` (28×28 indicator only). The checkbox's own states (Unselected / Selected / Indeterminate × Enabled / Focused / Disabled / Skeleton) come from the shared component.

**Implementation** (`src/components/_data-table-checkbox-item/`): `DataTableCheckboxItem` (forwardRef `td`).
- Reuses `CheckboxItem` (read-only) with `showLabel={false}` and `aria-label` (default "Select row");
  `checked` accepts `boolean` or `'unselected' | 'selected' | 'indeterminate'`, `onChange(checked)`.
- Cell width `--scanner-data-table-control-width` (24px) with `box-content`; heights from the row-height tokens.
- `data-state="focused"` forwards to the checkbox's forced focus state.

**Storybook** (`Private/_DataTableCheckboxItem`): `Default` (controls), `Size: Large|X-large|2X-large`, `Selected`, `Indeterminate`, `AllSizes`, `AllStates` (enabled / focused / disabled / skeleton × 3 selections), `Figma matrix (3 variants × selections)`, play tests `ToggleWithKeyboard`, `ToggleWithPointer`.

**Tests**: `data-table-checkbox-item.test.tsx`, 11 passing. `npx oxlint` clean, `tsc -b --noEmit` clean.

## Deviations / Figma notes
- Figma keeps the checkbox instance's own **16px vertical padding** (making it 60px tall) inside a
  52 / 72 / 92px cell, i.e. it overflows the row. The padding is dropped here (`py-0`) and the 28px
  indicator is centred in the row instead — visually identical, and the row never grows.
- The 28px indicator is 4px wider than Figma's 24px column and overflows into the 16px cell gap.
  That is Figma's own geometry and is reproduced as-is.
