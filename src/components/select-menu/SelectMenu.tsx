import { forwardRef, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { FocusEvent, KeyboardEvent } from 'react';
import { cn } from '../../utils/cn';
import { SelectMenuContext, selectMenuOptionId } from './select-menu-context';
import type { SelectMenuProps } from './select-menu.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → Select menu (node 30409:27826, page "Dropdown").
 * Size (X-Large, Large, Medium, Small) + Scroll. 180px wide (min 64), 4px padding, radius 8,
 * background-elevated, "Depth 01" shadow, no stroke.
 */

const OPTION_SELECTOR = '[role="option"]:not([aria-disabled="true"])';

/**
 * Scanner SelectMenu — the option list of Dropdown / Combobox / SearchInput (`role="listbox"`).
 *
 * Selection: controlled `value` + `onChange`, or uncontrolled `defaultValue`. Items need a `value`.
 * Keyboard (Figma Dropdown docs + WAI-ARIA listbox): ArrowUp/ArrowDown move between enabled options (wrapping),
 * Home/End jump to first/last, Enter/Space select the active option, Escape calls `onClose`.
 * `focusMode="activedescendant"` keeps focus on the listbox (or lets an input drive `activeValue`) and exposes
 * the active option through `aria-activedescendant`.
 *
 * @example
 * <SelectMenu size="large" value={value} onChange={setValue} aria-label="Country">
 *   <SelectMenuItem value="us" optionText="United States" />
 *   <SelectMenuItem value="ca" optionText="Canada" />
 * </SelectMenu>
 */
export const SelectMenu = forwardRef<HTMLDivElement, SelectMenuProps>(
  (
    {
      size = 'x-large',
      scroll = false,
      maxHeight,
      value: valueProp,
      defaultValue = null,
      onChange,
      activeValue: activeProp,
      onActiveChange,
      focusMode = 'roving',
      autoFocus = false,
      children,
      className,
      style,
      onClose,
      onKeyDown,
      onFocus,
      onBlur,
      ...rest
    },
    ref,
  ) => {
    const listRef = useRef<HTMLDivElement | null>(null);
    const [focusWithin, setFocusWithin] = useState(false);

    const [internalValue, setInternalValue] = useState<string | null>(defaultValue);
    const value = valueProp !== undefined ? valueProp : internalValue;

    const [internalActive, setInternalActive] = useState<string | null>(null);
    const activeValue = activeProp !== undefined ? activeProp : internalActive;

    const setRef = useCallback(
      (node: HTMLDivElement | null) => {
        listRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const getOptions = useCallback(
      (): HTMLElement[] => Array.from(listRef.current?.querySelectorAll<HTMLElement>(OPTION_SELECTOR) ?? []),
      [],
    );

    const select = useCallback(
      (next: string) => {
        if (valueProp === undefined) setInternalValue(next);
        onChange?.(next);
      },
      [valueProp, onChange],
    );

    const activate = useCallback(
      (next: string | null) => {
        if (activeProp === undefined) setInternalActive(next);
        if (next !== activeValue) onActiveChange?.(next);
      },
      [activeProp, activeValue, onActiveChange],
    );

    /** Move the active option to `index` (wrapping). */
    const moveTo = useCallback(
      (index: number) => {
        const options = getOptions();
        if (options.length === 0) return;
        const el = options[(index + options.length) % options.length];
        if (!el) return;
        if (focusMode === 'roving') {
          el.focus();
        } else {
          activate(el.dataset.value ?? null);
          el.scrollIntoView?.({ block: 'nearest' });
        }
      },
      [getOptions, focusMode, activate],
    );

    const currentIndex = (options: HTMLElement[]) =>
      focusMode === 'roving'
        ? options.indexOf(document.activeElement as HTMLElement)
        : options.findIndex((o) => o.dataset.value !== undefined && o.dataset.value === activeValue);

    /** Index of the selected option, else 0. */
    const startIndex = useCallback(() => {
      const options = getOptions();
      const i = options.findIndex((o) => o.dataset.value !== undefined && o.dataset.value === value);
      return i < 0 ? 0 : i;
    }, [getOptions, value]);

    /* Only on mount — later `autoFocus` changes must not steal focus */
    const initialAutoFocus = useRef(autoFocus);
    useEffect(() => {
      if (!initialAutoFocus.current) return;
      /* activedescendant: focusing the list runs handleFocus, which activates the start option */
      if (focusMode === 'roving') getOptions()[startIndex()]?.focus();
      else listRef.current?.focus();
    }, [focusMode, getOptions, startIndex]);

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;
      const options = getOptions();
      const current = currentIndex(options);

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          moveTo(current < 0 ? startIndex() : current + 1);
          break;
        case 'ArrowUp':
          event.preventDefault();
          moveTo(current < 0 ? startIndex() : current - 1);
          break;
        case 'Home':
          event.preventDefault();
          moveTo(0);
          break;
        case 'End':
          event.preventDefault();
          moveTo(-1);
          break;
        case 'Enter':
        case ' ':
          if (current >= 0) {
            event.preventDefault();
            options[current]?.click();
          }
          break;
        case 'Escape':
          if (onClose) {
            event.preventDefault();
            onClose();
          }
          break;
        default:
          break;
      }
    };

    const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
      onFocus?.(event);
      setFocusWithin(true);
      if (event.target !== event.currentTarget) return;
      if (focusMode === 'roving') moveTo(startIndex());
      else if (activeValue == null) moveTo(startIndex());
    };

    const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
      onBlur?.(event);
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocusWithin(false);
    };

    /* Options inside a SelectMenu get a deterministic id derived from their value (see `selectMenuOptionId`) */
    const idPrefix = useId();
    const activeId = activeValue != null ? selectMenuOptionId(idPrefix, activeValue) : undefined;

    const ctxValue = useMemo(
      () => ({
        size,
        inSelectMenu: true,
        idPrefix,
        value,
        activeValue,
        focusMode,
        onSelect: select,
        onActivate: activate,
      }),
      [size, idPrefix, value, activeValue, focusMode, select, activate],
    );

    const tabIndex = focusMode === 'activedescendant' ? 0 : focusWithin ? -1 : 0;

    return (
      <SelectMenuContext.Provider value={ctxValue}>
        <div
          ref={setRef}
          role="listbox"
          tabIndex={tabIndex}
          aria-activedescendant={focusMode === 'activedescendant' ? activeId : undefined}
          data-size={size}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={maxHeight !== undefined ? { maxHeight, ...style } : style}
          className={cn(
            'relative flex flex-col items-stretch outline-none',
            'w-[var(--scanner-select-menu-width)] min-w-[var(--scanner-select-menu-min-width)]',
            'p-[var(--scanner-spacing-2)] rounded-[var(--scanner-radius-md)]',
            'bg-[var(--scanner-bg-elevated)] shadow-[var(--scanner-shadow-depth-01)]',
            scroll && 'overflow-y-auto [scrollbar-color:var(--scanner-border-subtle)_transparent] [scrollbar-width:thin]',
            className,
          )}
          {...rest}
        >
          {children}
        </div>
      </SelectMenuContext.Provider>
    );
  },
);

SelectMenu.displayName = 'SelectMenu';
