import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../../icons';
import { Spinner } from '../spinner';
import type { ButtonProps, ButtonSize, ButtonType, ButtonEmphasis } from './button.types';

/* ------------------------------------------------------------------ */
/*  Size config                                                       */
/* ------------------------------------------------------------------ */

const sizeConfig: Record<
  ButtonSize,
  {
    height: string;
    px: string;
    py: string;
    gap: string;
    radius: string;
    iconSize: 20 | 24;
    spinnerSize: 'mini' | 'small';
    minW: string;
    iconOnlyPad: string;
    /** Secondary needs slightly different min-width */
    minWSecondary: string;
  }
> = {
  large: {
    height: 'h-[60px]',
    px: 'px-[var(--scanner-spacing-5)]',        // 16px
    py: 'py-4',                                  // 16px
    gap: 'gap-[var(--scanner-spacing-3)]',       // 8px
    radius: 'rounded-[var(--scanner-radius-md)]', // 8px
    iconSize: 24,
    spinnerSize: 'mini',
    minW: 'min-w-[72px]',
    iconOnlyPad: 'p-[18px]',
    minWSecondary: 'min-w-[100px]',
  },
  medium: {
    height: 'h-12',                              // 48px
    px: 'px-[var(--scanner-spacing-4)]',         // 12px
    py: 'py-[var(--scanner-spacing-3)]',         // 8px
    gap: 'gap-[var(--scanner-spacing-3)]',       // 8px
    radius: 'rounded-[var(--scanner-radius-md)]', // 8px
    iconSize: 24,
    spinnerSize: 'mini',
    minW: 'min-w-[72px]',
    iconOnlyPad: 'p-3',                          // 12px
    minWSecondary: 'min-w-[100px]',
  },
  small: {
    height: 'h-9',                               // 36px
    px: 'px-[var(--scanner-spacing-3)]',         // 8px
    py: 'py-[var(--scanner-spacing-2)]',         // 4px
    gap: 'gap-[var(--scanner-spacing-2)]',       // 4px
    radius: 'rounded-[var(--scanner-radius-sm)]', // 4px
    iconSize: 20,
    spinnerSize: 'mini',
    minW: 'min-w-[72px]',
    iconOnlyPad: 'p-2',                          // 8px
    minWSecondary: 'min-w-[100px]',
  },
};

/* ------------------------------------------------------------------ */
/*  Colour matrix — Type × Emphasis                                   */
/* ------------------------------------------------------------------ */

type ColourSet = {
  bg: string;
  bgHover: string;
  bgActive: string;
  text: string;
  border?: string;
  borderHover?: string;
};

const colours: Record<ButtonType, Record<ButtonEmphasis, ColourSet>> = {
  brand: {
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
      border: 'border-2 border-[var(--scanner-border-subtle)]',
      borderHover: 'hover:border-[var(--scanner-border-hover)]',
    },
    ghost: {
      bg: '',
      bgHover: 'hover:bg-[var(--scanner-bg-hover)]',
      bgActive: 'active:bg-[var(--scanner-bg-active)]',
      text: 'text-[var(--scanner-text-primary)]',
    },
  },
  danger: {
    primary: {
      bg: 'bg-[var(--scanner-bg-destructive)]',
      bgHover: 'hover:bg-[var(--scanner-bg-destructive-hover)]',
      bgActive: 'active:bg-[var(--scanner-bg-destructive-active)]',
      text: 'text-[var(--scanner-text-on-color)]',
    },
    secondary: {
      bg: '',
      bgHover: 'hover:bg-[var(--scanner-bg-hover)]',
      bgActive: 'active:bg-[var(--scanner-bg-active)]',
      text: 'text-[var(--scanner-text-error)]',
      border: 'border-2 border-[var(--scanner-border-subtle)]',
      borderHover: 'hover:border-[var(--scanner-border-hover)]',
    },
    ghost: {
      bg: '',
      bgHover: 'hover:bg-[var(--scanner-bg-hover)]',
      bgActive: 'active:bg-[var(--scanner-bg-active)]',
      text: 'text-[var(--scanner-text-error)]',
    },
  },
  success: {
    primary: {
      bg: 'bg-[var(--scanner-bg-success)]',
      bgHover: 'hover:bg-[var(--scanner-bg-success-hover)]',
      bgActive: 'active:bg-[var(--scanner-bg-success-active)]',
      text: 'text-[var(--scanner-text-on-color)]',
    },
    secondary: {
      bg: '',
      bgHover: 'hover:bg-[var(--scanner-bg-hover)]',
      bgActive: 'active:bg-[var(--scanner-bg-active)]',
      text: 'text-[var(--scanner-text-success)]',
      border: 'border-2 border-[var(--scanner-border-subtle)]',
      borderHover: 'hover:border-[var(--scanner-border-hover)]',
    },
    ghost: {
      bg: '',
      bgHover: 'hover:bg-[var(--scanner-bg-hover)]',
      bgActive: 'active:bg-[var(--scanner-bg-active)]',
      text: 'text-[var(--scanner-text-success)]',
    },
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

/**
 * Scanner Button — the primary action element.
 *
 * Supports 3 types (brand/danger/success), 3 emphasis levels
 * (primary/secondary/ghost), 3 sizes (large/medium/small), and
 * 3 content modes (text-only, text+icon, icon-only).
 *
 * @example
 * <Button>Save</Button>
 * <Button variant="danger" emphasis="secondary">Delete</Button>
 * <Button iconName="add" iconOnly aria-label="Add item" />
 * <Button loading>Saving…</Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'brand',
      emphasis = 'primary',
      size = 'medium',
      iconName,
      iconOnly = false,
      loading = false,
      skeleton = false,
      htmlType = 'button',
      disabled = false,
      children,
      className,
      ...rest
    },
    ref,
  ) => {
    const cfg = sizeConfig[size];

    /* ── Skeleton ── */
    if (skeleton) {
      return (
        <div
          className={cn(
            'inline-flex animate-pulse items-center justify-center',
            cfg.radius,
            iconOnly
              ? `${cfg.iconOnlyPad} size-[${cfg.iconSize === 24 ? '60px' : '36px'}]`
              : `${cfg.height} ${cfg.px} ${cfg.py} ${cfg.minW}`,
            'bg-[var(--scanner-bg-disabled)]',
            className,
          )}
          aria-hidden="true"
        />
      );
    }

    const colour = colours[variant][emphasis];
    const isDisabled = disabled || loading;
    const isIconOnly = iconOnly && !!iconName;
    const showIcon = !!iconName && !isIconOnly;

    return (
      <button
        ref={ref}
        type={htmlType}
        disabled={isDisabled}
        className={cn(
          /* Layout */
          'relative inline-flex items-center justify-center',
          'font-[family-name:var(--scanner-font-sans)]',
          'text-[length:var(--scanner-text-md)] font-normal leading-[var(--scanner-leading-lg)]',
          'select-none whitespace-nowrap transition-colors duration-150',

          /* Size */
          cfg.radius,
          isIconOnly
            ? cfg.iconOnlyPad
            : [
                cfg.height,
                cfg.px,
                cfg.py,
                cfg.gap,
                emphasis === 'secondary' ? cfg.minWSecondary : cfg.minW,
              ],

          /* Colours */
          isDisabled
            ? [
                'bg-[var(--scanner-bg-disabled)]',
                'text-[var(--scanner-text-disabled)]',
                'cursor-not-allowed',
                emphasis === 'secondary' &&
                  'border-2 border-[var(--scanner-border-disabled)]',
              ]
            : [
                colour.bg,
                colour.bgHover,
                colour.bgActive,
                colour.text,
                colour.border,
                colour.borderHover,
                'cursor-pointer',
              ],

          /* Focus ring */
          'focus-visible:outline-2 focus-visible:outline-offset-2',
          'focus-visible:outline-[var(--scanner-focus-ring)]',

          className,
        )}
        {...rest}
      >
        {/* ── Loading overlay ── */}
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <Spinner
              size={cfg.spinnerSize}
              onColor={emphasis === 'primary'}
            />
          </span>
        )}

        {/* ── Content (invisible when loading) ── */}
        <span
          className={cn(
            'inline-flex items-center justify-center',
            !isIconOnly && cfg.gap,
            loading && 'invisible',
          )}
        >
          {/* Leading icon */}
          {(showIcon || isIconOnly) && iconName && (
            <Icon name={iconName} size={cfg.iconSize} className="shrink-0" />
          )}

          {/* Text */}
          {!isIconOnly && (
            <span className="min-w-px flex-1 text-center">{children}</span>
          )}
        </span>
      </button>
    );
  },
);

Button.displayName = 'Button';
