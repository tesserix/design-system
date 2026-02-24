import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, fireEvent, userEvent, waitFor, within } from "storybook/test"

import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "./drawer"
import { Button } from "../button"
import { Input } from "../input"
import { Label } from "../label"

const meta = {
  title: "Overlay/Drawer",
  component: Drawer,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

class DrawerErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}

export const Default: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Drawer Title</DrawerTitle>
          <DrawerDescription>This is a mobile-optimized drawer.</DrawerDescription>
        </DrawerHeader>
        <div className="p-4"><p className="text-sm">Drawer content body.</p></div>
        <DrawerFooter>
          <Button>Confirm</Button>
          <DrawerClose asChild><Button variant="outline">Cancel</Button></DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Open Drawer" }))
    await waitFor(() => expect(within(document.body).getByRole("dialog")).toBeInTheDocument())
    await userEvent.click(within(document.body).getByText("Cancel", { selector: "button" }))
    await waitFor(() => expect(within(document.body).queryByRole("dialog")).not.toBeInTheDocument())
  },
}

export const FromLeft: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild><Button>Open from Left</Button></DrawerTrigger>
      <DrawerContent side="left">
        <DrawerHeader>
          <DrawerTitle>Navigation Menu</DrawerTitle>
          <DrawerDescription>Drawer sliding in from the left.</DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Open from Left" }))
    const dialog = within(document.body).getByRole("dialog")
    expect(dialog.className).toContain("left-0")
    fireEvent.keyDown(dialog, { key: "Escape" })
    await waitFor(() => expect(within(document.body).queryByRole("dialog")).not.toBeInTheDocument())
  },
}

export const FromRight: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild><Button>Open from Right</Button></DrawerTrigger>
      <DrawerContent side="right">
        <DrawerHeader>
          <DrawerTitle>Settings Panel</DrawerTitle>
          <DrawerDescription>Configure your preferences.</DrawerDescription>
        </DrawerHeader>
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Enter your name" />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Open from Right" }))
    const dialog = within(document.body).getByRole("dialog")
    expect(dialog.className).toContain("right-0")
    fireEvent.keyDown(dialog, { key: "Tab" })
    fireEvent.keyDown(dialog, { key: "Tab", shiftKey: true })
    fireEvent.keyDown(dialog, { key: "Escape" })
    await waitFor(() => expect(within(document.body).queryByRole("dialog")).not.toBeInTheDocument())
  },
}

export const FromTop: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild><Button>Open from Top</Button></DrawerTrigger>
      <DrawerContent side="top">
        <DrawerHeader>
          <DrawerTitle>Notification</DrawerTitle>
          <DrawerDescription>You have a new message.</DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Open from Top" }))
    const dialog = within(document.body).getByRole("dialog")
    expect(dialog.className).toContain("top-0")
    const overlay = document.body.querySelector("div.backdrop-blur-sm")
    if (overlay) fireEvent.mouseDown(overlay)
    await waitFor(() => expect(within(document.body).queryByRole("dialog")).not.toBeInTheDocument())
  },
}

export const FromBottom: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild><Button>Open from Bottom</Button></DrawerTrigger>
      <DrawerContent side="bottom">
        <DrawerHeader>
          <DrawerTitle>Mobile Action Sheet</DrawerTitle>
          <DrawerDescription>Choose an action.</DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Open from Bottom" }))
    const dialog = within(document.body).getByRole("dialog")
    expect(dialog.className).toContain("bottom-0")
    const overlay = document.body.querySelector("div.backdrop-blur-sm")
    if (overlay) fireEvent.mouseDown(overlay)
    await waitFor(() => expect(within(document.body).queryByRole("dialog")).not.toBeInTheDocument())
  },
}

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)
    return (
      <div className="space-y-4">
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild><Button>Open Controlled Drawer</Button></DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Controlled Drawer</DrawerTitle>
              <DrawerDescription>This drawer state is controlled externally.</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter><Button onClick={() => setOpen(false)}>Close</Button></DrawerFooter>
          </DrawerContent>
        </Drawer>
        <div className="text-sm text-muted-foreground">Drawer is {open ? "open" : "closed"}</div>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Open Controlled Drawer" }))
    await waitFor(() => expect(canvas.getByText("Drawer is open")).toBeInTheDocument())
    await userEvent.click(within(document.body).getByText("Close", { selector: "button" }))
    await waitFor(() => expect(canvas.getByText("Drawer is closed")).toBeInTheDocument())
  },
}

export const WithForm: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      setOpen(false)
    }

    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild><Button>Add Item</Button></DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Add New Item</DrawerTitle>
            <DrawerDescription>Fill in the details for the new item.</DrawerDescription>
          </DrawerHeader>
          <form onSubmit={handleSubmit}>
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="item-name">Name</Label>
                <Input id="item-name" placeholder="Item name" required />
              </div>
            </div>
            <DrawerFooter>
              <Button type="submit">Add Item</Button>
              <DrawerClose asChild><Button type="button" variant="outline">Cancel</Button></DrawerClose>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Add Item" }))
    await userEvent.type(within(document.body).getByLabelText("Name"), "Sample")
    const dialog = within(document.body).getByRole("dialog")
    await userEvent.click(within(dialog).getByRole("button", { name: "Add Item" }))
    await waitFor(() => expect(within(document.body).queryByRole("dialog")).not.toBeInTheDocument())
  },
}

export const NonSlotTrigger: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger>Open Plain Trigger</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Plain Trigger Drawer</DrawerTitle>
          <DrawerDescription>Uses DrawerTrigger without Slot.</DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Open Plain Trigger" }))
    const dialog = within(document.body).getByRole("dialog")
    fireEvent.keyDown(dialog, { key: "Escape" })
    await waitFor(() => expect(within(document.body).queryByRole("dialog")).not.toBeInTheDocument())
  },
}

export const RefAndCloseHandler: Story = {
  render: () => {
    const triggerRef = React.useRef<HTMLButtonElement | null>(null)
    const contentRef = React.useRef<HTMLDivElement | null>(null)
    const [triggerState, setTriggerState] = React.useState("pending")
    const [contentState, setContentState] = React.useState("pending")
    const [closeCount, setCloseCount] = React.useState(0)

    return (
      <div className="space-y-2">
        <Drawer>
          <DrawerTrigger ref={triggerRef}>
            Open Ref Drawer
          </DrawerTrigger>
          <DrawerContent ref={contentRef}>
            <DrawerHeader>
              <DrawerTitle>Ref Drawer</DrawerTitle>
              <DrawerDescription>Validates callback refs and close handler path.</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <DrawerClose onClick={() => setCloseCount((v) => v + 1)}>Close with handler</DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        <button type="button" onClick={() => setTriggerState(triggerRef.current ? "attached" : "missing")}>
          Check trigger ref
        </button>
        <button type="button" onClick={() => setContentState(contentRef.current ? "attached" : "missing")}>
          Check content ref
        </button>
        <p>Trigger ref: {triggerState}</p>
        <p>Content ref: {contentState}</p>
        <p>Close count: {closeCount}</p>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Open Ref Drawer" }))
    await waitFor(() => expect(within(document.body).getByRole("dialog")).toBeInTheDocument())
    await userEvent.click(canvas.getByRole("button", { name: "Check trigger ref" }))
    await userEvent.click(canvas.getByRole("button", { name: "Check content ref" }))
    await expect(canvas.getByText("Trigger ref: attached")).toBeInTheDocument()
    await expect(canvas.getByText("Content ref: attached")).toBeInTheDocument()
    const closeButtons = within(document.body).getAllByRole("button", { name: "Close" })
    await userEvent.click(closeButtons[0] as HTMLButtonElement)
    await waitFor(() => expect(canvas.getByText("Close count: 1")).toBeInTheDocument())
  },
}

export const ControlledWithoutTrigger: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true)
    return (
      <div className="space-y-2">
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>No Trigger Drawer</DrawerTitle>
              <DrawerDescription>Starts open without a trigger ref.</DrawerDescription>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
        <p>State: {open ? "open" : "closed"}</p>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const dialog = within(document.body).getByRole("dialog")
    fireEvent.keyDown(dialog, { key: "Escape" })
    await waitFor(() => expect(canvas.getByText("State: closed")).toBeInTheDocument())
  },
}

export const ErrorBoundaryWithoutDrawer: Story = {
  render: () => (
    <DrawerErrorBoundary fallback={<p>Drawer context error captured</p>}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Orphan</DrawerTitle>
        </DrawerHeader>
      </DrawerContent>
    </DrawerErrorBoundary>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Drawer context error captured")).toBeInTheDocument()
  },
}

export const FocusTrapEdges: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Open Focus Trap Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Focus Trap</DrawerTitle>
          <DrawerDescription>Covers tab edge behavior.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Primary Action</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Open Focus Trap Drawer" }))
    const dialog = within(document.body).getByRole("dialog")

    const closeButtons = within(dialog).getAllByRole("button", { name: "Close" })
    const primaryButton = within(dialog).getByRole("button", { name: "Primary Action" })
    const firstClose = closeButtons[0] as HTMLButtonElement

    primaryButton.focus()
    fireEvent.keyDown(dialog, { key: "Tab", shiftKey: true })

    firstClose.focus()
    fireEvent.keyDown(dialog, { key: "Tab" })
    await waitFor(() => expect(document.activeElement).toBe(primaryButton))
  },
}

export const EmptyFocusableListHandling: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Open Empty Focusables Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>No Focusables Mocked</DrawerTitle>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const originalQsa = Element.prototype.querySelectorAll
    Element.prototype.querySelectorAll = function (...args: Parameters<Element["querySelectorAll"]>) {
      const selector = String(args[0] ?? "")
      if (this.getAttribute("role") === "dialog" && selector.includes("button:not([disabled])")) {
        return [] as unknown as NodeListOf<Element>
      }
      return originalQsa.apply(this, args)
    }

    try {
      await userEvent.click(canvas.getByRole("button", { name: "Open Empty Focusables Drawer" }))
      const dialog = within(document.body).getByRole("dialog")
      fireEvent.keyDown(dialog, { key: "Tab" })
      await expect(within(document.body).getByRole("dialog")).toBeInTheDocument()
    } finally {
      Element.prototype.querySelectorAll = originalQsa
      const openDialog = within(document.body).queryByRole("dialog")
      if (openDialog) {
        fireEvent.keyDown(openDialog, { key: "Escape" })
      }
    }
  },
}
