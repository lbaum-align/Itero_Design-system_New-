# PageHeader — sign-off

**Figma**: `Page header` `34197:1887` (page Page title `34197:135`) · **Variants**: Show breadcrumbs (True, False) × Show tabs (False, True) = 4 · Show subtitle · Show actions · Title · Subtitle
**Status**: ✅ Verified 2026-09-15

## Storybook coverage
`Default` (Figma boolean controls: Show breadcrumbs / tabs / subtitle / actions, Title, Subtitle) · one story per variant (`Show breadcrumbs=… , Show tabs=…`) · `Show subtitle` · `Show actions` · `AllFeatures` · `Figma matrix (4 variants × subtitle/actions)` · `LongTitleWraps` · `DarkTheme` · play tests `Landmarks`, `KeyboardThroughSlots` (breadcrumb → actions → tabs, ArrowRight in tabs) (both passing in headless Edge).
Unit tests: `page-header.test.tsx` — 7 passing.

## Fixed during audit
- Top padding without breadcrumbs 40px → **48px** (`spacing-10`).
- Dashed divider: CSS `border-dashed` (browser dash length) → 1px `border-subtle` line with Figma's exact 4px dash / 4px gap, drawn inside the box behind the tabs (component tokens in `page-header.css`).
- Subtitle Body 18/28 → Figma's bound variables font-size/line-height "small" (14/20), `text-secondary`.
- Title: `min-w-full` → `w-full break-words` (long titles wrap; actions stay top-right).
- Props extend `HTMLAttributes<HTMLElement>` (rest was spread untyped); `title`/`subtitle` accept ReactNode.
- Stories: `iconName="settings"` (not in the icon registry → blank button) replaced by `add`, matching Figma's "Add alt" icon; hooks-in-render removed; composed with the re-audited Breadcrumbs (grey "|" dividers, three links, no current page) and TabGroup (no container border).

## Visual comparison
Heights match Figma exactly: 124 / 176 / 160 / 220px for the four variants (subtitle adds 32px). Spacing, divider, breadcrumbs and tab positions match the Figma layout.

## Remaining deviations / Figma inconsistencies
- The Figma component is built from the older remote "ADS 1.0.0" library: its action buttons are "Size=Large" but 44px tall with 14px labels, and breadcrumbs/tabs are older instances. Stories use the current Scanner `Button size="medium"` (48px, closest match) and current Breadcrumbs/TabGroup.
- Subtitle is bound to the remote text style `Body/$tp-body-01` at 14/20, while this file's local `$tp-body-01` is 16/24. Implemented 14/20 (the bound size/line-height variables).
- The Figma "Show tabs=True, Show breadcrumbs=True" variant wraps the tabs in an extra "Content" frame; no visual difference.
