/*
 * Figma "Scroll" (node 34025:182957) as native scroll bar styling, for any overflow container
 * (Menu, Select menu, Data table, Text area…).
 *
 * - 4px bar: track `border-subtle`, thumb `border-subtle` painted over it (Figma stacks two border-subtle strokes,
 *   so the thumb reads darker), fully rounded.
 * - 4px inset from the container edge (Select menu places its bar 4px from the right edge): the pseudo-element is
 *   12px wide with a 4px transparent border and `background-clip: padding-box`.
 * - Chromium ≥121 ignores `::-webkit-scrollbar` once `scrollbar-width`/`scrollbar-color` are set, so the standard
 *   properties are only applied where `::-webkit-scrollbar` isn't supported (Firefox): thin bar; thumb `border-subtle-active` (20%) ≈ two stacked 10% `border-subtle` layers.
 */
export const scrollbarClassName = [
  '[&::-webkit-scrollbar]:size-[calc(var(--scanner-scroll-thickness)_+_var(--scanner-scroll-inset)*2)]',
  '[&::-webkit-scrollbar]:bg-transparent',
  '[&::-webkit-scrollbar-track]:rounded-[var(--scanner-radius-full)]',
  '[&::-webkit-scrollbar-track]:border-[length:var(--scanner-scroll-inset)]',
  '[&::-webkit-scrollbar-track]:border-solid',
  '[&::-webkit-scrollbar-track]:border-transparent',
  '[&::-webkit-scrollbar-track]:bg-clip-padding',
  '[&::-webkit-scrollbar-track]:bg-[var(--scanner-border-subtle)]',
  '[&::-webkit-scrollbar-thumb]:rounded-[var(--scanner-radius-full)]',
  '[&::-webkit-scrollbar-thumb]:border-[length:var(--scanner-scroll-inset)]',
  '[&::-webkit-scrollbar-thumb]:border-solid',
  '[&::-webkit-scrollbar-thumb]:border-transparent',
  '[&::-webkit-scrollbar-thumb]:bg-clip-padding',
  '[&::-webkit-scrollbar-thumb]:bg-[var(--scanner-border-subtle)]',
  '[&::-webkit-scrollbar-thumb]:min-h-[var(--scanner-scroll-thumb-length)]',
  '[&::-webkit-scrollbar-thumb]:min-w-[var(--scanner-scroll-thumb-length)]',
  '[&::-webkit-scrollbar-button]:hidden',
  '[&::-webkit-scrollbar-corner]:bg-transparent',
  'supports-[not_selector(::-webkit-scrollbar)]:[scrollbar-width:thin]',
  'supports-[not_selector(::-webkit-scrollbar)]:[scrollbar-color:var(--scanner-border-subtle-active)_var(--scanner-border-subtle)]',
].join(' ');
