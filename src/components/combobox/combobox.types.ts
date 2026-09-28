import type { InputHTMLAttributes, ReactNode } from 'react';
import type {
  DropdownForcedState,
  DropdownOption,
  DropdownSize,
  SelectFieldBaseProps,
  SelectFieldMultiProps,
  SelectFieldSingleProps,
} from '../dropdown/dropdown.types';

/** Figma "Size" (X- Large / Large / Medium / Small). */
export type ComboboxSize = DropdownSize;

/** Figma "Type": Single → one value, Multi → several values shown as tags. */
export type ComboboxType = 'single' | 'multi';

/** Figma "State" values that can be forced via `data-state`. */
export type ComboboxForcedState = DropdownForcedState;

/** One option of the menu. */
export type ComboboxOption = DropdownOption;

type InputAttributes = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  | 'type'
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'size'
  | 'children'
  | 'className'
  | 'style'
  | 'name'
  | 'disabled'
  | 'placeholder'
  | 'required'
>;

export interface ComboboxOwnProps {
  /**
   * Filters the options for the typed text. Default: case-insensitive "label contains text".
   * Pass `false` to show `options` unfiltered (e.g. when filtering on the server via `onInputChange`).
   */
  filter?: ((option: ComboboxOption, inputValue: string) => boolean) | false;
  /** Called whenever the user edits the text. */
  onInputChange?: (inputValue: string) => void;
  /** Shown as a disabled option when no option matches. Default `'No results found'`. */
  noResultsText?: ReactNode;
}

export type ComboboxProps = InputAttributes &
  SelectFieldBaseProps &
  ComboboxOwnProps &
  (SelectFieldSingleProps | SelectFieldMultiProps);
