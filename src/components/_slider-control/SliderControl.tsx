import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { TooltipBubble } from '../tooltip';
import type { SliderControlProps } from './slider-control.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → _Slider control (node 18362:19166, page "Slider" 18362:19162)
 * States: Enabled, Focused, Pressed, Disabled (4 variants) + "Value" boolean.
 *
 * Anatomy: 32×32 box · 28px ring with a 2px stroke (transparent inside — the track stops at the box edges).
 * Enabled `icon-tertiary` · Focused `icon-link` · Pressed `icon-link` ring + 16px `icon-link` dot + value tooltip
 * (01 Tooltip, caret pointing down, 1px above the box) · Disabled `icon-disabled`.
 * Figma exports the ring as a vector; it is drawn with CSS here (same geometry, colour follows the tokens).
 */

/**
 * _SliderControl — private handle of `Slider`. Renders the visual handle and forwards every other prop
 * (`role="slider"`, `aria-*`, `tabIndex`, key handlers) to its root, so `Slider` owns the behaviour.
 *
 * @example
 * <SliderControl role="slider" tabIndex={0} aria-valuenow={50} pressed={dragging} valueText="50" />
 */
export const SliderControl = forwardRef<HTMLDivElement, SliderControlProps>(
  (
    { pressed = false, disabled = false, showValue = true, valueText, className, 'data-state': dataState, ...rest },
    ref,
  ) => {
    const isPressed = !disabled && (pressed || dataState === 'pressed');

    return (
      <div
        ref={ref}
        data-state={dataState}
        data-pressed={isPressed ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        aria-disabled={disabled || undefined}
        className={cn(
          'group relative flex size-[var(--scanner-slider-handle-size)] shrink-0 items-center justify-center',
          'rounded-[var(--scanner-radius-full)] outline-none select-none touch-none',
          disabled ? 'cursor-not-allowed' : isPressed ? 'cursor-grabbing' : 'cursor-grab',
          className,
        )}
        {...rest}
      >
        <span
          aria-hidden="true"
          data-part="ring"
          className={cn(
            'flex size-[var(--scanner-slider-handle-ring-size)] items-center justify-center',
            'rounded-[var(--scanner-radius-full)] border-solid border-[length:var(--scanner-slider-handle-ring-width)]',
            'transition-colors duration-100',
            disabled
              ? 'border-[color:var(--scanner-icon-disabled)]'
              : isPressed
                ? 'border-[color:var(--scanner-icon-link)]'
                : cn(
                    'border-[color:var(--scanner-icon-tertiary)]',
                    'group-focus-visible:border-[color:var(--scanner-icon-link)] group-data-[state=focused]:border-[color:var(--scanner-icon-link)]',
                  ),
          )}
        >
          {isPressed && (
            <span
              data-part="dot"
              className="size-[var(--scanner-slider-handle-dot-size)] rounded-[var(--scanner-radius-full)] bg-[var(--scanner-icon-link)]"
            />
          )}
        </span>

        {isPressed && showValue && valueText !== undefined && valueText !== null && valueText !== '' && (
          <TooltipBubble
            aria-hidden="true"
            data-part="value-tooltip"
            placement="top"
            alignment="middle"
            className={cn(
              'pointer-events-none absolute left-1/2 z-10 -translate-x-1/2',
              'bottom-[calc(100%+var(--scanner-slider-tooltip-offset))]',
            )}
          >
            {valueText}
          </TooltipBubble>
        )}
      </div>
    );
  },
);

SliderControl.displayName = 'SliderControl';
