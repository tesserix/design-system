import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { CommandPalette } from "./command-palette"

describe("CommandPalette", () => {
  it("renders dialog when open", () => {
    render(<CommandPalette open onOpenChange={() => {}} items={[{ id: "1", label: "Open Dashboard" }]} />)

    expect(screen.getByRole("dialog")).toBeInTheDocument()
  })

  it("reports the query so a caller can drive server-side search (#10)", () => {
    const onQueryChange = vi.fn()
    render(
      <CommandPalette
        open
        onOpenChange={() => {}}
        onQueryChange={onQueryChange}
        items={[{ id: "1", label: "Open Dashboard" }]}
      />
    )

    fireEvent.change(screen.getByPlaceholderText("Search commands..."), { target: { value: "dash" } })
    expect(onQueryChange).toHaveBeenCalledWith("dash")
  })

  it("accepts a controlled query", () => {
    render(
      <CommandPalette
        open
        onOpenChange={() => {}}
        query="dash"
        onQueryChange={() => {}}
        items={[{ id: "1", label: "Open Dashboard" }]}
      />
    )

    expect(screen.getByPlaceholderText("Search commands...")).toHaveValue("dash")
  })

  it("keeps server-matched results when shouldFilter is false (#10)", () => {
    render(
      <CommandPalette
        open
        onOpenChange={() => {}}
        query="totally-unrelated"
        onQueryChange={() => {}}
        shouldFilter={false}
        items={[{ id: "1", label: "Open Dashboard" }]}
      />
    )

    expect(screen.getByText("Open Dashboard")).toBeInTheDocument()
  })

  it("shows a loading row instead of the empty state (#10)", () => {
    render(
      <CommandPalette
        open
        onOpenChange={() => {}}
        loading
        emptyText="No matching commands."
        items={[]}
      />
    )

    expect(screen.getByRole("status")).toBeInTheDocument()
    expect(screen.queryByText("No matching commands.")).not.toBeInTheDocument()
  })

  it("selects with the keyboard, not just the mouse (#7)", () => {
    const onSelect = vi.fn()
    const onOpenChange = vi.fn()
    render(
      <CommandPalette
        open
        onOpenChange={onOpenChange}
        items={[{ id: "1", label: "Open Dashboard", onSelect }]}
      />
    )

    const input = screen.getByPlaceholderText("Search commands...")
    fireEvent.keyDown(input, { key: "ArrowDown" })
    fireEvent.keyDown(input, { key: "Enter" })

    expect(onSelect).toHaveBeenCalled()
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
