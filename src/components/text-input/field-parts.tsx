import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { IconTriggerTooltip } from '../icon-trigger-tooltip';
import { secondaryText, typeXs } from './field-styles';

/*
 * Shared anatomy for TextInput, TextArea and PasswordInput (private — not in the package barrel).
 * Figma frames: "Label + Counter" / "Label + link" → FieldHeader, "Helper" / "Error" → FieldMessage.
 */

export interface FieldHeaderProps {
  /** id of the native control the label points to */
  htmlFor: string;
  /** Figma "Label text value" — omitted → "Show label: False" */
  label?: ReactNode;
  /** Figma "Required" */
  required?: boolean;
  /** Figma "Show explainer" — tooltip content */
  explainer?: string;
  disabled?: boolean;
  /** Label typography (size-dependent) */
  labelClassName: string;
  /** Right-aligned slot: counter (TextInput / TextArea) or link (PasswordInput) */
  trailing?: ReactNode;
}

/** Label row: Label (+ required asterisk + explainer) and an optional trailing counter/link. */
export function FieldHeader({
  htmlFor,
  label,
  required = false,
  explainer,
  disabled = false,
  labelClassName,
  trailing,
}: FieldHeaderProps) {
  const hasLabel = label !== undefined && label !== null && label !== '';
  if (!hasLabel && !trailing) return null;

  return (
    <div className="flex w-full items-start justify-end" data-part="header">
      {hasLabel && (
        <div className="flex min-w-px flex-1 items-start gap-[var(--scanner-spacing-2)] pb-[var(--scanner-spacing-3)]">
          <label htmlFor={htmlFor} className={cn('min-w-0 break-words', labelClassName, secondaryText(disabled))}>
            {label}
          </label>
          {required && (
            <span aria-hidden="true" className={cn('shrink-0', typeXs, 'text-[color:var(--scanner-text-error)]')}>
              *
            </span>
          )}
          {explainer && <IconTriggerTooltip content={explainer} position="top" alignment="start" className="shrink-0" />}
        </div>
      )}
      {trailing && (
        <div className="flex shrink-0 items-center justify-center pb-[var(--scanner-spacing-3)] pl-[var(--scanner-spacing-3)]">
          {trailing}
        </div>
      )}
    </div>
  );
}

/** Figma "Counter" text (12/16, text-secondary; text-disabled when disabled). */
export function FieldCounter({ children, disabled = false }: { children: ReactNode; disabled?: boolean }) {
  return (
    <span
      aria-live="polite"
      className={cn('whitespace-nowrap text-right', typeXs, secondaryText(disabled))}
      data-part="counter"
    >
      {children}
    </span>
  );
}

export interface FieldMessageProps {
  id: string;
  tone: 'helper' | 'error';
  disabled?: boolean;
  /** Helper/error typography (size-dependent) */
  className: string;
  children: ReactNode;
}

/** Helper text or error message below the field (8px top padding). */
export function FieldMessage({ id, tone, disabled = false, className, children }: FieldMessageProps) {
  return (
    <div
      id={id}
      role={tone === 'error' ? 'alert' : undefined}
      data-part={tone}
      className="flex w-full items-start pt-[var(--scanner-spacing-3)]"
    >
      <p
        className={cn(
          'm-0 min-w-px flex-1 break-words',
          className,
          tone === 'error' ? 'text-[color:var(--scanner-text-error)]' : secondaryText(disabled),
        )}
      >
        {children}
      </p>
    </div>
  );
}
