import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, fireEvent, waitFor, within } from "storybook/test"

import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuLabel,
  ContextMenuShortcut,
} from "./context-menu"

const InteractiveContextMenu = () => {
  const [lastAction, setLastAction] = React.useState("None")

  return (
    <div className="space-y-4">
      <ContextMenu>
        <ContextMenuTrigger className="rounded-xl border bg-card p-6 text-sm text-card-foreground">
          Right-click this panel to open menu
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuLabel>Actions</ContextMenuLabel>
          <ContextMenuItem onClick={() => setLastAction("Open")}>
            Open
            <ContextMenuShortcut>⌘O</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem onClick={() => setLastAction("Rename")}>
            Rename
            <ContextMenuShortcut>F2</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={() => setLastAction("Delete")} className="text-destructive">
            Delete
            <ContextMenuShortcut>⌘⌫</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <p className="text-sm text-foreground">Last action: {lastAction}</p>
    </div>
  )
}

const ControlledContextMenuDemo = () => {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="space-y-4">
      <ContextMenu open={open} onOpenChange={setOpen}>
        <ContextMenuTrigger className="rounded-xl border bg-card p-6 text-sm text-card-foreground">
          Controlled menu trigger
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => setOpen(false)}>Inspect</ContextMenuItem>
          <ContextMenuItem onClick={() => setOpen(false)}>Copy link</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <p className="text-sm text-foreground">Menu open: {open ? "yes" : "no"}</p>
    </div>
  )
}

const meta = {
  title: "Navigation/ContextMenu",
  component: ContextMenu,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "ContextMenu supports right-click and keyboard invocation, roving focus, and close-on-dismiss interactions.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border bg-card p-6 shadow-lg md:p-8">
        <div className="mb-6 space-y-1">
          <p className="text-sm font-medium text-primary">Navigation</p>
          <h2 className="text-2xl font-bold tracking-tight text-card-foreground">Context Menu Showcase</h2>
          <p className="text-sm text-muted-foreground">Right-click actions for contextual workflows.</p>
        </div>
        <InteractiveContextMenu />
      </div>
    </div>
  ),
}

export const RightClickAction: Story = {
  render: () => <InteractiveContextMenu />,
  play: async ({ canvas }) => {
    const trigger = canvas.getByText(/right-click this panel/i)
    trigger.focus()
    fireEvent.keyDown(trigger, { key: "F10", shiftKey: true })

    const rename = await waitFor(() =>
      within(document.body).getByRole("menuitem", { name: /rename/i })
    )
    fireEvent.click(rename)

    await waitFor(() => {
      expect(canvas.getByText(/last action: rename/i)).toBeInTheDocument()
    })
  },
}

export const Controlled: Story = {
  render: () => <ControlledContextMenuDemo />,
  play: async ({ canvas }) => {
    const trigger = canvas.getByText(/controlled menu trigger/i)
    trigger.focus()
    fireEvent.keyDown(trigger, { key: "F10", shiftKey: true })

    await waitFor(() => {
      expect(within(document.body).getByRole("menu")).toBeInTheDocument()
      expect(canvas.getByText(/menu open: yes/i)).toBeInTheDocument()
    })

    fireEvent.click(within(document.body).getByRole("menuitem", { name: /inspect/i }))
    await waitFor(() => {
      expect(within(document.body).queryByRole("menu")).not.toBeInTheDocument()
      expect(canvas.getByText(/menu open: no/i)).toBeInTheDocument()
    })
  },
}

export const KeyboardNavigation: Story = {
  render: () => <InteractiveContextMenu />,
  play: async ({ canvas }) => {
    const trigger = canvas.getByText(/right-click this panel/i)
    trigger.focus()
    fireEvent.keyDown(trigger, { key: "F10", shiftKey: true })

    const menu = await waitFor(() => within(document.body).getByRole("menu"))
    const openItem = within(document.body).getByRole("menuitem", { name: /open/i })
    const renameItem = within(document.body).getByRole("menuitem", { name: /rename/i })
    const deleteItem = within(document.body).getByRole("menuitem", { name: /delete/i })

    await expect(openItem).toHaveFocus()

    fireEvent.keyDown(menu, { key: "ArrowDown" })
    await expect(renameItem).toHaveFocus()

    fireEvent.keyDown(menu, { key: "ArrowUp" })
    await expect(openItem).toHaveFocus()

    fireEvent.keyDown(menu, { key: "End" })
    await expect(deleteItem).toHaveFocus()

    fireEvent.keyDown(menu, { key: "Home" })
    await expect(openItem).toHaveFocus()

    fireEvent.keyDown(menu, { key: "Tab" })
    await waitFor(() => {
      expect(within(document.body).queryByRole("menu")).not.toBeInTheDocument()
    })

    trigger.focus()
    fireEvent.keyDown(trigger, { key: "F10", shiftKey: true })
    const reopenedMenu = await waitFor(() => within(document.body).getByRole("menu"))
    fireEvent.keyDown(reopenedMenu, { key: "Escape" })
    await waitFor(() => {
      expect(within(document.body).queryByRole("menu")).not.toBeInTheDocument()
    })
  },
}

export const DisabledItemBehavior: Story = {
  render: () => {
    const DisabledDemo = () => {
      const [lastAction, setLastAction] = React.useState("None")
      return (
        <div className="space-y-4">
          <ContextMenu>
            <ContextMenuTrigger className="rounded-xl border bg-card p-6 text-sm text-card-foreground">
              Disabled context action panel
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onClick={() => setLastAction("Open")}>Open</ContextMenuItem>
              <ContextMenuItem disabled onClick={() => setLastAction("Disabled")}>
                Disabled Action
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
          <p className="text-sm text-foreground">Last action: {lastAction}</p>
        </div>
      )
    }
    return <DisabledDemo />
  },
  play: async ({ canvas }) => {
    const trigger = canvas.getByText(/disabled context action panel/i)
    fireEvent.contextMenu(trigger, { clientX: 120, clientY: 120 })

    const disabledItem = await waitFor(() =>
      within(document.body).getByRole("menuitem", { name: /disabled action/i })
    )
    await expect(disabledItem).toBeDisabled()
    fireEvent.click(disabledItem)

    await waitFor(() => {
      expect(canvas.getByText(/last action: none/i)).toBeInTheDocument()
    })
  },
}

export const StateMatrix: Story = {
  render: () => (
    <div className="grid w-[760px] gap-4 md:grid-cols-2">
      <div className="rounded-xl border bg-card p-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground">Pointer Trigger</p>
        <InteractiveContextMenu />
      </div>
      <div className="rounded-xl border bg-card p-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground">Controlled Trigger</p>
        <ControlledContextMenuDemo />
      </div>
    </div>
  ),
}

export const NativeContextMenuKeyOpen: Story = {
  render: () => <InteractiveContextMenu />,
  play: async ({ canvas }) => {
    const trigger = canvas.getByText(/right-click this panel/i)
    trigger.focus()
    fireEvent.keyDown(trigger, { key: "ContextMenu" })

    await waitFor(() => {
      expect(within(document.body).getByRole("menu")).toBeInTheDocument()
      expect(within(document.body).getByRole("menuitem", { name: /open/i })).toHaveFocus()
    })
  },
}

export const OutsideClickDismissal: Story = {
  render: () => (
    <div className="space-y-3">
      <button type="button">Outside target</button>
      <InteractiveContextMenu />
    </div>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByText(/right-click this panel/i)
    fireEvent.contextMenu(trigger, { clientX: 120, clientY: 120 })

    await waitFor(() => {
      expect(within(document.body).getByRole("menu")).toBeInTheDocument()
    })

    fireEvent.mouseDown(canvas.getByRole("button", { name: /outside target/i }))
    await waitFor(() => {
      expect(within(document.body).queryByRole("menu")).not.toBeInTheDocument()
    })
  },
}
