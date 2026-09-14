import type { ReactNode, ButtonHTMLAttributes } from 'react';

export interface TabItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Label text content */
  children: ReactNode;
  /** Whether this tab is currently selected */
  selected?: boolean;
  /** Disabled state — suppresses interaction and dims appearance */
  disabled?: boolean;
  /** Skeleton loading state — renders a fixed-dimension placeholder with no content */
  skeleton?: boolean;
  /** Additional CSS class names */
  className?: string;
}
