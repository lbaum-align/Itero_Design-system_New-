import type { HTMLAttributes } from 'react';

/**
 * Figma "Size": Mini (20) · Small (24) · Medium (32) · Large (48) · X Large (80) · 2X Large (96).
 */
export type SpinnerSize = 'mini' | 'small' | 'medium' | 'large' | 'xl' | '2xl';

/** Figma "Phase" — one quarter turn of the rotation animation (1 = 0°, 2 = 90°, 3 = 180°, 4 = 270°). */
export type SpinnerPhase = 1 | 2 | 3 | 4;

export interface SpinnerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Visual size (Figma "Size"). */
  size?: SpinnerSize;
  /** White shape for brand/dark backgrounds (Figma "On color"). */
  onColor?: boolean;
  /**
   * Freeze the spinner at one animation frame (Figma "Phase") — for screenshots / visual tests.
   * Omit for the normal, continuously rotating spinner.
   */
  phase?: SpinnerPhase;
  /** Accessible label announced by screen readers. */
  'aria-label'?: string;
}
