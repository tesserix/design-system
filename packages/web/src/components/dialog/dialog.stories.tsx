import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, fireEvent, waitFor, within } from 'storybook/test'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from './dialog'
import { Button } from '../button'

const meta = {
  title: 'Overlay/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Dialog provides modal overlays with focus trapping, escape handling, overlay dismiss, and controlled/uncontrolled usage.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controlled open state',
      table: {
        type: { summary: 'boolean' },
      },
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Default open state (uncontrolled)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onOpenChange: {
      description: 'Callback when open state changes',
      table: {
        type: { summary: '(open: boolean) => void' },
      },
    },
  },
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

const ControlledDialogDemo = () => {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="space-y-3">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Open controlled dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Controlled dialog</DialogTitle>
            <DialogDescription>Open state is managed by the story render function.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <p className="text-sm text-muted-foreground">Dialog open: {open ? 'yes' : 'no'}</p>
    </div>
  )
}

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="mx-auto w-full max-w-5xl rounded-3xl border bg-card p-6 shadow-lg md:p-8">
        <div className="mb-6 space-y-1">
          <p className="text-sm font-medium text-primary">Overlay</p>
          <h2 className="text-2xl font-bold tracking-tight text-card-foreground">Dialog Showcase</h2>
          <p className="text-sm text-muted-foreground">Modal dialogs for focused user interactions.</p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-card-foreground">Basic Dialog</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Open Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove your
                    data from our servers.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button variant="destructive">Delete Account</Button>
                </DialogFooter>
                <DialogClose />
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="mb-3 text-sm font-semibold text-card-foreground">With Form</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Edit Profile</Button>
              </DialogTrigger>
              <DialogContent size="md">
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="name" className="text-right text-sm font-medium">
                      Name
                    </label>
                    <input
                      id="name"
                      defaultValue="John Doe"
                      className="col-span-3 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="username" className="text-right text-sm font-medium">
                      Username
                    </label>
                    <input
                      id="username"
                      defaultValue="@johndoe"
                      className="col-span-3 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
                <DialogClose />
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4">
            <h3 className="mb-4 text-sm font-semibold">Different Sizes</h3>
            <div className="flex flex-wrap gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Small
                  </Button>
                </DialogTrigger>
                <DialogContent size="sm">
                  <DialogHeader>
                    <DialogTitle>Small Dialog</DialogTitle>
                    <DialogDescription>This is a small dialog.</DialogDescription>
                  </DialogHeader>
                  <DialogClose />
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Medium
                  </Button>
                </DialogTrigger>
                <DialogContent size="md">
                  <DialogHeader>
                    <DialogTitle>Medium Dialog</DialogTitle>
                    <DialogDescription>This is a medium dialog.</DialogDescription>
                  </DialogHeader>
                  <DialogClose />
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Large
                  </Button>
                </DialogTrigger>
                <DialogContent size="lg">
                  <DialogHeader>
                    <DialogTitle>Large Dialog</DialogTitle>
                    <DialogDescription>This is a large dialog.</DialogDescription>
                  </DialogHeader>
                  <DialogClose />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

export const Simple: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog description goes here.</DialogDescription>
        </DialogHeader>
        <DialogClose />
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvas }) => {
    const openButton = canvas.getByRole('button', { name: /open/i })

    fireEvent.click(openButton)
    const dialog = await waitFor(() => within(document.body).getByRole('dialog'))
    await expect(dialog).toBeInTheDocument()

    fireEvent.keyDown(dialog, { key: 'Escape' })
    await waitFor(() => {
      expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument()
    })
    await expect(openButton).toHaveFocus()
  },
}

export const WithFooter: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Confirm Action</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm your action</DialogTitle>
          <DialogDescription>
            Are you sure you want to proceed? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Confirm</Button>
        </DialogFooter>
        <DialogClose />
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: /confirm action/i })
    fireEvent.click(trigger)

    const dialog = await waitFor(() => within(document.body).getByRole('dialog'))
    await expect(dialog).toHaveAttribute('aria-modal', 'true')
    await expect(within(dialog).getByText(/confirm your action/i)).toBeInTheDocument()

    fireEvent.keyDown(dialog, { key: 'Escape' })
    await waitFor(() => {
      expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument()
    })
    await expect(trigger).toHaveFocus()
  },
}

export const Controlled: Story = {
  render: () => <ControlledDialogDemo />,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: /open controlled dialog/i })
    fireEvent.click(trigger)

    const dialog = await waitFor(() => within(document.body).getByRole('dialog'))
    await waitFor(() => {
      expect(dialog).toBeInTheDocument()
      expect(canvas.getByText(/dialog open: yes/i)).toBeInTheDocument()
    })

    const closeButton = within(dialog).getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)
    await waitFor(() => {
      expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument()
      expect(canvas.getByText(/dialog open: no/i)).toBeInTheDocument()
    })
  },
}

export const FocusTrapAndOverlayClose: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open trap dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Trap test</DialogTitle>
          <DialogDescription>Focus should stay inside until closed.</DialogDescription>
        </DialogHeader>
        <input
          aria-label="First field"
          defaultValue="A"
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        <input
          aria-label="Second field"
          defaultValue="B"
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        <DialogFooter>
          <Button>Action</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: /open trap dialog/i })
    fireEvent.click(trigger)

    const dialog = await waitFor(() => within(document.body).getByRole('dialog'))
    const first = within(dialog).getByRole('textbox', { name: /first field/i })
    const action = within(dialog).getByRole('button', { name: /action/i })

    await expect(first).toHaveFocus()
    action.focus()
    await expect(action).toHaveFocus()
    fireEvent.keyDown(dialog, { key: 'Tab' })
    await expect(first).toHaveFocus()
    fireEvent.keyDown(dialog, { key: 'Tab', shiftKey: true })
    await expect(action).toHaveFocus()

    const overlay = document.querySelector('.backdrop-blur-sm') as HTMLElement | null
    if (overlay) {
      fireEvent.mouseDown(overlay)
    }
    await waitFor(() => {
      expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument()
      expect(trigger).toHaveFocus()
    })
  },
}

export const Glassmorphism: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="glass">Open Glass Dialog</Button>
      </DialogTrigger>
      <DialogContent variant="glass">
        <DialogHeader>
          <DialogTitle>Glass Dialog</DialogTitle>
          <DialogDescription>Semi-transparent dialog with frosted glass effect</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm">
            This dialog uses glassmorphism for a modern, premium appearance. The backdrop blur creates depth and
            visual hierarchy.
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="glass">Confirm</Button>
        </DialogFooter>
        <DialogClose />
      </DialogContent>
    </Dialog>
  ),
}

export const NoFocusableTabBehavior: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open no-focus dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>No focusable content</DialogTitle>
          <DialogDescription>This dialog intentionally contains no focusable descendants.</DialogDescription>
        </DialogHeader>
        <div className="py-3 text-sm text-muted-foreground">Tab key should remain trapped on the dialog root.</div>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: /open no-focus dialog/i })
    fireEvent.click(trigger)

    const dialog = await waitFor(() => within(document.body).getByRole('dialog'))
    dialog.focus()
    fireEvent.keyDown(dialog, { key: 'Tab' })
    await expect(dialog).toHaveFocus()

    fireEvent.keyDown(dialog, { key: 'Escape' })
    await waitFor(() => {
      expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument()
    })
  },
}

export const StateMatrix: Story = {
  render: () => (
    <div className="grid w-[840px] gap-4 md:grid-cols-2">
      <div className="rounded-xl border bg-card p-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground">Default</p>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Default modal</DialogTitle>
              <DialogDescription>Standard card-style dialog.</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-xl border bg-card p-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground">Glass</p>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="glass">Open Glass</Button>
          </DialogTrigger>
          <DialogContent variant="glass">
            <DialogHeader>
              <DialogTitle>Glass modal</DialogTitle>
              <DialogDescription>Backdrop-blur variant.</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  ),
}

const ControlledNoTriggerDialogDemo = () => {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="space-y-3">
      <button
        type="button"
        className="rounded-md border px-3 py-2 text-sm"
        onClick={() => setOpen(true)}
      >
        Open without trigger
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>No Trigger Dialog</DialogTitle>
            <DialogDescription>Dialog opened externally (no DialogTrigger component).</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export const ControlledWithoutTrigger: Story = {
  render: () => <ControlledNoTriggerDialogDemo />,
  play: async ({ canvas }) => {
    const openButton = canvas.getByRole('button', { name: /open without trigger/i })
    openButton.focus()
    fireEvent.click(openButton)

    const dialog = await waitFor(() => within(document.body).getByRole('dialog'))
    await expect(dialog).toBeInTheDocument()
    fireEvent.keyDown(dialog, { key: 'Escape' })

    await waitFor(() => {
      expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument()
      expect(openButton).toHaveFocus()
    })
  },
}
