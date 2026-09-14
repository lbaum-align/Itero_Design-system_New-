import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../../icons';
import { Spinner } from '../spinner';
import type { SplitButtonProps } from './split-button.types';
import type { ButtonEmphasis, ButtonSize } from '../button';

/* ------------------------------------------------------------------ */
/*  Size config                                                       */
/* ------------------------------------------------------------------ */

const sizeConfig: Record<
  ButtonSize,
  {
    height: string;
    mainPx: string;
    mainPy: string;
    gap: string;
    dropdownPad: string;
    radiusLeft: string;
    radiusRight: string;
    iconSize: 20 | 24;
    spinnerSize: 'mini' | 'small';
    minW: string;
  }
> = {
  large: {
    height: 'h-[60px]',
    mainPx: 'px-[var(--scanner-spacing-5)]',         // 16px
    mainPy: 'py-[var(--scanner-spacing-4)]',          // 12px
    gap: 'gap-[var(--scanner-spacing-3)]',            // 8px
    dropdownPad: 'p-[var(--scanner-spacing-4)]',      // 12px
    radiusLeft: 'rounded-l-[var(--scanner-radius-md)]',
    radiusRight: 'rounded-r-[var(--scanner-radius-md)]',
    iconSize: 20,
    spinnerSize: 'mini',
    minW: 'min-w-[72px]',
  },
  medium: {
    height: 'h-12',                                    // 48px
    mainPx: 'px-[var(--scanner-spacing-4)]',           // 12px
    mainPy: 'py-[var(--scanner-spacing-3)]',           // 8px
    gap: 'gap-[var(--scanner-spacing-3)]',             // 8px
    dropdownPad: 'p-[var(--scanner-spacing-3)]',       // 8px
    radiusLeft: 'rounded-l-[var(--scanner-radius-md)]',
    radiusRight: 'rounded-r-[var(--scanner-radius-md)]',
    iconSize: 20,
    spinnerSize: 'mini',
    minW: 'min-w-[72px]',
  },
  small: {
    height: 'h-9',                                     // 36px
    mainPx: 'px-[var(--scanner-spacing-3)]',           // 8px
    mainPy: 'py-[var(--scanner-spacing-2)]',           // 4px
    gap: 'gap-[var(--scanner-spacing-2)]',             // 4px
    dropdownPad: 'p-[var(--scanner-spacing-2)]',       // 4px
    radiusLeft: 'rounded-l-[var(--scanner-radius-sm)]',
    radiusRight: 'rounded-r-[var(--scanner-radius-sm)]',
    iconSize: 20,
    spinnerSize: 'mini',
    minW: 'min-w-[72px]',
  },
};

/* ------------------------------------------------------------------ */
/*  Colour matrix — Emphasis                                          */
/* ------------------------------------------------------------------ */

type ColourSet = {
  bg: string;
  bgHover: string;
  bgActive: string;
  text: string;
  border?: string;
  borderHover?: string;
};

const colours: Record<ButtonEmphasis, ColourSet> = {
  primary: {
    bg: 'bg-[var(--scanner-bg-brand)]',
    bgHover: 'hover:bg-[var(--scanner-bg-brand-hover)]',
    bgActive: 'active:bg-[var(--scanner-bg-brand-active)]',
    text: 'text-[var(--scanner-text-on-color)]',
  },
  secondary: {
    bg: '',
    bgHover: 'hover:bg-[var(--scanner-bg-hover)]',
    bgActive: 'active:bg-[var(--scanner-bg-active)]',
    text: 'text-[var(--scanner-text-primary)]',
    border: 'border border-[var(--scanner-border-subtle)]',
    borderHover: 'hover:border-[var(--scanner-border-hover)]',
  },
  ghost: {
    bg: '',
    bgHover: 'hover:bg-[var(--scanner-bg-hover)]',
    bgActive: 'active:bg-[var(--scanner-bg-active)]',
    text: 'text-[var(--scanner-text-primary)]',
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

/**
 * Scanner SplitButton — a button with a secondary dropdown trigger
 * separated by a divider.
 *
 * The left segment triggers the main action; the right segment
 * opens a dropdown (chevron flips based on `opened`).
 *
 * @example
 * <SplitButton onMainClick={handleSave} onDropdownClick={toggleMenu}>
 *   Save
 * </SplitButton>
 * <SplitButton emphasis="secondary" size="small" opened>
 *   Options
 * </SplitButton>
 */
export const SplitButton = forwardRef<HTMLDivElement, SplitButtonProps>(
  (
    {
      children,
      variant = 'brand',
      emphasis = 'primary',
      size = 'large',
      opened = false,
      onMainClick,
      onDropdownClick,
      disabled = false,
      loading = false,
      skeleton = false,
      className,
      ...rest
    },
    ref,
  ) => {
    const cfg = sizeConfig[size];
    const isDisabled = disabled || loading;

    /* ── Skeleton ── */
    if (skeleton) {
      return (
        <div
          ref={ref}
          className={cn(
            'inline-flex gap-px',
            cfg.height,
            className,
          )}
          aria-hidden="true"
          {...rest}
        >
          <div
            className={cn(
              'animate-pulse',
              cfg.radiusLeft,
              cfg.height,
              cfg.mainPx,
              cfg.mainPy,
              cfg.minW,
              'bg-[var(--scanner-bg-disabled)]',
            )}
          />
          <div
            className={cn(
              'animate-pulse',
              cfg.radiusRight,
              cfg.height,
              cfg.dropdownPad,
              'bg-[var(--scanner-bg-disabled)]',
            )}
          />
        </div>
      );
    }

    const colour = colours[emphasis];

    const sharedButtonClasses = cn(
      'inline-flex items-center justify-center',
      'font-[family-name:var(--scanner-font-sans)]',
      'text-[length:var(--scanner-text-md)] font-normal leading-[var(--scanner-leading-lg)]',
      'select-none whitespace-nowrap transition-colors duration-150',
      'focus-visible:outline-2 focus-visible:outline-offset-2',
      'focus-visible:outline-[var(--scanner-focus-ring)]',
    );

    const colourClasses = isDisabled
      ? [
          'bg-[var(--scanner-bg-disabled)]',
          'text-[var(--scanner-text-disabled)]',
          'cursor-not-allowed',
          emphasis === 'secondary' && 'border border-[var(--scanner-border-disabled)]',
        ]
      : [
          colour.bg,
          colour.bgHover,
          colour.bgActive,
          colour.text,
          colour.border,
          colour.borderHover,
          'cursor-pointer',
        ];

    return (
      <div
        ref={ref}
        role="group"
        aria-label="Split button"
        className={cn(
          'inline-flex items-stretch gap-px',
          cfg.height,
          className,
        )}
        {...rest}
      >
        {/* ── Main action button ── */}
        <button
          type="button"
          disabled={isDisabled}
          onClick={onMainClick}
          className={cn(
            sharedButtonClasses,
            'relative',
            cfg.height,
            cfg.mainPx,
            cfg.mainPy,
            cfg.gap,
            cfg.minW,
            cfg.radiusLeft,
            'rounded-r-none',
            colourClasses,
          )}
        >
          {/* Loading overlay */}
          {loading && (
            <span className="absolute inset-0 flex items-center justify-center">
              <Spinner
                size={cfg.spinnerSize}
                onColor={emphasis === 'primary'}
              />
            </span>
          )}

          <span
            className={cn(
              'inline-flex items-center justify-center',
              cfg.gap,
              loading && 'invisible',
            )}
          >
            <span className="min-w-px flex-1 text-center">{children}</span>
          </span>
        </button>

        {/* ── Dropdown trigger ── */}
        <button
          type="button"
          disabled={isDisabled}
          onClick={onDropdownClick}
          aria-expanded={opened}
          aria-haspopup="true"
          aria-label="Toggle dropdown"
          className={cn(
            sharedButtonClasses,
            cfg.height,
            cfg.dropdownPad,
            cfg.radiusRight,
            'rounded-l-none',
            colourClasses,
          )}
        >
          <Icon
            name={opened ? 'chevron-up' : 'chevron-down'}
            size={cfg.iconSize}
            className="shrink-0"
          />
        </button>
      </div>
    );
  },
);

SplitButton.displayName = 'SplitButton';
