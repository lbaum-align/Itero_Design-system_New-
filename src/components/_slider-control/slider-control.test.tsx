import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { SliderControl } from './SliderControl';

const ring = (c: HTMLElement) => c.querySelector('[data-part="ring"]') as HTMLElement;

describe('_SliderControl', () => {
  it('forwards role, aria and handlers to the root', () => {
    const onKeyDown = vi.fn();
    render(<SliderControl role="slider" tabIndex={0} aria-label="Volume" aria-valuenow={30} onKeyDown={onKeyDown} />);
    const handle = screen.getByRole('slider', { name: 'Volume' });
    expect(handle).toHaveAttribute('aria-valuenow', '30');
    fireEvent.keyDown(handle, { key: 'ArrowRight' });
    expect(onKeyDown).toHaveBeenCalled();
  });

  it('forwards the ref and merges className', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<SliderControl ref={ref} className="custom" />);
    expect(ref.current).toBe(container.firstElementChild);
    expect(ref.current).toHaveClass('custom');
  });

  it('enabled: icon-tertiary ring, focus switches to icon-link, no dot or tooltip', () => {
    const { container } = render(<SliderControl valueText="50" />);
    expect(ring(container).className).toContain('--scanner-icon-tertiary');
    expect(ring(container).className).toContain('group-focus-visible:border-[color:var(--scanner-icon-link)]');
    expect(container.querySelector('[data-part="dot"]')).toBeNull();
    expect(container.querySelector('[data-part="value-tooltip"]')).toBeNull();
  });

  it('forced focused state is exposed through data-state', () => {
    const { container } = render(<SliderControl data-state="focused" />);
    expect(container.firstElementChild).toHaveAttribute('data-state', 'focused');
    expect(ring(container).className).toContain('group-data-[state=focused]:border-[color:var(--scanner-icon-link)]');
  });

  it('pressed: icon-link ring, dot and value tooltip', () => {
    const { container } = render(<SliderControl pressed valueText="50" />);
    expect(container.firstElementChild).toHaveAttribute('data-pressed');
    expect(ring(container).className).toContain('--scanner-icon-link');
    expect(container.querySelector('[data-part="dot"]')).not.toBeNull();
    const tooltip = container.querySelector('[data-part="value-tooltip"]');
    expect(tooltip).toHaveTextContent('50');
    expect(tooltip).toHaveAttribute('aria-hidden', 'true');
  });

  it('forced pressed via data-state renders the pressed look', () => {
    const { container } = render(<SliderControl data-state="pressed" valueText="10" />);
    expect(container.querySelector('[data-part="dot"]')).not.toBeNull();
    expect(container.querySelector('[data-part="value-tooltip"]')).toHaveTextContent('10');
  });

  it('Value: False hides the tooltip while pressed', () => {
    const { container } = render(<SliderControl pressed showValue={false} valueText="50" />);
    expect(container.querySelector('[data-part="dot"]')).not.toBeNull();
    expect(container.querySelector('[data-part="value-tooltip"]')).toBeNull();
  });

  it('disabled: icon-disabled ring, aria-disabled, never pressed', () => {
    const { container } = render(<SliderControl disabled pressed valueText="50" />);
    expect(container.firstElementChild).toHaveAttribute('aria-disabled', 'true');
    expect(ring(container).className).toContain('--scanner-icon-disabled');
    expect(container.querySelector('[data-part="dot"]')).toBeNull();
  });
});
