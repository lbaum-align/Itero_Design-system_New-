import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { Combobox } from './Combobox';
import type { ComboboxOption } from './combobox.types';

const OPTIONS: ComboboxOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana', disabled: true },
  { value: 'cherry', label: 'Cherry' },
  { value: 'blueberry', label: 'Blueberry' },
];

const input = () => screen.getByRole('combobox') as HTMLInputElement;
const key = (k: string) => fireEvent.keyDown(input(), { key: k });
const type = (text: string) => fireEvent.change(input(), { target: { value: text } });
const option = (name: string) => screen.getByRole('option', { name });
const optionNames = () => screen.queryAllByRole('option').map((o) => o.textContent);

describe('Combobox', () => {
  it('renders a labelled text combobox with list autocomplete, placeholder and ref / className', () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = render(
      <Combobox ref={ref} label="Fruit" helperText="Search" options={OPTIONS} className="custom" />,
    );
    const combobox = screen.getByRole('combobox', { name: 'Fruit' });
    expect(ref.current).toBe(combobox);
    expect(combobox.tagName).toBe('INPUT');
    expect(combobox).toHaveAttribute('aria-autocomplete', 'list');
    expect(combobox).toHaveAttribute('aria-expanded', 'false');
    expect(combobox).toHaveAttribute('placeholder', 'Select an option');
    expect(combobox).toHaveAccessibleDescription('Search');
    expect(container.firstChild).toHaveClass('custom');
  });

  it('typing opens the menu, filters options and highlights the first match', () => {
    const onInputChange = vi.fn();
    render(<Combobox label="Fruit" options={OPTIONS} onInputChange={onInputChange} />);
    type('b');
    expect(onInputChange).toHaveBeenCalledWith('b');
    expect(optionNames()).toEqual(['Banana', 'Blueberry']);
    /* Banana is disabled → Blueberry is active */
    expect(input()).toHaveAttribute('aria-activedescendant', option('Blueberry').id);
    type('xyz');
    expect(optionNames()).toEqual(['No results found']);
  });

  it('Single: Enter selects, shows the label and closes; editing then leaving restores the label', () => {
    const onChange = vi.fn();
    render(<Combobox label="Fruit" options={OPTIONS} onChange={onChange} />);
    type('ch');
    key('Enter');
    expect(onChange).toHaveBeenCalledWith('cherry');
    expect(input().value).toBe('Cherry');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    type('Che');
    fireEvent.blur(input(), { relatedTarget: null });
    expect(input().value).toBe('Cherry');
  });

  it('Single: emptying the text and leaving clears the value', () => {
    const onChange = vi.fn();
    render(<Combobox label="Fruit" options={OPTIONS} defaultValue="apple" onChange={onChange} />);
    expect(input().value).toBe('Apple');
    type('');
    fireEvent.blur(input(), { relatedTarget: null });
    expect(onChange).toHaveBeenCalledWith(null);
    expect(input().value).toBe('');
  });

  it('keyboard: ArrowDown opens on the selected option and moves; ArrowUp opens on the last; Escape closes then clears', () => {
    const onChange = vi.fn();
    render(<Combobox label="Fruit" options={OPTIONS} defaultValue="cherry" onChange={onChange} />);
    key('ArrowDown');
    expect(input()).toHaveAttribute('aria-activedescendant', option('Cherry').id);
    key('ArrowDown');
    expect(input()).toHaveAttribute('aria-activedescendant', option('Blueberry').id);
    key('Escape');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(input().value).toBe('Cherry');
    key('Escape');
    expect(input().value).toBe('');
    expect(onChange).toHaveBeenCalledWith(null);

    key('ArrowUp');
    expect(input()).toHaveAttribute('aria-activedescendant', option('Blueberry').id);
  });

  it('mouse: clicking the input opens, clicking an option selects', () => {
    const onChange = vi.fn();
    render(<Combobox label="Fruit" options={OPTIONS} onChange={onChange} />);
    fireEvent.click(input());
    expect(optionNames()).toHaveLength(4);
    fireEvent.click(option('Apple'));
    expect(onChange).toHaveBeenCalledWith('apple');
    expect(input()).toHaveFocus();
  });

  it('chevron button toggles the menu', () => {
    render(<Combobox label="Fruit" options={OPTIONS} />);
    fireEvent.click(screen.getByRole('button', { name: 'Show options' }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Hide options' }));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('Multi: Enter toggles, clears the text, keeps the menu open; tags and Backspace remove values', () => {
    const onChange = vi.fn();
    render(<Combobox type="multi" label="Fruit" options={OPTIONS} onChange={onChange} />);
    type('app');
    key('Enter');
    expect(onChange).toHaveBeenLastCalledWith(['apple']);
    expect(input().value).toBe('');
    expect(screen.getByRole('listbox')).toHaveAttribute('aria-multiselectable', 'true');

    type('cher');
    key('Enter');
    expect(onChange).toHaveBeenLastCalledWith(['apple', 'cherry']);
    const tags = screen.getByRole('group', { name: 'Selected options' });
    expect(within(tags).getByText('Cherry')).toBeInTheDocument();
    expect(input()).not.toHaveAttribute('placeholder');

    fireEvent.click(within(tags).getByRole('button', { name: 'Remove Apple' }));
    expect(onChange).toHaveBeenLastCalledWith(['cherry']);
    key('Backspace');
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  it('filter={false} shows every option', () => {
    render(<Combobox label="Fruit" options={OPTIONS} filter={false} />);
    type('zzz');
    expect(optionNames()).toHaveLength(4);
  });

  it('closes on an outside press', () => {
    render(
      <div>
        <Combobox label="Fruit" options={OPTIONS} defaultOpen />
        <p>Outside</p>
      </div>,
    );
    fireEvent.mouseDown(screen.getByText('Outside'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('disabled: input disabled, typing and chevron do nothing', () => {
    render(<Combobox label="Fruit" options={OPTIONS} disabled />);
    expect(input()).toBeDisabled();
    expect(input()).toHaveAttribute('aria-disabled', 'true');
    key('ArrowDown');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('error: aria-invalid and error message', () => {
    render(<Combobox label="Fruit" options={OPTIONS} error errorText="Required" helperText="Help" />);
    expect(input()).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
    expect(screen.queryByText('Help')).not.toBeInTheDocument();
  });

  it('skeleton renders placeholders only', () => {
    const { container } = render(<Combobox label="Fruit" options={OPTIONS} skeleton />);
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    expect(container.firstChild).toHaveAttribute('data-skeleton');
  });

  it('forced data-state and layer reach the field', () => {
    const { container } = render(<Combobox label="Fruit" options={OPTIONS} layer={2} data-state="focused" />);
    const field = container.querySelector('[data-part="field"]');
    expect(field).toHaveAttribute('data-state', 'focused');
    expect(field).toHaveClass('bg-[var(--scanner-bg-layer-02)]');
  });
});
