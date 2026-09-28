import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import type { DropdownOption, DropdownSize } from './dropdown.types';

/*
 * Shared private state helpers for Dropdown and Combobox (not exported from the package barrel):
 * selection / open state, option navigation, type-ahead, outside-press dismissal and truncation.
 */

type SingleChange = (value: string | null) => void;
type MultiChange = (value: string[]) => void;

const toArray = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : typeof v === 'string' ? [v] : [];

/**
 * Selected values as an array for both Figma Types. Single emits `string | null`, Multi emits `string[]`.
 * Controlled when `value !== undefined`.
 */
export function useSelection({
  multi,
  value,
  defaultValue,
  onChange,
}: {
  multi: boolean;
  value: string | string[] | null | undefined;
  defaultValue: string | string[] | null | undefined;
  onChange: SingleChange | MultiChange | undefined;
}) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string[]>(() => toArray(defaultValue));
  const selected = isControlled ? toArray(value) : internal;

  const emit = (next: string[]) => {
    if (!isControlled) setInternal(next);
    if (multi) (onChange as MultiChange | undefined)?.(next);
    else (onChange as SingleChange | undefined)?.(next[0] ?? null);
  };

  return {
    selected,
    /** Single: select `v`. Multi: toggle `v`. */
    commit: (v: string) => {
      if (!multi) {
        if (selected[0] !== v) emit([v]);
        return;
      }
      emit(selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v]);
    },
    remove: (v: string) => emit(selected.filter((x) => x !== v)),
    clear: () => {
      if (selected.length > 0) emit([]);
    },
  };
}

/** Menu open state — controlled (`open`) or uncontrolled (`defaultOpen`). */
export function useOpenState(
  open: boolean | undefined,
  defaultOpen: boolean,
  onOpenChange: ((open: boolean) => void) | undefined,
) {
  const [internal, setInternal] = useState(defaultOpen);
  const isOpen = open ?? internal;
  const setOpen = useCallback(
    (next: boolean) => {
      if (next === isOpen) return;
      if (open === undefined) setInternal(next);
      onOpenChange?.(next);
    },
    [isOpen, open, onOpenChange],
  );
  return [isOpen, setOpen] as const;
}

/* ------------------------------------------------------------------ */
/*  Navigation                                                        */
/* ------------------------------------------------------------------ */

const enabledOf = (options: DropdownOption[]) => options.filter((o) => !o.disabled);

/** First / last enabled option value. */
export function edgeOption(options: DropdownOption[], edge: 'first' | 'last'): string | null {
  const enabled = enabledOf(options);
  return (edge === 'first' ? enabled[0] : enabled[enabled.length - 1])?.value ?? null;
}

/** Active option when the menu opens: the first selected enabled option, else the first enabled option. */
export function initialActive(options: DropdownOption[], selected: string[]): string | null {
  const enabled = enabledOf(options);
  return enabled.find((o) => selected.includes(o.value))?.value ?? enabled[0]?.value ?? null;
}

/** `active` if it is still an enabled option, else `initialActive`. */
export function resolveActive(options: DropdownOption[], selected: string[], active: string | null): string | null {
  return active !== null && options.some((o) => o.value === active && !o.disabled)
    ? active
    : initialActive(options, selected);
}

/** Move the active option by `delta` among enabled options (wrapping, like SelectMenu). */
export function stepActive(options: DropdownOption[], active: string | null, delta: 1 | -1): string | null {
  const enabled = enabledOf(options);
  if (enabled.length === 0) return null;
  const i = enabled.findIndex((o) => o.value === active);
  if (i < 0) return edgeOption(options, delta > 0 ? 'first' : 'last');
  return enabled[(i + delta + enabled.length) % enabled.length]?.value ?? null;
}

/** DOM id of an option inside the menu with `listId` (passed to `SelectMenuItem` as `id`). */
export function optionDomId(listId: string, value: string): string {
  return `${listId}-option-${encodeURIComponent(value)}`;
}

/** Keeps the active option visible while navigating a scrolling menu. */
export function useScrollActiveIntoView(listRef: RefObject<HTMLDivElement | null>, activeId: string | undefined) {
  useEffect(() => {
    if (!activeId || !listRef.current) return;
    const option = Array.from(listRef.current.querySelectorAll<HTMLElement>('[role="option"]')).find(
      (el) => el.id === activeId,
    );
    option?.scrollIntoView?.({ block: 'nearest' });
  }, [listRef, activeId]);
}

const TYPEAHEAD_RESET_MS = 500;

/**
 * Type-ahead: printable keys typed in quick succession jump to the next option whose label starts with them.
 * Repeating one character cycles through the options starting with it.
 */
export function useTypeahead() {
  const buffer = useRef('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  return useCallback((key: string, options: DropdownOption[], active: string | null): string | null => {
    if (timer.current) clearTimeout(timer.current);
    buffer.current += key.toLowerCase();
    timer.current = setTimeout(() => {
      buffer.current = '';
    }, TYPEAHEAD_RESET_MS);

    const enabled = enabledOf(options);
    const text = buffer.current;
    const repeated = text.split('').every((c) => c === text[0]);
    const search = repeated ? text.charAt(0) : text;
    const start = Math.max(
      enabled.findIndex((o) => o.value === active),
      0,
    );
    /* A repeated character starts after the active option; a longer string may match the active option itself */
    const from = repeated ? start + 1 : start;
    const ordered = [...enabled.slice(from), ...enabled.slice(0, from)];
    return ordered.find((o) => o.label.toLowerCase().startsWith(search))?.value ?? null;
  }, []);
}

/** Calls `onDismiss` on a mouse press outside `rootRef` while `active`. */
export function useDismiss(rootRef: RefObject<HTMLElement | null>, active: boolean, onDismiss: () => void) {
  const callback = useRef(onDismiss);
  useLayoutEffect(() => {
    callback.current = onDismiss;
  });
  useEffect(() => {
    if (!active) return;
    const handler = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) callback.current();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [active, rootRef]);
}

/** True when the element's text is cut off by `text-overflow: ellipsis` (Figma "Overflow content"). */
export function useIsTruncated<T extends HTMLElement>(content: unknown) {
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
  return [setEl, !!el && truncated] as const;
}

/** Tag row gap — Figma Tag group: 8px, 4px with Extra small tags (Size=Small). */
export function tagRowGap(size: DropdownSize): string {
  return size === 'small' ? 'gap-[var(--scanner-spacing-2)]' : 'gap-[var(--scanner-spacing-3)]';
}
