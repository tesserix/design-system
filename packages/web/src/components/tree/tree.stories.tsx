import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { expect, userEvent, waitFor, within } from "storybook/test"

import { Tree } from "./tree"

const data = [
  {
    id: "1",
    label: "src",
    children: [
      { id: "1-1", label: "components" },
      { id: "1-2", label: "hooks", disabled: true },
    ],
  },
]

const meta = {
  title: "Data Display/Tree",
  component: Tree,
  tags: ["autodocs"],
  args: { data },
} satisfies Meta<typeof Tree>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ExpandedByDefault: Story = {
  args: {
    data,
    defaultExpandedIds: ["1"],
  },
}

export const ControlledSelection: Story = {
  render: () => {
    const [selectedId, setSelectedId] = React.useState<string | undefined>("1-1")
    return (
      <div className="w-80 space-y-2">
        <Tree data={data} defaultExpandedIds={["1"]} selectedId={selectedId} onSelect={setSelectedId} />
        <p className="text-xs text-muted-foreground">Selected: {selectedId}</p>
      </div>
    )
  },
}

export const ExpandAndSelect: Story = {
  render: ControlledSelection.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Collapse" }))
    await userEvent.click(canvas.getByRole("button", { name: "Expand" }))
    await userEvent.click(canvas.getByRole("button", { name: "components" }))
    await waitFor(() => {
      expect(canvas.getByText(/Selected: 1-1/i)).toBeInTheDocument()
    })
    expect(canvas.getByRole("button", { name: "hooks" })).toBeDisabled()
  },
}
