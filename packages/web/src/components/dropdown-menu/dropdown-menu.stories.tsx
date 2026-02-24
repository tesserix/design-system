import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, fireEvent, waitFor, within } from 'storybook/test'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuShortcut,
} from './dropdown-menu'
import { Button } from '../button'

const meta = {
  title: 'Overlay/DropdownMenu',
  component: DropdownMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'DropdownMenu supports controlled/uncontrolled open state, keyboard navigation, outside click dismissal, and disabled items.',
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
} satisfies Meta<typeof DropdownMenu>

export default meta
type Story = StoryObj<typeof meta>

const ControlledDropdownDemo = () => {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="space-y-3">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Open controlled menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <p className="text-sm text-muted-foreground">Menu open: {open ? 'yes' : 'no'}</p>
    </div>
  )
}

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="mx-auto w-full max-w-5xl rounded-3xl border bg-card p-6 shadow-lg md:p-8">
        <div className="mb-6 space-y-1">
          <p className="text-sm font-medium text-primary">Navigation</p>
          <h2 className="text-2xl font-bold tracking-tight text-card-foreground">DropdownMenu Showcase</h2>
          <p className="text-sm text-muted-foreground">Contextual menus with actions.</p>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="mb-4 text-sm font-semibold text-card-foreground">Basic Menu</h3>
            <div className="flex justify-center p-8">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Open Menu</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuItem>Team</DropdownMenuItem>
                  <DropdownMenuItem>Subscription</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="mb-4 text-sm font-semibold text-card-foreground">With Labels & Separators</h3>
            <div className="flex justify-center p-8">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button>Account</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    Profile
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Billing
                    <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Settings
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Team</DropdownMenuItem>
                  <DropdownMenuItem disabled>Invite users (coming soon)</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4">
            <h3 className="mb-4 text-sm font-semibold">Multiple Menus</h3>
            <div className="flex justify-center gap-4 p-8">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    File
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>New File</DropdownMenuItem>
                  <DropdownMenuItem>New Window</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Open</DropdownMenuItem>
                  <DropdownMenuItem>Save</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Exit</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Undo</DropdownMenuItem>
                  <DropdownMenuItem>Redo</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Cut</DropdownMenuItem>
                  <DropdownMenuItem>Copy</DropdownMenuItem>
                  <DropdownMenuItem>Paste</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Zoom In</DropdownMenuItem>
                  <DropdownMenuItem>Zoom Out</DropdownMenuItem>
                  <DropdownMenuItem>Reset Zoom</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Full Screen</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

export const Simple: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ canvas }) => {
    const openButton = canvas.getByRole('button', { name: /open/i })

    fireEvent.click(openButton)

    const menu = await waitFor(() => within(document.body).getByRole('menu'))
    const editItem = within(menu).getByRole('menuitem', { name: /edit/i })
    const duplicateItem = within(menu).getByRole('menuitem', { name: /duplicate/i })

    await expect(editItem).toHaveFocus()
    fireEvent.keyDown(menu, { key: 'ArrowDown' })
    await waitFor(() => {
      expect(duplicateItem).toHaveFocus()
    })
  },
}

export const WithShortcuts: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          New Tab
          <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          New Window
          <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          New Private Window
          <DropdownMenuShortcut>⇧⌘N</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Print
          <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

export const Controlled: Story = {
  render: () => <ControlledDropdownDemo />,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: /open controlled menu/i })
    fireEvent.click(trigger)

    await waitFor(() => {
      expect(within(document.body).getByRole('menu')).toBeInTheDocument()
      expect(canvas.getByText(/menu open: yes/i)).toBeInTheDocument()
    })

    const profileItem = within(document.body).getByRole('menuitem', { name: /profile/i })
    fireEvent.click(profileItem)

    await waitFor(() => {
      expect(within(document.body).queryByRole('menu')).not.toBeInTheDocument()
      expect(canvas.getByText(/menu open: no/i)).toBeInTheDocument()
    })
  },
}

export const DisabledItem: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open disabled item menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem disabled>Archive (Unavailable)</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: /open disabled item menu/i })
    fireEvent.click(trigger)

    const disabledItem = await waitFor(() =>
      within(document.body).getByRole('menuitem', { name: /archive \(unavailable\)/i })
    )
    await expect(disabledItem).toBeDisabled()
  },
}

export const KeyboardAndDismissal: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open keyboard menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Open</DropdownMenuItem>
        <DropdownMenuItem>Rename</DropdownMenuItem>
        <DropdownMenuItem disabled>Archive</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: /open keyboard menu/i })

    trigger.focus()
    fireEvent.keyDown(trigger, { key: 'Enter' })
    const menu = await waitFor(() => within(document.body).getByRole('menu'))
    const openItem = within(menu).getByRole('menuitem', { name: /open/i })
    const renameItem = within(menu).getByRole('menuitem', { name: /rename/i })
    const deleteItem = within(menu).getByRole('menuitem', { name: /delete/i })

    await expect(openItem).toHaveFocus()
    fireEvent.keyDown(menu, { key: 'ArrowDown' })
    await expect(renameItem).toHaveFocus()
    fireEvent.keyDown(menu, { key: 'ArrowUp' })
    await expect(openItem).toHaveFocus()
    fireEvent.keyDown(menu, { key: 'End' })
    await expect(deleteItem).toHaveFocus()
    fireEvent.keyDown(menu, { key: 'Home' })
    await expect(openItem).toHaveFocus()

    fireEvent.keyDown(menu, { key: 'Tab' })
    await waitFor(() => {
      expect(within(document.body).queryByRole('menu')).not.toBeInTheDocument()
    })

    fireEvent.click(trigger)
    const reopened = await waitFor(() => within(document.body).getByRole('menu'))
    fireEvent.keyDown(reopened, { key: 'Escape' })
    await waitFor(() => {
      expect(within(document.body).queryByRole('menu')).not.toBeInTheDocument()
      expect(trigger).toHaveFocus()
    })
  },
}

export const OutsideClickDismissal: Story = {
  render: () => (
    <div className="space-y-3">
      <button type="button">Outside target</button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Open outside dismiss menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: /open outside dismiss menu/i })
    fireEvent.click(trigger)
    await waitFor(() => {
      expect(within(document.body).getByRole('menu')).toBeInTheDocument()
    })

    fireEvent.mouseDown(canvas.getByRole('button', { name: /outside target/i }))
    await waitFor(() => {
      expect(within(document.body).queryByRole('menu')).not.toBeInTheDocument()
    })
  },
}

export const KeyboardOpenWithSpace: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex h-10 items-center rounded-md border px-4 text-sm">
        Plain Trigger
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Inspect</DropdownMenuItem>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: /plain trigger/i })
    trigger.focus()
    fireEvent.keyDown(trigger, { key: ' ' })

    const menu = await waitFor(() => within(document.body).getByRole('menu'))
    await expect(menu).toBeInTheDocument()
    await expect(within(menu).getByRole('menuitem', { name: /inspect/i })).toHaveFocus()
  },
}

export const DisabledItemNoClose: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open disabled behavior menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem disabled>Archive</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: /open disabled behavior menu/i })
    fireEvent.click(trigger)

    const menu = await waitFor(() => within(document.body).getByRole('menu'))
    const disabledItem = within(menu).getByRole('menuitem', { name: /archive/i })
    await expect(disabledItem).toBeDisabled()
    fireEvent.click(disabledItem)

    await waitFor(() => {
      expect(within(document.body).getByRole('menu')).toBeInTheDocument()
    })
  },
}

export const StateMatrix: Story = {
  render: () => (
    <div className="grid w-[760px] gap-4 md:grid-cols-2">
      <div className="rounded-xl border bg-card p-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground">Uncontrolled</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-xl border bg-card p-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground">Controlled</p>
        <ControlledDropdownDemo />
      </div>
    </div>
  ),
}
