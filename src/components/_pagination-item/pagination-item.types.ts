import type { ButtonHTMLAttributes, MouseEvent } from 'react';

/** Figma "Size" (X-Large / Large / Medium / Small). */
export type PaginationItemSize = 'small' | 'medium' | 'large' | 'x-large';

/**
 * Figma "State" values that can be forced via `data-state` (Storybook / visual tests).
 * Enabled is the default; Selected has its own prop.
 */
export type PaginationItemForcedState = 'hovered' | 'focused';

export interface PaginationItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onClick' | 'children'> {
  /** Page number to display. */
  page: number;
  /** Figma State=Selected — the current page (`aria-current="page"`). */
  selected?: boolean;
  /** Disables the item (not a Figma state; kept for disabled pagination). */
  disabled?: boolean;
  /** Click handler. */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Figma "Size". Default `'medium'`. */
  size?: PaginationItemSize;
  /** Force a visual state for screenshots / Storybook. */
  'data-state'?: PaginationItemForcedState;
  /** Additional CSS class names. */
  className?: string;
}
