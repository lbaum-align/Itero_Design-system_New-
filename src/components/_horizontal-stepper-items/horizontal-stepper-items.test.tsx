import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { HorizontalStepperItems } from './HorizontalStepperItems';

describe('_HorizontalStepperItems', () => {
  it('not started: outline counter, text-secondary label, progress line', () => {
    const { container } = render(<HorizontalStepperItems step={2} label="Address" />);
    expect(container.querySelector('[data-indicator="not-started"]')).toHaveAttribute('data-step', '2');
    expect(screen.getByText('Address')).toHaveClass('text-[color:var(--scanner-text-secondary)]', 'truncate');
    expect(container.querySelector('[data-line]')).toBeInTheDocument();
  });

  it('in progress: filled counter in icon-link and text-primary label', () => {
    const { container } = render(<HorizontalStepperItems state="in-progress" label="Address" />);
    expect(container.querySelector('[data-indicator="in-progress"]')).toHaveClass('text-[color:var(--scanner-icon-link)]');
    expect(screen.getByText('Address')).toHaveClass('text-[color:var(--scanner-text-primary)]');
  });

  it('completed: checkmark outline in icon-link; error: error icon in icon-error', () => {
    const { container, rerender } = render(<HorizontalStepperItems state="completed" />);
    expect(container.querySelector('[data-indicator="completed"]')).toHaveClass('text-[color:var(--scanner-icon-link)]');
    rerender(<HorizontalStepperItems state="error" />);
    expect(container.querySelector('[data-indicator="error"]')).toHaveClass('text-[color:var(--scanner-icon-error)]');
    expect(screen.getByText('Step name')).toHaveClass('text-[color:var(--scanner-text-secondary)]');
  });

  it('skeleton: outline counter + highlight-gray bar instead of the label', () => {
    const { container } = render(<HorizontalStepperItems state="skeleton" label="Hidden" />);
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
    expect(container.querySelector('[data-skeleton]')).toHaveClass('bg-[var(--scanner-bg-highlight-gray)]', 'animate-pulse');
    expect(container.querySelector('[data-indicator="skeleton"]')).toHaveClass('text-[color:var(--scanner-icon-secondary)]');
  });

  it('hides the line with showLine=false and appends a visually hidden status', () => {
    const { container } = render(<HorizontalStepperItems showLine={false} label="Review" statusLabel="completed" />);
    expect(container.querySelector('[data-line]')).not.toBeInTheDocument();
    expect(screen.getByText(', completed')).toHaveClass('sr-only');
  });

  it('merges className, passes attributes and forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<HorizontalStepperItems ref={ref} className="custom" id="s1" />);
    expect(ref.current).toHaveClass('custom');
    expect(ref.current).toHaveAttribute('id', 's1');
    expect(ref.current).toHaveAttribute('data-state', 'not-started');
  });
});
