import { forwardRef, useId } from 'react';
import { cn } from '../../utils/cn';
import { IconTriggerTooltip } from '../icon-trigger-tooltip';
import type { HorizontalCheckboxGroupProps } from './horizontal-checkbox-group.types';

/**
 * HorizontalCheckboxGroup — a labelled group of CheckboxItem elements
 * laid out in a horizontal row.
 *
 * Mirrors the Figma "03 Horizontal checkbox group" component.
 * Items can be expanded by adding more CheckboxItem children.
 *
 * @example
 * <HorizontalCheckboxGroup label="Options">
 *   <CheckboxItem label="A" checked="selected" />
 *   <CheckboxItem label="B" />
 * </HorizontalCheckboxGroup>
 */
export const HorizontalCheckboxGroup = forwardRef<
  HTMLDivElement,
  HorizontalCheckboxGroupProps
>(
  (
    {
      label,
      showLabel = true,
      required = false,
      tooltipContent,
      helperText,
      error = false,
      disabled = false,
      children,
      className,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const labelId = `hcg-label-${generatedId}`;
    const helperId = `hcg-helper-${generatedId}`;

    const hasError = Boolean(error);
    const errorMessage = typeof error === 'string' ? error : undefined;
    const bottomText = hasError && errorMessage ? errorMessage : helperText;

    return (
      <div
        ref={ref}
        role="group"
        aria-labelledby={showLabel && label ? labelId : undefined}
        aria-describedby={bottomText ? helperId : undefined}
        aria-disabled={disabled || undefined}
        className={cn(
          'flex flex-col items-start',
          disabled && 'cursor-not-allowed',
          className,
        )}
        {...rest}
      >
        {/* ---------------------------------------------------------------- */}
        {/* Label row                                                        */}
        {/* ---------------------------------------------------------------- */}
        {showLabel && label && (
          <div
            className="flex items-start gap-[var(--scanner-spacing-2)] pb-[var(--scanner-spacing-3)]"
          >
            <span
              id={labelId}
              className={cn(
                'font-[family-name:var(--scanner-font-sans)]',
                'text-[16px] leading-[var(--scanner-leading-md)]',
                'font-[var(--scanner-font-regular)]',
                'whitespace-nowrap',
                disabled
                  ? 'text-[color:var(--scanner-text-disabled)]'
                  : 'text-[color:var(--scanner-text-secondary)]',
              )}
            >
              {label}
            </span>

            {/* Explainer tooltip */}
            {tooltipContent && (
              <span className="flex flex-col items-center justify-end">
                <IconTriggerTooltip content={tooltipContent} />
              </span>
            )}

            {/* Required asterisk */}
            {required && (
              <span
                aria-hidden="true"
                className={cn(
                  'font-[family-name:var(--scanner-font-sans)]',
                  'text-[var(--scanner-text-xs)] leading-[var(--scanner-leading-xs)]',
                  'font-[var(--scanner-font-regular)]',
                  'text-[color:var(--scanner-text-error)]',
                  'whitespace-nowrap',
                )}
              >
                *
              </span>
            )}
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Checkbox items — horizontal flow                                 */}
        {/* ---------------------------------------------------------------- */}
        <div
          className="flex items-start gap-[var(--scanner-spacing-5)]"
          role="presentation"
        >
          {children}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Helper / Error text                                              */}
        {/* ---------------------------------------------------------------- */}
        {bottomText && (
          <p
            id={helperId}
            className={cn(
              'font-[family-name:var(--scanner-font-sans)]',
              'text-[var(--scanner-text-xs)] leading-[var(--scanner-leading-xs)]',
              'font-[var(--scanner-font-regular)]',
              'pt-[var(--scanner-spacing-2)]',
              hasError
                ? 'text-[color:var(--scanner-text-error)]'
                : 'text-[color:var(--scanner-text-secondary)]',
            )}
          >
            {bottomText}
          </p>
        )}
      </div>
    );
  },
);

HorizontalCheckboxGroup.displayName = 'HorizontalCheckboxGroup';
