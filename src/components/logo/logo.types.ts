import type { SVGAttributes } from 'react';

/** Figma "Variation" */
export type LogoVariation =
  | 'align'
  | 'align-xray-insight'
  | 'invisalign'
  | 'invisalign-first'
  | 'vivera-retainers'
  | 'itero-exocad'
  | 'all-logos'
  | 'itero';

export interface LogoProps extends Omit<SVGAttributes<SVGSVGElement>, 'children'> {
  /** Figma "Variation". @default 'align' (Figma default) */
  variation?: LogoVariation;
  /**
   * Rendered height in px; width scales with the artwork's aspect ratio.
   * @default 28 (Figma)
   */
  height?: number;
  /** Accessible name. Defaults to the brand name(s) of the variation. */
  label?: string;
  /** Hide from assistive technology (e.g. when adjacent text already names the product). */
  decorative?: boolean;
  /** Additional CSS class names */
  className?: string;
}
