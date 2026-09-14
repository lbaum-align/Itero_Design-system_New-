import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../../icons';
import type { BreadcrumbLinkProps } from './breadcrumb-link.types';

/** Shared typography classes matching Figma Body/$tp-body-02 breadcrumb style */
const textBase = [
  'font-[family-name:var(--scanner-font-sans)]',
  'text-[length:var(--scanner-text-md)]',
  'leading-[var(--scanner-leading-lg)]',
  'font-[var(--scanner-font-regular)]',
  'whitespace-nowrap',
];

/**
 * _BreadcrumbLink — a single navigation item within a breadcrumb trail.
 *
 * Private sub-component. Not exported from the package barrel.
 * Use within the parent Breadcrumb component.
 *
 * - Non-current items render as `<a>` links.
 * - Current item renders as `<span>` with `aria-current="page"`.
 * - Chevron separator is included after the label by default.
 *
 * @example
 * <BreadcrumbLink href="/home">Home</BreadcrumbLink>
 * <BreadcrumbLink isCurrent showSeparator={false}>Settings</BreadcrumbLink>
 */
export const BreadcrumbLink = forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  (
    {
      children,
      href,
      isCurrent = false,
      disabled = false,
      skeleton = false,
      showSeparator = true,
      className,
      onClick,
      ...rest
    },
    ref,
  ) => {
    const separator = showSeparator ? (
      <Icon
        name="chevron-right"
        size={16}
        className="text-[color:var(--scanner-text-secondary)]"
        aria-hidden="true"
      />
    ) : null;

    /* ---- Skeleton state ---- */
    if (skeleton) {
      return (
        <span
          className={cn(
            'inline-flex items-center gap-[var(--scanner-spacing-3)]',
            className,
          )}
          aria-hidden="true"
        >
          <span
            className={cn(
              'block h-3 w-[91px] rounded-[var(--scanner-radius-sm)]',
              'bg-[var(--scanner-bg-hover)] opacity-90',
            )}
          />
          {separator}
        </span>
      );
    }

    /* ---- Current page — text only, not a link ---- */
    if (isCurrent) {
      return (
        <span
          className={cn(
            'inline-flex items-center gap-[var(--scanner-spacing-3)]',
            className,
          )}
        >
          <span
            aria-current="page"
            className={cn(
              ...textBase,
              'text-[color:var(--scanner-text-primary)]',
            )}
          >
            {children}
          </span>
          {separator}
        </span>
      );
    }

    /* ---- Regular link ---- */
    return (
      <span
        className={cn(
          'inline-flex items-center gap-[var(--scanner-spacing-3)]',
          className,
        )}
      >
        <a
          ref={ref}
          href={disabled ? undefined : href}
          onClick={disabled ? undefined : onClick}
          aria-disabled={disabled || undefined}
          tabIndex={disabled ? -1 : undefined}
          className={cn(
            // Typography
            ...textBase,
            'no-underline',
            // Transition
            'transition-colors duration-150',
            // Focus ring — tight 1px border matching Figma
            'focus-visible:outline-1 focus-visible:outline-[var(--scanner-border-focus)]',
            'focus-visible:outline-offset-0',
            // States
            disabled
              ? [
                  'text-[color:var(--scanner-text-tertiary)]',
                  'pointer-events-none cursor-not-allowed',
                ]
              : [
                  'text-[color:var(--scanner-text-primary)]',
                  'hover:underline hover:text-[color:var(--scanner-text-primary)]',
                  'cursor-pointer',
                ],
          )}
          {...rest}
        >
          {children}
        </a>
        {separator}
      </span>
    );
  },
);

BreadcrumbLink.displayName = 'BreadcrumbLink';
