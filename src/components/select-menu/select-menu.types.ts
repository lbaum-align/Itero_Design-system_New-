import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import type { SelectMenuItemSize } from '../_select-menu-item/select-menu-item.types';

/**
 * Figma "Size". Figma spells X-Large as "X- Large" — normalised to `x-large`.
 */
export type SelectMenuSize = SelectMenuItemSize;

/**
 * - `roving` (default): options receive DOM focus; the listbox handles arrow keys.
 * - `activedescendant`: the listbox (or an external input, e.g. Combobox) keeps focus and the active option
 *   is exposed with `aria-activedescendant` and highlighted with the focus stroke.
 */
export type SelectMenuFocusMode = 'roving' | 'activedescendant';

export interface SelectMenuProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange' | 'defaultValue' | 'autoFocus'> {
  /** Figma "Size" — propagated to child `SelectMenuItem`s. */
  size?: SelectMenuSize;
  /** Figma "Scroll" — the list scrolls vertically (thin `border-subtle` scrollbar) once it exceeds `maxHeight`. */
  scroll?: boolean;
  /** Maximum height of the panel (number = px). Use with `scroll`. */
  maxHeight?: CSSProperties['maxHeight'];
  /** Selected option value (controlled). */
  value?: string | null;
  /** Initially selected value (uncontrolled). */
  defaultValue?: string | null;
  /** Called with the option value when the user selects an option (click, Enter or Space). */
  onChange?: (value: string) => void;
  /**
   * Highlighted option value (controlled) — for Combobox / SearchInput driving the list from an input.
   * In `activedescendant` mode, options must keep their generated id (don’t pass `id`) so `aria-activedescendant` resolves.
   */
  activeValue?: string | null;
  /** Called when the highlighted option changes (arrow keys, focus). */
  onActiveChange?: (value: string | null) => void;
  /** How the active option is exposed. Default `roving`. */
  focusMode?: SelectMenuFocusMode;
  /** Move focus into the list on mount (selected option, else first). */
  autoFocus?: boolean;
  /** `SelectMenuItem` children. */
  children?: ReactNode;
  /** Called when Escape is pressed inside the menu. */
  onClose?: () => void;
  /** Additional CSS class names. */
  className?: string;
}
