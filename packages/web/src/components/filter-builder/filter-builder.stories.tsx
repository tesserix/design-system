import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"

import { FilterBuilder } from "./filter-builder"

const meta = {
  title: "Patterns/FilterBuilder",
  component: FilterBuilder,
  tags: ["autodocs"],
  args: {
    fields: [
      { id: "status", label: "Status", type: "select", options: [{ label: "Active", value: "active" }] },
      { id: "owner", label: "Owner" },
      { id: "score", label: "Score", type: "number" },
    ],
  },
} satisfies Meta<typeof FilterBuilder>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SmokeTest: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Add Rule" }))
    await expect(canvas.getByLabelText("Field")).toBeInTheDocument()
  },
}
