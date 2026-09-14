import { forwardRef, useCallback } from 'react';
import type { MouseEvent } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../../icons';
import { Link } from '../link';
import type { ProgressBarProps, ProgressBarStatus } from './progress-bar.types';

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

/** Clamp a numeric value to the 0–100 range. */
function clamp(value: number): number {
  return Math.min(100, Math.max(0, value));
}

/** Resolve the effective visual status. */
function resolveStatus(
  value: number,
  explicitStatus?: ProgressBarStatus,
): ProgressBarStatus {
  if (explicitStatus) return explicitStatus;
  if (value >= 100) return 'success';
  return 'default';
}

/** Map status to the fill-color token class. */
const fillColorByStatus: Record<ProgressBarStatus, string> = {
  default: 'bg-[var(--scanner-border-interactive)]',
  success: 'bg-[var(--scanner-border-success)]',
  error: 'bg-[var(--scanner-border-error)]',
};

/**
 * Scanner ProgressBar — displays the progress of an operation.
 *
 * Maps to Figma "Progress bar" component set with variants:
 * `Progress`: 0% | 25% | 50% | 75% | 100% | Error
 *
 * @example
 * <ProgressBar value={50} label="Uploading" helperText="50% complete" />
 * <ProgressBar value={100} label="Done" />
 * <ProgressBar status="error" label="Failed" errorText="Upload failed" onRetry={() => retry()} />
 * <ProgressBar indeterminate label="Loading..." />
 */
export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      value = 0,
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
      ...rest
    },
    ref,
  ) => {
    const clampedValue = clamp(value);
    const status = indeterminate
      ? 'default'
      : resolveStatus(clampedValue, statusProp);
    const isSuccess = status === 'success';
    const isError = status === 'error';

    /* ---- Retry click handler ---- */
    const handleRetryClick = useCallback(
      (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        onRetry?.();
      },
      [onRetry],
    );

    /* ---- ARIA values ---- */
    const ariaProps = indeterminate
      ? {}
      : {
          'aria-valuenow': clampedValue,
          'aria-valuemin': 0,
          'aria-valuemax': 100,
        };

    return (
      <div
        ref={ref}
        className={cn('flex w-full flex-col items-start', className)}
        {...rest}
      >
        {/* ── Label row ─────────────────────────────────────── */}
        {showLabel && (
          <div
            className={cn(
              'flex w-full items-start justify-end',
              'gap-[var(--scanner-spacing-5)]',
              'pb-[var(--scanner-spacing-3)]',
            )}
          >
            {/* Label text */}
            <p
              className={cn(
                'min-w-[1px] flex-1 break-words',
                'font-[family-name:var(--scanner-font-sans)]',
                'text-[18px] leading-[var(--scanner-leading-lg)]',
                'font-[var(--scanner-font-regular)]',
                'text-[color:var(--scanner-text-secondary)]',
              )}
            >
              {label}
            </p>

            {/* Status indicators (success / error) */}
            {(isSuccess || isError) && (
              <div className="flex shrink-0 items-center gap-[var(--scanner-spacing-3)]">
                {isError && (
                  <Link
                    type="primary"
                    size="medium"
                    onClick={handleRetryClick}
                    href="#"
                    className="shrink-0"
                  >
                    {retryLabel}
                  </Link>
                )}
                {isSuccess && (
                  <span className="inline-flex size-[24px] items-center justify-center text-[var(--scanner-icon-success)]">
                    <Icon name="checkmark" size={24} label="Complete" />
                  </span>
                )}
                {isError && (
                  <span className="inline-flex size-[24px] items-center justify-center text-[var(--scanner-icon-error)]">
                    <Icon name="error" size={24} label="Error" />
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Bar track ─────────────────────────────────────── */}
        <div
          role="progressbar"
          className={cn(
            'relative h-[8px] w-full shrink-0 overflow-hidden',
            'rounded-[var(--scanner-radius-sm)]',
            'bg-[var(--scanner-border-subtle)]',
          )}
          {...ariaProps}
          aria-label={label}
        >
          {/* Fill */}
          <div
            className={cn(
              'absolute inset-y-0 left-0',
              'rounded-[var(--scanner-radius-sm)]',
              fillColorByStatus[status],
              'transition-[width] duration-300 ease-in-out',
              indeterminate && 'animate-progress-indeterminate',
            )}
            style={
              indeterminate
                ? { width: '40%' }
                : { width: `${clampedValue}%` }
            }
          />
        </div>

        {/* ── Helper / Error text ───────────────────────────── */}
        {isError && (
          <div className="flex w-full items-center pt-[var(--scanner-spacing-3)]">
            <p
              className={cn(
                'min-w-[1px] flex-1 break-words',
                'font-[family-name:var(--scanner-font-sans)]',
                'text-[16px] leading-[var(--scanner-leading-md)]',
                'font-[var(--scanner-font-regular)]',
                'text-[color:var(--scanner-text-error)]',
              )}
            >
              {errorText}
            </p>
          </div>
        )}

        {!isError && showHelperText && (
          <div className="flex w-full items-center pt-[var(--scanner-spacing-3)]">
            <p
              className={cn(
                'min-w-[1px] flex-1 break-words',
                'font-[family-name:var(--scanner-font-sans)]',
                'text-[16px] leading-[var(--scanner-leading-md)]',
                'font-[var(--scanner-font-regular)]',
                'text-[color:var(--scanner-text-secondary)]',
              )}
            >
              {helperText}
            </p>
          </div>
        )}
      </div>
    );
  },
);

ProgressBar.displayName = 'ProgressBar';
