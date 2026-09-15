import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../../icons';
import { Spinner } from '../spinner';
import type { ButtonProps, ButtonSize, ButtonType, ButtonEmphasis } from './button.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → 01 Button (node 36403:6395)
 * 3 Types × 3 Emphases × 3 Sizes × 3 Contents × 7 States = 567 variants.
 *
 * Strokes are drawn as inset box-shadows: Figma strokes sit inside the box and
 * don't affect layout, so a CSS border would make bordered buttons 2px wider.
 */

/* ------------------------------------------------------------------ */
/*  Size config                                                       */
/* ------------------------------------------------------------------ */

const sizeConfig: Record<
  ButtonSize,
  { box: string; iconOnly: string; padding: string; gap: string; radius: string; focusRadius: string }
> = {
  large: {
    box: 'min-h-[var(--scanner-button-height-lg)]',
    iconOnly: 'size-[var(--scanner-button-height-lg)]',
    padding: 'px-[var(--scanner-spacing-5)] py-[var(--scanner-spacing-5)]', // 16 / 16
    gap: 'gap-[var(--scanner-spacing-3)]', // 8
    radius: 'rounded-[var(--scanner-radius-md)]', // 8
    focusRadius: 'rounded-[var(--scanner-radius-lg)]', // 12
  },
  medium: {
    box: 'min-h-[var(--scanner-button-height-md)]',
    iconOnly: 'size-[var(--scanner-button-height-md)]',
    padding: 'px-[var(--scanner-spacing-4)] py-[var(--scanner-spacing-3)]', // 12 / 8
    gap: 'gap-[var(--scanner-spacing-3)]', // 8
    radius: 'rounded-[var(--scanner-radius-md)]', // 8
    focusRadius: 'rounded-[var(--scanner-radius-lg)]', // 12
  },
  small: {
    box: 'min-h-[var(--scanner-button-height-sm)]',
    iconOnly: 'size-[var(--scanner-button-height-sm)]',
    padding: 'px-[var(--scanner-spacing-3)] py-[var(--scanner-spacing-2)]', // 8 / 4
    gap: 'gap-[var(--scanner-spacing-2)]', // 4
    radius: 'rounded-[var(--scanner-radius-sm)]', // 4
    focusRadius: 'rounded-[var(--scanner-radius-md)]', // 8
  },
};

/** Figma uses a 24px icon at every size. */
const ICON_SIZE = 24;

/* ------------------------------------------------------------------ */
/*  Colour matrix                                                     */
/* ------------------------------------------------------------------ */

/** Enabled + hovered + pressed surface styles, per emphasis (and per type for primary). */
const primarySurface: Record<ButtonType, string> = {
  brand: cn(
    'bg-[var(--scanner-bg-brand)]',
    'hover:bg-[var(--scanner-bg-brand-hover)] data-[state=hovered]:bg-[var(--scanner-bg-brand-hover)]',
    'active:bg-[var(--scanner-bg-brand-active)] data-[state=pressed]:bg-[var(--scanner-bg-brand-active)]',
  ),
  danger: cn(
    'bg-[var(--scanner-bg-destructive)]',
    'hover:bg-[var(--scanner-bg-destructive-hover)] data-[state=hovered]:bg-[var(--scanner-bg-destructive-hover)]',
    'active:bg-[var(--scanner-bg-destructive-active)] data-[state=pressed]:bg-[var(--scanner-bg-destructive-active)]',
  ),
  success: cn(
    'bg-[var(--scanner-bg-success)]',
    'hover:bg-[var(--scanner-bg-success-hover)] data-[state=hovered]:bg-[var(--scanner-bg-success-hover)]',
    'active:bg-[var(--scanner-bg-success-active)] data-[state=pressed]:bg-[var(--scanner-bg-success-active)]',
  ),
};

const secondarySurface = cn(
  'shadow-[inset_0_0_0_1px_var(--scanner-border-subtle)]',
  'hover:shadow-[inset_0_0_0_1px_var(--scanner-border-subtle-hover)] data-[state=hovered]:shadow-[inset_0_0_0_1px_var(--scanner-border-subtle-hover)]',
  'active:shadow-[inset_0_0_0_1px_var(--scanner-border-subtle-active)] data-[state=pressed]:shadow-[inset_0_0_0_1px_var(--scanner-border-subtle-active)]',
);

const ghostSurface = cn(
  'hover:bg-[var(--scanner-bg-hover)] data-[state=hovered]:bg-[var(--scanner-bg-hover)]',
  'active:bg-[var(--scanner-bg-active)] data-[state=pressed]:bg-[var(--scanner-bg-active)]',
  /* Focused ghost gains a subtle stroke inside the focus ring */
  'focus-visible:shadow-[inset_0_0_0_1px_var(--scanner-border-subtle)] data-[state=focused]:shadow-[inset_0_0_0_1px_var(--scanner-border-subtle)]',
);

/** Surface while disabled or loading — no hover/pressed feedback. */
const inactiveSurface: Record<ButtonEmphasis, string> = {
  primary: 'bg-[var(--scanner-bg-disabled)]',
  secondary: 'shadow-[inset_0_0_0_1px_var(--scanner-border-disabled)]',
  ghost: '',
};

/** Label + icon colours for enabled/hovered/focused/pressed. */
const foreground: Record<ButtonEmphasis, Record<ButtonType, { text: string; icon: string }>> = {
  primary: {
    brand: { text: 'text-[color:var(--scanner-text-on-color)]', icon: 'text-[color:var(--scanner-icon-on-color)]' },
    danger: { text: 'text-[color:var(--scanner-text-on-color)]', icon: 'text-[color:var(--scanner-icon-on-color)]' },
    success: { text: 'text-[color:var(--scanner-text-on-color)]', icon: 'text-[color:var(--scanner-icon-on-color)]' },
  },
  secondary: {
    brand: { text: 'text-[color:var(--scanner-text-primary)]', icon: 'text-[color:var(--scanner-icon-primary)]' },
    danger: { text: 'text-[color:var(--scanner-text-error)]', icon: 'text-[color:var(--scanner-icon-error)]' },
    success: { text: 'text-[color:var(--scanner-text-success)]', icon: 'text-[color:var(--scanner-icon-success)]' },
  },
  ghost: {
    brand: { text: 'text-[color:var(--scanner-text-primary)]', icon: 'text-[color:var(--scanner-icon-primary)]' },
    danger: { text: 'text-[color:var(--scanner-text-error)]', icon: 'text-[color:var(--scanner-icon-error)]' },
    success: { text: 'text-[color:var(--scanner-text-success)]', icon: 'text-[color:var(--scanner-icon-success)]' },
  },
};

const disabledForeground = {
  text: 'text-[color:var(--scanner-text-disabled)]',
  icon: 'text-[color:var(--scanner-icon-disabled)]',
};

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

/**
 * Scanner Button — triggers an action. Use `Link` for navigation.
 *
 * Figma props → React:
 * - Type → `variant`, Emphasis → `emphasis`, Size → `size`
 * - Content → `iconName` (Text + icon) / `iconName` + `iconOnly` (Icon only)
 * - State → `:hover` / `:focus-visible` / `:active` (forceable via `data-state`),
 *   `disabled`, `loading`, `skeleton`
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
      onClick,
      ...rest
    },
    ref,
  ) => {
    const cfg = sizeConfig[size];
    const isIconOnly = iconOnly && !!iconName;
    const shape = isIconOnly
      ? cn(cfg.iconOnly, cfg.radius)
      : cn(cfg.box, cfg.padding, cfg.gap, cfg.radius, 'min-w-[var(--scanner-button-min-width)]');

    const renderContent = (iconClassName?: string) => (
      <>
        {iconName && <Icon name={iconName} size={ICON_SIZE} className={iconClassName} />}
        {!isIconOnly && <span className="min-w-px flex-1 break-words text-center">{children}</span>}
      </>
    );

    /* ── Skeleton ── */
    if (skeleton) {
      return (
        <div
          aria-hidden="true"
          data-skeleton=""
          className={cn(
            'inline-flex animate-pulse items-center justify-center',
            'text-[length:var(--scanner-text-scanner-md)] leading-[var(--scanner-leading-lg)]',
            shape,
            'bg-[var(--scanner-bg-highlight-gray)]',
            className,
          )}
        >
          {/* Invisible content keeps the placeholder the same size as the real button */}
          <span className={cn('invisible inline-flex items-center', !isIconOnly && cfg.gap)}>
            {renderContent()}
          </span>
        </div>
      );
    }

    const inactive = disabled || loading;
    const fg = disabled ? disabledForeground : foreground[emphasis][variant];

    const surface = inactive
      ? inactiveSurface[emphasis]
      : emphasis === 'primary'
        ? primarySurface[variant]
        : emphasis === 'secondary'
          ? secondarySurface
          : ghostSurface;

    return (
      <button
        ref={ref}
        type={htmlType}
        disabled={disabled}
        aria-disabled={inactive || undefined}
        aria-busy={loading || undefined}
        onClick={loading ? undefined : onClick}
        className={cn(
          'group relative inline-flex items-center justify-center align-middle',
          'font-[family-name:var(--scanner-font-sans)] font-[number:var(--scanner-font-regular)]',
          'text-[length:var(--scanner-text-scanner-md)] leading-[var(--scanner-leading-lg)]',
          'select-none outline-none transition-[background-color,box-shadow] duration-150',
          shape,
          surface,
          fg.text,
          disabled ? 'cursor-not-allowed' : loading ? 'cursor-default' : 'cursor-pointer',
          className,
        )}
        {...rest}
      >
        <span
          className={cn(
            'inline-flex min-w-0 flex-1 items-center justify-center',
            !isIconOnly && cfg.gap,
            loading && 'invisible',
          )}
        >
          {renderContent(fg.icon)}
        </span>

        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <Spinner size="mini" />
          </span>
        )}

        {/* Focus ring — 2px, 4px outside the button */}
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute hidden',
            'inset-[calc(var(--scanner-button-focus-offset)*-1)]',
            'border-[length:var(--scanner-button-focus-width)] border-solid border-[color:var(--scanner-border-focus)]',
            cfg.focusRadius,
            'group-focus-visible:block group-data-[state=focused]:block',
          )}
        />
      </button>
    );
  },
);

Button.displayName = 'Button';
