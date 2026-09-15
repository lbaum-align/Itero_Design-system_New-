import { forwardRef, useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import { BreadcrumbLink } from '../_breadcrumb-link/BreadcrumbLink';
import { breadcrumbLinkInteractiveClasses } from '../_breadcrumb-link/breadcrumb-link.styles';
import type { BreadcrumbItem, BreadcrumbsProps } from './breadcrumbs.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → Breadcrumbs (node 21114:1171)
 * Boolean props: Show current page, Show overflow.
 *
 * - Row of `_Breadcrumb link` instances, 8px gap; every link shows the "|" divider except the last link.
 * - Show current page: the final item is plain text (text-primary), placed after the last link
 *   with no divider in between (as in the component and the page's Demo).
 * - Show overflow: the Figma property has no layers bound to it; the docs ask to collapse earlier
 *   levels behind an ellipsis — implemented as a "…" trigger that expands the trail.
 */

type Entry = { kind: 'item'; item: BreadcrumbItem; index: number } | { kind: 'overflow' };

/**
 * Scanner Breadcrumbs — shows the path from the top level to the current location.
 * Place top-left, under the header and above the page title.
 *
 * @example
 * <Breadcrumbs items={[{ label: 'Patients', href: '/patients' }, { label: 'Jane Doe', href: '/patients/1' }]} />
 * <Breadcrumbs items={[{ label: 'Patients', href: '/patients' }, { label: 'Scan 12' }]} />  // current page
 */
export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(
  (
    {
      items,
      showCurrentPage,
      showOverflow = false,
      maxVisibleItems = 4,
      skeleton = false,
      className,
      'aria-label': ariaLabel = 'Breadcrumb',
      ...rest
    },
    ref,
  ) => {
    const [expanded, setExpanded] = useState(false);
    const pendingFocus = useRef<number | null>(null);
    const linkRefs = useRef(new Map<number, HTMLAnchorElement>());

    /* After expanding via keyboard/click, move focus to the first revealed link */
    useEffect(() => {
      if (pendingFocus.current === null) return;
      linkRefs.current.get(pendingFocus.current)?.focus();
      pendingFocus.current = null;
    }, [expanded]);

    if (items.length === 0) return null;

    const last = items[items.length - 1];
    const hasCurrent = !skeleton && (showCurrentPage ?? !last.href);
    const lastLinkIndex = hasCurrent ? items.length - 2 : items.length - 1;

    const keep = Math.max(2, maxVisibleItems);
    const collapse = showOverflow && !expanded && items.length > keep;
    const hiddenStart = 1;
    const hiddenEnd = items.length - (keep - 1); // exclusive

    const entries: Entry[] = collapse
      ? [
          { kind: 'item', item: items[0], index: 0 },
          { kind: 'overflow' },
          ...items.slice(hiddenEnd).map((item, i) => ({ kind: 'item' as const, item, index: hiddenEnd + i })),
        ]
      : items.map((item, index) => ({ kind: 'item' as const, item, index }));

    return (
      <nav ref={ref} aria-label={ariaLabel} className={cn(className)} {...rest}>
        <ol className="m-0 flex list-none flex-wrap items-center gap-[var(--scanner-spacing-3)] p-0">
          {entries.map((entry) => {
            if (entry.kind === 'overflow') {
              return (
                <li key="overflow" className="inline-flex items-center gap-[var(--scanner-spacing-3)]">
                  <button
                    type="button"
                    aria-label={`Show ${hiddenEnd - hiddenStart} more breadcrumbs`}
                    className={cn(breadcrumbLinkInteractiveClasses, 'border-0 bg-transparent p-0')}
                    onClick={() => {
                      pendingFocus.current = hiddenStart;
                      setExpanded(true);
                    }}
                  >
                    …
                  </button>
                  <span
                    aria-hidden="true"
                    data-divider=""
                    className="scanner-text-body-02 select-none text-[color:var(--scanner-text-tertiary)]"
                  >
                    |
                  </span>
                </li>
              );
            }

            const { item, index } = entry;
            const isCurrent = hasCurrent && index === items.length - 1;
            return (
              <li key={`${item.label}-${index}`} className="inline-flex items-center">
                <BreadcrumbLink
                  ref={(el) => {
                    if (el) linkRefs.current.set(index, el);
                    else linkRefs.current.delete(index);
                  }}
                  href={item.href}
                  onClick={item.onClick}
                  disabled={item.disabled}
                  skeleton={skeleton}
                  isCurrent={isCurrent}
                  showDivider={!isCurrent && index < lastLinkIndex}
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
