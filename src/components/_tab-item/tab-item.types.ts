import type { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * Interactive states that can be forced via `data-state` (Storybook / visual tests).
 * Selected and Disabled are driven by their own props.
 */
export type TabItemForcedState = 'hovered' | 'focused';

export interface TabItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Label (Figma "Text value"). */
  children: ReactNode;
  /** Figma State=Selected — 2px interactive indicator + `aria-selected`. */
  selected?: boolean;
  /** Figma State=Disabled. */
  disabled?: boolean;
  /** Content after the label, e.g. a `Badge` (Figma "Show badge"). */
  badge?: ReactNode;
  /** Loading placeholder (code-only; Figma has no skeleton for tabs). */
  skeleton?: boolean;
  /** Force a visual state for screenshots / Storybook. */
  'data-state'?: TabItemForcedState;
}
