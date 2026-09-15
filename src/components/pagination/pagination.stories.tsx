import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Pagination } from './Pagination';
import type { PaginationProps, PaginationSize } from './pagination.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → Pagination (node 34178:41697)
 * Size = 4 variants (page 1 of 10 selected) — rendered in `FigmaMatrix`.
 * Item states (Enabled / Hovered / Focused / Selected) are covered by `Private/_PaginationItem`.
 */

const SIZES: PaginationSize[] = ['x-large', 'large', 'medium', 'small'];
const sizeLabel: Record<PaginationSize, string> = {
  'x-large': 'X-Large',
  large: 'Large',
  medium: 'Medium',
  small: 'Small',
};

const POSITIONS = [
  { name: 'First page', currentPage: 1 },
  { name: 'Near start', currentPage: 4 },
  { name: 'Middle', currentPage: 10 },
  { name: 'Near end', currentPage: 17 },
  { name: 'Last page', currentPage: 20 },
] as const;

/* ── Layout helpers (story-only) ── */

const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const cell: React.CSSProperties = { padding: 12, verticalAlign: 'middle' };
const headCell: React.CSSProperties = {
  padding: 12,
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

/** Stateful wrapper so stories can be clicked through. */
function InteractivePagination(props: PaginationProps) {
  const { currentPage, onPageChange } = props;
  const [page, setPage] = useState(currentPage);
  return (
    <Pagination
      {...props}
      currentPage={page}
      onPageChange={(p) => {
        setPage(p);
        onPageChange?.(p);
      }}
    />
  );
}

/* ------------------------------------------------------------------ */

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: {
    docs: {
      description: {
        component:
          'Navigation between pages of content, rendered as a `nav` landmark. The current page has `aria-current="page"`; ' +
          'more than 7 pages collapse into "…". Keyboard: Tab between buttons, Enter/Space to activate, ArrowLeft/ArrowRight for previous/next page.',
      },
    },
  },
  argTypes: {
    currentPage: { control: { type: 'number', min: 1 } },
    totalPages: { control: { type: 'number', min: 1 } },
    size: { name: 'Size', control: 'inline-radio', options: SIZES },
    disabled: { control: 'boolean' },
    skeleton: { control: 'boolean' },
  },
  args: { currentPage: 1, totalPages: 10, size: 'x-large', onPageChange: fn() },
  decorators: [
    (Story) => (
      <div style={{ padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Pagination>;

/* ── Default (interactive) ── */

export const Default: Story = {
  render: (args) => <InteractivePagination key={`${args.currentPage}-${args.totalPages}`} {...args} />,
};

/* ── Sizes (Figma "Size") ── */

export const XLarge: Story = { name: 'Size: X-Large', args: { size: 'x-large' } };
export const Large: Story = { name: 'Size: Large', args: { size: 'large' } };
export const Medium: Story = { name: 'Size: Medium', args: { size: 'medium' } };
export const Small: Story = { name: 'Size: Small', args: { size: 'small' } };

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {SIZES.map((s) => (
        <Pagination key={s} currentPage={1} totalPages={10} size={s} />
      ))}
    </div>
  ),
};

/* ── All states: size rows × page position / disabled / skeleton columns ── */

export const AllStates: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          {POSITIONS.map((p) => (
            <th key={p.name} style={headCell}>{`${p.name} (${p.currentPage}/20)`}</th>
          ))}
          <th style={headCell}>Disabled</th>
          <th style={headCell}>Skeleton</th>
        </tr>
      </thead>
      <tbody>
        {SIZES.map((s) => (
          <tr key={s}>
            <th style={headCell}>{sizeLabel[s]}</th>
            {POSITIONS.map((p) => (
              <td key={p.name} style={cell}>
                <Pagination currentPage={p.currentPage} totalPages={20} size={s} />
              </td>
            ))}
            <td style={cell}>
              <Pagination currentPage={3} totalPages={20} size={s} disabled />
            </td>
            <td style={cell}>
              <Pagination currentPage={1} totalPages={20} size={s} skeleton />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Full Figma matrix: the 4 Size variants as drawn in Figma (page 1 of 10) ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 4 variants)',
  render: () => (
    <table style={table}>
      <tbody>
        {SIZES.map((s) => (
          <tr key={s}>
            <th style={headCell}>{`Size=${sizeLabel[s]}`}</th>
            <td style={cell}>
              <Pagination currentPage={1} totalPages={10} size={s} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Page count edge cases ── */

export const FewPages: Story = {
  name: 'Few pages (no ellipsis)',
  args: { currentPage: 3, totalPages: 5 },
  render: (args) => <InteractivePagination {...args} />,
};

export const ManyPages: Story = {
  name: 'Many pages (ellipsis)',
  args: { currentPage: 50, totalPages: 120 },
  render: (args) => <InteractivePagination {...args} />,
};

export const SinglePage: Story = { args: { currentPage: 1, totalPages: 1 } };

export const Disabled: Story = { args: { currentPage: 3, disabled: true } };
export const Skeleton: Story = { args: { skeleton: true } };

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

export const ClickPageAndNext: Story = {
  tags: ['test'],
  render: (args) => <InteractivePagination {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const prev = canvas.getByRole('button', { name: 'Previous page' });
    await expect(prev).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page');

    await userEvent.click(canvas.getByRole('button', { name: 'Page 3' }));
    await expect(args.onPageChange).toHaveBeenLastCalledWith(3);
    await expect(canvas.getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'page');

    await userEvent.click(canvas.getByRole('button', { name: 'Next page' }));
    await expect(args.onPageChange).toHaveBeenLastCalledWith(4);
    await expect(prev).toBeEnabled();
  },
};

export const ArrowKeysChangePage: Story = {
  tags: ['test'],
  args: { currentPage: 5 },
  render: (args) => <InteractivePagination {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Previous page' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(args.onPageChange).toHaveBeenLastCalledWith(6);
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
    await expect(args.onPageChange).toHaveBeenLastCalledWith(4);
  },
};

export const DisabledIgnoresClicks: Story = {
  tags: ['test'],
  args: { currentPage: 3, disabled: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const page = canvas.getByRole('button', { name: 'Page 4' });
    await expect(page).toBeDisabled();
    await userEvent.click(page, { pointerEventsCheck: 0 });
    await expect(args.onPageChange).not.toHaveBeenCalled();
  },
};
