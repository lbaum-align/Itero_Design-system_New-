import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import type { TabItemProps } from './tab-item.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → _Tab item (node 28:1602)
 * State (Enabled, Hovered, Focused, Selected, Disabled) · Show badge · Text value.
 *
 * - 60px tall, no horizontal padding, 12px bottom padding, 8px gap (label ↔ badge)
 * - Label: Heading/$tp-headling-02 (18/28 medium)
 * - Enabled: text-secondary · Hovered / Focused / Selected: text-primary · Disabled: text-disabled
 * - Selected: 2px border-interactive stroke at the bottom, *inside* the item
 * - Focused: 1px border-focus stroke *outside* the item
 * Both strokes are box-shadows so they never shift layout.
 */

const base = cn(
  'relative inline-flex shrink-0 items-center justify-center',
  'h-[var(--scanner-tab-item-height)] gap-[var(--scanner-spacing-3)] px-0 pt-0 pb-[var(--scanner-spacing-4)]',
  'scanner-text-heading-02 whitespace-nowrap text-center',
  'm-0 border-0 bg-transparent outline-none select-none',
  'transition-[color,box-shadow] duration-150',
);

const enabledText = cn(
  'text-[color:var(--scanner-text-secondary)] cursor-pointer',
  'hover:text-[color:var(--scanner-text-primary)] data-[state=hovered]:text-[color:var(--scanner-text-primary)]',
  'focus-visible:text-[color:var(--scanner-text-primary)] data-[state=focused]:text-[color:var(--scanner-text-primary)]',
);

const focusRing = cn(
  'focus-visible:shadow-[0_0_0_var(--scanner-tab-focus-width)_var(--scanner-border-focus)]',
  'data-[state=focused]:shadow-[0_0_0_var(--scanner-tab-focus-width)_var(--scanner-border-focus)]',
);

const selectedIndicator = cn(
  'text-[color:var(--scanner-text-primary)] cursor-pointer',
  'shadow-[inset_0_calc(var(--scanner-tab-indicator-width)*-1)_0_0_var(--scanner-border-interactive)]',
  'focus-visible:shadow-[inset_0_calc(var(--scanner-tab-indicator-width)*-1)_0_0_var(--scanner-border-interactive),0_0_0_var(--scanner-tab-focus-width)_var(--scanner-border-focus)]',
  'data-[state=focused]:shadow-[inset_0_calc(var(--scanner-tab-indicator-width)*-1)_0_0_var(--scanner-border-interactive),0_0_0_var(--scanner-tab-focus-width)_var(--scanner-border-focus)]',
);

const disabledText = 'text-[color:var(--scanner-text-disabled)] cursor-not-allowed';

/**
 * _TabItem — a single tab. Private: render inside `TabGroup`, which manages selection,
 * roving tabindex and arrow-key navigation.
 *
 * Figma props → React: State → `:hover` / `:focus-visible` (forceable via `data-state`),
 * `selected`, `disabled`; Show badge → `badge`; Text value → `children`.
 *
 * @example
 * <TabItem selected>Overview</TabItem>
 * <TabItem badge={<Badge>3</Badge>}>Scans</TabItem>
 */
export const TabItem = forwardRef<HTMLButtonElement, TabItemProps>(
  ({ children, selected = false, disabled = false, skeleton = false, badge, className, ...rest }, ref) => {
    if (skeleton) {
      return (
        <span aria-hidden="true" data-skeleton="" className={cn(base, className)}>
          <span className="relative inline-flex items-center">
            {/* Invisible label keeps the placeholder as wide as the real tab */}
            <span className="invisible">{children}</span>
            <span className="absolute inset-0 animate-pulse bg-[var(--scanner-bg-highlight-gray)]" />
          </span>
        </span>
      );
    }

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={selected}
        aria-disabled={disabled || undefined}
        disabled={disabled}
        className={cn(
          base,
          disabled ? disabledText : selected ? selectedIndicator : [enabledText, focusRing],
          className,
        )}
        {...rest}
      >
        <span>{children}</span>
        {badge != null && <span className="inline-flex shrink-0 items-center">{badge}</span>}
      </button>
    );
  },
);

TabItem.displayName = 'TabItem';
