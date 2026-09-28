import { describe, it, expect, vi, afterEach, beforeAll } from 'vitest';
import { createRef, useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Slider } from './Slider';
import type { SliderRange } from './slider.types';

/** Give the track a 332px width (300px usable per handle for a single slider) at x = 0. */
function mockTrack(container: HTMLElement) {
  const track = container.querySelector('[data-part="track"]') as HTMLElement;
  vi.spyOn(track, 'getBoundingClientRect').mockReturnValue({
    left: 0, top: 0, right: 332, bottom: 60, width: 332, height: 60, x: 0, y: 0, toJSON: () => ({}),
  } as DOMRect);
  container.querySelectorAll<HTMLElement>('[data-part^="handle"]').forEach((h) =>
    vi.spyOn(h, 'getBoundingClientRect').mockReturnValue({
      left: 0, top: 0, right: 32, bottom: 32, width: 32, height: 32, x: 0, y: 0, toJSON: () => ({}),
    } as DOMRect),
  );
  return track;
}

/* jsdom has no PointerEvent: without it fireEvent.pointer* drops clientX / button */
beforeAll(() => {
  if (typeof window.PointerEvent === 'undefined') {
    class PointerEventPolyfill extends MouseEvent {
      pointerId: number;
      constructor(type: string, init: PointerEventInit = {}) {
        super(type, init);
        this.pointerId = init.pointerId ?? 0;
      }
    }
    window.PointerEvent = PointerEventPolyfill as unknown as typeof PointerEvent;
  }
});

afterEach(() => vi.restoreAllMocks());

describe('Slider', () => {
  it('renders a labelled slider with aria values', () => {
    render(<Slider label="Volume" defaultValue={40} />);
    const handle = screen.getByRole('slider', { name: 'Volume' });
    expect(handle).toHaveAttribute('aria-valuemin', '0');
    expect(handle).toHaveAttribute('aria-valuemax', '100');
    expect(handle).toHaveAttribute('aria-valuenow', '40');
    expect(handle).toHaveAttribute('aria-valuetext', '40');
    expect(handle).toHaveAttribute('aria-orientation', 'horizontal');
    expect(handle).toHaveAttribute('tabindex', '0');
  });

  it('forwards the ref, merges className and sets data-layer', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<Slider ref={ref} className="custom" layer={2} />);
    expect(ref.current).toBe(container.firstElementChild);
    expect(ref.current).toHaveClass('custom');
    expect(ref.current).toHaveAttribute('data-layer', '2');
  });

  it('shows start / end values (Show value) and custom texts', () => {
    const { rerender } = render(<Slider min={10} max={90} />);
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('90')).toBeInTheDocument();
    rerender(<Slider startValueText="Low" endValueText="High" />);
    expect(screen.getByText('Low')).toBeInTheDocument();
    rerender(<Slider showValue={false} />);
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('uses formatValue for aria-valuetext and the value texts', () => {
    render(<Slider defaultValue={30} formatValue={(v) => `${v}%`} startHandleLabel="Opacity" />);
    expect(screen.getByRole('slider', { name: 'Opacity' })).toHaveAttribute('aria-valuetext', '30%');
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('renders the explainer trigger', () => {
    render(<Slider label="Volume" explainer="Output level" />);
    expect(screen.getByRole('button', { name: /output level/i })).toBeInTheDocument();
  });

  it('positions the handle and fill from the value', () => {
    const { container } = render(<Slider defaultValue={25} />);
    const handle = container.querySelector('[data-part="handle-start"]') as HTMLElement;
    expect(handle.style.left).toContain('0.25');
    const fill = container.querySelector('[data-part="track-fill"]') as HTMLElement;
    expect(fill.className).toContain('--scanner-border-interactive');
    expect(container.querySelector('[data-part="track-end"]')?.className).toContain('--scanner-border-subtle');
  });

  describe('keyboard', () => {
    it('steps with arrows, PageUp/PageDown and jumps with Home/End', async () => {
      const onChange = vi.fn();
      render(<Slider defaultValue={50} step={2} onChange={onChange} startHandleLabel="V" />);
      const handle = screen.getByRole('slider');
      await userEvent.tab();
      expect(handle).toHaveFocus();
      await userEvent.keyboard('{ArrowRight}');
      expect(handle).toHaveAttribute('aria-valuenow', '52');
      await userEvent.keyboard('{ArrowDown}{ArrowDown}');
      expect(handle).toHaveAttribute('aria-valuenow', '48');
      await userEvent.keyboard('{ArrowUp}{ArrowLeft}');
      expect(handle).toHaveAttribute('aria-valuenow', '48');
      await userEvent.keyboard('{PageUp}');
      expect(handle).toHaveAttribute('aria-valuenow', '68');
      await userEvent.keyboard('{PageDown}');
      expect(handle).toHaveAttribute('aria-valuenow', '48');
      await userEvent.keyboard('{End}');
      expect(handle).toHaveAttribute('aria-valuenow', '100');
      await userEvent.keyboard('{ArrowRight}');
      expect(handle).toHaveAttribute('aria-valuenow', '100');
      await userEvent.keyboard('{Home}');
      expect(handle).toHaveAttribute('aria-valuenow', '0');
      expect(onChange).toHaveBeenLastCalledWith(0);
    });

    it('supports decimal steps without float drift', () => {
      render(<Slider min={0} max={1} step={0.1} defaultValue={0.2} startHandleLabel="V" />);
      const handle = screen.getByRole('slider');
      fireEvent.keyDown(handle, { key: 'ArrowRight' });
      expect(handle).toHaveAttribute('aria-valuenow', '0.3');
    });
  });

  describe('ranged', () => {
    it('renders two named handles bounded by each other', () => {
      render(<Slider ranged label="Price" defaultValue={[20, 60]} />);
      const start = screen.getByRole('slider', { name: 'Price start' });
      const end = screen.getByRole('slider', { name: 'Price end' });
      expect(start).toHaveAttribute('aria-valuemax', '60');
      expect(end).toHaveAttribute('aria-valuemin', '20');
    });

    it('handles cannot cross', () => {
      const onChange = vi.fn();
      render(<Slider ranged defaultValue={[40, 50]} step={5} onChange={onChange} />);
      const [start, end] = screen.getAllByRole('slider') as [HTMLElement, HTMLElement];
      fireEvent.keyDown(start, { key: 'ArrowRight' });
      fireEvent.keyDown(start, { key: 'ArrowRight' });
      expect(start).toHaveAttribute('aria-valuenow', '50');
      fireEvent.keyDown(start, { key: 'End' });
      expect(start).toHaveAttribute('aria-valuenow', '50');
      fireEvent.keyDown(end, { key: 'Home' });
      expect(end).toHaveAttribute('aria-valuenow', '50');
      fireEvent.keyDown(end, { key: 'End' });
      expect(onChange).toHaveBeenLastCalledWith([50, 100]);
    });

    it('lays out three track segments with the fill between the handles', () => {
      const { container } = render(<Slider ranged defaultValue={[25, 75]} />);
      expect(container.querySelector('[data-part="track-start"]')?.className).toContain('--scanner-border-subtle');
      expect(container.querySelector('[data-part="track-fill"]')?.className).toContain('--scanner-border-interactive');
      expect((container.querySelector('[data-part="handle-end"]') as HTMLElement).style.left).toContain('0.75');
    });
  });

  describe('pointer', () => {
    it('moves the handle to a track click and drags with a pressed tooltip', () => {
      const onChange = vi.fn();
      const { container } = render(<Slider onChange={onChange} startHandleLabel="V" />);
      const track = mockTrack(container);
      /* centre of handle at x = 16 + 300 × p */
      fireEvent.pointerDown(track, { clientX: 166, button: 0, pointerId: 1 });
      expect(onChange).toHaveBeenLastCalledWith(50);
      const handle = screen.getByRole('slider');
      expect(handle).toHaveFocus();
      expect(handle).toHaveAttribute('data-pressed');
      expect(container.querySelector('[data-part="value-tooltip"]')).toHaveTextContent('50');
      fireEvent.pointerMove(track, { clientX: 241, pointerId: 1 });
      expect(onChange).toHaveBeenLastCalledWith(75);
      fireEvent.pointerMove(track, { clientX: 999, pointerId: 1 });
      expect(onChange).toHaveBeenLastCalledWith(100);
      fireEvent.pointerUp(track, { clientX: 999, pointerId: 1 });
      expect(handle).not.toHaveAttribute('data-pressed');
      fireEvent.pointerMove(track, { clientX: 16, pointerId: 1 });
      expect(onChange).toHaveBeenCalledTimes(3);
    });

    it('moves the nearest handle of a ranged slider', () => {
      const onChange = vi.fn();
      const { container } = render(<Slider ranged defaultValue={[20, 80]} onChange={onChange} />);
      const track = mockTrack(container);
      /* usable = 332 − 64 = 268; end handle centre = 268 × p + 48 */
      fireEvent.pointerDown(track, { clientX: 48 + 268 * 0.7, button: 0, pointerId: 1 });
      expect(onChange).toHaveBeenLastCalledWith([20, 70]);
      fireEvent.pointerUp(track, { pointerId: 1 });
      fireEvent.pointerDown(track, { clientX: 16 + 268 * 0.1, button: 0, pointerId: 2 });
      expect(onChange).toHaveBeenLastCalledWith([10, 70]);
    });

    it('can hide the drag tooltip (showTooltip=false)', () => {
      const { container } = render(<Slider showTooltip={false} startHandleLabel="V" />);
      fireEvent.pointerDown(mockTrack(container), { clientX: 100, button: 0, pointerId: 1 });
      expect(container.querySelector('[data-part="value-tooltip"]')).toBeNull();
    });
  });

  describe('controlled', () => {
    it('reflects the value prop and reports changes', () => {
      const Controlled = () => {
        const [v, setV] = useState<SliderRange>([10, 20]);
        return (
          <>
            <Slider ranged value={v} onChange={setV} />
            <output>{v.join('-')}</output>
          </>
        );
      };
      render(<Controlled />);
      fireEvent.keyDown(screen.getAllByRole('slider')[1] as HTMLElement, { key: 'ArrowRight' });
      expect(screen.getByText('10-21')).toBeInTheDocument();
    });

    it('does not change without onChange updating the value', () => {
      render(<Slider value={30} startHandleLabel="V" />);
      fireEvent.keyDown(screen.getByRole('slider'), { key: 'ArrowRight' });
      expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '30');
    });
  });

  describe('editable', () => {
    it('syncs a number input with the handle', async () => {
      render(<Slider editable label="Volume" defaultValue={50} />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveValue('50');
      fireEvent.keyDown(screen.getByRole('slider'), { key: 'ArrowRight' });
      expect(input).toHaveValue('51');
      await userEvent.clear(input);
      await userEvent.type(input, '80');
      expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '80');
    });

    it('renders two inputs for a ranged slider, bounded by each other', () => {
      render(<Slider ranged editable defaultValue={[25, 75]} />);
      const [start, end] = screen.getAllByRole('spinbutton') as [HTMLElement, HTMLElement];
      expect(start).toHaveAttribute('aria-valuemax', '75');
      expect(end).toHaveAttribute('aria-valuemin', '25');
      fireEvent.keyDown(end, { key: 'ArrowUp' });
      expect(screen.getAllByRole('slider')[1]).toHaveAttribute('aria-valuenow', '76');
    });
  });

  describe('disabled', () => {
    it('removes handles from the tab order and ignores keys and pointer', () => {
      const onChange = vi.fn();
      const { container } = render(<Slider disabled editable onChange={onChange} startHandleLabel="V" />);
      const handle = screen.getByRole('slider');
      expect(handle).toHaveAttribute('tabindex', '-1');
      expect(handle).toHaveAttribute('aria-disabled', 'true');
      fireEvent.keyDown(handle, { key: 'ArrowRight' });
      fireEvent.pointerDown(mockTrack(container), { clientX: 200, button: 0, pointerId: 1 });
      expect(onChange).not.toHaveBeenCalled();
      expect(screen.getByRole('spinbutton')).toBeDisabled();
      expect(container.querySelector('[data-part="track-fill"]')?.className).toContain('--scanner-border-disabled');
    });
  });

  describe('skeleton', () => {
    it('renders a hidden placeholder without interactive handles', () => {
      const { container } = render(<Slider skeleton label="Volume" editable ranged />);
      expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
      expect(screen.queryByRole('slider')).not.toBeInTheDocument();
      expect(screen.queryByText('Volume')).not.toBeInTheDocument();
      expect(container.querySelectorAll('[data-skeleton]').length).toBeGreaterThan(1);
    });
  });

  it('forces handle states via data-state', () => {
    const { container } = render(<Slider data-state="pressed" defaultValue={50} startHandleLabel="V" />);
    expect(screen.getByRole('slider')).toHaveAttribute('data-state', 'pressed');
    expect(container.querySelector('[data-part="value-tooltip"]')).toHaveTextContent('50');
  });
});
