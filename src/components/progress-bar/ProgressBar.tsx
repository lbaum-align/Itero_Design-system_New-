import { forwardRef, useId } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../../icons';
import { Link } from '../link';
import type { ProgressBarProps, ProgressBarStatus } from './progress-bar.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → Progress bar (node 25486:2635)
 * Progress: 0%, 25%, 50%, 75%, 100%, Error — + Show label, Show helper text, Label / Helper / Error text.
 *
 * Label row: Label 02 (18/28) text-secondary, 8px below, 16px gap to the status icon (+ link).
 * Track: 8px, radius 4, border-subtle. Fill: border-interactive / border-success (100%) / border-error (Error, full width).
 * Helper: Label 01 (16/24), 8px above, text-secondary (text-error for the error message).
 */

const fillColor: Record<ProgressBarStatus, string> = {
  default: 'bg-[var(--scanner-border-interactive)]',
  success: 'bg-[var(--scanner-border-success)]',
  error: 'bg-[var(--scanner-border-error)]',
};

const labelText = cn(
  'min-w-px flex-1 break-words',
  'font-[family-name:var(--scanner-font-sans)] font-[number:var(--scanner-font-regular)]',
  'text-[length:var(--scanner-text-scanner-md)] leading-[var(--scanner-leading-lg)]',
  'text-[color:var(--scanner-text-secondary)]',
);

const helperTextBase = cn(
  'min-w-px flex-1 break-words',
  'font-[family-name:var(--scanner-font-sans)] font-[number:var(--scanner-font-regular)]',
  'text-[length:var(--scanner-text-base)] leading-[var(--scanner-leading-md)]',
);

/**
 * Scanner ProgressBar — shows measurable progress of a longer task (upload, install, export).
 * For unknown durations use a Spinner.
 *
 * Figma props → React: Progress → `value` (any number up to `max`) / `status`,
 * Show label → `showLabel`, Label text value → `label`, Show helper text → `showHelperText`,
 * Helper text value → `helperText`, Error text message → `errorText`.
 * ARIA: `role="progressbar"` with `aria-valuenow/min/max`, labelled by the label and described by the helper/error text.
 *
 * @example
 * <ProgressBar value={42} max={256} label="Uploading scans" helperText="42/256 items" />
 * <ProgressBar status="error" label="Upload" errorText="Upload failed" onRetry={retry} />
 */
export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      value = 0,
      max = 100,
      status: statusProp,
      label = 'Label',
      showLabel = true,
      helperText = 'Optional helper text',
      showHelperText = true,
      errorText = 'Error text message',
      onRetry,
      retryLabel = 'Try again',
      indeterminate = false,
      className,
      id,
      ...rest
    },
    ref,
  ) => {
    const autoId = useId();
    const baseId = id ?? autoId;
    const labelId = `${baseId}-label`;
    const helperId = `${baseId}-helper`;

    const safeMax = Number.isFinite(max) && max > 0 ? max : 100;
    const current = Math.min(safeMax, Math.max(0, Number.isFinite(value) ? value : 0));
    const percent = (current / safeMax) * 100;

    const status: ProgressBarStatus = indeterminate
      ? 'default'
      : (statusProp ?? (percent >= 100 ? 'success' : 'default'));
    const isSuccess = status === 'success';
    const isError = status === 'error';

    const hasLabel = showLabel && !!label;
    const bottomText = isError ? errorText : showHelperText ? helperText : undefined;

    /* Success and Error fill the whole track in Figma */
    const fillWidth = indeterminate ? undefined : isError || isSuccess ? 100 : percent;

    return (
      <div
        ref={ref}
        id={id}
        data-status={status}
        className={cn('flex w-full flex-col items-start', className)}
        {...rest}
      >
        {/* ── Label row ── */}
        {hasLabel && (
          <div className="flex w-full items-start justify-end gap-[var(--scanner-spacing-5)] pb-[var(--scanner-spacing-3)]">
            <span id={labelId} className={labelText}>
              {label}
            </span>

            {(isSuccess || isError) && (
              <div className="flex shrink-0 items-center gap-[var(--scanner-spacing-3)]">
                {isError && onRetry && (
                  <Link type="primary" size="small" onClick={onRetry} className="shrink-0">
                    {retryLabel}
                  </Link>
                )}
                {isSuccess ? (
                  <Icon
                    name="checkmark"
                    size={24}
                    label="Completed"
                    className="size-[var(--scanner-progress-bar-status-icon-size)] text-[color:var(--scanner-icon-success)]"
                  />
                ) : (
                  <Icon
                    name="error"
                    size={24}
                    className="size-[var(--scanner-progress-bar-status-icon-size)] text-[color:var(--scanner-icon-error)]"
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Track ── */}
        <div
          role="progressbar"
          aria-labelledby={hasLabel ? labelId : undefined}
          aria-label={hasLabel ? undefined : label || undefined}
          aria-describedby={bottomText ? helperId : undefined}
          aria-valuemin={indeterminate ? undefined : 0}
          aria-valuemax={indeterminate ? undefined : safeMax}
          aria-valuenow={indeterminate ? undefined : current}
          aria-busy={indeterminate || undefined}
          className={cn(
            'relative h-[var(--scanner-progress-bar-height)] w-full shrink-0 overflow-hidden',
            'rounded-[var(--scanner-radius-sm)] bg-[var(--scanner-border-subtle)]',
          )}
        >
          <div
            data-fill=""
            className={cn(
              'absolute inset-y-0 left-0 rounded-[var(--scanner-radius-sm)] transition-[width] duration-300 ease-in-out',
              fillColor[status],
              indeterminate && 'w-2/5 animate-progress-indeterminate',
            )}
            style={fillWidth === undefined ? undefined : { width: `${fillWidth}%` }}
          />
        </div>

        {/* ── Helper / error text ── */}
        {bottomText && (
          <div className="flex w-full items-center pt-[var(--scanner-spacing-3)]">
            <span
              id={helperId}
              className={cn(
                helperTextBase,
                isError ? 'text-[color:var(--scanner-text-error)]' : 'text-[color:var(--scanner-text-secondary)]',
              )}
            >
              {bottomText}
            </span>
          </div>
        )}
      </div>
    );
  },
);

ProgressBar.displayName = 'ProgressBar';
