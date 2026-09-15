import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { BreadcrumbLink } from './BreadcrumbLink';
import type { BreadcrumbLinkProps } from './breadcrumb-link.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → _Breadcrumb link (node 25889:49863)
 * State × Show divider — every combination is rendered in `FigmaMatrix`.
 */

const STATES = ['enabled', 'hovered', 'focused', 'disabled', 'skeleton'] as const;
type State = (typeof STATES)[number];
const label = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const stateProps = (state: State): Partial<BreadcrumbLinkProps> => ({
  disabled: state === 'disabled',
  skeleton: state === 'skeleton',
  'data-state': state === 'hovered' || state === 'focused' ? state : undefined,
});

const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const cell: React.CSSProperties = { padding: 12, verticalAlign: 'middle' };
const headCell: React.CSSProperties = {
  ...cell,
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

const meta: Meta<typeof BreadcrumbLink> = {
  title: 'Private/_BreadcrumbLink',
  component: BreadcrumbLink,
  argTypes: {
    children: { control: 'text' },
    href: { control: 'text' },
    showDivider: { name: 'Show divider', control: 'boolean' },
    showSeparator: { table: { disable: true } },
    isCurrent: { control: 'boolean' },
    disabled: { control: 'boolean' },
    skeleton: { control: 'boolean' },
    'data-state': { name: 'Forced state', control: 'inline-radio', options: [undefined, 'hovered', 'focused'] },
  },
  args: { children: 'Page name', href: '#', showDivider: true, onClick: fn() },
  decorators: [
    (Story) => (
      <div style={{ padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof BreadcrumbLink>;

export const Default: Story = {};

export const Enabled: Story = {};
export const Hovered: Story = { args: { 'data-state': 'hovered' } };
export const Focused: Story = { args: { 'data-state': 'focused' } };
export const Disabled: Story = { args: { disabled: true } };
export const Skeleton: Story = { args: { skeleton: true } };
export const WithoutDivider: Story = { name: 'Show divider: False', args: { showDivider: false } };
export const CurrentPage: Story = { args: { isCurrent: true, showDivider: false } };

export const AllStates: Story = {
  render: () => (
    <table style={table}>
      <tbody>
        {STATES.map((s) => (
          <tr key={s}>
            <th style={headCell}>{label(s)}</th>
            <td style={cell}>
              <BreadcrumbLink href="#" {...stateProps(s)}>Page name</BreadcrumbLink>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all variants)',
  render: () => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          <th style={headCell}>Show divider=True</th>
          <th style={headCell}>Show divider=False</th>
        </tr>
      </thead>
      <tbody>
        {STATES.map((s) => (
          <tr key={s}>
            <th style={headCell}>{`State=${label(s)}`}</th>
            {[true, false].map((d) => (
              <td key={String(d)} style={cell}>
                <BreadcrumbLink href="#" showDivider={d} {...stateProps(s)}>Page name</BreadcrumbLink>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

export const KeyboardActivation: Story = {
  tags: ['test'],
  play: async ({ args, canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: 'Page name' });
    await userEvent.tab();
    await expect(link).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
};

export const DisabledIsInert: Story = {
  tags: ['test'],
  args: { disabled: true },
  play: async ({ args, canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: 'Page name' });
    await expect(link).toHaveAttribute('aria-disabled', 'true');
    await expect(link).not.toHaveAttribute('href');
    await userEvent.tab();
    await expect(link).not.toHaveFocus();
    await userEvent.click(link);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};
