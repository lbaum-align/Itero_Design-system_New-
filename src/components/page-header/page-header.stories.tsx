import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { PageHeader } from './PageHeader';
import type { PageHeaderProps } from './page-header.types';
import { Breadcrumbs } from '../breadcrumbs';
import { TabGroup } from '../tab-group';
import { TabItem } from '../_tab-item/TabItem';
import { Button } from '../button';

/*
 * Figma: "06. Scanner core 1.0.0 full" → Page header (node 34197:1887)
 * Show breadcrumbs × Show tabs (4 variants) × Show subtitle × Show actions — all rendered in `FigmaMatrix`.
 */

/* Story-only args mirroring the Figma boolean properties */
type StoryArgs = Omit<PageHeaderProps, 'breadcrumbs' | 'tabs' | 'actions' | 'subtitle'> & {
  subtitle: string;
  showBreadcrumbs: boolean;
  showTabs: boolean;
  showSubtitle: boolean;
  showActions: boolean;
  onAction: () => void;
};

/* ── Figma sample content ── */

/* Figma: three enabled "Page name" links, Show current page = False */
const FigmaBreadcrumbs = () => (
  <Breadcrumbs
    items={[
      { label: 'Page name', href: '#' },
      { label: 'Page name', href: '#' },
      { label: 'Page name', href: '#' },
    ]}
  />
);

/* Figma: three "Tab item"s, the first selected */
const FigmaTabs = () => (
  <TabGroup aria-label="Page sections">
    <TabItem>Tab item</TabItem>
    <TabItem>Tab item</TabItem>
    <TabItem>Tab item</TabItem>
  </TabGroup>
);

/* Figma: two secondary icon-only buttons ("Add alt" icon) + one primary text button */
const FigmaActions = ({ onAction }: { onAction?: () => void }) => (
  <>
    <Button emphasis="secondary" size="medium" iconName="add" iconOnly aria-label="Add" onClick={onAction} />
    <Button emphasis="secondary" size="medium" iconName="add" iconOnly aria-label="Add another" onClick={onAction} />
    <Button emphasis="primary" size="medium" onClick={onAction}>
      Button text
    </Button>
  </>
);

const renderHeader = ({ showBreadcrumbs, showTabs, showSubtitle, showActions, subtitle, onAction, ...rest }: StoryArgs) => (
  <PageHeader
    {...rest}
    subtitle={showSubtitle ? subtitle : undefined}
    breadcrumbs={showBreadcrumbs ? <FigmaBreadcrumbs /> : undefined}
    tabs={showTabs ? <FigmaTabs /> : undefined}
    actions={showActions ? <FigmaActions onAction={onAction} /> : undefined}
  />
);

const headCell: React.CSSProperties = {
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  margin: '0 0 4px',
};

/* ------------------------------------------------------------------ */

const meta: Meta<StoryArgs> = {
  title: 'Components/PageHeader',
  component: PageHeader as unknown as React.ComponentType<StoryArgs>,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Top of a page: optional breadcrumbs, the page title (h1) with optional subtitle and actions, ' +
          'and optional tabs sitting on the dashed divider. Pass `Breadcrumbs`, `TabGroup` and `Button` instances to the slots.',
      },
    },
  },
  argTypes: {
    title: { name: 'Title', control: 'text' },
    subtitle: { name: 'Subtitle', control: 'text' },
    showBreadcrumbs: { name: 'Show breadcrumbs', control: 'boolean' },
    showTabs: { name: 'Show tabs', control: 'boolean' },
    showSubtitle: { name: 'Show subtitle', control: 'boolean' },
    showActions: { name: 'Show actions', control: 'boolean' },
    onAction: { table: { disable: true } },
  },
  args: {
    title: 'Title',
    subtitle: 'Subtitle',
    showBreadcrumbs: false,
    showTabs: false,
    showSubtitle: false,
    showActions: false,
    onAction: fn(),
  },
  render: renderHeader,
};
export default meta;

type Story = StoryObj<StoryArgs>;

/* ── Default ── */

export const Default: Story = {};

/* ── Per Figma variant (Show breadcrumbs × Show tabs) ── */

export const NoBreadcrumbsNoTabs: Story = { name: 'Show breadcrumbs=False, Show tabs=False' };
export const NoBreadcrumbsTabs: Story = { name: 'Show breadcrumbs=False, Show tabs=True', args: { showTabs: true } };
export const BreadcrumbsNoTabs: Story = { name: 'Show breadcrumbs=True, Show tabs=False', args: { showBreadcrumbs: true } };
export const BreadcrumbsTabs: Story = {
  name: 'Show breadcrumbs=True, Show tabs=True',
  args: { showBreadcrumbs: true, showTabs: true },
};

/* ── Boolean properties ── */

export const WithSubtitle: Story = { name: 'Show subtitle', args: { showSubtitle: true } };
export const WithActions: Story = { name: 'Show actions', args: { showActions: true } };
export const AllFeatures: Story = {
  args: { showBreadcrumbs: true, showTabs: true, showSubtitle: true, showActions: true },
};

/* ── Full Figma matrix: 4 variants × (subtitle + actions off / on) ── */

const BOOLS = [false, true];
const tf = (b: boolean) => (b ? 'True' : 'False');

export const FigmaMatrix: Story = {
  name: 'Figma matrix (4 variants × subtitle/actions)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
      {BOOLS.map((bc) =>
        BOOLS.map((tabs) =>
          BOOLS.map((extras) => (
            <section key={`${bc}-${tabs}-${extras}`}>
              <p style={headCell}>
                {`Show breadcrumbs=${tf(bc)}, Show tabs=${tf(tabs)} · Show subtitle=${tf(extras)}, Show actions=${tf(extras)}`}
              </p>
              {renderHeader({
                title: 'Title',
                subtitle: 'Subtitle',
                showBreadcrumbs: bc,
                showTabs: tabs,
                showSubtitle: extras,
                showActions: extras,
                onAction: () => {},
              })}
            </section>
          )),
        ),
      )}
    </div>
  ),
};

/* ── Edge cases ── */

export const LongTitleWraps: Story = {
  args: {
    title: 'Treatment plan review for the upper and lower arches with attachments and interproximal reduction',
    subtitle: 'Long titles wrap; the actions stay top-aligned on the right.',
    showSubtitle: true,
    showActions: true,
    showBreadcrumbs: true,
  },
  decorators: [(Story) => <div style={{ maxWidth: 720 }}><Story /></div>],
};

export const DarkTheme: Story = {
  args: { showBreadcrumbs: true, showTabs: true, showSubtitle: true, showActions: true },
  globals: { theme: 'dark' },
};

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

export const Landmarks: Story = {
  tags: ['test'],
  args: { showBreadcrumbs: true, showTabs: true, showSubtitle: true, showActions: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Title' })).toBeInTheDocument();
    await expect(canvas.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    await expect(canvas.getByRole('tablist', { name: 'Page sections' })).toBeInTheDocument();
    await expect(canvas.getByText('Subtitle')).toBeInTheDocument();
  },
};

export const KeyboardThroughSlots: Story = {
  tags: ['test'],
  args: { showBreadcrumbs: true, showTabs: true, showActions: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const links = canvas.getAllByRole('link');
    await userEvent.tab();
    await expect(links[0]).toHaveFocus();
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Add' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onAction).toHaveBeenCalledTimes(1);
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs[0]).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[1]).toHaveFocus();
    await expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
  },
};
