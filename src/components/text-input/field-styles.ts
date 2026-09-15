import { cn } from '../../utils/cn';

/*
 * Shared field styling for TextInput, TextArea and PasswordInput.
 * Figma: the three components share the Label / Required / Explainer / Counter|Link / Field / Helper|Error anatomy.
 * Private — not exported from the package barrel.
 *
 * Field strokes are drawn as inset box-shadows: Figma strokes sit inside the box, so a CSS border would shift layout.
 */

export type FieldLayer = 1 | 2;

/** Figma "Layer set": Set 01 → background-layer-01, Set 02 → background-layer-02 */
export const fieldBackground: Record<FieldLayer, string> = {
  1: 'bg-[var(--scanner-bg-layer-01)]',
  2: 'bg-[var(--scanner-bg-layer-02)]',
};

const strokeFocus =
  'focus-within:shadow-[inset_0_0_0_1px_var(--scanner-border-focus)] data-[state=focused]:shadow-[inset_0_0_0_1px_var(--scanner-border-focus)]';
const strokeError = 'shadow-[inset_0_0_0_1px_var(--scanner-border-error)]';
const strokeSubtle = 'shadow-[inset_0_0_0_1px_var(--scanner-border-subtle)]';

/**
 * Field stroke per state.
 * - Enabled: none (TextInput / PasswordInput) or `border-subtle` (TextArea — `subtle: true`)
 * - Focused: `border-focus` (`:focus-within` or forced `data-state="focused"`)
 * - Error: `border-error` (kept while focused — Figma has no Error+Focused variant)
 * - Disabled: none
 */
export function fieldStroke({
  error,
  disabled,
  subtle = false,
}: {
  error: boolean;
  disabled: boolean;
  subtle?: boolean;
}): string {
  if (disabled) return '';
  if (error) return strokeError;
  return cn(subtle && strokeSubtle, strokeFocus);
}

/** Label / counter / helper text colour. */
export const secondaryText = (disabled: boolean) =>
  disabled ? 'text-[color:var(--scanner-text-disabled)]' : 'text-[color:var(--scanner-text-secondary)]';

/** Typed value colour. */
export const valueText = (disabled: boolean) =>
  disabled ? 'text-[color:var(--scanner-text-disabled)]' : 'text-[color:var(--scanner-text-primary)]';

/** Placeholder colour. */
export const placeholderText = (disabled: boolean) =>
  disabled
    ? 'placeholder:text-[color:var(--scanner-text-disabled)]'
    : 'placeholder:text-[color:var(--scanner-text-tertiary)]';

/** Figma `Label/$tp-label-01` 16/24 */
export const typeLabel01 = 'text-[length:var(--scanner-text-base)] leading-[var(--scanner-leading-md)]';
/** Figma `Body/$tp-body-02` 18/28 */
export const typeBody02 = 'text-[length:var(--scanner-text-scanner-md)] leading-[var(--scanner-leading-lg)]';
/** Figma 12/16 — counter and required asterisk */
export const typeXs = 'text-[length:var(--scanner-text-xs)] leading-[var(--scanner-leading-xs)]';
/** Figma 14/20 */
export const typeSm = 'text-[length:var(--scanner-text-sm)] leading-[var(--scanner-leading-sm)]';

/** Root wrapper shared by all three fields. */
export const fieldRoot = cn(
  'flex w-full flex-col items-start',
  'font-[family-name:var(--scanner-font-sans)] font-[number:var(--scanner-font-regular)]',
);

/** Skeleton fill (Figma `background-highlight-gray`). */
export const skeletonFill = 'animate-pulse bg-[var(--scanner-bg-highlight-gray)]';

/** Small inline action inside the field (clear / visibility toggle). */
export const fieldAction = cn(
  'inline-flex shrink-0 items-center justify-center rounded-[var(--scanner-radius-sm)]',
  'outline-none focus-visible:shadow-[0_0_0_2px_var(--scanner-border-focus)]',
);
