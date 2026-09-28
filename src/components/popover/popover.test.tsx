import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Popover } from './Popover';
import { PopoverBubble } from './PopoverBubble';
import type { PopoverAlignment, PopoverPlacement, PopoverProps } from './popover.types';

const renderPopover = (
  props: Partial<PopoverProps> = {},
  content: React.ReactNode = <button type="button">Apply</button>,
) =>
  render(
    <div>
      <Popover content={content} label="Filters" {...props}>
        <button type="button">Open</button>
      </Popover>
      <button type="button">Outside</button>
    </div>,
  );

const trigger = () => screen.getByRole('button', { name: 'Open' });
const dialog = () => screen.getByRole('dialog', { hidden: true });

describe('Popover', () => {
  it('is hidden by default and wires ARIA on the trigger', () => {
    renderPopover();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger()).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger()).toHaveAttribute('aria-expanded', 'false');
    expect(trigger()).toHaveAttribute('aria-controls', dialog().id);
    expect(dialog()).toHaveAttribute('aria-modal', 'false');
  });

  it('opens on trigger click and moves focus to the first focusable element', () => {
    renderPopover();
    fireEvent.click(trigger());
    expect(screen.getByRole('dialog', { name: 'Filters' })).toBeVisible();
    expect(trigger()).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'Apply' })).toHaveFocus();
  });

  it('focuses the dialog itself when the content has nothing focusable', () => {
    renderPopover({}, 'Plain text');
    fireEvent.click(trigger());
    expect(screen.getByRole('dialog')).toHaveFocus();
  });

  it('closes on a second trigger click', () => {
    renderPopover();
    fireEvent.click(trigger());
    fireEvent.click(trigger());
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger()).toHaveFocus();
  });

  it('closes on Escape and returns focus to the trigger', () => {
    renderPopover();
    fireEvent.click(trigger());
    fireEvent.keyDown(screen.getByRole('button', { name: 'Apply' }), { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger()).toHaveFocus();
  });

  it('closes on outside pointer down without stealing focus back', () => {
    renderPopover();
    fireEvent.click(trigger());
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Outside' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger()).not.toHaveFocus();
  });

  it('closes when focus moves outside (Tab away)', () => {
    renderPopover();
    fireEvent.click(trigger());
    const outside = screen.getByRole('button', { name: 'Outside' });
    fireEvent.blur(screen.getByRole('button', { name: 'Apply' }), { relatedTarget: outside });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('respects closeOnEscape and closeOnOutsideClick = false', () => {
    renderPopover({ closeOnEscape: false, closeOnOutsideClick: false });
    fireEvent.click(trigger());
    fireEvent.keyDown(document, { key: 'Escape' });
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Outside' }));
    expect(screen.getByRole('dialog')).toBeVisible();
  });

  it('lets the trigger onClick preventDefault to keep it closed', () => {
    render(
      <Popover content="Body">
        <button type="button" onClick={(e) => e.preventDefault()}>
          Open
        </button>
      </Popover>,
    );
    fireEvent.click(trigger());
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('supports controlled open with onOpenChange', () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Popover content="Body" open={false} onOpenChange={onOpenChange}>
        <button type="button">Open</button>
      </Popover>,
    );
    fireEvent.click(trigger());
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    rerender(
      <Popover content="Body" open onOpenChange={onOpenChange}>
        <button type="button">Open</button>
      </Popover>,
    );
    expect(screen.getByRole('dialog')).toBeVisible();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(screen.getByRole('dialog')).toBeVisible();
  });

  it('defaultOpen shows it on mount without moving focus', () => {
    renderPopover({ defaultOpen: true });
    expect(screen.getByRole('dialog')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Apply' })).not.toHaveFocus();
  });

  it('returns focus to the trigger when closed programmatically from inside', () => {
    const Controlled = ({ open }: { open: boolean }) => (
      <Popover content={<button type="button">Done</button>} open={open}>
        <button type="button">Open</button>
      </Popover>
    );
    const { rerender } = render(<Controlled open={false} />);
    rerender(<Controlled open />);
    const done = screen.getByRole('button', { name: 'Done' });
    expect(done).toHaveFocus();
    fireEvent.focus(done);
    rerender(<Controlled open={false} />);
    expect(trigger()).toHaveFocus();
  });

  describe('hover mode', () => {
    it('opens on hover and closes on leave', () => {
      const { container } = renderPopover({ triggerMode: 'hover' });
      const wrapper = container.firstElementChild!.firstElementChild as HTMLElement;
      fireEvent.mouseEnter(wrapper);
      expect(screen.getByRole('dialog')).toBeVisible();
      expect(trigger()).not.toHaveFocus();
      fireEvent.mouseLeave(wrapper);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('opens on keyboard focus of the trigger and keeps focus there; clicks do not toggle', () => {
      renderPopover({ triggerMode: 'hover' });
      act(() => trigger().focus());
      expect(screen.getByRole('dialog')).toBeVisible();
      expect(trigger()).toHaveFocus();
      fireEvent.click(trigger());
      expect(screen.getByRole('dialog')).toBeVisible();
    });
  });

  describe('placement and alignment', () => {
    it.each<[PopoverPlacement, string]>([
      ['bottom', 'top-full'],
      ['top', 'bottom-full'],
      ['right', 'left-full'],
      ['left', 'right-full'],
    ])('%s placement sits on that side with a 4px gap', (placement, cls) => {
      renderPopover({ placement, defaultOpen: true });
      expect(dialog()).toHaveAttribute('data-placement', placement);
      expect(dialog()).toHaveClass(cls);
      expect(dialog().className).toContain('[var(--scanner-spacing-2)]');
    });

    it.each<[PopoverAlignment, string]>([
      ['start', 'left-[calc(50%_-_var(--scanner-popover-anchor-offset))]'],
      ['middle', 'left-1/2'],
      ['end', 'right-[calc(50%_-_var(--scanner-popover-anchor-offset))]'],
    ])('%s alignment anchors the caret on the trigger centre', (alignment, cls) => {
      renderPopover({ alignment, defaultOpen: true });
      expect(dialog()).toHaveClass(cls);
    });

    it('defaults to Bottom / Start with a caret (Figma defaults)', () => {
      renderPopover({ defaultOpen: true });
      expect(dialog()).toHaveAttribute('data-placement', 'bottom');
      expect(dialog()).toHaveAttribute('data-alignment', 'start');
      expect(dialog().querySelector('[data-caret]')).toBeInTheDocument();
    });

    it('hides the caret with showCaret={false}', () => {
      renderPopover({ defaultOpen: true, showCaret: false });
      expect(dialog().querySelector('[data-caret]')).not.toBeInTheDocument();
    });
  });

  it('forwards ref to the wrapper and merges class names', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Popover
        ref={ref}
        className="wrap"
        popoverClassName="pop"
        containerClassName="box"
        content="Body"
        defaultOpen
      >
        <button type="button">Open</button>
      </Popover>,
    );
    expect(ref.current).toHaveClass('wrap', 'relative', 'inline-flex');
    expect(screen.getByRole('dialog')).toHaveClass('pop');
    expect(screen.getByRole('dialog').querySelector('[data-popover-container]')).toHaveClass('box');
  });
});

describe('PopoverBubble', () => {
  it('renders the Figma container: elevated background, 16px padding, 8px radius, 44–320px width', () => {
    const { container } = render(<PopoverBubble>Body</PopoverBubble>);
    const box = container.querySelector('[data-popover-container]') as HTMLElement;
    for (const cls of [
      'bg-[var(--scanner-bg-elevated)]',
      'p-[var(--scanner-spacing-5)]',
      'gap-[var(--scanner-spacing-5)]',
      'rounded-[var(--scanner-radius-md)]',
      'min-w-[var(--scanner-popover-min-width)]',
      'max-w-[var(--scanner-popover-max-width)]',
    ]) {
      expect(box).toHaveClass(cls);
    }
  });

  it.each<[PopoverPlacement, string]>([
    ['bottom', 'flex-col'],
    ['top', 'flex-col-reverse'],
    ['right', 'flex-row'],
    ['left', 'flex-row-reverse'],
  ])('%s puts the caret on the side facing the trigger', (placement, cls) => {
    const { container } = render(<PopoverBubble placement={placement}>Body</PopoverBubble>);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass(cls);
    expect(root.firstElementChild).toHaveAttribute('data-caret');
    expect((root.firstElementChild as HTMLElement).className).toContain(
      '--scanner-popover-caret-inset',
    );
  });
});
