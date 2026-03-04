import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { useState } from 'react'
import { ConfirmDialog } from './confirm-dialog'
import { Button } from '../button'

const meta = {
  title: 'Overlay/ConfirmDialog',
  component: ConfirmDialog,
  args: {
    onConfirm: fn(),
    onOpenChange: fn(),
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive'],
      description: 'The visual style of the confirm button',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'destructive' },
      },
    },
    loading: {
      control: 'boolean',
      description: 'Whether the dialog is in a loading state',
    },
    confirmDisabled: {
      control: 'boolean',
      description: 'Whether the confirm button is disabled',
    },
  },
} satisfies Meta<typeof ConfirmDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    open: true,
    title: 'Delete item',
    description: 'Are you sure you want to delete this item? This action cannot be undone.',
    confirmLabel: 'Delete',
    cancelLabel: 'Cancel',
    variant: 'destructive',
  },
}

export const Interactive: Story = {
  args: {
    open: false,
    title: 'Confirm action',
    description: 'This will permanently remove the selected resource.',
    confirmLabel: 'Confirm',
  },
  render: function InteractiveStory(args) {
    const [open, setOpen] = useState(false)
    return (
      <div className="min-h-screen bg-background p-8">
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Open Confirm Dialog
        </Button>
        <ConfirmDialog
          {...args}
          open={open}
          onOpenChange={setOpen}
          onConfirm={() => setOpen(false)}
        />
      </div>
    )
  },
}
