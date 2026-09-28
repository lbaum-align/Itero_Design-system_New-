import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { NotificationTextContent } from './NotificationTextContent';

describe('NotificationTextContent', () => {
  it('renders title (heading-02, primary) and message (body-02, secondary) with a 16px gap', () => {
    const { container } = render(<NotificationTextContent title="Title" message="Message text goes here" />);
    expect(screen.getByText('Title')).toHaveClass('scanner-text-heading-02', 'text-[color:var(--scanner-text-primary)]');
    expect(screen.getByText('Message text goes here')).toHaveClass(
      'scanner-text-body-02',
      'text-[color:var(--scanner-text-secondary)]',
    );
    expect(container.firstChild).toHaveClass('gap-[var(--scanner-spacing-5)]');
    expect(container.firstChild).toHaveAttribute('data-show-title', 'true');
  });

  it('hides the title when showTitle is false and uses the primary colour for the message', () => {
    const { container } = render(<NotificationTextContent showTitle={false} title="Title" message="Saved" />);
    expect(screen.queryByText('Title')).not.toBeInTheDocument();
    expect(screen.getByText('Saved')).toHaveClass('text-[color:var(--scanner-text-primary)]');
    expect(container.firstChild).toHaveAttribute('data-show-title', 'false');
  });

  it('treats a missing title like Show title=False', () => {
    render(<NotificationTextContent message="Saved" />);
    expect(screen.getByText('Saved')).toHaveClass('text-[color:var(--scanner-text-primary)]');
  });

  it('applies titleId and messageId', () => {
    render(<NotificationTextContent title="T" message="M" titleId="t1" messageId="m1" />);
    expect(screen.getByText('T')).toHaveAttribute('id', 't1');
    expect(screen.getByText('M')).toHaveAttribute('id', 'm1');
  });

  it('forwards the ref, merges className and spreads attributes', () => {
    const ref = createRef<HTMLDivElement>();
    render(<NotificationTextContent ref={ref} className="custom" data-testid="tc" message="M" />);
    expect(ref.current).toHaveClass('custom', 'flex');
    expect(screen.getByTestId('tc')).toBe(ref.current);
  });
});
