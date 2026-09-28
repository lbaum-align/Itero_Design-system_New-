# DataTable — sign-off

**Figma**: `Data table` `30943:10418` (page "Data table" `30526:43048`), file `TCdFM9Hy78GHyifCSlkedx`.
**Status**: ✅ Built 2026-09-28.

**Variants**: `Size` (Large (1 line) / X-large (2 lines) / 2x-large (3 lines)) × `Selection` (None /
Unselected / Selected) × `Draggable` (False / True) = **18 variants**, plus the five booleans
`Show title`, `Show toolbar`, `Show pagnation` (sic), `Show horizontal scroll`, `Show vertical scroll`.
All 18 are rendered in `Figma matrix (all 18 variants)`; each boolean has its own story and its own
control in `Default`.

## Implementation (`src/components/data-table/`)

`DataTable` — `forwardRef` on the root `div`, generic in the row type (`DataTable<Row>`); the
generic survives the ref forwarding through a re-typed `DataTableComponent` interface.

**Layout**, exactly as Figma's root auto-layout (vertical, 16px gap, children fill the width):
title row (4px gap, 16/24 Medium `text-primary`) → `_DataTableToolbars` → the table → `_DataTablePagination`.
Both bars are full width and sit outside the table's rules; the table itself has no outer border —
only the 1px `border-subtle` rule under the header row and under every content row, drawn by the row
components as inset shadows on their cells.

**The table** is a real `<table>` with `table-layout: fixed`, `border-separate`, `border-spacing: 0`
and a `<colgroup>`: each leading control column is `--scanner-data-table-control-width` (24px) wide,
plus `--scanner-spacing-5` (16px) for every column after the first, so the 16px inter-cell gap the
rows apply as cell `padding-left` keeps every column aligned. Rows are `_DataTableHeaderRow` /
`_DataTableContentRow` with `_DataTableHeaderItem` / `_DataTableContentItem` cells — no wrapper
elements around a `tr`, so an expanded row is still a sibling `<tr>`.

**Data-driven API**: `columns` (`id`, `header`, `width`, `content`, `accessor`, `cell`, `sortable`,
`sortAccessor`, `filterable`, `onFilterClick`, `showDivider`, `headerProps`), `rows`, `getRowId`.
Selection, sorting, expansion and pagination each work **controlled or uncontrolled**
(`value` / `defaultValue` / `onChange` triples).

| Figma | React |
|---|---|
| Size | `size` |
| Selection = None | `selectable={false}` |
| Selection = Unselected / Selected | `selectable` + `selectedRowIds` / `defaultSelectedRowIds` / `onSelectedRowIdsChange` |
| Draggable | `draggable` + `onRowReorder` |
| Show title | `title` / `showTitle` (+ `titleAs`, `titleTrailing`) |
| Show toolbar | `showToolbar` + `toolbarProps` |
| Show pagnation | `showPagination` + `page` / `pageSize` / `pageSizeOptions` / `totalItems` / `manualPagination` / `paginationProps` |
| Show horizontal scroll | `showHorizontalScroll` (+ `minWidth`) |
| Show vertical scroll | `showVerticalScroll` (+ `maxHeight`, `stickyHeader`) |
| row "Expansion" | `expandable`, `isRowExpandable`, `renderExpandedContent`, `expandedRowIds` |

**Sorting** — the header item cycles none → ascending → descending → none; `DataTable` sorts `rows`
itself when the active column has a `sortAccessor` (numbers numerically, everything else
`localeCompare` with `numeric`), or reports only, with `manualSorting`.

**Pagination** — client-side slicing by default; `totalItems` switches to server paging (`rows` is
the current page, nothing is sliced). `_DataTablePagination` already moves the page so the first
visible row stays visible when the page size changes, so `DataTable` does not reset the page itself.

**Toolbar** — `selectedCount` and `onCancel` are filled in from the selection unless the caller
overrides them, so the bulk-actions bar appears as soon as a row is selected and Cancel clears the
selection, matching Figma's Selected variants.

**Scroll** — `ScrollArea` (native bar styled as the Figma `Scroll`: 4px `border-subtle`, 4px inset)
with `orientation` `vertical` / `horizontal` / `both`, `role="region"` and an accessible name.
Without either boolean no scroll container (and no extra tab stop) is rendered. The default
viewport height is Figma's — the 52px header plus 10 rows
(`--scanner-data-table-viewport-height-lg|xl|2xl`, new tokens in `src/tokens/components/data-table.css`).

**a11y / keyboard**
- `aria-rowcount` (total rows + header) and `aria-colcount` on the table, `aria-rowindex` on the
  header row (1) and every data row (absolute, so it survives paging).
- Accessible name: `aria-label` → visually hidden `<caption>` → `aria-labelledby` the title.
- `aria-sort` per column (from `_DataTableHeaderItem`), `aria-selected` per row, `aria-checked="mixed"`
  on the select-all checkbox for a partial selection, `aria-busy` while loading,
  `aria-controls`/`aria-expanded` between an expander and its expanded row.
- Select-all covers the rows currently on screen (Figma's header shows "indeterminate" with 2 of the
  10 visible rows selected).
- Drag handle is keyboard-operable: Space/Enter grabs the row, ↑/↓ move it (`onRowReorder`), Escape
  cancels; moves are announced in a polite live region. Pointer drag-and-drop is left to the app.
- `onRowClick` (optional) makes rows focusable and activatable with Enter/Space.

**Tokens only** — no hex, no raw px except the Tailwind arbitrary values that read tokens. New
tokens: `--scanner-data-table-viewport-height-lg|xl|2xl` (appended to the page's own token file).

## Storybook (`Components/DataTable`) — 29 stories

`Default` (controls for `size` and every Figma boolean) · `Size: Large (1 line)` / `X-large (2 lines)` /
`2x-large (3 lines)` · `AllSizes` · `Selection: None` / `Unselected` / `Selected` · `Draggable` ·
`Draggable: keyboard reorder` · `Show title: False` · `Show toolbar: False` · `Show pagnation: True` /
`False` · `Show horizontal scroll` · `Show vertical scroll` · `Many rows and columns (both scrolls)` ·
`ExpandedRows` · `Sorting` · `EmptyState` · `CustomEmptyState` · `Loading` ·
`Figma matrix (all 18 variants)` · play tests `SelectAllRows`, `SortingAColumn`, `ExpandingARow`,
`Paginating`, `BulkActionOnSelection`, `KeyboardRowReorder`.

**Tests**: `data-table.test.tsx`, 34 passing. All 6 `play` functions verified via `composeStories`.
`npx oxlint src/components/data-table` clean, `tsc -b --noEmit` and `tsc -p tsconfig.stories.json` clean.

**Visual check**: Storybook screenshots compared against Figma renders of
`Size=Large (1 line), Selection=None, Draggable=False` (`33993:45588`) and
`Size=Large (1 line), Selection=Selected, Draggable=True` (`34027:228561`) — title, toolbar, header,
rows, rules, leading-column offsets (drag 28px centre, checkbox 54px centre, first label 78–80px)
and pagination all line up.

## Deviations / Figma notes

- **Header-row rule is inconsistent in Figma.** The `Rows / Data table header row` *component* has a
  2px bottom stroke, and the three `Selection=None, Draggable=False` DataTable variants inherit it,
  but the other **15 of 18** variants override it to 1px. Implemented as 1px (the majority, and what
  `_DataTableHeaderRow` already draws). See "Shared changes needed" — nothing to change, just noted.
- **Toolbar "Bulk actions" is inconsistent in Figma.** Only 4 of the 6 `Selection=Selected` variants
  set the toolbar to `Bulk actions=True`; `Large/Selected/False` and `X-large/Selected/False` stay on
  `False` although two rows are ticked. Implemented as the consistent rule (bulk mode whenever
  `selectedCount > 0`), which is also `_DataTableToolbars`' own default.
- **Header drag spacer is 20px in Figma, 24px here** — Figma's header-row drag frame is 20 wide while
  every row drag item is 24, which would misalign the first label by 4px. `_DataTableHeaderRow`
  already uses 24 everywhere (noted in its own sign-off); `DataTable`'s `<colgroup>` follows it.
- **Column counts in the Figma mock vary** (7 header cells vs 6 body cells in the
  `Selection=None, Draggable=False` variants). That is mock data, not a spec; the data-driven API
  always renders one cell per column.
- **Horizontal scroll placement.** Figma draws the horizontal `Scroll` as a separate 4px bar 16px
  below the table. Here it is `ScrollArea`'s styled native bar, which has the same 4px `border-subtle`
  appearance but sits flush at the bottom edge of the scroll container (and only appears when the
  content actually overflows). Likewise the vertical bar spans the full viewport height instead of
  Figma's 8px top/bottom inset.
- **Sticky header** is a code addition, on by default with `Show vertical scroll`. Figma's vertical
  Scroll indicator overlays the header row too, which would imply the header scrolls away; a sticky
  header is the data-grid convention and `stickyHeader={false}` restores Figma's literal behaviour.
- **Empty state and loading/skeleton are code additions.** The Figma set has no such variant and the
  page's eight "Overview / Example" documentation frames are empty, so there is no documented empty,
  loading, hover, focus or keyboard specification for the composed table. `emptyState` /
  `emptyStateLabel` and `loading` / `skeletonRowCount` follow the system's existing conventions
  (`animate-pulse` on `--scanner-bg-highlight-gray`).
- **Keyboard row reordering is a code addition** — Figma documents no interaction. The handle already
  emits `onHandleActivate`, so grab/move/cancel is wired to make `onRowReorder` usable without a DnD
  library; pointer drag-and-drop remains the app's responsibility.
- **No row hover or selected-row background** in Figma (confirmed on this set too — Selected rows
  differ only by the ticked checkbox). `_DataTableContentRow`'s hovered-layer token is inherited as-is.
- `aria-rowindex` is set on the header and data rows; the expanded-content `<tr>` has none, since it
  is part of its parent row's disclosure rather than a data row.
