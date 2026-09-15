import { forwardRef, useId } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../../icons';
import { FieldCounter, FieldHeader, FieldMessage } from '../text-input/field-parts';
import {
  fieldAction,
  fieldBackground,
  fieldRoot,
  fieldStroke,
  placeholderText,
  skeletonFill,
  typeBody02,
  typeLabel01,
  valueText,
} from '../text-input/field-styles';
import { useFieldValue } from '../text-input/use-field-value';
import type { TextAreaProps } from './text-area.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → Text area (node 6176:2286, page 23885:186323)
 * 2 Layer sets × Filled (False/True) × 5 States (Enabled, Focused, Disabled, Error, Skeleton) = 20 variants.
 *
 * The field container is the resizable element (CSS `resize: vertical`), so the resize handle sits in the
 * field's bottom-right corner like Figma; the native grip is hidden and Figma's 8px handle glyph drawn on top.
 * "Show scroll" is the native scrollbar, styled thin with the `border-subtle` colour.
 */

/** Figma "Resize handle" glyph (8×8). */
const ResizeHandle = ({ className }: { className?: string }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 8 8"
    fill="none"
    className={cn(
      'pointer-events-none absolute size-[var(--scanner-text-area-resize-handle-size)]',
      'right-[var(--scanner-text-area-resize-handle-inset)] bottom-[var(--scanner-text-area-resize-handle-inset)]',
      className,
    )}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.85355 0.853553L0.853553 7.85355L0.146447 7.14645L7.14645 0.146447L7.85355 0.853553ZM7.85355 4.85355L4.85355 7.85355L4.14645 7.14645L7.14645 4.14645L7.85355 4.85355Z"
      fill="currentColor"
    />
  </svg>
);

/**
 * Scanner TextArea — multi-line free-form text entry with label, required indicator, explainer tooltip,
 * counter, clear action, resize handle, helper/error text and skeleton state.
 *
 * Figma props → React: Layer set → `layer`, Filled → derived from the value,
 * State → `:focus-within` (forceable via `data-state="focused"`) / `disabled` / `error` / `skeleton`,
 * Show label/helper/placeholder/counter/explainer → `label` / `helperText` / `placeholder` / `showCounter`+`maxLength` (or `counter`) / `tooltipContent`,
 * Required → `required`, Show scroll → native scrollbar on overflow.
 *
 * @example
 * <TextArea label="Description" placeholder="Enter a description..." />
 * <TextArea label="Notes" helperText="Max 500 characters" maxLength={500} showCounter />
 * <TextArea label="Comment" error errorText="This field is required" />
 */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      helperText,
      errorText,
      tooltipContent,
      error = false,
      skeleton = false,
      showCounter = false,
      counter,
      layer = 1,
      clearable = true,
      onClear,
      className,
      disabled = false,
      required = false,
      maxLength,
      value,
      defaultValue,
      onChange,
      id: idProp,
      'aria-describedby': ariaDescribedBy,
      'data-state': dataState,
      ...rest
    },
    ref,
  ) => {
    const autoId = useId();
    const id = idProp ?? `text-area-${autoId}`;
    const helperId = `${id}-helper`;
    const errorId = `${id}-error`;

    const { setRef, currentValue, hasValue, handleChange, clear, focusFromContainer } =
      useFieldValue<HTMLTextAreaElement>({ value, defaultValue, onChange, ref });

    const counterText =
      counter ?? (showCounter && maxLength !== undefined ? `${currentValue.length}/${maxLength}` : undefined);

    if (skeleton) {
      const bar = 'h-[var(--scanner-text-area-skeleton-bar-height)]';
      return (
        <div aria-hidden="true" data-skeleton="" data-layer={layer} className={cn(fieldRoot, className)}>
          {(label || counterText !== undefined) && (
            <div className="flex w-full items-start justify-end">
              <div className="flex min-w-px flex-1 items-start pb-[var(--scanner-spacing-3)]">
                {label && <div className={cn(bar, 'w-[var(--scanner-text-area-skeleton-bar-width)]', skeletonFill)} />}
              </div>
              {counterText !== undefined && (
                <div className="flex shrink-0 pb-[var(--scanner-spacing-3)] pl-[var(--scanner-spacing-3)]">
                  <div className={cn(bar, 'w-[var(--scanner-text-area-skeleton-counter-width)]', skeletonFill)} />
                </div>
              )}
            </div>
          )}
          <div className={cn('h-[var(--scanner-text-area-height)] w-full rounded-[var(--scanner-radius-md)]', skeletonFill)} />
          {(helperText || errorText) && (
            <div className="flex w-full items-start pt-[var(--scanner-spacing-3)]">
              <div className={cn(bar, 'w-[var(--scanner-text-area-skeleton-bar-width)]', skeletonFill)} />
            </div>
          )}
        </div>
      );
    }

    const showError = error && !!errorText;
    const showHelper = !showError && !!helperText;
    const showClear = clearable && hasValue && !disabled && !rest.readOnly;
    const describedBy =
      [ariaDescribedBy, showError && errorId, showHelper && helperId].filter(Boolean).join(' ') || undefined;

    const handleClear = () => {
      clear();
      onClear?.();
    };

    return (
      <div data-layer={layer} className={cn(fieldRoot, className)}>
        <FieldHeader
          htmlFor={id}
          label={label}
          required={required}
          explainer={tooltipContent}
          disabled={disabled}
          labelClassName={typeLabel01}
          trailing={counterText !== undefined ? <FieldCounter disabled={disabled}>{counterText}</FieldCounter> : undefined}
        />

        <div
          data-part="field"
          data-state={dataState}
          onMouseDown={focusFromContainer}
          className={cn(
            'relative flex w-full items-start gap-[var(--scanner-spacing-3)] overflow-hidden',
            'h-[var(--scanner-text-area-height)] min-h-[var(--scanner-text-area-min-height)]',
            'rounded-[var(--scanner-radius-md)] px-[var(--scanner-spacing-5)] py-[var(--scanner-spacing-4)]',
            'transition-shadow duration-150',
            fieldBackground[layer],
            fieldStroke({ error, disabled, subtle: true }),
            /* Hide the native grip; Figma's handle glyph is drawn instead */
            '[&::-webkit-resizer]:bg-transparent',
            disabled ? 'cursor-not-allowed resize-none' : 'cursor-text resize-y',
          )}
        >
          <textarea
            ref={setRef}
            id={id}
            disabled={disabled}
            required={required}
            maxLength={maxLength}
            value={value}
            defaultValue={defaultValue}
            aria-invalid={error || undefined}
            aria-required={required || undefined}
            aria-disabled={disabled || undefined}
            aria-describedby={describedBy}
            onChange={handleChange}
            className={cn(
              'm-0 min-w-0 flex-1 self-stretch resize-none border-none bg-transparent p-0 outline-none',
              '[scrollbar-color:var(--scanner-border-subtle)_transparent] [scrollbar-width:thin]',
              typeBody02,
              valueText(disabled),
              placeholderText(disabled),
              disabled && 'cursor-not-allowed',
            )}
            {...rest}
          />

          {showClear && (
            <button
              type="button"
              aria-label="Clear text"
              aria-controls={id}
              onClick={handleClear}
              className={cn(fieldAction, 'size-[var(--scanner-spacing-7)] cursor-pointer text-[color:var(--scanner-icon-tertiary)]')}
            >
              <Icon name="close-empty" size={24} />
            </button>
          )}

          <ResizeHandle
            className={disabled ? 'text-[color:var(--scanner-icon-disabled)]' : 'text-[color:var(--scanner-icon-secondary)]'}
          />
        </div>

        {showError && (
          <FieldMessage id={errorId} tone="error" className={typeLabel01}>
            {errorText}
          </FieldMessage>
        )}
        {showHelper && (
          <FieldMessage id={helperId} tone="helper" disabled={disabled} className={typeLabel01}>
            {helperText}
          </FieldMessage>
        )}
      </div>
    );
  },
);

TextArea.displayName = 'TextArea';
