import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Avatar } from './Avatar';
import { getInitials, toPixelSize } from './avatar.utils';

describe('Avatar', () => {
  it('renders the image variant with the accessible name on the root', () => {
    const { container } = render(<Avatar src="/a.jpg" alt="Jane Doe" />);
    const avatar = screen.getByRole('img', { name: 'Jane Doe' });
    expect(avatar).toHaveAttribute('data-variant', 'image');
    expect(container.querySelector('img')).toHaveAttribute('src', '/a.jpg');
  });

  it('renders explicit initials (max 2, uppercase)', () => {
    render(<Avatar initials="jdx" alt="Jane Doe" />);
    expect(screen.getByRole('img')).toHaveAttribute('data-variant', 'initials');
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('derives initials from name', () => {
    render(<Avatar name="Jane Doe" alt="Jane Doe" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('falls back to the icon variant without user data', () => {
    const { container } = render(<Avatar alt="Guest" />);
    expect(screen.getByRole('img')).toHaveAttribute('data-variant', 'icon');
    expect(container.querySelector('svg')).toHaveAttribute('width', '20');
  });

  it('falls back from a broken image to initials', () => {
    const { container } = render(<Avatar src="/broken.jpg" initials="JD" alt="Jane Doe" />);
    fireEvent.error(container.querySelector('img')!);
    expect(screen.getByRole('img')).toHaveAttribute('data-variant', 'initials');
  });

  it('honours a forced variant', () => {
    render(<Avatar src="/a.jpg" initials="JD" alt="Jane" variant="icon" />);
    expect(screen.getByRole('img')).toHaveAttribute('data-variant', 'icon');
  });

  it.each([
    [28, 16],
    [36, 20],
    [44, 24],
    [60, 24],
    [80, 32],
  ] as const)('size %i uses a %ipx icon', (size, icon) => {
    const { container } = render(<Avatar alt="Guest" size={size} />);
    expect(container.querySelector('svg')).toHaveAttribute('width', String(icon));
    expect(screen.getByRole('img').className).toContain(`--scanner-avatar-size-${size}`);
  });

  it('uses Figma heading styles for initials per size', () => {
    const { rerender } = render(<Avatar initials="AD" alt="a" size={32} />);
    expect(screen.getByText('AD')).toHaveClass('scanner-text-heading-01');
    rerender(<Avatar initials="AD" alt="a" size={52} />);
    expect(screen.getByText('AD')).toHaveClass('scanner-text-heading-02');
    rerender(<Avatar initials="AD" alt="a" size={80} />);
    expect(screen.getByText('AD')).toHaveClass('scanner-text-heading-03');
  });

  it('accepts legacy size names', () => {
    render(<Avatar alt="a" size="4xl" />);
    expect(screen.getByRole('img')).toHaveAttribute('data-size', '80');
  });

  it('shows the status dot and includes it in the accessible name', () => {
    const { container } = render(<Avatar alt="Jane Doe" showStatus />);
    expect(screen.getByRole('img', { name: 'Jane Doe (online)' })).toBeInTheDocument();
    expect(container.querySelector('[data-status="online"]')).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders a hidden skeleton placeholder', () => {
    const { container } = render(<Avatar alt="Jane" skeleton size={40} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    const el = container.querySelector('[data-skeleton]');
    expect(el).toHaveAttribute('aria-hidden', 'true');
    expect(el).toHaveClass('animate-pulse');
    expect(el?.className).toContain('--scanner-bg-highlight-gray');
  });

  it('forwards ref and merges className', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Avatar ref={ref} alt="a" className="custom" />);
    expect(ref.current).toHaveClass('custom');
  });
});

describe('avatar utils', () => {
  it('getInitials follows the Figma content rule', () => {
    expect(getInitials('Jane Doe')).toBe('JD');
    expect(getInitials('madonna')).toBe('M');
    expect(getInitials('  mary jane watson ')).toBe('MJ');
  });

  it('toPixelSize maps legacy names', () => {
    expect(toPixelSize('extra-small')).toBe(28);
    expect(toPixelSize('3xl')).toBe(60);
    expect(toPixelSize(52)).toBe(52);
  });
});
