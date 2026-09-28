import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { SlotContent } from './SlotContent';

describe('SlotContent', () => {
  it('renders the Figma placeholder text by default', () => {
    render(<SlotContent />);
    expect(screen.getByText('Swap me to any component')).toBeInTheDocument();
  });

  it('renders custom children instead of the placeholder', () => {
    render(<SlotContent>Filters</SlotContent>);
    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.queryByText('Swap me to any component')).not.toBeInTheDocument();
  });

  it('uses the dashed interactive outline and link text tokens', () => {
    const { container } = render(<SlotContent />);
    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute('data-slot-content');
    expect(el.className).toContain('outline-dashed');
    expect(el.className).toContain('outline-[var(--scanner-border-interactive)]');
    expect(el.className).toContain('text-[color:var(--scanner-text-link)]');
  });

  it('forwards ref, merges className and passes attributes', () => {
    const ref = createRef<HTMLDivElement>();
    render(<SlotContent ref={ref} className="custom" data-testid="slot" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(screen.getByTestId('slot')).toHaveClass('custom');
  });
});
