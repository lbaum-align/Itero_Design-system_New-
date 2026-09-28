import type { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * Figma "State" values that can be forced via `data-state` (Storybook / visual tests).
 * Enabled is the default; Selected, In range and Disabled have their own props.
 */
export type DaysForcedState = 'hovered' | 'pressed' | 'focused';

/** Figma "State" (all 7 values) — used by stories and the Calendar to describe a cell. */
export type DaysState = 'enabled' | 'hovered' | 'pressed' | 'focused' | 'selected' | 'in-range' | 'disabled';

export interface DaysProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'children'> {
  /** Cell label — a day number ("1"), month ("Jan") or year ("2024"). */
  children: ReactNode;
  /** Figma State=Selected — brand fill, on-color text (single date or range start/end). */
  selected?: boolean;
  /** Figma State=In range — `background-layer-selected` fill for days between range start and end. */
  inRange?: boolean;
  /** Figma "Today" — 24×2 indicator under the label. */
  today?: boolean;
  /** Figma State=Disabled — `text-disabled`, no indicator, not selectable. */
  disabled?: boolean;
  /**
   * Keep a disabled cell focusable (`aria-disabled` only, clicks ignored) so grid keyboard navigation can
   * move through disabled dates. Default `false` (native `disabled`).
   */
  focusableWhenDisabled?: boolean;
  /** Force a visual state for screenshots / Storybook. */
  'data-state'?: DaysForcedState;
  /** Additional CSS class names for the cell. */
  className?: string;
}
