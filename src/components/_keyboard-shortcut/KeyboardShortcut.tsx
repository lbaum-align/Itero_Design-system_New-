import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { GLYPHS, resolveGlyph } from './keyboard-shortcut.glyphs';
import type { KeyboardShortcutProps } from './keyboard-shortcut.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → _Keyboard shortcut (node 30412:28270, page "Logos").
 * A right-aligned row with no gap: 16×16 modifier glyphs (icon-secondary) and 12/16 key letters (text-secondary).
 * There are no key caps. Glyph paths are the Figma vectors, placed at their Figma offsets in the 16×16 frame.
 */

/**
 * _KeyboardShortcut — the key combination shown at the end of a menu item (Figma "_Keyboard shortcut").
 *
 * @private Private sub-component; not exported from the package barrel.
 *
 * @example
 * <KeyboardShortcut keys={['⌘', 'X']} />
 * <KeyboardShortcut keys={['⇧', '⌘', 'Z']} />
 */
export const KeyboardShortcut = forwardRef<HTMLElement, KeyboardShortcutProps>(
  ({ keys, disabled = false, className, ...rest }, ref) => (
    <kbd
      ref={ref}
      data-disabled={disabled ? '' : undefined}
      className={cn(
        'inline-flex items-center justify-end',
        'font-[family-name:var(--scanner-font-sans)] font-[number:var(--scanner-font-regular)]',
        'text-[length:var(--scanner-text-xs)] leading-[var(--scanner-leading-xs)]',
        disabled ? 'text-[color:var(--scanner-text-disabled)]' : 'text-[color:var(--scanner-text-secondary)]',
        'select-none whitespace-nowrap',
        className,
      )}
      {...rest}
    >
      {keys.map((key, index) => {
        const glyph = resolveGlyph(key);
        if (!glyph) {
          return (
            <kbd key={`${key}-${index}`} className="font-[inherit]">
              {key}
            </kbd>
          );
        }
        const g = GLYPHS[glyph];
        return (
          <kbd key={`${key}-${index}`} data-glyph={glyph} className="inline-flex font-[inherit]">
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              fill="none"
              className={cn(
                'size-[var(--scanner-keyboard-shortcut-glyph-size)] shrink-0',
                disabled ? 'text-[color:var(--scanner-icon-disabled)]' : 'text-[color:var(--scanner-icon-secondary)]',
              )}
            >
              <path transform={`translate(${g.x} ${g.y})`} d={g.path} fill="currentColor" />
            </svg>
            <span className="sr-only">{g.label}</span>
          </kbd>
        );
      })}
    </kbd>
  ),
);

KeyboardShortcut.displayName = 'KeyboardShortcut';
