import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NotificationAction } from './NotificationAction';

describe('NotificationAction', () => {
  it('renders a primary medium link by default with 16px top padding', () => {
    const { container } = render(<NotificationAction linkHref="/details" />);
    const link = screen.getByRole('link', { name: 'Link' });
    expect(link).toHaveAttribute('href', '/details');
    expect(link).toHaveClass('text-[color:var(--scanner-text-link)]');
    expect(container.firstChild).toHaveClass('pt-[var(--scanner-spacing-5)]');
    expect(container.firstChild).toHaveAttribute('data-type', 'link');
  });

  it('calls onLinkClick and supports keyboard activation without href', async () => {
    const onLinkClick = vi.fn();
    render(<NotificationAction linkText="Undo" onLinkClick={onLinkClick} />);
    await userEvent.tab();
    expect(screen.getByRole('link', { name: 'Undo' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(onLinkClick).toHaveBeenCalledTimes(1);
  });

  it('renders the external icon when linkExternal is set', () => {
    render(<NotificationAction linkHref="https://example.com" linkExternal />);
    expect(screen.getByRole('link')).toHaveAttribute('target', '_blank');
  });

  describe('type="button"', () => {
    it('renders two secondary large buttons with an 8px wrapping gap', () => {
      const { container } = render(
        <NotificationAction type="button" primaryButtonText="Retry" secondaryButtonText="Dismiss" />,
      );
      expect(screen.getAllByRole('button')).toHaveLength(2);
      expect(screen.getByRole('button', { name: 'Retry' })).toHaveClass('min-h-[var(--scanner-button-height-lg)]');
      expect(container.firstChild).toHaveClass('flex-wrap', 'gap-[var(--scanner-spacing-3)]');
    });

    it('wires both click handlers', () => {
      const onPrimary = vi.fn();
      const onSecondary = vi.fn();
      render(
        <NotificationAction
          type="button"
          primaryButtonText="Retry"
          secondaryButtonText="Dismiss"
          onPrimaryButtonClick={onPrimary}
          onSecondaryButtonClick={onSecondary}
        />,
      );
      fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
      fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
      expect(onPrimary).toHaveBeenCalledTimes(1);
      expect(onSecondary).toHaveBeenCalledTimes(1);
    });

    it('renders a single button when secondaryButtonText is null', () => {
      render(<NotificationAction type="button" secondaryButtonText={null} />);
      expect(screen.getAllByRole('button')).toHaveLength(1);
    });
  });

  it('renders custom children instead of the built-in actions', () => {
    render(
      <NotificationAction type="button">
        <span>Custom</span>
      </NotificationAction>,
    );
    expect(screen.getByText('Custom')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('forwards the ref, merges className and spreads HTML attributes', () => {
    const ref = createRef<HTMLDivElement>();
    render(<NotificationAction ref={ref} className="custom" data-testid="action" />);
    expect(ref.current).toHaveClass('custom');
    expect(screen.getByTestId('action')).toBe(ref.current);
  });
});
