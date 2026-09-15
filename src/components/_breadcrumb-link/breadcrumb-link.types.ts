import type { AnchorHTMLAttributes, ReactNode } from 'react';

/**
 * Interactive states that can be forced via `data-state` (Storybook / visual tests).
 * Disabled and Skeleton are driven by their own props.
 */
export type BreadcrumbLinkForcedState = 'hovered' | 'focused';

export interface BreadcrumbLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** URL the breadcrumb link points to. */
  href?: string;
  /** Page name (Figma "Page name"). */
  children?: ReactNode;
  /** Render as the current page — plain text with `aria-current="page"`, not a link. */
  isCurrent?: boolean;
  /** Figma State=Disabled — not focusable, not clickable. */
  disabled?: boolean;
  /** Figma State=Skeleton — loading placeholder. */
  skeleton?: boolean;
  /** Show the "|" divider after the label (Figma "Show divider"). Default `true`. */
  showDivider?: boolean;
  /** @deprecated Alias of `showDivider`. */
  showSeparator?: boolean;
  /** Force a visual state for screenshots / Storybook. */
  'data-state'?: BreadcrumbLinkForcedState;
}
