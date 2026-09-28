# Toolbar — sign-off

**Not a Figma component.** Added 2026-09-28 from a product spec + a reference screenshot, so there is no
Figma node to verify against. If it is later designed in Figma, re-audit it like the others.

## Spec implemented

| Property | Value | Source |
|---|---|---|
| Button size | 60 × 60 | spec → `--scanner-toolbar-button-size` |
| Icon size | 48 | spec → `--scanner-toolbar-icon-size` (required adding 40/48 to `IconSize`) |
| Button radius | 8px | `--scanner-radius-md` |
| Gap between buttons | 4px | `--scanner-spacing-2` |
| Bar padding | 4px | `--scanner-spacing-2` |
| Bar background | white | `--scanner-bg-layer-01` (`layer={2}` → `--scanner-bg-layer-02`) |
| Bar border / radius | 1px inset stroke, 8px | `--scanner-border-subtle`, `--scanner-radius-md` |
| Divider | 1px, inset 8px from the ends | `--scanner-border-subtle` |
| Collapse button | at the start of the bar, divider after it | reference screenshot |

No hardcoded colours: every colour is a semantic token, so light and dark themes both work.

## Components

- `Toolbar` — `orientation` (horizontal default / vertical), `collapsible`, `collapsed` / `defaultCollapsed` /
  `onCollapsedChange`, `collapseLabel` / `expandLabel`, `layer`.
- `ToolbarButton` — `iconName` or `icon`, required `label` (accessible name), `selected` (→ `aria-pressed`),
  `disabled`, `data-state` (hovered / focused / pressed) for forced visual states.
- `ToolbarDivider` — separates groups; follows the toolbar's orientation.

## Behaviour

- `role="toolbar"` with `aria-orientation`; WAI-ARIA toolbar keyboard: one tab stop, arrow keys move between
  buttons (wrapping, skipping disabled), Home/End jump to the ends.
- Collapse button carries `aria-expanded`; collapsing hides the other buttons and flips the chevron.
- Button states reuse Button's tokens: hover / pressed layer backgrounds, selected layer background,
  2px focus ring 4px outside the button, `icon-disabled` when disabled.

## Storybook

`Default`, `Horizontal`, `Vertical`, `WithoutCollapse`, `Collapsed`, `WithSelectedButton`,
`With divider between groups`, `DisabledButton`, `AllStates` (default/selected × enabled/hovered/focused/pressed/disabled),
`Orientations`, `Layers`, `Controlled`, `ManyButtons`, plus play tests (collapse, arrow keys, disabled skipping).

## Open questions for design

- Orientation: the reference crop was ambiguous, so both are supported with horizontal as the default.
- The bar has a subtle 1px stroke so it reads on a white page; Figma may want the Depth 01 shadow instead.
- Icon sizes 40 and 48 were added to `IconSize`; the registry glyphs scale cleanly, but 48px icons are new to the system.
