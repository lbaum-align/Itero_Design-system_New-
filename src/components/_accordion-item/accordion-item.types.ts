import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Visual style of the accordion item (Figma "Style").
 *
 * - `background-01` — `background-layer-01` fill, 16px radius
 * - `background-02` — `background-layer-02` fill, 16px radius
 * - `border`        — no fill, 1px `border-subtle` stroke, 16px radius
 * - `line`          — no fill, 1px `border-subtle` bottom divider
 */
export type AccordionItemStyle = 'background-01' | 'background-02' | 'border' | 'line';

/**
 * Figma "State". Hovered/Focused come from CSS (forceable via `data-state`);
 * Disabled and Skeleton are driven by their own props.
 */
export type AccordionItemState = 'enabled' | 'hovered' | 'focused' | 'disabled' | 'skeleton';

/** Interactive states that can be forced via `data-state` (Storybook / visual tests). */
export type AccordionItemForcedState = 'hovered' | 'focused';

export interface AccordionItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'onToggle' | 'children'> {
  /** Base id for the header button (`{id}-header`) and panel (`{id}-panel`). Auto-generated when omitted. */
  id?: string;

  /** Header text (Figma "Title text value"). */
  title: ReactNode;

  /** Body text shown when expanded (Figma "Description text value"). */
  description?: ReactNode;

  /**
   * Extra content rendered below the description when expanded
   * (Figma "Show swap content" + "Swap content" slot).
   */
  children?: ReactNode;

  /** Expanded state (Figma "Expanded"). When omitted the item manages its own state. */
  expanded?: boolean;

  /** Initial expanded state when uncontrolled. */
  defaultExpanded?: boolean;

  /** Called when the header is activated (click, Enter or Space) with the next expanded value. */
  onToggle?: (expanded: boolean) => void;

  /** Figma State=Disabled — header can't be focused or toggled, text and chevron use disabled colours. */
  disabled?: boolean;

  /** Figma State=Skeleton — loading placeholder. */
  skeleton?: boolean;

  /**
   * Visual style (Figma "Style").
   * @default 'background-01'
   */
  variant?: AccordionItemStyle;

  /**
   * Heading level wrapping the header button (WAI-ARIA accordion pattern).
   * @default 3
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;

  /** Force a visual state on the header for screenshots / Storybook. */
  'data-state'?: AccordionItemForcedState;
}
