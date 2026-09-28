import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { logoArtwork } from './logo-artwork';
import type { LogoTone } from './logo-artwork';
import { logoLabels } from './logo-labels';
import type { LogoProps } from './logo.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → Logo (node 13355:4609, page "Logos").
 * Variation: Align, Align X-ray insight, Invisalign, Invisalign first, iTero, Vivera retainers,
 * iTero + Exocad, All logos = 8 variants. All 28px tall.
 *
 * Every region of the logo vectors is bound to a colour variable in Figma, so the artwork follows the theme:
 * wordmarks `icon-primary`, the Align dot `icon-link`, Invisalign star rays `icon-secondary` / `icon-tertiary`.
 */

const toneClass: Record<LogoTone, string> = {
  P: 'fill-[var(--scanner-icon-primary)]',
  S: 'fill-[var(--scanner-icon-secondary)]',
  T: 'fill-[var(--scanner-icon-tertiary)]',
  L: 'fill-[var(--scanner-icon-link)]',
};

/** Figma frame height of every variation. */
const FIGMA_HEIGHT = 28;

/**
 * Logo — Align Technology product logos as theme-aware inline SVG.
 *
 * @example
 * <Logo variation="itero" />
 * <Logo variation="all-logos" height={20} />
 * <Logo variation="invisalign" decorative />
 */
export const Logo = forwardRef<SVGSVGElement, LogoProps>(
  (
    { variation = 'align', height = FIGMA_HEIGHT, label, decorative = false, className, ...rest },
    ref,
  ) => {
    const art = logoArtwork[variation];
    const width = Math.round(((art.width * height) / art.height) * 100) / 100;
    const name = label ?? logoLabels[variation];

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={art.viewBox}
        width={width}
        height={height}
        fill="none"
        data-variation={variation}
        role={decorative ? undefined : 'img'}
        aria-label={decorative ? undefined : name}
        aria-hidden={decorative || undefined}
        focusable="false"
        className={cn('inline-block shrink-0 align-middle', className)}
        {...rest}
      >
        {art.paths.map((d, i) => (
          <path key={i} d={d} className={toneClass[art.tones[i] as LogoTone]} />
        ))}
      </svg>
    );
  },
);

Logo.displayName = 'Logo';
