import { describe, it, expect, vi } from 'vitest';
import { createRef, useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SelectMenuItem } from '../_select-menu-item';
import { SearchInput } from './SearchInput';
import type { SearchInputProps } from './search-input.types';

const field = (container: HTMLElement) => container.querySelector('[data-part="field"]') as HTMLElement;

const FRUITS = ['Apple', 'Apricot', 'Banana'];
const items = FRUITS.map((f) => <SelectMenuItem key={f} value={f} optionText={f} />);

function Suggest(props: Partial<SearchInputProps>) {
  const [query, setQuery] = useState('');
  return (
    <SearchInput
      aria-label="Fruit"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      suggestions={query ? items : null}
      {...props}
    />
  );
}

describe('SearchInput', () => {
  it('renders a searchbox with the placeholder as accessible name', () => {
    render(<SearchInput />);
    const input = screen.getByRole('searchbox', { name: 'Search' });
    expect(input).toHaveAttribute('type', 'search');
    expect(input).toHaveAttribute('placeholder', 'Search');
  });

  it('prefers aria-label / aria-labelledby over the placeholder', () => {
    const { rerender } = render(<SearchInput aria-label="Find patient" />);
    expect(screen.getByRole('searchbox', { name: 'Find patient' })).toBeInTheDocument();
    rerender(
      <>
        <span id="lbl">Orders</span>
        <SearchInput aria-labelledby="lbl" />
      </>,
    );
    expect(screen.getByRole('searchbox', { name: 'Orders' })).not.toHaveAttribute('aria-label');
  });

  it('forwards the ref to the native input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<SearchInput ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('merges className on the root and sets data-layer / data-size', () => {
    const { container } = render(<SearchInput className="custom" layer={2} size="small" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass('custom');
    expect(root).toHaveAttribute('data-layer', '2');
    expect(root).toHaveAttribute('data-size', 'small');
    expect(field(container).className).toContain('--scanner-bg-layer-02');
  });

  it.each([
    ['large', '--scanner-search-input-height-lg'],
    ['medium', '--scanner-search-input-height-md'],
    ['small', '--scanner-search-input-height-sm'],
  ] as const)('applies the %s field height', (size, token) => {
    const { container } = render(<SearchInput size={size} />);
    expect(field(container).className).toContain(token);
  });

  it('has a border-subtle stroke only at Large', () => {
    const { container, rerender } = render(<SearchInput size="large" />);
    expect(field(container).className).toContain('inset_0_0_0_1px_var(--scanner-border-subtle)');
    rerender(<SearchInput size="medium" />);
    expect(field(container).className).not.toContain('inset_0_0_0_1px_var(--scanner-border-subtle)');
    expect(field(container).className).toContain('--scanner-border-focus');
  });

  it('passes data-state to the field for forced visual states', () => {
    const { container } = render(<SearchInput data-state="focused" />);
    expect(field(container)).toHaveAttribute('data-state', 'focused');
    expect(screen.getByRole('searchbox')).not.toHaveAttribute('data-state');
  });

  it('renders a hidden skeleton placeholder', () => {
    const { container } = render(<SearchInput skeleton size="medium" />);
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
    const placeholder = container.querySelector('[data-skeleton]') as HTMLElement;
    expect(placeholder).toHaveAttribute('aria-hidden', 'true');
    expect(placeholder.className).toContain('--scanner-search-input-height-md');
  });

  describe('clear', () => {
    it('shows the clear button only while filled', async () => {
      render(<SearchInput />);
      expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();
      await userEvent.type(screen.getByRole('searchbox'), 'a');
      expect(screen.getByRole('button', { name: 'Clear search' })).toBeInTheDocument();
    });

    it('clears, fires onChange + onClear and refocuses', async () => {
      const onChange = vi.fn();
      const onClear = vi.fn();
      render(<SearchInput defaultValue="abc" onChange={onChange} onClear={onClear} clearLabel="Reset" />);
      await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
      const input = screen.getByRole('searchbox');
      expect(input).toHaveValue('');
      expect(input).toHaveFocus();
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onClear).toHaveBeenCalledTimes(1);
    });

    it('clears on Escape', () => {
      const onClear = vi.fn();
      render(<SearchInput defaultValue="abc" onClear={onClear} />);
      const input = screen.getByRole('searchbox');
      fireEvent.keyDown(input, { key: 'Escape' });
      expect(input).toHaveValue('');
      expect(onClear).toHaveBeenCalled();
    });

    it('hides the clear button when disabled', () => {
      render(<SearchInput defaultValue="abc" disabled />);
      expect(screen.getByRole('searchbox')).toBeDisabled();
      expect(screen.getByRole('searchbox')).toHaveAttribute('aria-disabled', 'true');
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  it('calls onSearch with the query on Enter', async () => {
    const onSearch = vi.fn();
    render(<SearchInput onSearch={onSearch} />);
    await userEvent.type(screen.getByRole('searchbox'), 'teeth{Enter}');
    expect(onSearch).toHaveBeenCalledWith('teeth');
  });

  it('focuses the input when the field container is pressed', () => {
    const { container } = render(<SearchInput />);
    fireEvent.mouseDown(field(container));
    expect(screen.getByRole('searchbox')).toHaveFocus();
  });

  describe('suggestions (Show menu)', () => {
    it('becomes a combobox that opens while typing', async () => {
      render(<Suggest />);
      const input = screen.getByRole('searchbox');
      await userEvent.type(input, 'a');
      const combo = screen.getByRole('combobox', { name: 'Fruit' });
      expect(combo).toHaveAttribute('aria-expanded', 'true');
      const listbox = screen.getByRole('listbox');
      expect(combo).toHaveAttribute('aria-controls', listbox.id);
      expect(combo).toHaveAttribute('aria-autocomplete', 'list');
    });

    it('moves the highlight with arrows via aria-activedescendant and selects with Enter', async () => {
      const onSuggestionSelect = vi.fn();
      const onSearch = vi.fn();
      render(<Suggest onSuggestionSelect={onSuggestionSelect} onSearch={onSearch} />);
      const input = screen.getByRole('searchbox');
      await userEvent.type(input, 'a');
      await userEvent.keyboard('{ArrowDown}');
      expect(input).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Apple' }).id);
      await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}');
      /* wraps back to the first option */
      expect(input).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Apple' }).id);
      await userEvent.keyboard('{ArrowUp}');
      expect(input).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Banana' }).id);
      await userEvent.keyboard('{Enter}');
      expect(onSuggestionSelect).toHaveBeenCalledWith('Banana');
      expect(onSearch).not.toHaveBeenCalled();
      expect(input).toHaveValue('Banana');
      expect(input).toHaveAttribute('aria-expanded', 'false');
      expect(input).not.toHaveAttribute('aria-activedescendant');
      expect(input).toHaveFocus();
    });

    it('selects a clicked option and keeps focus in the input', async () => {
      render(<Suggest />);
      const input = screen.getByRole('searchbox');
      await userEvent.type(input, 'ap');
      await userEvent.click(screen.getByRole('option', { name: 'Apricot' }));
      expect(input).toHaveValue('Apricot');
      expect(input).toHaveFocus();
    });

    it('closes on the first Escape and clears on the second', async () => {
      render(<Suggest />);
      const input = screen.getByRole('searchbox');
      await userEvent.type(input, 'a');
      await userEvent.keyboard('{Escape}');
      expect(input).toHaveAttribute('aria-expanded', 'false');
      expect(input).toHaveValue('a');
      await userEvent.keyboard('{Escape}');
      expect(input).toHaveValue('');
    });

    it('closes on blur', async () => {
      render(<Suggest />);
      const input = screen.getByRole('searchbox');
      await userEvent.type(input, 'a');
      await userEvent.tab();
      expect(input).toHaveAttribute('aria-expanded', 'false');
    });

    it('respects controlled showMenu and reports requests', async () => {
      const onShowMenuChange = vi.fn();
      render(<SearchInput aria-label="Fruit" showMenu suggestions={items} onShowMenuChange={onShowMenuChange} />);
      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('listbox')).toBeVisible();
      input.focus();
      await userEvent.keyboard('{Escape}');
      expect(onShowMenuChange).toHaveBeenCalledWith(false);
      expect(input).toHaveAttribute('aria-expanded', 'true');
    });

    it('keeps the listbox out of the tab order', () => {
      render(<SearchInput showMenu suggestions={items} />);
      expect(screen.getByRole('listbox')).toHaveAttribute('tabindex', '-1');
    });
  });
});
