import { createContext } from 'react';
import type { SelectMenuFocusMode, SelectMenuSize } from './select-menu.types';

export interface SelectMenuContextValue {
  /** Size propagated from SelectMenu container to child items. */
  size?: SelectMenuSize;
  /** `true` inside a `SelectMenu`. */
  inSelectMenu?: boolean;
  /** Prefix for option ids (`selectMenuOptionId`). */
  idPrefix?: string;
  /** Currently selected value. */
  value?: string | null;
  /** Currently highlighted (keyboard-active) value. */
  activeValue?: string | null;
  /** How the active option is exposed — DOM focus or `aria-activedescendant`. */
  focusMode?: SelectMenuFocusMode;
  /** Select an option value. */
  onSelect?: (value: string) => void;
  /** Mark an option value as active (highlighted). */
  onActivate?: (value: string | null) => void;
}

export const SelectMenuContext = createContext<SelectMenuContextValue>({});

/**
 * DOM id of the option with `value` inside the SelectMenu with `idPrefix` — used for `aria-activedescendant`.
 * Options keep this id unless an explicit `id` prop is passed.
 */
export function selectMenuOptionId(idPrefix: string, value: string): string {
  return `${idPrefix}-option-${encodeURIComponent(value)}`;
}
