import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./dropdown-menu"

describe("DropdownMenu", () => {
  it("opens and closes with click interactions", async () => {
    const user = userEvent.setup()

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Profile</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>
            Delete
            <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    const trigger = screen.getByRole("button", { name: "Actions" })
    await user.click(trigger)
    const menu = screen.getByRole("menu")
    expect(trigger).toHaveAttribute("aria-expanded", "true")
    expect(menu).toBeInTheDocument()
    expect(screen.getByText("⌘D")).toBeInTheDocument()

    await user.click(screen.getByRole("menuitem", { name: "Edit" }))
    expect(screen.queryByRole("menu")).not.toBeInTheDocument()
  })

  it("handles keyboard navigation and escape dismissal", async () => {
    const user = userEvent.setup()

    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem disabled>Disabled</DropdownMenuItem>
          <DropdownMenuItem>First</DropdownMenuItem>
          <DropdownMenuItem>Second</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    const menu = screen.getByRole("menu")
    const first = screen.getByRole("menuitem", { name: "First" })
    const second = screen.getByRole("menuitem", { name: "Second" })
    expect(first).toHaveFocus()

    fireEvent.keyDown(menu, { key: "ArrowDown" })
    expect(second).toHaveFocus()

    fireEvent.keyDown(menu, { key: "ArrowUp" })
    expect(first).toHaveFocus()

    fireEvent.keyDown(menu, { key: "End" })
    expect(second).toHaveFocus()

    fireEvent.keyDown(menu, { key: "Home" })
    expect(first).toHaveFocus()

    fireEvent.keyDown(menu, { key: "Escape" })
    expect(screen.queryByRole("menu")).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Open" })).toHaveFocus()

    await user.keyboard("{Enter}")
  })

  it("opens from trigger keyboard and closes on outside click/tab", async () => {
    const user = userEvent.setup()

    render(
      <div>
        <button type="button">Outside</button>
        <DropdownMenu>
          <DropdownMenuTrigger>Keyboard Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>One</DropdownMenuItem>
            <DropdownMenuItem>Two</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )

    const trigger = screen.getByRole("button", { name: "Keyboard Open" })
    trigger.focus()
    fireEvent.keyDown(trigger, { key: "ArrowDown" })
    expect(screen.getByRole("menu")).toBeInTheDocument()
    expect(screen.getByRole("menuitem", { name: "One" })).toHaveFocus()

    fireEvent.keyDown(screen.getByRole("menu"), { key: "Tab" })
    expect(screen.queryByRole("menu")).not.toBeInTheDocument()

    await user.click(trigger)
    const menu = screen.getByRole("menu")
    fireEvent.mouseDown(screen.getByRole("button", { name: "Outside" }))
    expect(menu).not.toBeInTheDocument()
  })

  it("throws when primitives are used outside DropdownMenu", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() => render(<DropdownMenuTrigger>Orphan</DropdownMenuTrigger>)).toThrow(
      "DropdownMenu components must be used within DropdownMenu"
    )
    expect(() => render(<DropdownMenuItem>Orphan Item</DropdownMenuItem>)).toThrow(
      "DropdownMenu components must be used within DropdownMenu"
    )
    consoleError.mockRestore()
  })
})
