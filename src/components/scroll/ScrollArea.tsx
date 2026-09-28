import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { scrollbarClassName } from './scroll-classes';
import type { ScrollAreaOrientation, ScrollAreaProps } from './scroll.types';

const overflow: Record<ScrollAreaOrientation, string> = {
  vertical: 'overflow-y-auto overflow-x-hidden',
  horizontal: 'overflow-x-auto overflow-y-hidden',
  both: 'overflow-auto',
};

/**
 * ScrollArea — overflow container whose native scroll bar is styled as the Figma `Scroll`
 * (4px `border-subtle` bar, 4px from the edge). Keyboard-scrollable: focusable with `tabIndex=0`
 * by default — give it an `aria-label` when it holds meaningful content.
 *
 * @example
 * <ScrollArea aria-label="Patients" style={{ maxHeight: 240 }}>{rows}</ScrollArea>
 */
export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ orientation = 'vertical', tabIndex = 0, className, children, ...rest }, ref) => (
    <div
      ref={ref}
      tabIndex={tabIndex}
      data-orientation={orientation}
      className={cn(
        'relative outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--scanner-border-focus)]',
        overflow[orientation],
        scrollbarClassName,
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  ),
);

ScrollArea.displayName = 'ScrollArea';
