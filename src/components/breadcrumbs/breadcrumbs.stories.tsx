import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumbs } from './Breadcrumbs';

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
};
export default meta;

type Story = StoryObj<typeof Breadcrumbs>;

export const Default: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Widget' },
    ],
  },
};

export const TwoLevels: Story = {
  args: {
    items: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Settings' },
    ],
  },
};

export const ManyLevels: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Category', href: '/category' },
      { label: 'Sub-category', href: '/category/sub' },
      { label: 'Product', href: '/category/sub/product' },
      { label: 'Details' },
    ],
  },
};

export const SingleItem: Story = {
  args: {
    items: [{ label: 'Home' }],
  },
};

export const AllLinks: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Settings', href: '/settings' },
      { label: 'Profile', href: '/settings/profile' },
      { label: 'Edit' },
    ],
  },
};
