import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../button';
import { ModalWindow } from './ModalWindow';
import type { ModalWindowProps, ModalWindowSize } from './modal-window.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → Modal window (node 13483:13690)
 * Size × Show description / Show slot content / Show actions / Secondary action / Tertiary action / Closable.
 * `FigmaMatrix` and `AllStates` render the window inline (on an overlay-coloured frame) so every variant is visible at once.
 */

const SIZES: ModalWindowSize[] = ['small', 'medium', 'large', 'x-large'];
const sizeLabel: Record<ModalWindowSize, string> = { small: 'Small', medium: 'Medium', large: 'Large', 'x-large': 'X-large' };
const FIGMA_DESCRIPTION =
  'A dialog is a type of mode window that appears in front app content to provide critical information or ask for a decision.';

/* ── Layout helpers (story-only) ── */

const headCell: React.CSSProperties = {
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  margin: '0 0 8px',
  whiteSpace: 'nowrap',
};
/* Stand-in for the Figma overlay frame around each variant */
const overlayFrame: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 'max-content',
  boxSizing: 'border-box',
  padding: 'var(--scanner-modal-window-spacing)',
  background: 'var(--scanner-bg-overlay)',
};
/* Figma "Slot content" placeholder */
const SlotPlaceholder = () => (
  <div
    style={{
      boxSizing: 'border-box',
      padding: 'var(--scanner-spacing-5)',
      border: '1px dashed var(--scanner-border-interactive)',
      borderRadius: 'var(--scanner-radius-md)',
      color: 'var(--scanner-text-link)',
      font: '400 var(--scanner-text-sm)/var(--scanner-leading-sm) var(--scanner-font-sans)',
    }}
  >
    Swap me to any component
  </div>
);

/* ------------------------------------------------------------------ */

const meta: Meta<typeof ModalWindow> = {
  title: 'Components/ModalWindow',
  component: ModalWindow,
  parameters: {
    docs: {
      description: {
        component:
          'Modal dialog for critical actions or information that needs a response before continuing. ' +
          'Triggered by a user action (button, link, icon) — never system generated. Native `<dialog>` with overlay; ' +
          'focus is trapped, Escape closes when closable, focus returns to the opener. ' +
          'Small/Medium for short confirmations, Large/X-large for forms or rich content.',
      },
    },
  },
  argTypes: {
    size: { name: 'Size', control: 'inline-radio', options: SIZES },
    title: { name: 'Title text', control: 'text' },
    description: { name: 'Description text value', control: 'text' },
    showDescription: { name: 'Show description', control: 'boolean' },
    showSlotContent: { name: 'Show slot content', control: 'boolean' },
    showActions: { name: 'Show actions', control: 'boolean' },
    secondaryAction: { name: 'Secondary action', control: 'boolean' },
    tertiaryAction: { name: 'Tertiary action', control: 'boolean' },
    closable: { name: 'Closable', control: 'boolean' },
    closeOnOverlayClick: { control: 'boolean' },
    primaryActionText: { control: 'text' },
    secondaryActionText: { control: 'text' },
    tertiaryActionText: { control: 'text' },
    closeLabel: { control: 'text' },
    open: { control: false },
    inline: { control: false },
    initialFocusRef: { control: false },
    actions: { control: false },
    children: { control: false },
  },
  args: {
    size: 'small',
    title: 'Title',
    description: FIGMA_DESCRIPTION,
    showDescription: true,
    showSlotContent: true,
    showActions: true,
    secondaryAction: false,
    tertiaryAction: true,
    closable: true,
    closeOnOverlayClick: false,
    primaryActionText: 'Button text',
    secondaryActionText: 'Button text',
    tertiaryActionText: 'Button text',
    onClose: fn(),
    onPrimaryAction: fn(),
    onSecondaryAction: fn(),
    onTertiaryAction: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof ModalWindow>;

/** Opener button + controlled modal (hooks live in a named component). */
function ModalDemo({ openLabel = 'Open modal', ...args }: ModalWindowProps & { openLabel?: string }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>{openLabel}</Button>
      <ModalWindow
        {...args}
        open={open}
        onClose={(reason) => {
          args.onClose?.(reason);
          close();
        }}
        onTertiaryAction={(e) => {
          args.onTertiaryAction?.(e);
          close();
        }}
        onPrimaryAction={(e) => {
          args.onPrimaryAction?.(e);
          close();
        }}
      />
    </>
  );
}

/* ── Default: opens as a real modal ── */

export const Default: Story = {
  render: (args) => <ModalDemo {...args} />,
};

/* ── Per size (Figma "Size") — inline ── */

const InlineSize = (args: ModalWindowProps) => (
  <div style={overlayFrame}>
    <ModalWindow {...args} inline />
  </div>
);

export const SizeSmall: Story = { name: 'Size: Small', args: { size: 'small' }, render: InlineSize };
export const SizeMedium: Story = { name: 'Size: Medium', args: { size: 'medium' }, render: InlineSize };
export const SizeLarge: Story = { name: 'Size: Large', args: { size: 'large' }, render: InlineSize };
export const SizeXLarge: Story = { name: 'Size: X-large', args: { size: 'x-large' }, render: InlineSize };

/* ── Full Figma matrix: the 4 Size variants with Figma default properties ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 4 variants)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {SIZES.map((s) => (
        <div key={s}>
          <p style={headCell}>{`Size=${sizeLabel[s]}`}</p>
          <div style={overlayFrame}>
            <ModalWindow inline size={s} title="Title" description={FIGMA_DESCRIPTION} />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {SIZES.map((s) => (
        <div key={s}>
          <p style={headCell}>{sizeLabel[s]}</p>
          <div style={overlayFrame}>
            <ModalWindow {...args} inline size={s}>
              <SlotPlaceholder />
            </ModalWindow>
          </div>
        </div>
      ))}
    </div>
  ),
};

/* ── AllStates: every boolean property against the Figma defaults ── */

const STATES: { name: string; props: Partial<ModalWindowProps>; slot?: boolean }[] = [
  { name: 'Figma defaults', props: {} },
  { name: 'Show description: False', props: { showDescription: false } },
  { name: 'Show slot content: True', props: {}, slot: true },
  { name: 'Show slot content: True, Show description: False', props: { showDescription: false }, slot: true },
  { name: 'Show actions: False', props: { showActions: false } },
  { name: 'Secondary action: True', props: { secondaryAction: true } },
  { name: 'Tertiary action: False', props: { tertiaryAction: false } },
  { name: 'Closable: False', props: { closable: false } },
  { name: 'Primary danger + loading', props: { primaryActionProps: { variant: 'danger', loading: true } } },
];

export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, max-content)', gap: 32 }}>
      {STATES.map((st) => (
        <div key={st.name}>
          <p style={headCell}>{st.name}</p>
          <div style={overlayFrame}>
            <ModalWindow {...args} size="small" inline {...st.props}>
              {st.slot ? <SlotPlaceholder /> : undefined}
            </ModalWindow>
          </div>
        </div>
      ))}
    </div>
  ),
};

/* ── Edge cases ── */

export const LongContent: Story = {
  name: 'Long content (title truncates, body scrolls)',
  render: (args) => (
    <div style={{ ...overlayFrame, height: 520, alignItems: 'center' }}>
      <ModalWindow
        {...args}
        inline
        size="medium"
        title="Confirm deletion of every scan in this patient's treatment history"
        description={Array.from({ length: 6 }, () => FIGMA_DESCRIPTION).join(' ')}
        tertiaryActionText="Cancel"
        primaryActionText="Delete all scans"
        primaryActionProps={{ variant: 'danger' }}
      >
        <SlotPlaceholder />
      </ModalWindow>
    </div>
  ),
};

function FormModalDemo(args: ModalWindowProps) {
  const [open, setOpen] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Rename scan</Button>
      <ModalWindow
        {...args}
        open={open}
        size="large"
        title="Rename scan"
        description="The new name is shown in the patient's scan history."
        initialFocusRef={nameRef}
        closeOnOverlayClick
        onClose={() => setOpen(false)}
        tertiaryActionText="Cancel"
        onTertiaryAction={() => setOpen(false)}
        primaryActionText="Save"
        onPrimaryAction={() => setOpen(false)}
      >
        <label style={{ display: 'flex', flexDirection: 'column', gap: 8, font: '400 16px/24px var(--scanner-font-sans)' }}>
          Scan name
          <input ref={nameRef} defaultValue="Upper jaw — 12 Sep" style={{ font: 'inherit', padding: 8 }} />
        </label>
      </ModalWindow>
    </>
  );
}

export const WithForm: Story = {
  name: 'Slot content: form (initial focus, overlay click closes)',
  render: (args) => <FormModalDemo {...args} />,
};

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

const openModal = async (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement);
  const opener = canvas.getByRole('button', { name: 'Open modal' });
  await userEvent.click(opener);
  const dialog = await canvas.findByRole('dialog');
  return { canvas, opener, dialog };
};

export const OpenAndEscape: Story = {
  tags: ['test'],
  args: { tertiaryActionText: 'Cancel', primaryActionText: 'Confirm' },
  render: (args) => <ModalDemo {...args} />,
  play: async ({ args, canvasElement }) => {
    const { canvas, opener, dialog } = await openModal(canvasElement);
    await expect(dialog).toHaveAttribute('open');
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    await expect(dialog).toHaveAccessibleName('Title');
    await expect(canvas.getByRole('button', { name: 'Close' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await expect(args.onClose).toHaveBeenCalledWith('escape');
    await waitFor(() => expect(canvas.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(opener).toHaveFocus();
  },
};

export const FocusTrap: Story = {
  tags: ['test'],
  args: { tertiaryActionText: 'Cancel', primaryActionText: 'Confirm' },
  render: (args) => <ModalDemo {...args} />,
  play: async ({ canvasElement }) => {
    const { canvas } = await openModal(canvasElement);
    const close = canvas.getByRole('button', { name: 'Close' });
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Cancel' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Confirm' })).toHaveFocus();
    await userEvent.tab();
    await expect(close).toHaveFocus();
    await userEvent.tab({ shift: true });
    await expect(canvas.getByRole('button', { name: 'Confirm' })).toHaveFocus();
  },
};

export const CloseButtonAndActions: Story = {
  tags: ['test'],
  args: { tertiaryActionText: 'Cancel', primaryActionText: 'Confirm' },
  render: (args) => <ModalDemo {...args} />,
  play: async ({ args, canvasElement }) => {
    let { canvas } = await openModal(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Close' }));
    await expect(args.onClose).toHaveBeenCalledWith('close-button');
    await waitFor(() => expect(canvas.queryByRole('dialog')).not.toBeInTheDocument());

    ({ canvas } = await openModal(canvasElement));
    await userEvent.click(canvas.getByRole('button', { name: 'Confirm' }));
    await expect(args.onPrimaryAction).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(canvas.queryByRole('dialog')).not.toBeInTheDocument());
  },
};

export const NotClosable: Story = {
  tags: ['test'],
  args: { closable: false, tertiaryActionText: 'Cancel', primaryActionText: 'Confirm' },
  render: (args) => <ModalDemo {...args} />,
  play: async ({ args, canvasElement }) => {
    const { canvas } = await openModal(canvasElement);
    await expect(canvas.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Cancel' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await expect(args.onClose).not.toHaveBeenCalled();
    await expect(canvas.getByRole('dialog')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(canvas.queryByRole('dialog')).not.toBeInTheDocument());
  },
};
