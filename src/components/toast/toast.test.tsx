import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { createRef, useEffect } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toast } from './Toast';
import { ToastProvider } from './ToastProvider';
import { useToast } from './useToast';
import type { ToastContextValue, ToastProviderProps } from './toast.types';

describe('Toast', () => {
  it('renders an information toast by default: status role, elevated surface, icon, text and close button', () => {
    render(<Toast title="Title" message="Message text goes here" />);
    const toast = screen.getByRole('status');
    expect(toast).toHaveAttribute('data-type', 'toast');
    expect(toast).toHaveAttribute('data-status', 'information');
    expect(toast).toHaveAttribute('aria-live', 'polite');
    expect(toast).toHaveClass(
      'bg-[var(--scanner-bg-elevated)]',
      'shadow-[var(--scanner-shadow-depth-01)]',
      'p-[var(--scanner-spacing-6)]',
      'gap-[var(--scanner-spacing-6)]',
      'rounded-[var(--scanner-radius-xl)]',
      'max-w-[var(--scanner-toast-max-width)]',
    );
    const icon = screen.getByRole('img', { name: 'Information' });
    expect(icon).toHaveAttribute('data-icon', 'information');
    expect(icon).toHaveAttribute('width', '28');
    expect(icon).toHaveClass('text-[color:var(--scanner-icon-link)]');
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close notification' })).toBeInTheDocument();
  });

  it.each([
    ['information', 'status', 'information', 'icon-link', 'blue'],
    ['success', 'status', 'checkmark', 'icon-success', 'green'],
    ['warning', 'alert', 'warning', 'icon-warning', 'orange'],
    ['error', 'alert', 'error', 'icon-error', 'red'],
  ] as const)('status=%s → role %s, icon %s, inline highlight %s', (status, role, icon, iconToken, colour) => {
    render(<Toast type="inline" status={status} title="T" message="M" />);
    const el = screen.getByRole(role);
    expect(el).toHaveClass(
      `bg-[var(--scanner-bg-highlight-${colour})]`,
      `shadow-[inset_0_0_0_1px_var(--scanner-border-highlight-${colour})]`,
      'w-full',
    );
    expect(el).not.toHaveClass('bg-[var(--scanner-bg-elevated)]');
    const svg = el.querySelector('svg[data-icon]');
    expect(svg).toHaveAttribute('data-icon', icon);
    expect(svg).toHaveClass(`text-[color:var(--scanner-${iconToken})]`);
  });

  it('renders the action only when showAction and action are set', () => {
    const { rerender } = render(<Toast message="M" action={{ type: 'link', linkText: 'Undo', linkHref: '#' }} />);
    expect(screen.getByRole('link', { name: 'Undo' })).toBeInTheDocument();
    rerender(<Toast message="M" showAction={false} action={{ type: 'link', linkText: 'Undo', linkHref: '#' }} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    rerender(<Toast message="M" />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('hides the close button when not closable and calls onClose when clicked', async () => {
    const onClose = vi.fn();
    const { rerender } = render(<Toast message="M" onClose={onClose} />);
    await userEvent.click(screen.getByRole('button', { name: 'Close notification' }));
    expect(onClose).toHaveBeenCalledTimes(1);
    rerender(<Toast message="M" closable={false} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('supports showTitle=false, custom close/status labels', () => {
    render(<Toast status="error" title="Hidden" showTitle={false} message="M" closeLabel="Dismiss" statusLabel="Failure" />);
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Failure' })).toBeInTheDocument();
  });

  it('keyboard: Tab reaches the action then the close icon; Enter activates', async () => {
    const onLinkClick = vi.fn();
    const onClose = vi.fn();
    render(<Toast message="M" onClose={onClose} action={{ type: 'link', linkText: 'View', onLinkClick }} />);
    await userEvent.tab();
    expect(screen.getByRole('link', { name: 'View' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(onLinkClick).toHaveBeenCalledTimes(1);
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Close notification' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('forwards the ref, merges className and lets role be overridden', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Toast ref={ref} className="custom" message="M" role="log" />);
    expect(ref.current).toHaveClass('custom', 'flex');
    expect(ref.current).toHaveAttribute('role', 'log');
  });
});

/* ------------------------------------------------------------------ */

describe('ToastProvider / useToast', () => {
  const handle: { current: ToastContextValue | null } = { current: null };
  const api = () => handle.current as ToastContextValue;
  function Grab() {
    const ctx = useToast();
    useEffect(() => {
      handle.current = ctx;
    }, [ctx]);
    return null;
  }
  const setup = (props: ToastProviderProps = {}) =>
    render(
      <ToastProvider {...props}>
        <Grab />
      </ToastProvider>,
    );

  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('throws outside a provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Grab />)).toThrow('useToast must be used inside a <ToastProvider>.');
    spy.mockRestore();
  });

  it('renders a labelled region at the top right and shows toasts newest first', () => {
    setup();
    const region = screen.getByRole('region', { name: 'Notifications' });
    expect(region).toHaveAttribute('data-placement', 'top-right');
    expect(region).toHaveClass('gap-[var(--scanner-spacing-5)]');
    act(() => {
      api().show({ status: 'success', message: 'First' });
      api().show({ status: 'error', message: 'Second' });
    });
    expect(region.children).toHaveLength(2);
    expect(region.firstElementChild).toHaveTextContent('Second');
    expect(region.firstElementChild).toHaveAttribute('data-type', 'toast');
  });

  it('auto-dismisses after the default 7s and calls onClose', () => {
    setup();
    const onClose = vi.fn();
    act(() => {
      api().show({ message: 'Bye', onClose });
    });
    act(() => {
      vi.advanceTimersByTime(6999);
    });
    expect(screen.getByText('Bye')).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.queryByText('Bye')).not.toBeInTheDocument();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('pauses the timer on hover and focus, and resumes with the remaining time', () => {
    setup({ duration: 1000 });
    act(() => {
      api().show({ message: 'Paused' });
    });
    const toast = screen.getByRole('status');
    act(() => {
      vi.advanceTimersByTime(600);
    });
    fireEvent.mouseEnter(toast);
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(toast).toHaveAttribute('data-paused', 'true');
    expect(screen.getByText('Paused')).toBeInTheDocument();
    fireEvent.mouseLeave(toast);
    fireEvent.focus(screen.getByRole('button', { name: 'Close notification' }));
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByText('Paused')).toBeInTheDocument();
    fireEvent.blur(screen.getByRole('button', { name: 'Close notification' }));
    act(() => {
      vi.advanceTimersByTime(399);
    });
    expect(screen.getByText('Paused')).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.queryByText('Paused')).not.toBeInTheDocument();
  });

  it('keeps toasts with an action or duration=null until dismissed', () => {
    setup();
    act(() => {
      api().show({ message: 'With action', action: { type: 'link', linkText: 'Undo' } });
      api().show({ message: 'Sticky', duration: null });
    });
    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(screen.getByText('With action')).toBeInTheDocument();
    expect(screen.getByText('Sticky')).toBeInTheDocument();
  });

  it('dismisses via the close button, dismiss(id) and dismissAll()', () => {
    setup();
    let id = '';
    act(() => {
      api().show({ message: 'A', duration: null });
      id = api().show({ message: 'B', duration: null });
      api().show({ message: 'C', duration: null });
    });
    fireEvent.click(screen.getAllByRole('button', { name: 'Close notification' })[0]);
    expect(screen.queryByText('C')).not.toBeInTheDocument();
    act(() => api().dismiss(id));
    expect(screen.queryByText('B')).not.toBeInTheDocument();
    act(() => api().dismissAll());
    expect(screen.queryByText('A')).not.toBeInTheDocument();
  });

  it('replaces a toast with the same id and drops the oldest past the limit', () => {
    setup({ limit: 2 });
    const dropped = vi.fn();
    act(() => {
      api().show({ message: 'Old', duration: null, onClose: dropped });
      api().show({ id: 'x', message: 'Draft', duration: null });
      api().show({ id: 'x', message: 'Final', duration: null });
    });
    expect(screen.queryByText('Draft')).not.toBeInTheDocument();
    expect(screen.getByText('Final')).toBeInTheDocument();
    expect(screen.getByText('Old')).toBeInTheDocument();
    act(() => {
      api().show({ message: 'New', duration: null });
    });
    expect(screen.queryByText('Old')).not.toBeInTheDocument();
    expect(dropped).toHaveBeenCalledTimes(1);
  });

  it('applies placement and label', () => {
    setup({ placement: 'bottom-left', label: 'Alerts' });
    expect(screen.getByRole('region', { name: 'Alerts' })).toHaveAttribute('data-placement', 'bottom-left');
  });
});
