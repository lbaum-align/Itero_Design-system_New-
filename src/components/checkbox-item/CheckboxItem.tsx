import { forwardRef, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { Ref } from 'react';
import { cn } from '../../utils/cn';
import { CheckboxGroupContext } from './checkbox-group-context';
import type { CheckboxItemProps, CheckboxSelection } from './checkbox-item.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → 01 Checkbox item (node 1223:1396)
 * Selected (Unselected, Selected, Indeterminate) × State (Enabled, Focused, Disabled, Skeleton)
 * = 12 variants, plus "Show value" and "Text value" properties.
 *
 * Layout: 16px vertical padding, 8px gap, 28×28 indicator, value Body/$tp-body-02 (18/28).
 * The indicator is a single glyph from the icon library (box with the mark cut out),
 * coloured icon-primary (unselected) / icon-link (selected, indeterminate) / icon-disabled.
 * Focused adds a 1.4px border-focus stroke inside the 28px indicator (radius 4).
 * Figma defines no hover or pressed states.
 */

/** Outer rounded square shared by all glyphs (28×28 viewBox). */
const BOX =
  'M23.5833 2.5H4.41667C3.90834 2.5 3.42082 2.70193 3.06138 3.06138C2.70193 3.42082 2.5 3.90834 2.5 4.41667V23.5833C2.5 24.0917 2.70193 24.5792 3.06138 24.9386C3.42082 25.2981 3.90834 25.5 4.41667 25.5H23.5833C24.0917 25.5 24.5792 25.2981 24.9386 24.9386C25.2981 24.5792 25.5 24.0917 25.5 23.5833V4.41667C25.5 3.90834 25.2981 3.42082 24.9386 3.06138C24.5792 2.70193 24.0917 2.5 23.5833 2.5Z';

/** Cut-out drawn inside the box for each selection. */
const CUTOUT: Record<CheckboxSelection, string> = {
  unselected: 'M4.41667 23.5833V4.41667H23.5833V23.5833H4.41667Z',
  selected:
    'M12.0833 19.2708L7.29167 14.5201L8.81618 13.0417L12.0833 16.2479L19.1833 9.20833L20.7088 10.7198L12.0833 19.2708Z',
  indeterminate: 'M19.75 15.9167H8.25V12.0833H19.75V15.9167Z',
};

function normalise(value: CheckboxSelection | boolean | undefined): CheckboxSelection {
  if (value === true) return 'selected';
  if (value === false || value === undefined) return 'unselected';
  return value;
}

const Glyph = ({ selection }: { selection: CheckboxSelection }) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    aria-hidden="true"
    className="block size-full"
    data-glyph={selection}
  >
    <path d={`${BOX}${CUTOUT[selection]}`} fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
  </svg>
);

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') ref(value);
  else if (ref) (ref as { current: T | null }).current = value;
}

const indicatorBox = 'relative flex size-[var(--scanner-checkbox-indicator-size)] shrink-0 rounded-[var(--scanner-radius-sm)]';
const valueText = cn(
  'min-w-0 break-words',
  'font-[family-name:var(--scanner-font-sans)] font-[number:var(--scanner-font-regular)]',
  'text-[length:var(--scanner-text-scanner-md)] leading-[var(--scanner-leading-lg)]',
);

/**
 * Scanner CheckboxItem — a checkbox with an optional value text.
 *
 * Figma props → React: Selected → `checked`, Show value → `showLabel`, Text value → `label`,
 * State → `:focus-visible` (forceable via `data-state="focused"`), `disabled`, `skeleton`.
 *
 * The checkbox and its value text form one click target. Keyboard: Tab to focus,
 * Space to toggle (Enter also toggles, per Figma docs); arrow keys move between items in a group.
 *
 * @example
 * <CheckboxItem label="Upper jaw" checked={upper} onChange={setUpper} />
 * <CheckboxItem label="All teeth" checked="indeterminate" onChange={selectAll} />
 * <CheckboxItem label="Uncontrolled" defaultChecked />
 */
export const CheckboxItem = forwardRef<HTMLInputElement, CheckboxItemProps>(
  (
    {
      checked,
      defaultChecked,
      label,
      showLabel = true,
      disabled: disabledProp = false,
      skeleton: skeletonProp = false,
      onChange,
      onKeyDown,
      className,
      'aria-label': ariaLabel,
      'data-state': dataState,
      ...rest
    },
    ref,
  ) => {
    const group = useContext(CheckboxGroupContext);
    const disabled = disabledProp || group.disabled;
    const skeleton = skeletonProp || !!group.skeleton;

    const isControlled = checked !== undefined;
    const [internal, setInternal] = useState<CheckboxSelection>(() => normalise(defaultChecked));
    const selection = isControlled ? normalise(checked) : internal;
    const isIndeterminate = selection === 'indeterminate';

    /* `indeterminate` only exists as a DOM property */
    const inputRef = useRef<HTMLInputElement | null>(null);
    const setRefs = useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        assignRef(ref, node);
      },
      [ref],
    );
    useEffect(() => {
      if (inputRef.current) inputRef.current.indeterminate = isIndeterminate;
    }, [isIndeterminate, skeleton]);

    const toggle = () => {
      if (disabled) return;
      // An indeterminate checkbox resolves to selected.
      const next = selection !== 'selected';
      if (!isControlled) setInternal(next ? 'selected' : 'unselected');
      onChange?.(next);
    };

    /* ── Skeleton ── */
    if (skeleton) {
      return (
        <span
          aria-hidden="true"
          data-skeleton=""
          className={cn(
            'flex w-fit max-w-full animate-pulse items-start gap-[var(--scanner-spacing-3)] py-[var(--scanner-spacing-5)]',
            className,
          )}
        >
          <span className={cn(indicatorBox, 'text-[color:var(--scanner-icon-disabled)]')}>
            <Glyph selection={selection} />
          </span>
          {showLabel && (
            <span className="h-[var(--scanner-leading-lg)] w-[var(--scanner-checkbox-skeleton-value-width)] min-w-px shrink bg-[var(--scanner-bg-highlight-gray)]" />
          )}
        </span>
      );
    }

    const hasVisibleLabel = showLabel && !!label;

    return (
      <label
        data-selection={selection}
        data-state={dataState}
        data-disabled={disabled || undefined}
        className={cn(
          'group flex w-fit max-w-full items-start gap-[var(--scanner-spacing-3)] py-[var(--scanner-spacing-5)]',
          'select-none',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          className,
        )}
      >
        <input
          ref={setRefs}
          type="checkbox"
          checked={selection === 'selected'}
          disabled={disabled}
          aria-checked={isIndeterminate ? 'mixed' : selection === 'selected'}
          aria-disabled={disabled || undefined}
          aria-label={hasVisibleLabel ? ariaLabel : (ariaLabel ?? label)}
          onChange={toggle}
          onKeyDown={(e) => {
            onKeyDown?.(e);
            // Figma docs: Enter/Space toggle (native checkboxes only toggle on Space)
            if (e.key === 'Enter' && !e.defaultPrevented) {
              e.preventDefault();
              toggle();
            }
          }}
          className="peer sr-only"
          {...rest}
        />

        {/* Indicator — 28×28 glyph; focus stroke drawn inside like Figma */}
        <span
          className={cn(
            indicatorBox,
            disabled
              ? 'text-[color:var(--scanner-icon-disabled)]'
              : selection === 'unselected'
                ? 'text-[color:var(--scanner-icon-primary)]'
                : 'text-[color:var(--scanner-icon-link)]',
            'peer-focus-visible:shadow-[inset_0_0_0_var(--scanner-checkbox-focus-width)_var(--scanner-border-focus)]',
            'group-data-[state=focused]:shadow-[inset_0_0_0_var(--scanner-checkbox-focus-width)_var(--scanner-border-focus)]',
          )}
        >
          <Glyph selection={selection} />
        </span>

        {hasVisibleLabel && (
          <span
            className={cn(
              valueText,
              disabled ? 'text-[color:var(--scanner-text-disabled)]' : 'text-[color:var(--scanner-text-primary)]',
            )}
          >
            {label}
          </span>
        )}
      </label>
    );
  },
);

CheckboxItem.displayName = 'CheckboxItem';
