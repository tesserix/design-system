import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"

import { NotificationCenter } from "./notification-center"

const items = [
  { id: "1", title: "New order", description: "Order #1234", time: "2m ago", read: false },
  { id: "2", title: "Deployment done", time: "1h ago", read: true },
]

const meta = {
  title: "Patterns/NotificationCenter",
  component: NotificationCenter,
  tags: ["autodocs"],
  args: { items },
} satisfies Meta<typeof NotificationCenter>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SmokeTest: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Mark all read" }))
    await expect(canvas.getByText("New order")).toBeTruthy()
  },
}
