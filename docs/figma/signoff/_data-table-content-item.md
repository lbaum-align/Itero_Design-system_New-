# _DataTableContentItem — sign-off

**Figma**: `Items / Data table content item` `30526:43149` (page "Data table" `30526:43048`), file `TCdFM9Hy78GHyifCSlkedx`. **Status**: ✅ Built 2026-09-28.

**Variants**: `Size` (Large (1 line) / X-large (2 lines) / 2X-large (3 lines)) × `Content` (Text, Text + subtext, Link, Badge, Progress, Buttons, Slot) = **21 variants**, plus the `Show avatar` boolean. All implemented (`size`, `content`, `avatar`/`showAvatar`).

**Implementation** (`src/components/_data-table-content-item/`): `DataTableContentItem` (forwardRef `td`).
- Fixed cell height per size (52 / 72 / 92, `--scanner-data-table-row-height-*`), content vertically centred;
  padding-right spacing-04 (16) — spacing-01 (4) with right alignment for `content="buttons"`.
- Text: Body/$tp-body-02 18/28 → `text-scanner-md` / `leading-lg`; text in `text-primary`, subtext in
  `text-secondary`, 4px gap; ellipsis after 1 line (Figma `ENDING:1`), 2 lines for the 2X-large
  text + subtext title (Figma `ENDING:2`).
- Avatar (Text / Text + subtext only): reuses `Avatar`, 28px at Large and 36px above, 16px gap.
- Link: reuses `Link` (Type=Primary, Size=Medium). Badge: reuses `Badge` (Status=Neutral by default).
- Progress: Figma's own "indicator" — 3 × 36 × 4 rounded rectangles, 2px `border-subtle` stroke, 4px gap
  (`--scanner-data-table-progress-segment-*`), wrapped in 8px vertical padding above Large;
  X-large adds the text, 2X-large text + subtext. Exposed as `role="progressbar"` with `aria-valuenow/max`.
- Buttons: reuses `Button` (Emphasis=Ghost, Icon only) sized to 40px via `--scanner-data-table-action-size`;
  Figma uses "Edit" and "More horizontal". Slot: reuses `SlotContent` (or `children`).

**Storybook** (`Private/_DataTableContentItem`): `Default` (controls), one story per `Content` value, `Show avatar`, `AllSizes`, `AllStates` (link + buttons × forced states), `Figma matrix (all 21 variants)` × Show avatar, `ProgressValues`, `LongTextTruncates`, play tests `ActionButtonsAreOperable`, `LinkIsFocusable`.

**Tests**: `data-table-content-item.test.tsx`, 18 passing. `npx oxlint` clean, `tsc -b --noEmit` clean.

## Deviations / Figma notes
- **Figma inconsistency**: the `Large (1 line), Content=Text + subtext` variant contains only the text
  node (no subtext) while its X-large/2X-large siblings contain both. Implemented as drawn: the subtext
  is not rendered at Large.
- **Figma inconsistency**: `X-large (2 lines), Content=Text + subtext` fixes the cell at 72px while its
  bound 16px vertical padding + 60px content would need 92px. Vertical padding is dropped and content is
  centred in the fixed height (the same applies to Text and Progress variants).
- Figma's "Progress" is a static 3-segment indicator with **no filled state defined**. The empty segments
  match Figma exactly; filled segments use `--scanner-border-interactive` (the same fill `ProgressBar`
  uses). Pass `children` to drop in a real `ProgressBar` instead.
- Figma's Buttons variant uses a 40 × 40 icon-only Button and a "03 Icon menu button" instance; the
  Scanner `Button` Medium is 48px in this library version, so the cell overrides the box to 40px
  (`--scanner-data-table-action-size`) and keeps the Button's own radius, colours and focus ring.
  The menu button is rendered as a plain icon button — wiring it to a `Menu` is the `DataTable`'s job.
- The third, hidden "Button 03" (secondary, 36px) of the Figma variant is not rendered (hidden in Figma).
