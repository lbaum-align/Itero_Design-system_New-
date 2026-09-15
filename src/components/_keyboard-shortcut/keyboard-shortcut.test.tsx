import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { KeyboardShortcut } from './KeyboardShortcut';
import { resolveGlyph } from './keyboard-shortcut.glyphs';

describe('KeyboardShortcut', () => {
  it('renders a <kbd> with one nested <kbd> per key', () => {
    const { container } = render(<KeyboardShortcut keys={['⌘', 'X']} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.tagName).toBe('KBD');
    expect(root.querySelectorAll(':scope > kbd')).toHaveLength(2);
  });

  it('draws modifier keys as glyphs with a screen-reader label', () => {
    const { container } = render(<KeyboardShortcut keys={['⌘', '⌥', '⇧', '⌫']} />);
    expect(container.querySelectorAll('svg')).toHaveLength(4);
    for (const name of ['Command', 'Option', 'Shift', 'Backspace']) {
      expect(screen.getByText(name)).toHaveClass('sr-only');
    }
    expect(container.querySelector('[data-glyph="erase"]')).toBeInTheDocument();
  });

  it('renders other keys as text', () => {
    const { container } = render(<KeyboardShortcut keys={['Ctrl', 'P']} />);
    expect(container.querySelectorAll('svg')).toHaveLength(0);
    expect(screen.getByText('Ctrl')).toBeInTheDocument();
    expect(screen.getByText('P')).toBeInTheDocument();
  });

  it('resolves glyph aliases case-insensitively', () => {
    expect(resolveGlyph('Cmd')).toBe('command');
    expect(resolveGlyph('ALT')).toBe('option');
    expect(resolveGlyph('shift')).toBe('shift');
    expect(resolveGlyph('Backspace')).toBe('erase');
    expect(resolveGlyph('K')).toBeUndefined();
  });

  it('uses secondary colours, or disabled colours when disabled', () => {
    const { container, rerender } = render(<KeyboardShortcut keys={['⌘', 'X']} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain('--scanner-text-secondary');
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('--scanner-icon-secondary');
    rerender(<KeyboardShortcut keys={['⌘', 'X']} disabled />);
    expect(root).toHaveAttribute('data-disabled');
    expect(root.className).toContain('--scanner-text-disabled');
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('--scanner-icon-disabled');
  });

  it('forwards ref and merges className', () => {
    const ref = createRef<HTMLElement>();
    render(<KeyboardShortcut ref={ref} keys={['X']} className="custom" />);
    expect(ref.current?.tagName).toBe('KBD');
    expect(ref.current).toHaveClass('custom');
  });
});
