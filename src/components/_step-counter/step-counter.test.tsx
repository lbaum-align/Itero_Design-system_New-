import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { render } from '@testing-library/react';
import { StepCounter } from './StepCounter';

describe('_StepCounter', () => {
  it('renders a decorative 24px outline number in icon-secondary by default', () => {
    const { container } = render(<StepCounter />);
    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute('aria-hidden', 'true');
    expect(el).toHaveAttribute('data-state', 'not-started');
    expect(el).toHaveClass('size-[var(--scanner-stepper-indicator-size)]', 'text-[color:var(--scanner-icon-secondary)]');
    expect(el.querySelector('svg')).toHaveAttribute('data-step', '1');
  });

  it('in progress uses the filled glyph in icon-link', () => {
    const { container } = render(<StepCounter state="in-progress" step={3} />);
    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveClass('text-[color:var(--scanner-icon-link)]');
    // Filled glyphs are one path (digit cut out); outline glyphs are ring + digit
    expect(el.querySelectorAll('path')).toHaveLength(1);
  });

  it('renders a different glyph for each step 1–8', () => {
    const seen = new Set<string>();
    for (let step = 1; step <= 8; step++) {
      const { container, unmount } = render(<StepCounter step={step} />);
      seen.add(container.innerHTML);
      unmount();
    }
    expect(seen.size).toBe(8);
  });

  it('clamps steps outside 1–8', () => {
    const { container, rerender } = render(<StepCounter step={0} />);
    expect(container.firstElementChild).toHaveAttribute('data-step', '1');
    rerender(<StepCounter step={12} />);
    expect(container.firstElementChild).toHaveAttribute('data-step', '8');
  });

  it('merges className and forwards the ref', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<StepCounter ref={ref} className="custom" />);
    expect(ref.current).toHaveClass('custom');
  });
});
