import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { AvatarGroup } from './AvatarGroup';

const avatars = Array.from({ length: 8 }, (_, i) => ({ name: `User ${i}`, alt: `User ${i}` }));

describe('AvatarGroup', () => {
  it('renders max avatars plus a +N counter', () => {
    render(<AvatarGroup avatars={avatars} max={4} />);
    expect(screen.getByRole('group', { name: 'Group of 8 avatars' })).toBeInTheDocument();
    expect(screen.getAllByRole('img', { name: /^User \d$/ })).toHaveLength(4);
    expect(screen.getByRole('img', { name: '4 more' })).toHaveTextContent('+4');
  });

  it('omits the counter when everything fits', () => {
    render(<AvatarGroup avatars={avatars.slice(0, 3)} />);
    expect(screen.queryByRole('img', { name: /more/ })).not.toBeInTheDocument();
  });

  it.each([
    [28, '--scanner-spacing-4', '--scanner-text-xs'],
    [36, '--scanner-spacing-5', '--scanner-text-xs'],
    [40, '--scanner-spacing-5', '--scanner-text-sm'],
    [44, '--scanner-spacing-6', '--scanner-text-sm'],
    [52, '--scanner-spacing-7', '--scanner-text-sm'],
  ] as const)('size %i uses Figma overlap %s and counter text %s', (size, overlap, text) => {
    const { container } = render(<AvatarGroup avatars={avatars} size={size} />);
    expect(screen.getByRole('group').className).toContain(overlap);
    expect(container.querySelector('[data-slot="avatar-group-overflow"] span')?.className).toContain(text);
    screen.getAllByRole('img', { name: /^User \d$/ }).forEach((a) => expect(a).toHaveAttribute('data-size', String(size)));
  });

  it('draws the 1px on-color ring as a shadow (no layout change)', () => {
    const { container } = render(<AvatarGroup avatars={avatars} />);
    expect(container.querySelector('[data-slot="avatar-group-item"]')?.className).toContain(
      '--scanner-border-on-color-strong',
    );
  });

  it('accepts a custom aria-label, legacy size names, ref and className', () => {
    const ref = createRef<HTMLDivElement>();
    render(<AvatarGroup ref={ref} avatars={avatars} size="large" aria-label="Team" className="custom" />);
    expect(screen.getByRole('group', { name: 'Team' })).toBe(ref.current);
    expect(ref.current).toHaveClass('custom');
    expect(ref.current).toHaveAttribute('data-size', '40');
  });
});
