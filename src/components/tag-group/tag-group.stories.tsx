import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { TagGroup } from './TagGroup';
import { Tag } from '../tag';
import type { TagGroupSize } from './tag-group.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → 02 Tag group (node 33521:164887)
 * Size: Large, Medium, Small, Extra small — all rendered in `FigmaMatrix`.
 */

const SIZES: TagGroupSize[] = ['large', 'medium', 'small', 'extra-small'];
const sizeLabel: Record<TagGroupSize, string> = {
  large: 'Large',
  medium: 'Medium',
  small: 'Small',
  'extra-small': 'Extra small',
};

const sectionTitle: React.CSSProperties = {
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  margin: '0 0 8px',
};

const meta: Meta<typeof TagGroup> = {
  title: 'Components/TagGroup',
  component: TagGroup,
  parameters: {
    docs: {
      description: {
        component:
          'Wrapping row of Tags. Gap is 8px (Large/Medium/Small) or 4px (Extra small); tags without their own size inherit the group size.',
      },
    },
  },
  argTypes: {
    size: { name: 'Size', control: 'inline-radio', options: SIZES },
  },
  args: { size: 'large' },
  decorators: [
    (Story) => (
      <div style={{ padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof TagGroup>;

const FourTags = () => (
  <>
    {[1, 2, 3, 4].map((i) => (
      <Tag key={i} onDismiss={() => {}}>
        Tag label
      </Tag>
    ))}
  </>
);

/* ── Default ── */

export const Default: Story = {
  render: (args) => (
    <TagGroup {...args} aria-label="Selected items">
      <FourTags />
    </TagGroup>
  ),
};

/* ── Per size (Figma "Size") ── */

export const Large: Story = { args: { size: 'large' }, render: Default.render };
export const Medium: Story = { args: { size: 'medium' }, render: Default.render };
export const Small: Story = { args: { size: 'small' }, render: Default.render };
export const ExtraSmall: Story = { name: 'Extra small', args: { size: 'extra-small' }, render: Default.render };

/* ── All sizes / Figma matrix — the Figma set wraps at a fixed width ── */

const Matrix = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
    {SIZES.map((s) => (
      <section key={s}>
        <h3 style={sectionTitle}>{`Size=${sizeLabel[s]}`}</h3>
        <TagGroup size={s} style={{ width: 460 }}>
          {Array.from({ length: 6 }, (_, i) => (
            <Tag key={i} onDismiss={() => {}}>
              Tag label
            </Tag>
          ))}
        </TagGroup>
      </section>
    ))}
  </div>
);

export const AllSizes: Story = { render: () => <Matrix /> };

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 4 variants)',
  render: () => <Matrix />,
};

/* ── States of contained tags ── */

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {SIZES.map((s) => (
        <TagGroup key={s} size={s}>
          <Tag onDismiss={() => {}}>Enabled</Tag>
          <Tag onDismiss={() => {}} data-state="focused">Focused</Tag>
          <Tag onDismiss={() => {}} disabled>Disabled</Tag>
          <Tag skeleton>Skeleton</Tag>
        </TagGroup>
      ))}
    </div>
  ),
};

/* ── Wrapping ── */

export const Wrapping: Story = {
  render: () => (
    <TagGroup size="medium" style={{ maxWidth: 400 }}>
      {['Upper jaw', 'Lower jaw', 'Bite', 'Preparation', 'Margin line', 'Pre-treatment', 'Scan body', 'Implant'].map(
        (t) => (
          <Tag key={t} onDismiss={() => {}}>
            {t}
          </Tag>
        ),
      )}
    </TagGroup>
  ),
};

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

const DismissibleGroup = () => {
  const [tags, setTags] = useState(['Upper jaw', 'Lower jaw', 'Bite']);
  return (
    <TagGroup size="medium" aria-label="Selected scans">
      {tags.map((t) => (
        <Tag key={t} onDismiss={() => setTags((all) => all.filter((x) => x !== t))}>
          {t}
        </Tag>
      ))}
    </TagGroup>
  );
};

export const RemoveTags: Story = {
  tags: ['test'],
  render: () => <DismissibleGroup />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Remove Upper jaw' }));
    await expect(canvas.queryByText('Upper jaw')).not.toBeInTheDocument();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Remove Lower jaw' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.queryByText('Lower jaw')).not.toBeInTheDocument();
    await expect(canvas.getAllByRole('button')).toHaveLength(1);
  },
};
