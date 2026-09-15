import { forwardRef, useId } from 'react';
import { cn } from '../../utils/cn';
import { CheckboxGroupContext } from '../checkbox-item/checkbox-group-context';
import { CheckboxGroupLabel } from '../checkbox-item/CheckboxGroupLabel';
import { moveCheckboxFocus } from '../checkbox-item/checkbox-group-keyboard';
import type { HorizontalCheckboxGroupProps } from './horizontal-checkbox-group.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → 03 Horizontal checkbox group (node 28129:11602)
 * Show label, Label text, Show explainer, Required.
 * Label row (8px bottom padding) above an "Items" row with a 16px gap.
 */

const ARROWS = { prev: ['ArrowUp', 'ArrowLeft'], next: ['ArrowDown', 'ArrowRight'] };

/**
 * Scanner HorizontalCheckboxGroup — a labelled row of CheckboxItems.
 *
 * Keyboard: Tab / Shift+Tab move in and out, arrow keys move between checkboxes,
 * Space / Enter toggle.
 *
 * @example
 * <HorizontalCheckboxGroup label="Jaws" required>
 *   <CheckboxItem label="Upper" checked={upper} onChange={setUpper} />
 *   <CheckboxItem label="Lower" checked={lower} onChange={setLower} />
 * </HorizontalCheckboxGroup>
 */
export const HorizontalCheckboxGroup = forwardRef<HTMLDivElement, HorizontalCheckboxGroupProps>(
  (
    {
      label,
      showLabel = true,
      required = false,
      tooltipContent,
      helperText,
      error = false,
      disabled = false,
      skeleton = false,
      children,
      className,
      onKeyDown,
      ...rest
    },
    ref,
  ) => {
    const id = useId();
    const labelId = `hcg-label-${id}`;
    const helperId = `hcg-helper-${id}`;

    const hasError = Boolean(error);
    const bottomText = typeof error === 'string' && error ? error : helperText;
    const hasLabel = showLabel && !!label;

    return (
      <CheckboxGroupContext.Provider value={{ disabled, skeleton }}>
        <div
          ref={ref}
          role="group"
          aria-labelledby={hasLabel ? labelId : undefined}
          aria-describedby={bottomText && !skeleton ? helperId : undefined}
          aria-disabled={disabled || undefined}
          aria-invalid={hasError || undefined}
          aria-busy={skeleton || undefined}
          className={cn('flex flex-col items-start', disabled && 'cursor-not-allowed', className)}
          onKeyDown={(e) => {
            onKeyDown?.(e);
            moveCheckboxFocus(e, ARROWS);
          }}
          {...rest}
        >
          {hasLabel && (
            <CheckboxGroupLabel
              id={labelId}
              label={label}
              tooltipContent={tooltipContent}
              required={required}
              disabled={disabled}
              skeleton={skeleton}
            />
          )}

          <div className="flex items-start gap-[var(--scanner-spacing-5)]">{children}</div>

          {bottomText && !skeleton && (
            <p
              id={helperId}
              className={cn(
                'm-0 pt-[var(--scanner-spacing-2)]',
                'font-[family-name:var(--scanner-font-sans)] font-[number:var(--scanner-font-regular)]',
                'text-[length:var(--scanner-text-xs)] leading-[var(--scanner-leading-xs)]',
                hasError ? 'text-[color:var(--scanner-text-error)]' : 'text-[color:var(--scanner-text-secondary)]',
              )}
            >
              {bottomText}
            </p>
          )}
        </div>
      </CheckboxGroupContext.Provider>
    );
  },
);

HorizontalCheckboxGroup.displayName = 'HorizontalCheckboxGroup';
