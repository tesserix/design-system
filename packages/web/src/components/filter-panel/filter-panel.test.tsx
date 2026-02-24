import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { FilterPanel } from "./filter-panel"

describe("FilterPanel", () => {
  it("supports uncontrolled mode without re-render loop", () => {
    const onApply = vi.fn()
    render(
      <FilterPanel
        onApply={onApply}
        sections={[{ id: "s", label: "Status", options: [{ id: "a", label: "Active" }] }]}
      />
    )

    fireEvent.click(screen.getByRole("button", { name: "Apply" }))
    expect(onApply).toHaveBeenCalledWith({})
  })

  it("renders options", () => {
    render(
      <FilterPanel sections={[{ id: "s", label: "Status", options: [{ id: "a", label: "Active" }] }]} />
    )
    expect(screen.getByText("Active")).toBeInTheDocument()
  })

  it("calls onApply with selected options", () => {
    const onApply = vi.fn()
    render(
      <FilterPanel
        onApply={onApply}
        sections={[{ id: "s", label: "Status", options: [{ id: "a", label: "Active" }] }]}
      />
    )

    fireEvent.click(screen.getByLabelText("Active"))
    fireEvent.click(screen.getByRole("button", { name: "Apply" }))
    expect(onApply).toHaveBeenCalledWith({ s: ["a"] })
  })
})
