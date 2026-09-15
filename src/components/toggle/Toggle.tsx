import { forwardRef } from 'react';
import type { MouseEvent } from 'react';
import { cn } from '../../utils/cn';
import type { ToggleProps } from './toggle.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → Toggle (node 24292:6271)
 * Selected (False/True) × State (Enabled, Hovered, Pressed, Focused, Disabled, Skeleton) = 12 variants.
 *
 * Track 51.2×32, 2px padding, 28px handle. The focus ring is a 1px border-interactive
 * stroke around the track (Figma "Border focus", 54×36, radius 20).
 */

const trackBase = cn(
  'relative inline-flex shrink-0 items-center rounded-full p-[var(--scanner-spacing-1)]',
  'h-[var(--scanner-toggle-track-height)] w-[var(--scanner-toggle-track-width)]',
  'transition-colors duration-150',
);

const trackColors = {
  off: cn(
    'bg-[var(--scanner-bg-accent)]',
    'hover:bg-[var(--scanner-bg-accent-hover)] data-[state=hovered]:bg-[var(--scanner-bg-accent-hover)]',
    'active:bg-[var(--scanner-bg-accent-active)] data-[state=pressed]:bg-[var(--scanner-bg-accent-active)]',
  ),
  on: cn(
    'bg-[var(--scanner-bg-brand)]',
    'hover:bg-[var(--scanner-bg-brand-hover)] data-[state=hovered]:bg-[var(--scanner-bg-brand-hover)]',
    'active:bg-[var(--scanner-bg-brand-active)] data-[state=pressed]:bg-[var(--scanner-bg-brand-active)]',
  ),
  /* Disabled and Skeleton share the same fills in Figma */
  inactive: 'bg-[var(--scanner-bg-disabled)]',
};

const handleBase = cn(
  'pointer-events-none block shrink-0 rounded-full size-[var(--scanner-toggle-handle-size)]',
  'transition-transform duration-150',
);

/** Selected handle sits flush right: track − handle − 2 × padding */
const handleOn =
  'translate-x-[calc(var(--scanner-toggle-track-width)_-_var(--scanner-toggle-handle-size)_-_var(--scanner-spacing-1)*2)]';

/**
 * Scanner Toggle — a switch for a binary setting that applies immediately.
 * Use checkboxes/radio buttons when a confirmation step follows.
 *
 * Figma props → React: Selected → `selected`, Show value → `showValue`, Text value → `children`,
 * State → `:hover` / `:focus-visible` / `:active` (forceable via `data-state`), `disabled`, `skeleton`.
 * Keyboard: Tab to focus, Enter/Space to toggle.
 *
 * @example
 * <Toggle selected={on} onChange={setOn}>Notifications</Toggle>
 * <Toggle selected={on} onChange={setOn} aria-label="Dark mode" />
 */
export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      selected = false,
      onChange,
      disabled = false,
      skeleton = false,
      showValue = true,
      children,
      className,
      onClick,
      ...rest
    },
    ref,
  ) => {
    const hasValue = showValue && children !== undefined && children !== null && children !== false;

    /* ── Skeleton ── */
    if (skeleton) {
      return (
        <span
          aria-hidden="true"
          data-skeleton=""
          className={cn('inline-flex animate-pulse items-center gap-[var(--scanner-spacing-3)] align-middle', className)}
        >
          <span className={cn(trackBase, trackColors.inactive)}>
            <span className={cn(handleBase, 'bg-[var(--scanner-bg-on-color-disabled)]', selected && handleOn)} />
          </span>
          {hasValue && (
            <span
              className={cn(
                'block bg-[var(--scanner-bg-highlight-gray)]',
                'h-[var(--scanner-toggle-skeleton-value-height)] w-[var(--scanner-toggle-skeleton-value-width)]',
              )}
            />
          )}
        </span>
      );
    }

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (!event.defaultPrevented && !disabled) onChange?.(!selected);
    };

    const toggle = (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={selected}
        aria-disabled={disabled || undefined}
        disabled={disabled}
        data-selected={selected ? '' : undefined}
        onClick={handleClick}
        className={cn(
          'group outline-none',
          trackBase,
          disabled ? trackColors.inactive : selected ? trackColors.on : trackColors.off,
          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          !hasValue && className,
        )}
        {...rest}
      >
        <span
          aria-hidden="true"
          className={cn(
            handleBase,
            disabled ? 'bg-[var(--scanner-bg-on-color-disabled)]' : 'bg-[var(--scanner-bg-on-color)]',
            selected && handleOn,
          )}
        />
        {/* Focus ring — 1px border-interactive around the track */}
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute hidden rounded-[var(--scanner-radius-2xl)]',
            'inset-x-[calc(var(--scanner-toggle-focus-inset-x)*-1)] inset-y-[calc(var(--scanner-toggle-focus-inset-y)*-1)]',
            'shadow-[inset_0_0_0_1px_var(--scanner-border-interactive)]',
            'group-focus-visible:block group-data-[state=focused]:block',
          )}
        />
      </button>
    );

    if (!hasValue) return toggle;

    /* A wrapping <label> names the switch and makes the value text clickable */
    return (
      <label
        className={cn(
          'inline-flex items-center gap-[var(--scanner-spacing-3)] align-middle',
          'font-[family-name:var(--scanner-font-sans)] font-[number:var(--scanner-font-regular)]',
          'text-[length:var(--scanner-text-scanner-md)] leading-[var(--scanner-leading-lg)]',
          disabled
            ? 'cursor-not-allowed text-[color:var(--scanner-text-disabled)]'
            : 'cursor-pointer text-[color:var(--scanner-text-primary)]',
          className,
        )}
      >
        {toggle}
        <span className="min-w-0 break-words">{children}</span>
      </label>
    );
  },
);

Toggle.displayName = 'Toggle';
