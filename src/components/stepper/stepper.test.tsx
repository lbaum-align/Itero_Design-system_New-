import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { render, screen, within } from '@testing-library/react';
import { Stepper } from './Stepper';

const steps = [{ label: 'One' }, { label: 'Two' }, { label: 'Three' }, { label: 'Four' }];
const states = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('li > [data-state]')).map((el) => el.getAttribute('data-state'));

describe('Stepper', () => {
  it('renders an ordered list named "Progress" with one item per step', () => {
    render(<Stepper steps={steps} />);
    const list = screen.getByRole('list', { name: 'Progress' });
    expect(list.tagName).toBe('OL');
    expect(within(list).getAllByRole('listitem')).toHaveLength(4);
  });

  it('derives states from currentStep and marks the current step', () => {
    const { container } = render(<Stepper steps={steps} currentStep={2} />);
    expect(states(container)).toEqual(['completed', 'completed', 'in-progress', 'not-started']);
    expect(screen.getAllByRole('listitem')[2]).toHaveAttribute('aria-current', 'step');
    expect(screen.getByText(', current step')).toHaveClass('sr-only');
  });

  it('error shows the Error state on the current step; skeleton on all steps', () => {
    const { container, rerender } = render(<Stepper steps={steps} currentStep={1} error />);
    expect(states(container)).toEqual(['completed', 'error', 'not-started', 'not-started']);
    rerender(<Stepper steps={steps} skeleton />);
    expect(states(container)).toEqual(['skeleton', 'skeleton', 'skeleton', 'skeleton']);
    expect(screen.getByRole('list')).toHaveAttribute('aria-busy', 'true');
  });

  it('per-step state overrides the derived state', () => {
    const { container } = render(
      <Stepper steps={[{ label: 'A', state: 'error' }, { label: 'B' }]} currentStep={1} />,
    );
    expect(states(container)).toEqual(['error', 'in-progress']);
  });

  it('hides the line on the first step only', () => {
    const { container } = render(<Stepper steps={steps} />);
    const items = container.querySelectorAll('li');
    expect(items[0].querySelector('[data-line]')).toBeNull();
    expect(items[1].querySelector('[data-line]')).not.toBeNull();
  });

  it('switches layout with orientation or the Figma "position" alias', () => {
    const { rerender } = render(<Stepper steps={steps} orientation="vertical" />);
    expect(screen.getByRole('list')).toHaveAttribute('data-orientation', 'vertical');
    expect(screen.getByRole('list')).toHaveClass('flex-col', 'gap-[var(--scanner-spacing-3)]');
    rerender(<Stepper steps={steps} orientation="vertical" position="horizontal" />);
    expect(screen.getByRole('list')).toHaveAttribute('data-orientation', 'horizontal');
  });

  it('renders at most 8 steps and supports custom status labels and aria-label', () => {
    render(
      <Stepper
        aria-label="Case setup"
        steps={Array.from({ length: 10 }, (_, i) => ({ label: `S${i}` }))}
        currentStep={1}
        statusLabels={{ completed: 'done' }}
      />,
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(8);
    expect(screen.getByRole('list', { name: 'Case setup' })).toBeInTheDocument();
    expect(screen.getByText(', done')).toBeInTheDocument();
  });

  it('merges className and forwards the ref', () => {
    const ref = createRef<HTMLOListElement>();
    render(<Stepper ref={ref} steps={steps} className="custom" />);
    expect(ref.current).toHaveClass('custom');
  });
});
