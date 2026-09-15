# Badge — sign-off

**Figma**: `Badge` set `12855:13246` (page `15305:6751`), file `TCdFM9Hy78GHyifCSlkedx`. **Status**: ✅ Verified 2026-09-15.

**Variants**: Status (Netral, Info, Success, Warning, Destructive) × State (Enabled, Loading) × Layout (Default, On image) = 20, plus Show icon, Icon (instance swap) and Text value.

**Storybook coverage** (`Components/Badge`): `Default`, one story per Status, `Layout: Default`, `Layout: On image`, `Show icon: True`, `RegistryIcon`, `AllStates`, `State: Loading`, `Figma matrix (all 20 variants)` (× Show icon), `TruncatedLabel`, play tests `RendersLabel`, `LoadingIsHidden`.

**Tests**: `badge.test.tsx`, 18 passing.

## Fixed during audit
- Typography 14/20 → Body 02 18/28, so height is now 36px (4/8 padding, 4px gap, radius 4, min-width 24)
- Border was a CSS `border` that added 2px. It's now a 1px inset stroke (`border-highlight-*`) like Figma.
- Default layout colours use semantic tokens (`bg-highlight-*`, `border-highlight-*`, `text-on-highlight-*`) instead of primitives (`blue-100`, `green-800`…). Neutral uses `bg/border-highlight-gray` (was `gray-alpha-5` primitive).
- Icon slot 20 → 28px (Figma `Icon- Size / Small` in Scanner mode), coloured `icon-on-highlight-*` (default) / `icon-link|success|warning|error|primary` (on image)
- Added `showIcon` (Figma "Show icon") with the Figma **Information** glyph as the default (the registry `info` glyph is different), and `iconName` for registry icons. `icon` (custom node) is still supported.
- Loading placeholder: `gray-alpha-5` → `bg-highlight-gray`, fixed 67×32 via tokens
- Labels are single-line and truncate with an ellipsis (Figma content guideline). Props extend span HTML attributes, so `title` can be passed.

## Remaining deviations / Figma notes
- Figma State=Loading is 32px tall, while Enabled is 36px. Implemented Figma's 32px. Probably a Figma mistake.
- The docs mention two sizes, "Medium 28px / Small 20px", but the component set has only one size. Not implemented.
- The docs "Variations" section describes Brand/Danger/Success *button* types (copy error).
- Icon colours for Info/Success/Warning/On image couldn't be read (the hidden instances have no children in the file). Mapped by analogy: Destructive's exported icon fill `#A31035` = `icon-on-highlight-red`.
- The Figma truncation guideline asks for a tooltip on hover. The Badge doesn't add one itself: pass `title` or wrap it in Tooltip.
