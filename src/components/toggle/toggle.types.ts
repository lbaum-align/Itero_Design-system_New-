import type { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * Interactive states that can be forced via `data-state` (Storybook / visual tests).
 * Disabled and Skeleton are driven by their own props.
 */
export type ToggleForcedState = 'hovered' | 'focused' | 'pressed';

export interface ToggleProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'type' | 'value' | 'children'> {
  /** On/off value (Figma "Selected"). */
  selected?: boolean;
  /** Called with the next value when the user toggles. */
  onChange?: (selected: boolean) => void;
  /** Disabled state (Figma State=Disabled). */
  disabled?: boolean;
  /** Skeleton placeholder (Figma State=Skeleton). */
  skeleton?: boolean;
  /** Value text next to the switch (Figma "Text value"). Also becomes the accessible name. */
  children?: ReactNode;
  /** Show the value text (Figma "Show value"). Default `true`; only renders when `children` is set. */
  showValue?: boolean;
  /** Accessible label — required when no visible value text is shown. */
  'aria-label'?: string;
  /** Additional CSS class names (applied to the outer element). */
  className?: string;
  /** Force a visual state for screenshots / Storybook. */
  'data-state'?: ToggleForcedState;
}
