import type { ReactNode } from 'react';

export interface TabGroupProps {
  /** TabItem children to render as tabs */
  children: ReactNode;
  /** Index of the currently active/selected tab (0-based) */
  activeIndex?: number;
  /** Called when a tab is clicked with the tab's index */
  onChange?: (index: number) => void;
  /** Additional CSS class names */
  className?: string;
}
