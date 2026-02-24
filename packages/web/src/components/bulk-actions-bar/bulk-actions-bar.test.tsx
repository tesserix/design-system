import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { BulkActionsBar } from "./bulk-actions-bar"

describe("BulkActionsBar", () => {
  it("renders nothing when no selection", () => {
    const { container } = render(
      <BulkActionsBar selectedCount={0} actions={[{ id: "archive", label: "Archive" }]} />
    )

    expect(container).toBeEmptyDOMElement()
  })

  it("calls onAction", () => {
    const onAction = vi.fn()
    render(
      <BulkActionsBar
        selectedCount={2}
        actions={[{ id: "archive", label: "Archive" }]}
        onAction={onAction}
      />
    )

    fireEvent.click(screen.getByRole("button", { name: "Archive" }))
    expect(onAction).toHaveBeenCalledWith("archive")
  })

  it("calls onClearSelection", () => {
    const onClearSelection = vi.fn()
    render(
      <BulkActionsBar
        selectedCount={2}
        actions={[{ id: "archive", label: "Archive" }]}
        onClearSelection={onClearSelection}
      />
    )

    fireEvent.click(screen.getByRole("button", { name: "Clear" }))
    expect(onClearSelection).toHaveBeenCalledTimes(1)
  })
})
