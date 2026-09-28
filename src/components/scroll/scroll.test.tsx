import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { Scroll } from './Scroll';
import { ScrollArea } from './ScrollArea';
import { scrollbarClassName } from './scroll-classes';

const thumbOf = (c: HTMLElement) => c.querySelector('[data-thumb]') as HTMLElement;

describe('Scroll', () => {
  it('defaults to Horizontal with the Figma 52/108 thumb at the start', () => {
    const { container } = render(<Scroll />);
    const track = container.firstElementChild as HTMLElement;
    expect(track).toHaveAttribute('data-position', 'horizontal');
    expect(track).toHaveAttribute('aria-hidden', 'true');
    expect(track.className).toContain('h-[var(--scanner-scroll-thickness)]');
    expect(track.className).toContain('bg-[var(--scanner-border-subtle)]');
    expect(thumbOf(container).style.left).toBe('0%');
    expect(parseFloat(thumbOf(container).style.width)).toBeCloseTo((52 / 108) * 100, 3);
  });

  it('renders Vertical with the Figma 52/84 thumb', () => {
    const { container } = render(<Scroll position="vertical" />);
    expect((container.firstElementChild as HTMLElement).className).toContain(
      'w-[var(--scanner-scroll-thickness)]',
    );
    expect(parseFloat(thumbOf(container).style.height)).toBeCloseTo((52 / 84) * 100, 3);
  });

  it('positions the thumb from value and thumbSize (clamped)', () => {
    const { container, rerender } = render(
      <Scroll position="vertical" thumbSize={0.25} value={1} />,
    );
    expect(thumbOf(container).style.top).toBe('75%');
    rerender(<Scroll position="vertical" thumbSize={2} value={-1} />);
    expect(thumbOf(container).style.top).toBe('0%');
    expect(thumbOf(container).style.height).toBe('100%');
  });

  it('exposes scrollbar semantics when controlling an element', () => {
    render(<Scroll position="vertical" controls="list" value={0.5} />);
    const bar = screen.getByRole('scrollbar');
    expect(bar).toHaveAttribute('aria-controls', 'list');
    expect(bar).toHaveAttribute('aria-orientation', 'vertical');
    expect(bar).toHaveAttribute('aria-valuenow', '50');
  });

  it('forwards ref and merges className', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Scroll ref={ref} className="custom" />);
    expect(ref.current).toHaveClass('custom');
  });
});

describe('ScrollArea', () => {
  it('is a focusable vertical scroll container with Figma scroll bar styling', () => {
    render(<ScrollArea aria-label="List">content</ScrollArea>);
    const area = screen.getByLabelText('List');
    expect(area).toHaveAttribute('tabindex', '0');
    expect(area).toHaveClass('overflow-y-auto');
    for (const cls of scrollbarClassName.split(' ')) expect(area).toHaveClass(cls);
  });

  it('supports horizontal and both orientations', () => {
    const { rerender } = render(<ScrollArea aria-label="L" orientation="horizontal" />);
    expect(screen.getByLabelText('L')).toHaveClass('overflow-x-auto');
    rerender(<ScrollArea aria-label="L" orientation="both" />);
    expect(screen.getByLabelText('L')).toHaveClass('overflow-auto');
  });

  it('forwards ref, tabIndex override and className', () => {
    const ref = createRef<HTMLDivElement>();
    render(<ScrollArea ref={ref} tabIndex={-1} className="custom" />);
    expect(ref.current).toHaveAttribute('tabindex', '-1');
    expect(ref.current).toHaveClass('custom');
  });
});
