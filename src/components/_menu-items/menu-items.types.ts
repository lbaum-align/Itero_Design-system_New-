import type { HTMLAttributes, ReactNode } from 'react';
import type { MenuTrailingElementsProps } from '../_menu-trailing-elements';

/** Figma "Size". */
export type MenuItemSize = 'large' | 'medium' | 'small';
/** Figma "Type". */
export type MenuItemType = 'neutral' | 'destructive';
/** Interactive states that can be forced via `data-state` (Storybook / visual tests). Disabled has its own prop. */
export type MenuItemForcedState = 'hovered' | 'focused';

export interface MenuItemsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Figma "Size". Defaults to the parent `Menu` size, else `large`. */
  size?: MenuItemSize;
  /** Figma "Type" — neutral or destructive. */
  type?: MenuItemType;
  /** Figma "Show divider" — divider below the item. */
  showDivider?: boolean;
  /** Figma "Show headline" — group headline above the item. */
  showHeadline?: boolean;
  /** Figma "Show subtext" — second line below the option text. */
  showSubtext?: boolean;
  /** Figma "Option text value". */
  label?: ReactNode;
  /** Figma "Headline text value". */
  headline?: ReactNode;
  /** Figma "Subhead text value". */
  subtext?: ReactNode;
  /** Figma "Indented" — 20px leading space so the text lines up with selected (checkmarked) items. */
  indented?: boolean;
  /**
   * Figma "Selected" — leading checkmark (Neutral only). Passing a boolean makes the item a
   * `menuitemcheckbox` with `aria-checked`; leave `undefined` for a plain action item.
   */
  selected?: boolean;
  /** Figma "Show trailing element". */
  showTrailingElement?: boolean;
  /** Props for the trailing `_MenuTrailingElements` (Type Keyboard shortcut / Toggle / Submenu). */
  trailingElementProps?: MenuTrailingElementsProps;
  /** Figma State=Disabled. */
  disabled?: boolean;
  /** Force a visual state for screenshots / Storybook. */
  'data-state'?: MenuItemForcedState;
  /** Class names for the outer wrapper (headline + item + divider). */
  className?: string;
}
