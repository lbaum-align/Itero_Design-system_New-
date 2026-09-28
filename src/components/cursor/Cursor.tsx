import { forwardRef, useId } from 'react';
import { cn } from '../../utils/cn';
import { cursorAssets } from './cursor-assets';
import type { CursorProps } from './cursor.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → Cursor (node 24097:47335, page "Logos").
 * Type: Pointer, Pointer pressed, Hand open, Hand closed, Text, Text pressed, Arrow, Arrow not allowed,
 * Resize width, Resize height, Resize diagonal = 11 variants, 24×24.
 *
 * Two forms (see docs/figma/signoff/cursor.md):
 * - `cursorValue(type)` / `cursorStyle(type)` — apply the Figma cursor to real UI via CSS `cursor`
 *   (SVG data URI + hotspot + native keyword fallback). This is what product code should use.
 * - `<Cursor type />` — renders the cursor glyph inline for documentation, onboarding hints and prototypes.
 */

/**
 * Cursor — inline glyph of a Figma cursor. To change the mouse pointer use `cursorValue()` instead.
 *
 * @example
 * <Cursor type="hand-open" label="Drag to pan" />
 */
export const Cursor = forwardRef<SVGSVGElement, CursorProps>(
  ({ type = 'pointer', size = 24, label, className, ...rest }, ref) => {
    /* Filter ids must be unique per instance in the document */
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
    const markup = cursorAssets[type].markup.replaceAll(
      'scanner_cursor_',
      `scanner_cursor_${uid}_`,
    );

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        data-cursor={type}
        role={label ? 'img' : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : true}
        focusable="false"
        className={cn('inline-block shrink-0 overflow-visible', className)}
        /* Static, trusted Figma export (cursor-assets.ts) — no user input */
        dangerouslySetInnerHTML={{ __html: markup }}
        {...rest}
      />
    );
  },
);

Cursor.displayName = 'Cursor';
