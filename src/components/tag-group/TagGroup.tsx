import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import type { TagGroupProps, TagGroupSize } from './tag-group.types';

const gapBySize: Record<TagGroupSize, string> = {
  large: 'gap-[var(--scanner-spacing-3)]',        // 8px
  medium: 'gap-[var(--scanner-spacing-3)]',        // 8px
  small: 'gap-[var(--scanner-spacing-3)]',         // 8px
  'extra-small': 'gap-[var(--scanner-spacing-2)]', // 4px
};

/**
 * Scanner TagGroup — wraps Tag elements in a flex-wrap container.
 *
 * Sizes control the gap between tags. Tags will automatically wrap
 * to the next line when they exceed the container width.
 *
 * @example
 * <TagGroup size="medium">
 *   <Tag onDismiss={...}>React</Tag>
 *   <Tag onDismiss={...}>TypeScript</Tag>
 *   <Tag onDismiss={...}>Tailwind</Tag>
 * </TagGroup>
 */
export const TagGroup = forwardRef<HTMLDivElement, TagGroupProps>(
  (
    {
      children,
      size = 'large',
      className,
      ...rest
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-wrap content-center items-center',
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

TagGroup.displayName = 'TagGroup';
