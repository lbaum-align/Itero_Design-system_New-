# _DataTablePagination — sign-off

**Figma**: `Bars / Data table pagination` `33899:18446` (page "Data table" `30526:43048`) · **Variants**: 1 (no variant properties) · Private sub-component of `Data table` `30943:10418` ("Show pagnation" (sic))
**Status**: ✅ Built 2026-09-28

## API
Controlled: `page` (1-based) · `pageSize` · `totalItems` · `onPageChange(page)` · `onPageSizeChange(pageSize)`. Uncontrolled: `defaultPage` / `defaultPageSize`.
`pageSizeOptions` (default `[10, 20, 50, 100]`) · `itemsPerPageLabel` (`'Items per page'`) · `rangeLabel(start, end, total)` (`"1–10 of 104 items"`) · `pagesLabel(totalPages)` (`"of 10 pages"`) · `pageLabel` (`'Page'`) · `previousLabel` / `nextLabel` (`'Previous page'` / `'Next page'`) · `aria-label` (`'Pagination'`) · `disabled` · `menuMaxHeight` · native `nav` props (`className` merged, ref forwarded).
Parts are marked `data-part="items-control|range|pages-control|actions"`.

## Figma values implemented
| Part | Figma | Implementation |
|---|---|---|
| Row | space-between, gap 16, centred, height 60 | `flex w-full items-center justify-between gap-[--scanner-spacing-5]` |
| Items control | gap 24, padding-right 16 | `gap-[--scanner-spacing-7] pr-[--scanner-spacing-5]` |
| Control | gap 16, padding-right 24, dashed 1px `border-subtle` right edge (dash 4 / gap 4) | `gap-[--scanner-spacing-5] pr-[--scanner-spacing-7]` + repeating-linear-gradient divider |
| "Items per page" | 16/24 Regular, `text-primary` | `--scanner-text-base` / `--scanner-leading-md` |
| Items dropdown | `Dropdowm` Set 01, Single, "10" | `Dropdown size="x-large"` hugging its content, `aria-label="Items per page"` |
| Range | "1–10 of 104 items", 16/24, `text-tertiary` | same, `aria-live="polite"` |
| Pages | gap 16, padding-right 24, dashed right edge | as above |
| Page dropdown + "of 10 pages" | `Dropdowm` Set 01, Single, "1" · 16/24 `text-primary` | `Dropdown` with one option per page (`menuMaxHeight` 240, scrolls) |
| Actions | gap 8 · Button Brand/Secondary/Large/Icon only — Caret left (**Disabled** on page 1) and Caret right | `Button size="large" emphasis="secondary" iconName="caret-left|caret-right" iconOnly` |

Tokens: `src/tokens/components/data-table-bars.css` (divider width/dash/period, dropdown menu max height).

## Behaviour / a11y
- `<nav aria-label="Pagination">`; both dropdowns are labelled select-only comboboxes (the visible "Items per page" text is `aria-hidden` to avoid a duplicate announcement, and is reused verbatim as the dropdown's `aria-label`).
- Previous / next are icon buttons with `aria-label`s, disabled at the first / last page; when the pressed button becomes disabled, focus moves to the other one so the keyboard user is not dropped on `<body>`.
- The range text is a polite live region, announcing the new range after any page or page-size change.
- Changing the page size keeps the first visible row on screen (`page → floor((page-1)·oldSize / newSize) + 1`) and fires `onPageChange` only when the page actually changes.
- `page` is clamped to `1…totalPages`; `totalItems = 0` renders "0–0 of 0 items", "of 1 page" and both buttons disabled.
- Keyboard: Tab through label-dropdown-range-dropdown-buttons; the dropdowns keep the audited `Dropdown` keyboard model (Enter/Space/Arrows open, Escape closes, typeahead).

## Storybook coverage (`Private/_DataTablePagination`)
`Default` (controls for every prop, controlled wrapper) · `Figma matrix (the single variant)` at the Figma width 825 · `Table width (1328)` · `AllStates` (First / Middle / Last page, Single page, No items, Large page size, Disabled) ·
`State: First page / Middle page / Last page / No items / Disabled` · `Custom labels (i18n)` · `Uncontrolled` ·
play tests `Play: previous / next` (range updates, disabled ends, focus hand-off), `Play: page dropdown`, `Play: items per page` (keeps the first visible row), `Play: keyboard`.
Unit tests: `data-table-pagination.test.tsx` — 22 passing. `npx oxlint` clean; `tsc` clean (pre-existing errors only in `src/components/header/`).

## Remaining deviations / Figma inconsistencies
- **Dropdown size**: the Figma instances are set to `Size=Large` but are stale overrides (60px tall, padding 18, 16/24 text, no stroke) — the current `Dropdowm` Large is 48px. Implemented `size="x-large"` (60px), which matches the rendered Figma height and lines the field up with the Large buttons in the same bar; it therefore also carries the X-Large `border-subtle` stroke that the stale instances don't show.
- **Buttons**: the two caret buttons come from the older `01 Button` set (`204:1013`, padding 18); implemented with the current `Button` Large icon-only (60×60, 1px stroke).
- Figma shows the previous button permanently Disabled (page 1 mock); implemented as state-driven (`page === 1` / `page === totalPages`).
- Figma has no hover/focus/disabled variants for the bar; `disabled` disables every control (not Figma-verified).
- Figma text style is named `Code/$tp-code-01` for "Items per page" / range / "of 10 pages" although the font is Roboto 16/24 (not mono) — implemented as the sans 16/24 values of the actual text nodes.
- The Figma range reads "1–10 of 104 items" — numbers are rendered unformatted (no thousands separator); override `rangeLabel` for localisation.
- Dark mode not verified against Figma.
