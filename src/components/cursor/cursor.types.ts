import type { SVGAttributes } from 'react';

/** Figma "Type" */
export type CursorType =
  | 'pointer'
  | 'pointer-pressed'
  | 'hand-open'
  | 'hand-closed'
  | 'text'
  | 'text-pressed'
  | 'arrow'
  | 'arrow-not-allowed'
  | 'resize-width'
  | 'resize-height'
  | 'resize-diagonal';

export interface CursorProps extends Omit<SVGAttributes<SVGSVGElement>, 'children' | 'type'> {
  /** Figma "Type". @default 'pointer' (Figma default) */
  type?: CursorType;
  /** Rendered size in px (square). @default 24 (Figma artboard) */
  size?: number;
  /** Accessible name. Without it the glyph is decorative (`aria-hidden`). */
  label?: string;
  /** Additional CSS class names */
  className?: string;
}
