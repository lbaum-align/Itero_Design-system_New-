import type { ReactNode } from 'react';

/**
 * Visual style of the accordion item, matching Figma "Style" variant.
 *
 * - `background-01` — white/layer-01 background with rounded corners
 * - `background-02` — gray/layer-02 background with rounded corners
 * - `border`        — transparent background with a 1px border and rounded corners
 * - `line`          — no background, only a bottom border divider
 */
export type AccordionItemStyle =
  | 'background-01'
  | 'background-02'
  | 'border'
  | 'line';

/**
 * Visual state of the accordion item, matching Figma "State" variant.
 * Most states are CSS-driven; `disabled` and `skeleton` are prop-controlled.
 */
export type AccordionItemState =
  | 'enabled'
  | 'hovered'
  | 'focused'
  | 'disabled'
  | 'skeleton';

export interface AccordionItemProps {
  /** Unique identifier used for ARIA attributes (`aria-controls`, `aria-labelledby`). */
  id: string;

  /** Title text displayed in the header row. */
  title: string;

  /**
   * Description text shown in the content panel when expanded.
   * Ignored when `children` is provided.
   */
  description?: string;

  /**
   * Custom content rendered inside the content panel.
   * When provided, takes precedence over `description`.
   */
  children?: ReactNode;

  /** Whether the item is currently expanded. */
  expanded?: boolean;

  /** Called when the header is clicked or activated via keyboard. */
  onToggle?: () => void;

  /** Disables interaction (grays out text and chevron). */
  disabled?: boolean;

  /** Renders a skeleton loading placeholder. */
  skeleton?: boolean;

  /**
   * Visual style — maps to the Figma "Style" variant.
   * @default 'background-01'
   */
  variant?: AccordionItemStyle;

  /** Additional CSS class names merged onto the root element. */
  className?: string;
}
