import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { TooltipContainer } from './TooltipContainer';

describe('_TooltipContainer', () => {
  it('renders the text inside the inverse bubble', () => {
    render(<TooltipContainer>Text message</TooltipContainer>);
    const text = screen.getByText('Text message');
    expect(text).toHaveClass('text-[color:var(--scanner-text-inverse)]');
    expect(text.parentElement).toHaveClass('bg-[var(--scanner-bg-inverse)]', 'rounded-[var(--scanner-radius-md)]');
  });

  it('uses Figma min/max width tokens and no shadow', () => {
    const { container } = render(<TooltipContainer>x</TooltipContainer>);
    const box = container.firstElementChild as HTMLElement;
    expect(box).toHaveClass('min-w-[var(--scanner-tooltip-min-width)]', 'max-w-[var(--scanner-tooltip-max-width)]');
    expect(box.className).not.toMatch(/shadow/);
  });

  it('passes HTML attributes, merges className and forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <TooltipContainer ref={ref} id="tip" role="tooltip" className="custom">
        Hint
      </TooltipContainer>,
    );
    expect(ref.current).toBe(screen.getByRole('tooltip'));
    expect(ref.current).toHaveAttribute('id', 'tip');
    expect(ref.current).toHaveClass('custom');
  });
});
