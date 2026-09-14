import { forwardRef, useCallback, useState } from 'react';
import { cn } from '../../utils/cn';
import { AccordionItem } from '../_accordion-item';
import type { AccordionGroupProps } from './accordion-group.types';

/**
 * AccordionGroup — Renders a vertical list of expandable/collapsible
 * accordion items.
 *
 * Supports both controlled (`expandedIds` + `onExpandedChange`) and
 * uncontrolled (`defaultExpandedIds`) expansion state, plus a toggle
 * for single-expand vs multi-expand behaviour.
 *
 * Figma component: "02 Accordion group"
 *
 * @example
 * ```tsx
 * <AccordionGroup
 *   items={[
 *     { id: '1', title: 'Section one', description: 'Content...' },
 *     { id: '2', title: 'Section two', description: 'Content...' },
 *   ]}
 *   variant="background-01"
 *   allowMultiple
 * />
 * ```
 */
export const AccordionGroup = forwardRef<HTMLDivElement, AccordionGroupProps>(
  (
    {
      items,
      variant = 'background-01',
      allowMultiple = false,
      defaultExpandedIds = [],
      expandedIds: controlledIds,
      onExpandedChange,
      skeleton = false,
      className,
    },
    ref,
  ) => {
    /* ── Internal state (uncontrolled mode) ── */
    const [internalIds, setInternalIds] = useState<string[]>(defaultExpandedIds);

    const isControlled = controlledIds !== undefined;
    const expandedIds = isControlled ? controlledIds : internalIds;

    const setExpandedIds = useCallback(
      (next: string[]) => {
        if (!isControlled) {
          setInternalIds(next);
        }
        onExpandedChange?.(next);
      },
      [isControlled, onExpandedChange],
    );

    /* ── Toggle handler ── */
    const handleToggle = useCallback(
      (itemId: string) => {
        const isExpanded = expandedIds.includes(itemId);

        if (isExpanded) {
          // Collapse this item
          setExpandedIds(expandedIds.filter((id) => id !== itemId));
        } else if (allowMultiple) {
          // Multi-expand: add to the list
          setExpandedIds([...expandedIds, itemId]);
        } else {
          // Single-expand: replace the list
          setExpandedIds([itemId]);
        }
      },
      [expandedIds, allowMultiple, setExpandedIds],
    );

    /* ── Determine spacing: line style has no gap; others use 8px ── */
    const isLine = variant === 'line';

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-start justify-center w-full',
          isLine ? '' : 'gap-[var(--scanner-spacing-3)]',
          className,
        )}
      >
        {items.map((item) => (
          <AccordionItem
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.description}
            expanded={expandedIds.includes(item.id)}
            onToggle={() => handleToggle(item.id)}
            disabled={item.disabled}
            skeleton={skeleton}
            variant={variant}
          >
            {item.content}
          </AccordionItem>
        ))}
      </div>
    );
  },
);

AccordionGroup.displayName = 'AccordionGroup';
