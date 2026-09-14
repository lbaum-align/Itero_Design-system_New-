import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { BreadcrumbLink } from '../_breadcrumb-link/BreadcrumbLink';
import type { BreadcrumbsProps } from './breadcrumbs.types';

/**
 * Scanner Breadcrumbs — a navigational breadcrumb trail.
 *
 * Renders an ordered list of BreadcrumbLink items inside a
 * `<nav aria-label="Breadcrumb">` landmark. The last item is
 * automatically marked as the current page.
 *
 * @example
 * <Breadcrumbs
 *   items={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Products', href: '/products' },
 *     { label: 'Widget' },
 *   ]}
 * />
 */
export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(
  ({ items, className, ...rest }, ref) => {
    if (items.length === 0) return null;

    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={cn(className)}
        {...rest}
      >
        <ol
          className={cn(
            'flex flex-wrap items-center',
            'gap-[var(--scanner-spacing-3)]',
            'm-0 p-0',
            'list-none',
          )}
        >
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={`${item.label}-${index}`} className="inline-flex items-center">
                <BreadcrumbLink
                  href={item.href}
                  isCurrent={isLast}
                  showSeparator={!isLast}
                >
                  {item.label}
                </BreadcrumbLink>
              </li>
            );
          })}
        </ol>
      </nav>
    );
  },
);

Breadcrumbs.displayName = 'Breadcrumbs';
