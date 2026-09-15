# Sign-off — Icon registry (`src/icons/`)

Source: Figma "05. Icons library 2.0.0", as instanced in "06. Scanner core 1.0.0 full" (`TCdFM9Hy78GHyifCSlkedx`).
The library file itself is not accessible (not subscribed / not searchable), so glyphs were exported from the
**main components of the icon instances** found on the component pages (`exportAsync({ format: 'SVG_STRING' })`).

## Method

1. One read-only `use_figma` script per page in `inventory.md` (33 pages) listed every INSTANCE ≤ 48px whose remote
   main component is named `Size=NxN`, grouped by icon set + size, with host component sets.
2. For each icon set, all four variants (32/24/20/16) were exported and their path numbers normalised to a 32-unit
   grid: **every set's sizes are exact scales of one drawing** (max deviation < 0.05 units) — including User,
   Launch, Information, View on/off. Carbon's distinct 16px drawings are not used in this library.
3. The 32×32 drawing is stored once per icon (`viewBox="0 0 32 32"`, `fill="currentColor"`, `fill-rule="evenodd"`
   only where Figma exports it). The `size` prop scales it.

**Per-size decision:** no `sizes` map — not needed, because Figma's size variants are not distinct drawings.

## Figma icons used by components (set / sizes → hosts)

| Figma icon | Sizes used | Used by |
|---|---|---|
| Account | 32 | Header |
| Add alt | 20, 24, 32 | Button (default icon), Data table toolbar, Header |
| Add empty | 16–32 | Number input, Slider |
| Arrow up / Arrow down | 24 | Data table header item (Sorted=Ascending / Descending) |
| Calendar | 24 | Date picker |
| Caret down | 24 | Calendar (month/year) |
| Caret left / Caret right | 20, 24 | Pagination, Data table pagination |
| Checkmark empty | 20, 24 | _Menu items, _Select menu Item (selected) |
| Checkmark fill | 20, 24, 32 | Progress bar (100%), Toast (Success); Do/Don't markers on doc pages |
| Checkmark outline | 24 | Stepper items (Completed) |
| Chevron down / up | 20, 24 | Accordion, Split button, Dropdown/Combobox, Menu scroll, Data table rows |
| Chevron left / right | 24 | Calendar, _Menu trailing elements (Submenu) |
| Close empty | 20, 24, 32 | Tag, Search input, Text input/area (clear), Dropdown tags, Modal, Toast |
| Close fill | 20 | Do/Don't markers on doc pages only |
| Drag drop | 24 | Data table drag item |
| Edit | 24 | Data table content item |
| Error | 24, 32 | Progress bar (Error), Stepper items (Error), Toast (Error) |
| Filter | 20 | Data table header item |
| Gift | 24 | _Decoration |
| Help outline | 16, 20 | Icon trigger tooltip (Explainer) in all form fields |
| Information | 20, 24, 32 | Badge (default icon), Toast (Information) |
| Launch | 16, 20 | Link (External) |
| Menu | 20, 24 | Header |
| More horizontal | 20, 24, 32 | Pagination (ellipsis), Data table content item, Header |
| Notification outline | 32 | Header |
| Number filled / 1–8, Number outline / 1–8 | 24 | _Step counter |
| Search | 24, 32 | Search input, Data table toolbar, Header |
| Settings | 20, 32 | Popover example, Header |
| Subtract empty | 16–32 | Number input, Slider |
| User | 16, 20, 24, 32 | Avatar (Icon variant) |
| View on / View off | 20, 24 | Password input (Visibility) |
| Warning | 32 | Toast (Warning) |

(Loading spinner, 01 Button and 02 Icon trigger tooltip instances were also found but are components, not icons.)

## Registry name → Figma icon

| Registry name | Figma icon | Status |
|---|---|---|
| `account` | Account | added |
| `add` | Add alt | unchanged geometry (re-exported at 32) |
| `add-empty` | Add empty | added |
| `arrow-down` | Arrow down | **replaced** (was Material) |
| `arrow-left` | Arrow up rotated −90° | **replaced** — derived (no Figma usage of "Arrow left") |
| `arrow-right` | Arrow up rotated 90° | **replaced** — derived (no Figma usage of "Arrow right") |
| `arrow-up` | Arrow up | **replaced** (was Material) |
| `calendar` | Calendar | **replaced** (was Material) |
| `caret-down` | Caret down | added |
| `caret-left` / `caret-right` | Caret left / Caret right | added |
| `check` | Checkmark empty | **replaced** (was Material check) |
| `checkmark` | Checkmark fill | same geometry, exact export |
| `checkmark-outline` | Checkmark outline | added |
| `chevron-down/up/left/right` | Chevron down/up/left/right | same geometry, exact export |
| `close`, `close-empty` | Close empty | same geometry, exact export |
| `close-fill` | Close fill | added |
| `copy` | — | **legacy** (no Figma usage found; Material glyph kept) |
| `drag` | Drag drop | **replaced** (was 6 circles) |
| `edit` | Edit | **replaced** (was Material pencil) |
| `error` | Error (circle with "!") | **replaced** (was circle with × = Figma "Close fill", now `close-fill`) |
| `external`, `launch` | Launch | **replaced** / added |
| `eye`, `view` | View on | **replaced** / added |
| `eye-off`, `view-off` | View off | **replaced** / added |
| `filter` | Filter | **replaced** (was Material lines) |
| `gift` | Gift | added |
| `help` | Help outline | same geometry, exact export |
| `info`, `information` | Information | **replaced** (was Material circle-i) / added |
| `menu` | Menu | **replaced** (was Material) |
| `minus`, `subtract-empty` | Subtract empty | **replaced** / added |
| `more-horizontal` | More horizontal | **replaced** (circles r=2 at 6/12/18 → Figma r=1.5 at 6/12/18 on 24 grid) |
| `more-vertical` | More horizontal rotated 90° | **replaced** — derived |
| `notification-outline` | Notification outline | added |
| `number-filled-1…8` | Number filled / 1…8 | added |
| `number-outline-1…8` | Number outline / 1…8 | added |
| `search` | Search | **replaced** (was Material) |
| `settings` | Settings | added |
| `sort` | — | **legacy** (Data table "Sorted=None" shows no icon; Material glyph kept) |
| `sort-ascending` | Arrow up | **replaced** (Figma Data table header item Sorted=Ascending) |
| `sort-descending` | Arrow down | **replaced** (Sorted=Descending) |
| `success` | Checkmark fill | same geometry, exact export |
| `user` | User | **replaced** (was Material filled person) |
| `warning` | Warning | **replaced** (was Material triangle) |

All 35 original names are kept. `IconName` gained 31 names (15 Figma-named icons/aliases + 16 step numbers).
`iconRegistry` is typed `Record<IconName, IconEntry>`, so the union and the registry cannot drift.
Each entry carries `figmaName` and `source: 'figma' | 'derived' | 'legacy'`.

## Components switched to the registry (local glyph copies deleted)

| Component | Before | After | Deleted |
|---|---|---|---|
| Avatar | `UserGlyph` (32 grid) | `<Icon name="user" size={cfg.icon} focusable="false">` | `avatar/UserGlyph.tsx` |
| PasswordInput | `ViewOnIcon` / `ViewOffIcon` (24 grid) | `<Icon name="view" / "view-off" size={24}>` | `password-input/visibility-icons.tsx` |
| Link | inline `LaunchIcon` (20 grid) | `<Icon name="launch" data-part="external-icon">` | — (inline) |
| Badge | inline `InformationIcon` (20 grid) | `<Icon name="information" size={28}>` | — (inline) |
| ProgressBar | `ErrorFilledIcon` (24 grid) | `<Icon name="error">` | `progress-bar/status-icons.tsx` |
| _StepCounter / stepper items | path arrays in `step-icons.tsx` | `step-icons.tsx` now thin wrappers over `Icon` (exports `NumberIcon`, `CheckmarkOutlineIcon`, `ErrorFilledIcon` kept) | path data removed |
| NumberInput | `AddIcon` / `SubtractIcon` | `<Icon name="add-empty" / "subtract-empty">` | `number-input/number-input-icons.tsx` |
| Pagination | `CaretLeftIcon` / `CaretRightIcon` / `MoreHorizontalIcon` | `<Icon name="caret-left" / "caret-right" / "more-horizontal">` | `pagination/pagination-icons.tsx` |

Rendered geometry is identical: the old copies were the 24/20-grid exports of the same Figma drawings
(e.g. Launch 20: `16.25 17.5` = 26×0.625, 28×0.625). DOM differences: `viewBox` is now `0 0 32 32`, the svg gains
`data-icon` and the `shrink-0` class; icons sized by CSS classes also get `width`/`height` attributes (overridden by the class).
One fill-rule nuance: `step-icons.tsx` applied `evenodd` to every path; the registry uses Figma's exported rules
(nonzero for "Checkmark outline" and "Error") — visually identical (verified in Storybook).

## Verification

- `npx tsc -b --noEmit` — clean.
- `npx vitest run src/icons src/components/{avatar,password-input,link,badge,progress-bar,_step-counter,_vertical-stepper-items,_horizontal-stepper-items,stepper,number-input,pagination}` — 13 files, 160 tests pass (new `icon.test.tsx`: 9 tests).
- `npx oxlint` on the same folders — clean.
- Visual: Storybook `Foundations/Icons` → `AllIconsAllSizes`, `FigmaSizes`; `PasswordInput/FigmaMatrix`, `_HorizontalStepperItems/AllStates`,
  `Pagination/ManyPages` screenshotted (headless Edge) and compared with Figma screenshots of Toast (34305:10008) and _Step counter (34201:2238). Glyphs match.

## Stories

`Foundations/Icons`: `Default` (controls), `AllIconsAllSizes` (every icon × 12/16/20/24/28/32 with Figma name and source; `*` marks sizes
Figma doesn't ship; play test counts rows/svgs), `Gallery`, `FigmaSizes`, `WithColor`, `Labelled` (play test for role/label).

## Deviations / open points

- **No Figma usage found** for `copy` and `sort` → legacy Material glyphs kept. `arrow-left`, `arrow-right`, `more-vertical` are
  rotations of Figma glyphs (matches Carbon's own drawings) — replace with exports if these icons are ever instanced in Figma.
- `Warning` exports with `evenodd`, so the "!" is a hole showing the background (as in Figma), not a white fill.
- Remaining local glyph copies in folders owned by other agents: `_menu-items/MenuItems.tsx` and `_select-menu-item/SelectMenuItem.tsx`
  (Figma "Checkmark empty" → registry `check`). `checkbox-item`, `radio-button-item`, `spinner`, `_keyboard-shortcut`, `text-area` (resize handle)
  draw control shapes, not library icons.
- Sign-off docs `avatar.md`, `password-input.md`, `progress-bar.md`, `_step-counter.md` still mention the deleted local glyph files.
