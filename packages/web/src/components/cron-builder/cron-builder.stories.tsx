import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"

import { CronBuilder } from "./cron-builder"

const meta = {
  title: "Patterns/CronBuilder",
  component: CronBuilder,
  tags: ["autodocs"],
} satisfies Meta<typeof CronBuilder>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Weekly: Story = {
  args: {
    value: {
      frequency: "weekly",
      interval: 1,
      hour: 10,
      minute: 30,
      days: ["MON", "WED"],
    },
  },
}

export const SmokeTest: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.selectOptions(canvas.getByLabelText("Frequency"), "weekly")
    await expect(canvas.getByText(/\* \* [0-6,]+/)).toBeInTheDocument()
  },
}
