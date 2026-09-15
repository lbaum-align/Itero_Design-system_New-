import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { Breadcrumbs } from './Breadcrumbs';
import type { BreadcrumbItem } from './breadcrumbs.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → Breadcrumbs (node 21114:1171)
 * Show current page × Show overflow — rendered in `FigmaMatrix`.
 */

const links: BreadcrumbItem[] = [
  { label: 'Page name', href: '#' },
  { label: 'Page name', href: '#' },
  { label: 'Page name', href: '#' },
];
const withCurrent: BreadcrumbItem[] = [...links, { label: 'Page name' }];
const longTrail: BreadcrumbItem[] = [
  { label: 'Home', href: '#' },
  { label: 'Patients', href: '#' },
  { label: 'Jane Doe', href: '#' },
  { label: 'Treatments', href: '#' },
  { label: 'Invisalign', href: '#' },
  { label: 'Scans', href: '#' },
  { label: 'Scan 12' },
];

const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const cell: React.CSSProperties = { padding: 16, verticalAlign: 'middle' };
const headCell: React.CSSProperties = {
  ...cell,
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  parameters: {
    docs: {
      description: {
        component:
          'Navigational aid showing the path to the current page. Place top-left, under the header and above the page title. ' +
          'Keyboard: Tab moves between links, Enter/Space follows a link. The current page is plain text (not a link).',
      },
    },
  },
  argTypes: {
    showCurrentPage: { name: 'Show current page', control: 'boolean' },
    showOverflow: { name: 'Show overflow', control: 'boolean' },
    maxVisibleItems: { control: { type: 'number', min: 2 } },
    skeleton: { control: 'boolean' },
  },
  args: { items: links, showCurrentPage: false, showOverflow: false },
  decorators: [
    (Story) => (
      <div style={{ padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Breadcrumbs>;

export const Default: Story = {};

export const ShowCurrentPage: Story = {
  name: 'Show current page: True',
  args: { items: withCurrent, showCurrentPage: true },
};

export const ShowOverflow: Story = {
  name: 'Show overflow: True',
  args: { items: longTrail, showOverflow: true, showCurrentPage: undefined },
};

/** Link states inside a trail (disabled / skeleton are data-driven; hover/focus are shown on `_BreadcrumbLink`). */
export const AllStates: Story = {
  render: () => (
    <table style={table}>
      <tbody>
        <tr>
          <th style={headCell}>Enabled</th>
          <td style={cell}><Breadcrumbs items={links} /></td>
        </tr>
        <tr>
          <th style={headCell}>Disabled item</th>
          <td style={cell}>
            <Breadcrumbs items={[links[0], { label: 'Page name', href: '#', disabled: true }, links[2]]} />
          </td>
        </tr>
        <tr>
          <th style={headCell}>Skeleton</th>
          <td style={cell}><Breadcrumbs items={links} skeleton /></td>
        </tr>
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
          <th style={headCell}>Show overflow=False</th>
          <th style={headCell}>Show overflow=True</th>
        </tr>
      </thead>
      <tbody>
        {[false, true].map((cur) => (
          <tr key={String(cur)}>
            <th style={headCell}>{`Show current page=${cur ? 'True' : 'False'}`}</th>
            {[false, true].map((ov) => {
              const base = ov ? longTrail.slice(0, -1) : links;
              const items = cur ? [...base, { label: ov ? 'Scan 12' : 'Page name' }] : base;
              return (
                <td key={String(ov)} style={cell}>
                  <Breadcrumbs items={items} showCurrentPage={cur} showOverflow={ov} />
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

export const LongTrailWraps: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <Breadcrumbs items={longTrail} />
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

export const KeyboardNavigation: Story = {
  tags: ['test'],
  args: { items: withCurrent, showCurrentPage: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole('navigation', { name: 'Breadcrumb' });
    const anchors = within(nav).getAllByRole('link');
    await expect(anchors).toHaveLength(3);
    for (const a of anchors) {
      await userEvent.tab();
      await expect(a).toHaveFocus();
    }
    await expect(canvas.getByText('Page name', { selector: '[aria-current="page"]' })).toBeInTheDocument();
  },
};

export const OverflowExpands: Story = {
  tags: ['test'],
  args: { items: longTrail, showOverflow: true, showCurrentPage: undefined },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText('Jane Doe')).not.toBeInTheDocument();
    await userEvent.tab();
    await userEvent.tab();
    const more = canvas.getByRole('button', { name: /more breadcrumbs/ });
    await expect(more).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('link', { name: 'Patients' })).toHaveFocus();
    await expect(canvas.queryByRole('button', { name: /more breadcrumbs/ })).not.toBeInTheDocument();
  },
};
