import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AccordionItem } from './AccordionItem';

describe('AccordionItem', () => {
  it('renders a header button inside a heading, linked to its panel', () => {
    render(<AccordionItem id="scan" title="Scan settings" description="Body" />);
    const header = screen.getByRole('button', { name: 'Scan settings' });
    expect(header).toHaveAttribute('type', 'button');
    expect(header).toHaveAttribute('id', 'scan-header');
    expect(header).toHaveAttribute('aria-controls', 'scan-panel');
    expect(header.closest('h3')).toBeInTheDocument();
    const panel = document.getElementById('scan-panel');
    expect(panel).toHaveAttribute('role', 'region');
    expect(panel).toHaveAttribute('aria-labelledby', 'scan-header');
  });

  it('respects headingLevel', () => {
    render(<AccordionItem title="T" headingLevel={2} />);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('is collapsed by default with the panel hidden and a chevron-down icon', () => {
    render(<AccordionItem id="a" title="T" description="Body" />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
    expect(document.getElementById('a-panel')).not.toBeVisible();
  });

  it('toggles itself when uncontrolled and reports the next value', async () => {
    const onToggle = vi.fn();
    render(<AccordionItem title="T" description="Body" onToggle={onToggle} />);
    const header = screen.getByRole('button');
    await userEvent.click(header);
    expect(header).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Body')).toBeVisible();
    expect(onToggle).toHaveBeenLastCalledWith(true);
    await userEvent.click(header);
    expect(header).toHaveAttribute('aria-expanded', 'false');
    expect(onToggle).toHaveBeenLastCalledWith(false);
  });

  it('honours defaultExpanded', () => {
    render(<AccordionItem title="T" description="Body" defaultExpanded />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  });

  it('stays in sync with a controlled expanded prop', () => {
    const onToggle = vi.fn();
    const { rerender } = render(<AccordionItem title="T" expanded={false} onToggle={onToggle} />);
    const header = screen.getByRole('button');
    fireEvent.click(header);
    expect(onToggle).toHaveBeenCalledWith(true);
    expect(header).toHaveAttribute('aria-expanded', 'false');
    rerender(<AccordionItem title="T" expanded onToggle={onToggle} />);
    expect(header).toHaveAttribute('aria-expanded', 'true');
  });

  it('toggles with Enter and Space', async () => {
    render(<AccordionItem title="T" />);
    await userEvent.tab();
    const header = screen.getByRole('button');
    expect(header).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(header).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard(' ');
    expect(header).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders description and swap content together', () => {
    render(
      <AccordionItem title="T" description="Body" expanded>
        <button type="button">Slot action</button>
      </AccordionItem>,
    );
    expect(screen.getByText('Body')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Slot action' })).toBeVisible();
  });

  describe('disabled', () => {
    it('sets disabled + aria-disabled and ignores activation', () => {
      const onToggle = vi.fn();
      render(<AccordionItem title="T" disabled onToggle={onToggle} />);
      const header = screen.getByRole('button');
      expect(header).toBeDisabled();
      expect(header).toHaveAttribute('aria-disabled', 'true');
      fireEvent.click(header);
      expect(onToggle).not.toHaveBeenCalled();
      expect(header).toHaveAttribute('aria-expanded', 'false');
    });

    it('does not render a focus ring', () => {
      const { container } = render(<AccordionItem title="T" disabled />);
      expect(container.querySelector('[data-part="focus-ring"]')).toBeNull();
    });
  });

  describe('skeleton', () => {
    it('renders a hidden placeholder without a button', () => {
      const { container } = render(<AccordionItem title="T" skeleton />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
      const placeholder = container.querySelector('[data-skeleton]');
      expect(placeholder).toHaveAttribute('aria-hidden', 'true');
      expect(placeholder).toHaveClass('animate-pulse');
    });

    it('shows six content lines when expanded', () => {
      const { container } = render(<AccordionItem title="T" skeleton expanded />);
      const lines = container.querySelectorAll('[data-skeleton] > div:nth-child(2) > div');
      expect(lines).toHaveLength(6);
    });
  });

  it('uses a 24px chevron that points up when expanded', () => {
    const { container, rerender } = render(<AccordionItem title="T" expanded={false} />);
    const svg = container.querySelector('button svg');
    expect(svg).toHaveAttribute('width', '24');
    const collapsedMarkup = svg?.innerHTML;
    rerender(<AccordionItem title="T" expanded />);
    expect(container.querySelector('button svg')?.innerHTML).not.toBe(collapsedMarkup);
  });

  it('applies style classes per variant', () => {
    const { container, rerender } = render(<AccordionItem title="T" variant="background-02" />);
    expect(container.firstChild).toHaveClass('bg-[var(--scanner-bg-layer-02)]');
    rerender(<AccordionItem title="T" variant="line" />);
    expect(container.firstChild).toHaveClass('shadow-[inset_0_-1px_0_0_var(--scanner-border-subtle)]');
  });

  it('passes data-state to the header for forced visual states', () => {
    render(<AccordionItem title="T" data-state="focused" />);
    expect(screen.getByRole('button')).toHaveAttribute('data-state', 'focused');
  });

  it('forwards the ref, merges className and spreads HTML attributes on the root', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<AccordionItem ref={ref} title="T" className="custom" data-testid="root" />);
    expect(ref.current).toBe(container.firstChild);
    expect(ref.current).toHaveClass('custom');
    expect(screen.getByTestId('root')).toBe(ref.current);
  });
});
