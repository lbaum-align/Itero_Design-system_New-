import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { TagSizeContext } from '../tag/tag-context';
import type { TagGroupProps, TagGroupSize } from './tag-group.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → 02 Tag group (node 33521:164887)
 * Size: Large, Medium, Small, Extra small — horizontal wrapping auto-layout,
 * row and column gap 8px (spacing-02), Extra small 4px (spacing-01).
 */

const gapBySize: Record<TagGroupSize, string> = {
  large: 'gap-[var(--scanner-spacing-3)]', // 8
  medium: 'gap-[var(--scanner-spacing-3)]', // 8
  small: 'gap-[var(--scanner-spacing-3)]', // 8
  'extra-small': 'gap-[var(--scanner-spacing-2)]', // 4
};

/**
 * Scanner TagGroup — lays out `Tag`s in a wrapping row.
 *
 * Tags wrap onto new lines when they exceed the container width. Tags that
 * don't set `size` inherit the group's size, like the Figma component.
 *
 * @example
 * <TagGroup size="small" aria-label="Selected teeth">
 *   <Tag onDismiss={...}>UL1</Tag>
 *   <Tag onDismiss={...}>UL2</Tag>
 * </TagGroup>
 */
export const TagGroup = forwardRef<HTMLDivElement, TagGroupProps>(
  ({ children, size = 'large', className, ...rest }, ref) => (
    <TagSizeContext.Provider value={size}>
      <div
        ref={ref}
        role="group"
        data-size={size}
        className={cn('flex flex-wrap content-start items-center', gapBySize[size], className)}
        {...rest}
      >
        {children}
      </div>
    </TagSizeContext.Provider>
  ),
);

TagGroup.displayName = 'TagGroup';
