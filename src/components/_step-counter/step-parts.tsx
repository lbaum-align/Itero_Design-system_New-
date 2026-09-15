import { useLayoutEffect, useState } from 'react';
import { cn } from '../../utils/cn';
import { Tooltip } from '../tooltip';
import { StepCounter } from './StepCounter';
import { CheckmarkOutlineIcon, ErrorFilledIcon } from './step-icons';

/*
 * Parts shared by _Vertical stepper items (34201:2271) and _Horizontal stepper items (34201:2302):
 * the "Indicator" and the "Step name" label for each State.
 */

/** Figma "State" of a stepper item. */
export type StepperItemState = 'not-started' | 'in-progress' | 'completed' | 'error' | 'skeleton';

/** Indicator per state: Not started / Skeleton → outline number, In progress → filled number (icon-link),
 * Completed → "Checkmark outline" (icon-link), Error → "Error" (icon-error). */
export function StepIndicator({ state, step }: { state: StepperItemState; step: number }) {
  if (state === 'completed' || state === 'error') {
    const IconComponent = state === 'completed' ? CheckmarkOutlineIcon : ErrorFilledIcon;
    return (
      <span
        aria-hidden="true"
        data-indicator={state}
        className={cn(
          'inline-flex size-[var(--scanner-stepper-indicator-size)] shrink-0',
          state === 'completed' ? 'text-[color:var(--scanner-icon-link)]' : 'text-[color:var(--scanner-icon-error)]',
        )}
      >
        <IconComponent className="size-full" />
      </span>
    );
  }
  return (
    <StepCounter data-indicator={state} state={state === 'in-progress' ? 'in-progress' : 'not-started'} step={step} />
  );
}

/** True when the element's text is cut off by `text-overflow: ellipsis`. */
function useIsTruncated<T extends HTMLElement>(content: unknown) {
  const [el, setEl] = useState<T | null>(null);
  const [truncated, setTruncated] = useState(false);

  useLayoutEffect(() => {
    if (!el) return;
    const check = () => setTruncated(el.scrollWidth > el.clientWidth);
    check();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [el, content]);

  return [setEl, truncated] as const;
}

interface StepLabelProps {
  state: StepperItemState;
  label: string;
  /** Visually hidden status appended to the label (e.g. "completed"). */
  statusLabel?: string;
  /** Size classes for the skeleton placeholder. */
  skeletonClassName: string;
}

/**
 * "Step name": Body 02 (18/28), text-primary when In progress, text-secondary otherwise.
 * Figma "Overflow content": long labels truncate with an ellipsis and show the full text in a tooltip.
 * Skeleton: a fixed `background-highlight-gray` bar instead of the text.
 */
export function StepLabel({ state, label, statusLabel, skeletonClassName }: StepLabelProps) {
  const [labelRef, truncated] = useIsTruncated<HTMLSpanElement>(label);

  if (state === 'skeleton') {
    return (
      <span
        aria-hidden="true"
        data-skeleton=""
        className={cn(
          'block h-[var(--scanner-stepper-skeleton-height)] shrink-0 animate-pulse bg-[var(--scanner-bg-highlight-gray)]',
          skeletonClassName,
        )}
      />
    );
  }

  const text = (
    <span
      ref={labelRef}
      className={cn(
        'block min-w-0 truncate',
        'font-[family-name:var(--scanner-font-sans)] font-[number:var(--scanner-font-regular)]',
        'text-[length:var(--scanner-text-scanner-md)] leading-[var(--scanner-leading-lg)]',
        state === 'in-progress' ? 'text-[color:var(--scanner-text-primary)]' : 'text-[color:var(--scanner-text-secondary)]',
      )}
    >
      {label}
      {statusLabel && <span className="sr-only">{`, ${statusLabel}`}</span>}
    </span>
  );

  return truncated ? (
    <Tooltip content={label} placement="bottom" alignment="start" className="min-w-0">
      {text}
    </Tooltip>
  ) : (
    text
  );
}
