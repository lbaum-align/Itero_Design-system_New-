import { forwardRef, useCallback } from 'react';
import { cn } from '../../utils/cn';
import type { ToggleProps } from './toggle.types';

/**
 * Scanner Toggle — a switch control for binary on/off values.
 *
 * @example
 * <Toggle selected={checked} onChange={setChecked} />
 * <Toggle disabled />
 */
export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      selected = false,
      onChange,
      disabled = false,
      skeleton = false,
      className,
      name,
      'aria-label': ariaLabel,
      ...rest
    },
    ref
  ) => {
    const handleClick = useCallback(() => {
      if (!disabled && !skeleton) {
        onChange?.(!selected);
      }
    }, [disabled, skeleton, onChange, selected]);

    if (skeleton) {
      return (
        <div
          className={cn(
            'inline-flex h-5 w-[36px] rounded-full bg-[var(--scanner-gray-alpha-10)]',
            'animate-pulse',
            className
          )}
          aria-hidden="true"
        />
      );
    }

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={selected}
        aria-label={ariaLabel}
        disabled={disabled}
        name={name}
        onClick={handleClick}
        className={cn(
          // Base
          'group relative inline-flex h-5 w-[36px] shrink-0 cursor-pointer items-center rounded-full',
          'transition-colors duration-200 ease-in-out',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--scanner-focus-ring)]',
          // Track color
          selected
            ? 'bg-[var(--scanner-action-primary)]'
            : 'bg-[var(--scanner-gray-alpha-25)]',
          // Hover track
          selected
            ? 'hover:bg-[var(--scanner-action-primary-hover)]'
            : 'hover:bg-[var(--scanner-gray-alpha-35)]',
          // Disabled
          disabled && 'cursor-not-allowed opacity-40',
          className
        )}
        data-state={selected ? 'checked' : 'unchecked'}
        {...rest}
      >
        {/* Thumb */}
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none inline-block size-4 rounded-full bg-white shadow-sm',
            'transform transition-transform duration-200 ease-in-out',
            selected ? 'translate-x-[18px]' : 'translate-x-[2px]',
            // Active / pressed state
            'group-active:w-5',
            selected ? 'group-active:translate-x-[14px]' : 'group-active:translate-x-[2px]'
          )}
        />
      </button>
    );
  }
);

Toggle.displayName = 'Toggle';
