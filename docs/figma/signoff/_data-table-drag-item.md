# _DataTableDragItem — sign-off

**Figma**: `Items / Data table drag item` `34019:66971` (page "Data table" `30526:43048`), file `TCdFM9Hy78GHyifCSlkedx`. **Status**: ✅ Built 2026-09-28.

**Variants**: `Size` = Large / X-large / 2X-large → 3 variants, all implemented (`size` prop). Each variant is a 24px-wide cell of the full row height (52 / 72 / 92) holding the 24×24 "Drag drop" icon, vertically centred, `Icons main/icon-tertiary`.

**Implementation** (`src/components/_data-table-drag-item/`): `DataTableDragItem` (forwardRef `td`).
- Cell width `--scanner-data-table-control-width` (24px) with `box-content`, so the row's 16px gap
  (`--scanner-data-table-cell-gap`, set by the row) sits outside the Figma column width.
- Heights from `--scanner-data-table-row-height-lg|xl|2xl`.
- Glyph: registry icon `drag` (Figma "Drag drop"), 24px, `--scanner-icon-tertiary`.
- Handle is a `<button type="button">` with `aria-label` (default "Drag to reorder row"), `cursor-grab`,
  Enter/Space → `onHandleActivate` (keyboard drag entry point); `disabled` → `icon-disabled` + `aria-disabled`.
- Forced states through `data-state="hovered|focused|pressed"` next to `:hover` / `:focus-visible` / `:active`.

**Storybook** (`Private/_DataTableDragItem`): `Default` (controls incl. forced state), `Size: Large|X-large|2X-large`, `AllSizes`, `AllStates`, `Figma matrix (all 3 variants)`, play tests `KeyboardActivation`, `DisabledIsNotOperable`.

**Tests**: `data-table-drag-item.test.tsx`, 10 passing. `npx oxlint` clean, `tsc -b --noEmit` clean.

## Deviations / Figma notes
- Figma defines **no interactive states** for this item. Hover/pressed feedback (`bg-hover` / `bg-active`)
  and the 1px `border-focus` focus ring are code additions — a drag handle must be reachable and visible
  to keyboard users. Enabled state matches Figma pixel for pixel.
- Figma's header row uses a **20px** empty spacer for the drag column while the content row uses the
  **24px** drag item. This component uses 24px everywhere so header and body columns line up (the 20px
  spacer is a Figma inconsistency).
