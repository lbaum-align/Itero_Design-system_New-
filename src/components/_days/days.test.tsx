import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Days } from './Days';

const picker = (container: HTMLElement) => container.querySelector('[data-part="picker"]') as HTMLElement;

describe('_Days', () => {
  it('renders a native button with type="button" and the label', () => {
    render(<Days>12</Days>);
    const button = screen.getByRole('button', { name: '12' });
    expect(button).toHaveAttribute('type', 'button');
  });

  it('forwards the ref and merges className', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Days ref={ref} className="custom">1</Days>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toHaveClass('custom');
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<Days onClick={onClick}>1</Days>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('Selected: brand picker fill and on-color label', () => {
    const { container } = render(<Days selected>1</Days>);
    expect(picker(container).className).toContain('bg-[var(--scanner-bg-brand)]');
    expect(screen.getByText('1').className).toContain('text-[color:var(--scanner-text-on-color)]');
    expect(screen.getByRole('button')).toHaveAttribute('data-selected', 'true');
  });

  it('In range: layer-selected picker fill', () => {
    const { container } = render(<Days inRange>1</Days>);
    expect(picker(container).className).toContain('bg-[var(--scanner-bg-layer-selected)]');
  });

  it('Today: indicator + aria-current="date"; on-color indicator when selected', () => {
    const { container, rerender } = render(<Days today>1</Days>);
    const indicator = () => container.querySelector('[data-part="today-indicator"]') as HTMLElement;
    expect(screen.getByRole('button')).toHaveAttribute('aria-current', 'date');
    expect(indicator().className).toContain('bg-[var(--scanner-border-interactive)]');
    rerender(<Days today selected>1</Days>);
    expect(indicator().className).toContain('bg-[var(--scanner-border-on-color-strong)]');
  });

  it('Disabled: native disabled + aria-disabled, no indicator, ignores clicks', () => {
    const onClick = vi.fn();
    const { container } = render(<Days disabled today onClick={onClick}>1</Days>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(container.querySelector('[data-part="today-indicator"]')).toBeNull();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('focusableWhenDisabled keeps the cell focusable but still ignores clicks', () => {
    const onClick = vi.fn();
    render(<Days disabled focusableWhenDisabled onClick={onClick}>1</Days>);
    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
    button.focus();
    expect(button).toHaveFocus();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('passes forced data-state through for Storybook', () => {
    render(<Days data-state="pressed">1</Days>);
    expect(screen.getByRole('button')).toHaveAttribute('data-state', 'pressed');
  });
});
