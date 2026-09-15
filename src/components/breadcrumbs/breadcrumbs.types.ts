import type { HTMLAttributes, MouseEventHandler } from 'react';

export interface BreadcrumbItem {
  /** Page name. */
  label: string;
  /** URL of the page. An item without `href` in the last position is treated as the current page. */
  href?: string;
  /** Click handler (e.g. client-side routing). */
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  /** Disabled link (Figma _Breadcrumb link State=Disabled). */
  disabled?: boolean;
}

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  /** Ordered trail, from the top level down. */
  items: BreadcrumbItem[];
  /**
   * Figma "Show current page": render the last item as plain text with `aria-current="page"`.
   * When omitted, it's inferred: `true` if the last item has no `href`.
   */
  showCurrentPage?: boolean;
  /**
   * Figma "Show overflow": collapse the middle of long trails into a "…" trigger
   * that expands the full trail. Applies when there are more than `maxVisibleItems` items.
   */
  showOverflow?: boolean;
  /** Items kept visible when `showOverflow` collapses the trail (first item + last N-1). Default 4. */
  maxVisibleItems?: number;
  /** Skeleton placeholders for every item (Figma _Breadcrumb link State=Skeleton). */
  skeleton?: boolean;
}
