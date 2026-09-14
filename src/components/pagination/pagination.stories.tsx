import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Pagination } from './Pagination';
import type { PaginationSize } from './pagination.types';

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: fn(),
    size: 'x-large',
  },
  argTypes: {
    currentPage: { control: { type: 'number', min: 1 } },
    totalPages: { control: { type: 'number', min: 1 } },
    size: {
      control: 'select',
      options: ['x-large', 'large', 'medium', 'small'] satisfies PaginationSize[],
    },
    disabled: { control: 'boolean' },
    skeleton: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof Pagination>;

/* ------------------------------------------------------------------ */
/*  Default (interactive)                                              */
/* ------------------------------------------------------------------ */

export const Default: Story = {
  render: function Interactive(args) {
    const [page, setPage] = useState(args.currentPage ?? 1);
    return (
      <Pagination
        {...args}
        currentPage={page}
        onPageChange={(p) => {
          setPage(p);
          args.onPageChange?.(p);
        }}
      />
    );
  },
};

/* ------------------------------------------------------------------ */
/*  Few pages (5 or fewer — no ellipsis)                               */
/* ------------------------------------------------------------------ */

export const FewPages: Story = {
  args: { totalPages: 5, currentPage: 3 },
  render: function Interactive(args) {
    const [page, setPage] = useState(args.currentPage ?? 1);
    return (
      <Pagination
        {...args}
        currentPage={page}
        onPageChange={(p) => {
          setPage(p);
          args.onPageChange?.(p);
        }}
      />
    );
  },
};

/* ------------------------------------------------------------------ */
/*  Many pages (with ellipsis)                                         */
/* ------------------------------------------------------------------ */

export const ManyPages: Story = {
  args: { totalPages: 50, currentPage: 1 },
  render: function Interactive(args) {
    const [page, setPage] = useState(args.currentPage ?? 1);
    return (
      <Pagination
        {...args}
        currentPage={page}
        onPageChange={(p) => {
          setPage(p);
          args.onPageChange?.(p);
        }}
      />
    );
  },
};

/* ------------------------------------------------------------------ */
/*  First page selected                                                */
/* ------------------------------------------------------------------ */

export const FirstPageSelected: Story = {
  args: { totalPages: 10, currentPage: 1 },
};

/* ------------------------------------------------------------------ */
/*  Last page selected                                                 */
/* ------------------------------------------------------------------ */

export const LastPageSelected: Story = {
  args: { totalPages: 10, currentPage: 10 },
};

/* ------------------------------------------------------------------ */
/*  Middle page selected                                               */
/* ------------------------------------------------------------------ */

export const MiddlePageSelected: Story = {
  args: { totalPages: 10, currentPage: 5 },
};

/* ------------------------------------------------------------------ */
/*  All sizes side by side                                             */
/* ------------------------------------------------------------------ */

const sizes: PaginationSize[] = ['x-large', 'large', 'medium', 'small'];

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {sizes.map((s) => (
        <div key={s}>
          <p style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>{s}</p>
          <Pagination currentPage={1} totalPages={10} size={s} />
        </div>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  Disabled state                                                     */
/* ------------------------------------------------------------------ */

export const Disabled: Story = {
  args: { currentPage: 3, totalPages: 10, disabled: true },
};

/* ------------------------------------------------------------------ */
/*  Skeleton state                                                     */
/* ------------------------------------------------------------------ */

export const Skeleton: Story = {
  args: { currentPage: 1, totalPages: 10, skeleton: true },
};

/* ------------------------------------------------------------------ */
/*  Page positions (visual matrix)                                     */
/* ------------------------------------------------------------------ */

export const PagePositions: Story = {
  name: 'Page position variants',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <p style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
          First page (prev disabled)
        </p>
        <Pagination currentPage={1} totalPages={10} size="medium" />
      </div>
      <div>
        <p style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
          Near start (page 3)
        </p>
        <Pagination currentPage={3} totalPages={10} size="medium" />
      </div>
      <div>
        <p style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
          Middle (page 5) — dual ellipsis
        </p>
        <Pagination currentPage={5} totalPages={10} size="medium" />
      </div>
      <div>
        <p style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
          Near end (page 8)
        </p>
        <Pagination currentPage={8} totalPages={10} size="medium" />
      </div>
      <div>
        <p style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
          Last page (next disabled)
        </p>
        <Pagination currentPage={10} totalPages={10} size="medium" />
      </div>
    </div>
  ),
};
