import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { Badge } from './Badge';
import type { BadgeLayout, BadgeProps, BadgeStatus } from './badge.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → Badge (node 12855:13246)
 * Status × State × Layout (+ Show icon) — every combination is rendered in `FigmaMatrix`.
 */

const STATUSES: BadgeStatus[] = ['neutral', 'info', 'success', 'warning', 'destructive'];
const LAYOUTS: BadgeLayout[] = ['default', 'on-image'];
const STATES = ['enabled', 'loading'] as const;
type State = (typeof STATES)[number];

const statusLabel: Record<BadgeStatus, string> = {
  neutral: 'Netral',
  info: 'Info',
  success: 'Success',
  warning: 'Warning',
  destructive: 'Destructive',
};
const layoutLabel: Record<BadgeLayout, string> = { default: 'Default', 'on-image': 'On image' };
const label = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Props for one Figma variant. */
function variantProps(status: BadgeStatus, state: State, layout: BadgeLayout, showIcon = false): BadgeProps {
  return { status, layout, loading: state === 'loading', showIcon, children: 'Badge' };
}

/* ── Layout helpers (story-only) ── */

const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const cell: React.CSSProperties = { padding: 12, verticalAlign: 'middle' };
const headCell: React.CSSProperties = {
  ...cell,
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
/** Stand-in for a photo/scan behind "On image" badges. */
const imageBg: React.CSSProperties = {
  background: 'linear-gradient(135deg, var(--scanner-bg-inverse), var(--scanner-bg-brand))',
};

/* ------------------------------------------------------------------ */

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    docs: {
      description: {
        component:
          'Compact, non-interactive marker for status or category (e.g. New, Error, Success). ' +
          'Use "On image" only when placed directly on an image. Labels stay on one line and truncate with an ellipsis.',
      },
    },
  },
  argTypes: {
    status: { name: 'Status', control: 'inline-radio', options: STATUSES },
    layout: { name: 'Layout', control: 'inline-radio', options: LAYOUTS },
    loading: { name: 'State: Loading', control: 'boolean' },
    showIcon: { name: 'Show icon', control: 'boolean' },
    iconName: { name: 'Icon', control: 'select', options: [undefined, 'info', 'success', 'warning', 'error', 'check'] },
    children: { name: 'Text value', control: 'text' },
  },
  args: { status: 'neutral', layout: 'default', children: 'Badge', showIcon: false, loading: false },
  decorators: [
    (Story) => (
      <div style={{ padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Badge>;

/* ── Default ── */

export const Default: Story = {};

/* ── Per status (Figma "Status") ── */

export const Neutral: Story = { name: 'Status: Netral' };
export const Info: Story = { name: 'Status: Info', args: { status: 'info' } };
export const Success: Story = { name: 'Status: Success', args: { status: 'success' } };
export const Warning: Story = { name: 'Status: Warning', args: { status: 'warning' } };
export const Destructive: Story = { name: 'Status: Destructive', args: { status: 'destructive' } };

/* ── Per layout (Figma "Layout") ── */

const LayoutRow = ({ layout, showIcon }: { layout: BadgeLayout; showIcon?: boolean }) => (
  <div style={{ display: 'flex', gap: 12, padding: 16, ...(layout === 'on-image' ? imageBg : {}) }}>
    {STATUSES.map((s) => (
      <Badge key={s} {...variantProps(s, 'enabled', layout, showIcon)} />
    ))}
  </div>
);

export const LayoutDefault: Story = { name: 'Layout: Default', render: () => <LayoutRow layout="default" /> };
export const LayoutOnImage: Story = { name: 'Layout: On image', render: () => <LayoutRow layout="on-image" /> };

/* ── Show icon ── */

export const WithIcon: Story = {
  name: 'Show icon: True',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <LayoutRow layout="default" showIcon />
      <LayoutRow layout="on-image" showIcon />
    </div>
  ),
};

export const RegistryIcon: Story = { args: { status: 'success', iconName: 'check', children: 'Approved' } };

/* ── All states — status rows × state columns, per layout ── */

export const AllStates: Story = {
  render: ({ showIcon = false }) => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          {LAYOUTS.flatMap((l) =>
            STATES.map((st) => (
              <th key={`${l}-${st}`} style={headCell}>{`${layoutLabel[l]} · ${label(st)}`}</th>
            )),
          )}
        </tr>
      </thead>
      <tbody>
        {STATUSES.map((s) => (
          <tr key={s}>
            <th style={headCell}>{statusLabel[s]}</th>
            {LAYOUTS.flatMap((l) =>
              STATES.map((st) => (
                <td key={`${l}-${st}`} style={{ ...cell, ...(l === 'on-image' ? imageBg : {}) }}>
                  <Badge {...variantProps(s, st, l, showIcon)} />
                </td>
              )),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

export const Loading: Story = {
  name: 'State: Loading',
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Badge loading>Loading</Badge>
      <Badge status="info">Loaded</Badge>
    </div>
  ),
};

/* ── Full Figma matrix: 20 variants × Show icon ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 20 variants)',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div style={{ padding: 24 }}>
      {[false, true].map((showIcon) => (
        <section key={String(showIcon)}>
          <h3 style={sectionTitle}>{`Show icon=${showIcon ? 'True' : 'False'}`}</h3>
          <table style={table}>
            <thead>
              <tr>
                <th style={headCell} />
                {STATUSES.map((s) => (
                  <th key={s} style={headCell}>{`Status=${statusLabel[s]}`}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LAYOUTS.flatMap((l) =>
                STATES.map((st) => (
                  <tr key={`${l}-${st}`} style={l === 'on-image' ? imageBg : undefined}>
                    <th style={{ ...headCell, color: l === 'on-image' ? 'var(--scanner-text-on-color)' : headCell.color }}>
                      {`State=${label(st)}, Layout=${layoutLabel[l]}`}
                    </th>
                    {STATUSES.map((s) => (
                      <td key={s} style={cell}>
                        <Badge {...variantProps(s, st, l, showIcon)} />
                      </td>
                    ))}
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  ),
};

/* ── Overflow: single line, truncated with ellipsis; full text via title/tooltip ── */

const LONG = 'Waiting for lab approval of the treatment plan';

export const TruncatedLabel: Story = {
  render: () => (
    <div style={{ width: 200, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Badge status="warning" title={LONG}>{LONG}</Badge>
      <Badge status="warning" showIcon title={LONG}>{LONG}</Badge>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  Tests                                                             */
/* ------------------------------------------------------------------ */

export const RendersLabel: Story = {
  tags: ['test'],
  args: { status: 'destructive', showIcon: true, children: 'Error' },
  play: async ({ canvasElement }) => {
    const badge = within(canvasElement).getByText('Error').parentElement;
    await expect(badge).toHaveAttribute('data-status', 'destructive');
    await expect(badge?.querySelector('[data-part="icon"] svg')).toBeInTheDocument();
  },
};

export const LoadingIsHidden: Story = {
  tags: ['test'],
  args: { loading: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByText('Badge')).not.toBeInTheDocument();
    await expect(canvasElement.querySelector('[data-skeleton]')).toHaveAttribute('aria-hidden', 'true');
  },
};
