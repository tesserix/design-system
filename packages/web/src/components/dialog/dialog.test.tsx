import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog"

describe("Dialog", () => {
  it("opens and closes with keyboard, preserving accessibility links", async () => {
    const user = userEvent.setup()

    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent variant="glass" size="lg">
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
          </DialogHeader>
          <button type="button">First</button>
          <button type="button">Last</button>
          <DialogFooter>
            <DialogClose asChild>
              <button type="button">Cancel</button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )

    const trigger = screen.getByRole("button", { name: "Open Dialog" })
    await user.click(trigger)

    const dialog = screen.getByRole("dialog")
    const title = screen.getByText("Dialog Title")
    const description = screen.getByText("Dialog Description")
    expect(dialog.className).toContain("max-w-2xl")
    expect(dialog.className).toContain("backdrop-blur-md")
    expect(dialog).toHaveAttribute("aria-labelledby", title.getAttribute("id") ?? "")
    expect(dialog).toHaveAttribute("aria-describedby", description.getAttribute("id") ?? "")
    expect(document.body.style.overflow).toBe("hidden")
    expect(screen.getByRole("button", { name: "First" })).toHaveFocus()

    const closeButton = screen.getByRole("button", { name: "Cancel" })
    closeButton.focus()
    fireEvent.keyDown(dialog, { key: "Tab" })
    expect(screen.getByRole("button", { name: "First" })).toHaveFocus()

    fireEvent.keyDown(dialog, { key: "Escape" })
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
    expect(document.body.style.overflow).toBe("")
  })

  it("closes on overlay and close action", async () => {
    const user = userEvent.setup()

    render(
      <Dialog defaultOpen>
        <DialogTrigger>Trigger</DialogTrigger>
        <DialogContent>
          <DialogTitle>Open</DialogTitle>
          <DialogClose />
        </DialogContent>
      </Dialog>
    )

    const overlay = document.body.querySelector("div.backdrop-blur-sm")
    expect(overlay).toBeTruthy()
    fireEvent.mouseDown(overlay as Element)
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Trigger" }))
    await user.click(screen.getByRole("button", { name: "Close" }))
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("supports controlled mode callback and context guard", async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})

    render(
      <Dialog open={false} onOpenChange={onOpenChange}>
        <DialogTrigger>Open Controlled</DialogTrigger>
      </Dialog>
    )

    await user.click(screen.getByRole("button", { name: "Open Controlled" }))
    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()

    expect(() => render(<DialogContent>orphan</DialogContent>)).toThrow(
      "Dialog components must be used within Dialog"
    )
    consoleError.mockRestore()
  })
})

describe("Dialog — dismissal and background inertness", () => {
  const openDialog = (props: Record<string, unknown> = {}) =>
    render(
      <div>
        <button type="button">Outside</button>
        <Dialog defaultOpen>
          <DialogContent {...props}>
            <DialogHeader>
              <DialogTitle>Delete</DialogTitle>
              <DialogDescription>This cannot be undone.</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    )

  const overlay = () => document.body.querySelector("div.backdrop-blur-sm") as Element

  // The default is unchanged: a plain Dialog stays dismissable, so nothing
  // that exists today changes behaviour.
  it("closes on outside click by default", () => {
    openDialog()
    fireEvent.mouseDown(overlay())
    expect(screen.queryByText("Delete")).not.toBeInTheDocument()
  })

  // For a destructive confirmation a stray click on the overlay should not
  // silently abandon the flow — and worse, the operator cannot tell whether
  // they cancelled or mis-clicked.
  it("stays open on outside click when dismissal is disabled", () => {
    openDialog({ dismissOnOutsideClick: false })
    fireEvent.mouseDown(overlay())
    expect(screen.getByText("Delete")).toBeInTheDocument()
  })

  // Modality otherwise rests on aria-modal="true" alone. That is the ARIA
  // contract, but screen-reader support for it is uneven.
  it("marks background siblings inert while open, and restores them", () => {
    // The render container, not the button's parent: the portal mounts the
    // dialog as its own child of document.body, so the container is the
    // sibling that has to become inert.
    const { unmount, container } = openDialog({ inertBackground: true })

    expect(container.hasAttribute("inert")).toBe(true)
    // The dialog's own portal nodes must never be inerted — that would make
    // the dialog unusable, which is the one failure this cannot have.
    expect(overlay().hasAttribute("inert")).toBe(false)

    unmount()
    expect(container.hasAttribute("inert")).toBe(false)
  })

  it("leaves the background alone unless asked", () => {
    const { container } = openDialog()
    expect(container.hasAttribute("inert")).toBe(false)
  })
})
