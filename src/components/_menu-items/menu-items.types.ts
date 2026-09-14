import type { MenuTrailingElementsProps } from '../_menu-trailing-elements';

export type MenuItemSize = 'large' | 'medium' | 'small';
export type MenuItemType = 'neutral' | 'destructive';

export interface MenuItemsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Size variant — mirrors Figma Size property. */
  size?: MenuItemSize;
  /** Visual type — neutral or destructive. */
  type?: MenuItemType;
  /** Show a divider line below the item. */
  showDivider?: boolean;
  /** Show a headline label above the item row. */
  showHeadline?: boolean;
  /** Show a description line below the option label. */
  showSubtext?: boolean;
  /** The main option label text. */
  label?: string;
  /** Headline text displayed above the item row. */
  headline?: string;
  /** Description text displayed below the option label. */
  subtext?: string;
  /** Indent the item (adds left space for grouped items). */
  indented?: boolean;
  /** Show a checkmark icon (neutral type only). */
  selected?: boolean;
  /** Show trailing element (shortcut / toggle / submenu). */
  showTrailingElement?: boolean;
  /** Props forwarded to _MenuTrailingElements. */
  trailingElementProps?: MenuTrailingElementsProps;
  /** Whether the item is disabled. */
  disabled?: boolean;
  /** Additional class names. */
  className?: string;
}
