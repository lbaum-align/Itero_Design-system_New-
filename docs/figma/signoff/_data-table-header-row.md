# _DataTableHeaderRow — sign-off

**Figma**: `Rows / Data table header row` `30601:6315` (page "Data table" `30526:43048`), file `TCdFM9Hy78GHyifCSlkedx`. **Status**: ✅ Built 2026-09-28.

**Variants**: `Size` (Large) × `Selection` (None / Unselected / Selected / Indeterminate) × `Expansion` (None / Indend) × `Draggable` (False / True) = **16 variants**, all implemented (`selection`, `expansion`, `draggable`).

**Implementation** (`src/components/_data-table-header-row/`): `DataTableHeaderRow` (forwardRef `tr`).
- 52px tall; leading columns in Figma's order: drag spacer (Draggable), expansion spacer (Expansion=Indend),
  select-all checkbox (`_DataTableCheckboxItem`, Selection ≠ None), then the `_DataTableHeaderItem` children.
- Figma's 16px gap between cells is applied as each cell's own `padding-left` through the inherited
  `--scanner-data-table-cell-gap` variable (zeroed on the first cell), so real table columns still line up.
- 1px `--scanner-border-subtle` bottom rule drawn as an inset shadow on every cell (a `tr` has no border box).
- `selection="indeterminate"` renders the mixed checkbox (`aria-checked="mixed"`); `onSelectionChange(checked)`
  is the select-all handler. Variant values are exposed as `data-selection` / `data-expansion` / `data-draggable`.

**Storybook** (`Private/_DataTableHeaderRow`): `Default` (controls), one story per `Selection` value, `Expansion: Indend`, `Draggable`, `SortedColumn`, `AllStates`, `Figma matrix (all 16 variants)`, play tests `SelectAllToggles`, `SortingAColumn`.

**Tests**: `data-table-header-row.test.tsx`, 10 passing. `npx oxlint` clean, `tsc -b --noEmit` clean.

## Deviations / Figma notes
- **Figma inconsistency**: `Selection=None, Expansion=None, Draggable=False` has a **2px** bottom stroke
  while the other 15 variants have **1px**. 1px (the majority) is implemented.
- **Figma inconsistency**: the drag and expansion spacers are **20px** wide here but the content row's
  drag/expansion items are **24px**. 24px (`--scanner-data-table-control-width`) is used so header and
  body columns align.
- **Figma inconsistency**: `Selection=None, Expansion=None, Draggable=False` and
  `Selection=Unselected, Expansion=None, Draggable=False` contain 7 header cells, all other variants 6.
  The column count comes from `children` here.
- Header items inside the Figma rows are all `Sorted=None, Filterable=false, Show divider=false`;
  sorting/filtering per column is set by the caller.
- Figma defines no hover state for the header row; `data-state="hovered"` is accepted for parity with the
  content row but paints nothing beyond the default background.
