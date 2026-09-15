import { describe, it, expect, vi } from 'vitest';
import { createRef, useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { SelectMenu } from './SelectMenu';
import { SelectMenuItem } from '../_select-menu-item';
import type { SelectMenuProps } from './select-menu.types';

const Letters = (props: SelectMenuProps & { ref?: React.Ref<HTMLDivElement> }) => (
  <SelectMenu aria-label="Letters" {...props}>
    <SelectMenuItem value="a" optionText="A" />
    <SelectMenuItem value="b" optionText="B" disabled />
    <SelectMenuItem value="c" optionText="C" />
    <SelectMenuItem value="d" optionText="D" />
  </SelectMenu>
);

describe('SelectMenu', () => {
  it('renders a listbox with its options and forwards ref / className', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Letters ref={ref} className="custom" />);
    const listbox = screen.getByRole('listbox', { name: 'Letters' });
    expect(ref.current).toBe(listbox);
    expect(listbox).toHaveClass('custom');
    expect(screen.getAllByRole('option')).toHaveLength(4);
  });

  it('uncontrolled: defaultValue selects and clicks change the selection', () => {
    const onChange = vi.fn();
    render(<Letters defaultValue="a" onChange={onChange} />);
    expect(screen.getByRole('option', { name: 'A' })).toHaveAttribute('aria-selected', 'true');
    fireEvent.click(screen.getByRole('option', { name: 'C' }));
    expect(onChange).toHaveBeenCalledWith('c');
    expect(screen.getByRole('option', { name: 'C' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('option', { name: 'A' })).toHaveAttribute('aria-selected', 'false');
  });

  it('controlled: value wins until the parent updates it', () => {
    const onChange = vi.fn();
    render(<Letters value="a" onChange={onChange} />);
    fireEvent.click(screen.getByRole('option', { name: 'C' }));
    expect(onChange).toHaveBeenCalledWith('c');
    expect(screen.getByRole('option', { name: 'A' })).toHaveAttribute('aria-selected', 'true');
  });

  it('ignores clicks on disabled options', () => {
    const onChange = vi.fn();
    render(<Letters onChange={onChange} />);
    fireEvent.click(screen.getByRole('option', { name: 'B' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('roving: focusing the list moves focus to the selected option; arrows skip disabled and wrap', () => {
    render(<Letters defaultValue="c" />);
    const listbox = screen.getByRole('listbox');
    act(() => listbox.focus());
    expect(screen.getByRole('option', { name: 'C' })).toHaveFocus();
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowUp' });
    expect(screen.getByRole('option', { name: 'A' })).toHaveFocus();
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowUp' });
    expect(screen.getByRole('option', { name: 'D' })).toHaveFocus();
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowDown' });
    expect(screen.getByRole('option', { name: 'A' })).toHaveFocus();
    fireEvent.keyDown(document.activeElement as Element, { key: 'End' });
    expect(screen.getByRole('option', { name: 'D' })).toHaveFocus();
    fireEvent.keyDown(document.activeElement as Element, { key: 'Home' });
    expect(screen.getByRole('option', { name: 'A' })).toHaveFocus();
  });

  it('Enter and Space select the focused option; Escape calls onClose', () => {
    const onChange = vi.fn();
    const onClose = vi.fn();
    render(<Letters onChange={onChange} onClose={onClose} />);
    act(() => screen.getByRole('listbox').focus());
    fireEvent.keyDown(document.activeElement as Element, { key: 'Enter' });
    expect(onChange).toHaveBeenLastCalledWith('a');
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowDown' });
    fireEvent.keyDown(document.activeElement as Element, { key: ' ' });
    expect(onChange).toHaveBeenLastCalledWith('c');
    fireEvent.keyDown(document.activeElement as Element, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('roving tabindex: list is tabbable until focus is inside', () => {
    render(<Letters />);
    const listbox = screen.getByRole('listbox');
    expect(listbox).toHaveAttribute('tabindex', '0');
    act(() => listbox.focus());
    expect(listbox).toHaveAttribute('tabindex', '-1');
    screen.getAllByRole('option').forEach((o) => expect(o).toHaveAttribute('tabindex', '-1'));
  });

  it('activedescendant mode keeps focus on the list and exposes the active option', () => {
    const onActiveChange = vi.fn();
    const onChange = vi.fn();
    render(<Letters focusMode="activedescendant" onActiveChange={onActiveChange} onChange={onChange} />);
    const listbox = screen.getByRole('listbox');
    act(() => listbox.focus());
    expect(listbox).toHaveFocus();
    const a = screen.getByRole('option', { name: 'A' });
    expect(listbox).toHaveAttribute('aria-activedescendant', a.id);
    expect(a).toHaveAttribute('data-active');
    expect(a).not.toHaveAttribute('tabindex');
    fireEvent.keyDown(listbox, { key: 'ArrowDown' });
    const c = screen.getByRole('option', { name: 'C' });
    expect(listbox).toHaveAttribute('aria-activedescendant', c.id);
    expect(onActiveChange).toHaveBeenLastCalledWith('c');
    fireEvent.keyDown(listbox, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith('c');
    expect(listbox).toHaveFocus();
  });

  it('activeValue can be controlled from outside (e.g. a Combobox input)', () => {
    const Harness = () => {
      const [active, setActive] = useState<string | null>('d');
      return (
        <>
          <button onClick={() => setActive('a')}>first</button>
          <Letters focusMode="activedescendant" activeValue={active} />
        </>
      );
    };
    render(<Harness />);
    const listbox = screen.getByRole('listbox');
    expect(listbox).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'D' }).id);
    fireEvent.click(screen.getByText('first'));
    expect(listbox).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'A' }).id);
  });

  it('scroll + maxHeight make the list scrollable', () => {
    render(<Letters scroll maxHeight={120} />);
    const listbox = screen.getByRole('listbox');
    expect(listbox).toHaveStyle({ maxHeight: '120px' });
    expect(listbox).toHaveClass('overflow-y-auto');
  });

  it('autoFocus focuses the selected option on mount', () => {
    render(<Letters defaultValue="d" autoFocus />);
    expect(screen.getByRole('option', { name: 'D' })).toHaveFocus();
  });
});
