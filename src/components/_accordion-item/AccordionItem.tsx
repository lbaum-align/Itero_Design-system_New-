import { forwardRef, useId } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../../icons';
import type { AccordionItemProps, AccordionItemStyle } from './accordion-item.types';

/* ------------------------------------------------------------------ */
/*  Style config — maps Figma "Style" variant to class groups          */
/* ------------------------------------------------------------------ */

const rootStyles: Record<
  AccordionItemStyle,
  { base: string; collapsed: string; expanded: string; focused: string }
> = {
  'background-01': {
    base: 'bg-[var(--scanner-bg-primary)] rounded-[var(--scanner-radius-xl)] overflow-clip',
    collapsed: 'h-[60px] items-start justify-center',
    expanded: '',
    focused:
      'outline-2 outline-offset-[-2px] outline-[var(--scanner-focus-ring)]',
  },
  'background-02': {
    base: 'bg-[var(--scanner-bg-secondary)] rounded-[var(--scanner-radius-xl)] overflow-clip',
    collapsed: 'h-[60px] items-start justify-center',
    expanded: '',
    focused:
      'outline-2 outline-offset-[-2px] outline-[var(--scanner-focus-ring)]',
  },
  border: {
    base: 'border border-[var(--scanner-border-subtle)] rounded-[var(--scanner-radius-xl)] overflow-clip',
    collapsed: 'h-[60px] items-start justify-center',
    expanded: '',
    focused:
      'border-[var(--scanner-focus-ring)]',
  },
  line: {
    base: 'border-b border-[var(--scanner-border-subtle)] overflow-clip',
    collapsed: 'h-[60px]',
    expanded: '',
    focused: '',
  },
};

/* ------------------------------------------------------------------ */
/*  Skeleton sub-component                                             */
/* ------------------------------------------------------------------ */

function SkeletonContent({
  variant,
  expanded,
  className,
}: {
  variant: AccordionItemStyle;
  expanded: boolean;
  className?: string;
}) {
  const isLine = variant === 'line';

  return (
    <div
      className={cn(
        'flex flex-col items-start w-full animate-pulse',
        rootStyles[variant].base,
        expanded ? rootStyles[variant].expanded : rootStyles[variant].collapsed,
        className,
      )}
      aria-hidden="true"
    >
      {/* Header skeleton */}
      <div
        className={cn(
          'flex items-center w-full',
          isLine
            ? 'h-[60px] gap-[var(--scanner-spacing-3)] px-[var(--scanner-spacing-5)] py-[var(--scanner-spacing-5)]'
            : 'gap-[var(--scanner-spacing-3)] p-[var(--scanner-spacing-5)] rounded-t-[var(--scanner-radius-xl)]',
        )}
      >
        {/* Title placeholder */}
        <div className="flex-1 min-w-0 h-[24px] bg-[var(--scanner-bg-disabled)]" />
        {/* Chevron placeholder */}
        <div className="shrink-0 size-[24px] bg-[var(--scanner-bg-disabled)]" />
      </div>

      {/* Content skeleton (when expanded) */}
      {expanded && (
        <div
          className={cn(
            'flex flex-col items-start w-full pb-[var(--scanner-spacing-5)]',
            isLine
              ? 'gap-[var(--scanner-spacing-2)] px-[var(--scanner-spacing-5)]'
              : 'gap-[var(--scanner-spacing-2)] px-[var(--scanner-spacing-5)]',
          )}
        >
          <div className="w-full h-[16px] bg-[var(--scanner-bg-disabled)]" />
          <div className="w-full h-[16px] bg-[var(--scanner-bg-disabled)]" />
          <div className="w-full h-[16px] bg-[var(--scanner-bg-disabled)]" />
          <div className="w-full h-[16px] bg-[var(--scanner-bg-disabled)]" />
          <div className="w-full h-[16px] bg-[var(--scanner-bg-disabled)]" />
          <div className="w-[96px] h-[16px] bg-[var(--scanner-bg-disabled)]" />
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  AccordionItem                                                      */
/* ------------------------------------------------------------------ */

/**
 * _AccordionItem — Private accordion sub-component.
 *
 * An expandable/collapsible panel with a header (clickable button)
 * and a content region. Meant to be composed inside AccordionGroup.
 *
 * Implements every Figma variant:
 * - Style: background-01 / background-02 / border / line
 * - State: enabled / hovered / focused / disabled / skeleton
 * - Expanded: true / false
 */
export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  (
    {
      id: idProp,
      title,
      description,
      children,
      expanded = false,
      onToggle,
      disabled = false,
      skeleton = false,
      variant = 'background-01',
      className,
    },
    ref,
  ) => {
    const autoId = useId();
    const itemId = idProp || autoId;
    const headerId = `${itemId}-header`;
    const panelId = `${itemId}-panel`;

    const isLine = variant === 'line';

    /* ── Skeleton ── */
    if (skeleton) {
      return (
        <SkeletonContent
          variant={variant}
          expanded={expanded}
          className={className}
        />
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-start w-full',
          rootStyles[variant].base,
          /* Disabled border override */
          disabled && variant === 'border' && 'border-[var(--scanner-border-disabled)]',
          disabled && variant === 'line' && 'border-[var(--scanner-border-disabled)]',
          className,
        )}
      >
        {/* ── Header ── */}
        <button
          id={headerId}
          type="button"
          aria-expanded={expanded}
          aria-controls={panelId}
          aria-disabled={disabled || undefined}
          disabled={disabled}
          onClick={onToggle}
          className={cn(
            'flex items-center w-full cursor-pointer select-none',
            'transition-colors duration-150',

            /* Size & padding */
            isLine
              ? 'gap-[var(--scanner-spacing-3)] px-[var(--scanner-spacing-5)] py-[var(--scanner-spacing-5)]'
              : 'gap-[var(--scanner-spacing-3)] p-[var(--scanner-spacing-5)] rounded-t-[var(--scanner-radius-xl)]',

            /* Height when collapsed + non-line */
            !expanded && !isLine && 'h-[60px]',
            !expanded && isLine && 'h-[60px]',

            /* Text color */
            disabled
              ? 'text-[var(--scanner-text-disabled)] cursor-not-allowed'
              : 'text-[var(--scanner-text-primary)]',

            /* Hover */
            !disabled && 'hover:bg-[var(--scanner-bg-hover)]',

            /* Focus visible */
            !disabled &&
              isLine &&
              'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--scanner-focus-ring)]',
            !disabled &&
              !isLine &&
              'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--scanner-focus-ring)] focus-visible:rounded-t-[var(--scanner-radius-xl)]',
          )}
          data-state={disabled ? 'disabled' : undefined}
        >
          {/* Title */}
          <span
            className={cn(
              'flex-1 min-w-0 text-left break-words',
              'font-[family-name:var(--scanner-font-sans)]',
              'text-[length:var(--scanner-text-md)]',
              'font-[var(--scanner-font-medium)]',
              'leading-[var(--scanner-leading-lg)]',
            )}
          >
            {title}
          </span>

          {/* Chevron icon */}
          <span
            className={cn(
              'shrink-0 flex items-center justify-center',
              'transition-transform duration-200',
              expanded && 'rotate-180',
            )}
          >
            <Icon
              name="chevron-down"
              size={24}
              className={cn(
                disabled
                  ? 'text-[var(--scanner-icon-disabled)]'
                  : 'text-[var(--scanner-icon-secondary)]',
              )}
            />
          </span>
        </button>

        {/* ── Content panel ── */}
        {expanded && (
          <div
            id={panelId}
            role="region"
            aria-labelledby={headerId}
            className={cn(
              'flex flex-col items-start w-full',
              'pb-[var(--scanner-spacing-5)]',
              isLine
                ? 'gap-[var(--scanner-spacing-5)] px-[var(--scanner-spacing-5)]'
                : 'gap-[var(--scanner-spacing-5)] px-[var(--scanner-spacing-5)]',
            )}
          >
            {/* Description text or custom children */}
            {children ?? (
              <p
                className={cn(
                  'w-full break-words',
                  'font-[family-name:var(--scanner-font-sans)]',
                  'text-[length:var(--scanner-text-md)]',
                  'font-[var(--scanner-font-regular)]',
                  'leading-[var(--scanner-leading-lg)]',
                  disabled
                    ? 'text-[var(--scanner-text-disabled)]'
                    : 'text-[var(--scanner-text-secondary)]',
                )}
              >
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  },
);

AccordionItem.displayName = 'AccordionItem';
