import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Toolbar } from './Toolbar';
import { ToolbarButton } from './ToolbarButton';
import { ToolbarDivider } from './ToolbarDivider';

const renderToolbar = (props: Partial<React.ComponentProps<typeof Toolbar>> = {}) =>
  render(
    <Toolbar aria-label="Scan tools" {...props}>
      {props.children ?? (
        <>
          <ToolbarButton iconName="edit" label="Edit" />
          <ToolbarButton iconName="filter" label="Filter" />
          <ToolbarButton iconName="search" label="Search" />
        </>
      )}
    </Toolbar>,
  );

describe('Toolbar', () => {
  it('renders a toolbar landmark with its orientation', () => {
    renderToolbar();
    const toolbar = screen.getByRole('toolbar', { name: 'Scan tools' });
    expect(toolbar).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('supports vertical orientation', () => {
    renderToolbar({ orientation: 'vertical' });
    expect(screen.getByRole('toolbar')).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('forwards ref and merges className', () => {
    const ref = createRef<HTMLDivElement>();
    renderToolbar({ ref, className: 'custom' });
    expect(ref.current).toBe(screen.getByRole('toolbar'));
    expect(ref.current).toHaveClass('custom');
  });

  describe('collapse', () => {
    it('has no collapse button unless collapsible', () => {
      renderToolbar();
      expect(screen.queryByRole('button', { name: /collapse|expand/i })).not.toBeInTheDocument();
    });

    it('toggles its own state and hides the buttons', () => {
      renderToolbar({ collapsible: true });
      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();

      const toggle = screen.getByRole('button', { name: 'Collapse toolbar' });
      expect(toggle).toHaveAttribute('aria-expanded', 'true');
      fireEvent.click(toggle);

      expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument();
      const expand = screen.getByRole('button', { name: 'Expand toolbar' });
      expect(expand).toHaveAttribute('aria-expanded', 'false');
    });

    it('respects the controlled collapsed prop and reports changes', () => {
      const onCollapsedChange = vi.fn();
      renderToolbar({ collapsible: true, collapsed: true, onCollapsedChange });
      expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: 'Expand toolbar' }));
      expect(onCollapsedChange).toHaveBeenCalledWith(false);
      /* still collapsed — the parent owns the state */
      expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument();
    });
  });

  describe('keyboard', () => {
    it('moves focus with arrows and wraps', () => {
      renderToolbar();
      const toolbar = screen.getByRole('toolbar');
      screen.getByRole('button', { name: 'Edit' }).focus();

      fireEvent.keyDown(toolbar, { key: 'ArrowRight' });
      expect(screen.getByRole('button', { name: 'Filter' })).toHaveFocus();

      fireEvent.keyDown(toolbar, { key: 'ArrowLeft' });
      expect(screen.getByRole('button', { name: 'Edit' })).toHaveFocus();

      fireEvent.keyDown(toolbar, { key: 'ArrowLeft' });
      expect(screen.getByRole('button', { name: 'Search' })).toHaveFocus();
    });

    it('jumps to the ends with Home and End', () => {
      renderToolbar();
      const toolbar = screen.getByRole('toolbar');
      screen.getByRole('button', { name: 'Filter' }).focus();

      fireEvent.keyDown(toolbar, { key: 'End' });
      expect(screen.getByRole('button', { name: 'Search' })).toHaveFocus();

      fireEvent.keyDown(toolbar, { key: 'Home' });
      expect(screen.getByRole('button', { name: 'Edit' })).toHaveFocus();
    });

    it('uses up/down arrows when vertical', () => {
      renderToolbar({ orientation: 'vertical' });
      const toolbar = screen.getByRole('toolbar');
      screen.getByRole('button', { name: 'Edit' }).focus();

      fireEvent.keyDown(toolbar, { key: 'ArrowDown' });
      expect(screen.getByRole('button', { name: 'Filter' })).toHaveFocus();
    });

    it('skips disabled buttons', () => {
      renderToolbar({
        children: (
          <>
            <ToolbarButton iconName="edit" label="Edit" />
            <ToolbarButton iconName="filter" label="Filter" disabled />
            <ToolbarButton iconName="search" label="Search" />
          </>
        ),
      });
      const toolbar = screen.getByRole('toolbar');
      screen.getByRole('button', { name: 'Edit' }).focus();

      fireEvent.keyDown(toolbar, { key: 'ArrowRight' });
      expect(screen.getByRole('button', { name: 'Search' })).toHaveFocus();
    });
  });
});

describe('ToolbarButton', () => {
  it('renders an icon button named by its label', () => {
    render(<ToolbarButton iconName="edit" label="Edit" />);
    const button = screen.getByRole('button', { name: 'Edit' });
    expect(button.querySelector('svg')).toHaveAttribute('width', '48');
  });

  it('reports the selected state with aria-pressed', () => {
    render(<ToolbarButton iconName="filter" label="Filter" selected />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('ignores clicks when disabled', () => {
    const onClick = vi.fn();
    render(<ToolbarButton iconName="edit" label="Edit" disabled onClick={onClick} />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('calls onClick', () => {
    const onClick = vi.fn();
    render(<ToolbarButton iconName="edit" label="Edit" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('accepts a custom icon node', () => {
    render(<ToolbarButton icon={<span data-testid="custom" />} label="Custom" />);
    expect(screen.getByTestId('custom')).toBeInTheDocument();
  });

  it('passes data-state through for forced states', () => {
    render(<ToolbarButton iconName="edit" label="Edit" data-state="hovered" />);
    expect(screen.getByRole('button')).toHaveAttribute('data-state', 'hovered');
  });
});

describe('ToolbarDivider', () => {
  it('is hidden from assistive tech and follows the toolbar orientation', () => {
    const { container } = render(
      <Toolbar orientation="vertical" aria-label="Tools">
        <ToolbarButton iconName="edit" label="Edit" />
        <ToolbarDivider />
        <ToolbarButton iconName="search" label="Search" />
      </Toolbar>,
    );
    const divider = container.querySelector('[data-orientation="horizontal"]');
    expect(divider).toHaveAttribute('aria-hidden', 'true');
  });
});
