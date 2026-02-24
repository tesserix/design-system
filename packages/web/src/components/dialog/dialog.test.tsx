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
