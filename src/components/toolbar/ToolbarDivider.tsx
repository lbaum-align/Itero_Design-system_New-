import { forwardRef, useContext } from 'react';
import { cn } from '../../utils/cn';
import { ToolbarContext } from './toolbar-context';
import type { ToolbarDividerProps } from './toolbar.types';

/**
 * A 1px separator between groups of toolbar buttons. It runs across the toolbar's
 * cross axis, inset from both ends, and is hidden from assistive technology.
 */
export const ToolbarDivider = forwardRef<HTMLDivElement, ToolbarDividerProps>(
  ({ orientation, className, ...rest }, ref) => {
    const { orientation: toolbarOrientation } = useContext(ToolbarContext);
    /* A horizontal toolbar needs vertical dividers, and vice versa. */
    const isVerticalLine = (orientation ?? toolbarOrientation) === 'horizontal';

    return (
      <div
        ref={ref}
        aria-hidden="true"
        data-orientation={isVerticalLine ? 'vertical' : 'horizontal'}
        className={cn(
          'shrink-0 self-stretch bg-[var(--scanner-border-subtle)]',
          isVerticalLine
            ? 'my-[var(--scanner-toolbar-divider-inset)] w-px'
            : 'mx-[var(--scanner-toolbar-divider-inset)] h-px',
          className,
        )}
        {...rest}
      />
    );
  },
);

ToolbarDivider.displayName = 'ToolbarDivider';
