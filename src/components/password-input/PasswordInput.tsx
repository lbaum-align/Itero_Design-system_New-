import { forwardRef, useId, useState, useCallback } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../../icons';
import { Link } from '../link';
import { IconTriggerTooltip } from '../icon-trigger-tooltip';
import type { PasswordInputProps } from './password-input.types';

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * PasswordInput — a form field for password entry with show/hide toggle.
 *
 * Features label, required indicator, explainer tooltip, "Forgot password?"
 * link, helper/error text, and a visibility toggle button.
 *
 * Figma: "Password input" (page "Password input", node 6176:2285)
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
      onPasswordVisibleChange,
      disabled = false,
      className,
      id: providedId,
      'aria-describedby': ariaDescribedBy,
      ...inputProps
    },
    ref,
  ) => {
    const autoId = useId();
    const inputId = providedId ?? autoId;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    /* ---- Visibility state (controlled / uncontrolled) ---- */
    const [internalVisible, setInternalVisible] = useState(false);
    const isVisible = controlledVisible ?? internalVisible;

    const toggleVisibility = useCallback(() => {
      const next = !isVisible;
      if (onPasswordVisibleChange) {
        onPasswordVisibleChange(next);
      } else {
        setInternalVisible(next);
      }
    }, [isVisible, onPasswordVisibleChange]);

    /* ---- Derived values ---- */
    const dataState = skeleton
      ? 'skeleton'
      : disabled
        ? 'disabled'
        : error
          ? 'error'
          : undefined;

    const describedBy =
      ariaDescribedBy ?? (error ? errorId : showHelper ? helperId : undefined);

    /* ================================================================ */
    /*  Skeleton                                                         */
    /* ================================================================ */
    if (skeleton) {
      return (
        <div
          className={cn('flex flex-col items-start w-full', className)}
          data-state="skeleton"
          data-layer={layer}
        >
          {/* Skeleton label */}
          {showLabel && (
            <div className="flex items-start gap-[var(--scanner-spacing-2)] pb-[var(--scanner-spacing-3)]">
              <div
                className="w-[40px] h-[16px] bg-[var(--scanner-bg-disabled)]"
                aria-hidden="true"
              />
              {showExplainer && (
                <div
                  className="size-[16px] rounded-full bg-[var(--scanner-bg-disabled)]"
                  aria-hidden="true"
                />
              )}
            </div>
          )}

          {/* Skeleton field */}
          <div
            className="w-full h-[60px] rounded-[var(--scanner-radius-md)] bg-[var(--scanner-bg-disabled)]"
            aria-hidden="true"
          />

          {/* Skeleton helper */}
          {showHelper && (
            <div className="pt-[var(--scanner-spacing-3)]">
              <div
                className="w-[40px] h-[16px] bg-[var(--scanner-bg-disabled)]"
                aria-hidden="true"
              />
            </div>
          )}
        </div>
      );
    }

    /* ================================================================ */
    /*  Normal / Error / Disabled / Focused                              */
    /* ================================================================ */
    return (
      <div
        className={cn('flex flex-col items-start w-full', className)}
        data-state={dataState}
        data-layer={layer}
      >
        {/* ---- Label + Link row ---- */}
        {(showLabel || showLink) && (
          <div className="flex items-start justify-end w-full">
            {showLabel && (
              <label
                htmlFor={inputId}
                className={cn(
                  'flex flex-1 min-w-0 items-start',
                  'gap-[var(--scanner-spacing-2)]',
                  'pb-[var(--scanner-spacing-3)]',
                  'font-[family-name:var(--scanner-font-sans)]',
                  /* 16px label — no exact token; shared across all form fields */
                  'text-[16px] leading-[var(--scanner-leading-md)]',
                  'font-[var(--scanner-font-regular)]',
                  disabled
                    ? 'text-[color:var(--scanner-text-tertiary)]'
                    : 'text-[color:var(--scanner-text-primary)]',
                )}
              >
                <span>{label}</span>

                {required && (
                  <span
                    className={cn(
                      'text-[length:var(--scanner-text-xs)]',
                      'leading-[var(--scanner-leading-xs)]',
                      'text-[color:var(--scanner-text-error)]',
                    )}
                    aria-hidden="true"
                  >
                    *
                  </span>
                )}

                {showExplainer && explainerContent && (
                  <IconTriggerTooltip content={explainerContent} />
                )}
              </label>
            )}

            {showLink && (
              <div
                className={cn(
                  'flex items-center justify-center shrink-0',
                  'pb-[var(--scanner-spacing-3)] pl-[var(--scanner-spacing-3)]',
                )}
              >
                <Link
                  type="primary"
                  size="medium"
                  href={linkHref}
                  onClick={onLinkClick}
                  className="text-[16px] leading-[var(--scanner-leading-md)] whitespace-nowrap"
                >
                  {linkText}
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ---- Input field ---- */}
        <div
          className={cn(
            'flex items-center w-full',
            'gap-[var(--scanner-spacing-3)]',
            'px-[var(--scanner-spacing-5)] py-[var(--scanner-spacing-5)]',
            'rounded-[var(--scanner-radius-md)]',
            'overflow-clip',
            /* Background per layer set */
            layer === 2
              ? 'bg-[var(--scanner-bg-secondary)]'
              : 'bg-[var(--scanner-bg-primary)]',
            /* Border — use transparent default to prevent layout shift */
            'border border-solid',
            error
              ? 'border-[var(--scanner-border-error)]'
              : [
                  'border-transparent',
                  !disabled &&
                    'focus-within:border-[var(--scanner-border-focus)]',
                ],
            'transition-colors duration-150',
          )}
        >
          <input
            ref={ref}
            id={inputId}
            type={isVisible ? 'text' : 'password'}
            disabled={disabled}
            required={required}
            aria-invalid={error || undefined}
            aria-describedby={describedBy}
            className={cn(
              'flex-1 min-w-0 bg-transparent outline-none border-none p-0',
              'font-[family-name:var(--scanner-font-sans)]',
              /* 18px field text — no exact token; shared across form inputs */
              'text-[18px] leading-[var(--scanner-leading-lg)]',
              'font-[var(--scanner-font-regular)]',
              disabled
                ? 'text-[color:var(--scanner-text-tertiary)] cursor-not-allowed'
                : 'text-[color:var(--scanner-icon-primary)]',
              disabled
                ? 'placeholder:text-[color:var(--scanner-text-tertiary)]'
                : 'placeholder:text-[color:var(--scanner-text-secondary)]',
            )}
            {...inputProps}
          />

          <button
            type="button"
            onClick={toggleVisibility}
            disabled={disabled}
            aria-label={isVisible ? 'Hide password' : 'Show password'}
            className={cn(
              'inline-flex items-center justify-center shrink-0',
              'size-[24px] bg-transparent border-none outline-none p-0',
              disabled
                ? 'text-[color:var(--scanner-icon-disabled)] cursor-not-allowed'
                : 'text-[color:var(--scanner-icon-secondary)] cursor-pointer',
              'focus-visible:outline-2 focus-visible:outline-offset-2',
              'focus-visible:outline-[var(--scanner-focus-ring)]',
              'focus-visible:rounded-[var(--scanner-radius-sm)]',
            )}
          >
            <Icon name={isVisible ? 'eye' : 'eye-off'} size={24} />
          </button>
        </div>

        {/* ---- Error text ---- */}
        {error && (
          <div
            id={errorId}
            className="flex items-start pt-[var(--scanner-spacing-3)] w-full"
            role="alert"
          >
            <p
              className={cn(
                'flex-1 min-w-0 m-0',
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

        {/* ---- Helper text ---- */}
        {!error && showHelper && (
          <div
            id={helperId}
            className="flex items-center pt-[var(--scanner-spacing-3)] w-full"
          >
            <p
              className={cn(
                'flex-1 min-w-0 m-0',
                'font-[family-name:var(--scanner-font-sans)]',
                'text-[16px] leading-[var(--scanner-leading-md)]',
                'font-[var(--scanner-font-regular)]',
                disabled
                  ? 'text-[color:var(--scanner-text-tertiary)]'
                  : 'text-[color:var(--scanner-text-primary)]',
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

PasswordInput.displayName = 'PasswordInput';
