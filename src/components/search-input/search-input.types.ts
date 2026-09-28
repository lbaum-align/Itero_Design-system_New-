import type { CSSProperties, InputHTMLAttributes, ReactNode } from 'react';
import type { SelectMenuSize } from '../select-menu';

/** Figma "Size". */
export type SearchInputSize = 'large' | 'medium' | 'small';

/**
 * Figma "State" values that can be forced via `data-state` (Storybook / visual tests).
 * Enabled is the default, Filled is derived from the value, Skeleton has its own prop.
 */
export type SearchInputForcedState = 'focused';

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Figma "Size". Default `'large'`. */
  size?: SearchInputSize;
  /** Figma "Layer set": 1 → Set 01 (`background-layer-01`), 2 → Set 02 (`background-layer-02`). */
  layer?: 1 | 2;
  /** Figma State=Skeleton — loading placeholder. */
  skeleton?: boolean;
  /** Called with the current query when Enter is pressed (and no suggestion is highlighted). */
  onSearch?: (query: string) => void;
  /** Called after the clear button (or Escape) empties the field. `onChange` also fires with an empty value. */
  onClear?: () => void;
  /** Accessible name of the clear (×) button. Default `'Clear search'`. */
  clearLabel?: string;
  /**
   * Suggestions — `SelectMenuItem` children rendered in a `SelectMenu` below the field (Figma "Show menu").
   * When given, the input becomes a `combobox` that drives the list with `aria-activedescendant`.
   */
  suggestions?: ReactNode;
  /**
   * Figma "Show menu" — controlled menu visibility. Omit to let the component open the menu while the field is
   * focused and has a value (or on ArrowDown), and close it on Escape, blur or selection.
   */
  showMenu?: boolean;
  /** Called when the component wants to open or close the menu. */
  onShowMenuChange?: (open: boolean) => void;
  /**
   * Called with the option value when a suggestion is chosen (click or Enter).
   * When uncontrolled, the field value is replaced by the option value (firing `onChange`).
   */
  onSuggestionSelect?: (value: string) => void;
  /** Size of the suggestions menu. Figma uses Select menu X-Large at every field size. Default `'x-large'`. */
  menuSize?: SelectMenuSize;
  /** Max height of the suggestions menu (scrolls beyond it). */
  menuMaxHeight?: CSSProperties['maxHeight'];
  /** Force a visual state on the field for screenshots / Storybook. */
  'data-state'?: SearchInputForcedState;
  /** Class names for the root wrapper. */
  className?: string;
}
