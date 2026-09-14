/**
 * Scanner Design System — Token Types
 * Generated from Figma foundation files (Phase 1)
 */

/** Spacing scale: `--scanner-spacing-{n}` where n = 1..11 */
export type SpacingToken =
  | 'spacing-1'
  | 'spacing-2'
  | 'spacing-3'
  | 'spacing-4'
  | 'spacing-5'
  | 'spacing-6'
  | 'spacing-7'
  | 'spacing-8'
  | 'spacing-9'
  | 'spacing-10'
  | 'spacing-11';

/** Border radius: `--scanner-radius-{size}` */
export type RadiusToken =
  | 'radius-none'
  | 'radius-sm'
  | 'radius-md'
  | 'radius-lg'
  | 'radius-xl'
  | 'radius-2xl'
  | 'radius-3xl'
  | 'radius-full';

/** Font size: `--scanner-text-{size}` */
export type FontSizeToken =
  | 'text-xs'
  | 'text-sm'
  | 'text-md'
  | 'text-lg'
  | 'text-xl'
  | 'text-2xl'
  | 'text-3xl'
  | 'text-4xl'
  | 'text-5xl'
  | 'text-6xl'
  | 'text-7xl';

/** Line height: `--scanner-leading-{size}` */
export type LineHeightToken =
  | 'leading-xs'
  | 'leading-sm'
  | 'leading-md'
  | 'leading-lg'
  | 'leading-xl'
  | 'leading-2xl'
  | 'leading-3xl'
  | 'leading-4xl'
  | 'leading-5xl'
  | 'leading-6xl'
  | 'leading-7xl';

/** Font weight: `--scanner-font-{weight}` */
export type FontWeightToken = 'font-regular' | 'font-medium' | 'font-bold';

/** Font family: `--scanner-font-{family}` */
export type FontFamilyToken = 'font-sans' | 'font-mono';

/** Background semantic color tokens */
export type BgColorToken =
  | 'bg-primary'
  | 'bg-secondary'
  | 'bg-tertiary'
  | 'bg-inverse'
  | 'bg-brand'
  | 'bg-brand-hover'
  | 'bg-brand-active'
  | 'bg-destructive'
  | 'bg-destructive-hover'
  | 'bg-destructive-active'
  | 'bg-hover'
  | 'bg-active'
  | 'bg-selected'
  | 'bg-disabled'
  | 'bg-overlay'
  | 'bg-elevated'
  | 'bg-on-color'
  | 'bg-highlight-blue'
  | 'bg-highlight-green'
  | 'bg-highlight-red'
  | 'bg-highlight-orange'
  | 'bg-highlight-purple'
  | 'bg-highlight-magenta';

/** Text semantic color tokens */
export type TextColorToken =
  | 'text-primary'
  | 'text-secondary'
  | 'text-tertiary'
  | 'text-disabled'
  | 'text-inverse'
  | 'text-inverse-secondary'
  | 'text-inverse-tertiary'
  | 'text-on-color'
  | 'text-on-color-secondary'
  | 'text-on-color-tertiary'
  | 'text-link'
  | 'text-error'
  | 'text-success'
  | 'text-warning';

/** Border semantic color tokens */
export type BorderColorToken =
  | 'border-default'
  | 'border-subtle'
  | 'border-strong'
  | 'border-inverse'
  | 'border-interactive'
  | 'border-error'
  | 'border-success'
  | 'border-warning'
  | 'border-hover'
  | 'border-active'
  | 'border-disabled'
  | 'border-focus';

/** Icon semantic color tokens */
export type IconColorToken =
  | 'icon-primary'
  | 'icon-secondary'
  | 'icon-tertiary'
  | 'icon-disabled'
  | 'icon-inverse'
  | 'icon-on-color'
  | 'icon-link'
  | 'icon-error'
  | 'icon-success'
  | 'icon-warning';

/** Status tokens */
export type StatusToken =
  | 'status-danger'
  | 'status-danger-bg'
  | 'status-success'
  | 'status-success-bg'
  | 'status-warning'
  | 'status-warning-bg'
  | 'status-info'
  | 'status-info-bg';

/** Shadow tokens */
export type ShadowToken =
  | 'shadow-none'
  | 'shadow-depth-01'
  | 'shadow-depth-02'
  | 'shadow-depth-03';

/**
 * Named text style — matches Figma's 27 published text styles.
 * Use as a CSS class: `.scanner-text-{style}`
 */
export type TextStyle =
  | 'code-01'
  | 'code-02'
  | 'label-01'
  | 'label-02'
  | 'label-03'
  | 'body-01'
  | 'body-02'
  | 'body-03'
  | 'body-04'
  | 'link-01'
  | 'link-02'
  | 'heading-01'
  | 'heading-02'
  | 'heading-03'
  | 'heading-04'
  | 'heading-05'
  | 'heading-06'
  | 'display-regular-01'
  | 'display-regular-02'
  | 'display-regular-03'
  | 'display-regular-04'
  | 'display-regular-05'
  | 'display-bold-01'
  | 'display-bold-02'
  | 'display-bold-03'
  | 'display-bold-04'
  | 'display-medium-01'
  | 'display-medium-02'
  | 'display-medium-03'
  | 'display-medium-04';

/** Primitive color scale names (for palette documentation, not direct usage) */
export type PrimitiveColor =
  | 'neutral'
  | 'blue'
  | 'purple'
  | 'red'
  | 'green'
  | 'orange'
  | 'magenta';
