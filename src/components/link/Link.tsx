import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import type { LinkProps, LinkType } from './link.types';

const typeStyles: Record<LinkType, { base: string; hover: string; focusRing: string; disabled: string }> = {
  primary: {
    base: 'text-[var(--scanner-text-link)]',
    hover: 'hover:underline hover:text-[var(--scanner-text-link)]',
    focusRing: 'focus-visible:outline-[var(--scanner-focus-ring)]',
    disabled: 'text-[var(--scanner-text-tertiary)]',
  },
  secondary: {
    base: 'text-[var(--scanner-text-primary)]',
    hover: 'hover:underline hover:text-[var(--scanner-text-primary)]',
    focusRing: 'focus-visible:outline-[var(--scanner-focus-ring)]',
    disabled: 'text-[var(--scanner-text-tertiary)]',
  },
  inversed: {
    base: 'text-[var(--scanner-text-inverse-secondary)]',
    hover: 'hover:underline hover:text-[var(--scanner-text-inverse-secondary)]',
    focusRing: 'focus-visible:outline-[var(--scanner-blue-300)]',
    disabled: 'text-[var(--scanner-white-alpha-25)]',
  },
  'on-color': {
    base: 'text-[var(--scanner-text-on-color-secondary)]',
    hover: 'hover:underline hover:text-[var(--scanner-text-on-color)]',
    focusRing: 'focus-visible:outline-white',
    disabled: 'text-[var(--scanner-white-alpha-25)]',
  },
};

const ExternalIcon = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className="shrink-0"
  >
    <path
      d="M11 3h6v6m0-6L9 11"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17 11v5a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Scanner Link — an anchor element with semantic color types.
 *
 * @example
 * <Link href="/home">Home</Link>
 * <Link href="https://example.com" external type="primary">Docs</Link>
 * <Link type="secondary" size="small">Settings</Link>
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      type = 'primary',
      size = 'medium',
      external = false,
      children,
      className,
      href,
      'aria-disabled': ariaDisabled,
      ...rest
    },
    ref
  ) => {
    const isDisabled = ariaDisabled === true || ariaDisabled === 'true';
    const styles = typeStyles[type];
    const iconSize = size === 'small' ? 16 : 20;

    return (
      <a
        ref={ref}
        href={isDisabled ? undefined : href}
        aria-disabled={isDisabled || undefined}
        tabIndex={isDisabled ? -1 : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        target={external ? '_blank' : undefined}
        className={cn(
          'inline-flex items-center gap-1 font-[family-name:var(--scanner-font-sans)] no-underline',
          'transition-colors duration-150',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:rounded-[var(--scanner-radius-sm)]',
          size === 'small'
            ? 'text-[length:var(--scanner-text-xs)] leading-[var(--scanner-leading-xs)]'
            : 'text-[length:var(--scanner-text-sm)] leading-[var(--scanner-leading-sm)]',
          'font-[var(--scanner-font-regular)]',
          isDisabled
            ? [styles.disabled, 'pointer-events-none cursor-not-allowed']
            : [styles.base, styles.hover, styles.focusRing, 'cursor-pointer'],
          className
        )}
        {...rest}
      >
        <span>{children}</span>
        {external && <ExternalIcon size={iconSize} />}
      </a>
    );
  }
);

Link.displayName = 'Link';
