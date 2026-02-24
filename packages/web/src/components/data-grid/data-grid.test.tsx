import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { DataGrid } from "./data-grid"

describe("DataGrid", () => {
  const data = [
    { id: "1", name: "Alpha", role: "Admin" },
    { id: "2", name: "Beta", role: "Editor" },
  ]

  it("toggles column visibility", () => {
    render(
      <DataGrid
        columns={[
          { id: "name", header: "Name", accessor: "name" },
          { id: "role", header: "Role", accessor: "role" },
        ]}
        data={data}
        getRowId={(row) => row.id}
      />
    )

    expect(screen.getByRole("columnheader", { name: "Role" })).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText("Toggle Role column"))
    expect(screen.queryByRole("columnheader", { name: "Role" })).not.toBeInTheDocument()
  })

  it("emits row selection updates", () => {
    const onSelectedRowIdsChange = vi.fn()
    render(
      <DataGrid
        columns={[{ id: "name", header: "Name", accessor: "name" }]}
        data={data}
        getRowId={(row) => row.id}
        onSelectedRowIdsChange={onSelectedRowIdsChange}
      />
    )

    fireEvent.click(screen.getByLabelText("Select row 1"))
    expect(onSelectedRowIdsChange).toHaveBeenCalledWith(["1"])
  })

  it("commits editable cell changes", () => {
    const onDataChange = vi.fn()
    render(
      <DataGrid
        columns={[
          { id: "name", header: "Name", accessor: "name", editable: true },
          { id: "role", header: "Role", accessor: "role" },
        ]}
        data={data}
        getRowId={(row) => row.id}
        onDataChange={onDataChange}
      />
    )

    fireEvent.doubleClick(screen.getByText("Alpha"))
    const input = screen.getByDisplayValue("Alpha")
    fireEvent.change(input, { target: { value: "Alpha Updated" } })
    fireEvent.keyDown(input, { key: "Enter" })

    expect(onDataChange).toHaveBeenCalled()
    const latest = onDataChange.mock.calls[onDataChange.mock.calls.length - 1]?.[0]
    expect(latest[0].name).toBe("Alpha Updated")
  })

  it("renders long text rows and supports full selection", () => {
    const largeData = Array.from({ length: 80 }).map((_, index) => ({
      id: String(index + 1),
      name: `Name ${index + 1}`,
      notes: index === 0 ? "Long note ".repeat(25) : `Notes ${index + 1}`,
    }))

    render(
      <DataGrid
        columns={[
          { id: "name", header: "Name", accessor: "name" },
          { id: "notes", header: "Notes", accessor: "notes" },
        ]}
        data={largeData}
        getRowId={(row) => row.id}
      />
    )

    expect(screen.getByText(/Long note/)).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText("Select all rows"))
    expect(screen.getByLabelText("Select row 80")).toBeChecked()
  })
})
