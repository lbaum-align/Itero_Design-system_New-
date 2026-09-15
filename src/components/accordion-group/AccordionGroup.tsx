import { forwardRef, useId, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { cn } from '../../utils/cn';
import { AccordionItem } from '../_accordion-item';
import type { AccordionGroupProps } from './accordion-group.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → 02 Accordion group (node 36403:2957)
 * Style: Line, Background 01, Background 02, Border (4 variants).
 *
 * A vertical stack of `_01 Accordion item`s: 8px gap for Background 01/02 and Border, no gap for Line.
 * Keyboard (Figma docs): Tab focuses a header, Enter/Space toggles it,
 * Arrow Up/Down move between headers in the group (wrapping); Home/End jump to the first/last header.
 */

/** Headers of this group only (not of accordions nested inside a panel), skipping disabled ones. */
const HEADER_SELECTOR = ':scope > [data-accordion-item] > :first-child > [data-accordion-header]:not(:disabled)';

/**
 * Scanner AccordionGroup — vertically stacked sections that expand and collapse.
 *
 * Supports controlled (`expandedIds` + `onExpandedChange`) and uncontrolled (`defaultExpandedIds`)
 * expansion, with multi-expand (default, per Figma docs) or single-expand (`allowMultiple={false}`).
 *
 * @example
 * <AccordionGroup
 *   variant="line"
 *   items={[
 *     { id: 'scan', title: 'Scan settings', description: 'Resolution and colour options.' },
 *     { id: 'export', title: 'Export', description: 'File formats.' },
 *   ]}
 * />
 */
export const AccordionGroup = forwardRef<HTMLDivElement, AccordionGroupProps>(
  (
    {
      items,
      variant = 'background-01',
      allowMultiple = true,
      defaultExpandedIds = [],
      expandedIds: controlledIds,
      onExpandedChange,
      skeleton = false,
      headingLevel = 3,
      className,
      onKeyDown,
      ...rest
    },
    ref,
  ) => {
    const groupId = useId();
    const [internalIds, setInternalIds] = useState<string[]>(defaultExpandedIds);
    const isControlled = controlledIds !== undefined;
    const expandedIds = isControlled ? controlledIds : internalIds;

    const setExpandedIds = (next: string[]) => {
      if (!isControlled) setInternalIds(next);
      onExpandedChange?.(next);
    };

    const handleToggle = (itemId: string) => {
      if (expandedIds.includes(itemId)) {
        setExpandedIds(expandedIds.filter((id) => id !== itemId));
      } else {
        setExpandedIds(allowMultiple ? [...expandedIds, itemId] : [itemId]);
      }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;
      if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;

      const headers = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>(HEADER_SELECTOR));
      const current = headers.indexOf(event.target as HTMLButtonElement);
      if (current === -1 || headers.length === 0) return;

      const last = headers.length - 1;
      const next =
        event.key === 'ArrowDown'
          ? (current + 1) % headers.length
          : event.key === 'ArrowUp'
            ? (current - 1 + headers.length) % headers.length
            : event.key === 'Home'
              ? 0
              : last;

      event.preventDefault();
      headers[next].focus();
    };

    return (
      <div
        ref={ref}
        data-variant={variant}
        onKeyDown={handleKeyDown}
        className={cn(
          'flex w-full flex-col items-start',
          variant === 'line' ? 'gap-0' : 'gap-[var(--scanner-spacing-3)]',
          className,
        )}
        {...rest}
      >
        {items.map((item) => (
          <AccordionItem
            key={item.id}
            id={`${groupId}-${item.id}`}
            title={item.title}
            description={item.description}
            expanded={expandedIds.includes(item.id)}
            onToggle={() => handleToggle(item.id)}
            disabled={item.disabled}
            skeleton={skeleton}
            variant={variant}
            headingLevel={headingLevel}
          >
            {item.content}
          </AccordionItem>
        ))}
      </div>
    );
  },
);

AccordionGroup.displayName = 'AccordionGroup';
