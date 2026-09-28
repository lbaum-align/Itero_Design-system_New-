import { forwardRef, useId, useImperativeHandle, useRef, useState } from 'react';
import type { ChangeEvent, FocusEvent, KeyboardEvent, MouseEvent } from 'react';
import { cn } from '../../utils/cn';
import { FieldHeader, FieldMessage } from '../text-input/field-parts';
import {
  fieldBackground,
  fieldRoot,
  fieldStroke,
  placeholderText,
  typeBody02,
  typeLabel01,
  typeSm,
  typeXs,
  valueText,
} from '../text-input/field-styles';
import {
  HiddenInputs,
  OptionsMenu,
  SelectChevron,
  SelectFieldSkeleton,
  SelectedTags,
} from '../dropdown/select-field-parts';
import {
  edgeOption,
  initialActive,
  optionDomId,
  resolveActive,
  stepActive,
  tagRowGap,
  useDismiss,
  useOpenState,
  useScrollActiveIntoView,
  useSelection,
} from '../dropdown/select-field';
import type { ComboboxOption, ComboboxProps, ComboboxSize } from './combobox.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → Combobox (node 34220:8533, page "Dropdown" 15305:6738)
 * Layer set (2) × Size (4) × Type (Single, Multi) × Selected (False, True) × State (Enabled, Hovered, Focused,
 * Disabled, Error, Skeleton) = 192 variants, + Show label / Show helper / Required field / Show explainer.
 *
 * Field (padding + one line): X-Large 12·16 + 18/28 = 52 · Large 12·16 + 14/20 = 44 · Medium 8·12 + 14/20 = 36 ·
 * Small 4·8 + 14/20 = 28 (radius 4, gap 4). With tags (Multi, Selected): X-Large / Large 8/16/8/8 ·
 * Medium 4/16/4/4 · Small 4/8/4/4 around Small (Extra small) tags.
 */

const sizeConfig: Record<
  ComboboxSize,
  {
    label: string;
    input: string;
    field: string;
    multiField: string;
    gap: string;
    radius: string;
    chevron: 20 | 24;
    chevronPad: string;
    bar: string;
    skeleton: string;
  }
> = {
  'x-large': {
    label: typeLabel01, // 16/24
    input: cn('h-[var(--scanner-leading-lg)]', typeBody02), // 18/28
    field: 'min-h-[var(--scanner-combobox-height-xl)] px-[var(--scanner-spacing-5)] py-[var(--scanner-spacing-4)]',
    multiField: 'py-[var(--scanner-spacing-3)] pr-[var(--scanner-spacing-5)] pl-[var(--scanner-spacing-3)]',
    gap: 'gap-[var(--scanner-spacing-3)]',
    radius: 'rounded-[var(--scanner-radius-md)]',
    chevron: 24,
    chevronPad: 'py-[var(--scanner-spacing-2)]',
    bar: 'h-[var(--scanner-dropdown-skeleton-bar-height-xl)]',
    skeleton: 'h-[var(--scanner-combobox-skeleton-height-xl)] rounded-[var(--scanner-radius-md)]',
  },
  large: {
    label: typeXs, // 12/16
    input: cn('h-[var(--scanner-leading-sm)]', typeSm), // 14/20
    field: 'min-h-[var(--scanner-combobox-height-lg)] px-[var(--scanner-spacing-5)] py-[var(--scanner-spacing-4)]',
    multiField: 'py-[var(--scanner-spacing-3)] pr-[var(--scanner-spacing-5)] pl-[var(--scanner-spacing-3)]',
    gap: 'gap-[var(--scanner-spacing-3)]',
    radius: 'rounded-[var(--scanner-radius-md)]',
    chevron: 20,
    chevronPad: 'py-[var(--scanner-spacing-2)]',
    bar: 'h-[var(--scanner-dropdown-skeleton-bar-height)]',
    skeleton: 'h-[var(--scanner-combobox-height-lg)] rounded-[var(--scanner-radius-md)]',
  },
  medium: {
    label: typeXs,
    input: cn('h-[var(--scanner-leading-sm)]', typeSm),
    field: 'min-h-[var(--scanner-combobox-height-md)] px-[var(--scanner-spacing-4)] py-[var(--scanner-spacing-3)]',
    multiField: 'py-[var(--scanner-spacing-2)] pr-[var(--scanner-spacing-5)] pl-[var(--scanner-spacing-2)]',
    gap: 'gap-[var(--scanner-spacing-3)]',
    radius: 'rounded-[var(--scanner-radius-md)]',
    chevron: 20,
    chevronPad: 'py-[var(--scanner-spacing-2)]',
    bar: 'h-[var(--scanner-dropdown-skeleton-bar-height)]',
    skeleton: 'h-[var(--scanner-combobox-height-md)] rounded-[var(--scanner-radius-md)]',
  },
  small: {
    label: typeXs,
    input: cn('h-[var(--scanner-leading-sm)]', typeSm),
    field: 'min-h-[var(--scanner-combobox-height-sm)] px-[var(--scanner-spacing-3)] py-[var(--scanner-spacing-2)]',
    multiField: 'py-[var(--scanner-spacing-2)] pr-[var(--scanner-spacing-3)] pl-[var(--scanner-spacing-2)]',
    gap: 'gap-[var(--scanner-spacing-2)]',
    radius: 'rounded-[var(--scanner-radius-sm)]',
    chevron: 20,
    chevronPad: '',
    bar: 'h-[var(--scanner-dropdown-skeleton-bar-height)]',
    skeleton: 'h-[var(--scanner-combobox-height-sm)] rounded-[var(--scanner-radius-sm)]',
  },
};

const defaultFilter = (option: ComboboxOption, text: string) =>
  option.label.toLowerCase().includes(text.trim().toLowerCase());

/**
 * Scanner Combobox — an editable field that filters a list of options as the user types.
 * Type Single shows the chosen option's label in the input; Type Multi shows chosen options as tags before the input.
 *
 * Figma props → React: Size → `size`, Layer set → `layer`, Type → `type`, Selected → derived from `value`,
 * State → `:hover` / `:focus-within` (forceable via `data-state`) / `disabled` / `error` / `skeleton`,
 * Show label / Show helper / Required field / Show explainer → `label` / `helperText` / `required` / `tooltip`.
 *
 * Accessibility: WAI-ARIA combobox with list autocomplete — the `<input role="combobox">` keeps focus and
 * points at the highlighted option with `aria-activedescendant`.
 * Keyboard: typing filters and opens; ArrowDown / ArrowUp open and move; Enter selects (Single closes,
 * Multi toggles, clears the text and stays open); Escape closes, or clears the text (and a Single value) when
 * closed; Backspace in an empty Multi input removes the last tag; Tab closes. Leaving the field restores a Single
 * value's label (an emptied input clears the value). Clicking outside closes the menu.
 *
 * @example
 * <Combobox label="Country" options={countries} value={country} onChange={setCountry} />
 * <Combobox type="multi" label="Teeth" options={teeth} defaultValue={['ul1']} />
 */
export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>((props, ref) => {
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
    filter,
    onInputChange,
    noResultsText = 'No results found',
    id: externalId,
    onClick,
    onKeyDown,
    'aria-describedby': ariaDescribedBy,
    'aria-label': ariaLabel,
    ...inputProps
  } = props;

  const multi = type === 'multi';
  const generatedId = useId();
  const inputId = externalId ?? `combobox-${generatedId}`;
  const listId = `${inputId}-listbox`;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;
  const cfg = sizeConfig[size];

  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement, []);

  const { selected, commit, remove, clear } = useSelection({ multi, value, defaultValue, onChange });
  const [isOpen, setOpen] = useOpenState(openProp, defaultOpen, onOpenChange);
  const [activeValue, setActiveValue] = useState<string | null>(null);
  /* Typed text. Single: only while editing (`dirty`); otherwise the input shows the selected label. */
  const [inputText, setInputText] = useState('');
  const [dirty, setDirty] = useState(false);

  const labelOf = (v: string) => options.find((o) => o.value === v)?.label ?? v;
  const selectedLabel = !multi && selected[0] !== undefined ? labelOf(selected[0]) : '';
  const editing = multi || dirty;
  const displayText = editing ? inputText : selectedLabel;

  const filterFor = (text: string) =>
    filter === false || text.trim() === '' ? options : options.filter((o) => (filter ?? defaultFilter)(o, text));
  const filtered = filterFor(editing ? inputText : '');

  const currentActive = isOpen ? resolveActive(filtered, selected, activeValue) : null;
  const activeId = currentActive !== null ? optionDomId(listId, currentActive) : undefined;
  useScrollActiveIntoView(listRef, activeId);

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

  const openMenu = (active: string | null = initialActive(filtered, selected)) => {
    if (disabled) return;
    setActiveValue(active);
    setOpen(true);
  };

  const setText = (text: string) => {
    if (text !== displayText) onInputChange?.(text);
    setInputText(text);
  };

  const pick = (v: string) => {
    const option = options.find((o) => o.value === v);
    if (!option || option.disabled) return;
    commit(v);
    setActiveValue(v);
    if (multi) {
      if (inputText) setText('');
    } else {
      setInputText('');
      setDirty(false);
      close();
    }
    inputRef.current?.focus();
  };

  const removeTag = (v: string) => {
    remove(v);
    inputRef.current?.focus();
  };

  /** Leaving the field: Single restores the selected label (or commits an exact match / clears when emptied). */
  const settle = () => {
    if (!multi && dirty) {
      const text = inputText.trim().toLowerCase();
      const exact = options.find((o) => !o.disabled && o.label.toLowerCase() === text);
      if (text === '') clear();
      else if (exact) commit(exact.value);
      setDirty(false);
      setInputText('');
    }
    if (multi && inputText) setText('');
    close();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setText(text);
    if (!multi) setDirty(true);
    setActiveValue(edgeOption(filterFor(text), 'first'));
    if (!isOpen && !disabled) setOpen(true);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || disabled) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) openMenu();
        else if (!e.altKey) setActiveValue(stepActive(filtered, currentActive, 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) openMenu(edgeOption(filtered, 'last'));
        else setActiveValue(stepActive(filtered, currentActive, -1));
        break;
      case 'Enter':
        if (isOpen && currentActive !== null) {
          e.preventDefault();
          pick(currentActive);
        }
        break;
      case 'Escape':
        if (isOpen) {
          e.preventDefault();
          e.stopPropagation();
          close();
        } else if (displayText !== '' || (!multi && selected.length > 0)) {
          e.preventDefault();
          setText('');
          setDirty(false);
          if (!multi) clear();
        }
        break;
      case 'Backspace':
        if (multi && inputText === '' && selected.length > 0) {
          remove(selected[selected.length - 1] as string);
        }
        break;
      case 'Tab':
        if (isOpen) close();
        break;
      default:
        break;
    }
  };

  const handleClick = (e: MouseEvent<HTMLInputElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented && !isOpen) openMenu();
  };

  const toggleFromChevron = () => {
    if (isOpen) close();
    else openMenu();
    inputRef.current?.focus();
  };

  /* Pressing the field padding / tag row focuses the input and toggles the menu */
  const handleFieldMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (disabled || target === inputRef.current || target.closest('button')) return;
    e.preventDefault();
    inputRef.current?.focus();
    if (isOpen) close();
    else openMenu();
  };

  const handleRootBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) settle();
  };

  const hasTags = multi && selected.length > 0;
  const showError = error && !!errorText;
  const showHelper = !showError && !!helperText;
  const describedBy =
    [ariaDescribedBy, showError && errorId, showHelper && helperId].filter(Boolean).join(' ') || undefined;
  const fieldState = dataState ?? (isOpen ? 'focused' : undefined);

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
        htmlFor={inputId}
        label={label}
        required={required}
        explainer={tooltip}
        disabled={disabled || error}
        labelClassName={cfg.label}
      />

      <div className="relative w-full">
        <div
          data-part="field"
          data-state={fieldState}
          onMouseDown={handleFieldMouseDown}
          className={cn(
            'group/field flex w-full overflow-clip transition-shadow duration-150',
            hasTags ? cn('items-start gap-[var(--scanner-spacing-3)]', cfg.multiField) : cn('items-center', cfg.field, cfg.gap),
            cfg.radius,
            fieldBackground[layer],
            fieldStroke({ error, disabled }),
            disabled ? 'cursor-not-allowed' : 'cursor-text',
          )}
        >
          <div
            role={hasTags ? 'group' : undefined}
            aria-label={hasTags ? 'Selected options' : undefined}
            className={cn('flex min-w-0 flex-1 flex-wrap items-center', tagRowGap(size))}
          >
            {multi && (
              <SelectedTags size={size} options={options} selected={selected} disabled={disabled} onRemove={removeTag} />
            )}
            <input
              ref={inputRef}
              id={inputId}
              type="text"
              role="combobox"
              autoComplete="off"
              aria-autocomplete="list"
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
              value={displayText}
              placeholder={hasTags ? undefined : placeholder}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onClick={handleClick}
              className={cn(
                'm-0 flex-1 border-none bg-transparent p-0 outline-none text-ellipsis',
                'font-[family-name:var(--scanner-font-sans)] font-[number:var(--scanner-font-regular)]',
                /* Next to tags the input only claims its minimum width while focused, so an idle field keeps the Figma height */
                hasTags ? 'w-0 min-w-0 focus:min-w-[var(--scanner-combobox-input-min-width)]' : 'w-full min-w-0',
                cfg.input,
                valueText(disabled),
                placeholderText(disabled),
                disabled && 'cursor-not-allowed',
              )}
              {...inputProps}
            />
          </div>

          <button
            type="button"
            tabIndex={-1}
            aria-label={isOpen ? 'Hide options' : 'Show options'}
            aria-controls={isOpen ? listId : undefined}
            aria-expanded={isOpen}
            disabled={disabled}
            onMouseDown={(e) => e.preventDefault()}
            onClick={toggleFromChevron}
            className={cn(
              'm-0 flex shrink-0 items-center border-0 bg-transparent p-0 outline-none',
              hasTags && cn('self-start', cfg.chevronPad),
              disabled ? 'cursor-not-allowed' : 'cursor-pointer',
            )}
          >
            <SelectChevron open={isOpen} size={cfg.chevron} disabled={disabled} />
          </button>
        </div>

        {isOpen && (
          <OptionsMenu
            id={listId}
            listRef={listRef}
            size={size}
            options={filtered}
            selected={selected}
            activeValue={currentActive}
            multi={multi}
            onPick={pick}
            maxHeight={menuMaxHeight}
            label={ariaLabel ?? label}
            emptyText={noResultsText}
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

Combobox.displayName = 'Combobox';
