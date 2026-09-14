import { Children, forwardRef, useId } from 'react';
import { cn } from '../../utils/cn';
import { IconTriggerTooltip } from '../icon-trigger-tooltip';
import type { VerticalCheckboxGroupProps } from './vertical-checkbox-group.types';

/**
 * Scanner VerticalCheckboxGroup — groups CheckboxItem children vertically
 * with a label, optional tooltip, required indicator, and helper/error text.
 *
 * Mirrors Figma "02 Vertical checkbox group" with Levels 1 (flat) and 2 (nested).
 *
 * @example
 * <VerticalCheckboxGroup label="Options" required>
 *   <CheckboxItem label="Option A" checked onChange={...} />
 *   <CheckboxItem label="Option B" onChange={...} />
 * </VerticalCheckboxGroup>
 */
export const VerticalCheckboxGroup = forwardRef<HTMLDivElement, VerticalCheckboxGroupProps>(
  (
    {
      label,
      showLabel = true,
      tooltipContent,
      required = false,
      helperText,
      error = false,
      errorMessage,
      disabled = false,
      skeleton = false,
      levels = 1,
      children,
      className,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const labelId = `cbg-label-${generatedId}`;
    const helperId = `cbg-helper-${generatedId}`;

    const displayedHelperText = error && errorMessage ? errorMessage : helperText;
    const hasHelper = Boolean(displayedHelperText);

    /* ------------------------------------------------------------------ */
    /* Skeleton state                                                      */
    /* ------------------------------------------------------------------ */
    if (skeleton) {
      return (
        <div
          ref={ref}
          className={cn('flex flex-col items-start', className)}
          aria-hidden="true"
          {...rest}
        >
          {/* Label skeleton */}
          {showLabel && (
            <div className="pb-[var(--scanner-spacing-3)]">
              <div className="h-[24px] w-[80px] animate-pulse rounded-[var(--scanner-radius-sm)] bg-[var(--scanner-gray-alpha-10)]" />
            </div>
          )}
          {/* Checkbox item skeletons */}
          <div className="flex w-full flex-col gap-[var(--scanner-spacing-3)]">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-[var(--scanner-spacing-3)] py-[var(--scanner-spacing-5)]">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center">
                  <div className="h-5 w-5 animate-pulse rounded-[var(--scanner-radius-sm)] bg-[var(--scanner-gray-alpha-10)]" />
                </div>
                <div className="h-4 w-24 animate-pulse rounded-[var(--scanner-radius-sm)] bg-[var(--scanner-gray-alpha-10)]" />
              </div>
            ))}
          </div>
          {/* Helper text skeleton */}
          {hasHelper && (
            <div className="pt-[var(--scanner-spacing-3)]">
              <div className="h-4 w-40 animate-pulse rounded-[var(--scanner-radius-sm)] bg-[var(--scanner-gray-alpha-10)]" />
            </div>
          )}
        </div>
      );
    }

    /* ------------------------------------------------------------------ */
    /* Render children based on levels                                     */
    /* ------------------------------------------------------------------ */
    const childArray = Children.toArray(children);

    const renderItems = () => {
      if (levels === 2 && childArray.length > 1) {
        const [mainItem, ...subItems] = childArray;
        return (
          <>
            {mainItem}
            <div className="flex w-full flex-col gap-[var(--scanner-spacing-3)] pl-[var(--scanner-spacing-8)]">
              {subItems}
            </div>
          </>
        );
      }
      return childArray;
    };

    /* ------------------------------------------------------------------ */
    /* Normal state                                                        */
    /* ------------------------------------------------------------------ */
    return (
      <div
        ref={ref}
        role="group"
        aria-labelledby={showLabel && label ? labelId : undefined}
        aria-describedby={hasHelper ? helperId : undefined}
        aria-disabled={disabled || undefined}
        aria-invalid={error || undefined}
        data-disabled={disabled || undefined}
        className={cn(
          'flex flex-col items-start',
          disabled && 'cursor-not-allowed',
          className,
        )}
        {...rest}
      >
        {/* ---- Label row ---- */}
        {showLabel && label && (
          <div className="flex items-start gap-[var(--scanner-spacing-2)] pb-[var(--scanner-spacing-3)]">
            <span
              id={labelId}
              className={cn(
                'font-[family-name:var(--scanner-font-sans)] text-[16px] font-[var(--scanner-font-regular)] leading-[24px]',
                disabled
                  ? 'text-[color:var(--scanner-text-disabled)]'
                  : 'text-[color:var(--scanner-text-secondary)]',
              )}
            >
              {label}
            </span>
            {tooltipContent && (
              <IconTriggerTooltip content={tooltipContent} />
            )}
            {required && (
              <span
                className="font-[family-name:var(--scanner-font-sans)] text-[var(--scanner-text-xs)] font-[var(--scanner-font-regular)] leading-[var(--scanner-leading-xs)] text-[color:var(--scanner-text-error)]"
                aria-hidden="true"
              >
                *
              </span>
            )}
          </div>
        )}

        {/* ---- Checkbox items ---- */}
        <div className="flex w-full flex-col gap-[var(--scanner-spacing-3)]">
          {renderItems()}
        </div>

        {/* ---- Helper / Error text ---- */}
        {hasHelper && (
          <p
            id={helperId}
            className={cn(
              'pt-[var(--scanner-spacing-3)] font-[family-name:var(--scanner-font-sans)] text-[var(--scanner-text-xs)] font-[var(--scanner-font-regular)] leading-[var(--scanner-leading-xs)]',
              error
                ? 'text-[color:var(--scanner-text-error)]'
                : 'text-[color:var(--scanner-text-secondary)]',
            )}
          >
            {displayedHelperText}
          </p>
        )}
      </div>
    );
  },
);

VerticalCheckboxGroup.displayName = 'VerticalCheckboxGroup';
