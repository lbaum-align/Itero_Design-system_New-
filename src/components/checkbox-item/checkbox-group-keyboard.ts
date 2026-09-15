import type { KeyboardEvent } from 'react';

/**
 * Figma checkbox docs: "Arrows up and down — navigate between checkboxes in that group".
 * Moves focus to the previous/next enabled checkbox inside the group (no wrapping).
 */
export function moveCheckboxFocus(
  e: KeyboardEvent<HTMLElement>,
  keys: { prev: string[]; next: string[] },
) {
  const target = e.target;
  if (!(target instanceof HTMLInputElement) || target.type !== 'checkbox') return;
  const step = keys.next.includes(e.key) ? 1 : keys.prev.includes(e.key) ? -1 : 0;
  if (!step) return;
  const inputs = Array.from(
    e.currentTarget.querySelectorAll<HTMLInputElement>('input[type="checkbox"]:not(:disabled)'),
  );
  const next = inputs[inputs.indexOf(target) + step];
  e.preventDefault();
  next?.focus();
}
