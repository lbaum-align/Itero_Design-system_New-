import type { HTMLAttributes } from 'react';
import type { IconName } from '../../icons';

/** Figma "Type": `shortcut` = Keyboard shortcut, `toggle` = Toggle, `submenu` = Submenu. */
export type MenuTrailingType = 'shortcut' | 'toggle' | 'submenu';

export interface MenuTrailingElementsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Figma "Type". When omitted it is inferred from the other props
   * (priority: `shortcutKeys` → `toggle` → `icon`).
   */
  type?: MenuTrailingType;
  /** Keys for the Keyboard shortcut type (e.g. `['⌘', 'K']`). */
  shortcutKeys?: string[];
  /** Render the Toggle type. */
  toggle?: boolean;
  /** Toggle value. */
  toggleSelected?: boolean;
  /** Called with the next toggle value. */
  onToggleChange?: (selected: boolean) => void;
  /** Accessible name of the toggle when it is interactive. Default "Toggle". */
  toggleAriaLabel?: string;
  /**
   * `false` renders the toggle as a visual only (not focusable, hidden from AT, clicks pass through) —
   * used when the whole menu item is the `menuitemcheckbox`. Default `true`.
   */
  toggleInteractive?: boolean;
  /** Submenu icon. Figma uses a 24px chevron-right; also infers the Submenu type. */
  icon?: IconName;
  /** Label text next to the submenu chevron (Figma "Label"). */
  label?: string;
  /** Figma "Show label" (Submenu type). */
  showLabel?: boolean;
  /** Disabled colours (inside a disabled menu item). */
  disabled?: boolean;
  /** Additional CSS class names. */
  className?: string;
}
