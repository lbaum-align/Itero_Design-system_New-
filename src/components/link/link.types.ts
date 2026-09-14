import type { AnchorHTMLAttributes, ReactNode } from 'react';

export type LinkType = 'primary' | 'secondary' | 'inversed' | 'on-color';
export type LinkSize = 'small' | 'medium';

export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'type'> {
  /** Visual type */
  type?: LinkType;
  /** Size variant */
  size?: LinkSize;
  /** Show external link icon */
  external?: boolean;
  /** Link content */
  children: ReactNode;
  /** Additional CSS class names */
  className?: string;
}
