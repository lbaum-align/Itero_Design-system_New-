import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { Spinner } from './Spinner';
import type { SpinnerSize } from './spinner.types';

describe('Spinner', () => {
  it('renders a status with a default "Loading" label', () => {
    render(<Spinner />);
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
  });

  it('accepts a custom aria-label', () => {
    render(<Spinner aria-label="Loading patients" />);
    expect(screen.getByRole('status', { name: 'Loading patients' })).toBeInTheDocument();
  });

  it('forwards the ref and merges className', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Spinner ref={ref} className="custom" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass('custom');
  });

  it.each<[SpinnerSize, string, number, number]>([
    ['mini', '0 0 20 20', 7.75, 2],
    ['small', '0 0 24 24', 9.75, 2],
    ['medium', '0 0 32 32', 13.75, 2],
    ['large', '0 0 48 48', 21.75, 2],
    ['xl', '0 0 80 80', 34.75, 8],
    ['2xl', '0 0 96 96', 44, 8],
  ])('size %s uses Figma geometry', (size, viewBox, r, stroke) => {
    const { container } = render(<Spinner size={size} />);
    expect(container.querySelector('svg')).toHaveAttribute('viewBox', viewBox);
    const arc = container.querySelector('[data-part="arc"]');
    expect(arc).toHaveAttribute('r', String(r));
    expect(arc).toHaveAttribute('stroke-width', String(stroke));
    expect(container.firstChild).toHaveClass(`size-[var(--scanner-spinner-size-${size})]`);
  });

  it('uses a 270° arc for small sizes and 302.4° for X Large / 2X Large', () => {
    const { container, rerender } = render(<Spinner size="mini" />);
    expect(container.querySelector('[data-part="arc"]')).toHaveAttribute('stroke-dasharray', '270 360');
    rerender(<Spinner size="2xl" />);
    expect(container.querySelector('[data-part="arc"]')).toHaveAttribute('stroke-dasharray', '302.4 360');
  });

  it('switches to on-color stroke tokens', () => {
    const { container } = render(<Spinner onColor />);
    expect(container.querySelector('[data-part="track"]')).toHaveClass(
      'stroke-[color:var(--scanner-border-on-color-subtle)]',
    );
    expect(container.querySelector('[data-part="arc"]')).toHaveClass(
      'stroke-[color:var(--scanner-border-on-color-strong)]',
    );
  });

  it('animates by default and freezes at a phase when given', () => {
    const { container, rerender } = render(<Spinner />);
    expect(container.querySelector('svg')).toHaveClass('animate-spin');
    rerender(<Spinner phase={2} />);
    expect(container.querySelector('svg')).not.toHaveClass('animate-spin');
    expect(container.querySelector('svg')).toHaveClass('rotate-90');
  });

  it('passes through extra HTML attributes', () => {
    render(<Spinner data-testid="spin" />);
    expect(screen.getByTestId('spin')).toBeInTheDocument();
  });
});
