# Component Audit Brief

How to audit an existing component against Figma and fix it. Button (`src/components/button/`) is the finished reference:
read `Button.tsx`, `button.stories.tsx`, `button.test.tsx` and `docs/figma/signoff.md` before starting.

## Sources of truth

- Figma file `TCdFM9Hy78GHyifCSlkedx` ("06. Scanner core 1.0.0 full"). Node IDs: `docs/figma/inventory.md`.
- Figma components are bound to the variable collection **"Tokens - Self-contained"** (Align light / Align dark).
  Our CSS tokens already mirror it: `src/tokens/semantic.css` (every token has its Figma variable name in a comment),
  `src/tokens/typography.css` (27 Figma text styles as `.scanner-text-*`), `src/tokens/spacing.css`.
  Ignore the file's local "Semantic" collection — components don't use it.
- Figma variable → CSS token examples: `Text main/text-primary` → `--scanner-text-primary`; `Hovered states/background-layer-hovered` → `--scanner-bg-hover`;
  `Pressed states/layer-pressed` → `--scanner-bg-active`; `Borders main/border-subtle` → `--scanner-border-subtle`; `Hovered states/border-subtle-hovered` → `--scanner-border-subtle-hover`;
  `Focused states/border-focus` → `--scanner-border-focus`; `Backgrounds main/background-layer-01|02` → `--scanner-bg-layer-01|02`; `spacing-01..08` → `--scanner-spacing-2..9` (4px→`-2`, 8px→`-3`, 12px→`-4`, 16px→`-5`, 20px→`-6`, 24px→`-7`, 32px→`-8`, 40px→`-9`);
  radius `small|medium|large` → `--scanner-radius-sm|md|lg`; font size "Scanner mediun" 18px → `--scanner-text-scanner-md`.
- Text styles: Figma text nodes are bound to remote styles whose values differ by library version under the same name
  (`$tp-body-01` = 14/20 or 16/24; `$tp-label-01` = 12/16 or 16/24). Implement each node's actual font size / line height with size + leading tokens;
  only use a `.scanner-text-*` class when its values match that node. Shadow "Depth 01" → `--scanner-shadow-depth-01`.

## Workflow (per component)

1. **Load guidance** (mandatory): `ReadMcpResourceTool` server `claude.ai Figma`, uri `skill://figma/figma-design-to-code/SKILL.md` before any `get_design_context`;
   `skill://figma/figma-use/SKILL.md` before any `use_figma`. Pass `skillNames` as the skill says (`resource:` prefix).
2. **Extract every variant** with one read-only `use_figma` script per component set (template below). This gives exact sizes, padding, gaps, radii,
   fills/strokes/effects with their bound variable names, and text styles for all variants in one call.
3. **`get_design_context`** on representative variants — at least one per State value, per Size, per Type/Emphasis-like property — to see structure, icons and screenshots.
   Also read the component's Documentation frame text on the page (usage, behaviour, keyboard interaction, overflow rules) via `get_metadata` on the page id.
4. **Compare** with the current code and list every deviation (dimensions, spacing, colours per state, typography, icon sizes, missing variants/states/props, a11y, keyboard).
5. **Fix the component** so every Figma variant and state is implemented:
   - Keep the public API backwards compatible (grep for usages in `src/`); add props rather than rename. Mirror Figma property names in JSDoc.
   - Hovered/Focused/Pressed: CSS `:hover` / `:focus-visible` / `:active` **and** Tailwind `data-[state=hovered|focused|pressed]:` variants so Storybook can force them. Type `'data-state'` in props.
   - Disabled: `disabled` + `aria-disabled`. Error: `error` + `aria-invalid`. Selected: `aria-selected`/`aria-checked`. Skeleton: `skeleton` prop, `animate-pulse`, `bg-[var(--scanner-bg-highlight-gray)]` unless Figma says otherwise.
   - Figma strokes that are *inside* the box don't change layout — use `shadow-[inset_0_0_0_1px_var(--token)]` like Button, not `border`, when a border would shift size.
   - Only tokens — no hex, no raw px that exist as tokens. Tailwind arbitrary values must be literal strings (no template-built class names). Font weight: `font-[number:var(--scanner-font-medium)]`; colour: `text-[color:var(...)]`; size: `text-[length:var(...)]`.
   - forwardRef, `cn()`, semantic HTML, keyboard support and ARIA per Figma docs. Private `_` components stay out of `src/index.ts`.
6. **Stories** (`*.stories.tsx`), same structure as Button:
   `Default` (controls for every prop incl. a "Forced state" `data-state` control) · one story per major variant value (Figma names) · `AllStates` matrix · `AllSizes` (if sizes) ·
   `FigmaMatrix` rendering **every** Figma variant combination · edge cases from Figma docs (overflow, long text) · interaction tests with `play` using `import { expect, fn, userEvent, within } from 'storybook/test'`.
   Matrix tables use `width: 'max-content'`. Hooks inside stories must live in a named Capitalised component (oxlint rules-of-hooks).
7. **Unit tests** `*.test.tsx` (Vitest + RTL): rendering, props→attributes, states, disabled/loading behaviour, keyboard, ref forwarding, className merge.
8. **Verify**:
   - `npx tsc -b --noEmit` — fix errors in your files (other agents may be mid-edit in other folders; ignore errors outside yours).
   - `npx vitest run src/components/<dir>` and `npx oxlint src/components/<dir>` — must be clean.
   - Visual: Storybook is already running at http://localhost:6006 (do not start/stop it). Screenshot a story with
     `"/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=2 --window-size=1200,800 --virtual-time-budget=15000 --screenshot=<scratchpad>/x.png "http://localhost:6006/iframe.html?id=components-<name>--<story>&viewMode=story"`
     then Read the PNG and compare with Figma screenshots of the same variants. Fix differences.
9. **Sign-off**: write `docs/figma/signoff/<component-dir>.md`: Figma node, variant count, Storybook coverage, what was fixed, remaining deviations / Figma inconsistencies (don't "fix" Figma mistakes — implement the majority/consistent value and note it).

## Shared files — do NOT edit

`src/tokens/semantic.css`, `primitives.css`, `typography.css`, `spacing.css`, `component.css`, `src/index.ts`, `docs/figma/signoff.md`, `CLAUDE.md`, config files, and any component folder not assigned to you.
- Component-specific values with no semantic/spacing token go in **your page's** `src/tokens/components/<page>.css` (already imported), named `--scanner-<component>-<property>`.
- If you need a new semantic token, a barrel export change, or a change in another component's folder, **don't do it** — list it under "Shared changes needed" in your final report.
- Do not commit.

## `use_figma` variant dump template (read-only)

```js
const set = await figma.getNodeByIdAsync('SET_ID');
const page = set.parent.type === 'PAGE' ? set.parent : (() => { let p = set; while (p.type !== 'PAGE') p = p.parent; return p; })();
await figma.setCurrentPageAsync(page);
const varName = async (b) => { if (!b) return undefined; const v = await figma.variables.getVariableByIdAsync(b.id); return v ? v.name.split('/').slice(-2).join('/') : b.id; };
const paint = async (node, key) => {
  if (!(key in node) || !Array.isArray(node[key])) return undefined;
  const out = [];
  for (let i = 0; i < node[key].length; i++) {
    const p = node[key][i]; if (p.visible === false) continue;
    const bound = node.boundVariables && node.boundVariables[key] && node.boundVariables[key][i];
    out.push(bound ? await varName(bound) : p.type === 'SOLID' ? '#' + [p.color.r, p.color.g, p.color.b].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('') + (p.opacity < 1 ? '@' + p.opacity.toFixed(2) : '') : p.type);
  }
  return out.length ? out : undefined;
};
const describe = async (n, depth) => {
  const d = { n: n.name, t: n.type, w: Math.round(n.width), h: Math.round(n.height) };
  if ('layoutMode' in n && n.layoutMode !== 'NONE') Object.assign(d, { lay: n.layoutMode, p: [n.paddingTop, n.paddingRight, n.paddingBottom, n.paddingLeft].join(','), gap: n.itemSpacing });
  if ('cornerRadius' in n && n.cornerRadius) d.r = n.cornerRadius === figma.mixed ? 'mixed' : n.cornerRadius;
  const f = await paint(n, 'fills'); if (f) d.fill = f;
  const s = await paint(n, 'strokes'); if (s) Object.assign(d, { stroke: s, sw: n.strokeWeight, sa: n.strokeAlign });
  if ('effects' in n && n.effects.length) d.fx = n.effects.filter(e => e.visible !== false).map(e => e.type + ':' + (e.offset ? e.offset.x + ',' + e.offset.y : '') + ':' + e.radius + ':' + (e.spread || 0));
  if (n.type === 'TEXT') { d.txt = n.characters.slice(0, 40); d.font = n.fontSize === figma.mixed ? 'mixed' : n.fontSize + '/' + (n.lineHeight.value || 'auto') + ' ' + (n.fontName.style || ''); if (n.textStyleId && n.textStyleId !== figma.mixed) { const st = await figma.getStyleByIdAsync(n.textStyleId); if (st) d.style = st.name; } }
  if (n.type === 'INSTANCE') { const mc = await n.getMainComponentAsync(); if (mc) d.inst = (mc.parent && mc.parent.type === 'COMPONENT_SET' ? mc.parent.name + ' / ' : '') + mc.name; }
  if (!n.visible) d.hidden = true;
  if ('children' in n && depth < 4 && n.type !== 'INSTANCE') { d.c = []; for (const ch of n.children) d.c.push(await describe(ch, depth + 1)); }
  return d;
};
const out = [];
for (const v of set.children) out.push(await describe(v, 0));   // filter set.children by name for very large sets
return out;
```
If the result is too large, filter `set.children` (e.g. `v.name.includes('Size=Medium')`) and run several calls.
