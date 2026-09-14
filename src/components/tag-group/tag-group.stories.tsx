import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { TagGroup } from './TagGroup';
import { Tag } from '../tag';

const meta: Meta<typeof TagGroup> = {
  title: 'Components/TagGroup',
  component: TagGroup,
  argTypes: {
    size: {
      control: 'select',
      options: ['large', 'medium', 'small', 'extra-small'],
    },
  },
};
export default meta;

type Story = StoryObj<typeof TagGroup>;

export const Default: Story = {
  render: (args) => (
    <TagGroup {...args} size={args.size ?? 'medium'}>
      <Tag size={args.size ?? 'medium'} onDismiss={fn()}>React</Tag>
      <Tag size={args.size ?? 'medium'} onDismiss={fn()}>TypeScript</Tag>
      <Tag size={args.size ?? 'medium'} onDismiss={fn()}>Tailwind</Tag>
      <Tag size={args.size ?? 'medium'} onDismiss={fn()}>Storybook</Tag>
    </TagGroup>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <p style={{ marginBottom: 8, fontWeight: 600 }}>Large</p>
        <TagGroup size="large">
          <Tag size="large" onDismiss={() => {}}>React</Tag>
          <Tag size="large" onDismiss={() => {}}>TypeScript</Tag>
          <Tag size="large" onDismiss={() => {}}>Tailwind</Tag>
          <Tag size="large" onDismiss={() => {}}>Storybook</Tag>
        </TagGroup>
      </div>
      <div>
        <p style={{ marginBottom: 8, fontWeight: 600 }}>Medium</p>
        <TagGroup size="medium">
          <Tag size="medium" onDismiss={() => {}}>React</Tag>
          <Tag size="medium" onDismiss={() => {}}>TypeScript</Tag>
          <Tag size="medium" onDismiss={() => {}}>Tailwind</Tag>
          <Tag size="medium" onDismiss={() => {}}>Storybook</Tag>
        </TagGroup>
      </div>
      <div>
        <p style={{ marginBottom: 8, fontWeight: 600 }}>Small</p>
        <TagGroup size="small">
          <Tag size="small" onDismiss={() => {}}>React</Tag>
          <Tag size="small" onDismiss={() => {}}>TypeScript</Tag>
          <Tag size="small" onDismiss={() => {}}>Tailwind</Tag>
          <Tag size="small" onDismiss={() => {}}>Storybook</Tag>
        </TagGroup>
      </div>
      <div>
        <p style={{ marginBottom: 8, fontWeight: 600 }}>Extra Small</p>
        <TagGroup size="extra-small">
          <Tag size="extra-small" onDismiss={() => {}}>React</Tag>
          <Tag size="extra-small" onDismiss={() => {}}>TypeScript</Tag>
          <Tag size="extra-small" onDismiss={() => {}}>Tailwind</Tag>
          <Tag size="extra-small" onDismiss={() => {}}>Storybook</Tag>
        </TagGroup>
      </div>
    </div>
  ),
};

export const Wrapping: Story = {
  render: () => (
    <div style={{ maxWidth: 400 }}>
      <TagGroup size="medium">
        <Tag size="medium" onDismiss={() => {}}>JavaScript</Tag>
        <Tag size="medium" onDismiss={() => {}}>TypeScript</Tag>
        <Tag size="medium" onDismiss={() => {}}>React</Tag>
        <Tag size="medium" onDismiss={() => {}}>Vue</Tag>
        <Tag size="medium" onDismiss={() => {}}>Angular</Tag>
        <Tag size="medium" onDismiss={() => {}}>Svelte</Tag>
        <Tag size="medium" onDismiss={() => {}}>Next.js</Tag>
        <Tag size="medium" onDismiss={() => {}}>Remix</Tag>
      </TagGroup>
    </div>
  ),
};

export const WithoutDismiss: Story = {
  render: () => (
    <TagGroup size="medium">
      <Tag size="medium">Read only</Tag>
      <Tag size="medium">No dismiss</Tag>
      <Tag size="medium">Static tags</Tag>
    </TagGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <TagGroup size="medium">
      <Tag size="medium" disabled onDismiss={() => {}}>React</Tag>
      <Tag size="medium" disabled onDismiss={() => {}}>TypeScript</Tag>
      <Tag size="medium" disabled onDismiss={() => {}}>Tailwind</Tag>
    </TagGroup>
  ),
};
