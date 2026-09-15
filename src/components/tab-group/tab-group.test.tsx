import { describe, it, expect, vi } from 'vitest';
import { createRef, useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { TabGroup } from './TabGroup';
import { TabItem } from '../_tab-item/TabItem';

const Controlled = ({ onChange }: { onChange?: (i: number) => void }) => {
  const [active, setActive] = useState(0);
  return (
    <TabGroup
      activeIndex={active}
      onChange={(i) => {
        setActive(i);
        onChange?.(i);
      }}
      aria-label="Sections"
    >
      <TabItem>A</TabItem>
      <TabItem>B</TabItem>
      <TabItem disabled>C</TabItem>
      <TabItem>D</TabItem>
    </TabGroup>
  );
};

const tabs = () => screen.getAllByRole('tab');

describe('TabGroup', () => {
  it('renders a horizontal tablist with a 16px gap and no container stroke', () => {
    render(<Controlled />);
    const list = screen.getByRole('tablist', { name: 'Sections' });
    expect(list).toHaveAttribute('aria-orientation', 'horizontal');
    expect(list).toHaveClass('gap-[var(--scanner-spacing-5)]');
    expect(list.className).not.toMatch(/border/);
  });

  it('marks the active tab selected with a roving tabindex', () => {
    render(<Controlled />);
    const [a, b] = tabs();
    expect(a).toHaveAttribute('aria-selected', 'true');
    expect(a).toHaveAttribute('tabindex', '0');
    expect(b).toHaveAttribute('tabindex', '-1');
  });

  it('selects on click and ignores disabled tabs', () => {
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);
    fireEvent.click(tabs()[1]);
    expect(onChange).toHaveBeenLastCalledWith(1);
    expect(tabs()[1]).toHaveAttribute('aria-selected', 'true');
    fireEvent.click(tabs()[2]);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('ArrowRight/ArrowLeft move focus + selection, wrap and skip disabled tabs', () => {
    render(<Controlled />);
    tabs()[0].focus();
    fireEvent.keyDown(tabs()[0], { key: 'ArrowRight' });
    expect(tabs()[1]).toHaveFocus();
    expect(tabs()[1]).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(tabs()[1], { key: 'ArrowRight' });
    expect(tabs()[3]).toHaveFocus();
    fireEvent.keyDown(tabs()[3], { key: 'ArrowRight' });
    expect(tabs()[0]).toHaveFocus();
    fireEvent.keyDown(tabs()[0], { key: 'ArrowLeft' });
    expect(tabs()[3]).toHaveFocus();
  });

  it('Home/End jump to the first/last enabled tab', () => {
    render(<Controlled />);
    tabs()[0].focus();
    fireEvent.keyDown(tabs()[0], { key: 'End' });
    expect(tabs()[3]).toHaveFocus();
    expect(tabs()[3]).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(tabs()[3], { key: 'Home' });
    expect(tabs()[0]).toHaveFocus();
  });

  it('manual activation: arrows move focus only', () => {
    render(
      <TabGroup activationMode="manual">
        <TabItem>A</TabItem>
        <TabItem>B</TabItem>
      </TabGroup>,
    );
    tabs()[0].focus();
    fireEvent.keyDown(tabs()[0], { key: 'ArrowRight' });
    expect(tabs()[1]).toHaveFocus();
    expect(tabs()[1]).toHaveAttribute('aria-selected', 'false');
    fireEvent.click(tabs()[1]);
    expect(tabs()[1]).toHaveAttribute('aria-selected', 'true');
  });

  it('works uncontrolled with defaultActiveIndex and keeps child onClick/ref', () => {
    const onClick = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    render(
      <TabGroup defaultActiveIndex={1}>
        <TabItem ref={ref} onClick={onClick}>A</TabItem>
        <TabItem>B</TabItem>
      </TabGroup>,
    );
    expect(tabs()[1]).toHaveAttribute('aria-selected', 'true');
    fireEvent.click(tabs()[0]);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(tabs()[0]).toHaveAttribute('aria-selected', 'true');
    expect(ref.current).toBe(tabs()[0]);
  });

  it('forwards the ref and merges className', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <TabGroup ref={ref} className="custom">
        <TabItem>A</TabItem>
      </TabGroup>,
    );
    expect(ref.current).toHaveAttribute('role', 'tablist');
    expect(ref.current).toHaveClass('custom');
  });
});
