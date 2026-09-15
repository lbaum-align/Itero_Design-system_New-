import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { TabItem } from './TabItem';

describe('_TabItem', () => {
  it('renders a role="tab" button with heading-02 text in text-secondary', () => {
    render(<TabItem>Overview</TabItem>);
    const tab = screen.getByRole('tab', { name: 'Overview' });
    expect(tab).toHaveAttribute('type', 'button');
    expect(tab).toHaveAttribute('aria-selected', 'false');
    expect(tab).toHaveClass(
      'scanner-text-heading-02',
      'h-[var(--scanner-tab-item-height)]',
      'pb-[var(--scanner-spacing-4)]',
      'text-[color:var(--scanner-text-secondary)]',
    );
  });

  it('selected: aria-selected, text-primary and inset bottom indicator', () => {
    render(<TabItem selected>Overview</TabItem>);
    const tab = screen.getByRole('tab');
    expect(tab).toHaveAttribute('aria-selected', 'true');
    expect(tab).toHaveClass('text-[color:var(--scanner-text-primary)]');
    expect(tab.className).toContain('shadow-[inset_0_calc(var(--scanner-tab-indicator-width)*-1)_0_0_var(--scanner-border-interactive)]');
  });

  it('forced hovered / focused states via data-state', () => {
    render(<TabItem data-state="focused">Overview</TabItem>);
    const tab = screen.getByRole('tab');
    expect(tab).toHaveAttribute('data-state', 'focused');
    expect(tab.className).toContain('data-[state=focused]:shadow-[0_0_0_var(--scanner-tab-focus-width)_var(--scanner-border-focus)]');
    expect(tab.className).toContain('data-[state=hovered]:text-[color:var(--scanner-text-primary)]');
  });

  it('disabled: disabled + aria-disabled, text-disabled, ignores clicks', () => {
    const onClick = vi.fn();
    render(<TabItem disabled onClick={onClick}>Billing</TabItem>);
    const tab = screen.getByRole('tab');
    expect(tab).toBeDisabled();
    expect(tab).toHaveAttribute('aria-disabled', 'true');
    expect(tab).toHaveClass('text-[color:var(--scanner-text-disabled)]');
    fireEvent.click(tab);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders a badge after the label (Show badge)', () => {
    render(<TabItem badge={<span data-testid="badge">3</span>}>Scans</TabItem>);
    const tab = screen.getByRole('tab');
    expect(tab.lastElementChild).toContainElement(screen.getByTestId('badge'));
  });

  it('skeleton renders a hidden placeholder', () => {
    const { container } = render(<TabItem skeleton>Scans</TabItem>);
    expect(screen.queryByRole('tab')).toBeNull();
    expect(container.querySelector('[data-skeleton]')).toHaveAttribute('aria-hidden', 'true');
  });

  it('forwards the ref, merges className, calls onClick', () => {
    const ref = createRef<HTMLButtonElement>();
    const onClick = vi.fn();
    render(<TabItem ref={ref} className="custom" onClick={onClick}>A</TabItem>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toHaveClass('custom');
    fireEvent.click(ref.current!);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
