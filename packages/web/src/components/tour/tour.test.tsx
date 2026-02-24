import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { Tour } from "./tour"

describe("Tour", () => {
  it("renders step content", () => {
    render(
      <Tour
        open
        onOpenChange={() => {}}
        steps={[{ id: "1", title: "Welcome", description: "Desc" }]}
      />
    )

    expect(screen.getByText("Welcome")).toBeInTheDocument()
  })

  it("closes when finish is clicked on last step", () => {
    const onOpenChange = vi.fn()
    render(
      <Tour
        open
        onOpenChange={onOpenChange}
        steps={[{ id: "1", title: "Welcome", description: "Desc" }]}
      />
    )

    fireEvent.click(screen.getByRole("button", { name: "Finish" }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it("supports step navigation", () => {
    render(
      <Tour
        open
        onOpenChange={() => {}}
        steps={[
          { id: "1", title: "Welcome", description: "Desc" },
          { id: "2", title: "Next Step", description: "More" },
        ]}
      />
    )

    fireEvent.click(screen.getByRole("button", { name: "Next" }))
    expect(screen.getByText("Next Step")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Back" }))
    expect(screen.getByText("Welcome")).toBeInTheDocument()
  })

  it("closes when backdrop is clicked", () => {
    const onOpenChange = vi.fn()
    const { container } = render(
      <Tour
        open
        onOpenChange={onOpenChange}
        steps={[{ id: "1", title: "Welcome", description: "Desc" }]}
      />
    )

    const backdrop = container.querySelector(".absolute.inset-0.bg-black\\/45")
    expect(backdrop).toBeTruthy()
    if (backdrop) {
      fireEvent.click(backdrop)
    }

    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it("returns null when closed or no steps", () => {
    const { rerender } = render(<Tour open={false} onOpenChange={() => {}} steps={[{ id: "1", title: "A", description: "B" }]} />)
    expect(screen.queryByText("A")).not.toBeInTheDocument()

    rerender(<Tour open onOpenChange={() => {}} steps={[]} />)
    expect(screen.queryByRole("button", { name: /next|finish/i })).not.toBeInTheDocument()
  })
})
