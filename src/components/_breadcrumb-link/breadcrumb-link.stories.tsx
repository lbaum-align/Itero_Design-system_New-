import type { Meta, StoryObj } from '@storybook/react';
import { BreadcrumbLink } from './BreadcrumbLink';

const meta = {
  title: 'Private/_BreadcrumbLink',
  component: BreadcrumbLink,
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text' },
    href: { control: 'text' },
    isCurrent: { control: 'boolean' },
    disabled: { control: 'boolean' },
    skeleton: { control: 'boolean' },
    showSeparator: { control: 'boolean' },
  },
  args: {
    children: 'Page name',
    href: '#',
    showSeparator: true,
  },
} satisfies Meta<typeof BreadcrumbLink>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default enabled state with separator */
export const Default: Story = {};

/** Current page — rendered as text, not a link */
export const Current: Story = {
  args: {
    isCurrent: true,
    children: 'Current page',
  },
};

/** Disabled state — not interactive */
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled link',
  },
};

/** Skeleton loading placeholder */
export const Skeleton: Story = {
  args: {
    skeleton: true,
  },
};

/** All states side by side for visual comparison */
export const AllStates: Story = {
  name: 'All States',
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="w-20 text-xs text-gray-500">Enabled</span>
        <BreadcrumbLink href="#">Page name</BreadcrumbLink>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-20 text-xs text-gray-500">Hovered</span>
        <BreadcrumbLink href="#" data-state="hovered">
          Page name
        </BreadcrumbLink>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-20 text-xs text-gray-500">Focused</span>
        <BreadcrumbLink href="#" data-state="focused">
          Page name
        </BreadcrumbLink>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-20 text-xs text-gray-500">Disabled</span>
        <BreadcrumbLink href="#" disabled>
          Page name
        </BreadcrumbLink>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-20 text-xs text-gray-500">Current</span>
        <BreadcrumbLink isCurrent>Page name</BreadcrumbLink>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-20 text-xs text-gray-500">Skeleton</span>
        <BreadcrumbLink skeleton>Page name</BreadcrumbLink>
      </div>
    </div>
  ),
};

/** Full breadcrumb trail showing multiple items together */
export const BreadcrumbTrail: Story = {
  name: 'Breadcrumb Trail',
  render: () => (
    <nav aria-label="Breadcrumb">
      <ol className="m-0 flex list-none items-center p-0">
        <li>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </li>
        <li>
          <BreadcrumbLink href="#">Products</BreadcrumbLink>
        </li>
        <li>
          <BreadcrumbLink href="#">Category</BreadcrumbLink>
        </li>
        <li>
          <BreadcrumbLink isCurrent showSeparator={false}>
            Current page
          </BreadcrumbLink>
        </li>
      </ol>
    </nav>
  ),
};

/** Breadcrumb trail in skeleton state */
export const BreadcrumbTrailSkeleton: Story = {
  name: 'Breadcrumb Trail (Skeleton)',
  render: () => (
    <nav aria-label="Breadcrumb">
      <ol className="m-0 flex list-none items-center p-0">
        <li>
          <BreadcrumbLink skeleton />
        </li>
        <li>
          <BreadcrumbLink skeleton />
        </li>
        <li>
          <BreadcrumbLink skeleton showSeparator={false} />
        </li>
      </ol>
    </nav>
  ),
};
