import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  argTypes: {
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    content: { control: 'text' },
    delay: { control: 'number' },
  },
  parameters: {
    layout: 'centered',
  },
  // Give enough padding for tooltips to render in all directions
  decorators: [
    (Story) => (
      <div style={{ padding: 120 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Tooltip>;

/* ---- Default ---- */
export const Default: Story = {
  args: {
    content: 'Text message',
    position: 'top',
    children: (
      <button
        type="button"
        style={{
          padding: '8px 16px',
          border: '1px solid #ccc',
          borderRadius: 4,
          cursor: 'pointer',
          background: 'white',
        }}
      >
        Hover me
      </button>
    ),
  },
};

/* ---- All Positions ---- */
export const AllPositions: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, padding: 60 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 12, opacity: 0.5 }}>position=&quot;top&quot;</span>
        <Tooltip content="Tooltip on top" position="top">
          <button
            type="button"
            style={{
              padding: '8px 16px',
              border: '1px solid #ccc',
              borderRadius: 4,
              cursor: 'pointer',
              background: 'white',
            }}
          >
            Top
          </button>
        </Tooltip>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 12, opacity: 0.5 }}>position=&quot;bottom&quot;</span>
        <Tooltip content="Tooltip on bottom" position="bottom">
          <button
            type="button"
            style={{
              padding: '8px 16px',
              border: '1px solid #ccc',
              borderRadius: 4,
              cursor: 'pointer',
              background: 'white',
            }}
          >
            Bottom
          </button>
        </Tooltip>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 12, opacity: 0.5 }}>position=&quot;left&quot;</span>
        <Tooltip content="Tooltip on left" position="left">
          <button
            type="button"
            style={{
              padding: '8px 16px',
              border: '1px solid #ccc',
              borderRadius: 4,
              cursor: 'pointer',
              background: 'white',
            }}
          >
            Left
          </button>
        </Tooltip>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 12, opacity: 0.5 }}>position=&quot;right&quot;</span>
        <Tooltip content="Tooltip on right" position="right">
          <button
            type="button"
            style={{
              padding: '8px 16px',
              border: '1px solid #ccc',
              borderRadius: 4,
              cursor: 'pointer',
              background: 'white',
            }}
          >
            Right
          </button>
        </Tooltip>
      </div>
    </div>
  ),
};

/* ---- With Delay ---- */
export const WithDelay: Story = {
  args: {
    content: 'Appeared after 500ms',
    position: 'top',
    delay: 500,
    children: (
      <button
        type="button"
        style={{
          padding: '8px 16px',
          border: '1px solid #ccc',
          borderRadius: 4,
          cursor: 'pointer',
          background: 'white',
        }}
      >
        Hover me (500ms delay)
      </button>
    ),
  },
};

/* ---- Long Content ---- */
export const LongContent: Story = {
  args: {
    content:
      'This is a much longer tooltip message that should wrap within the 320px max-width constraint defined by the design system.',
    position: 'bottom',
    children: (
      <button
        type="button"
        style={{
          padding: '8px 16px',
          border: '1px solid #ccc',
          borderRadius: 4,
          cursor: 'pointer',
          background: 'white',
        }}
      >
        Long tooltip
      </button>
    ),
  },
};
