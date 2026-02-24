import type { Meta, StoryObj } from "@storybook/react"
import { expect } from "storybook/test"

import { DateRangePicker } from "./date-range-picker"

const meta = {
  title: "Input/DateRangePicker",
  component: DateRangePicker,
  tags: ["autodocs"],
} satisfies Meta<typeof DateRangePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithDefaultRange: Story = {
  args: {
    defaultValue: {
      start: "2026-02-01",
      end: "2026-02-14",
    },
  },
}

export const SmokeTest: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy()
  },
}
