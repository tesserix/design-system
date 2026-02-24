import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { SplitButton } from "./split-button"

describe("SplitButton", () => {
  it("renders primary action", () => {
    render(
      <SplitButton
        primaryLabel="Publish"
        options={[{ id: "schedule", label: "Schedule" }]}
      />
    )

    expect(screen.getByRole("button", { name: "Publish" })).toBeInTheDocument()
  })

  it("calls onOptionSelect when an option is clicked", () => {
    const onOptionSelect = vi.fn()
    render(
      <SplitButton
        primaryLabel="Publish"
        options={[{ id: "schedule", label: "Schedule" }]}
        onOptionSelect={onOptionSelect}
      />
    )

    fireEvent.click(screen.getByRole("button", { name: "Open actions" }))
    fireEvent.click(screen.getByRole("menuitem", { name: "Schedule" }))

    expect(onOptionSelect).toHaveBeenCalledWith("schedule")
  })

  it("does not trigger callbacks for disabled options", () => {
    const onOptionSelect = vi.fn()
    render(
      <SplitButton
        primaryLabel="Publish"
        options={[{ id: "archive", label: "Archive", disabled: true }]}
        onOptionSelect={onOptionSelect}
      />
    )

    fireEvent.click(screen.getByRole("button", { name: "Open actions" }))
    fireEvent.click(screen.getByRole("menuitem", { name: "Archive" }))

    expect(onOptionSelect).not.toHaveBeenCalled()
  })
})
