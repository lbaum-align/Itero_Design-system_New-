import type { ReactNode } from 'react';
import type { AccordionItemStyle } from '../_accordion-item/accordion-item.types';

/**
 * Data shape for a single accordion item when used with the `items` prop.
 */
export interface AccordionGroupItem {
  /** Unique identifier for this item. */
  id: string;
  /** Header title text. */
  title: string;
  /** Description text shown in the content panel. Ignored if `content` is provided. */
  description?: string;
  /** Custom content rendered in the content panel (takes precedence over `description`). */
  content?: ReactNode;
  /** Whether this item is disabled. */
  disabled?: boolean;
}

export interface AccordionGroupProps {
  /** Array of accordion items to render. */
  items: AccordionGroupItem[];

  /**
   * Visual style applied to all items.
   * Maps to the Figma "Style" variant on both the group and individual items.
   * @default 'background-01'
   */
  variant?: AccordionItemStyle;

  /**
   * Allow multiple items to be expanded simultaneously.
   * When false, expanding one item collapses the others (single-expand mode).
   * @default false
   */
  allowMultiple?: boolean;

  /**
   * IDs of items that should be expanded by default (uncontrolled).
   * Ignored when `expandedIds` is provided.
   */
  defaultExpandedIds?: string[];

  /**
   * Controlled expanded state — array of currently expanded item IDs.
   * When provided, the component is fully controlled; `onExpandedChange` is
   * the only way to update the expanded state.
   */
  expandedIds?: string[];

  /**
   * Called whenever the set of expanded item IDs changes.
   * Receives the new array of expanded IDs.
   */
  onExpandedChange?: (expandedIds: string[]) => void;

  /** Render all items as skeleton placeholders. */
  skeleton?: boolean;

  /** Additional CSS class names merged onto the root element. */
  className?: string;
}
