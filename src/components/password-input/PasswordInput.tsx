import { forwardRef, useId, useState } from 'react';
import { cn } from '../../utils/cn';
import { Link } from '../link';
import { FieldHeader, FieldMessage } from '../text-input/field-parts';
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
import { Icon } from '../../icons';
import type { PasswordInputProps } from './password-input.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → Password input (node 6176:2285, page 15305:6752)
 * 2 Layer sets × Filled (False/True) × 5 States (Enabled, Focused, Disabled, Error, Skeleton) × Visible (False/True) = 40 variants.
 *
 * Visibility toggle: Figma shows it when the field is Filled, or while Focused (even empty).
 */

/**
 * Scanner PasswordInput — masked text entry with show/hide toggle, label, required indicator,
 * explainer tooltip, "Forgot password?" link, helper/error text and skeleton state.
 *
 * Figma props → React: Layer set → `layer`, Filled → derived from the value, Visible → `passwordVisible` /
 * `defaultPasswordVisible`, State → `:focus-within` (forceable via `data-state="focused"`) / `disabled` / `error` / `skeleton`,
 * Show label/helper/link/explainer/placeholder → `showLabel` / `showHelper` / `showLink` / `showExplainer` / `placeholder`,
 * Required → `required`.
 *
 * Keyboard: Tab focuses the field, Tab again reaches the visibility toggle (Enter/Space toggles it).
 *
 * @example
 * <PasswordInput label="Password" placeholder="Enter password" />
 * <PasswordInput error errorText="Password is required" showLink={false} />
 * <PasswordInput skeleton />
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      label = 'Password',
      showLabel = true,
      helperText = 'Optional helper text',
      showHelper = true,
      errorText = 'Error text message',
      error = false,
      required = false,
      showLink = true,
      linkText = 'Forgot password?',
      linkHref,
      onLinkClick,
      showExplainer = false,
      explainerContent = '',
      layer = 1,
      skeleton = false,
      passwordVisible: controlledVisible,
      defaultPasswordVisible = false,
      onPasswordVisibleChange,
      disabled = false,
      className,
      id: providedId,
      value,
      defaultValue,
      onChange,
      'aria-describedby': ariaDescribedBy,
      'data-state': dataState,
      ...inputProps
    },
    ref,
  ) => {
    const autoId = useId();
    const inputId = providedId ?? `password-input-${autoId}`;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    const { setRef, hasValue, handleChange, focusFromContainer } = useFieldValue<HTMLInputElement>({
      value,
      defaultValue,
      onChange,
      ref,
    });

    /* ---- Visibility (controlled / uncontrolled) ---- */
    const [internalVisible, setInternalVisible] = useState(defaultPasswordVisible);
    const isVisible = controlledVisible ?? internalVisible;
    const toggleVisibility = () => {
      const next = !isVisible;
      if (controlledVisible === undefined) setInternalVisible(next);
      onPasswordVisibleChange?.(next);
    };

    if (skeleton) {
      const bar = cn(
        'h-[var(--scanner-password-input-skeleton-bar-height)] w-[var(--scanner-password-input-skeleton-bar-width)]',
        skeletonFill,
      );
      return (
        <div aria-hidden="true" data-skeleton="" data-layer={layer} className={cn(fieldRoot, className)}>
          {showLabel && (
            <div className="flex w-full items-start pb-[var(--scanner-spacing-3)]">
              <div className={bar} />
            </div>
          )}
          <div
            className={cn('h-[var(--scanner-password-input-height)] w-full rounded-[var(--scanner-radius-md)]', skeletonFill)}
          />
          {showHelper && (
            <div className="flex w-full items-start pt-[var(--scanner-spacing-3)]">
              <div className={bar} />
            </div>
          )}
        </div>
      );
    }

    const showError = error && !!errorText;
    const showHelperText = !showError && showHelper && !!helperText;
    const describedBy =
      [ariaDescribedBy, showError && errorId, showHelperText && helperId].filter(Boolean).join(' ') || undefined;

    return (
      <div data-layer={layer} className={cn(fieldRoot, className)}>
        <FieldHeader
          htmlFor={inputId}
          label={showLabel ? label : undefined}
          required={required}
          explainer={showExplainer && explainerContent ? explainerContent : undefined}
          disabled={disabled}
          labelClassName={typeLabel01}
          trailing={
            showLink ? (
              <Link
                type="primary"
                size="small"
                href={linkHref}
                onClick={onLinkClick}
                /* Figma link inside the field header is 16/24 (Link/$tp-link-01) */
                className={cn('whitespace-nowrap text-right', typeLabel01)}
              >
                {linkText}
              </Link>
            ) : undefined
          }
        />

        <div
          data-part="field"
          data-state={dataState}
          onMouseDown={focusFromContainer}
          className={cn(
            'group/field flex w-full items-center gap-[var(--scanner-spacing-3)] overflow-clip',
            'h-[var(--scanner-password-input-height)] rounded-[var(--scanner-radius-md)] p-[var(--scanner-spacing-5)]',
            'transition-shadow duration-150',
            fieldBackground[layer],
            fieldStroke({ error, disabled }),
            disabled ? 'cursor-not-allowed' : 'cursor-text',
          )}
        >
          <input
            ref={setRef}
            id={inputId}
            type={isVisible ? 'text' : 'password'}
            disabled={disabled}
            required={required}
            value={value}
            defaultValue={defaultValue}
            aria-invalid={error || undefined}
            aria-required={required || undefined}
            aria-disabled={disabled || undefined}
            aria-describedby={describedBy}
            onChange={handleChange}
            className={cn(
              'm-0 h-[var(--scanner-leading-lg)] min-w-0 flex-1 border-none bg-transparent p-0 outline-none',
              typeBody02,
              valueText(disabled),
              placeholderText(disabled),
              disabled && 'cursor-not-allowed',
            )}
            {...inputProps}
          />

          <button
            type="button"
            data-part="visibility-toggle"
            onClick={toggleVisibility}
            disabled={disabled}
            aria-disabled={disabled || undefined}
            aria-controls={inputId}
            aria-pressed={isVisible}
            aria-label={isVisible ? 'Hide password' : 'Show password'}
            className={cn(
              fieldAction,
              'size-[var(--scanner-spacing-7)]',
              /* Figma: toggle appears when Filled, or while Focused */
              hasValue
                ? 'inline-flex'
                : 'hidden group-focus-within/field:inline-flex group-data-[state=focused]/field:inline-flex',
              disabled
                ? 'cursor-not-allowed text-[color:var(--scanner-icon-disabled)]'
                : 'cursor-pointer text-[color:var(--scanner-icon-tertiary)]',
            )}
          >
            {/* Figma "View on" (Visible=True) / "View off" (Visible=False), 24px */}
            <Icon name={isVisible ? 'view' : 'view-off'} size={24} />
          </button>
        </div>

        {showError && (
          <FieldMessage id={errorId} tone="error" className={typeLabel01}>
            {errorText}
          </FieldMessage>
        )}
        {showHelperText && (
          <FieldMessage id={helperId} tone="helper" disabled={disabled} className={typeLabel01}>
            {helperText}
          </FieldMessage>
        )}
      </div>
    );
  },
);

PasswordInput.displayName = 'PasswordInput';
