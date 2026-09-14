import type { Meta, StoryObj } from '@storybook/react';
import { TooltipContainer } from './TooltipContainer';

const meta: Meta<typeof TooltipContainer> = {
  title: 'Private/_TooltipContainer',
  component: TooltipContainer,
  argTypes: {
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    children: { control: 'text' },
  },
  parameters: {
    // Extra padding so arrows are visible at the edges
    layout: 'centered',
  },
};
export default meta;

type Story = StoryObj<typeof TooltipContainer>;

/* ---- Default ---- */
export const Default: Story = {
  args: {
    children: 'Text message',
    position: 'top',
  },
};

/* ---- All positions ---- */
export const AllPositions: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ fontSize: 12, marginBottom: 4, opacity: 0.5 }}>position=&quot;top&quot; (arrow points down)</span>
        <TooltipContainer position="top">Tooltip on top</TooltipContainer>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ fontSize: 12, marginBottom: 4, opacity: 0.5 }}>position=&quot;bottom&quot; (arrow points up)</span>
        <TooltipContainer position="bottom">Tooltip on bottom</TooltipContainer>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ fontSize: 12, marginBottom: 4, opacity: 0.5 }}>position=&quot;left&quot; (arrow points right)</span>
        <TooltipContainer position="left">Tooltip on left</TooltipContainer>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ fontSize: 12, marginBottom: 4, opacity: 0.5 }}>position=&quot;right&quot; (arrow points left)</span>
        <TooltipContainer position="right">Tooltip on right</TooltipContainer>
      </div>
    </div>
  ),
};

/* ---- Long text ---- */
export const LongText: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}>
      <TooltipContainer position="top">
        This is a much longer tooltip message that should wrap within the
        320px max-width constraint defined by the design system.
      </TooltipContainer>
      <TooltipContainer position="bottom">
        Superlongwordwithoutspacesthatshouldbreakatthemaxwidthboundary
      </TooltipContainer>
    </div>
  ),
};
