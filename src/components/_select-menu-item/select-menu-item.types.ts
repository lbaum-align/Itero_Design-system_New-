import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Figma "Size". Figma spells X-Large as "X- Large" — normalised to `x-large`.
 */
export type SelectMenuItemSize = 'small' | 'medium' | 'large' | 'x-large';

/** Interactive states that can be forced via `data-state` (Storybook / visual tests). Disabled has its own prop. */
export type SelectMenuItemForcedState = 'hovered' | 'focused';

export interface SelectMenuItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Figma "Option text". */
  optionText?: ReactNode;
  /** Figma "Headline text" — shown when `showHeadline`. */
  headlineText?: ReactNode;
  /** Figma "Subhead text" — shown when `showSubtext`. */
  subheadText?: ReactNode;
  /** Figma "Show headline" — group headline above the option. */
  showHeadline?: boolean;
  /** Figma "Show subtext". */
  showSubtext?: boolean;
  /** Figma "Show divider" — divider below the option. */
  showDivider?: boolean;
  /**
   * Option value. Inside a `SelectMenu` it drives selection (`value`/`onChange`) and keyboard navigation.
   */
  value?: string;
  /** Figma "Selected". Overrides the selection derived from the parent `SelectMenu` value. */
  selected?: boolean;
  /** Figma State=Disabled. */
  disabled?: boolean;
  /** Figma "Size". Defaults to the parent `SelectMenu` size, else `x-large`. */
  size?: SelectMenuItemSize;
  /** Force a visual state for screenshots / Storybook. */
  'data-state'?: SelectMenuItemForcedState;
  /** Class names for the outer wrapper (headline + option + divider). */
  className?: string;
}
