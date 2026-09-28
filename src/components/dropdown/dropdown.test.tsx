import { describe, it, expect, vi } from 'vitest';
import { createRef, useState } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { Dropdown } from './Dropdown';
import type { DropdownOption } from './dropdown.types';

const OPTIONS: DropdownOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana', disabled: true },
  { value: 'cherry', label: 'Cherry' },
  { value: 'blueberry', label: 'Blueberry' },
];

const trigger = () => screen.getByRole('combobox');
const key = (k: string, init: Partial<KeyboardEventInit> = {}) => fireEvent.keyDown(trigger(), { key: k, ...init });
const option = (name: string) => screen.getByRole('option', { name });

describe('Dropdown', () => {
  it('renders a labelled select-only combobox with placeholder, helper and ref / className', () => {
    const ref = createRef<HTMLButtonElement>();
    const { container } = render(
      <Dropdown ref={ref} label="Fruit" helperText="Pick one" options={OPTIONS} className="custom" />,
    );
    const combobox = screen.getByRole('combobox', { name: 'Fruit' });
    expect(ref.current).toBe(combobox);
    expect(combobox).toHaveAttribute('aria-expanded', 'false');
    expect(combobox).toHaveAttribute('aria-haspopup', 'listbox');
    expect(combobox).toHaveTextContent('Select an option');
    expect(combobox).toHaveAccessibleDescription('Pick one');
    expect(container.firstChild).toHaveClass('custom');
    expect(container.firstChild).toHaveAttribute('data-layer', '1');
  });

  it('opens on click, selects an option and closes (Single, uncontrolled)', () => {
    const onChange = vi.fn();
    render(<Dropdown label="Fruit" options={OPTIONS} onChange={onChange} />);
    fireEvent.click(trigger());
    const listbox = screen.getByRole('listbox', { name: 'Fruit' });
    expect(trigger()).toHaveAttribute('aria-expanded', 'true');
    expect(trigger()).toHaveAttribute('aria-controls', listbox.id);
    fireEvent.click(option('Cherry'));
    expect(onChange).toHaveBeenCalledWith('cherry');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(trigger()).toHaveTextContent('Cherry');
    expect(trigger()).toHaveFocus();
  });

  it('keyboard: ArrowDown opens on the selected option, arrows skip disabled options, Enter selects', () => {
    const onChange = vi.fn();
    render(<Dropdown label="Fruit" options={OPTIONS} defaultValue="apple" onChange={onChange} />);
    key('ArrowDown');
    expect(trigger()).toHaveAttribute('aria-activedescendant', option('Apple').id);
    key('ArrowDown');
    expect(trigger()).toHaveAttribute('aria-activedescendant', option('Cherry').id);
    expect(option('Cherry')).toHaveAttribute('data-active');
    key('ArrowUp');
    expect(trigger()).toHaveAttribute('aria-activedescendant', option('Apple').id);
    key('End');
    expect(trigger()).toHaveAttribute('aria-activedescendant', option('Blueberry').id);
    key('Enter');
    expect(onChange).toHaveBeenCalledWith('blueberry');
    expect(trigger()).toHaveAttribute('aria-expanded', 'false');
  });

  it('keyboard: Space / Enter open, Escape and Tab close without selecting', () => {
    const onChange = vi.fn();
    render(<Dropdown label="Fruit" options={OPTIONS} onChange={onChange} />);
    key(' ');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    key('Escape');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    key('Enter');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    key('Tab');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('type-ahead opens and highlights the matching option', () => {
    render(<Dropdown label="Fruit" options={OPTIONS} />);
    key('c');
    expect(trigger()).toHaveAttribute('aria-activedescendant', option('Cherry').id);
    key('b');
    /* "cb" matches nothing → the active option stays */
    expect(trigger()).toHaveAttribute('aria-activedescendant', option('Cherry').id);
  });

  it('closes on an outside press', () => {
    render(
      <div>
        <Dropdown label="Fruit" options={OPTIONS} defaultOpen />
        <p>Outside</p>
      </div>,
    );
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByText('Outside'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('controlled value and open state', () => {
    const onOpenChange = vi.fn();
    const Controlled = () => {
      const [value, setValue] = useState<string | null>('apple');
      return <Dropdown label="Fruit" options={OPTIONS} value={value} onChange={setValue} open onOpenChange={onOpenChange} />;
    };
    render(<Controlled />);
    expect(option('Apple')).toHaveAttribute('aria-selected', 'true');
    fireEvent.click(option('Cherry'));
    expect(option('Cherry')).toHaveAttribute('aria-selected', 'true');
    expect(onOpenChange).toHaveBeenCalledWith(false);
    /* still open: `open` is controlled */
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('Multi: options toggle, the menu stays open and values show as removable tags', () => {
    const onChange = vi.fn();
    render(<Dropdown type="multi" label="Fruit" options={OPTIONS} onChange={onChange} />);
    fireEvent.click(trigger());
    expect(screen.getByRole('listbox')).toHaveAttribute('aria-multiselectable', 'true');
    fireEvent.click(option('Apple'));
    expect(onChange).toHaveBeenLastCalledWith(['apple']);
    key('ArrowDown');
    key('Enter');
    expect(onChange).toHaveBeenLastCalledWith(['apple', 'cherry']);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    const tags = screen.getByRole('group', { name: 'Selected options' });
    expect(within(tags).getByText('Apple')).toBeInTheDocument();
    fireEvent.click(within(tags).getByRole('button', { name: 'Remove Apple' }));
    expect(onChange).toHaveBeenLastCalledWith(['cherry']);
  });

  it('Multi: Backspace on the closed trigger removes the last tag', () => {
    const onChange = vi.fn();
    render(<Dropdown type="multi" label="Fruit" options={OPTIONS} defaultValue={['apple', 'cherry']} onChange={onChange} />);
    key('Backspace');
    expect(onChange).toHaveBeenCalledWith(['apple']);
  });

  it('disabled: no menu, aria-disabled, disabled tags', () => {
    render(<Dropdown type="multi" label="Fruit" options={OPTIONS} defaultValue={['apple']} disabled />);
    expect(trigger()).toBeDisabled();
    expect(trigger()).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(trigger());
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove Apple' })).toBeDisabled();
  });

  it('error: aria-invalid, error message replaces helper, error stroke', () => {
    render(<Dropdown label="Fruit" options={OPTIONS} helperText="Help" error errorText="Required" />);
    expect(trigger()).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
    expect(screen.queryByText('Help')).not.toBeInTheDocument();
    expect(trigger()).toHaveAccessibleDescription('Required');
  });

  it('required + explainer render in the label row', () => {
    render(<Dropdown label="Fruit" options={OPTIONS} required tooltip="More info" />);
    expect(trigger()).toHaveAttribute('aria-required', 'true');
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Help: More info' })).toBeInTheDocument();
  });

  it('skeleton renders placeholders only', () => {
    const { container } = render(<Dropdown label="Fruit" helperText="Help" options={OPTIONS} skeleton />);
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    expect(container.firstChild).toHaveAttribute('data-skeleton');
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('forced data-state and layer reach the field', () => {
    const { container } = render(<Dropdown label="Fruit" options={OPTIONS} layer={2} data-state="hovered" />);
    const field = container.querySelector('[data-part="field"]');
    expect(field).toHaveAttribute('data-state', 'hovered');
    expect(field).toHaveClass('bg-[var(--scanner-bg-layer-02)]');
  });

  it('renders hidden inputs for forms', () => {
    const { container } = render(
      <Dropdown type="multi" name="fruit" options={OPTIONS} defaultValue={['apple', 'cherry']} aria-label="Fruit" />,
    );
    const inputs = container.querySelectorAll('input[type="hidden"][name="fruit"]');
    expect(Array.from(inputs).map((i) => (i as HTMLInputElement).value)).toEqual(['apple', 'cherry']);
  });
});
