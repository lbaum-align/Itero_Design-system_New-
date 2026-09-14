import type { HTMLAttributes } from 'react';

/**
 * Size variants for _SelectMenuItem.
 * Maps to Figma "Size" variant property.
 *
 * Figma spells X-Large as "X- Large" — we normalise to `x-large`.
 */
export type SelectMenuItemSize = 'small' | 'medium' | 'large' | 'x-large';

export interface SelectMenuItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Primary option label text. */
  optionText?: string;

  /** Optional headline displayed above the option text. Visible when `showHeadline` is true. */
  headlineText?: string;

  /** Optional secondary text below the option text. Visible when `showSubtext` is true. */
  subheadText?: string;

  /** Show the headline section above the item. */
  showHeadline?: boolean;

  /** Show the secondary subtext below the option text. */
  showSubtext?: boolean;

  /** Show a divider line below the item. */
  showDivider?: boolean;

  /** Whether this item is the currently selected option. */
  selected?: boolean;

  /** Whether this item is disabled. */
  disabled?: boolean;

  /** Size variant. */
  size?: SelectMenuItemSize;

  /** Additional CSS class names. */
  className?: string;
}
