import type { AnchorHTMLAttributes, ReactNode } from 'react';

/** Figma "Type". `inversed` is for `background-inverse` only; `on-color` for brand colours / dark images. */
export type LinkType = 'primary' | 'secondary' | 'inversed' | 'on-color';
/** Figma "Size". */
export type LinkSize = 'small' | 'medium';
/**
 * Interactive states that can be forced via `data-state` (Storybook / visual tests).
 * Disabled is driven by the `disabled` / `aria-disabled` props.
 */
export type LinkForcedState = 'hovered' | 'focused';

export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'type'> {
  /** Visual type (Figma "Type"). */
  type?: LinkType;
  /** Size (Figma "Size") — changes icon size and icon gap. */
  size?: LinkSize;
  /** Show the external "Launch" icon and open in a new tab (Figma "External"). */
  external?: boolean;
  /** Disabled state (Figma State=Disabled). `aria-disabled` is also accepted. */
  disabled?: boolean;
  /** Link label (Figma "Text value"). */
  children: ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** Force a visual state for screenshots / Storybook. */
  'data-state'?: LinkForcedState;
}
