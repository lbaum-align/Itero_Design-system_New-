# _DataTableExpansionItem — sign-off

**Figma**: `Items / Data table expansion item` `30570:39079` (page "Data table" `30526:43048`), file `TCdFM9Hy78GHyifCSlkedx`. **Status**: ✅ Built 2026-09-28.

**Variants**: `Size` = Large / X-large / 2X-large → 3 variants, all implemented (`size` prop). Each variant is a 24px-wide cell of the full row height (52 / 72 / 92) holding the 24×24 "Chevron down" icon, `Icons main/icon-primary`.

**Implementation** (`src/components/_data-table-expansion-item/`): `DataTableExpansionItem` (forwardRef `td`).
- Registry icon `chevron-down`, 24px, `--scanner-icon-primary`; rotated 180° when `expanded`
  (matching `Rows / Data table content row` Expansion=Expanded, which shows the chevron pointing up).
- Button carries `aria-expanded` and, when the expanded row has an id, `aria-controls`; label defaults
  to "Expand row" / "Collapse row". `onExpandedChange(next)` on click, Enter/Space (native button).
- Cell width `--scanner-data-table-control-width` (24px) with `box-content`; row-height tokens for height.
- Forced states through `data-state="hovered|focused|pressed"`.

**Storybook** (`Private/_DataTableExpansionItem`): `Default` (controls), `Size: Large|X-large|2X-large`, `Expanded`, `AllSizes`, `AllStates`, `Figma matrix (all 3 variants)`, play tests `TogglesOnClick`, `TogglesWithKeyboard`.

**Tests**: `data-table-expansion-item.test.tsx`, 10 passing. `npx oxlint` clean, `tsc -b --noEmit` clean.

## Deviations / Figma notes
- Figma defines no interactive states for this item; hover/pressed (`bg-hover` / `bg-active`) and the
  1px `border-focus` focus ring are code additions for keyboard operability. Enabled matches Figma.
- Figma's header row uses a **20px** empty spacer for the expansion column ("Expansion=Indend") while the
  content row uses this **24px** item — 24px is used everywhere so the columns line up.
