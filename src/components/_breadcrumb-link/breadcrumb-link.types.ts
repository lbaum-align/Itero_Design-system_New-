import type { AnchorHTMLAttributes, ReactNode } from 'react';

export interface BreadcrumbLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'type'> {
  /** URL the breadcrumb link points to */
  href?: string;
  /** Link content */
  children: ReactNode;
  /** Whether this is the current page — renders as text with aria-current="page" */
  isCurrent?: boolean;
  /** Disabled state — prevents interaction */
  disabled?: boolean;
  /** Show skeleton loading placeholder */
  skeleton?: boolean;
  /** Show chevron separator after the link (default: true) */
  showSeparator?: boolean;
  /** Additional CSS class names */
  className?: string;
}
