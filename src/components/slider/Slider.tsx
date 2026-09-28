import { forwardRef, useId, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent, PointerEvent } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../../icons';
import { SliderControl } from '../_slider-control';
import { IconTriggerTooltip } from '../icon-trigger-tooltip';
import { NumberInput } from '../number-input';
import { skeletonFill, typeBody02 } from '../text-input/field-styles';
import type { SliderProps, SliderRange } from './slider.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → Slider (node 17867:9913, page "Slider" 18362:19162)
 * 2 Layer sets × Ranged (False, True) × State (Enabled, Disabled, Skeleton) = 12 variants,
 * + Show label, Show value, Editable, Show explainer, Label / Start / End number values.
 *
 * Anatomy (vertical): Label (+ Explainer) · pb 8 → [Editable number input(s) · gap 8] → Slider:
 * Indication row (60px: Line · handle · Line [· handle · Line]) · gap 4 · Value row (start / end, 18/28).
 * Lines are 4px bars that stop at the 32px handles: filled segment `border-interactive`, the rest `border-subtle`,
 * all `border-disabled` when disabled. Outer line ends have a 4px radius.
 * Handle geometry: with N handles the usable width is `100% − N × 32px`; handle i sits at `usable × p + i × 32px`,
 * so ranged handles can touch but never overlap (Figma: 85.3 · 32 · 85.3 · 32 · 85.3).
 * Layer set only changes the number inputs' background.
 */

const HANDLE = 'var(--scanner-slider-handle-size)';

const decimals = (n: number) => {
  const s = String(n);
  const i = s.indexOf('.');
  return i === -1 ? 0 : s.length - i - 1;
};

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** Horizontal offset of a point at fraction `p` of the usable width, shifted by `shift` handle widths. */
const offset = (count: number, p: number, shift: number) =>
  `calc((100% - ${HANDLE} * ${count}) * ${p} + ${HANDLE} * ${shift})`;

/**
 * Scanner Slider — select a value or a range by dragging a handle along a track.
 *
 * Figma props → React: Layer set → `layer`, Ranged → `ranged`, State → `disabled` / `skeleton`,
 * Show label + Label text value → `label`, Show explainer → `explainer`, Show value → `showValue`
 * (+ `startValueText` / `endValueText`), Editable → `editable`.
 *
 * WAI-ARIA slider: each handle is `role="slider"` with `aria-valuemin/max/now/valuetext` (ranged handles are
 * bounded by each other). Keyboard: ArrowRight/ArrowUp +step, ArrowLeft/ArrowDown −step, PageUp/PageDown ±10 steps,
 * Home/End jump to the bounds. Pointer: drag a handle or press anywhere on the track (nearest handle moves).
 *
 * @example
 * <Slider label="Volume" defaultValue={50} />
 * <Slider ranged label="Price" min={0} max={1000} step={10} value={range} onChange={setRange} editable />
 */
export const Slider = forwardRef<HTMLDivElement, SliderProps>((props, ref) => {
  const {
    ranged = false,
    value: valueProp,
    defaultValue,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    layer = 1,
    label,
    explainer,
    showValue = true,
    startValueText,
    endValueText,
    editable = false,
    showTooltip = true,
    formatValue = String,
    startHandleLabel,
    endHandleLabel,
    numberInputProps,
    endNumberInputProps,
    disabled = false,
    skeleton = false,
    className,
    'data-state': dataState,
    ...rest
  } = props;

  const labelId = `${useId()}-label`;
  const count = ranged ? 2 : 1;

  const normalize = (v: number | SliderRange | undefined): number[] => {
    if (ranged) {
      const [a, b] = Array.isArray(v) ? v : [min, max];
      const start = clamp(a, min, max);
      return [start, clamp(b, start, max)];
    }
    return [clamp(typeof v === 'number' ? v : min, min, max)];
  };

  const isControlled = valueProp !== undefined;
  const [internal, setInternal] = useState<number[]>(() => normalize(defaultValue));
  const values = isControlled ? normalize(valueProp) : internal;

  const [dragging, setDragging] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const handleRefs = useRef<(HTMLDivElement | null)[]>([]);

  const span = max - min;
  const fraction = (v: number) => (span > 0 ? (v - min) / span : 0);

  /** Bounds of handle `i` — ranged handles can't cross. */
  const lowerBound = (i: number) => (i === 1 ? (values[0] ?? min) : min);
  const upperBound = (i: number) => (ranged && i === 0 ? (values[1] ?? max) : max);

  const snap = (v: number) => {
    const snapped = step > 0 ? min + Math.round((v - min) / step) * step : v;
    return Number(snapped.toFixed(Math.max(decimals(step), decimals(min))));
  };

  const commit = (i: number, raw: number) => {
    if (disabled) return;
    const next = [...values];
    next[i] = clamp(raw, lowerBound(i), upperBound(i));
    if (next[i] === values[i]) return;
    if (!isControlled) setInternal(next);
    if (ranged) (onChange as ((v: SliderRange) => void) | undefined)?.([next[0] ?? min, next[1] ?? max]);
    else (onChange as ((v: number) => void) | undefined)?.(next[0] ?? min);
  };

  /* ── Keyboard ── */

  const handleKeyDown = (i: number) => (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const current = values[i] ?? min;
    let next: number | undefined;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        next = snap(current + step);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        next = snap(current - step);
        break;
      case 'PageUp':
        next = snap(current + step * 10);
        break;
      case 'PageDown':
        next = snap(current - step * 10);
        break;
      case 'Home':
        next = lowerBound(i);
        break;
      case 'End':
        next = upperBound(i);
        break;
      default:
        return;
    }
    e.preventDefault();
    commit(i, next);
  };

  /* ── Pointer ── */

  const handleWidth = () => handleRefs.current[0]?.getBoundingClientRect().width ?? 0;

  /** Value for handle `i` at client x. */
  const valueAt = (clientX: number, i: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || rect.width <= 0) return values[i] ?? min;
    const h = handleWidth();
    const usable = rect.width - h * count;
    const p = usable > 0 ? clamp((clientX - rect.left - h / 2 - h * i) / usable, 0, 1) : 0;
    return snap(min + p * span);
  };

  const nearestHandle = (clientX: number) => {
    if (!ranged) return 0;
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    const h = handleWidth();
    const usable = rect.width - h * 2;
    const centre = (i: number) => rect.left + usable * fraction(values[i] ?? min) + h / 2 + h * i;
    const d0 = Math.abs(clientX - centre(0));
    const d1 = Math.abs(clientX - centre(1));
    if (d0 === d1) return clientX > centre(0) ? 1 : 0;
    return d0 < d1 ? 0 : 1;
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (disabled || e.button !== 0) return;
    e.preventDefault();
    const i = nearestHandle(e.clientX);
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setDragging(i);
    handleRefs.current[i]?.focus();
    commit(i, valueAt(e.clientX, i));
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging === null) return;
    commit(dragging, valueAt(e.clientX, dragging));
  };

  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging === null) return;
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    setDragging(null);
  };

  /* ── Parts ── */

  const lineBase = 'absolute top-1/2 h-[var(--scanner-slider-track-height)] -translate-y-1/2';
  const filled = disabled || skeleton ? 'bg-[var(--scanner-border-disabled)]' : 'bg-[var(--scanner-border-interactive)]';
  const unfilled = disabled || skeleton ? 'bg-[var(--scanner-border-disabled)]' : 'bg-[var(--scanner-border-subtle)]';

  const p0 = fraction(values[0] ?? min);
  const p1 = fraction(values[1] ?? max);

  const lines: { style: CSSProperties; className: string; part: string }[] = ranged
    ? [
        { part: 'track-start', className: cn(unfilled, 'rounded-l-[var(--scanner-radius-sm)]'), style: { left: 0, width: offset(2, p0, 0) } },
        {
          part: 'track-fill',
          className: filled,
          style: { left: offset(2, p0, 1), width: `calc((100% - ${HANDLE} * 2) * ${p1 - p0})` },
        },
        { part: 'track-end', className: cn(unfilled, 'rounded-r-[var(--scanner-radius-sm)]'), style: { left: offset(2, p1, 2), right: 0 } },
      ]
    : [
        { part: 'track-fill', className: cn(filled, 'rounded-l-[var(--scanner-radius-sm)]'), style: { left: 0, width: offset(1, p0, 0) } },
        { part: 'track-end', className: cn(unfilled, 'rounded-r-[var(--scanner-radius-sm)]'), style: { left: offset(1, p0, 1), right: 0 } },
      ];

  const handleName = (i: number) => {
    if (i === 0) return startHandleLabel ?? (ranged ? (label ? `${label} start` : 'Start') : label ? undefined : 'Value');
    return endHandleLabel ?? (label ? `${label} end` : 'End');
  };

  const track = (
    <div
      ref={trackRef}
      data-part="track"
      onPointerDown={skeleton ? undefined : onPointerDown}
      onPointerMove={skeleton ? undefined : onPointerMove}
      onPointerUp={skeleton ? undefined : endDrag}
      onPointerCancel={skeleton ? undefined : endDrag}
      className={cn(
        'relative h-[var(--scanner-slider-indication-height)] w-full touch-none select-none',
        disabled || skeleton ? 'cursor-not-allowed' : 'cursor-pointer',
      )}
    >
      {lines.map((l) => (
        <span key={l.part} aria-hidden="true" data-part={l.part} className={cn(lineBase, l.className)} style={l.style} />
      ))}
      {values.map((v, i) => {
        const name = handleName(i);
        return (
          <SliderControl
            key={i}
            ref={(el) => {
              handleRefs.current[i] = el;
            }}
            {...(skeleton
              ? { 'aria-hidden': true }
              : {
                  role: 'slider',
                  tabIndex: disabled ? -1 : 0,
                  'aria-orientation': 'horizontal' as const,
                  'aria-valuemin': lowerBound(i),
                  'aria-valuemax': upperBound(i),
                  'aria-valuenow': v,
                  'aria-valuetext': formatValue(v),
                  'aria-label': name,
                  'aria-labelledby': name === undefined ? labelId : undefined,
                  onKeyDown: handleKeyDown(i),
                })}
            data-part={i === 0 ? 'handle-start' : 'handle-end'}
            data-state={skeleton ? undefined : dataState}
            disabled={disabled || skeleton}
            pressed={dragging === i}
            showValue={showTooltip}
            valueText={formatValue(v)}
            className="absolute top-1/2 -translate-y-1/2"
            style={{ left: offset(count, fraction(v), i) }}
          />
        );
      })}
    </div>
  );

  const skeletonBar = cn(
    'h-[var(--scanner-slider-skeleton-bar-height)] w-[var(--scanner-slider-skeleton-bar-width)]',
    skeletonFill,
  );

  /* ── Editable number inputs ── */

  const input = (i: number) => {
    const extra = i === 0 ? numberInputProps : endNumberInputProps;
    return (
      <NumberInput
        size="large"
        layer={layer}
        showControls={false}
        skeleton={skeleton}
        disabled={disabled}
        value={values[i]}
        min={lowerBound(i)}
        max={upperBound(i)}
        step={step}
        aria-label={handleName(i) ?? label}
        onChange={(n) => commit(i, n)}
        {...extra}
        className={cn(ranged && 'min-w-0 flex-1', extra?.className)}
      />
    );
  };

  const inputs = editable && (
    <div data-part="inputs" className="flex w-full items-center">
      {input(0)}
      {ranged && (
        <>
          <span
            aria-hidden="true"
            className="flex w-[var(--scanner-slider-separator-width)] shrink-0 items-center justify-center"
          >
            <Icon
              name="subtract-empty"
              size={16}
              className={cn(
                'size-[var(--scanner-slider-separator-icon-size)]',
                disabled || skeleton ? 'text-[color:var(--scanner-icon-disabled)]' : 'text-[color:var(--scanner-icon-primary)]',
              )}
            />
          </span>
          {input(1)}
        </>
      )}
    </div>
  );

  const textColor = disabled ? 'text-[color:var(--scanner-text-disabled)]' : 'text-[color:var(--scanner-text-primary)]';

  return (
    <div
      ref={ref}
      data-layer={layer}
      data-ranged={ranged ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      data-skeleton={skeleton ? '' : undefined}
      aria-hidden={skeleton || undefined}
      aria-disabled={disabled || undefined}
      className={cn(
        'flex w-full flex-col items-start',
        'font-[family-name:var(--scanner-font-sans)] font-[number:var(--scanner-font-regular)]',
        className,
      )}
      {...rest}
    >
      {/* Label */}
      {label &&
        (skeleton ? (
          <div className="flex w-full pb-[var(--scanner-spacing-3)]" data-part="label">
            <div className={skeletonBar} />
          </div>
        ) : (
          <div
            data-part="label"
            className="flex w-full items-start gap-[var(--scanner-spacing-2)] pb-[var(--scanner-spacing-3)]"
          >
            <span
              id={labelId}
              className={cn(
                'min-w-0 break-words',
                typeBody02,
                disabled ? 'text-[color:var(--scanner-text-disabled)]' : 'text-[color:var(--scanner-text-secondary)]',
              )}
            >
              {label}
            </span>
            {explainer && (
              <IconTriggerTooltip
                content={explainer}
                position="top"
                alignment="start"
                disabled={disabled}
                className="shrink-0"
              />
            )}
          </div>
        ))}

      <div className="flex w-full flex-col gap-[var(--scanner-spacing-3)]">
        {inputs}

        <div data-part="slider" className="flex w-full flex-col gap-[var(--scanner-spacing-2)]">
          {track}

          {showValue &&
            (skeleton ? (
              <div data-part="values" className="flex w-full items-start justify-between">
                <div className={skeletonBar} />
                <div className={skeletonBar} />
              </div>
            ) : (
              <div
                data-part="values"
                className={cn('flex w-full items-center justify-between gap-[var(--scanner-spacing-3)]', typeBody02, textColor)}
              >
                <span>{startValueText ?? formatValue(min)}</span>
                <span className="text-right">{endValueText ?? formatValue(max)}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
});

Slider.displayName = 'Slider';
