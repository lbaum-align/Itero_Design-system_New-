import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AccordionGroup } from './AccordionGroup';
import type { AccordionGroupItem } from './accordion-group.types';

const items: AccordionGroupItem[] = [
  { id: 'a', title: 'Alpha', description: 'Alpha body' },
  { id: 'b', title: 'Beta', description: 'Beta body' },
  { id: 'c', title: 'Gamma', description: 'Gamma body' },
];

const header = (name: string) => screen.getByRole('button', { name });

describe('AccordionGroup', () => {
  it('renders one header per item, all collapsed by default', () => {
    render(<AccordionGroup items={items} />);
    expect(screen.getAllByRole('button')).toHaveLength(3);
    for (const name of ['Alpha', 'Beta', 'Gamma']) expect(header(name)).toHaveAttribute('aria-expanded', 'false');
  });

  it('allows several items open at once by default (Figma docs)', async () => {
    const onExpandedChange = vi.fn();
    render(<AccordionGroup items={items} onExpandedChange={onExpandedChange} />);
    await userEvent.click(header('Alpha'));
    await userEvent.click(header('Beta'));
    expect(header('Alpha')).toHaveAttribute('aria-expanded', 'true');
    expect(header('Beta')).toHaveAttribute('aria-expanded', 'true');
    expect(onExpandedChange).toHaveBeenLastCalledWith(['a', 'b']);
  });

  it('collapses the others in single-expand mode', async () => {
    render(<AccordionGroup items={items} allowMultiple={false} defaultExpandedIds={['a']} />);
    await userEvent.click(header('Beta'));
    expect(header('Beta')).toHaveAttribute('aria-expanded', 'true');
    expect(header('Alpha')).toHaveAttribute('aria-expanded', 'false');
  });

  it('collapses an expanded item when its header is activated again', async () => {
    render(<AccordionGroup items={items} defaultExpandedIds={['a']} />);
    await userEvent.click(header('Alpha'));
    expect(header('Alpha')).toHaveAttribute('aria-expanded', 'false');
  });

  it('is controlled by expandedIds', async () => {
    const onExpandedChange = vi.fn();
    const { rerender } = render(<AccordionGroup items={items} expandedIds={['b']} onExpandedChange={onExpandedChange} />);
    expect(header('Beta')).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(header('Alpha'));
    expect(onExpandedChange).toHaveBeenCalledWith(['b', 'a']);
    expect(header('Alpha')).toHaveAttribute('aria-expanded', 'false');
    rerender(<AccordionGroup items={items} expandedIds={['a']} onExpandedChange={onExpandedChange} />);
    expect(header('Alpha')).toHaveAttribute('aria-expanded', 'true');
  });

  describe('keyboard', () => {
    it('moves focus with Arrow Up/Down (wrapping) and Home/End', async () => {
      render(<AccordionGroup items={items} />);
      await userEvent.tab();
      expect(header('Alpha')).toHaveFocus();
      await userEvent.keyboard('{ArrowDown}');
      expect(header('Beta')).toHaveFocus();
      await userEvent.keyboard('{End}');
      expect(header('Gamma')).toHaveFocus();
      await userEvent.keyboard('{ArrowDown}');
      expect(header('Alpha')).toHaveFocus();
      await userEvent.keyboard('{ArrowUp}');
      expect(header('Gamma')).toHaveFocus();
      await userEvent.keyboard('{Home}');
      expect(header('Alpha')).toHaveFocus();
    });

    it('skips disabled headers', async () => {
      render(<AccordionGroup items={[items[0], { ...items[1], disabled: true }, items[2]]} />);
      await userEvent.tab();
      await userEvent.keyboard('{ArrowDown}');
      expect(header('Gamma')).toHaveFocus();
    });

    it('ignores arrow keys from inside a panel', async () => {
      render(
        <AccordionGroup
          items={[{ id: 'a', title: 'Alpha', content: <button type="button">Inner</button> }, items[1]]}
          defaultExpandedIds={['a']}
        />,
      );
      const inner = screen.getByRole('button', { name: 'Inner' });
      inner.focus();
      await userEvent.keyboard('{ArrowDown}');
      expect(inner).toHaveFocus();
    });
  });

  it('uses an 8px gap except for the Line style', () => {
    const { container, rerender } = render(<AccordionGroup items={items} />);
    expect(container.firstChild).toHaveClass('gap-[var(--scanner-spacing-3)]');
    rerender(<AccordionGroup items={items} variant="line" />);
    expect(container.firstChild).toHaveClass('gap-0');
  });

  it('renders every item as a skeleton', () => {
    const { container } = render(<AccordionGroup items={items} skeleton />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
    expect(container.querySelectorAll('[data-skeleton]')).toHaveLength(3);
  });

  it('keeps ids unique across two groups with the same item ids', () => {
    render(
      <>
        <AccordionGroup items={items} />
        <AccordionGroup items={items} />
      </>,
    );
    const ids = screen.getAllByRole('button').map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('forwards the ref, merges className and spreads HTML attributes', () => {
    const ref = createRef<HTMLDivElement>();
    render(<AccordionGroup ref={ref} items={items} className="custom" aria-label="FAQ" />);
    expect(ref.current).toHaveClass('custom');
    expect(ref.current).toHaveAttribute('aria-label', 'FAQ');
  });
});
