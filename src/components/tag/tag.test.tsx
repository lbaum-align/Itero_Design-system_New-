import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Tag } from './Tag';
import { TagGroup } from '../tag-group';

describe('Tag', () => {
  it('renders the label', () => {
    render(<Tag>Upper jaw</Tag>);
    expect(screen.getByText('Upper jaw')).toBeInTheDocument();
  });

  it('forwards the ref and merges className', () => {
    const ref = createRef<HTMLSpanElement>();
    const { container } = render(<Tag ref={ref} className="custom">Label</Tag>);
    expect(ref.current).toBe(container.firstChild);
    expect(ref.current).toHaveClass('custom');
  });

  it('renders the close icon only when onDismiss is set', () => {
    const { rerender } = render(<Tag>Label</Tag>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    rerender(<Tag onDismiss={() => {}}>Label</Tag>);
    expect(screen.getByRole('button', { name: 'Remove Label' })).toHaveAttribute('type', 'button');
  });

  it('uses dismissLabel as the close icon accessible name', () => {
    render(<Tag onDismiss={() => {}} dismissLabel="Clear filter">Label</Tag>);
    expect(screen.getByRole('button', { name: 'Clear filter' })).toBeInTheDocument();
  });

  it('calls onDismiss on click', () => {
    const onDismiss = vi.fn();
    render(<Tag onDismiss={onDismiss}>Label</Tag>);
    fireEvent.click(screen.getByRole('button'));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('close icon is keyboard focusable', () => {
    render(<Tag onDismiss={() => {}}>Label</Tag>);
    const button = screen.getByRole('button');
    button.focus();
    expect(button).toHaveFocus();
  });

  it('disabled: sets aria-disabled, disables the close icon and ignores clicks', () => {
    const onDismiss = vi.fn();
    const { container } = render(<Tag disabled onDismiss={onDismiss}>Label</Tag>);
    expect(container.firstChild).toHaveAttribute('aria-disabled', 'true');
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('skeleton: renders a hidden placeholder without content', () => {
    const { container } = render(<Tag skeleton onDismiss={() => {}}>Label</Tag>);
    const placeholder = container.querySelector('[data-skeleton]');
    expect(placeholder).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByText('Label')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('uses a 24px close icon for Large/Medium/Small and 20px for Extra small', () => {
    const expected = { large: '24', medium: '24', small: '24', 'extra-small': '20' } as const;
    for (const [size, px] of Object.entries(expected)) {
      const { container, unmount } = render(
        <Tag size={size as keyof typeof expected} onDismiss={() => {}}>Label</Tag>,
      );
      expect(container.querySelector('svg')).toHaveAttribute('width', px);
      unmount();
    }
  });

  it('inherits size from TagGroup unless set explicitly', () => {
    render(
      <TagGroup size="extra-small">
        <Tag onDismiss={() => {}}>Inherited</Tag>
        <Tag size="large" onDismiss={() => {}}>Explicit</Tag>
      </TagGroup>,
    );
    const [inherited, explicit] = screen.getAllByRole('button');
    expect(inherited.querySelector('svg')).toHaveAttribute('width', '20');
    expect(explicit.querySelector('svg')).toHaveAttribute('width', '24');
  });

  it('passes data-state through for forced visual states', () => {
    const { container } = render(<Tag data-state="focused">Label</Tag>);
    expect(container.firstChild).toHaveAttribute('data-state', 'focused');
  });
});
