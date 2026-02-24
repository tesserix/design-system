import { describe, expect, it } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { DataTable } from "./data-table"

describe("DataTable", () => {
  const columns = [
    { id: "id", header: "ID", accessor: "id" as const },
    { id: "name", header: "Name", accessor: "name" as const },
    { id: "description", header: "Description", accessor: "description" as const },
  ]

  const rows = Array.from({ length: 120 }).map((_, index) => ({
    id: `row-${index + 1}`,
    name: `Name ${index + 1}`,
    description:
      index === 0
        ? "Very long description ".repeat(20)
        : `Description ${index + 1}`,
  }))

  it("renders and paginates large datasets", () => {
    render(<DataTable columns={columns} data={rows} defaultPageSize={10} />)

    expect(screen.getByText("row-1")).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Next" }))
    expect(screen.getByText("row-11")).toBeInTheDocument()
  })

  it("filters with long text queries", () => {
    render(<DataTable columns={columns} data={rows} defaultPageSize={10} />)

    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "Very long description" },
    })

    expect(screen.getByText(/Very long description/)).toBeInTheDocument()
    expect(screen.queryByText("row-2")).not.toBeInTheDocument()
  })
})
