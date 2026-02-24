import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"

import { FilterPanel } from "./filter-panel"

const meta = {
  title: "Patterns/FilterPanel",
  component: FilterPanel,
  tags: ["autodocs"],
  args: {
    sections: [
      {
        id: "status",
        label: "Status",
        options: [
          { id: "active", label: "Active" },
          { id: "draft", label: "Draft" },
        ],
      },
    ],
  },
} satisfies Meta<typeof FilterPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SmokeTest: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByLabelText("Active"))
    await userEvent.click(canvas.getByRole("button", { name: "Apply" }))
    await expect(canvas.getByRole("button", { name: "Reset" })).toBeTruthy()
  },
}
