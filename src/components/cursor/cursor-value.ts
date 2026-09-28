import type { CSSProperties } from 'react';
import { cursorAssets, cursorSvg } from './cursor-assets';
import type { CursorType } from './cursor.types';

/**
 * CSS `cursor` value for a Figma cursor: the exact 24×24 artwork as an SVG data URI with its hotspot,
 * falling back to the closest native keyword (e.g. `pointer`, `grab`, `ew-resize`).
 *
 * @example
 * <div style={{ cursor: cursorValue('hand-open') }} />
 * element.style.cursor = cursorValue('resize-width');
 */
export function cursorValue(type: CursorType): string {
  const { hotspot, fallback } = cursorAssets[type];
  return `url("data:image/svg+xml,${encodeURIComponent(cursorSvg(type))}") ${hotspot[0]} ${hotspot[1]}, ${fallback}`;
}

/** Inline style object applying a Figma cursor: `<div style={cursorStyle('text')} />`. */
export function cursorStyle(type: CursorType): Pick<CSSProperties, 'cursor'> {
  return { cursor: cursorValue(type) };
}
