import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { Tree } from "./tree"

const data = [
  {
    id: "1",
    label: "Root",
    children: [
      { id: "1-1", label: "Child" },
      { id: "1-2", label: "Disabled Child", disabled: true },
    ],
  },
]

describe("Tree", () => {
  it("renders root node", () => {
    render(<Tree data={[{ id: "1", label: "Root" }]} />)
    expect(screen.getByText("Root")).toBeInTheDocument()
  })

  it("calls onSelect when a node is clicked", () => {
    const onSelect = vi.fn()
    render(<Tree data={[{ id: "1", label: "Root" }]} onSelect={onSelect} />)
    fireEvent.click(screen.getByRole("button", { name: "Root" }))
    expect(onSelect).toHaveBeenCalledWith("1")
  })

  it("expands and collapses children", () => {
    render(<Tree data={data} />)

    expect(screen.queryByRole("button", { name: "Child" })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Expand" }))
    expect(screen.getByRole("button", { name: "Child" })).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Collapse" }))
    expect(screen.queryByRole("button", { name: "Child" })).not.toBeInTheDocument()
  })

  it("supports selectedId and disabled nodes", () => {
    const onSelect = vi.fn()
    render(<Tree data={data} defaultExpandedIds={["1"]} selectedId="1-1" onSelect={onSelect} />)

    const selectedNode = screen.getByRole("button", { name: "Child" })
    const disabledNode = screen.getByRole("button", { name: "Disabled Child" })

    expect(selectedNode.className).toContain("bg-accent")
    expect(disabledNode).toBeDisabled()

    fireEvent.click(disabledNode)
    expect(onSelect).not.toHaveBeenCalledWith("1-2")
  })
})
