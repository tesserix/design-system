import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"

import { SplitButton } from "./split-button"

const meta = {
  title: "Patterns/SplitButton",
  component: SplitButton,
  tags: ["autodocs"],
  args: {
    primaryLabel: "Create",
    options: [
      { id: "new-draft", label: "New Draft" },
      { id: "new-template", label: "From Template" },
    ],
  },
} satisfies Meta<typeof SplitButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SmokeTest: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Open actions" }))
    await expect(canvas.getByRole("menuitem", { name: "New Draft" })).toBeVisible()
  },
}
