import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import type { KeyboardShortcutProps } from './keyboard-shortcut.types';

/**
 * _KeyboardShortcut — displays a keyboard shortcut as a series of styled key caps.
 *
 * @private This is a private sub-component; not exported from the package barrel.
 *
 * @example
 * <KeyboardShortcut keys={['⌘', 'K']} />
 * <KeyboardShortcut keys={['Ctrl', 'Shift', 'P']} />
 */
export const KeyboardShortcut = forwardRef<HTMLElement, KeyboardShortcutProps>(
  ({ keys, className, ...rest }, ref) => {
    return (
      <kbd
        ref={ref}
        className={cn(
          'inline-flex items-center gap-[var(--scanner-spacing-1)]',
          'font-[family-name:var(--scanner-font-sans)] text-[length:var(--scanner-text-xs)] font-[number:var(--scanner-font-regular)]',
          'leading-[var(--scanner-leading-xs)]',
          'text-[color:var(--scanner-text-secondary)]',
          className
        )}
        {...rest}
      >
        {keys.map((key, index) => (
          <kbd
            key={`${key}-${index}`}
            className={cn(
              'inline-flex items-center justify-center',
              'min-w-5 px-[var(--scanner-spacing-2)] py-0',
              'rounded-[var(--scanner-radius-sm)]',
              'border border-solid border-[var(--scanner-border-subtle)]',
              'bg-[var(--scanner-bg-secondary)]',
              'text-center text-[length:var(--scanner-text-xs)]',
              'leading-[var(--scanner-leading-xs)]',
              'select-none'
            )}
          >
            {key}
          </kbd>
        ))}
      </kbd>
    );
  }
);

KeyboardShortcut.displayName = 'KeyboardShortcut';
