import type { HTMLAttributes, ReactNode } from 'react';
import type { NumberInputProps } from '../number-input';

/** `[start, end]` value of a ranged slider. */
export type SliderRange = [number, number];

/** Figma "State" values of the Slider set. Enabled is the default; Disabled and Skeleton have their own props. */
export type SliderState = 'enabled' | 'disabled' | 'skeleton';

/** Handle states that can be forced on every handle via `data-state` (Storybook / visual tests). */
export type SliderForcedState = 'focused' | 'pressed';

export interface SliderBaseProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'children'> {
  /** Minimum value. Default `0`. */
  min?: number;
  /** Maximum value. Default `100`. */
  max?: number;
  /** Step for dragging and arrow keys (PageUp/PageDown move 10 × step). Default `1`. */
  step?: number;
  /** Figma "Layer set": 1 → Set 01, 2 → Set 02 — background of the editable number inputs. */
  layer?: 1 | 2;
  /** Figma "Label text value". Omit for "Show label: False". */
  label?: string;
  /** Figma "Show explainer" — tooltip content for the explainer icon next to the label. */
  explainer?: string;
  /** Figma "Show value" — min / max values below the track. Default `true`. */
  showValue?: boolean;
  /** Figma "Start number value". Default: `min` (formatted). */
  startValueText?: ReactNode;
  /** Figma "End number value". Default: `max` (formatted). */
  endValueText?: ReactNode;
  /** Figma "Editable" — number input(s) above the track, kept in sync with the handle(s). */
  editable?: boolean;
  /** Figma _Slider control "Value" — show the value tooltip above a handle while it is dragged. Default `true`. */
  showTooltip?: boolean;
  /** Formats values for the tooltip, `aria-valuetext` and the default start/end texts. */
  formatValue?: (value: number) => string;
  /** Accessible name of the (start) handle when there is no label, or of the start handle of a ranged slider. */
  startHandleLabel?: string;
  /** Accessible name of the end handle of a ranged slider. */
  endHandleLabel?: string;
  /** Extra props for the (start) number input when `editable`. */
  numberInputProps?: Partial<NumberInputProps>;
  /** Extra props for the end number input of a ranged, editable slider. */
  endNumberInputProps?: Partial<NumberInputProps>;
  /** Figma State=Disabled. */
  disabled?: boolean;
  /** Figma State=Skeleton — loading placeholder. */
  skeleton?: boolean;
  /** Force a handle state (Figma _Slider control Focused / Pressed) for screenshots / Storybook. */
  'data-state'?: SliderForcedState;
  /** Additional CSS class names on the root. */
  className?: string;
}

export interface SliderSingleProps extends SliderBaseProps {
  /** Figma "Ranged: False" — one handle. */
  ranged?: false;
  /** Current value (controlled). */
  value?: number;
  /** Initial value (uncontrolled). Default `min`. */
  defaultValue?: number;
  /** Called with the new value on drag, track click, keyboard or number input. */
  onChange?: (value: number) => void;
}

export interface SliderRangeProps extends SliderBaseProps {
  /** Figma "Ranged: True" — start and end handles that can't cross. */
  ranged: true;
  /** Current `[start, end]` (controlled). */
  value?: SliderRange;
  /** Initial `[start, end]` (uncontrolled). Default `[min, max]`. */
  defaultValue?: SliderRange;
  /** Called with the new `[start, end]`. */
  onChange?: (value: SliderRange) => void;
}

export type SliderProps = SliderSingleProps | SliderRangeProps;
