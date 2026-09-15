import { forwardRef } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../../icons';
import type { IconSize } from '../../icons';
import type { LinkProps, LinkSize, LinkType } from './link.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → Link (node 36407:17744)
 * Type (Primary, Secondary, Inversed, On color) × State (Enabled, Hovered, Focused, Disabled) × Size (Medium, Small) = 32 variants.
 *
 * Both sizes use Body/$tp-body-02 (18/28); hover adds an underline (Link/$tp-link-02) without changing colour.
 * Focus is a 1px stroke, radius 4, extending 2px left/right of the content.
 */

type Colours = { text: string; icon: string; ring: string; disabledText: string; disabledIcon: string };

const colours: Record<LinkType, Colours> = {
  primary: {
    text: 'text-[color:var(--scanner-text-link)]',
    icon: 'text-[color:var(--scanner-icon-link)]',
    ring: 'shadow-[inset_0_0_0_1px_var(--scanner-border-focus)]',
    disabledText: 'text-[color:var(--scanner-text-disabled)]',
    disabledIcon: 'text-[color:var(--scanner-icon-disabled)]',
  },
  secondary: {
    text: 'text-[color:var(--scanner-text-primary)]',
    icon: 'text-[color:var(--scanner-icon-primary)]',
    ring: 'shadow-[inset_0_0_0_1px_var(--scanner-border-focus)]',
    disabledText: 'text-[color:var(--scanner-text-disabled)]',
    disabledIcon: 'text-[color:var(--scanner-icon-disabled)]',
  },
  inversed: {
    text: 'text-[color:var(--scanner-text-inverse-secondary)]',
    icon: 'text-[color:var(--scanner-icon-inverse-secondary)]',
    ring: 'shadow-[inset_0_0_0_1px_var(--scanner-border-inverse-focus)]',
    disabledText: 'text-[color:var(--scanner-text-inverse-disabled)]',
    disabledIcon: 'text-[color:var(--scanner-icon-inverse-disabled)]',
  },
  'on-color': {
    text: 'text-[color:var(--scanner-text-on-color-secondary)]',
    icon: 'text-[color:var(--scanner-icon-on-color-secondary)]',
    ring: 'shadow-[inset_0_0_0_1px_var(--scanner-border-on-color-focus)]',
    disabledText: 'text-[color:var(--scanner-text-on-color-disabled)]',
    disabledIcon: 'text-[color:var(--scanner-icon-on-color-disabled)]',
  },
};

const sizeConfig: Record<LinkSize, { gap: string; icon: IconSize }> = {
  medium: { gap: 'gap-[var(--scanner-spacing-3)]', icon: 20 }, // gap 8, icon 20
  small: { gap: 'gap-[var(--scanner-spacing-2)]', icon: 16 }, // gap 4, icon 16
};

/**
 * Scanner Link — navigates to another page, section or external resource. Use `Button` for actions.
 *
 * Figma props → React: Type → `type`, Size → `size`, External → `external`, Text value → `children`,
 * State → `:hover` / `:focus-visible` (forceable via `data-state`), `disabled`.
 * Keyboard: Tab to focus, Enter or Space to open.
 *
 * @example
 * <Link href="/patients">Patients</Link>
 * <Link href="https://example.com" external>Documentation</Link>
 * <Link type="inversed" href="#">Learn more</Link>
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      type = 'primary',
      size = 'medium',
      external = false,
      disabled = false,
      children,
      className,
      href,
      target,
      rel,
      tabIndex,
      onClick,
      onKeyDown,
      'aria-disabled': ariaDisabled,
      ...rest
    },
    ref,
  ) => {
    const isDisabled = disabled || ariaDisabled === true || ariaDisabled === 'true';
    const c = colours[type];
    const cfg = sizeConfig[size];

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
      if (isDisabled) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
    };

    /* An <a> without href has no link role and isn't focusable — restore both for click-only links. */
    const hasHref = href !== undefined;

    /* Figma keyboard spec: Enter/Space open the link (native anchors only react to Enter, and only with href). */
    const handleKeyDown = (event: KeyboardEvent<HTMLAnchorElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || isDisabled) return;
      if (event.key === ' ' || (event.key === 'Enter' && !hasHref)) {
        event.preventDefault();
        event.currentTarget.click();
      }
    };

    return (
      <a
        ref={ref}
        href={isDisabled ? undefined : href}
        role={isDisabled || !hasHref ? 'link' : undefined}
        aria-disabled={isDisabled || undefined}
        tabIndex={isDisabled ? -1 : (tabIndex ?? (hasHref ? undefined : 0))}
        target={external ? (target ?? '_blank') : target}
        rel={external ? (rel ?? 'noopener noreferrer') : rel}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          'group relative inline-flex items-center align-middle no-underline outline-none',
          'font-[family-name:var(--scanner-font-sans)] font-[number:var(--scanner-font-regular)]',
          'text-[length:var(--scanner-text-scanner-md)] leading-[var(--scanner-leading-lg)]',
          cfg.gap,
          isDisabled ? cn(c.disabledText, 'cursor-not-allowed') : cn(c.text, 'cursor-pointer'),
          className,
        )}
        {...rest}
      >
        <span className={cn(!isDisabled && 'group-hover:underline group-data-[state=hovered]:underline')}>
          {children}
        </span>
        {external && (
          <>
            {/* Figma "Launch" */}
            <Icon
              name="launch"
              size={cfg.icon}
              data-part="external-icon"
              className={isDisabled ? c.disabledIcon : c.icon}
            />
            <span className="sr-only">(opens in a new tab)</span>
          </>
        )}

        {/* Focus ring — 1px stroke, radius 4, 2px outside the content horizontally */}
        {!isDisabled && (
          <span
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute inset-y-0 hidden rounded-[var(--scanner-radius-sm)]',
              'inset-x-[calc(var(--scanner-spacing-1)*-1)]',
              c.ring,
              'group-focus-visible:block group-data-[state=focused]:block',
            )}
          />
        )}
      </a>
    );
  },
);

Link.displayName = 'Link';
