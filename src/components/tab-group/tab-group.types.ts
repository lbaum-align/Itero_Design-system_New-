import type { HTMLAttributes, ReactNode } from 'react';

export interface TabGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'children'> {
  /** `TabItem` children. */
  children: ReactNode;
  /** Selected tab index (controlled). */
  activeIndex?: number;
  /** Initial selected tab index when uncontrolled. Default 0. */
  defaultActiveIndex?: number;
  /** Called with the index of the newly selected tab (click, or arrow/Home/End keys). */
  onChange?: (index: number) => void;
  /**
   * `automatic` (default): arrow keys move focus *and* select.
   * `manual`: arrow keys move focus; Enter/Space selects.
   */
  activationMode?: 'automatic' | 'manual';
}
