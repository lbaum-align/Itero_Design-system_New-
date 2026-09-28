import type { HTMLAttributes, ReactNode } from 'react';

/** Figma "Position" */
export type ScrollPosition = 'vertical' | 'horizontal';

export interface ScrollProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Figma "Position". @default 'horizontal' (Figma default) */
  position?: ScrollPosition;
  /**
   * Thumb length as a fraction (0–1) of the track — usually `clientSize / scrollSize`.
   * Defaults to the Figma proportion (52px thumb on the 84px vertical / 108px horizontal track).
   */
  thumbSize?: number;
  /** Scroll progress 0–1 (0 = thumb at the start of the track). @default 0 */
  value?: number;
  /**
   * Id of the element this scroll bar controls. When set the bar is exposed as `role="scrollbar"`
   * with `aria-controls` / `aria-valuenow`; otherwise it is decorative (`aria-hidden`).
   */
  controls?: string;
  /** Additional CSS class names */
  className?: string;
}

export type ScrollAreaOrientation = 'vertical' | 'horizontal' | 'both';

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  /** Axis (or axes) that scroll. @default 'vertical' */
  orientation?: ScrollAreaOrientation;
  /** Additional CSS class names */
  className?: string;
}
