import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer"

describe("Drawer", () => {
  it("opens, traps focus, and closes with escape", async () => {
    const user = userEvent.setup()

    render(
      <Drawer>
        <DrawerTrigger>Open Drawer</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Drawer Title</DrawerTitle>
            <DrawerDescription>Drawer Description</DrawerDescription>
          </DrawerHeader>
          <button type="button">First action</button>
          <button type="button">Last action</button>
        </DrawerContent>
      </Drawer>
    )

    const trigger = screen.getByRole("button", { name: "Open Drawer" })
    await user.click(trigger)

    const dialog = screen.getByRole("dialog")
    const title = screen.getByText("Drawer Title")
    const description = screen.getByText("Drawer Description")
    expect(dialog).toHaveAttribute("aria-labelledby", title.getAttribute("id") ?? "")
    expect(dialog).toHaveAttribute("aria-describedby", description.getAttribute("id") ?? "")
    expect(document.body.style.overflow).toBe("hidden")
    expect(screen.getByRole("button", { name: "First action" })).toHaveFocus()

    const closeButton = screen.getByRole("button", { name: "Close" })
    closeButton.focus()
    fireEvent.keyDown(dialog, { key: "Tab" })
    expect(screen.getByRole("button", { name: "First action" })).toHaveFocus()

    fireEvent.keyDown(dialog, { key: "Escape" })
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    expect(document.body.style.overflow).toBe("")
    expect(trigger).toHaveFocus()
  })

  it("supports side variants and closes via overlay and close button", async () => {
    const user = userEvent.setup()

    render(
      <Drawer defaultOpen>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent side="left">
          <DrawerHeader>
            <DrawerTitle>Left Drawer</DrawerTitle>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose asChild>
              <button type="button">Cancel</button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )

    const dialog = screen.getByRole("dialog")
    expect(dialog.className).toContain("left-0")
    expect(dialog.className).toContain("max-w-sm")

    const overlay = document.body.querySelector("div.backdrop-blur-sm")
    expect(overlay).toBeTruthy()
    fireEvent.mouseDown(overlay as Element)
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Open" }))
    await user.click(screen.getByRole("button", { name: "Cancel" }))
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("supports controlled mode and trigger asChild", async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()

    render(
      <Drawer open={false} onOpenChange={onOpenChange}>
        <DrawerTrigger asChild>
          <button type="button">Launch</button>
        </DrawerTrigger>
      </Drawer>
    )

    await user.click(screen.getByRole("button", { name: "Launch" }))
    expect(onOpenChange).toHaveBeenCalledWith(true)
  })

  it("handles tab with no focusable elements and shift+tab wrapping", async () => {
    const user = userEvent.setup()
    render(
      <Drawer defaultOpen>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Only Title</DrawerTitle>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    )

    const dialog = screen.getByRole("dialog")
    dialog.focus()
    fireEvent.keyDown(dialog, { key: "Tab" })
    expect(dialog).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Open" }))
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Tab", shiftKey: true })
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument()
  })

  it("renders other side variants", () => {
    const { rerender } = render(
      <Drawer defaultOpen>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent side="right">Body</DrawerContent>
      </Drawer>
    )

    expect(screen.getByRole("dialog").className).toContain("right-0")

    rerender(
      <Drawer defaultOpen>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent side="top">Body</DrawerContent>
      </Drawer>
    )
    expect(screen.getByRole("dialog").className).toContain("top-0")

    rerender(
      <Drawer defaultOpen>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent side="bottom">Body</DrawerContent>
      </Drawer>
    )
    expect(screen.getByRole("dialog").className).toContain("bottom-0")
  })

  it("throws when used outside Drawer context", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() => render(<DrawerTrigger>Orphan trigger</DrawerTrigger>)).toThrow(
      "Drawer components must be used within Drawer"
    )
    consoleError.mockRestore()
  })
})
