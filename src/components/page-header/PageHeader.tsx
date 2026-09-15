import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import type { PageHeaderProps } from './page-header.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → Page header (node 34197:1887)
 * Show breadcrumbs (True, False) × Show tabs (False, True) = 4 variants · Show subtitle · Show actions · Title · Subtitle.
 *
 * - Vertical stack, full width, 1px dashed (4/4) border-subtle bottom stroke drawn inside the box.
 * - Padding top: 48px (no breadcrumbs) / 24px (breadcrumbs). Padding bottom: 32px (no tabs) / 0 (tabs).
 * - Gap: 24px (no breadcrumbs) / 32px (breadcrumbs).
 * - "Title + actions" row: 24px gap, top-aligned. Title: Display regular/$tp-display-01-regular (36/44, text-primary).
 *   Subtitle: 12px below, font-size/line-height "small" (14/20), text-secondary. Actions: 8px gap, centred.
 */

/** Dashed bottom stroke — a repeating gradient reproduces Figma's exact 4px dash / 4px gap (CSS `dashed` can't). */
const divider = cn(
  'isolate after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:-z-10',
  'after:h-[var(--scanner-page-header-divider-width)]',
  'after:bg-[repeating-linear-gradient(to_right,var(--scanner-border-subtle)_0_var(--scanner-page-header-divider-dash),transparent_var(--scanner-page-header-divider-dash)_calc(var(--scanner-page-header-divider-dash)+var(--scanner-page-header-divider-gap)))]',
);

/**
 * Scanner PageHeader — the top of a page: optional breadcrumbs, the page title with an optional
 * subtitle and actions, and optional tabs sitting on the dashed divider.
 *
 * Figma props → React: Show breadcrumbs → `breadcrumbs`, Show tabs → `tabs`, Show subtitle / Subtitle → `subtitle`,
 * Show actions → `actions`, Title → `title`.
 *
 * @example
 * <PageHeader
 *   title="Patients"
 *   subtitle="All patients scanned in this clinic"
 *   breadcrumbs={<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Patients', href: '/patients' }]} />}
 *   actions={<Button size="medium">New patient</Button>}
 *   tabs={
 *     <TabGroup aria-label="Patient lists">
 *       <TabItem>Active</TabItem>
 *       <TabItem>Archived</TabItem>
 *     </TabGroup>
 *   }
 * />
 */
export const PageHeader = forwardRef<HTMLElement, PageHeaderProps>(
  ({ title, subtitle, breadcrumbs, tabs, actions, className, ...rest }, ref) => {
    const hasBreadcrumbs = breadcrumbs != null && breadcrumbs !== false;
    const hasTabs = tabs != null && tabs !== false;
    const hasSubtitle = subtitle != null && subtitle !== false && subtitle !== '';
    const hasActions = actions != null && actions !== false;

    return (
      <header
        ref={ref}
        data-breadcrumbs={hasBreadcrumbs || undefined}
        data-tabs={hasTabs || undefined}
        className={cn(
          'relative flex w-full flex-col items-start',
          divider,
          hasBreadcrumbs
            ? 'gap-[var(--scanner-spacing-8)] pt-[var(--scanner-spacing-7)]' // 32 gap / 24 top
            : 'gap-[var(--scanner-spacing-7)] pt-[var(--scanner-spacing-10)]', // 24 gap / 48 top
          hasTabs ? 'pb-0' : 'pb-[var(--scanner-spacing-8)]', // 32 bottom
          className,
        )}
        {...rest}
      >
        {hasBreadcrumbs && <div className="flex max-w-full items-center">{breadcrumbs}</div>}

        <div className="flex w-full items-start gap-[var(--scanner-spacing-7)]">
          <div className="flex min-w-px flex-1 flex-col items-start justify-center gap-[var(--scanner-spacing-4)]">
            <h1 className="scanner-text-display-regular-01 m-0 w-full break-words text-[color:var(--scanner-text-primary)]">
              {title}
            </h1>
            {hasSubtitle && (
              <p
                className={cn(
                  'm-0 break-words font-[family-name:var(--scanner-font-sans)] font-[number:var(--scanner-font-regular)]',
                  'text-[length:var(--scanner-text-sm)] leading-[var(--scanner-leading-sm)]',
                  'text-[color:var(--scanner-text-secondary)]',
                )}
              >
                {subtitle}
              </p>
            )}
          </div>

          {hasActions && (
            <div data-part="actions" className="flex shrink-0 items-center gap-[var(--scanner-spacing-3)]">
              {actions}
            </div>
          )}
        </div>

        {hasTabs && <div className="flex w-full flex-col items-start">{tabs}</div>}
      </header>
    );
  },
);

PageHeader.displayName = 'PageHeader';
