import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { TabGroup } from './TabGroup';
import { TabItem } from '../_tab-item/TabItem';

const meta: Meta<typeof TabGroup> = {
  title: 'Components/TabGroup',
  component: TabGroup,
  argTypes: {
    activeIndex: { control: 'number' },
  },
  args: {
    onChange: fn(),
  },
};
export default meta;

type Story = StoryObj<typeof TabGroup>;

export const Default: Story = {
  args: {
    activeIndex: 0,
  },
  render: (args) => (
    <TabGroup {...args}>
      <TabItem>Dashboard</TabItem>
      <TabItem>Settings</TabItem>
      <TabItem>Billing</TabItem>
    </TabGroup>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [active, setActive] = useState(0);
    return (
      <TabGroup activeIndex={active} onChange={setActive}>
        <TabItem>Dashboard</TabItem>
        <TabItem>Settings</TabItem>
        <TabItem>Billing</TabItem>
        <TabItem>Team</TabItem>
      </TabGroup>
    );
  },
};

export const WithDisabledTab: Story = {
  render: () => {
    const [active, setActive] = useState(0);
    return (
      <TabGroup activeIndex={active} onChange={setActive}>
        <TabItem>Dashboard</TabItem>
        <TabItem>Settings</TabItem>
        <TabItem disabled>Billing</TabItem>
      </TabGroup>
    );
  },
};

export const ManyTabs: Story = {
  render: () => {
    const [active, setActive] = useState(0);
    return (
      <TabGroup activeIndex={active} onChange={setActive}>
        <TabItem>Overview</TabItem>
        <TabItem>Analytics</TabItem>
        <TabItem>Reports</TabItem>
        <TabItem>Notifications</TabItem>
        <TabItem>Settings</TabItem>
      </TabGroup>
    );
  },
};

export const SingleTab: Story = {
  args: {
    activeIndex: 0,
  },
  render: (args) => (
    <TabGroup {...args}>
      <TabItem>Only Tab</TabItem>
    </TabGroup>
  ),
};
