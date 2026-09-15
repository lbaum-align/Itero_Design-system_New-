import type { HTMLAttributes } from 'react';

/** Modifier keys Figma draws as glyphs (layers "Command", "Option", "Shift", "Erase"). */
export type KeyboardShortcutGlyph = 'command' | 'option' | 'shift' | 'erase';

export interface KeyboardShortcutProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /**
   * Keys to display, in order (e.g. `['⌘', 'K']`, `['Shift', 'P']`).
   * Modifier keys are drawn as Figma glyphs — `⌘`/`Cmd`/`Command`/`Meta`, `⌥`/`Opt`/`Option`/`Alt`,
   * `⇧`/`Shift`, `⌫`/`Backspace`/`Delete`/`Erase`. Everything else renders as text (Figma layers "X", "Y", "Z").
   */
  keys: string[];
  /** Disabled colours (used inside a disabled menu item). Not a Figma variant. */
  disabled?: boolean;
  /** Additional CSS class names */
  className?: string;
}
