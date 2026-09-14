import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../../icons';
import type { TagProps, TagSize } from './tag.types';

// ---------------------------------------------------------------------------
// Size config — maps Figma dimensions to Tailwind utilities and token values.
// ---------------------------------------------------------------------------

type SizeConfig = {
  /** Wrapper padding + gap + radius classes */
  wrapper: string;
  /** Close icon pixel size (square) */
  iconSize: 20 | 24;
  /** Skeleton fixed width (px) */
  skeletonW: number;
  /** Skeleton fixed height (px) */
  skeletonH: number;
};

const sizeConfig: Record<TagSize, SizeConfig> = {
  large: {
    // 12px v-pad | 16px left | 12px right | 8px gap | radius 8px
    wrapper: 'py-3 pl-4 pr-3 gap-2 rounded-[var(--scanner-radius-md)]',
    iconSize: 24,
    skeletonW: 113,
    skeletonH: 48,
  },
  medium: {
    // 8px v-pad | 12px left | 8px right | 8px gap | radius 8px
    wrapper: 'py-2 pl-3 pr-2 gap-2 rounded-[var(--scanner-radius-md)]',
    iconSize: 24,
    skeletonW: 105,
    skeletonH: 40,
  },
  small: {
    // 4px v-pad | 8px left | 4px right | 4px gap | radius 4px
    wrapper: 'py-1 pl-2 pr-1 gap-1 rounded-[var(--scanner-radius-sm)]',
    iconSize: 20,
    skeletonW: 93,
    skeletonH: 32,
  },
  'extra-small': {
    // 0 v-pad | 4px left | 0 right | 0 gap | radius 4px
    wrapper: 'pl-1 pr-0 gap-0 rounded-[var(--scanner-radius-sm)]',
    iconSize: 20,
    skeletonW: 81,
    skeletonH: 24,
  },
};

// ---------------------------------------------------------------------------
// Tag component
// ---------------------------------------------------------------------------

/**
 * Scanner Tag — a dismissible label used to categorise or filter content.
 *
 * @example
 * <Tag size="medium" onDismiss={() => removeTag(id)}>Design system</Tag>
 * <Tag size="small" disabled>Read only</Tag>
 * <Tag size="large" skeleton />
 */
export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  (
    {
      children,
      size = 'medium',
      disabled = false,
      skeleton = false,
      onDismiss,
      className,
      ...rest
    },
    ref,
  ) => {
    const config = sizeConfig[size];

    // ------------------------------------------------------------------
    // Skeleton state — fixed-dimension gray placeholder, no content
    // NOTE: `--scanner-bg-highlight-gray` is not yet defined in the token
    // system; `--scanner-bg-tertiary` (neutral-200, #e9e9e9) is the closest
    // available solid gray semantic token and is used here instead.
    // ------------------------------------------------------------------
    if (skeleton) {
      return (
        <span
          ref={ref}
          style={{ width: config.skeletonW, height: config.skeletonH }}
          className={cn(
            'inline-block animate-pulse rounded-[var(--scanner-radius-md)]',
            size === 'small' || size === 'extra-small'
              ? 'rounded-[var(--scanner-radius-sm)]'
              : 'rounded-[var(--scanner-radius-md)]',
            'bg-[var(--scanner-bg-tertiary)]',
            className,
          )}
          aria-hidden="true"
          {...rest}
        />
      );
    }

    // ------------------------------------------------------------------
    // Rendered state
    // ------------------------------------------------------------------
    return (
      <span
        ref={ref}
        aria-disabled={disabled ? true : undefined}
        className={cn(
          // Layout
          'inline-flex items-center',
          config.wrapper,
          // Border
          'border border-solid',
          disabled
            ? 'border-[var(--scanner-border-disabled)]'
            : 'border-[var(--scanner-border-subtle)]',
          // Typography — Roboto Regular, body-02 style (closest token match
          // to Figma's 16px/24lh; see typography.css .scanner-text-body-02)
          'scanner-text-body-02',
          // Text color
          disabled
            ? 'text-[var(--scanner-text-disabled)]'
            : 'text-[var(--scanner-text-primary)]',
          // Cursor / pointer-events
          disabled && 'cursor-not-allowed',
          className,
        )}
        {...rest}
      >
        {/* Label */}
        <span className="min-w-px">{children}</span>

        {/* Dismiss button — only rendered when onDismiss is provided */}
        {onDismiss && (
          <button
            type="button"
            aria-label="Remove"
            disabled={disabled}
            onClick={onDismiss}
            className={cn(
              'inline-flex shrink-0 items-center justify-center',
              'bg-transparent p-0 border-0 outline-none cursor-pointer',
              // Inherit icon colour from the tag's text colour context
              disabled
                ? 'text-[var(--scanner-icon-disabled)] cursor-not-allowed pointer-events-none'
                : 'text-[var(--scanner-icon-secondary)] hover:text-[var(--scanner-icon-primary)]',
              // Focus ring
              'focus-visible:ring-2 focus-visible:ring-[var(--scanner-focus-ring)] focus-visible:rounded-[var(--scanner-radius-sm)]',
            )}
          >
            <Icon name="close-empty" size={config.iconSize} />
          </button>
        )}
      </span>
    );
  },
);

Tag.displayName = 'Tag';
