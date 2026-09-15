import { forwardRef, useContext, useLayoutEffect, useState } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../../icons';
import { Tooltip } from '../tooltip';
import { TagSizeContext } from './tag-context';
import type { TagProps, TagSize } from './tag.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → 01 Tag (node 22123:13334)
 * Size (Large, Medium, Small, Extra small) × State (Enabled, Disabled, Skeleton) = 12 variants.
 *
 * The 1px stroke sits inside the box in Figma, so it is drawn as an inset
 * box-shadow — a CSS border would make every tag 2px larger.
 */

const sizeConfig: Record<
  TagSize,
  { box: string; radius: string; iconSize: 20 | 24; skeleton: string }
> = {
  large: {
    // 12 / 12 / 12 / 16, gap 8, radius 8
    box: 'py-[var(--scanner-spacing-4)] pr-[var(--scanner-spacing-4)] pl-[var(--scanner-spacing-5)] gap-[var(--scanner-spacing-3)]',
    radius: 'rounded-[var(--scanner-radius-md)]',
    iconSize: 24,
    skeleton: 'h-[var(--scanner-tag-height-lg)] w-[var(--scanner-tag-skeleton-width-lg)]',
  },
  medium: {
    // 8 / 8 / 8 / 12, gap 8, radius 8
    box: 'py-[var(--scanner-spacing-3)] pr-[var(--scanner-spacing-3)] pl-[var(--scanner-spacing-4)] gap-[var(--scanner-spacing-3)]',
    radius: 'rounded-[var(--scanner-radius-md)]',
    iconSize: 24,
    skeleton: 'h-[var(--scanner-tag-height-md)] w-[var(--scanner-tag-skeleton-width-md)]',
  },
  small: {
    // 4 / 4 / 4 / 8, gap 4, radius 4
    box: 'py-[var(--scanner-spacing-2)] pr-[var(--scanner-spacing-2)] pl-[var(--scanner-spacing-3)] gap-[var(--scanner-spacing-2)]',
    radius: 'rounded-[var(--scanner-radius-sm)]',
    iconSize: 24,
    skeleton: 'h-[var(--scanner-tag-height-sm)] w-[var(--scanner-tag-skeleton-width-sm)]',
  },
  'extra-small': {
    // 0 / 0 / 0 / 4, gap 0, radius 4, 20px icon
    box: 'pl-[var(--scanner-spacing-2)]',
    radius: 'rounded-[var(--scanner-radius-sm)]',
    iconSize: 20,
    skeleton: 'h-[var(--scanner-tag-height-xs)] w-[var(--scanner-tag-skeleton-width-xs)]',
  },
};

/** True when the element's text is cut off by `text-overflow: ellipsis`. */
function useIsTruncated<T extends HTMLElement>(content: unknown) {
  // Callback ref in state: the label remounts inside a Tooltip once truncated,
  // so the observer must follow the current element.
  const [el, setEl] = useState<T | null>(null);
  const [truncated, setTruncated] = useState(false);

  useLayoutEffect(() => {
    if (!el) return;
    const check = () => setTruncated(el.scrollWidth > el.clientWidth);
    check();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [el, content]);

  return [setEl, truncated] as const;
}

/**
 * Scanner Tag — shows an applied filter or selected item that the user can remove.
 * Use a Chip for filtering controls and a Badge for status.
 *
 * Figma props → React: Size → `size`, State → `disabled` / `skeleton`, Text → `children`.
 * Keyboard: Tab focuses the close icon; Enter/Space dismisses.
 * Overflow: long labels truncate with an ellipsis and show the full text in a tooltip.
 *
 * @example
 * <Tag onDismiss={() => remove(id)}>Upper jaw</Tag>
 * <Tag size="small" disabled onDismiss={remove}>Read only</Tag>
 * <Tag size="large" skeleton>Loading</Tag>
 */
export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  (
    {
      children,
      size: sizeProp,
      disabled = false,
      skeleton = false,
      onDismiss,
      dismissLabel,
      className,
      ...rest
    },
    ref,
  ) => {
    const groupSize = useContext(TagSizeContext);
    const size = sizeProp ?? groupSize ?? 'medium';
    const cfg = sizeConfig[size];
    const [labelRef, truncated] = useIsTruncated<HTMLSpanElement>(children);

    /* ── Skeleton ── */
    if (skeleton) {
      return (
        <span
          ref={ref}
          aria-hidden="true"
          data-skeleton=""
          className={cn(
            'inline-block shrink-0 animate-pulse align-middle',
            'bg-[var(--scanner-bg-highlight-gray)]',
            cfg.radius,
            cfg.skeleton,
            className,
          )}
          {...rest}
        />
      );
    }

    const text = typeof children === 'string' || typeof children === 'number' ? String(children) : undefined;

    const label = (
      <span
        ref={labelRef}
        className={cn(
          'block min-w-px flex-1 truncate',
          'font-[family-name:var(--scanner-font-sans)] font-[number:var(--scanner-font-regular)]',
          'text-[length:var(--scanner-text-base)] leading-[var(--scanner-leading-md)]',
          disabled ? 'text-[color:var(--scanner-text-disabled)]' : 'text-[color:var(--scanner-text-primary)]',
        )}
      >
        {children}
      </span>
    );

    return (
      <span
        ref={ref}
        aria-disabled={disabled || undefined}
        className={cn(
          'group inline-flex max-w-full items-center justify-center align-middle',
          'min-w-[var(--scanner-tag-min-width)]',
          cfg.box,
          cfg.radius,
          disabled
            ? 'shadow-[inset_0_0_0_1px_var(--scanner-border-disabled)] cursor-not-allowed'
            : 'shadow-[inset_0_0_0_1px_var(--scanner-border-subtle)]',
          className,
        )}
        {...rest}
      >
        {/* Overflow: ellipsis + tooltip with the full label (Figma "Content → Overflow") */}
        {truncated && text && !disabled ? (
          <Tooltip content={text} position="top" className="min-w-px flex-1">
            {label}
          </Tooltip>
        ) : (
          label
        )}

        {onDismiss && (
          <button
            type="button"
            aria-label={dismissLabel ?? (text ? `Remove ${text}` : 'Remove')}
            disabled={disabled}
            onClick={onDismiss}
            className={cn(
              'inline-flex shrink-0 items-center justify-center border-0 bg-transparent p-0 outline-none',
              'rounded-[var(--scanner-radius-sm)]',
              disabled
                ? 'cursor-not-allowed text-[color:var(--scanner-icon-disabled)]'
                : 'cursor-pointer text-[color:var(--scanner-icon-secondary)]',
              'focus-visible:shadow-[0_0_0_var(--scanner-tag-close-focus-width)_var(--scanner-border-focus)]',
              'group-data-[state=focused]:shadow-[0_0_0_var(--scanner-tag-close-focus-width)_var(--scanner-border-focus)]',
            )}
          >
            <Icon name="close-empty" size={cfg.iconSize} />
          </button>
        )}
      </span>
    );
  },
);

Tag.displayName = 'Tag';
