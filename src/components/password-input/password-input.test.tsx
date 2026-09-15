import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PasswordInput } from './PasswordInput';

const field = (container: HTMLElement) => container.querySelector('[data-part="field"]') as HTMLElement;
const toggle = (container: HTMLElement) =>
  container.querySelector('[data-part="visibility-toggle"]') as HTMLButtonElement;

describe('PasswordInput', () => {
  it('renders a masked input with the Figma default label, link and helper', () => {
    render(<PasswordInput placeholder="Password" linkHref="#reset" />);
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');
    expect(input).toHaveAccessibleDescription('Optional helper text');
    expect(screen.getByRole('link', { name: 'Forgot password?' })).toBeInTheDocument();
  });

  it('forwards the ref and merges className', () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = render(<PasswordInput ref={ref} className="custom" layer={2} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(container.firstElementChild).toHaveClass('custom');
    expect(container.firstElementChild).toHaveAttribute('data-layer', '2');
    expect(field(container).className).toContain('--scanner-bg-layer-02');
  });

  it('hides label, link and helper when their Show props are false', () => {
    render(<PasswordInput showLabel={false} showLink={false} showHelper={false} aria-label="Pwd" />);
    expect(screen.queryByText('Password')).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByText('Optional helper text')).not.toBeInTheDocument();
  });

  it('shows required asterisk and explainer', () => {
    render(<PasswordInput required showExplainer explainerContent="8+ characters" />);
    expect(screen.getByLabelText('Password')).toHaveAttribute('aria-required', 'true');
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /8\+ characters/ })).toBeInTheDocument();
  });

  describe('visibility toggle', () => {
    it('is hidden (via CSS) while empty and visible once filled', async () => {
      const { container } = render(<PasswordInput />);
      expect(toggle(container)).toHaveClass('hidden');
      await userEvent.type(screen.getByLabelText('Password'), 'a');
      expect(toggle(container)).not.toHaveClass('hidden');
    });

    it('toggles type, aria-pressed and label (uncontrolled)', async () => {
      const onChange = vi.fn();
      render(<PasswordInput defaultValue="secret" onPasswordVisibleChange={onChange} />);
      const input = screen.getByLabelText('Password');
      const button = screen.getByRole('button', { name: 'Show password' });
      expect(button).toHaveAttribute('aria-pressed', 'false');
      await userEvent.click(button);
      expect(input).toHaveAttribute('type', 'text');
      expect(screen.getByRole('button', { name: 'Hide password' })).toHaveAttribute('aria-pressed', 'true');
      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('respects controlled passwordVisible', async () => {
      const onChange = vi.fn();
      render(<PasswordInput defaultValue="secret" passwordVisible={false} onPasswordVisibleChange={onChange} />);
      await userEvent.click(screen.getByRole('button', { name: 'Show password' }));
      expect(onChange).toHaveBeenCalledWith(true);
      expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
    });

    it('supports defaultPasswordVisible', () => {
      render(<PasswordInput defaultValue="secret" defaultPasswordVisible />);
      expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text');
    });

    it('is keyboard operable', async () => {
      render(<PasswordInput defaultValue="secret" showLink={false} />);
      await userEvent.tab();
      expect(screen.getByLabelText('Password')).toHaveFocus();
      await userEvent.tab();
      expect(screen.getByRole('button', { name: 'Show password' })).toHaveFocus();
      await userEvent.keyboard('{Enter}');
      expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text');
    });
  });

  it('shows the error message instead of helper', () => {
    const { container } = render(<PasswordInput error errorText="Incorrect password" />);
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Incorrect password');
    expect(screen.queryByText('Optional helper text')).not.toBeInTheDocument();
    expect(field(container).className).toContain('--scanner-border-error');
  });

  it('disables input and toggle', () => {
    render(<PasswordInput disabled defaultValue="secret" />);
    expect(screen.getByLabelText('Password')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Show password' })).toBeDisabled();
  });

  it('renders a hidden skeleton', () => {
    const { container } = render(<PasswordInput skeleton />);
    expect(screen.queryByLabelText('Password')).not.toBeInTheDocument();
    expect(container.querySelector('[data-skeleton]')).toHaveAttribute('aria-hidden', 'true');
  });

  it('passes data-state to the field', () => {
    const { container } = render(<PasswordInput data-state="focused" />);
    expect(field(container)).toHaveAttribute('data-state', 'focused');
  });

  it('calls onLinkClick', async () => {
    const onLinkClick = vi.fn((e: React.MouseEvent) => e.preventDefault());
    render(<PasswordInput linkHref="#reset" onLinkClick={onLinkClick} />);
    await userEvent.click(screen.getByRole('link', { name: 'Forgot password?' }));
    expect(onLinkClick).toHaveBeenCalledTimes(1);
  });
});
