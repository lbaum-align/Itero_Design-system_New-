import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import type { ButtonGroupProps, ButtonGroupSize } from './button-group.types';

const gapBySize: Record<ButtonGroupSize, string> = {
  large: 'gap-[var(--scanner-spacing-5)]',   // 16px
  medium: 'gap-[var(--scanner-spacing-3)]',  // 8px
  small: 'gap-[var(--scanner-spacing-3)]',   // 8px
};

/**
 * Scanner ButtonGroup — groups multiple Button elements in a row or column.
 *
 * Supports horizontal (default) and vertical orientations, and three sizes
 * matching the Button size scale.
 *
 * @example
 * <ButtonGroup>
 *   <Button emphasis="secondary">Cancel</Button>
 *   <Button>Save</Button>
 * </ButtonGroup>
 */
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  (
    {
      children,
      orientation = 'horizontal',
      size = 'large',
      className,
      ...rest
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        role="group"
        className={cn(
          'inline-flex',
          orientation === 'vertical'
            ? 'flex-col items-start'
            : 'flex-row items-center',
          gapBySize[size],
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

ButtonGroup.displayName = 'ButtonGroup';
