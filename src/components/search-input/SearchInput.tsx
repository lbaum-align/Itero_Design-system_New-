import { Children, forwardRef, useId, useState } from 'react';
import type { ChangeEvent, FocusEvent, KeyboardEvent, MouseEvent } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../../icons';
import { SelectMenu } from '../select-menu';
import {
  fieldAction,
  fieldBackground,
  fieldStroke,
  placeholderText,
  skeletonFill,
  typeBody02,
  typeSm,
  valueText,
} from '../text-input/field-styles';
import { useFieldValue } from '../text-input/use-field-value';
import type { SearchInputProps, SearchInputSize } from './search-input.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → Search input (node 849:95, page 15305:6748)
 * 3 Sizes × 2 Layer sets × (Enabled, Filled, Focused ×2 Filled, Skeleton ×2 Filled) = 36 variants, + Show menu.
 *
 * Anatomy: Field · Search icon · Field text · Close icon (when filled) · optional Select menu 4px below.
 * Large has a `border-subtle` stroke; Medium / Small have none. Focused → `border-focus` stroke at every size.
 * Figma's "Scroll mask" rectangle only hides text scrolling under the icon — not needed in CSS.
 */

const sizeConfig: Record<SearchInputSize, { field: string; input: string; height: string }> = {
  large: {
    field: 'px-[var(--scanner-spacing-5)] py-[var(--scanner-spacing-5)] gap-[var(--scanner-spacing-3)]', // 16/16 · gap 8
    input: typeBody02, // Body/$tp-body-02 18/28
    height: 'h-[var(--scanner-search-input-height-lg)]', // 60
  },
  medium: {
    field: 'px-[var(--scanner-spacing-4)] py-[var(--scanner-spacing-3)] gap-[var(--scanner-spacing-3)]', // 12/8 · gap 8
    input: typeSm, // Body/$tp-body-01 14/20
    height: 'h-[var(--scanner-search-input-height-md)]', // 40
  },
  small: {
    field: 'px-[var(--scanner-spacing-3)] py-[var(--scanner-spacing-2)] gap-[var(--scanner-spacing-2)]', // 8/4 · gap 4
    input: typeSm, // 14/20
    height: 'h-[var(--scanner-search-input-height-sm)]', // 32
  },
};

const OPTION_SELECTOR = '[role="option"]:not([aria-disabled="true"])';

/** Set a native input's value and fire React's `onChange` (controlled and uncontrolled alike). */
function setNativeValue(el: HTMLInputElement, next: string) {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(el, next);
  el.dispatchEvent(new Event('input', { bubbles: true }));
}

/**
 * Scanner SearchInput — query field with search icon, clear action and optional suggestions menu.
 *
 * Figma props → React: Size → `size`, Layer set → `layer`, Filled → derived from the value,
 * State → `:focus-within` (forceable via `data-state="focused"`) / `skeleton`, Filled text value → `value`,
 * Show menu → `suggestions` (+ `showMenu` to control visibility).
 *
 * Keyboard: Tab focuses the field; Enter calls `onSearch` (or picks the highlighted suggestion);
 * Escape closes the menu, then clears the field. With suggestions: ArrowDown/ArrowUp move the highlight
 * (`aria-activedescendant`), the input keeps focus.
 *
 * @example
 * <SearchInput placeholder="Search patients" onSearch={runQuery} />
 * <SearchInput suggestions={<SelectMenuItem value="smith" optionText="Smith" />} onSuggestionSelect={pick} />
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      size = 'large',
      layer = 1,
      skeleton = false,
      disabled = false,
      placeholder = 'Search',
      onSearch,
      onClear,
      clearLabel = 'Clear search',
      suggestions,
      showMenu: showMenuProp,
      onShowMenuChange,
      onSuggestionSelect,
      menuSize = 'x-large',
      menuMaxHeight,
      className,
      id: externalId,
      value,
      defaultValue,
      onChange,
      onKeyDown,
      onBlur,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'data-state': dataState,
      ...inputProps
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = externalId ?? `search-input-${generatedId}`;
    const listboxId = `${inputId}-listbox`;
    const cfg = sizeConfig[size];

    const { setRef, innerRef, currentValue, hasValue, handleChange, clear, focusFromContainer } =
      useFieldValue<HTMLInputElement>({ value, defaultValue, onChange, ref });

    const hasSuggestions = Children.toArray(suggestions).length > 0;
    const [menuOpenInternal, setMenuOpenInternal] = useState(false);
    const menuOpen = hasSuggestions && (showMenuProp ?? menuOpenInternal);
    /** Highlighted option: value (for SelectMenu) + DOM id (for aria-activedescendant). */
    const [active, setActive] = useState<{ value: string; id: string } | null>(null);
    const [menuEl, setMenuEl] = useState<HTMLDivElement | null>(null);

    if (skeleton) {
      return (
        <div
          aria-hidden="true"
          data-skeleton=""
          data-layer={layer}
          data-size={size}
          className={cn('w-full rounded-[var(--scanner-radius-md)]', cfg.height, skeletonFill, className)}
        />
      );
    }

    /* Suggestions may arrive after the keystroke that opens the menu, so the request doesn't depend on them */
    const requestMenu = (open: boolean) => {
      if (!open) setActive(null);
      if (open === (showMenuProp ?? menuOpenInternal)) return;
      if (showMenuProp === undefined) setMenuOpenInternal(open);
      onShowMenuChange?.(open);
    };

    const showClear = hasValue && !disabled && !inputProps.readOnly;

    const handleClear = () => {
      clear();
      requestMenu(false);
      onClear?.();
    };

    const getOptions = (): HTMLElement[] =>
      Array.from(menuEl?.querySelectorAll<HTMLElement>(OPTION_SELECTOR) ?? []);

    const highlight = (delta: 1 | -1) => {
      const options = getOptions();
      if (options.length === 0) return;
      const current = active ? options.findIndex((o) => o.dataset.value === active.value) : -1;
      const nextIndex =
        current < 0 ? (delta === 1 ? 0 : options.length - 1) : (current + delta + options.length) % options.length;
      const el = options[nextIndex];
      if (!el || el.dataset.value === undefined) return;
      setActive({ value: el.dataset.value, id: el.id });
      el.scrollIntoView?.({ block: 'nearest' });
    };

    const handleSelect = (next: string) => {
      const el = innerRef.current;
      if (el) {
        setNativeValue(el, next);
        el.focus();
      }
      requestMenu(false);
      onSuggestionSelect?.(next);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented || disabled) return;
      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowUp':
          if (!hasSuggestions) return;
          e.preventDefault();
          if (!menuOpen) requestMenu(true);
          highlight(e.key === 'ArrowDown' ? 1 : -1);
          break;
        case 'Enter': {
          const option = menuOpen && active ? getOptions().find((o) => o.dataset.value === active.value) : undefined;
          if (option) {
            e.preventDefault();
            option.click();
          } else {
            /* Without onSearch, Enter keeps its native behaviour (e.g. submitting a surrounding form) */
            if (onSearch) e.preventDefault();
            requestMenu(false);
            onSearch?.(currentValue);
          }
          break;
        }
        case 'Escape':
          if (menuOpen) {
            e.preventDefault();
            requestMenu(false);
          } else if (showClear) {
            e.preventDefault();
            handleClear();
          }
          break;
        default:
          break;
      }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      handleChange(e);
      setActive(null);
      requestMenu(e.target.value.length > 0);
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      onBlur?.(e);
      requestMenu(false);
    };

    /* Keep focus in the input while the menu is pressed, so the combobox never loses its caret */
    const keepFocus = (e: MouseEvent<HTMLDivElement>) => e.preventDefault();

    const comboboxProps = hasSuggestions
      ? {
          role: 'combobox' as const,
          'aria-expanded': menuOpen,
          'aria-controls': listboxId,
          'aria-autocomplete': 'list' as const,
          'aria-activedescendant': menuOpen && active ? active.id : undefined,
        }
      : { role: 'searchbox' as const };

    return (
      <div
        data-layer={layer}
        data-size={size}
        data-filled={hasValue ? '' : undefined}
        className={cn(
          'relative flex w-full flex-col items-start',
          'font-[family-name:var(--scanner-font-sans)] font-[number:var(--scanner-font-regular)]',
          className,
        )}
      >
        <div
          data-part="field"
          data-state={dataState}
          onMouseDown={focusFromContainer}
          className={cn(
            'flex w-full items-center overflow-clip rounded-[var(--scanner-radius-md)]',
            'transition-shadow duration-150',
            cfg.height,
            cfg.field,
            fieldBackground[layer],
            fieldStroke({ error: false, disabled, subtle: size === 'large' }),
            disabled ? 'cursor-not-allowed' : 'cursor-text',
          )}
        >
          <Icon
            name="search"
            size={24}
            className={cn(
              'pointer-events-none size-[var(--scanner-search-input-icon-size)] shrink-0',
              disabled ? 'text-[color:var(--scanner-icon-disabled)]' : 'text-[color:var(--scanner-icon-tertiary)]',
            )}
          />

          <input
            ref={setRef}
            id={inputId}
            type="search"
            autoComplete="off"
            placeholder={placeholder}
            disabled={disabled}
            value={value}
            defaultValue={defaultValue}
            aria-label={ariaLabel ?? (ariaLabelledBy ? undefined : placeholder)}
            aria-labelledby={ariaLabelledBy}
            aria-disabled={disabled || undefined}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className={cn(
              'm-0 min-w-0 flex-1 appearance-none border-none bg-transparent p-0 outline-none',
              '[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none',
              'text-ellipsis',
              cfg.input,
              valueText(disabled),
              placeholderText(disabled),
              disabled && 'cursor-not-allowed',
            )}
            {...comboboxProps}
            {...inputProps}
          />

          {showClear && (
            <button
              type="button"
              aria-label={clearLabel}
              aria-controls={inputId}
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleClear}
              className={cn(
                fieldAction,
                'size-[var(--scanner-search-input-icon-size)] cursor-pointer text-[color:var(--scanner-icon-tertiary)]',
              )}
            >
              <Icon name="close-empty" size={24} />
            </button>
          )}
        </div>

        {hasSuggestions && (
          <div
            ref={setMenuEl}
            data-part="menu"
            hidden={!menuOpen}
            onMouseDown={keepFocus}
            className="absolute inset-x-0 top-full z-20 pt-[var(--scanner-spacing-2)]"
          >
            <SelectMenu
              id={listboxId}
              size={menuSize}
              value={null}
              onChange={handleSelect}
              activeValue={active?.value ?? null}
              focusMode="activedescendant"
              tabIndex={-1}
              aria-label={ariaLabel ? `${ariaLabel} suggestions` : 'Suggestions'}
              scroll={menuMaxHeight !== undefined}
              maxHeight={menuMaxHeight}
              className="w-full"
            >
              {suggestions}
            </SelectMenu>
          </div>
        )}
      </div>
    );
  },
);

SearchInput.displayName = 'SearchInput';
