import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"

import { BulkActionsBar } from "./bulk-actions-bar"

const meta = {
  title: "Patterns/BulkActionsBar",
  component: BulkActionsBar,
  tags: ["autodocs"],
  args: {
    selectedCount: 3,
    actions: [
      { id: "archive", label: "Archive" },
      { id: "delete", label: "Delete", dangerous: true },
    ],
  },
} satisfies Meta<typeof BulkActionsBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SmokeTest: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Archive" }))
    await expect(canvas.getByText(/selected/i)).toBeInTheDocument()
  },
}
