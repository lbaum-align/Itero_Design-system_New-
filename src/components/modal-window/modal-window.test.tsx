import { afterEach, beforeAll, describe, it, expect, vi } from 'vitest';
import { createRef, useRef, useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModalWindow } from './ModalWindow';
import type { ModalWindowProps } from './modal-window.types';

/* jsdom has no showModal()/close() — minimal polyfill that mirrors the `open` attribute. */
const showModal = vi.fn(function (this: HTMLDialogElement) {
  this.setAttribute('open', '');
});
const close = vi.fn(function (this: HTMLDialogElement) {
  this.removeAttribute('open');
  this.dispatchEvent(new Event('close'));
});

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = showModal;
  HTMLDialogElement.prototype.close = close;
});

afterEach(() => {
  showModal.mockClear();
  close.mockClear();
  document.body.style.overflow = '';
});

/** Opener button + controlled modal. */
function Harness(props: Partial<ModalWindowProps> & { onCloseSpy?: ModalWindowProps['onClose'] }) {
  const { onCloseSpy, ...rest } = props;
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open
      </button>
      <ModalWindow
        title="Delete scan?"
        description="This can't be undone."
        tertiaryActionText="Cancel"
        primaryActionText="Delete"
        {...rest}
        open={open}
        onClose={(reason) => {
          onCloseSpy?.(reason);
          setOpen(false);
        }}
      />
    </>
  );
}

const openHarness = async (props: Parameters<typeof Harness>[0] = {}) => {
  render(<Harness {...props} />);
  const opener = screen.getByRole('button', { name: 'Open' });
  await userEvent.click(opener);
  return { opener, dialog: screen.getByRole('dialog') };
};

describe('ModalWindow', () => {
  it('renders nothing while closed', () => {
    render(<ModalWindow title="T" />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens with showModal, labelled by the title and described by the description', async () => {
    const { dialog } = await openHarness();
    expect(showModal).toHaveBeenCalledTimes(1);
    expect(dialog.tagName).toBe('DIALOG');
    expect(dialog).toHaveAttribute('open');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleName('Delete scan?');
    expect(dialog).toHaveAccessibleDescription("This can't be undone.");
    expect(dialog).toHaveClass('bg-[var(--scanner-bg-overlay)]', 'p-[var(--scanner-modal-window-spacing)]');
    expect(screen.getByRole('heading', { level: 2, name: 'Delete scan?' })).toBeInTheDocument();
  });

  it('moves focus to the first focusable element, or initialFocusRef', async () => {
    await openHarness();
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
  });

  it('honours initialFocusRef', async () => {
    function WithRef() {
      const ref = useRef<HTMLButtonElement>(null);
      return (
        <ModalWindow open title="T" showActions={false} initialFocusRef={ref}>
          <button ref={ref} type="button">
            Focus me
          </button>
        </ModalWindow>
      );
    }
    render(<WithRef />);
    expect(screen.getByRole('button', { name: 'Focus me' })).toHaveFocus();
  });

  it('closes with Escape when closable and returns focus to the opener', async () => {
    const spy = vi.fn();
    const { opener } = await openHarness({ onCloseSpy: spy });
    await userEvent.keyboard('{Escape}');
    expect(spy).toHaveBeenCalledWith('escape');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });

  it('closes with the close icon', async () => {
    const spy = vi.fn();
    await openHarness({ onCloseSpy: spy });
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(spy).toHaveBeenCalledWith('close-button');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('ignores Escape and hides the close icon when not closable', async () => {
    const spy = vi.fn();
    await openHarness({ onCloseSpy: spy, closable: false });
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(spy).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('prevents the native cancel event so `open` stays controlled', async () => {
    const { dialog } = await openHarness();
    const cancel = new Event('cancel', { cancelable: true });
    dialog.dispatchEvent(cancel);
    expect(cancel.defaultPrevented).toBe(true);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes on overlay click only with closeOnOverlayClick', async () => {
    const spy = vi.fn();
    const { dialog } = await openHarness({ onCloseSpy: spy });
    fireEvent.mouseDown(dialog);
    fireEvent.click(dialog);
    expect(spy).not.toHaveBeenCalled();
    /* Clicks inside the window never close it */
    fireEvent.mouseDown(screen.getByText("This can't be undone."));
    fireEvent.click(screen.getByText("This can't be undone."));
    expect(spy).not.toHaveBeenCalled();
  });

  it('closes on overlay click when closeOnOverlayClick is set', async () => {
    const spy = vi.fn();
    const { dialog } = await openHarness({ onCloseSpy: spy, closeOnOverlayClick: true });
    fireEvent.mouseDown(dialog);
    fireEvent.click(dialog);
    expect(spy).toHaveBeenCalledWith('overlay');
  });

  it('traps Tab and Shift+Tab inside the window', async () => {
    await openHarness();
    const close = screen.getByRole('button', { name: 'Close' });
    const cancel = screen.getByRole('button', { name: 'Cancel' });
    const del = screen.getByRole('button', { name: 'Delete' });
    expect(close).toHaveFocus();
    await userEvent.tab();
    expect(cancel).toHaveFocus();
    await userEvent.tab();
    expect(del).toHaveFocus();
    await userEvent.tab();
    expect(close).toHaveFocus();
    await userEvent.tab({ shift: true });
    expect(del).toHaveFocus();
  });

  it('locks body scroll while open and restores it on close', async () => {
    document.body.style.overflow = 'auto';
    await openHarness();
    expect(document.body.style.overflow).toBe('hidden');
    await userEvent.keyboard('{Escape}');
    expect(document.body.style.overflow).toBe('auto');
  });

  it('renders actions per Figma: tertiary + primary by default, secondary on demand, all Large', async () => {
    const onPrimary = vi.fn();
    const onSecondary = vi.fn();
    const onTertiary = vi.fn();
    render(
      <ModalWindow
        inline
        title="T"
        secondaryAction
        tertiaryActionText="Cancel"
        secondaryActionText="Save draft"
        primaryActionText="Publish"
        onPrimaryAction={onPrimary}
        onSecondaryAction={onSecondary}
        onTertiaryAction={onTertiary}
        primaryActionProps={{ variant: 'danger' }}
      />,
    );
    const buttons = screen.getAllByRole('button').filter((b) => b.getAttribute('aria-label') !== 'Close');
    expect(buttons.map((b) => b.textContent)).toEqual(['Cancel', 'Save draft', 'Publish']);
    buttons.forEach((b) => expect(b).toHaveClass('min-h-[var(--scanner-button-height-lg)]'));
    expect(buttons[0]).toHaveClass('shadow-[inset_0_0_0_1px_var(--scanner-border-subtle)]');
    expect(buttons[2]).toHaveClass('bg-[var(--scanner-bg-destructive)]');
    expect(screen.getByRole('group')).toHaveClass('gap-[var(--scanner-spacing-3)]', 'justify-end');
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);
    fireEvent.click(buttons[2]);
    expect(onTertiary).toHaveBeenCalledTimes(1);
    expect(onSecondary).toHaveBeenCalledTimes(1);
    expect(onPrimary).toHaveBeenCalledTimes(1);
  });

  it('honours showActions, tertiaryAction, custom actions', () => {
    const { rerender } = render(<ModalWindow inline title="T" closable={false} showActions={false} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    rerender(<ModalWindow inline title="T" closable={false} tertiaryAction={false} />);
    expect(screen.getAllByRole('button')).toHaveLength(1);
    rerender(<ModalWindow inline title="T" closable={false} actions={<button type="button">Custom</button>} />);
    expect(screen.getAllByRole('button').map((b) => b.textContent)).toEqual(['Custom']);
  });

  it('honours showDescription and showSlotContent', () => {
    const { rerender } = render(
      <ModalWindow inline title="T" description="D">
        <span>Slot</span>
      </ModalWindow>,
    );
    expect(screen.getByText('D')).toBeInTheDocument();
    expect(screen.getByText('Slot')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toHaveAccessibleDescription('D');
    rerender(
      <ModalWindow inline title="T" description="D" showDescription={false} showSlotContent={false}>
        <span>Slot</span>
      </ModalWindow>,
    );
    expect(screen.queryByText('D')).not.toBeInTheDocument();
    expect(screen.queryByText('Slot')).not.toBeInTheDocument();
    expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-describedby');
  });

  it.each([
    ['small', 'w-[var(--scanner-modal-window-width-sm)]', 'p-[var(--scanner-spacing-7)]'],
    ['medium', 'w-[var(--scanner-modal-window-width-md)]', 'px-[var(--scanner-modal-window-spacing)]'],
    ['large', 'w-[var(--scanner-modal-window-width-lg)]', 'pb-[var(--scanner-modal-window-spacing)]'],
    ['x-large', 'w-[var(--scanner-modal-window-width-xl)]', 'pt-[var(--scanner-spacing-7)]'],
  ] as const)('size=%s → %s', (size, width, padding) => {
    render(<ModalWindow inline size={size} title="T" />);
    const panel = screen.getByRole('dialog');
    expect(panel).toHaveAttribute('data-size', size);
    expect(panel).toHaveClass(width, padding, 'rounded-[var(--scanner-radius-xl)]', 'bg-[var(--scanner-bg-layer-01)]');
  });

  it('inline renders only the window (no dialog element, no scroll lock)', () => {
    render(<ModalWindow inline title="T" />);
    const panel = screen.getByRole('dialog');
    expect(panel.tagName).toBe('DIV');
    expect(panel).not.toHaveAttribute('aria-modal');
    expect(showModal).not.toHaveBeenCalled();
    expect(document.body.style.overflow).toBe('');
  });

  it('forwards the ref to the window, merges className and spreads attributes', () => {
    const ref = createRef<HTMLDivElement>();
    render(<ModalWindow ref={ref} open title="T" className="custom" data-testid="panel" />);
    expect(ref.current).toBe(screen.getByTestId('panel'));
    expect(ref.current).toHaveClass('custom', 'flex');
    expect(ref.current?.parentElement?.tagName).toBe('DIALOG');
  });
});
