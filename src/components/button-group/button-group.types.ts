import type { HTMLAttributes, ReactNode } from 'react';

/** Figma "Position" */
export type ButtonGroupPosition = 'horizontal' | 'vertical';
/** @deprecated Use `ButtonGroupPosition`. */
export type ButtonGroupOrientation = ButtonGroupPosition;
/** Figma "Size" */
export type ButtonGroupSize = 'large' | 'medium' | 'small';

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** `Button` / `SplitButton` elements to render in the group. */
  children: ReactNode;
  /** Layout direction (Figma "Position"). Default `horizontal`. */
  position?: ButtonGroupPosition;
  /** @deprecated Alias of `position`, kept for backwards compatibility. */
  orientation?: ButtonGroupOrientation;
  /**
   * Size preset (Figma "Size"). Controls the gap and is passed down to child
   * `Button` / `SplitButton` elements that don't set their own `size`.
   */
  size?: ButtonGroupSize;
}
