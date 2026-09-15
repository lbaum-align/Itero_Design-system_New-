/*
 * Figma icons used by the Stepper family (page Stepper 34201:1155), rendered from the shared icon registry:
 * "Number outline / 1–8" and "Number filled / 1–8" (_Step counter 34201:2238), "Checkmark outline" and
 * "Error" (stepper item indicators). 24×24 in Figma; sized via `className` and coloured with `currentColor`.
 */
import { Icon, stepNumberIconName } from '../../icons';
import type { IconProps, IconStepNumber } from '../../icons';
import { clampStep } from './step-utils';

type GlyphIconProps = Omit<IconProps, 'name' | 'size'>;

/** Figma "Number outline / N" (`filled=false`) or "Number filled / N" (`filled=true`). */
export function NumberIcon({ step, filled = false, ...rest }: GlyphIconProps & { step: number; filled?: boolean }) {
  const clamped = clampStep(step) as IconStepNumber;
  return <Icon name={stepNumberIconName(clamped, filled)} size={24} data-step={clamped} {...rest} />;
}

/** Figma "Checkmark outline" — Completed indicator. */
export function CheckmarkOutlineIcon(props: GlyphIconProps) {
  return <Icon name="checkmark-outline" size={24} {...props} />;
}

/** Figma "Error" — Error indicator. */
export function ErrorFilledIcon(props: GlyphIconProps) {
  return <Icon name="error" size={24} {...props} />;
}
