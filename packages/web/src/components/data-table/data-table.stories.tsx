import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, fireEvent, waitFor } from "storybook/test"

import { Badge } from "../badge"
import { DataTable, type DataTableColumn } from "./data-table"

interface ProjectRow {
  name: string
  owner: string
  status: "Active" | "Paused" | "Archived"
  tasks: number
}

const rows: ProjectRow[] = [
  { name: "Onboarding Revamp", owner: "Anya", status: "Active", tasks: 18 },
  { name: "Q3 Analytics", owner: "Dev", status: "Paused", tasks: 9 },
  { name: "Design Tokens", owner: "Mina", status: "Active", tasks: 26 },
  { name: "Legacy Migration", owner: "Ravi", status: "Archived", tasks: 4 },
  { name: "Billing V2", owner: "Sara", status: "Active", tasks: 14 },
  { name: "Release Automation", owner: "Leo", status: "Paused", tasks: 11 },
]

const equalTaskRows: ProjectRow[] = [
  { name: "Alpha", owner: "Anya", status: "Active", tasks: 10 },
  { name: "Beta", owner: "Dev", status: "Paused", tasks: 10 },
  { name: "Gamma", owner: "Mina", status: "Active", tasks: 8 },
]

const columns: DataTableColumn<ProjectRow>[] = [
  { id: "name", header: "Project", accessor: "name", sortable: true },
  { id: "owner", header: "Owner", accessor: "owner", sortable: true },
  {
    id: "status",
    header: "Status",
    accessor: "status",
    sortable: true,
    render: (row) => (
      <Badge
        variant={
          row.status === "Active"
            ? "success"
            : row.status === "Paused"
              ? "warning"
              : "secondary"
        }
      >
        {row.status}
      </Badge>
    ),
  },
  { id: "tasks", header: "Tasks", accessor: "tasks", sortable: true, className: "text-right" },
]

const meta = {
  title: "DataDisplay/DataTable",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Feature-rich data table with search, sort, pagination, optional column filters, and row selection workflows.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="mx-auto w-full max-w-6xl rounded-3xl border bg-card p-6 shadow-lg md:p-8">
        <div className="mb-6 space-y-1">
          <p className="text-sm font-medium text-primary">Data Display</p>
          <h2 className="text-2xl font-bold tracking-tight text-card-foreground">DataTable Showcase</h2>
          <p className="text-sm text-muted-foreground">
            Sortable and filterable table for operational datasets.
          </p>
        </div>
        <DataTable columns={columns} data={rows} defaultPageSize={5} />
      </div>
    </div>
  ),
}

export const FilterAndSort: Story = {
  render: () => <DataTable columns={columns} data={rows} defaultPageSize={5} />,
  play: async ({ canvas }) => {
    const search = canvas.getByRole("searchbox")
    fireEvent.change(search, { target: { value: "analytics" } })
    await expect(canvas.getByText(/q3 analytics/i)).toBeInTheDocument()
    await expect(canvas.getByText(/showing 1 of 1 row\(s\)/i)).toBeInTheDocument()

    fireEvent.change(search, { target: { value: "" } })
    const tasksHeader = canvas.getByRole("button", { name: /tasks/i })
    fireEvent.click(tasksHeader)

    await waitFor(() => {
      expect(tasksHeader).toHaveTextContent("▲")
    })
    await expect(canvas.getByText(/legacy migration/i)).toBeInTheDocument()
  },
  parameters: {
    docs: {
      description: {
        story: "Validates global filtering and sortable headers with direction indicator updates.",
      },
    },
  },
}

export const FiltersAndSelection: Story = {
  render: () => (
    <DataTable
      columns={columns}
      data={rows}
      defaultPageSize={5}
      enableRowSelection
      columnFiltersEnabled
      getRowId={(row) => row.name}
    />
  ),
  play: async ({ canvas }) => {
    const ownerFilter = canvas.getByPlaceholderText(/filter owner/i)
    fireEvent.change(ownerFilter, { target: { value: "anya" } })

    await expect(canvas.getByText(/onboarding revamp/i)).toBeInTheDocument()
    await expect(canvas.getByText(/showing 1 of 1 row\(s\) • 0 selected/i)).toBeInTheDocument()

    const selectRow = canvas.getByRole("checkbox", { name: /select row 1/i })
    fireEvent.click(selectRow)
    await expect(canvas.getByText(/• 1 selected/i)).toBeInTheDocument()
  },
}

export const KeyboardAndA11y: Story = {
  render: () => (
    <DataTable
      columns={columns}
      data={rows}
      defaultPageSize={5}
      enableRowSelection
      columnFiltersEnabled
      getRowId={(row) => row.name}
    />
  ),
  play: async ({ canvas }) => {
    const search = canvas.getByRole("searchbox")
    await expect(search).toHaveAttribute("placeholder", "Search rows...")

    fireEvent.change(search, { target: { value: "billing" } })
    await expect(canvas.getByText(/billing v2/i)).toBeInTheDocument()

    const selectAll = canvas.getByRole("checkbox", { name: /select all rows/i })
    fireEvent.click(selectAll)
    await expect(canvas.getByText(/• 1 selected/i)).toBeInTheDocument()

    const ownerHeader = canvas.getByRole("button", { name: /owner/i })
    fireEvent.click(ownerHeader)
    await expect(ownerHeader).toHaveTextContent(/owner/i)
  },
}

export const EmptyState: Story = {
  render: () => <DataTable columns={columns} data={[]} emptyMessage="No projects available." defaultPageSize={5} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/no projects available\./i)).toBeInTheDocument()
    await expect(canvas.getByText(/showing 0 of 0 row\(s\)/i)).toBeInTheDocument()
  },
}

export const PaginationAndSelectionToggle: Story = {
  render: () => (
    <DataTable
      columns={columns}
      data={rows}
      defaultPageSize={2}
      enableRowSelection
      getRowId={(row) => row.name}
    />
  ),
  play: async ({ canvas }) => {
    const next = canvas.getByRole("button", { name: /next/i })
    const previous = canvas.getByRole("button", { name: /previous/i })

    await expect(previous).toBeDisabled()
    await expect(canvas.getByText(/page 1 of 3/i)).toBeInTheDocument()

    const rowOne = canvas.getByRole("checkbox", { name: /select row 1/i })
    fireEvent.click(rowOne)
    await expect(canvas.getByText(/• 1 selected/i)).toBeInTheDocument()

    fireEvent.click(rowOne)
    await expect(canvas.getByText(/• 0 selected/i)).toBeInTheDocument()

    fireEvent.click(next)
    await waitFor(() => {
      expect(canvas.getByText(/page 2 of 3/i)).toBeInTheDocument()
      expect(previous).not.toBeDisabled()
    })

    fireEvent.click(previous)
    await waitFor(() => {
      expect(canvas.getByText(/page 1 of 3/i)).toBeInTheDocument()
    })
  },
}

export const PageClampRowsPerPageAndSelectAll: Story = {
  render: () => (
    <DataTable
      columns={columns}
      data={rows}
      defaultPageSize={2}
      pageSizeOptions={[2, 5, 10]}
      enableRowSelection
      getRowId={(row) => row.name}
    />
  ),
  play: async ({ canvas }) => {
    const next = canvas.getByRole("button", { name: /next/i })
    const search = canvas.getByRole("searchbox")
    const rowsPerPage = canvas.getByRole("combobox", { name: /rows per page/i })
    const selectAll = canvas.getByRole("checkbox", { name: /select all rows/i })

    fireEvent.click(next)
    fireEvent.click(next)
    await waitFor(() => {
      expect(canvas.getByText(/page 3 of 3/i)).toBeInTheDocument()
    })

    fireEvent.change(search, { target: { value: "legacy" } })
    await waitFor(() => {
      expect(canvas.getByText(/page 1 of 1/i)).toBeInTheDocument()
      expect(canvas.getByText(/legacy migration/i)).toBeInTheDocument()
    })

    fireEvent.change(rowsPerPage, { target: { value: "5" } })
    fireEvent.change(search, { target: { value: "" } })
    await waitFor(() => {
      expect(canvas.getByText(/showing 5 of 6 row\(s\)/i)).toBeInTheDocument()
      expect(canvas.getByText(/page 1 of 2/i)).toBeInTheDocument()
    })

    fireEvent.click(selectAll)
    await waitFor(() => {
      expect(canvas.getByText(/• 6 selected/i)).toBeInTheDocument()
    })

    fireEvent.click(selectAll)
    await waitFor(() => {
      expect(canvas.getByText(/• 0 selected/i)).toBeInTheDocument()
    })
  },
  parameters: {
    docs: {
      description: {
        story:
          "Covers pagination clamp, rows-per-page updates, and select-all toggle (including deselection) across a changing dataset.",
      },
    },
  },
}

export const StateMatrix: Story = {
  render: () => (
    <div className="grid w-[1080px] gap-4 md:grid-cols-2">
      <div className="space-y-2 rounded-xl border bg-card p-4">
        <p className="text-sm font-medium">Default</p>
        <DataTable columns={columns} data={rows} defaultPageSize={3} />
      </div>
      <div className="space-y-2 rounded-xl border bg-card p-4">
        <p className="text-sm font-medium">Selectable + Filters</p>
        <DataTable columns={columns} data={rows} defaultPageSize={3} enableRowSelection columnFiltersEnabled />
      </div>
      <div className="space-y-2 rounded-xl border bg-card p-4 md:col-span-2">
        <p className="text-sm font-medium">Empty</p>
        <DataTable columns={columns} data={[]} emptyMessage="No projects available." defaultPageSize={3} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "State matrix for visual QA: baseline table, selectable/filterable mode, and explicit empty-state rendering.",
      },
    },
  },
}

export const SortWithEqualValues: Story = {
  render: () => <DataTable columns={columns} data={equalTaskRows} defaultPageSize={5} />,
  play: async ({ canvas }) => {
    const tasksHeader = canvas.getByRole("button", { name: /tasks/i })
    fireEvent.click(tasksHeader)

    await waitFor(() => {
      expect(tasksHeader).toHaveTextContent("▲")
      expect(canvas.getByText(/alpha/i)).toBeInTheDocument()
      expect(canvas.getByText(/beta/i)).toBeInTheDocument()
    })
  },
}

const ClampOnDataChangeDemo = () => {
  const [compact, setCompact] = React.useState(false)
  const data = compact ? rows.slice(0, 1) : rows

  return (
    <div className="space-y-3">
      <button
        type="button"
        className="rounded-md border px-3 py-1.5 text-sm"
        onClick={() => setCompact(true)}
      >
        Shrink data
      </button>
      <DataTable columns={columns} data={data} defaultPageSize={2} />
    </div>
  )
}

export const ClampOnExternalDataChange: Story = {
  render: () => <ClampOnDataChangeDemo />,
  play: async ({ canvas }) => {
    const next = canvas.getByRole("button", { name: /next/i })
    fireEvent.click(next)
    fireEvent.click(next)
    await waitFor(() => {
      expect(canvas.getByText(/page 3 of 3/i)).toBeInTheDocument()
    })

    fireEvent.click(canvas.getByRole("button", { name: /shrink data/i }))
    await waitFor(() => {
      expect(canvas.getByText(/page 1 of 1/i)).toBeInTheDocument()
      expect(canvas.getByText(/showing 1 of 1 row\(s\)/i)).toBeInTheDocument()
    })
  },
}
