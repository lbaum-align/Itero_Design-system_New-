# _DataTableContentRow — sign-off

**Figma**: `Rows / Data table content row` `30539:50181` (page "Data table" `30526:43048`), file `TCdFM9Hy78GHyifCSlkedx`. **Status**: ✅ Built 2026-09-28.

**Variants**: `Size` (Large (1 line) / X-large (2 lines) / 2X-large (3 lines)) × `Selection` (None / Unselected / Selected) × `Expansion` (None / Collapsed / Expanded / Indend) × `Draggable` (False / True) = **68 published variants** (of 72 combinations). All 72 combinations are supported by the props and rendered in `FigmaMatrix`.

**Implementation** (`src/components/_data-table-content-row/`): `DataTableContentRow` (forwardRef `tr`).
- Row heights 52 / 72 / 92 (`--scanner-data-table-row-height-*`); expanded rows add a 92px content row
  (Figma totals 144 / 164 / 184).
- Leading columns in Figma's order: `_DataTableDragItem` (Draggable), `_DataTableExpansionItem`
  (Expansion=Collapsed/Expanded) or an empty 24px spacer (Expansion=Indend), `_DataTableCheckboxItem`
  (Selection ≠ None), then the `_DataTableContentItem` children.
- Figma's 16px gap between cells is each cell's own `padding-left`, fed by the inherited
  `--scanner-data-table-cell-gap` variable (zeroed on the first cell) so table columns stay aligned.
- 1px `--scanner-border-subtle` bottom rule as an inset shadow on every cell; when expanded the rule moves
  to the expanded content row, exactly like Figma's component outline.
- "Expandable content" is a second `<tr>` (`expandedContentId` → `aria-controls` on the expander): the same
  leading spacer columns, then a `colSpan` cell with 16px vertical padding and a 60px minimum content
  height, holding `expandedContent` (or the Figma `SlotContent` placeholder).
- a11y: `aria-selected` on the row whenever the table has a selection column, `data-selected`,
  `data-selection` / `data-expansion` / `data-draggable` for styling and tests.

**Storybook** (`Private/_DataTableContentRow`): `Default` (controls incl. forced state), one story per `Size`,
`Selection` and `Expansion` value, `Draggable`, `MixedCellContents`, `AllSizes`, `AllStates`,
`Figma matrix (all 68 variants)`, `Interactive`, play tests `SelectingARow`, `ExpandingARow`,
`ExpandedRowIsLinkedToTheExpander`, `DragHandleIsKeyboardOperable`.

**Tests**: `data-table-content-row.test.tsx`, 18 passing. `npx oxlint` clean, `tsc -b --noEmit` clean.

## Deviations / Figma notes
- **Missing Figma variants** (4 of 72): `Selection=Unselected, Expansion=Expanded, Draggable=True` at
  X-large, and `Selection=Unselected, Expansion=Indend, Draggable=True` at all three sizes. The props
  support them and they render consistently with their siblings.
- **Figma inconsistency**: the "Expandable content" spacers are **20px** wide while the row's control
  columns are **24px**, so Figma's expanded content starts 12px left of the first data column. The
  spacers here reuse the 24px control width, aligning the expanded content with the first column.
- **Figma has no hover or selected row background** — the Selected variants differ only by the checked
  checkbox (verified on the `Data table` component set too). The hovered-layer token
  (`--scanner-bg-hover`, forceable with `data-state="hovered"`) is a code addition for row affordance;
  selection stays checkbox-only, as drawn.
- A `Divider` rectangle inside Figma's "Expandable content" frame is invisible in every variant and is
  not implemented.
- Row-level expansion/selection state is controlled: the row renders what `expansion` / `selection` say and
  calls `onExpandedChange` / `onSelectionChange` — the `DataTable` owns the state.
