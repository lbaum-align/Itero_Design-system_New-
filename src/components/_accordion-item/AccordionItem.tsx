import { forwardRef, useId, useState } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../../icons';
import type { AccordionItemProps, AccordionItemStyle } from './accordion-item.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → _01 Accordion item (node 36403:3026)
 * Style (Background 01, Background 02, Border, Line) × State (Enabled, Hovered, Focused, Disabled, Skeleton)
 * × Expanded (False, True) = 40 variants.
 *
 * - Header: 16px padding, 8px gap, title Heading/$tp-headling-02 (18/28 medium), 24px chevron.
 * - Content: 0 16 16 16 padding, 16px gap between the description (Body/$tp-body-02) and the swap-content slot.
 * - Hovered: only the chevron changes (icon-tertiary → icon-primary); no background change.
 * - Focused: 1px border-focus stroke. Background/Border draw it inside the item (collapsed) or inside
 *   the header (expanded); Line draws it outside the item (collapsed, replacing the divider) or the header.
 * - Strokes are inset box-shadows so they don't change the 60px header height.
 */

/** Surface per style: fill / stroke / radius. */
const surface: Record<AccordionItemStyle, string> = {
  'background-01': 'overflow-clip rounded-[var(--scanner-radius-xl)] bg-[var(--scanner-bg-layer-01)]',
  'background-02': 'overflow-clip rounded-[var(--scanner-radius-xl)] bg-[var(--scanner-bg-layer-02)]',
  border: 'overflow-clip rounded-[var(--scanner-radius-xl)] shadow-[inset_0_0_0_1px_var(--scanner-border-subtle)]',
  line: 'shadow-[inset_0_-1px_0_0_var(--scanner-border-subtle)]',
};

/** Line style uses `border-disabled` for its divider while disabled or loading. */
const lineInactive = 'shadow-[inset_0_-1px_0_0_var(--scanner-border-disabled)]';

const ICON_SIZE = 24;
const SKELETON_LINES = 6;

/**
 * _AccordionItem — one expandable section: a header button that toggles a content panel.
 * Private building block of `AccordionGroup` (not exported from the package barrel).
 *
 * Figma props → React: Style → `variant`, Expanded → `expanded`, Title text value → `title`,
 * Description text value → `description`, Show swap content / Swap content → `children`,
 * State → `:hover` / `:focus-visible` (forceable via `data-state`), `disabled`, `skeleton`.
 *
 * Keyboard (Figma docs): Tab focuses the header, Enter/Space toggles the content.
 *
 * @example
 * <AccordionItem title="Scan settings" description="Choose the scan resolution." />
 * <AccordionItem title="Details" expanded={open} onToggle={setOpen} variant="line">
 *   <Button>Edit</Button>
 * </AccordionItem>
 */
export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  (
    {
      id: idProp,
      title,
      description,
      children,
      expanded: expandedProp,
      defaultExpanded = false,
      onToggle,
      disabled = false,
      skeleton = false,
      variant = 'background-01',
      headingLevel = 3,
      'data-state': forcedState,
      className,
      ...rest
    },
    ref,
  ) => {
    const autoId = useId();
    const baseId = idProp ?? autoId;
    const headerId = `${baseId}-header`;
    const panelId = `${baseId}-panel`;

    const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
    const expanded = expandedProp ?? internalExpanded;

    const isLine = variant === 'line';

    /* ── Skeleton ── */
    if (skeleton) {
      return (
        <div
          ref={ref}
          aria-hidden="true"
          data-skeleton=""
          data-accordion-item=""
          className={cn(
            'flex w-full animate-pulse flex-col items-start',
            isLine ? lineInactive : surface[variant],
            className,
          )}
          {...rest}
        >
          <div className="flex w-full items-center gap-[var(--scanner-spacing-3)] p-[var(--scanner-spacing-5)]">
            <div className="h-[var(--scanner-accordion-skeleton-title-height)] min-w-px flex-1 bg-[var(--scanner-bg-highlight-gray)]" />
            <span className="flex h-[var(--scanner-leading-lg)] shrink-0 items-center">
              <Icon
                name={expanded ? 'chevron-up' : 'chevron-down'}
                size={ICON_SIZE}
                className="text-[color:var(--scanner-icon-disabled)]"
              />
            </span>
          </div>
          {expanded && (
            <div className="flex w-full flex-col gap-[var(--scanner-spacing-3)] px-[var(--scanner-spacing-5)] pb-[var(--scanner-spacing-5)]">
              {Array.from({ length: SKELETON_LINES }, (_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-[var(--scanner-accordion-skeleton-line-height)] bg-[var(--scanner-bg-highlight-gray)]',
                    i === SKELETON_LINES - 1 ? 'w-[var(--scanner-accordion-skeleton-last-line-width)]' : 'w-full',
                  )}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    const toggle = () => {
      if (disabled) return;
      const next = !expanded;
      if (expandedProp === undefined) setInternalExpanded(next);
      onToggle?.(next);
    };

    const Heading = `h${headingLevel}` as const;
    const forcedFocus = forcedState === 'focused' && !disabled;

    return (
      <div
        ref={ref}
        data-accordion-item=""
        data-expanded={expanded || undefined}
        className={cn(
          'flex w-full flex-col items-start',
          isLine && disabled ? lineInactive : surface[variant],
          /* Line + collapsed + focused: the outside focus stroke replaces the divider */
          isLine && !expanded && !disabled && (forcedFocus ? 'shadow-none' : 'has-[:focus-visible]:shadow-none'),
          className,
        )}
        {...rest}
      >
        <Heading className="m-0 flex w-full p-0 font-[inherit] text-[length:inherit]">
          <button
            id={headerId}
            type="button"
            data-accordion-header=""
            data-state={forcedState}
            aria-expanded={expanded}
            aria-controls={panelId}
            aria-disabled={disabled || undefined}
            disabled={disabled}
            onClick={toggle}
            className={cn(
              'group/accordion-header relative flex w-full items-center text-left outline-none select-none',
              'gap-[var(--scanner-spacing-3)] p-[var(--scanner-spacing-5)]',
              disabled ? 'cursor-not-allowed' : 'cursor-pointer',
            )}
          >
            <span
              className={cn(
                'scanner-text-heading-02 min-w-px flex-1 break-words',
                disabled ? 'text-[color:var(--scanner-text-disabled)]' : 'text-[color:var(--scanner-text-primary)]',
              )}
            >
              {title}
            </span>

            <span className="flex min-h-[var(--scanner-leading-lg)] shrink-0 items-center self-stretch">
              <Icon
                name={expanded ? 'chevron-up' : 'chevron-down'}
                size={ICON_SIZE}
                className={cn(
                  'transition-colors duration-150',
                  disabled
                    ? 'text-[color:var(--scanner-icon-disabled)]'
                    : cn(
                        'text-[color:var(--scanner-icon-tertiary)]',
                        'group-hover/accordion-header:text-[color:var(--scanner-icon-primary)] group-data-[state=hovered]/accordion-header:text-[color:var(--scanner-icon-primary)]',
                        'group-focus-visible/accordion-header:text-[color:var(--scanner-icon-primary)] group-data-[state=focused]/accordion-header:text-[color:var(--scanner-icon-primary)]',
                      ),
                )}
              />
            </span>

            {/* Focus stroke — 1px border-focus */}
            {!disabled && (
              <span
                aria-hidden="true"
                data-part="focus-ring"
                className={cn(
                  'pointer-events-none absolute hidden border-solid',
                  'border-[length:var(--scanner-accordion-focus-width)] border-[color:var(--scanner-border-focus)]',
                  isLine
                    ? 'inset-[calc(var(--scanner-accordion-focus-width)*-1)]'
                    : cn('inset-0', expanded ? 'rounded-t-[var(--scanner-radius-xl)]' : 'rounded-[var(--scanner-radius-xl)]'),
                  'group-focus-visible/accordion-header:block group-data-[state=focused]/accordion-header:block',
                )}
              />
            )}
          </button>
        </Heading>

        <div
          id={panelId}
          role="region"
          aria-labelledby={headerId}
          hidden={!expanded}
          className="flex w-full flex-col items-start gap-[var(--scanner-spacing-5)] px-[var(--scanner-spacing-5)] pb-[var(--scanner-spacing-5)]"
        >
          {description != null && description !== '' && (
            <p
              className={cn(
                'scanner-text-body-02 m-0 w-full break-words',
                disabled ? 'text-[color:var(--scanner-text-disabled)]' : 'text-[color:var(--scanner-text-secondary)]',
              )}
            >
              {description}
            </p>
          )}
          {children != null && <div className="w-full">{children}</div>}
        </div>
      </div>
    );
  },
);

AccordionItem.displayName = 'AccordionItem';
