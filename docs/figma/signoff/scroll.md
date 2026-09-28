# Scroll — sign-off

**Figma**: `Scroll` component set `34025:182957` (page "Logos" `15305:8083`), file `TCdFM9Hy78GHyifCSlkedx`. **Status**: ✅ Built 2026-09-15.

**Variants**: 2 — Position: Horizontal (default, 108×4), Vertical (4×84).

**Figma values**: track = 4px `border-subtle` (4px inside stroke), min length 84px; thumb "Scroll" = 52px, `border-subtle` stroke painted over the track (reads ≈19% black), radius full. Select menu (`30409:27826`) places its bar 4px from the right edge, 12px from the top.

**Implementation** (`src/components/scroll/`):
- `Scroll` — the visual bar (track + thumb). Props `position`, `thumbSize` (0–1, default Figma 52/84 or 52/108), `value` (0–1 progress), `controls` (id → `role="scrollbar"`, `aria-controls`, `aria-orientation`, `aria-valuenow`; otherwise `aria-hidden`). Fills its parent along the axis, min 84px. For custom scrollers (virtualised lists, canvases).
- `ScrollArea` — overflow container (`orientation` vertical / horizontal / both) with the native bar styled as Figma Scroll; focusable (`tabIndex=0`) with a focus ring so keyboard users can scroll.
- `scrollbarClassName` (`scroll-classes.ts`) — the same styling as a class string for any existing overflow container: 12px `::-webkit-scrollbar` with a 4px transparent border + `background-clip: padding-box` → 4px bar inset 4px; track and thumb `border-subtle`; thumb min length 52px; no buttons. Firefox (no `::-webkit-scrollbar`) gets `scrollbar-width: thin` + `scrollbar-color: border-subtle-active border-subtle`, gated with `@supports not selector(::-webkit-scrollbar)` because Chromium ≥121 ignores the pseudo-elements once the standard properties are set.
- Tokens (`logos.css`): `--scanner-scroll-thickness` 4px, `--scanner-scroll-min-length` 84px, `--scanner-scroll-thumb-length` 52px, `--scanner-scroll-inset` 4px.

**Storybook** (`Components/Scroll`): `Default` (controls), `Horizontal`, `Vertical`, `AllStates` (thumb start / middle / end × position), `FigmaMatrix` (2 variants), `ScrollArea: vertical (menu)`, `ScrollArea: both axes`, `LinkedToContainer` (Scroll driven by a custom container), play test `ScrollAreaKeyboard`.

**Tests**: `scroll.test.tsx`, 8 passing.

**Visual check**: `FigmaMatrix` and `ScrollArea` screenshots (Edge headless, without `--hide-scrollbars`) — 4px rounded bar, lighter track, darker thumb, 4px inset, matching Figma.

## Deviations / Figma notes
- Horizontal track has no corner radius in Figma while its thumb (4px) and the whole Vertical variant use radius full — implemented radius full for both (consistent).
- Firefox can't stack semi-transparent thumb over track; its thumb uses `border-subtle-active` (20%) ≈ two 10% layers, and `thin` is ~8px, not 4px.
- Native bar length is content-driven (not the fixed 52px thumb); 52px is used as the minimum.
- In classic (non-overlay) scrollbar environments the styled bar takes 12px of layout width.
- `Menu` and `SelectMenu` still use `[scrollbar-width:thin] [scrollbar-color:border-subtle transparent]` (which also disables `::-webkit-scrollbar` styling in Chromium); they should adopt `scrollbarClassName` — see shared changes.
