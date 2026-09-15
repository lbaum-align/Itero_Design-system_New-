import type { HTMLAttributes, ReactNode } from 'react';
import type { AccordionItemStyle } from '../_accordion-item/accordion-item.types';

/**
 * Data shape for a single accordion item when used with the `items` prop.
 */
export interface AccordionGroupItem {
  /** Unique identifier for this item. */
  id: string;
  /** Header title (Figma "Title text value"). */
  title: ReactNode;
  /** Body text shown when expanded (Figma "Description text value"). */
  description?: ReactNode;
  /** Extra content rendered below the description (Figma "Show swap content" / "Swap content"). */
  content?: ReactNode;
  /** Whether this item is disabled (Figma State=Disabled). */
  disabled?: boolean;
}

export interface AccordionGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Array of accordion items to render. */
  items: AccordionGroupItem[];

  /**
   * Visual style applied to all items (Figma "Style").
   * Line has no gap between items; the other styles use an 8px gap.
   * @default 'background-01'
   */
  variant?: AccordionItemStyle;

  /**
   * Allow several items to be expanded at once. Figma docs: "Users can independently expand
   * each section of the accordion allowing for multiple sections to be open at once."
   * Set to `false` for single-expand mode (opening one item collapses the others).
   * @default true
   */
  allowMultiple?: boolean;

  /**
   * IDs of items that should be expanded by default (uncontrolled).
   * Ignored when `expandedIds` is provided.
   */
  defaultExpandedIds?: string[];

  /**
   * Controlled expanded state — array of currently expanded item IDs.
   * When provided, `onExpandedChange` is the only way to update the expanded state.
   */
  expandedIds?: string[];

  /** Called whenever the set of expanded item IDs changes. */
  onExpandedChange?: (expandedIds: string[]) => void;

  /** Render all items as skeleton placeholders (Figma item State=Skeleton). */
  skeleton?: boolean;

  /**
   * Heading level for every item header.
   * @default 3
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}
