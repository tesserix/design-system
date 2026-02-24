import type { Meta, StoryObj } from '@storybook/react'
import { expect, fireEvent, waitFor, within } from 'storybook/test'
import { Tooltip } from './tooltip'
import { Button } from '../button'

const meta = {
  title: 'Overlay/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Tooltip supports hover and focus triggers with configurable placement for concise contextual hints.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    side: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'The side where the tooltip appears',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'top' },
      },
    },
    content: {
      control: 'text',
      description: 'The content displayed in the tooltip',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    children: {
      control: false,
      description: 'The element that triggers the tooltip',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply to the tooltip',
      table: {
        type: { summary: 'string' },
      },
    },
  },
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="mx-auto w-full max-w-4xl rounded-3xl border bg-card p-6 shadow-lg md:p-8">
        <div className="mb-6 space-y-1">
          <p className="text-sm font-medium text-primary">Contextual Info</p>
          <h2 className="text-2xl font-bold tracking-tight text-card-foreground">Tooltip Showcase</h2>
          <p className="text-sm text-muted-foreground">Hover information for interactive elements.</p>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="mb-4 text-sm font-semibold text-card-foreground">Positions</h3>
            <div className="flex flex-col items-center gap-8">
              <Tooltip content="Tooltip on top" side="top">
                <Button variant="outline">Top</Button>
              </Tooltip>
              <div className="flex gap-8">
                <Tooltip content="Tooltip on left" side="left">
                  <Button variant="outline">Left</Button>
                </Tooltip>
                <Tooltip content="Tooltip on right" side="right">
                  <Button variant="outline">Right</Button>
                </Tooltip>
              </div>
              <Tooltip content="Tooltip on bottom" side="bottom">
                <Button variant="outline">Bottom</Button>
              </Tooltip>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/50 p-6">
            <h3 className="mb-4 text-sm font-semibold">With Buttons</h3>
            <div className="flex flex-wrap gap-3">
              <Tooltip content="Save your changes">
                <Button>Save</Button>
              </Tooltip>
              <Tooltip content="Discard changes">
                <Button variant="outline">Cancel</Button>
              </Tooltip>
              <Tooltip content="This action cannot be undone" side="bottom">
                <Button variant="destructive">Delete</Button>
              </Tooltip>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-card-foreground">Hover over items for more info</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Tooltip content="Your account settings and preferences">
                  <span className="text-sm underline decoration-dotted cursor-help">Account</span>
                </Tooltip>
              </div>
              <div className="flex items-center gap-2">
                <Tooltip content="Security and privacy options">
                  <span className="text-sm underline decoration-dotted cursor-help">Security</span>
                </Tooltip>
              </div>
              <div className="flex items-center gap-2">
                <Tooltip content="Manage your billing and subscription">
                  <span className="text-sm underline decoration-dotted cursor-help">Billing</span>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

export const Top: Story = {
  render: () => (
    <Tooltip content="This is a tooltip" side="top">
      <Button>Hover me</Button>
    </Tooltip>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: /hover me/i })

    fireEvent.mouseOver(trigger)
    await waitFor(() => {
      expect(within(document.body).getByRole('tooltip')).toBeInTheDocument()
    })

    fireEvent.mouseOut(trigger)
    await waitFor(() => {
      expect(within(document.body).queryByRole('tooltip')).not.toBeInTheDocument()
    })
  },
}

export const Bottom: Story = {
  render: () => (
    <Tooltip content="This is a tooltip" side="bottom">
      <Button>Hover me</Button>
    </Tooltip>
  ),
}

export const Left: Story = {
  render: () => (
    <Tooltip content="This is a tooltip" side="left">
      <Button>Hover me</Button>
    </Tooltip>
  ),
}

export const Right: Story = {
  render: () => (
    <Tooltip content="This is a tooltip" side="right">
      <Button>Hover me</Button>
    </Tooltip>
  ),
}

export const FocusAccessible: Story = {
  render: () => (
    <Tooltip content="Focus tooltip content" side="top">
      <Button>Focus me</Button>
    </Tooltip>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: /focus me/i })

    fireEvent.focusIn(trigger)
    await waitFor(() => {
      expect(within(document.body).getByRole('tooltip')).toHaveTextContent(/focus tooltip content/i)
    })

    fireEvent.focusOut(trigger)
    await waitFor(() => {
      expect(within(document.body).queryByRole('tooltip')).not.toBeInTheDocument()
    })
  },
}

export const StateMatrix: Story = {
  render: () => (
    <div className="grid w-[860px] gap-4 md:grid-cols-2">
      <div className="rounded-xl border bg-card p-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground">Action Tooltips</p>
        <div className="flex gap-3">
          <Tooltip content="Save changes" side="top">
            <Button>Save</Button>
          </Tooltip>
          <Tooltip content="Discard changes" side="bottom">
            <Button variant="outline">Cancel</Button>
          </Tooltip>
        </div>
      </div>
      <div className="rounded-xl border bg-card p-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground">Inline Hints</p>
        <Tooltip content="Keyboard shortcut: Cmd+K" side="right">
          <span className="cursor-help text-sm underline decoration-dotted">Command Palette</span>
        </Tooltip>
      </div>
    </div>
  ),
}
