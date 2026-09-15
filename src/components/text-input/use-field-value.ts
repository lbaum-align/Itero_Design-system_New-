import { useCallback, useImperativeHandle, useRef, useState } from 'react';
import type { ChangeEvent, ChangeEventHandler, ForwardedRef, MouseEvent } from 'react';

type FieldElement = HTMLInputElement | HTMLTextAreaElement;

/**
 * Tracks the value of a native input/textarea (controlled or uncontrolled) so the
 * component can derive Figma "Filled", show a counter, and clear the field.
 * Private helper shared by TextInput, TextArea and PasswordInput.
 */
export function useFieldValue<T extends FieldElement>({
  value,
  defaultValue,
  onChange,
  ref,
}: {
  value: string | number | readonly string[] | undefined;
  defaultValue: string | number | readonly string[] | undefined;
  onChange: ChangeEventHandler<T> | undefined;
  ref: ForwardedRef<T>;
}) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(() => String(defaultValue ?? ''));
  const currentValue = isControlled ? String(value) : internalValue;

  const innerRef = useRef<T | null>(null);
  /* Expose the native element through the forwarded ref while keeping an internal handle */
  useImperativeHandle(ref, () => innerRef.current as T, []);

  const handleChange = useCallback(
    (e: ChangeEvent<T>) => {
      if (!isControlled) setInternalValue(e.target.value);
      onChange?.(e);
    },
    [isControlled, onChange],
  );

  /**
   * Empties the field through the native value setter + an `input` event, so React's
   * `onChange` fires for controlled and uncontrolled usage alike. Focus returns to the field.
   */
  const clear = useCallback(() => {
    const el = innerRef.current;
    if (!el) return;
    const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value')?.set?.call(el, '');
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.focus();
  }, []);

  /** Focus the native element when the field container (not a child control) is pressed. */
  const focusFromContainer = useCallback((e: MouseEvent<HTMLElement>) => {
    if (e.target === e.currentTarget && innerRef.current && !innerRef.current.disabled) {
      e.preventDefault();
      innerRef.current.focus();
    }
  }, []);

  return {
    setRef: innerRef,
    innerRef,
    currentValue,
    hasValue: currentValue.length > 0,
    handleChange,
    clear,
    focusFromContainer,
  };
}
