import { cn } from '../../utils/cn';

/**
 * Link styles shared with the Breadcrumbs overflow ("…") trigger.
 * @internal
 */
export const breadcrumbLinkInteractiveClasses = cn(
  'scanner-text-body-02 inline-flex items-center whitespace-nowrap no-underline outline-none',
  'text-[color:var(--scanner-text-secondary)] cursor-pointer',
  '[text-decoration-skip-ink:none] [text-underline-position:from-font]',
  'hover:underline data-[state=hovered]:underline',
  'focus-visible:shadow-[0_0_0_var(--scanner-breadcrumb-focus-width)_var(--scanner-border-focus)]',
  'data-[state=focused]:shadow-[0_0_0_var(--scanner-breadcrumb-focus-width)_var(--scanner-border-focus)]',
);

export const breadcrumbLinkDisabledClasses = cn(
  'scanner-text-body-02 inline-flex items-center whitespace-nowrap no-underline',
  'text-[color:var(--scanner-text-disabled)] cursor-not-allowed',
);
