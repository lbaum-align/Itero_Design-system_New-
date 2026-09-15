import { cn } from '../../utils/cn';
import { IconTriggerTooltip } from '../icon-trigger-tooltip';

/*
 * Shared label row of "02 Vertical checkbox group" and "03 Horizontal checkbox group":
 * Label ($tp-label-01 16/24, text-secondary) · Explainer (16px icon trigger tooltip,
 * placement Top) · Required "*" (12/16, text-error). Top-aligned, 4px gap, 8px bottom padding.
 * Internal — not exported from the package barrel.
 */

export interface CheckboxGroupLabelProps {
  id: string;
  label: string;
  tooltipContent?: string;
  required?: boolean;
  disabled?: boolean;
  skeleton?: boolean;
}

export const CheckboxGroupLabel = ({
  id,
  label,
  tooltipContent,
  required,
  disabled,
  skeleton,
}: CheckboxGroupLabelProps) => (
  <div className="flex items-start gap-[var(--scanner-spacing-2)] pb-[var(--scanner-spacing-3)]">
    <span
      id={id}
      className={cn(
        'font-[family-name:var(--scanner-font-sans)] font-[number:var(--scanner-font-regular)]',
        'text-[length:var(--scanner-text-base)] leading-[var(--scanner-leading-md)]',
        skeleton
          ? 'animate-pulse bg-[var(--scanner-bg-highlight-gray)] text-transparent'
          : disabled
            ? 'text-[color:var(--scanner-text-disabled)]'
            : 'text-[color:var(--scanner-text-secondary)]',
      )}
    >
      {label}
      {required && <span className="sr-only"> (required)</span>}
    </span>
    {tooltipContent && !skeleton && (
      <span className="flex flex-col items-center justify-end" data-explainer="">
        <IconTriggerTooltip content={tooltipContent} position="top" alignment="start" />
      </span>
    )}
    {required && !skeleton && (
      <span
        aria-hidden="true"
        className={cn(
          'font-[family-name:var(--scanner-font-sans)] font-[number:var(--scanner-font-regular)]',
          'text-[length:var(--scanner-text-xs)] leading-[var(--scanner-leading-xs)]',
          'text-[color:var(--scanner-text-error)]',
        )}
      >
        *
      </span>
    )}
  </div>
);
