# _DataTableToolbars — sign-off

**Figma**: `Bars / Data table toolbars` `34038:306507` (page "Data table" `30526:43048`) · **Variants**: Bulk actions (False, True) = 2 · Private sub-component of `Data table` `30943:10418` ("Show toolbar")
**Status**: ✅ Built 2026-09-28

## API
`bulkActions` (Figma "Bulk actions"; default `selectedCount > 0`) · `showSearch` (default `true`) · `searchProps` (all `SearchInput` props except `size` — always Large) · `filters` (slot, Figma frame "Searcuh + filter") ·
`actions: DataTableToolbarAction[]` (Bulk actions=False) · `selectedCount` · `selectedLabel(count)` · `bulkActionItems: DataTableToolbarAction[]` · `onCancel` · `cancelLabel` (default `'Cancel'`) · native `div` props (`className` merged, ref forwarded).
`DataTableToolbarAction`: `{ id, label, iconName?, iconOnly?, emphasis? (default 'secondary'), variant? (default 'brand'), disabled?, loading?, onClick }` → a Large `Button`.
Root carries `data-bulk-actions="true|false"`; parts are marked `data-part="search|actions|bulk-actions|cancel"`.

## Figma values implemented
| Part | Figma | Implementation |
|---|---|---|
| Row | fill width, space-between, gap 32, align top | `flex w-full items-start justify-between gap-[--scanner-spacing-8]` |
| Search + filter | fill, gap 8, Search input **Large / Set 01**, width 288 | `flex flex-1 items-center gap-[--scanner-spacing-3]`, `SearchInput size="large"` at `--scanner-data-table-toolbar-search-width` (288) |
| Buttons group (Bulk=False) | gap 8 · 3× Button Brand/Secondary/Large/Icon only (Add alt) + Button Brand/Primary/Large/Text only | `actions` array → `Button size="large"` |
| Selection summary (Bulk=True) | "2 items selected", Heading 02 18/28 Medium, `text-primary` | `text-scanner-md` / `leading-lg` / `font-medium`, `role="status" aria-live="polite"` |
| Actions (Bulk=True) | gap 8 · 3× Button Brand/Secondary/Large/Text only ("Action 1…3") | `bulkActionItems` → `Button`, wrapped in `role="group" aria-label="Bulk actions"` |
| Cancel (Bulk=True) | padding-left 16, dashed 1px `border-subtle` (dash 4 / gap 4) on the left edge + Button Secondary/Large "Cancel" | `pl-[--scanner-spacing-5]` + absolutely positioned repeating-linear-gradient divider (`--scanner-data-table-bars-divider-*`) |
| Gap summary ↔ actions ↔ cancel | 16 | `gap-[--scanner-spacing-5]` |

Tokens: `src/tokens/components/data-table-bars.css` (search width 288, divider width/dash/period).

## Behaviour / a11y
- Bulk mode is derived from `selectedCount` and can be forced either way with `bulkActions` (Figma variant).
- The summary is a polite live region, so screen readers hear the selection count change; bulk actions are a labelled `group`.
- Icon-only actions take their `label` as `aria-label` (and `title`).
- Search is the audited `SearchInput` (searchbox / combobox with suggestions, Escape clears, clear button) — the toolbar adds no keyboard behaviour of its own.

## Storybook coverage (`Private/_DataTableToolbars`)
`Default` (controls for every prop) · `Bulk actions: False` · `Bulk actions: True` · `AllStates` (2 variants × Enabled / Search filled / Search focused / Actions disabled / Actions loading) · `Figma matrix (all 2 variants)` ·
`Search + filter` (filter Dropdown in the `filters` slot) · `Without search` · `One item selected` · `Overflow: narrow container` (800px) · `Interactive` ·
play tests `Play: bulk action + cancel` (selection → summary, bulk action, Cancel restores the default toolbar) and `Play: search filters rows`.
Unit tests: `data-table-toolbars.test.tsx` — 17 passing. `npx oxlint` clean; `tsc` clean (pre-existing errors only in `src/components/header/`).

## Remaining deviations / Figma inconsistencies
- Figma's frame is named "Searcuh + filter" (typo) and holds only the Search input — no filter control is drawn. Implemented as the `filters` slot next to the search, as the name implies.
- The Figma button instances come from an **older `01 Button` set** (`204:1013`, 2px secondary stroke, padding 18) rather than the audited `36403:6395`. Implemented with the current `Button` (Large, 1px stroke) — heights match (60).
- Figma shows 3 identical icon-only actions with the "Add alt" icon and a "Button text" primary; those are placeholders — the component takes an `actions` array (the stories reproduce the Figma content).
- Figma's search input is a fixed 288px; at narrow widths our search shrinks (instead of overlapping the actions). No Figma guidance for responsive behaviour.
- The bar has no state variants in Figma (hover/focus/disabled live in `SearchInput` / `Button`); disabled and loading actions are supported but not Figma-verified.
- Dark mode not verified against Figma.
