# _DataTableHeaderItem — sign-off

**Figma**: `Items / Data table header item` `30601:2824` (page "Data table" `30526:43048`), file `TCdFM9Hy78GHyifCSlkedx`. **Status**: ✅ Built 2026-09-28.

**Variants**: `Size` = Large (only) × `Sorted` = None / Ascending / Descending → 3 variants, plus the boolean properties `Filterable` (default false) and `Show divider` (component default true). All implemented.

**Implementation** (`src/components/_data-table-header-item/`): `DataTableHeaderItem` (forwardRef `th scope="col"`).
- 52px tall (`--scanner-data-table-row-height-lg`), padding-right spacing-04 (16), padding-left 0
  (the row supplies the 16px gap through `--scanner-data-table-cell-gap`), 16px inner gap.
- Label: Body/$tp-body-02 18/28 Regular in `--scanner-text-secondary`, left aligned, wraps (Figma text is fill/hug).
- Sort arrow: registry `sort-ascending` / `sort-descending` (Figma "Arrow up" / "Arrow down"), 24px.
  `sorted="none"` renders no arrow, exactly like Figma.
- Filter button: registry `filter`, 20px, shown by `filterable`, `aria-label` defaults to `Filter <label>`.
- Divider: 1 × 28 `--scanner-border-subtle` rule at the trailing edge (`showDivider`).
- a11y: `aria-sort` on the `th` mirrors `sorted`; the label becomes a `<button>` when sortable and
  cycles none → ascending → descending → none (Enter/Space via native button). Forced states via `data-state`.

**Storybook** (`Private/_DataTableHeaderItem`): `Default` (controls incl. forced state), `Sorted: None|Ascending|Descending`, `Filterable`, `Show divider`, `NotSortable`, `AllStates` (5 states × 3 sort directions), `Figma matrix (Sorted × Filterable × Show divider)`, `LongLabelWraps`, play tests `SortCyclesOnClick`, `SortWithKeyboard`, `FilterButtonIsOperable`.

**Tests**: `data-table-header-item.test.tsx`, 12 passing. `npx oxlint` clean, `tsc -b --noEmit` clean.

## Deviations / Figma notes
- **Figma inconsistency**: the Ascending variant's arrow is bound to `Icons main/icon-tertiary`, the
  Descending one to `icon-secondary`. Both are rendered in `icon-secondary` (matches the label colour).
- The Filter instance is hidden in every published variant, so its colour is not defined in Figma;
  `icon-secondary` is used, consistent with the label and the sort arrow.
- Figma's text style is tagged `Code/$tp-code-02` on the header label, but its actual values are
  Roboto Regular 18/28 — the same as Body/$tp-body-02 used by the content cells. The values are
  implemented, not the style name.
- `showDivider` defaults to **false** (the component-set default is true) because every row usage in
  Figma sets it to false; pass `showDivider` explicitly for the divider.
- Figma has no hover/focus/pressed state for the header; the hovered/pressed layer tokens and the
  focus ring on the sort and filter buttons are code additions for keyboard operability.
