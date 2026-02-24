import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { Transfer } from "./transfer"

describe("Transfer", () => {
  it("renders source items", () => {
    render(<Transfer sourceItems={[{ id: "1", label: "Item" }]} />)
    expect(screen.getByText("Item")).toBeInTheDocument()
  })

  it("moves item to target and triggers onItemsChange", () => {
    const onItemsChange = vi.fn()
    render(<Transfer sourceItems={[{ id: "1", label: "Item" }]} onItemsChange={onItemsChange} />)

    fireEvent.click(screen.getByRole("button", { name: "Item" }))
    fireEvent.click(screen.getByRole("button", { name: ">" }))

    expect(onItemsChange).toHaveBeenCalledTimes(1)
    expect(onItemsChange).toHaveBeenCalledWith({
      sourceItems: [],
      targetItems: [{ id: "1", label: "Item" }],
    })
  })

  it("moves selected target items back to source", () => {
    const onItemsChange = vi.fn()
    render(
      <Transfer
        sourceItems={[{ id: "1", label: "Item" }]}
        targetItems={[{ id: "9", label: "Target" }]}
        onItemsChange={onItemsChange}
      />
    )

    fireEvent.click(screen.getByRole("button", { name: "Target" }))
    fireEvent.click(screen.getByRole("button", { name: "<" }))

    expect(onItemsChange).toHaveBeenCalledWith({
      sourceItems: [{ id: "1", label: "Item" }, { id: "9", label: "Target" }],
      targetItems: [],
    })
  })
})
