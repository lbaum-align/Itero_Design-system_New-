import type { HTMLAttributes, ReactNode } from 'react';

/** Figma "States". */
export type SliderControlState = 'enabled' | 'focused' | 'pressed' | 'disabled';

/** States that can be forced via `data-state` (Storybook / visual tests). Disabled has its own prop. */
export type SliderControlForcedState = 'focused' | 'pressed';

export interface SliderControlProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Figma State=Pressed — the handle is being dragged: filled dot + value tooltip. */
  pressed?: boolean;
  /** Figma State=Disabled. */
  disabled?: boolean;
  /** Figma "Value" — show the value tooltip while pressed. Default `true`. */
  showValue?: boolean;
  /** Tooltip content (Figma "Text value", e.g. `"50"`). */
  valueText?: ReactNode;
  /** Force a visual state for screenshots / Storybook. */
  'data-state'?: SliderControlForcedState;
  /** Additional CSS class names. */
  className?: string;
}
