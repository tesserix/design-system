import type { Meta, StoryObj } from "@storybook/react"
import { expect } from "storybook/test"

import { Kbd } from "./kbd"

const meta = {
  title: "Feedback/Kbd",
  component: Kbd,
  tags: ["autodocs"],
} satisfies Meta<typeof Kbd>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <p className="text-sm text-foreground">
      Press <Kbd>⌘</Kbd> + <Kbd>K</Kbd> to open command palette
    </p>
  ),
}

export const SmokeTest: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy()
  },
}
