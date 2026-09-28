import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import type { SlotContentProps } from './slot-content.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → Slot content (node 8146:4227, page "Logos").
 * One component, no variants. Used as the swappable body of Popover (and Modal window / Data table slots).
 *
 * - 1px dashed `border-interactive` stroke (dash 4/4) inside the box → drawn as an outline with a -1px
 *   offset so it doesn't change layout, like a Figma inside stroke.
 * - Padding spacing-04 (16px), radius medium (8px), content vertically centred.
 * - Text Body/$tp-body-02: 18/28 Roboto Regular in `text-link`.
 */

/**
 * SlotContent — a design-time placeholder marking where custom content goes
 * (the Figma "Swap me to any component" slot). Use it in stories, prototypes and docs;
 * replace it with real content in product code.
 *
 * @example
 * <Popover content={<SlotContent />}>…</Popover>
 * <SlotContent>Filters form</SlotContent>
 */
export const SlotContent = forwardRef<HTMLDivElement, SlotContentProps>(
  ({ children = 'Swap me to any component', className, ...rest }, ref) => (
    <div
      ref={ref}
      data-slot-content=""
      className={cn(
        'relative flex items-center p-[var(--scanner-spacing-5)] rounded-[var(--scanner-radius-md)]',
        'outline-1 -outline-offset-1 outline-dashed outline-[var(--scanner-border-interactive)]',
        'font-[family-name:var(--scanner-font-sans)] font-[number:var(--scanner-font-regular)]',
        'text-[length:var(--scanner-text-scanner-md)] leading-[var(--scanner-leading-lg)]',
        'text-[color:var(--scanner-text-link)] [word-break:break-word]',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  ),
);

SlotContent.displayName = 'SlotContent';
