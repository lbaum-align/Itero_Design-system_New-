import { forwardRef, useId, useImperativeHandle, useRef, useState } from 'react';
import type { FocusEvent, KeyboardEvent, MouseEvent } from 'react';
import { cn } from '../../utils/cn';
import { TagGroup } from '../tag-group';
import { Tooltip } from '../tooltip';
import { FieldHeader, FieldMessage } from '../text-input/field-parts';
import {
  fieldBackground,
  fieldRoot,
  fieldStroke,
  typeBody02,
  typeLabel01,
  typeSm,
  typeXs,
} from '../text-input/field-styles';
import { HiddenInputs, OptionsMenu, SelectChevron, SelectFieldSkeleton, SelectedTags } from './select-field-parts';
import {
  edgeOption,
  initialActive,
  optionDomId,
  resolveActive,
  stepActive,
  useDismiss,
  useIsTruncated,
  useOpenState,
  useScrollActiveIntoView,
  useSelection,
  useTypeahead,
} from './select-field';
import type { DropdownProps, DropdownSize } from './dropdown.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → Dropdowm (sic) (node 20:610, page "Dropdown" 15305:6738)
 * Layer set (2) × Size (4) × Type (Single, Multi) × Selected (False, True) × State (Enabled, Hovered, Focused,
 * Disabled, Error, Skeleton) = 192 variants, + Show label / Show helper / Required field / Show explainer.
 *
 * Field (padding + one line): X-Large 16·16 + 18/28 = 60 (border-subtle stroke) · Large 10·16 + 18/28 = 48 ·
 * Medium 8·12 + 14/20 = 36 · Small 4·8 + 14/20 = 28 (radius 4, gap 4). With tags (Multi, Selected):
 * X-Large 14/16/14/8 · Large 8/16/8/8 · Medium 4/16/4/4 · Small 4/8/4/4 around a Small (Extra small) tag group.
 */

const sizeConfig: Record<
  DropdownSize,
  {
    label: string;
    text: string;
    field: string;
    multiField: string;
    gap: string;
    radius: string;
    chevron: 20 | 24;
    multiChevron: 20 | 24;
    multiChevronPad: string;
    bar: string;
    skeleton: string;
  }
> = {
  'x-large': {
    label: typeLabel01, // 16/24
    text: typeBody02, // 18/28
    field: 'min-h-[var(--scanner-dropdown-height-xl)] p-[var(--scanner-spacing-5)]',
    multiField:
      'py-[var(--scanner-dropdown-multi-padding-y-xl)] pr-[var(--scanner-spacing-5)] pl-[var(--scanner-spacing-3)]',
    gap: 'gap-[var(--scanner-spacing-3)]',
    radius: 'rounded-[var(--scanner-radius-md)]',
    chevron: 24,
    multiChevron: 20,
    multiChevronPad: 'py-[var(--scanner-spacing-2)]',
    bar: 'h-[var(--scanner-dropdown-skeleton-bar-height-xl)]',
    skeleton: 'h-[var(--scanner-dropdown-height-xl)] rounded-[var(--scanner-radius-md)]',
  },
  large: {
    label: typeLabel01, // 16/24
    text: typeBody02, // 18/28
    field: 'min-h-[var(--scanner-dropdown-height-lg)] px-[var(--scanner-spacing-5)] py-[var(--scanner-dropdown-padding-y-lg)]',
    multiField: 'py-[var(--scanner-spacing-3)] pr-[var(--scanner-spacing-5)] pl-[var(--scanner-spacing-3)]',
    gap: 'gap-[var(--scanner-spacing-3)]',
    radius: 'rounded-[var(--scanner-radius-md)]',
    chevron: 24,
    multiChevron: 24,
    multiChevronPad: 'py-[var(--scanner-spacing-2)]',
    bar: 'h-[var(--scanner-dropdown-skeleton-bar-height)]',
    skeleton: 'h-[var(--scanner-dropdown-height-lg)] rounded-[var(--scanner-radius-md)]',
  },
  medium: {
    label: typeXs, // 12/16
    text: typeSm, // 14/20
    field: 'min-h-[var(--scanner-dropdown-height-md)] px-[var(--scanner-spacing-4)] py-[var(--scanner-spacing-3)]',
    multiField: 'py-[var(--scanner-spacing-2)] pr-[var(--scanner-spacing-5)] pl-[var(--scanner-spacing-2)]',
    gap: 'gap-[var(--scanner-spacing-3)]',
    radius: 'rounded-[var(--scanner-radius-md)]',
    chevron: 20,
    multiChevron: 20,
    multiChevronPad: 'py-[var(--scanner-spacing-2)]',
    bar: 'h-[var(--scanner-dropdown-skeleton-bar-height)]',
    skeleton: 'h-[var(--scanner-dropdown-height-md)] rounded-[var(--scanner-radius-md)]',
  },
  small: {
    label: typeXs, // 12/16
    text: typeSm, // 14/20
    field: 'min-h-[var(--scanner-dropdown-height-sm)] px-[var(--scanner-spacing-3)] py-[var(--scanner-spacing-2)]',
    multiField: 'py-[var(--scanner-spacing-2)] pr-[var(--scanner-spacing-3)] pl-[var(--scanner-spacing-2)]',
    gap: 'gap-[var(--scanner-spacing-2)]',
    radius: 'rounded-[var(--scanner-radius-sm)]',
    chevron: 20,
    multiChevron: 20,
    multiChevronPad: '',
    bar: 'h-[var(--scanner-dropdown-skeleton-bar-height)]',
    skeleton: 'h-[var(--scanner-dropdown-height-sm)] rounded-[var(--scanner-radius-sm)]',
  },
};

/**
 * Scanner Dropdown — pick one (Type Single) or several (Type Multi, shown as tags) options from a static list.
 * Use Combobox when users should search the list.
 *
 * Figma props → React: Size → `size`, Layer set → `layer`, Type → `type`, Selected → derived from `value`,
 * State → `:hover` / `:focus-within` (forceable via `data-state`) / `disabled` / `error` / `skeleton`,
 * Show label / Show helper / Required field / Show explainer → `label` / `helperText` / `required` / `tooltip`,
 * Filled / Placeholder / Label / Helper / Error text value → option label / `placeholder` / `label` / `helperText` / `errorText`.
 *
 * Accessibility: WAI-ARIA select-only combobox — a `<button role="combobox">` owns a `listbox` through
 * `aria-activedescendant`, so focus never leaves the trigger.
 * Keyboard: Enter / Space / ArrowDown / ArrowUp open; ArrowUp / ArrowDown / Home / End move; Enter / Space select
 * (Single closes, Multi toggles and stays open); Escape and Tab close; typing jumps to a matching option;
 * Backspace removes the last tag (Multi, closed). Clicking outside closes the menu.
 *
 * @example
 * <Dropdown label="Country" options={countries} value={country} onChange={setCountry} />
 * <Dropdown type="multi" label="Teeth" options={teeth} defaultValue={['ul1']} />
 */
export const Dropdown = forwardRef<HTMLButtonElement, DropdownProps>((props, ref) => {
  const {
    size = 'x-large',
    layer = 1,
    options,
    label,
    helperText,
    errorText,
    error = false,
    required = false,
    tooltip,
    placeholder = 'Select an option',
    disabled = false,
    skeleton = false,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    menuMaxHeight,
    name,
    'data-state': dataState,
    className,
    style,
    type = 'single',
    value,
    defaultValue,
    onChange,
    id: externalId,
    onClick,
    onKeyDown,
    'aria-describedby': ariaDescribedBy,
    'aria-label': ariaLabel,
    ...buttonProps
  } = props;

  const multi = type === 'multi';
  const generatedId = useId();
  const triggerId = externalId ?? `dropdown-${generatedId}`;
  const listId = `${triggerId}-listbox`;
  const helperId = `${triggerId}-helper`;
  const errorId = `${triggerId}-error`;
  const cfg = sizeConfig[size];

  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  useImperativeHandle(ref, () => triggerRef.current as HTMLButtonElement, []);

  const { selected, commit, remove } = useSelection({ multi, value, defaultValue, onChange });
  const [isOpen, setOpen] = useOpenState(openProp, defaultOpen, onOpenChange);
  const [activeValue, setActiveValue] = useState<string | null>(null);
  const currentActive = isOpen ? resolveActive(options, selected, activeValue) : null;
  const activeId = currentActive !== null ? optionDomId(listId, currentActive) : undefined;
  useScrollActiveIntoView(listRef, activeId);
  const typeahead = useTypeahead();

  const selectedOptions = selected.map((v) => options.find((o) => o.value === v));
  const singleLabel = multi ? undefined : (selectedOptions[0]?.label ?? selected[0]);
  const [valueRef, truncated] = useIsTruncated<HTMLSpanElement>(singleLabel);

  const close = () => setOpen(false);
  useDismiss(rootRef, isOpen, close);

  if (skeleton) {
    return (
      <SelectFieldSkeleton
        layer={layer}
        showLabel={!!label}
        showHelper={!!(helperText || (error && errorText))}
        barClassName={cfg.bar}
        fieldClassName={cfg.skeleton}
        className={className}
        style={style}
      />
    );
  }

  const openMenu = (active: string | null = initialActive(options, selected)) => {
    if (disabled) return;
    setActiveValue(active);
    setOpen(true);
  };

  const toggle = () => (isOpen ? close() : openMenu());

  const pick = (v: string) => {
    const option = options.find((o) => o.value === v);
    if (!option || option.disabled) return;
    commit(v);
    setActiveValue(v);
    if (!multi) close();
    triggerRef.current?.focus();
  };

  const removeTag = (v: string) => {
    remove(v);
    triggerRef.current?.focus();
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented) toggle();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || disabled) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) openMenu();
        else setActiveValue(stepActive(options, currentActive, 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) openMenu();
        else setActiveValue(stepActive(options, currentActive, -1));
        break;
      case 'Home':
      case 'End': {
        e.preventDefault();
        const edge = edgeOption(options, e.key === 'Home' ? 'first' : 'last');
        if (!isOpen) openMenu(edge);
        else setActiveValue(edge);
        break;
      }
      case 'Enter':
      case ' ':
        /* preventDefault also stops the native button click, so the menu doesn't re-toggle */
        e.preventDefault();
        if (!isOpen) openMenu();
        else if (currentActive !== null) pick(currentActive);
        break;
      case 'Escape':
        if (isOpen) {
          e.preventDefault();
          e.stopPropagation();
          close();
        }
        break;
      case 'Tab':
        if (isOpen) close();
        break;
      case 'Backspace':
      case 'Delete':
        if (multi && !isOpen && selected.length > 0) {
          e.preventDefault();
          remove(selected[selected.length - 1] as string);
        }
        break;
      default:
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          const match = typeahead(e.key, options, currentActive);
          if (match !== null) {
            if (!isOpen) openMenu(match);
            else setActiveValue(match);
          }
        }
    }
  };

  /* Pressing the field padding / tag row opens the menu too (Figma: "clicking on the field container area") */
  const handleFieldMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (disabled || (e.target as HTMLElement).closest('button')) return;
    e.preventDefault();
    triggerRef.current?.focus();
    toggle();
  };

  const handleRootBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (isOpen && !e.currentTarget.contains(e.relatedTarget as Node | null)) close();
  };

  const hasTags = multi && selected.length > 0;
  const showError = error && !!errorText;
  const showHelper = !showError && !!helperText;
  const describedBy =
    [ariaDescribedBy, showError && errorId, showHelper && helperId].filter(Boolean).join(' ') || undefined;
  const fieldState = dataState ?? (isOpen ? 'focused' : undefined);
  const textColor = disabled ? 'text-[color:var(--scanner-text-disabled)]' : 'text-[color:var(--scanner-text-primary)]';

  return (
    <div
      ref={rootRef}
      data-layer={layer}
      data-type={type}
      className={cn(fieldRoot, className)}
      style={style}
      onBlur={handleRootBlur}
    >
      {/* Figma Error variants render the label in text-disabled */}
      <FieldHeader
        htmlFor={triggerId}
        label={label}
        required={required}
        explainer={tooltip}
        disabled={disabled || error}
        labelClassName={cfg.label}
      />

      <div className="relative w-full">
        {/* Overflow content: ellipsis + tooltip with the full value */}
        <Tooltip content={singleLabel} placement="top" disabled={!truncated || isOpen || !singleLabel} className="flex w-full">
          <div
            data-part="field"
            data-state={fieldState}
            onMouseDown={handleFieldMouseDown}
            className={cn(
              'group/field flex w-full overflow-clip transition-shadow duration-150',
              hasTags ? cn('items-start gap-[var(--scanner-spacing-3)]', cfg.multiField) : cn('items-center', cfg.field),
              cfg.radius,
              fieldBackground[layer],
              fieldStroke({ error, disabled, subtle: size === 'x-large' }),
              disabled ? 'cursor-not-allowed' : 'cursor-pointer',
            )}
          >
            {hasTags && (
              <TagGroup size={size === 'small' ? 'extra-small' : 'small'} aria-label="Selected options" className="min-w-0 flex-1">
                <SelectedTags size={size} options={options} selected={selected} disabled={disabled} onRemove={removeTag} />
              </TagGroup>
            )}

            <button
              ref={triggerRef}
              id={triggerId}
              type="button"
              role="combobox"
              aria-haspopup="listbox"
              aria-expanded={isOpen}
              aria-controls={isOpen ? listId : undefined}
              aria-activedescendant={activeId}
              aria-label={ariaLabel}
              aria-invalid={error || undefined}
              aria-required={required || undefined}
              aria-disabled={disabled || undefined}
              aria-describedby={describedBy}
              disabled={disabled}
              onClick={handleClick}
              onKeyDown={handleKeyDown}
              className={cn(
                'm-0 flex items-center border-0 bg-transparent p-0 text-left outline-none',
                'font-[family-name:var(--scanner-font-sans)] font-[number:var(--scanner-font-regular)]',
                hasTags ? cn('shrink-0 self-start', cfg.multiChevronPad) : cn('min-w-0 flex-1', cfg.gap),
                disabled ? 'cursor-not-allowed' : 'cursor-pointer',
              )}
              {...buttonProps}
            >
              {hasTags ? (
                <span className="sr-only">{selectedOptions.map((o, i) => o?.label ?? selected[i]).join(', ')}</span>
              ) : (
                <span
                  ref={valueRef}
                  data-part={singleLabel ? 'value' : 'placeholder'}
                  className={cn('min-w-0 flex-1 truncate', cfg.text, textColor)}
                >
                  {singleLabel ?? placeholder}
                </span>
              )}
              <SelectChevron open={isOpen} size={hasTags ? cfg.multiChevron : cfg.chevron} disabled={disabled} />
            </button>
          </div>
        </Tooltip>

        {isOpen && (
          <OptionsMenu
            id={listId}
            listRef={listRef}
            size={size}
            options={options}
            selected={selected}
            activeValue={currentActive}
            multi={multi}
            onPick={pick}
            maxHeight={menuMaxHeight}
            label={ariaLabel ?? label}
          />
        )}
      </div>

      <HiddenInputs name={name} selected={selected} disabled={disabled} />

      {showError && (
        <FieldMessage id={errorId} tone="error" className={cfg.label}>
          {errorText}
        </FieldMessage>
      )}
      {showHelper && (
        <FieldMessage id={helperId} tone="helper" disabled={disabled} className={cfg.label}>
          {helperText}
        </FieldMessage>
      )}
    </div>
  );
});

Dropdown.displayName = 'Dropdown';
