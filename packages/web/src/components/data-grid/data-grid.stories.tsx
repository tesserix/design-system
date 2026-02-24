import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"

import { DataGrid } from "./data-grid"

const sampleData = [
  { id: "1", name: "Alpha", role: "Admin" },
  { id: "2", name: "Beta", role: "Editor" },
]

const meta = {
  title: "Data Display/DataGrid",
  component: DataGrid,
  tags: ["autodocs"],
  args: {
    columns: [
      { id: "name", header: "Name", accessor: "name", editable: true, pin: "left" },
      { id: "role", header: "Role", accessor: "role" },
    ],
    data: sampleData,
    getRowId: (row) => (row as { id: string }).id,
  },
} satisfies Meta<typeof DataGrid>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

const ControlledSelection = () => {
  const [selected, setSelected] = React.useState<string[]>([])

  return (
    <div className="space-y-2">
      <DataGrid
        columns={[
          { id: "name", header: "Name", accessor: "name" },
          { id: "role", header: "Role", accessor: "role" },
        ]}
        data={sampleData}
        getRowId={(row) => row.id}
        selectedRowIds={selected}
        onSelectedRowIdsChange={setSelected}
      />
      <p className="text-sm text-muted-foreground">Selected: {selected.join(",") || "none"}</p>
    </div>
  )
}

export const WithSelection: Story = {
  render: () => <ControlledSelection />,
}

export const SmokeTest: Story = {
  render: () => <ControlledSelection />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByLabelText("Select row 1"))
    await expect(canvas.getByText(/selected: 1/i)).toBeInTheDocument()
  },
}
