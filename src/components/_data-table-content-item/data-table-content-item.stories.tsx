import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { DataTableContentItem } from './DataTableContentItem';
import type {
  DataTableContentItemProps,
  DataTableContentItemSize,
  DataTableContentType,
} from './data-table-content-item.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → Items / Data table content item (node 30526:43149)
 * Size (Large (1 line), X-large (2 lines), 2X-large (3 lines)) × Content (Text, Text + subtext,
 * Link, Badge, Progress, Buttons, Slot) = 21 variants + the "Show avatar" boolean —
 * every combination is rendered in `FigmaMatrix`.
 */

const SIZES: DataTableContentItemSize[] = ['large', 'x-large', '2x-large'];
const sizeLabel: Record<DataTableContentItemSize, string> = {
  large: 'Large (1 line)',
  'x-large': 'X-large (2 lines)',
  '2x-large': '2X-large (3 lines)',
};

const CONTENTS: DataTableContentType[] = [
  'text',
  'text-subtext',
  'link',
  'badge',
  'progress',
  'buttons',
  'slot',
];
const contentLabel: Record<DataTableContentType, string> = {
  text: 'Text',
  'text-subtext': 'Text + subtext',
  link: 'Link',
  badge: 'Badge',
  progress: 'Progress',
  buttons: 'Buttons',
  slot: 'Slot',
};

const avatar = { alt: 'Jane Doe', name: 'Jane Doe' };

const actions = [
  { iconName: 'edit', label: 'Edit row' },
  { iconName: 'more-horizontal', label: 'More actions' },
] as DataTableContentItemProps['actions'];

function variantProps(
  size: DataTableContentItemSize,
  content: DataTableContentType,
  showAvatar = false,
): DataTableContentItemProps {
  return {
    size,
    content,
    text: content === 'link' ? 'Link' : content === 'badge' ? 'Badge' : 'Cell item text',
    subtext: 'Cell item subtext',
    href: content === 'link' ? '#' : undefined,
    avatar: showAvatar ? avatar : undefined,
    progress: content === 'progress' ? { value: 1 } : undefined,
    actions: content === 'buttons' ? actions : undefined,
  };
}

const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const headCell: React.CSSProperties = {
  padding: 8,
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};
const sectionTitle: React.CSSProperties = {
  font: '500 16px/24px var(--scanner-font-sans)',
  color: 'var(--scanner-text-primary)',
  margin: '24px 0 8px',
};

const meta: Meta<typeof DataTableContentItem> = {
  title: 'Private/_DataTableContentItem',
  component: DataTableContentItem,
  parameters: {
    docs: {
      description: {
        component:
          'Content cell of a data table row. Renders a `<td>` whose body depends on `content` and ' +
          'reuses `Avatar`, `Link`, `Badge`, `Button` and `SlotContent`. Text is truncated with an ' +
          'ellipsis after one line (two for the 2X-large text + subtext title), exactly like Figma.',
      },
    },
  },
  argTypes: {
    size: { name: 'Size', control: 'inline-radio', options: SIZES },
    content: { name: 'Content', control: 'select', options: CONTENTS },
    text: { control: 'text' },
    subtext: { control: 'text' },
    showAvatar: { name: 'Show avatar', control: 'boolean' },
    badgeStatus: {
      control: 'inline-radio',
      options: ['neutral', 'info', 'success', 'warning', 'destructive'],
    },
    external: { control: 'boolean' },
    'data-state': {
      name: 'Forced state',
      control: 'inline-radio',
      options: [undefined, 'hovered', 'focused', 'pressed'],
    },
  },
  args: {
    size: 'large',
    content: 'text',
    text: 'Cell item text',
    subtext: 'Cell item subtext',
    avatar,
    showAvatar: false,
    href: '#',
    progress: { value: 1 },
    actions,
    onLinkClick: fn(),
  },
  decorators: [
    (Story) => (
      <table style={{ ...table, width: 320 }}>
        <tbody>
          <tr>
            <Story />
          </tr>
        </tbody>
      </table>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof DataTableContentItem>;

export const Default: Story = {};

/* ── Per Figma "Content" variant ── */

export const Text: Story = { name: 'Content: Text', args: { content: 'text' } };
export const TextAndSubtext: Story = {
  name: 'Content: Text + subtext',
  args: { content: 'text-subtext', size: 'x-large' },
};
export const Link: Story = { name: 'Content: Link', args: { content: 'link', text: 'Link' } };
export const Badge: Story = { name: 'Content: Badge', args: { content: 'badge', text: 'Badge' } };
export const Progress: Story = { name: 'Content: Progress', args: { content: 'progress' } };
export const Buttons: Story = { name: 'Content: Buttons', args: { content: 'buttons' } };
export const Slot: Story = { name: 'Content: Slot', args: { content: 'slot' } };
export const WithAvatar: Story = { name: 'Show avatar', args: { showAvatar: true } };

/* ── All sizes ── */

export const AllSizes: Story = {
  decorators: [(Story) => <Story />],
  render: ({ content = 'text' }) => (
    <table style={table}>
      <tbody>
        {SIZES.map((size) => (
          <tr key={size}>
            <th style={headCell}>{sizeLabel[size]}</th>
            <DataTableContentItem {...variantProps(size, content)} />
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── All states — only the interactive contents have states (forced via data-state) ── */

const STATEFUL: DataTableContentType[] = ['link', 'buttons'];
const STATES = ['enabled', 'hovered', 'focused', 'pressed'] as const;

export const AllStates: Story = {
  decorators: [(Story) => <Story />],
  render: () => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          {STATES.map((state) => (
            <th key={state} style={headCell}>
              {state}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {STATEFUL.map((content) => (
          <tr key={content}>
            <th style={headCell}>{contentLabel[content]}</th>
            {STATES.map((state) => (
              <DataTableContentItem
                key={state}
                {...variantProps('large', content)}
                data-state={state === 'enabled' ? undefined : state}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Full Figma matrix: all 21 variants, with and without the avatar ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 21 variants)',
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <Story />],
  render: () => (
    <div style={{ padding: 24 }}>
      {[false, true].map((showAvatar) => (
        <section key={String(showAvatar)}>
          <h3 style={sectionTitle}>{`Show avatar=${showAvatar}`}</h3>
          <table style={table}>
            <thead>
              <tr>
                <th style={headCell} />
                {CONTENTS.map((content) => (
                  <th key={content} style={headCell}>
                    {contentLabel[content]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SIZES.map((size) => (
                <tr key={size}>
                  <th style={headCell}>{sizeLabel[size]}</th>
                  {CONTENTS.map((content) => (
                    <DataTableContentItem
                      key={content}
                      {...variantProps(size, content, showAvatar)}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  ),
};

/* ── Progress values ── */

export const ProgressValues: Story = {
  decorators: [(Story) => <Story />],
  render: () => (
    <table style={table}>
      <tbody>
        {[0, 1, 2, 3].map((value) => (
          <tr key={value}>
            <th style={headCell}>{`${value} / 3`}</th>
            <DataTableContentItem content="progress" progress={{ value }} text="Cell item text" />
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Overflow: long text truncates with an ellipsis ── */

export const LongTextTruncates: Story = {
  decorators: [(Story) => <Story />],
  render: () => (
    <table style={{ ...table, width: 240, tableLayout: 'fixed' }}>
      <tbody>
        {SIZES.map((size) => (
          <tr key={size}>
            <DataTableContentItem
              size={size}
              content="text-subtext"
              text="Jane Elizabeth Doe — upper and lower jaw scan"
              subtext="Completed on 12 January 2026 by Dr. Miller"
            />
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Interaction tests ── */

export const ActionButtonsAreOperable: Story = {
  tags: ['test'],
  args: {
    content: 'buttons',
    actions: [
      { iconName: 'edit', label: 'Edit row', onClick: fn() },
      { iconName: 'more-horizontal', label: 'More actions', onClick: fn() },
    ],
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const edit = canvas.getByRole('button', { name: 'Edit row' });
    await userEvent.click(edit);
    await expect(args.actions?.[0].onClick).toHaveBeenCalledTimes(1);
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'More actions' })).toHaveFocus();
  },
};

export const LinkIsFocusable: Story = {
  tags: ['test'],
  args: { content: 'link', text: 'Link', href: '#patient' },
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: 'Link' });
    await userEvent.tab();
    await expect(link).toHaveFocus();
  },
};
