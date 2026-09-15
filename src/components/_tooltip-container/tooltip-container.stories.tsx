import type { Meta, StoryObj } from '@storybook/react';
import { TooltipContainer } from './TooltipContainer';

/*
 * Figma: "06. Scanner core 1.0.0 full" → _Tooltip container (node 24150:41017)
 * One variant (Text value). Private — composed by 01 Tooltip; the caret is not part of it.
 */

const meta: Meta<typeof TooltipContainer> = {
  title: 'Private/_TooltipContainer',
  component: TooltipContainer,
  parameters: {
    docs: {
      description: {
        component:
          'Private bubble used by Tooltip: background-inverse, 8px padding, radius 8, Body 01 text-inverse. Hugs content from 44px to 320px and wraps.',
      },
    },
  },
  argTypes: {
    children: { name: 'Text value', control: 'text' },
  },
  args: { children: 'Text message' },
  decorators: [
    (Story) => (
      <div style={{ padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof TooltipContainer>;

/* ── Default (Figma variant) ── */
export const Default: Story = {};

/* ── Figma matrix: the single variant ── */
export const FigmaMatrix: Story = {
  name: 'Figma matrix (1 variant)',
  render: () => <TooltipContainer>Text message</TooltipContainer>,
};

/* ── Width limits: 44px minimum, 320px maximum ── */
export const AllStates: Story = {
  name: 'AllStates (min width, default, wraps at max width, long word)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
      <TooltipContainer>OK</TooltipContainer>
      <TooltipContainer>Text message</TooltipContainer>
      <TooltipContainer>
        Try to keep the content short, ideally one or two sentences. Tooltips are meant for brief explanations or
        clarifications.
      </TooltipContainer>
      <TooltipContainer>Superlongwordwithoutanyspacesthatmustbreakatthemaximumwidthboundary</TooltipContainer>
    </div>
  ),
};
