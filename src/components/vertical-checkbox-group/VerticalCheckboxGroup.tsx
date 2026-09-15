import { Children, forwardRef, useId } from 'react';
import { cn } from '../../utils/cn';
import { CheckboxGroupContext } from '../checkbox-item/checkbox-group-context';
import { CheckboxGroupLabel } from '../checkbox-item/CheckboxGroupLabel';
import { moveCheckboxFocus } from '../checkbox-item/checkbox-group-keyboard';
import type { VerticalCheckboxGroupProps } from './vertical-checkbox-group.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → 02 Vertical checkbox group (node 20619:27426)
 * Levels (1, 2) + Show label, Label text, Show explainer, Required.
 * Label row (8px bottom padding) above an "Items" column with an 8px gap.
 * Levels=2: "Main" item followed by a "Sub menu" column — indented 32px per the
 * Figma Nesting documentation (the component set itself shows no indent).
 */

const ARROWS = { prev: ['ArrowUp'], next: ['ArrowDown'] };

/**
 * Scanner VerticalCheckboxGroup — a labelled vertical list of CheckboxItems.
 *
 * Keyboard: Tab / Shift+Tab move in and out, ArrowUp / ArrowDown move between
 * checkboxes, Space / Enter toggle. With `levels={2}` the first child is the parent
 * checkbox; keep its state in sync with the children (selected / indeterminate / unselected).
 *
 * @example
 * <VerticalCheckboxGroup label="Jaws" required tooltipContent="Select at least one jaw">
 *   <CheckboxItem label="Upper jaw" checked={upper} onChange={setUpper} />
 *   <CheckboxItem label="Lower jaw" checked={lower} onChange={setLower} />
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
      onKeyDown,
      ...rest
    },
    ref,
  ) => {
    const id = useId();
    const labelId = `cbg-label-${id}`;
    const helperId = `cbg-helper-${id}`;

    const bottomText = error && errorMessage ? errorMessage : helperText;
    const hasLabel = showLabel && !!label;

    const items = Children.toArray(children);
    const [main, ...subItems] = items;

    return (
      <CheckboxGroupContext.Provider value={{ disabled, skeleton }}>
        <div
          ref={ref}
          role="group"
          aria-labelledby={hasLabel ? labelId : undefined}
          aria-describedby={bottomText && !skeleton ? helperId : undefined}
          aria-disabled={disabled || undefined}
          aria-invalid={error || undefined}
          aria-busy={skeleton || undefined}
          data-levels={levels}
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

          <div className="flex flex-col items-start gap-[var(--scanner-spacing-3)]">
            {levels === 2 && subItems.length > 0 ? (
              <>
                {main}
                <div
                  data-sub-items=""
                  className="flex flex-col items-start gap-[var(--scanner-spacing-3)] pl-[var(--scanner-spacing-8)]"
                >
                  {subItems}
                </div>
              </>
            ) : (
              items
            )}
          </div>

          {bottomText && !skeleton && (
            <p
              id={helperId}
              className={cn(
                'm-0 pt-[var(--scanner-spacing-3)]',
                'font-[family-name:var(--scanner-font-sans)] font-[number:var(--scanner-font-regular)]',
                'text-[length:var(--scanner-text-xs)] leading-[var(--scanner-leading-xs)]',
                error ? 'text-[color:var(--scanner-text-error)]' : 'text-[color:var(--scanner-text-secondary)]',
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

VerticalCheckboxGroup.displayName = 'VerticalCheckboxGroup';
