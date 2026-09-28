# Calendar — sign-off

**Figma**: `02 Calendar` `20628:32152` (page Date picker `15305:6737`) · **Variants**: Content (Day, Month, Year) = 3 · Cells: `_Days`
**Status**: ✅ Built 2026-09-15

## Implementation
`src/components/calendar/Calendar.tsx` (+ private `date-utils.ts`, no date library — native `Date` + `Intl.DateTimeFormat`).

- Panel: 375px wide (min 324, `max-width: 100%`), `background-elevated`, radius medium, shadow "Depth 01" (`--scanner-shadow-depth-01`).
- Header: 12/16 padding, 8 gap, 1px `border-subtle` bottom stroke (inset shadow, keeps 52px). Day view: chevron-left · "July 2024" 18/28 medium + caret-down (button → Year view) · chevron-right, icons 24px `icon-secondary`. Month/Year views: centred title only.
- Day view: weekday row 16/24 `text-tertiary`, 4px padding (`Intl` short names, long name as `aria-label`); weeks as 52px rows of `_Days`, empty cells outside the month; only the weeks the month needs.
- Month view: 12 months, 4 columns × 90px cells. Year view: 4 columns × 90px, fixed 350px panel height, scrolls (4px scrollbar: `border-subtle` track + thumb, rounded full) and centres the active year.
- Flow: caret → Year → pick year → Month → pick month → Day.

Props: `mode` (`single | range`), `value` / `defaultValue` / `onChange` (`Date` or `{ start, end }`), `month` / `defaultMonth` / `onMonthChange`, `view` / `defaultView` / `onViewChange` (Figma Content), `min`, `max`, `isDateDisabled`, `today`, `locale`, `weekStartsOn`, `yearRange`, `autoFocus`, `previousMonthLabel`, `nextMonthLabel`, `switchViewLabel`, `className`.

Range: first pick → `{ start, end: null }`, second pick completes (swapped if earlier), hover/keyboard focus previews In range days; start/end use State=Selected, days between State=In range.

A11y / keyboard: `role="grid"` with rows / columnheaders / gridcells, `aria-selected` on gridcells (selected + committed range), `aria-current="date"` on today, `aria-disabled` on disabled days (still focusable), roving tabindex, live title. Arrows ±1 day / ±1 week, Home/End start/end of week, PageUp/PageDown ±1 month, Shift+PageUp/PageDown ±1 year (focus clamped to min/max, month follows focus), Enter/Space select. Month/Year views: arrows ±1 / ±1 row, Home/End row start/end, PageUp/PageDown ±1 year (Month view), Escape → Day view (propagation stopped). Prev/next buttons disable at min/max.

Component tokens: `--scanner-calendar-width` 375, `-min-width` 324, `-min-height` 308, `-max-height` 350, `-period-cell-height` 90, `-scrollbar-width` 4.

## Storybook coverage (`Components/Calendar`)
`Default` (controls) · `Content: Day / Month / Year` · `Single: selected date` · `Range selection` · `Min / max and disabled dates` · `Locales` (en-US, en-GB, de-DE, fr-FR, he-IL, ja-JP; weekStartsOn 0/1) · `Figma matrix (all 3 variants)` · `AllStates` (today, selected, range start/in range/end, disabled) · play tests `ClickSelectsDate`, `KeyboardNavigation`, `MonthAndYearViews`, `RangeByClicks`, `DisabledDatesIgnored` (all reach phase `finished`).
Unit tests: `calendar.test.tsx` — 22 passing (fixed `today` props + one fake-clock test; includes date-utils).

## Visual comparison
Figma matrix render vs Figma screenshots of Content=Day/Month/Year: panel size, radius, shadow, header padding/stroke, title type, chevrons/caret, weekday row, 52px rows, 90px month/year cells, today indicator and Year-view scrollbar match.

## Deviations / Figma inconsistencies
- Figma's July 2024 sample starts on Sunday (July 1, 2024 is a Monday); real dates are rendered.
- Figma Day view has `max-height: 350` with clipping, which cuts off the bottom padding of a 5-week month and a whole row of 6-week months; the Day view grows with its weeks instead (min-height 308). Month/Year views are 350px as drawn.
- Figma weekday labels sit in a 36px text box left-aligned within the 52px column (≈4px left of the day numbers); labels are centred over the day column.
- Figma header items are top-aligned (24px icons 2px above the 28px title centre); implemented vertically centred.
- Chevron/caret hover (`bg-hover`) and focus ring (2px `border-focus`, shared `fieldAction`) aren't drawn in Figma.
- Year view last row in Figma is 77px (inconsistent); all rows are 90px. Default year list is today −100 … +50 (or min/max years / `yearRange`).
- Scrollbar styled locally with `::-webkit-scrollbar` (Chromium/Safari); Firefox shows its native thin scrollbar. The shared Scroll component (built in parallel) isn't used.
- Dark mode not verified against Figma.
