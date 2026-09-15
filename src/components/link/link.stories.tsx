import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Link } from './Link';
import type { LinkProps, LinkSize, LinkType } from './link.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → Link (node 36407:17744)
 * Type × State × Size (+ External) — every combination is rendered in `FigmaMatrix`.
 */

const TYPES: LinkType[] = ['primary', 'secondary', 'inversed', 'on-color'];
const SIZES: LinkSize[] = ['medium', 'small'];
const STATES = ['enabled', 'hovered', 'focused', 'disabled'] as const;
type State = (typeof STATES)[number];

const label = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ');

/** Props for one Figma variant. */
function variantProps(type: LinkType, state: State, size: LinkSize, external = false): LinkProps {
  return {
    type,
    size,
    external,
    href: '#',
    disabled: state === 'disabled',
    'data-state': state === 'hovered' || state === 'focused' ? state : undefined,
    children: 'Link',
  };
}

/* ── Layout helpers (story-only) ── */

/** Figma: Inversed sits on background-inverse, On color on brand colours. */
const surface: Record<LinkType, React.CSSProperties> = {
  primary: {},
  secondary: {},
  inversed: { background: 'var(--scanner-bg-inverse)' },
  'on-color': { background: 'var(--scanner-bg-brand)' },
};
const rowLabelColor: Record<LinkType, string> = {
  primary: 'var(--scanner-text-secondary)',
  secondary: 'var(--scanner-text-secondary)',
  inversed: 'var(--scanner-text-inverse)',
  'on-color': 'var(--scanner-text-on-color)',
};

const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const cell: React.CSSProperties = { padding: '12px 16px', verticalAlign: 'middle' };
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

/* ------------------------------------------------------------------ */

const meta: Meta<typeof Link> = {
  title: 'Components/Link',
  component: Link,
  parameters: {
    docs: {
      description: {
        component:
          'Navigates to other pages, sections or external resources — use `Button` for actions. ' +
          'Inversed is for `background-inverse` only; On color for brand colours and dark images. ' +
          'Keyboard: Tab to focus, Enter or Space to open.',
      },
    },
  },
  argTypes: {
    type: { name: 'Type', control: 'inline-radio', options: TYPES },
    size: { name: 'Size', control: 'inline-radio', options: SIZES },
    external: { name: 'External', control: 'boolean' },
    disabled: { control: 'boolean' },
    'data-state': { name: 'Forced state', control: 'inline-radio', options: [undefined, 'hovered', 'focused'] },
    children: { name: 'Text value', control: 'text' },
  },
  args: { type: 'primary', size: 'medium', external: false, href: '#', children: 'Link', onClick: fn() },
  decorators: [
    (Story, ctx) => (
      <div style={{ padding: 16, display: 'inline-block', ...surface[(ctx.args.type as LinkType) ?? 'primary'] }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Link>;

/* ── Default ── */

export const Default: Story = {};

/* ── Per type (Figma "Type") ── */

export const Primary: Story = { name: 'Type: Primary' };
export const Secondary: Story = { name: 'Type: Secondary', args: { type: 'secondary' } };
export const Inversed: Story = { name: 'Type: Inversed', args: { type: 'inversed' } };
export const OnColor: Story = { name: 'Type: On color', args: { type: 'on-color' } };

/* ── External (Figma "External") ── */

export const External: Story = {
  args: { external: true, href: 'https://example.com', children: 'Documentation' },
};

/* ── All sizes ── */

export const AllSizes: Story = {
  render: () => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          <th style={headCell}>External: False</th>
          <th style={headCell}>External: True</th>
        </tr>
      </thead>
      <tbody>
        {SIZES.map((s) => (
          <tr key={s}>
            <th style={headCell}>{label(s)}</th>
            <td style={cell}><Link {...variantProps('primary', 'enabled', s)} /></td>
            <td style={cell}><Link {...variantProps('primary', 'enabled', s, true)} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── All states — type rows × state columns ── */

export const AllStates: Story = {
  args: { external: true },
  render: ({ size = 'medium', external = false }) => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          {STATES.map((st) => (
            <th key={st} style={headCell}>{label(st)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {TYPES.map((t) => (
          <tr key={t} style={surface[t]}>
            <th style={{ ...headCell, color: rowLabelColor[t] }}>{label(t)}</th>
            {STATES.map((st) => (
              <td key={st} style={cell}>
                <Link {...variantProps(t, st, size, external)} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Individual states ── */

const StateRow = ({ state }: { state: State }) => (
  <div style={{ display: 'flex' }}>
    {TYPES.map((t) => (
      <div key={t} style={{ padding: 16, ...surface[t] }}>
        <Link {...variantProps(t, state, 'medium', true)} />
      </div>
    ))}
  </div>
);

export const Hovered: Story = { render: () => <StateRow state="hovered" /> };
export const Focused: Story = { render: () => <StateRow state="focused" /> };
export const Disabled: Story = { render: () => <StateRow state="disabled" /> };

/* ── Full Figma matrix: 32 variants × External ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 32 variants)',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div style={{ padding: 24 }}>
      {[false, true].map((external) => (
        <section key={String(external)}>
          <h3 style={sectionTitle}>{`External=${external ? 'True' : 'False'}`}</h3>
          <table style={table}>
            <thead>
              <tr>
                <th style={headCell} />
                {SIZES.flatMap((s) =>
                  STATES.map((st) => (
                    <th key={`${s}-${st}`} style={headCell}>{`Size=${label(s)}, State=${label(st)}`}</th>
                  )),
                )}
              </tr>
            </thead>
            <tbody>
              {TYPES.map((t) => (
                <tr key={t} style={surface[t]}>
                  <th style={{ ...headCell, color: rowLabelColor[t] }}>{`Type=${label(t)}`}</th>
                  {SIZES.flatMap((s) =>
                    STATES.map((st) => (
                      <td key={`${s}-${st}`} style={cell}>
                        <Link {...variantProps(t, st, s, external)} />
                      </td>
                    )),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  ),
};

/* ── Inline in body copy ── */

export const InlineInText: Story = {
  render: () => (
    <p
      style={{
        maxWidth: 420,
        margin: 0,
        font: '400 var(--scanner-text-scanner-md)/var(--scanner-leading-lg) var(--scanner-font-sans)',
        color: 'var(--scanner-text-primary)',
      }}
    >
      Scans are stored for 30 days. Read the <Link href="#">retention policy</Link> or open the{' '}
      <Link href="https://example.com" external>
        support portal
      </Link>
      .
    </p>
  ),
};

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

export const ClickNavigates: Story = {
  tags: ['test'],
  play: async ({ args, canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: 'Link' });
    await userEvent.click(link);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const KeyboardActivation: Story = {
  tags: ['test'],
  play: async ({ args, canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: 'Link' });
    await userEvent.tab();
    await expect(link).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
};

export const DisabledIgnoresClick: Story = {
  tags: ['test'],
  args: { disabled: true },
  play: async ({ args, canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: 'Link' });
    await expect(link).toHaveAttribute('aria-disabled', 'true');
    await expect(link).not.toHaveAttribute('href');
    await userEvent.click(link, { pointerEventsCheck: 0 });
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const ExternalOpensNewTab: Story = {
  tags: ['test'],
  args: { external: true, href: 'https://example.com', onClick: fn((e: React.MouseEvent) => e.preventDefault()) },
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: /opens in a new tab/ });
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  },
};
