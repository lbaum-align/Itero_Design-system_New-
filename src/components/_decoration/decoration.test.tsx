import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { Decoration } from './Decoration';
import type { DecorationColor } from './decoration.types';

const COLORS: DecorationColor[] = ['gray', 'red', 'magenta', 'purple', 'blue', 'green', 'orange'];

describe('_Decoration', () => {
  it('renders the Gift icon at 24px in a gray tile by default', () => {
    const { container } = render(<Decoration />);
    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute('data-color', 'gray');
    expect(el.className).toContain('bg-[var(--scanner-bg-highlight-gray)]');
    expect(el.className).toContain('text-[color:var(--scanner-icon-primary)]');
    const svg = el.querySelector('svg');
    expect(svg).toHaveAttribute('data-icon', 'gift');
    expect(svg).toHaveAttribute('width', '24');
  });

  it.each(COLORS.filter((c) => c !== 'gray'))(
    'maps %s to highlight background + on-highlight icon tokens',
    (color) => {
      const { container } = render(<Decoration color={color} />);
      const el = container.firstElementChild as HTMLElement;
      expect(el.className).toContain(`bg-[var(--scanner-bg-highlight-${color})]`);
      expect(el.className).toContain(`text-[color:var(--scanner-icon-on-highlight-${color})]`);
    },
  );

  it('accepts a registry icon name or a custom node', () => {
    const { container, rerender } = render(<Decoration icon="calendar" />);
    expect(container.querySelector('svg')).toHaveAttribute('data-icon', 'calendar');
    rerender(<Decoration icon={<span data-testid="custom" />} />);
    expect(screen.getByTestId('custom')).toBeInTheDocument();
  });

  it('is aria-hidden unless labelled', () => {
    const { container, rerender } = render(<Decoration />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    rerender(<Decoration label="Gift" />);
    expect(screen.getByRole('img', { name: 'Gift' })).not.toHaveAttribute('aria-hidden');
  });

  it('forwards ref and merges className', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Decoration ref={ref} className="custom" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(ref.current).toHaveClass('custom');
  });
});
