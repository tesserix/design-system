import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { Kanban } from "./kanban"

const baseColumns = [
  { id: "todo", title: "To Do", cards: [{ id: "1", title: "Task" }] },
  { id: "doing", title: "In Progress", cards: [] },
  { id: "done", title: "Done", cards: [] },
]

describe("Kanban", () => {
  it("renders columns", () => {
    render(<Kanban columns={baseColumns} />)
    expect(screen.getByText("To Do")).toBeInTheDocument()
    expect(screen.getByText("In Progress")).toBeInTheDocument()
  })

  it("moves card to next column and emits onColumnsChange", () => {
    const onColumnsChange = vi.fn()
    render(<Kanban columns={baseColumns} onColumnsChange={onColumnsChange} />)

    fireEvent.click(screen.getAllByRole("button", { name: "Right" })[0])

    expect(onColumnsChange).toHaveBeenCalledTimes(1)
    const next = onColumnsChange.mock.calls[0][0]
    expect(next[0].cards).toHaveLength(0)
    expect(next[1].cards).toHaveLength(1)
  })

  it("does not move left from first column", () => {
    const onColumnsChange = vi.fn()
    render(<Kanban columns={baseColumns} onColumnsChange={onColumnsChange} />)

    fireEvent.click(screen.getAllByRole("button", { name: "Left" })[0])
    expect(onColumnsChange).not.toHaveBeenCalled()
  })

  it("does not move right from last column", () => {
    const onColumnsChange = vi.fn()
    render(
      <Kanban
        columns={[
          { id: "todo", title: "To Do", cards: [] },
          { id: "doing", title: "In Progress", cards: [] },
          { id: "done", title: "Done", cards: [{ id: "x", title: "Last" }] },
        ]}
        onColumnsChange={onColumnsChange}
      />
    )

    fireEvent.click(screen.getByRole("button", { name: "Right" }))
    expect(onColumnsChange).not.toHaveBeenCalled()
  })

  it("handles empty card slots safely", () => {
    const onColumnsChange = vi.fn()
    render(
      <Kanban
        columns={[
          { id: "todo", title: "To Do", cards: [] },
          { id: "doing", title: "Doing", cards: [] },
        ]}
        onColumnsChange={onColumnsChange}
      />
    )

    expect(screen.queryByRole("button", { name: "Right" })).not.toBeInTheDocument()
    expect(onColumnsChange).not.toHaveBeenCalled()
  })
})
