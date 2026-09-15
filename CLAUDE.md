# Scanner Design System — Project Conventions

## Overview

React component library built from Figma "06. Scanner core 1.0.0".
76 components across 33 pages, extracted via Figma MCP.

## Tech Stack

- **Framework**: React 19 + TypeScript (strict mode)
- **Build**: Vite 8 (dev + library build)
- **Styling**: Tailwind CSS v4 + CSS custom properties
- **Stories**: Storybook 10
- **Testing**: Vitest + React Testing Library
- **Linting**: oxlint + Prettier

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | TypeScript check + Vite build |
| `npm run build:lib` | Library build (ESM + CJS + types) |
| `npm run storybook` | Start Storybook on port 6006 |
| `npm run storybook:build` | Build static Storybook |
| `npm run test` | Run Vitest |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run typecheck` | TypeScript type checking only |
| `npm run lint` | Run oxlint |

## Figma File Architecture

| File | Key | Role |
|------|-----|------|
| 01. Global colors 2.0.0 | TBD | Primitive color hex values |
| 02. Color modes 2.0.0 | TBD | Semantic colors (light/dark) |
| 03. Grid, spacing, layouts 2.0.0 | TBD | Spacing scale |
| 04. Typography system (Scanner) | TBD | Font sizes, weights, line heights |
| 05. Icons library 2.0.0 | TBD | Icon SVGs |
| 06. Scanner core 1.0.0 full | `TCdFM9Hy78GHyifCSlkedx` | Components + source of truth for token values (this file) |

The old key `92jGgELoruQBVB96FtLRDe` is not accessible to the current Figma account. The file's page list only
exposes "Cover", so component pages must be opened by node-id (e.g. Button page `15305:6719`).
When a token value in code differs from this file's variables, correct the token to match this file.

## Figma Rules

1. **Before writing any UI code**, fetch design context from the Figma MCP for the exact node.
2. Treat the MCP's generated React/Tailwind as a **description of the design**, never as final code.
3. **Never hardcode** a value that exists as a token. If a value is missing from tokens, stop and report it.
4. **Reuse existing components** before creating new ones.
5. Every component must implement **every variant and state** defined in Figma — no partial implementations.
6. Every component ships with a **Storybook story** covering every variant/state.
7. After building, **compare against a Figma screenshot** and list deviations before declaring done.
8. Always load `/figma-design-to-code` skill before calling `get_design_context`.

## Token Architecture

Three-tier system using CSS custom properties:

### Tier 1 — Primitives (`src/tokens/primitives.css`)
Raw values from Figma: hex colors, pixel values, font stacks.
Naming: `--scanner-{color}-{shade}` (e.g., `--scanner-blue-600`)

### Tier 2 — Semantic (`src/tokens/semantic.css`)
Purpose-based, mode-aware aliases.
Naming: `--scanner-{category}-{purpose}` (e.g., `--scanner-text-primary`)
Modes: `:root` / `[data-theme="light"]` and `[data-theme="dark"]`

### Tier 3 — Component (`src/tokens/component.css`)
Component-specific overrides (only where Figma defines them).
Naming: `--scanner-{component}-{property}` (e.g., `--scanner-button-height-md`)

## Component Conventions

### File Structure
```
src/components/{kebab-case}/
  {PascalCase}.tsx          # Component implementation
  {kebab-case}.types.ts     # TypeScript types/interfaces
  {kebab-case}.stories.tsx   # Storybook stories
  {kebab-case}.test.tsx      # Unit tests
  index.ts                   # Barrel export
```

### Naming
- **Directories**: kebab-case (`button/`, `text-input/`)
- **Component files**: PascalCase (`Button.tsx`, `TextInput.tsx`)
- **Private sub-components** (Figma `_` prefix): NOT exported from package barrel
- **Figma typo**: "Dropdowm" → normalize to "Dropdown" in React

### Props API
- Mirror Figma variant properties exactly as React props
- Use literal union types for variants: `variant: 'primary' | 'secondary' | 'ghost'`
- Size props: `size: 'small' | 'medium' | 'large' | 'x-large'`
- Boolean properties: direct boolean props
- Instance swap (icons): `icon?: IconName | ReactNode`

### State Handling
| Figma State | React Implementation |
|------------|---------------------|
| Enabled | Default (no attribute) |
| Hovered | CSS `:hover` + `data-state="hovered"` |
| Focused | CSS `:focus-visible` + `data-state="focused"` |
| Active/Pressed | CSS `:active` + `data-state="pressed"` |
| Disabled | `disabled` HTML attribute + `aria-disabled` |
| Skeleton | `skeleton` boolean prop → loading placeholder |
| Error | `error` boolean prop + `aria-invalid` |
| Selected | `selected` boolean prop + `aria-selected`/`aria-checked` |

`data-state` attributes allow Storybook to force visual states for screenshot comparison.

### Layer Set
Figma "Layer set" (Set 01/Set 02) → `layer?: 1 | 2` prop → `data-layer="1"` attribute.
Maps to different background token: `--scanner-background-layer-01` / `--scanner-background-layer-02`.

### Component Patterns
- Always use `forwardRef`
- Always accept and merge `className` via `cn()` utility
- TypeScript strict mode — no `any`
- Semantic HTML elements
- All interactive components: keyboard navigation + ARIA attributes
- Only token values in CSS — zero hardcoded colors/spacing/type

## Storybook Story Conventions

Every component gets these stories:
1. **Default** — with Controls for every prop
2. **Per-variant** — one story per major variant value (matching Figma names)
3. **AllStates** — matrix: rows = variants, columns = states (using `data-state`)
4. **AllSizes** — all sizes side by side
5. **Interaction tests** — keyboard nav, click, disabled behavior

## Documentation Outputs

| File | Content |
|------|---------|
| `docs/figma/inventory.md` | Figma page/frame tree |
| `docs/figma/variables.raw.json` | Raw variable dump from Figma |
| `docs/figma/colors.md` | Color token tables (primitive + semantic) |
| `docs/figma/typography.md` | Typography scale documentation |
| `docs/figma/foundations.md` | Spacing, radius, shadows, effects |
| `docs/figma/components.md` | Full component variant matrix |
| `docs/figma/build-order.md` | Dependency-ordered build sequence |
| `docs/figma/signoff.md` | Per-component verification results |
