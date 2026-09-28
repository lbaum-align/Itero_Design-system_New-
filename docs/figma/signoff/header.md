# Header — Figma sign-off

| | |
|---|---|
| Figma file | `TCdFM9Hy78GHyifCSlkedx` — "06. Scanner core 1.0.0 full" |
| Page | Header (`34193:926`) |
| Component set | `Header` (`34193:2652`) |
| Variants | 2 — `Menu = Visible` (`34193:2653`), `Menu = Hidden` (`34193:2671`) |
| Code | `src/components/header/` · tokens `src/tokens/components/header.css` |
| Built | New component (first implementation) |

## Figma specification (from `use_figma` node dump + `get_design_context`)

Row: 1920 × 72, `layoutMode HORIZONTAL`, `SPACE_BETWEEN / CENTER`, padding `6px` vertical (raw value, not on the
spacing scale) and `16px` horizontal (`spacing-04` → `--scanner-spacing-5`), fill `Backgrounds main/background-subtle-01`,
1px **inside** bottom stroke `Borders main/border-subtle`.

Left group ("Logo and manu", gap 16):

| Layer | Menu=Visible | Menu=Hidden | Implementation |
|---|---|---|---|
| `Menu` icon 24×24, `icon-primary` | hidden | visible | `menu="hidden"` → hamburger `<button>` with `Icon name="menu" size={24}` |
| `Logo` — `Logo / Variation=iTero`, 70.18 × 28 inside a 75px slot (2px side padding), bottom-aligned in a 56px frame | visible | visible | `Logo variation="itero" height={28}` in a slot with `--scanner-header-logo-inset` side padding and 4px bottom padding (reproduces the 2px optical offset) |
| `Divaider` 1 × 60, `border-accent` | hidden | hidden | not rendered (hidden in both variants; see deviations) |
| `Buttons` (nav) — 7 × `01 Button` Type=Brand/Emphasis=Ghost/Size=Large/Content=Text only (120 × 60, padding 12/16, radius `medium`, label `$tp-label-02` 18/28 `text-primary`) + 1 × Content=Icon only with `More horizontal` (60 × 60) | visible | absent | `navItems` rendered with Button-ghost-Large metrics; entries past `maxVisibleNavItems` (default 7) move into the `More horizontal` overflow `Menu` |

Right group ("Buttons", gap 4 = `spacing-01`): 10 × `01 Button` Ghost/Large/Icon only, 60 × 60, padding 12,
radius `medium`, each holding a 32px icon tinted `Icons main/icon-secondary`
(5 slot placeholders, `Search`, `Notification outline`, `Settings`, `Account`), with one `Divaider`
1 × 60 `border-accent` after the second button. Implemented as `HeaderAction` (a ghost Large `Button` with a
32px `icon-secondary` icon) and `HeaderDivider`, passed through the `actions` / `user` slots.

The page has **no documentation frame** — the "Souce" frame only contains a title text, and neither the set nor its
variants carry a Figma description, so no behaviour/keyboard/overflow rules are documented in Figma.

## Token mapping

| Figma | Token |
|---|---|
| `Backgrounds main/background-subtle-01` (#ffffff / #1b1b1b) | `--scanner-bg-layer-01` (identical values; no `subtle-01` semantic token exists) |
| `Borders main/border-subtle` (bottom stroke) | `--scanner-border-subtle` (inset box-shadow, keeps the 72px height) |
| `Borders main/border-accent` (divider) | `--scanner-border-default` |
| `Icons main/icon-secondary` (action icons) | `--scanner-icon-secondary` |
| `Icons main/icon-primary` (hamburger, logo, "…") | `--scanner-icon-primary` |
| `spacing-04` 16 / `spacing-01` 4 | `--scanner-spacing-5` / `--scanner-spacing-2` |
| radius `medium` 8 | `--scanner-radius-md` |
| `$tp-label-02` 18/28 regular | `--scanner-text-scanner-md` + `--scanner-leading-lg` |
| 6px row padding, 60px row height, 32px action icon, 24px hamburger icon, 2px logo inset | `src/tokens/components/header.css` (`--scanner-header-padding-y`, `-row-height`, `-action-icon-size`, `-menu-icon-size`, `-logo-inset`) |

No hard-coded colours, sizes or type values; Button metrics reuse `--scanner-button-*`.

## API

`menu` · `logoVariation` / `logoHeight` / `logo` / `logoHref` / `logoLabel` · `navItems` (`id`, `label`, `href`,
`target`, `rel`, `disabled`, `onClick`, `data-state`) · `activeItemId` / `defaultActiveItemId` / `onNavItemSelect` ·
`maxVisibleNavItems` · `navLabel` / `overflowLabel` · `menuOpen` / `defaultMenuOpen` / `onMenuOpenChange` /
`menuButtonLabel` / `menuControls` · `actions` / `user` / `children`.
Sub-components: `HeaderAction` (`icon`, `label`, `selected`, `data-state`, all button props), `HeaderDivider`.

Accessibility: `<header>` landmark + `<nav aria-label>`; the active entry gets `aria-current="page"`; entries render
as `<a>` (with `href`) or `<button>`; disabled entries get `aria-disabled` and lose their `href`; the hamburger
exposes `aria-expanded` + `aria-controls`; the overflow trigger exposes `aria-haspopup="menu"` + `aria-expanded`,
opens the shared `Menu` (ArrowDown/ArrowUp open it focusing the first/last item, Escape closes it and returns focus,
outside click closes it), and the active overflow entry is `aria-current="page"` + checked.

## Storybook coverage (`Components/Header`)

`Default` (controls for every prop) · `MenuVisible` · `MenuHidden` · `FigmaMatrix` (both Figma variants) ·
`AllStates` (nav entry and action in enabled / hovered / focused / pressed / disabled via forced `data-state`,
plus the current entry) · `LongNavigation` (10 entries, 7 visible + overflow) · `OverflowMenuOpen` (play: opens the
menu) · `DarkTheme` · `LogoAndActionsOnly` · play tests `NavigationActivation`, `OverflowMenuKeyboard`,
`MenuTriggerToggles`.

## Verification

- `npx tsc -b --noEmit` — clean for `src/components/header`.
- `npx vitest run src/components/header` — 26 tests, all passing.
- `npx oxlint src/components/header` — clean.
- Visual: Storybook `MenuVisible`, `MenuHidden`, `DarkTheme`, `AllStates`, `OverflowMenuOpen` screenshotted at
  1920px and compared against the Figma set screenshot (`34193:2652`) — layout, spacing, icon sizes, divider
  position and both themes match.

## Deviations / Figma inconsistencies

1. **No "current page" state in Figma.** The set has no selected/active navigation variant, but an app header needs
   to show the current page. The active entry (and an overflow trigger whose menu holds the active entry) uses
   `background-layer-selected` / `-hovered` / `-pressed` (`--scanner-bg-layer-selected*`).
2. **Icon sizes/colours are instance overrides.** The published `01 Button` Ghost/Large/Icon only main component is
   44 × 44 with a 20px icon in this file version, while the header overrides every instance to 60 × 60 with a 32px
   icon; the icon fill is overridden to `icon-secondary` (the Button default is `icon-primary`). The header keeps the
   60 × 60 Button (our Button's Figma-correct Large size) and applies the 32px / `icon-secondary` overrides locally.
   Five of the ten right-hand buttons carry a 20px "Add alt" placeholder icon inside a "Size=32x32" instance — an
   inconsistency in the mock-up; the implementation uses one consistent 32px icon size.
3. **`background-subtle-01` has no semantic token.** Its values are identical to `background-layer-01`, which is
   tokenised, so the header uses `--scanner-bg-layer-01` (documented in `header.css`).
4. **Hidden layers not implemented as props.** The `Divaider` between logo and navigation (`36927:384`) and the 20×20
   `Menu` icon instance are hidden in both variants and are not exposed as Figma properties, so they are not built.
   A divider is still available in the actions slot via `HeaderDivider`.
5. **Hamburger has no hover/pressed state in Figma** — it is a bare 24px icon. Implemented as a focusable button with
   the standard focus ring and no hover surface.
6. **No responsive rules in Figma** (a single 1920px frame, no documentation frame). Navigation entries may shrink to
   the Figma Button min-width (72px) and truncate their label so the navigation can never overlap the actions;
   collapsing the navigation is done explicitly with `menu="hidden"` or `maxVisibleNavItems`.
7. **Logo vertical offset.** In Figma the logo sits ~2px above the row centre (56px frame with 16px padding inside a
   60px row). Reproduced with 4px bottom padding on the logo slot.
8. The Figma layer is named "Logo and manu" (typo for "menu") and "Divaider" (typo for "divider") — normalised in code.
