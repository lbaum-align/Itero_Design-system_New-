import { forwardRef } from 'react';
import type { KeyboardEvent } from 'react';
import { cn } from '../../utils/cn';
import { breadcrumbLinkDisabledClasses, breadcrumbLinkInteractiveClasses } from './breadcrumb-link.styles';
import type { BreadcrumbLinkProps } from './breadcrumb-link.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → _Breadcrumb link (node 25889:49863)
 * State (Enabled, Hovered, Focused, Disabled, Skeleton) × Show divider.
 *
 * - Label: Body/$tp-body-02 (18/28), text-secondary; Hovered = underline (Link/$tp-link-02)
 * - Focused: 1px border-focus stroke *outside* the label (box-shadow — no layout shift)
 * - Disabled: text-disabled
 * - Skeleton: 12px background-highlight-gray bar at 90% opacity
 * - Divider: "|" in Body/$tp-body-02, text-tertiary, 8px gap
 */

/**
 * _BreadcrumbLink — one level of a breadcrumb trail. Private: use `Breadcrumbs`.
 *
 * Figma props → React: State → `:hover` / `:focus-visible` (forceable via `data-state`),
 * `disabled`, `skeleton`; Show divider → `showDivider`.
 *
 * @example
 * <BreadcrumbLink href="/patients">Patients</BreadcrumbLink>
 * <BreadcrumbLink isCurrent showDivider={false}>Scan 12</BreadcrumbLink>
 */
export const BreadcrumbLink = forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  (
    {
      children,
      href,
      isCurrent = false,
      disabled = false,
      skeleton = false,
      showDivider,
      showSeparator,
      className,
      onClick,
      onKeyDown,
      ...rest
    },
    ref,
  ) => {
    const divider = showDivider ?? showSeparator ?? true;

    const handleKeyDown = (e: KeyboardEvent<HTMLAnchorElement>) => {
      onKeyDown?.(e);
      /* Figma docs: Enter *or Spacebar* triggers the link (anchors only react to Enter natively). */
      if (!e.defaultPrevented && e.key === ' ') {
        e.preventDefault();
        e.currentTarget.click();
      }
    };

    let label;
    if (skeleton) {
      label = (
        <span
          aria-hidden="true"
          data-skeleton=""
          className="scanner-text-body-02 relative inline-flex min-h-[var(--scanner-leading-lg)] min-w-[var(--scanner-breadcrumb-skeleton-min-width)] items-center whitespace-nowrap opacity-[var(--scanner-breadcrumb-skeleton-opacity)]"
        >
          {/* Invisible label keeps the placeholder as wide as the real link */}
          <span className="invisible">{children}</span>
          <span
            className={cn(
              'absolute inset-x-0 top-1/2 -translate-y-1/2 animate-pulse',
              'h-[var(--scanner-breadcrumb-skeleton-height)]',
              'bg-[var(--scanner-bg-highlight-gray)]',
            )}
          />
        </span>
      );
    } else if (isCurrent) {
      label = (
        <span
          aria-current="page"
          className="scanner-text-body-02 whitespace-nowrap text-[color:var(--scanner-text-primary)]"
        >
          {children}
        </span>
      );
    } else {
      label = (
        <a
          ref={ref}
          href={disabled ? undefined : href}
          role={disabled ? 'link' : undefined}
          aria-disabled={disabled || undefined}
          tabIndex={disabled ? -1 : undefined}
          onClick={disabled ? (e) => e.preventDefault() : onClick}
          onKeyDown={disabled ? undefined : handleKeyDown}
          className={disabled ? breadcrumbLinkDisabledClasses : breadcrumbLinkInteractiveClasses}
          {...rest}
        >
          {children}
        </a>
      );
    }

    return (
      <span className={cn('inline-flex items-center gap-[var(--scanner-spacing-3)]', className)}>
        {label}
        {divider && (
          <span
            aria-hidden="true"
            data-divider=""
            className="scanner-text-body-02 select-none text-[color:var(--scanner-text-tertiary)]"
          >
            |
          </span>
        )}
      </span>
    );
  },
);

BreadcrumbLink.displayName = 'BreadcrumbLink';
